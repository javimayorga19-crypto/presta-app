import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'
import { supabase } from '@/integrations/supabase/client'
import { syncManager } from '@/lib/offline-db'

interface ExcelRow {
  codigo?: string
  nombre?: string
  fecha_credito?: string
  plazo?: string | number
  cuota?: string | number
  telefono?: string
  direccion?: string
  cedula?: string
  ruta?: string
}

interface ImportResult {
  success: number
  errors: { row: number; error: string }[]
  duplicates: number
}

export const ExcelImporter = () => {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile)
        setResult(null)
      } else {
        toast({
          title: "Archivo no válido",
          description: "Por favor selecciona un archivo Excel (.xlsx o .xls)",
          variant: "destructive"
        })
      }
    }
  }

  const parseTimeUnit = (plazo: string | number): { valor: number; unidad: 'dias' | 'semanas' | 'meses' | 'años' } => {
    if (typeof plazo === 'number') {
      return { valor: plazo, unidad: 'dias' }
    }
    
    const plazoStr = String(plazo).toLowerCase()
    
    if (plazoStr.includes('día') || plazoStr.includes('dia')) {
      const valor = parseInt(plazoStr.replace(/[^0-9]/g, ''))
      return { valor, unidad: 'dias' }
    } else if (plazoStr.includes('semana')) {
      const valor = parseInt(plazoStr.replace(/[^0-9]/g, ''))
      return { valor, unidad: 'semanas' }
    } else if (plazoStr.includes('mes')) {
      const valor = parseInt(plazoStr.replace(/[^0-9]/g, ''))
      return { valor, unidad: 'meses' }
    } else if (plazoStr.includes('año')) {
      const valor = parseInt(plazoStr.replace(/[^0-9]/g, ''))
      return { valor, unidad: 'años' }
    }
    
    const valor = parseInt(plazoStr.replace(/[^0-9]/g, ''))
    return { valor: isNaN(valor) ? 30 : valor, unidad: 'dias' }
  }

  const calculateLoanDetails = (cuota: number, plazo: { valor: number; unidad: string }) => {
    let totalDias = plazo.valor
    
    switch (plazo.unidad) {
      case 'semanas':
        totalDias = plazo.valor * 7
        break
      case 'meses':
        totalDias = plazo.valor * 30
        break
      case 'años':
        totalDias = plazo.valor * 365
        break
    }
    
    const montoOriginal = cuota * (totalDias / (plazo.unidad === 'dias' ? 1 : plazo.unidad === 'semanas' ? 7 : 30))
    const tasaInteres = 20 // Tasa por defecto del 20%
    
    return {
      montoOriginal: Math.round(montoOriginal),
      totalDias,
      tasaInteres
    }
  }

  const importData = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)
    
    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet)

      if (jsonData.length === 0) {
        throw new Error('El archivo Excel está vacío')
      }

      const importResult: ImportResult = {
        success: 0,
        errors: [],
        duplicates: 0
      }

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i]
        const rowNumber = i + 2 // Excel row number (accounting for header)
        
        try {
          // Validate required fields
          if (!row.codigo || !row.nombre || !row.cuota) {
            importResult.errors.push({
              row: rowNumber,
              error: 'Faltan campos obligatorios: código, nombre o cuota'
            })
            continue
          }

          // Check for duplicates
          const { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('codigo', row.codigo)
            .single()

          if (existingClient) {
            importResult.duplicates++
            continue
          }

          // Parse data
          const plazo = parseTimeUnit(row.plazo || '30 días')
          const cuota = typeof row.cuota === 'string' ? 
            parseFloat(row.cuota.replace(/[^0-9.-]/g, '')) : 
            Number(row.cuota)

          const loanDetails = calculateLoanDetails(cuota, plazo)

          // Create client
          const clientData = {
            codigo: String(row.codigo),
            nombre: String(row.nombre),
            cedula: row.cedula ? String(row.cedula) : '',
            telefono: row.telefono ? String(row.telefono) : '',
            direccion: row.direccion ? String(row.direccion) : '',
            clasificacion: 'B' as const,
            estado: 'activo' as const,
            saldo_pendiente: loanDetails.montoOriginal,
            ruta: row.ruta ? String(row.ruta) : 'centro',
            cobrador: 'admin',
            fecha_ultimo_pago: null,
            orden_ruta: i + 1
          }

          let clientId: string

          if (syncManager.isOffline()) {
            const client = await syncManager.saveClientOffline(clientData)
            clientId = client.id
          } else {
            const { data: client, error: clientError } = await supabase
              .from('clients')
              .insert(clientData)
              .select()
              .single()

            if (clientError) throw clientError
            clientId = client.id
          }

          // Create loan
          const loanData = {
            client_id: clientId,
            codigo: `L-${row.codigo}`,
            monto_original: loanDetails.montoOriginal,
            saldo_pendiente: loanDetails.montoOriginal,
            valor_cuota: cuota,
            frecuencia: 'diario' as const,
            plazo_total: loanDetails.totalDias,
            plazo_restante: loanDetails.totalDias,
            tasa_interes: loanDetails.tasaInteres,
            estado: 'activo' as const,
            fecha_desembolso: row.fecha_credito ? 
              new Date(row.fecha_credito).toISOString() : 
              new Date().toISOString(),
            fecha_vencimiento: new Date(Date.now() + loanDetails.totalDias * 24 * 60 * 60 * 1000).toISOString(),
            fecha_proximo_pago: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            ruta: row.ruta ? String(row.ruta) : 'centro',
            cobrador: 'admin'
          }

          if (syncManager.isOffline()) {
            await syncManager.saveLoanOffline(loanData)
          } else {
            const { error: loanError } = await supabase
              .from('loans')
              .insert(loanData)

            if (loanError) throw loanError
          }

          importResult.success++
          
        } catch (error) {
          importResult.errors.push({
            row: rowNumber,
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        }

        setProgress(Math.round((i + 1) / jsonData.length * 100))
      }

      setResult(importResult)
      
      toast({
        title: "Importación completada",
        description: `${importResult.success} clientes importados exitosamente`,
        variant: "default"
      })

    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Error en la importación",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Importar Clientes desde Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Formato requerido:</strong> El archivo Excel debe contener las siguientes columnas:
            <br />
            • <strong>codigo</strong> (obligatorio): Código único del cliente
            <br />
            • <strong>nombre</strong> (obligatorio): Nombre completo del cliente
            <br />
            • <strong>cuota</strong> (obligatorio): Valor de la cuota
            <br />
            • <strong>fecha_credito</strong>: Fecha del crédito (formato: YYYY-MM-DD)
            <br />
            • <strong>plazo</strong>: Plazo del crédito (ej: "30 días", "4 semanas", "6 meses", "1 año")
            <br />
            • <strong>telefono, direccion, cedula, ruta</strong>: Campos opcionales
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="excel-file">Seleccionar archivo Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={importing}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {importing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Importando datos... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={importData}
            disabled={!file || importing}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {importing ? 'Importando...' : 'Importar Clientes'}
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold text-success">{result.success}</p>
                    <p className="text-sm text-muted-foreground">Exitosos</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-2xl font-bold text-warning">{result.duplicates}</p>
                    <p className="text-sm text-muted-foreground">Duplicados</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold text-destructive">{result.errors.length}</p>
                    <p className="text-sm text-muted-foreground">Errores</p>
                  </div>
                </div>
              </Card>
            </div>

            {result.errors.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-destructive">Errores encontrados:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      <strong>Fila {error.row}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}