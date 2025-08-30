import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  Clock, 
  FileArchive,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface BackupData {
  clients: any[]
  loans: any[]
  payments: any[]
  expenses: any[]
  routes: any[]
  users: any[]
  metadata: {
    created_at: string
    version: string
    total_records: number
  }
}

export const BackupManager = () => {
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [progress, setProgress] = useState(0)
  const [backupName, setBackupName] = useState('')
  const [backupDescription, setBackupDescription] = useState('')
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const { toast } = useToast()

  const createBackup = async () => {
    if (!backupName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para el respaldo",
        variant: "destructive"
      })
      return
    }

    setCreating(true)
    setProgress(0)

    try {
      // Fetch all data
      const tables = ['clients', 'loans', 'payments', 'expenses', 'routes', 'users']
      const backupData: Partial<BackupData> = {}
      let totalRecords = 0

      for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        setProgress(Math.round((i / tables.length) * 70))

        const { data, error } = await supabase
          .from(table)
          .select('*')

        if (error) {
          console.warn(`Error fetching ${table}:`, error)
          ;(backupData as any)[table] = []
        } else {
          ;(backupData as any)[table] = data || []
          totalRecords += data?.length || 0
        }
      }

      // Add metadata
      backupData.metadata = {
        created_at: new Date().toISOString(),
        version: '1.0.0',
        total_records: totalRecords
      }

      setProgress(80)

      // Create JSON file
      const jsonString = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      
      // Upload to Supabase Storage
      const fileName = `backup_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('backups')
        .upload(fileName, blob)

      if (uploadError) throw uploadError

      setProgress(90)

      // Save backup record
      const { error: recordError } = await supabase
        .from('backups')
        .insert({
          nombre: backupName,
          descripcion: backupDescription || null,
          archivo_url: uploadData.path,
          tipo: 'manual',
          tamano: blob.size,
          created_by: (await supabase.auth.getUser()).data.user?.id || 'system'
        })

      if (recordError) throw recordError

      setProgress(100)

      // Also download locally
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Respaldo creado exitosamente",
        description: `${totalRecords} registros respaldados en ${fileName}`,
        variant: "default"
      })

      setBackupName('')
      setBackupDescription('')

    } catch (error) {
      console.error('Backup error:', error)
      toast({
        title: "Error al crear respaldo",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      })
    } finally {
      setCreating(false)
      setProgress(0)
    }
  }

  const handleRestoreFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/json') {
        setRestoreFile(file)
      } else {
        toast({
          title: "Archivo no válido",
          description: "Por favor selecciona un archivo JSON de respaldo",
          variant: "destructive"
        })
      }
    }
  }

  const restoreBackup = async () => {
    if (!restoreFile) return

    setRestoring(true)
    setProgress(0)

    try {
      const fileContent = await restoreFile.text()
      const backupData: BackupData = JSON.parse(fileContent)

      if (!backupData.metadata) {
        throw new Error('Archivo de respaldo no válido')
      }

      const tables = ['clients', 'loans', 'payments', 'expenses', 'routes']
      
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        const data = backupData[table as keyof BackupData] as any[]
        
        if (data && data.length > 0) {
          // Clear existing data (be careful!)
          await supabase.from(table).delete().neq('id', 'impossible-id')
          
          // Insert backup data in chunks
          const chunkSize = 100
          for (let j = 0; j < data.length; j += chunkSize) {
            const chunk = data.slice(j, j + chunkSize)
            const { error } = await supabase.from(table).insert(chunk)
            
            if (error) {
              console.warn(`Error restoring ${table} chunk:`, error)
            }
          }
        }

        setProgress(Math.round(((i + 1) / tables.length) * 100))
      }

      toast({
        title: "Respaldo restaurado exitosamente",
        description: `${backupData.metadata.total_records} registros restaurados`,
        variant: "default"
      })

      setRestoreFile(null)

    } catch (error) {
      console.error('Restore error:', error)
      toast({
        title: "Error al restaurar respaldo",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      })
    } finally {
      setRestoring(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Crear Respaldo Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              El respaldo incluirá todos los datos: clientes, préstamos, pagos, gastos, rutas y usuarios.
              Se guardará en la nube y también se descargará localmente.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backup-name">Nombre del respaldo</Label>
              <Input
                id="backup-name"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="Ej: Respaldo mensual enero 2024"
                disabled={creating}
              />
            </div>
            <div>
              <Label htmlFor="backup-description">Descripción (opcional)</Label>
              <Textarea
                id="backup-description"
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="Describe el contenido o propósito del respaldo"
                disabled={creating}
                rows={3}
              />
            </div>
          </div>

          {creating && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Creando respaldo... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={createBackup}
            disabled={creating || !backupName.trim()}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {creating ? 'Creando respaldo...' : 'Crear Respaldo'}
          </Button>
        </CardContent>
      </Card>

      {/* Restore Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Restaurar desde Respaldo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡PRECAUCIÓN!</strong> Restaurar un respaldo eliminará todos los datos actuales 
              y los reemplazará con los datos del archivo de respaldo. Esta acción no se puede deshacer.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="restore-file">Seleccionar archivo de respaldo (JSON)</Label>
            <Input
              id="restore-file"
              type="file"
              accept=".json"
              onChange={handleRestoreFileChange}
              disabled={restoring}
            />
          </div>

          {restoreFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileArchive className="w-4 h-4" />
              {restoreFile.name} ({(restoreFile.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {restoring && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Restaurando respaldo... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={restoreBackup}
            disabled={!restoreFile || restoring}
            variant="destructive"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {restoring ? 'Restaurando...' : 'Restaurar Respaldo'}
          </Button>
        </CardContent>
      </Card>

      {/* Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Estado de Respaldos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium">Último respaldo</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Registros totales</p>
                <p className="text-sm text-muted-foreground">
                  Calculando...
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
              <FileArchive className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium">Respaldos almacenados</p>
                <p className="text-sm text-muted-foreground">
                  En la nube
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}