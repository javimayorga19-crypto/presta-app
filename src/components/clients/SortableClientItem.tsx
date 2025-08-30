import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GripVertical, Phone, MapPin, MoreVertical } from 'lucide-react'

interface Cliente {
  id: string
  codigo: string
  nombre: string
  cedula: string
  telefono: string
  direccion: string
  clasificacion: 'A' | 'B' | 'C' | 'D'
  estado: 'activo' | 'inactivo' | 'mora' | 'vencido'
  saldoPendiente: number
  ruta: string
  cobrador: string
  fechaUltimoPago: string | null
  ordenRuta: number
}

interface SortableClientItemProps {
  cliente: Cliente
  formatCurrency: (amount: number) => string
  getEstadoBadge: (estado: Cliente['estado']) => JSX.Element
  getClasificacionColor: (clasificacion: Cliente['clasificacion']) => string
}

export const SortableClientItem = ({
  cliente,
  formatCurrency,
  getEstadoBadge,
  getClasificacionColor
}: SortableClientItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cliente.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`transition-all ${
        isDragging ? 'shadow-lg ring-2 ring-primary/20 bg-primary/5' : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div
            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Order Number */}
          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {cliente.ordenRuta}
            </span>
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {cliente.nombre}
                  </h3>
                  <span className={`text-sm font-medium ${getClasificacionColor(cliente.clasificacion)}`}>
                    [{cliente.clasificacion}]
                  </span>
                  {getEstadoBadge(cliente.estado)}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                  <span>Código: {cliente.codigo}</span>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {cliente.telefono}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{cliente.direccion}</span>
                </div>
              </div>

              {/* Amount and Actions */}
              <div className="flex-shrink-0 text-right">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">Saldo:</span>
                  <p className="font-semibold text-lg">
                    {formatCurrency(cliente.saldoPendiente)}
                  </p>
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">
                  {cliente.fechaUltimoPago ? (
                    <>Último pago: {cliente.fechaUltimoPago}</>
                  ) : (
                    'Sin pagos'
                  )}
                </div>

                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}