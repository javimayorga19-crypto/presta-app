import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { SortableClientItem } from './SortableClientItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GripVertical, Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

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

// Mock data - En producción esto vendría de la base de datos
const clientesMock: Cliente[] = [
  {
    id: '1',
    codigo: 'CLI001',
    nombre: 'María García',
    cedula: '12345678',
    telefono: '3001234567',
    direccion: 'Calle 123 #45-67',
    clasificacion: 'A',
    estado: 'activo',
    saldoPendiente: 150000,
    ruta: 'centro',
    cobrador: 'Juan Pérez',
    fechaUltimoPago: '2024-01-15',
    ordenRuta: 1
  },
  {
    id: '2',
    codigo: 'CLI002',
    nombre: 'Carlos Rodríguez',
    cedula: '87654321',
    telefono: '3007654321',
    direccion: 'Carrera 45 #12-34',
    clasificacion: 'B',
    estado: 'activo',
    saldoPendiente: 250000,
    ruta: 'centro',
    cobrador: 'Juan Pérez',
    fechaUltimoPago: '2024-01-14',
    ordenRuta: 2
  },
  {
    id: '3',
    codigo: 'CLI003',
    nombre: 'Ana López',
    cedula: '11223344',
    telefono: '3009876543',
    direccion: 'Avenida 80 #23-45',
    clasificacion: 'C',
    estado: 'mora',
    saldoPendiente: 80000,
    ruta: 'centro',
    cobrador: 'Juan Pérez',
    fechaUltimoPago: '2024-01-10',
    ordenRuta: 3
  },
  {
    id: '4',
    codigo: 'CLI004',
    nombre: 'Pedro Martínez',
    cedula: '55667788',
    telefono: '3005555555',
    direccion: 'Calle 50 #60-70',
    clasificacion: 'A',
    estado: 'activo',
    saldoPendiente: 320000,
    ruta: 'norte',
    cobrador: 'Ana Silva',
    fechaUltimoPago: '2024-01-16',
    ordenRuta: 1
  },
  {
    id: '5',
    codigo: 'CLI005',
    nombre: 'Laura Hernández',
    cedula: '99887766',
    telefono: '3002222222',
    direccion: 'Transversal 15 #20-30',
    clasificacion: 'B',
    estado: 'activo',
    saldoPendiente: 180000,
    ruta: 'norte',
    cobrador: 'Ana Silva',
    fechaUltimoPago: '2024-01-13',
    ordenRuta: 2
  }
]

export const DraggableClientList = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock)
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>('centro')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const clientesFiltrados = clientes
    .filter(cliente => cliente.ruta === rutaSeleccionada)
    .sort((a, b) => a.ordenRuta - b.ordenRuta)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeIndex = clientesFiltrados.findIndex(cliente => cliente.id === active.id)
      const overIndex = clientesFiltrados.findIndex(cliente => cliente.id === over.id)

      if (activeIndex !== -1 && overIndex !== -1) {
        const newOrder = arrayMove(clientesFiltrados, activeIndex, overIndex)
        
        // Actualizar el orden en el array completo
        const updatedClientes = clientes.map(cliente => {
          if (cliente.ruta === rutaSeleccionada) {
            const newIndex = newOrder.findIndex(c => c.id === cliente.id)
            if (newIndex !== -1) {
              return { ...cliente, ordenRuta: newIndex + 1 }
            }
          }
          return cliente
        })

        setClientes(updatedClientes)
        setHasChanges(true)
      }
    }
  }

  const saveOrder = async () => {
    setSaving(true)
    try {
      // En producción, aquí actualizarías la base de datos
      const clientesParaActualizar = clientes.filter(c => c.ruta === rutaSeleccionada)
      
      for (const cliente of clientesParaActualizar) {
        const { error } = await supabase
          .from('clients')
          .update({ orden_ruta: cliente.ordenRuta })
          .eq('id', cliente.id)
        
        if (error) {
          console.error('Error updating client order:', error)
        }
      }

      setHasChanges(false)
      toast({
        title: "Orden guardado",
        description: `El orden de los clientes en la ruta ${rutaSeleccionada} se ha guardado correctamente`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error saving order:', error)
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el nuevo orden",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const resetOrder = () => {
    // Restaurar orden original (por ejemplo, alfabético)
    const clientesOrdenados = clientes.map(cliente => {
      if (cliente.ruta === rutaSeleccionada) {
        return cliente
      }
      return cliente
    })

    const clientesRuta = clientesOrdenados
      .filter(c => c.ruta === rutaSeleccionada)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map((cliente, index) => ({ ...cliente, ordenRuta: index + 1 }))

    const updatedClientes = clientes.map(cliente => {
      const clienteRuta = clientesRuta.find(c => c.id === cliente.id)
      return clienteRuta || cliente
    })

    setClientes(updatedClientes)
    setHasChanges(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getEstadoBadge = (estado: Cliente['estado']) => {
    const variants = {
      activo: 'default',
      inactivo: 'secondary',
      mora: 'destructive',
      vencido: 'destructive'
    } as const

    const labels = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      mora: 'En Mora',
      vencido: 'Vencido'
    }

    return (
      <Badge variant={variants[estado]}>
        {labels[estado]}
      </Badge>
    )
  }

  const getClasificacionColor = (clasificacion: Cliente['clasificacion']) => {
    const colors = {
      A: 'text-success',
      B: 'text-primary',
      C: 'text-warning',
      D: 'text-destructive'
    }
    return colors[clasificacion]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GripVertical className="w-5 h-5" />
              Orden de Clientes por Ruta
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={rutaSeleccionada} onValueChange={setRutaSeleccionada}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="norte">Norte</SelectItem>
                  <SelectItem value="sur">Sur</SelectItem>
                </SelectContent>
              </Select>
              
              {hasChanges && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetOrder}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restablecer
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveOrder}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar Orden'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Instrucciones:</strong> Arrastra y suelta los clientes para cambiar el orden de la ruta de cobranza. 
              El nuevo orden se guardará cuando hagas clic en "Guardar Orden".
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={clientesFiltrados.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {clientesFiltrados.map((cliente) => (
                  <SortableClientItem
                    key={cliente.id}
                    cliente={cliente}
                    formatCurrency={formatCurrency}
                    getEstadoBadge={getEstadoBadge}
                    getClasificacionColor={getClasificacionColor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {clientesFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay clientes en la ruta seleccionada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}