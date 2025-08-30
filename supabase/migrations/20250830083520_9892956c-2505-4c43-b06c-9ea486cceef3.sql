-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  cedula TEXT,
  telefono TEXT,
  direccion TEXT,
  clasificacion TEXT NOT NULL DEFAULT 'B' CHECK (clasificacion IN ('A', 'B', 'C', 'D')),
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'mora', 'vencido')),
  saldo_pendiente DECIMAL(15,2) NOT NULL DEFAULT 0,
  ruta TEXT NOT NULL DEFAULT 'centro',
  cobrador TEXT NOT NULL DEFAULT 'admin',
  fecha_ultimo_pago TIMESTAMPTZ,
  orden_ruta INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create loans table
CREATE TABLE public.loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL UNIQUE,
  monto_original DECIMAL(15,2) NOT NULL,
  saldo_pendiente DECIMAL(15,2) NOT NULL,
  valor_cuota DECIMAL(15,2) NOT NULL,
  frecuencia TEXT NOT NULL DEFAULT 'diario' CHECK (frecuencia IN ('diario', 'semanal', 'mensual')),
  plazo_total INTEGER NOT NULL,
  plazo_restante INTEGER NOT NULL,
  tasa_interes DECIMAL(5,2) NOT NULL DEFAULT 20,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'pagado', 'vencido', 'cancelado')),
  fecha_desembolso TIMESTAMPTZ NOT NULL,
  fecha_vencimiento TIMESTAMPTZ NOT NULL,
  fecha_proximo_pago TIMESTAMPTZ NOT NULL,
  ruta TEXT NOT NULL DEFAULT 'centro',
  cobrador TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  monto DECIMAL(15,2) NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'pago' CHECK (tipo IN ('pago', 'abono', 'cancelacion')),
  metodo_pago TEXT NOT NULL DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'transferencia', 'cheque')),
  numero_recibo TEXT NOT NULL,
  observaciones TEXT,
  cobrador TEXT NOT NULL DEFAULT 'admin',
  fecha_pago TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concepto TEXT NOT NULL,
  monto DECIMAL(15,2) NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'otros' CHECK (categoria IN ('combustible', 'alimentacion', 'transporte', 'papeleria', 'otros')),
  descripcion TEXT,
  ruta TEXT NOT NULL DEFAULT 'centro',
  cobrador TEXT NOT NULL DEFAULT 'admin',
  fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  comprobante_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  cobrador TEXT NOT NULL DEFAULT 'admin',
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'cobrador' CHECK (rol IN ('admin', 'supervisor', 'cobrador')),
  rutas_asignadas TEXT[] DEFAULT '{}',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create backups table
CREATE TABLE public.backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  archivo_url TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'manual' CHECK (tipo IN ('manual', 'automatico')),
  tamano BIGINT NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_clients_codigo ON public.clients(codigo);
CREATE INDEX idx_clients_ruta ON public.clients(ruta);
CREATE INDEX idx_clients_estado ON public.clients(estado);
CREATE INDEX idx_loans_client_id ON public.loans(client_id);
CREATE INDEX idx_loans_codigo ON public.loans(codigo);
CREATE INDEX idx_loans_estado ON public.loans(estado);
CREATE INDEX idx_payments_loan_id ON public.payments(loan_id);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);
CREATE INDEX idx_payments_fecha ON public.payments(fecha_pago);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default routes
INSERT INTO public.routes (nombre, descripcion, cobrador, activa) VALUES
  ('centro', 'Ruta del centro de la ciudad', 'admin', true),
  ('norte', 'Ruta del norte de la ciudad', 'admin', true),
  ('sur', 'Ruta del sur de la ciudad', 'admin', true);

-- Insert default admin user
INSERT INTO public.users (email, nombre, rol, rutas_asignadas, activo) VALUES
  ('admin@sistema.com', 'Administrador', 'admin', '{centro,norte,sur}', true);