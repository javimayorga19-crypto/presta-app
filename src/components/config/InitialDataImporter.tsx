import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  CreditCard, 
  DollarSign,
  Download,
  Info
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'
import { supabase } from '@/integrations/supabase/client'
import { syncManager } from '@/lib/offline-db'

interface ImportResult {
  clients: { success: number; errors: { row: number; error: string }[]; duplicates: number }
  loans: { success: number; errors: { row: number; error: string }[]; duplicates: number }
  payments: { success: number; errors: { row: number; error: string }[]; duplicates: number }
}

export const InitialDataImporter = () => {
  const [clientsFile, setClientsFile] = useState<File | null>(null)
  const [loansFile, setLoansFile] = useState<File | null>(null)
  const [paymentsFile, setPaymentsFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const { toast } = useToast()

  const handleFileChange = (type: 'clients' | 'loans' | 'payments') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        switch (type) {
          case 'clients':
            setClientsFile(selectedFile)
            break
          case 'loans':
            setLoansFile(selectedFile)
            break
          case 'payments':
            setPaymentsFile(selectedFile)
            break
        }
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

  const parseExcelFile = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    return XLSX.utils.sheet_to_json(worksheet)
  }

  const importClients = async (data: any[]) => {
    const result = { success: 0, errors: [] as { row: number; error: string }[], duplicates: 0 }
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowNumber = i + 2
      
      try {
        if (!row.codigo || !row.nombre) {
          result.errors.push({
            row: rowNumber,
            error: 'Faltan campos obligatorios: código o nombre'
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
          result.duplicates++
          continue
        }

        const clientData = {
          codigo: String(row.codigo),
          nombre: String(row.nombre),
          cedula: row.cedula ? String(row.cedula) : '',
          telefono: row.telefono ? String(row.telefono) : '',
          direccion: row.direccion ? String(row.direccion) : '',
          clasificacion: (row.clasificacion || 'B') as 'A' | 'B' | 'C' | 'D',
          estado: (row.estado || 'activo') as 'activo' | 'inactivo' | 'mora' | 'vencido',
          saldo_pendiente: row.saldo_pendiente ? Number(row.saldo_pendiente) : 0,
          ruta: row.ruta ? String(row.ruta) : 'centro',
          cobrador: row.cobrador ? String(row.cobrador) : 'admin',
          fecha_ultimo_pago: row.fecha_ultimo_pago || null,
          orden_ruta: i + 1
        }

        if (syncManager.isOffline()) {
          await syncManager.saveClientOffline(clientData)
        } else {
          const { error } = await supabase.from('clients').insert(clientData)
          if (error) throw error
        }

        result.success++
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    return result
  }

  const importLoans = async (data: any[]) => {
    const result = { success: 0, errors: [] as { row: number; error: string }[], duplicates: 0 }
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowNumber = i + 2
      
      try {
        if (!row.codigo || !row.client_codigo || !row.monto_original) {
          result.errors.push({
            row: rowNumber,
            error: 'Faltan campos obligatorios: código, client_codigo o monto_original'
          })
          continue
        }

        // Find client
        const { data: client } = await supabase
          .from('clients')
          .select('id')
          .eq('codigo', row.client_codigo)
          .single()

        if (!client) {
          result.errors.push({
            row: rowNumber,
            error: `Cliente con código ${row.client_codigo} no encontrado`
          })
          continue
        }

        // Check for duplicates
        const { data: existingLoan } = await supabase
          .from('loans')
          .select('id')
          .eq('codigo', row.codigo)
          .single()

        if (existingLoan) {
          result.duplicates++
          continue
        }

        const loanData = {
          client_id: client.id,
          codigo: String(row.codigo),
          monto_original: Number(row.monto_original),
          saldo_pendiente: Number(row.saldo_pendiente || row.monto_original),
          valor_cuota: Number(row.valor_cuota || 0),
          frecuencia: (row.frecuencia || 'diario') as 'diario' | 'semanal' | 'mensual',
          plazo_total: Number(row.plazo_total || 30),
          plazo_restante: Number(row.plazo_restante || row.plazo_total || 30),
          tasa_interes: Number(row.tasa_interes || 20),
          estado: (row.estado || 'activo') as 'activo' | 'pagado' | 'vencido' | 'cancelado',
          fecha_desembolso: row.fecha_desembolso || new Date().toISOString(),
          fecha_vencimiento: row.fecha_vencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          fecha_proximo_pago: row.fecha_proximo_pago || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          ruta: row.ruta ? String(row.ruta) : 'centro',
          cobrador: row.cobrador ? String(row.cobrador) : 'admin'
        }

        if (syncManager.isOffline()) {
          await syncManager.saveLoanOffline(loanData)
        } else {
          const { error } = await supabase.from('loans').insert(loanData)
          if (error) throw error
        }

        result.success++
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    return result
  }

  const importPayments = async (data: any[]) => {
    const result = { success: 0, errors: [] as { row: number; error: string }[], duplicates: 0 }
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowNumber = i + 2
      
      try {
        if (!row.loan_codigo || !row.monto) {
          result.errors.push({
            row: rowNumber,
            error: 'Faltan campos obligatorios: loan_codigo o monto'
          })
          continue
        }

        // Find loan
        const { data: loan } = await supabase
          .from('loans')
          .select('id, client_id')
          .eq('codigo', row.loan_codigo)
          .single()

        if (!loan) {
          result.errors.push({
            row: rowNumber,
            error: `Préstamo con código ${row.loan_codigo} no encontrado`
          })
          continue
        }

        const paymentData = {
          loan_id: loan.id,
          client_id: loan.client_id,
          monto: Number(row.monto),
          tipo: (row.tipo || 'pago') as 'pago' | 'abono' | 'cancelacion',
          metodo_pago: (row.metodo_pago || 'efectivo') as 'efectivo' | 'transferencia' | 'cheque',
          numero_recibo: row.numero_recibo ? String(row.numero_recibo) : `REC-${Date.now()}`,
          observaciones: row.observaciones || null,
          cobrador: row.cobrador ? String(row.cobrador) : 'admin',
          fecha_pago: row.fecha_pago || new Date().toISOString()
        }

        if (syncManager.isOffline()) {
          await syncManager.savePaymentOffline(paymentData)
        } else {
          const { error } = await supabase.from('payments').insert(paymentData)
          if (error) throw error
        }

        result.success++
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    return result
  }

  const importAllData = async () => {
    if (!clientsFile && !loansFile && !paymentsFile) {
      toast({
        title: "Error",
        description: "Selecciona al menos un archivo para importar",
        variant: "destructive"
      })
      return
    }

    setImporting(true)
    setProgress(0)
    
    try {
      const importResult: ImportResult = {
        clients: { success: 0, errors: [], duplicates: 0 },
        loans: { success: 0, errors: [], duplicates: 0 },
        payments: { success: 0, errors: [], duplicates: 0 }
      }

      let currentStep = 0
      const totalSteps = [clientsFile, loansFile, paymentsFile].filter(Boolean).length

      // Import clients first
      if (clientsFile) {
        setProgress(Math.round((currentStep / totalSteps) * 100))
        const clientsData = await parseExcelFile(clientsFile)
        importResult.clients = await importClients(clientsData)
        currentStep++
      }

      // Import loans second
      if (loansFile) {
        setProgress(Math.round((currentStep / totalSteps) * 100))
        const loansData = await parseExcelFile(loansFile)
        importResult.loans = await importLoans(loansData)
        currentStep++
      }

      // Import payments last
      if (paymentsFile) {
        setProgress(Math.round((currentStep / totalSteps) * 100))
        const paymentsData = await parseExcelFile(paymentsFile)
        importResult.payments = await importPayments(paymentsData)
        currentStep++
      }

      setProgress(100)
      setResult(importResult)
      
      const totalSuccess = importResult.clients.success + importResult.loans.success + importResult.payments.success
      
      toast({
        title: "Importación completada",
        description: `${totalSuccess} registros importados exitosamente`,
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

  const downloadTemplate = (type: 'clients' | 'loans' | 'payments') => {
    let templateData: any[] = []
    let filename = ''

    switch (type) {
      case 'clients':
        templateData = [
          {
            codigo: 'CLI001',
            nombre: 'Juan Pérez',
            cedula: '12345678',
            telefono: '3001234567',
            direccion: 'Calle 123 #45-67',
            clasificacion: 'A',
            estado: 'activo',
            saldo_pendiente: 0,
            ruta: 'centro',
            cobrador: 'admin',
            fecha_ultimo_pago: null
          }
        ]
        filename = 'plantilla_clientes.xlsx'
        break
      case 'loans':
        templateData = [
          {
            codigo: 'L001',
            client_codigo: 'CLI001',
            monto_original: 500000,
            saldo_pendiente: 500000,
            valor_cuota: 25000,
            frecuencia: 'diario',
            plazo_total: 20,
            plazo_restante: 20,
            tasa_interes: 20,
            estado: 'activo',
            fecha_desembolso: '2024-01-01',
            fecha_vencimiento: '2024-01-21',
            fecha_proximo_pago: '2024-01-02',
            ruta: 'centro',
            cobrador: 'admin'
          }
        ]
        filename = 'plantilla_prestamos.xlsx'
        break
      case 'payments':
        templateData = [
          {
            loan_codigo: 'L001',
            monto: 25000,
            tipo: 'pago',
            metodo_pago: 'efectivo',
            numero_recibo: 'REC001',
            observaciones: '',
            cobrador: 'admin',
            fecha_pago: '2024-01-02'
          }
        ]
        filename = 'plantilla_pagos.xlsx'
        break
    }

    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla')
    XLSX.writeFile(wb, filename)
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Importación de Datos Iniciales:</strong> Esta función permite cargar datos masivos para el inicio de operaciones.
          Puedes importar clientes, préstamos y pagos desde archivos Excel separados. Se recomienda importar en orden: 
          primero clientes, luego préstamos y finalmente pagos.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Archivos</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clients-file">Archivo de clientes (.xlsx)</Label>
                  <Input
                    id="clients-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange('clients')}
                    disabled={importing}
                  />
                </div>
                {clientsFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="w-4 h-4" />
                    {clientsFile.name}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Préstamos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loans-file">Archivo de préstamos (.xlsx)</Label>
                  <Input
                    id="loans-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange('loans')}
                    disabled={importing}
                  />
                </div>
                {loansFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="w-4 h-4" />
                    {loansFile.name}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pagos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payments-file">Archivo de pagos (.xlsx)</Label>
                  <Input
                    id="payments-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange('payments')}
                    disabled={importing}
                  />
                </div>
                {paymentsFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="w-4 h-4" />
                    {paymentsFile.name}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {importing && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Importando datos... {progress}%
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={importAllData}
            disabled={importing || (!clientsFile && !loansFile && !paymentsFile)}
            size="lg"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {importing ? 'Importando...' : 'Importar Datos'}
          </Button>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-4">
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                Descarga las plantillas Excel con el formato correcto para cada tipo de dato.
                Las plantillas incluyen ejemplos y las columnas requeridas.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                onClick={() => downloadTemplate('clients')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Users className="w-8 h-8" />
                <span>Plantilla Clientes</span>
                <span className="text-xs text-muted-foreground">
                  Código, nombre, teléfono, dirección, etc.
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => downloadTemplate('loans')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <CreditCard className="w-8 h-8" />
                <span>Plantilla Préstamos</span>
                <span className="text-xs text-muted-foreground">
                  Código, cliente, monto, plazo, etc.
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => downloadTemplate('payments')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <DollarSign className="w-8 h-8" />
                <span>Plantilla Pagos</span>
                <span className="text-xs text-muted-foreground">
                  Préstamo, monto, fecha, método, etc.
                </span>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          {result ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Clients Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Clientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Exitosos:</span>
                      <span className="font-semibold text-success">{result.clients.success}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duplicados:</span>
                      <span className="font-semibold text-warning">{result.clients.duplicates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Errores:</span>
                      <span className="font-semibold text-destructive">{result.clients.errors.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Loans Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Préstamos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Exitosos:</span>
                      <span className="font-semibold text-success">{result.loans.success}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duplicados:</span>
                      <span className="font-semibold text-warning">{result.loans.duplicates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Errores:</span>
                      <span className="font-semibold text-destructive">{result.loans.errors.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payments Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Pagos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Exitosos:</span>
                      <span className="font-semibold text-success">{result.payments.success}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duplicados:</span>
                      <span className="font-semibold text-warning">{result.payments.duplicates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Errores:</span>
                      <span className="font-semibold text-destructive">{result.payments.errors.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Error Details */}
              {[
                { name: 'Clientes', data: result.clients },
                { name: 'Préstamos', data: result.loans },
                { name: 'Pagos', data: result.payments }
              ].map(({ name, data }) => 
                data.errors.length > 0 && (
                  <Card key={name}>
                    <CardHeader>
                      <CardTitle className="text-destructive">Errores en {name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {data.errors.map((error, index) => (
                          <div key={index} className="text-sm">
                            <strong>Fila {error.row}:</strong> {error.error}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No hay resultados de importación aún. Importa algunos datos para ver los resultados aquí.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}