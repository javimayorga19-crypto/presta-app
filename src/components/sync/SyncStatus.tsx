import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { syncManager } from '@/lib/offline-db'

export const SyncStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Conexión restaurada",
        description: "Sincronizando datos automáticamente...",
        variant: "default"
      })
      handleSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Sin conexión",
        description: "Los datos se guardarán localmente",
        variant: "destructive"
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verificar datos pendientes cada 30 segundos
    const interval = setInterval(async () => {
      const count = await syncManager.getPendingSyncCount()
      setPendingCount(count)
    }, 30000)

    // Verificación inicial
    syncManager.getPendingSyncCount().then(setPendingCount)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [toast])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await syncManager.syncWithServer()
      setLastSync(new Date())
      setPendingCount(0)
      toast({
        title: "Sincronización completada",
        description: "Todos los datos han sido sincronizados",
        variant: "default"
      })
    } catch (error) {
      console.error('Sync error:', error)
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar todos los datos",
        variant: "destructive"
      })
    } finally {
      setSyncing(false)
    }
  }

  const getSyncStatus = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        label: 'Sin conexión',
        variant: 'destructive' as const,
        description: 'Trabajando offline'
      }
    }

    if (syncing) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        label: 'Sincronizando',
        variant: 'secondary' as const,
        description: 'Enviando datos al servidor'
      }
    }

    if (pendingCount > 0) {
      return {
        icon: <Clock className="w-4 h-4" />,
        label: `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`,
        variant: 'secondary' as const,
        description: 'Datos esperando sincronización'
      }
    }

    return {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Sincronizado',
      variant: 'default' as const,
      description: 'Todos los datos están actualizados'
    }
  }

  const status = getSyncStatus()

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-destructive" />
              )}
              <span className="font-medium">
                {isOnline ? 'En línea' : 'Sin conexión'}
              </span>
            </div>

            <Badge variant={status.variant} className="flex items-center gap-1">
              {status.icon}
              {status.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {lastSync && (
              <span className="text-xs text-muted-foreground">
                Última sync: {lastSync.toLocaleTimeString()}
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={!isOnline || syncing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              Sincronizar
            </Button>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {status.description}
        </div>

        {!isOnline && pendingCount > 0 && (
          <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {pendingCount} cambios guardados localmente
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Se sincronizarán automáticamente cuando se restaure la conexión
            </p>
          </div>
        )}

        {syncing && (
          <div className="mt-3">
            <Progress value={50} className="w-full h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}