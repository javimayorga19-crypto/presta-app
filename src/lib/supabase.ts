import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface DatabaseClient {
  id: string
  codigo: string
  nombre: string
  cedula: string
  telefono: string
  direccion: string
  clasificacion: 'A' | 'B' | 'C' | 'D'
  estado: 'activo' | 'inactivo' | 'mora' | 'vencido'
  saldo_pendiente: number
  ruta: string
  cobrador: string
  fecha_ultimo_pago: string | null
  orden_ruta: number
  created_at: string
  updated_at: string
}

export interface DatabaseLoan {
  id: string
  client_id: string
  codigo: string
  monto_original: number
  saldo_pendiente: number
  valor_cuota: number
  frecuencia: 'diario' | 'semanal' | 'mensual'
  plazo_total: number
  plazo_restante: number
  tasa_interes: number
  estado: 'activo' | 'pagado' | 'vencido' | 'cancelado'
  fecha_desembolso: string
  fecha_vencimiento: string
  fecha_proximo_pago: string
  ruta: string
  cobrador: string
  created_at: string
  updated_at: string
}

export interface DatabasePayment {
  id: string
  loan_id: string
  client_id: string
  monto: number
  tipo: 'pago' | 'abono' | 'cancelacion'
  metodo_pago: 'efectivo' | 'transferencia' | 'cheque'
  numero_recibo: string
  observaciones: string | null
  cobrador: string
  fecha_pago: string
  created_at: string
  updated_at: string
}

export interface DatabaseExpense {
  id: string
  concepto: string
  monto: number
  categoria: 'combustible' | 'alimentacion' | 'transporte' | 'papeleria' | 'otros'
  descripcion: string | null
  ruta: string
  cobrador: string
  fecha: string
  comprobante_url: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseRoute {
  id: string
  nombre: string
  descripcion: string
  cobrador: string
  activa: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseUser {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'supervisor' | 'cobrador'
  rutas_asignadas: string[]
  activo: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseBackup {
  id: string
  nombre: string
  descripcion: string | null
  archivo_url: string
  tipo: 'manual' | 'automatico'
  tamano: number
  created_by: string
  created_at: string
}

export interface DatabaseLoanHistory {
  id: string
  client_id: string
  loan_id: string
  accion: 'creacion' | 'pago' | 'modificacion' | 'cancelacion'
  monto_anterior: number | null
  monto_nuevo: number | null
  detalles: string
  fecha: string
  usuario: string
  created_at: string
}

export interface DatabasePaymentHistory {
  id: string
  client_id: string
  payment_id: string
  loan_id: string
  monto: number
  saldo_anterior: number
  saldo_nuevo: number
  fecha: string
  cobrador: string
  created_at: string
}