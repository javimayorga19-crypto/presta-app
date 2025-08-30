-- Enable Row Level Security on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;

-- Create basic policies for public access (adjust based on your security needs)
-- For now, allowing all operations for development. You should restrict these in production.

-- Clients policies
CREATE POLICY "Allow all access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Loans policies
CREATE POLICY "Allow all access to loans" ON public.loans FOR ALL USING (true) WITH CHECK (true);

-- Payments policies
CREATE POLICY "Allow all access to payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- Expenses policies
CREATE POLICY "Allow all access to expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

-- Routes policies
CREATE POLICY "Allow all access to routes" ON public.routes FOR ALL USING (true) WITH CHECK (true);

-- Users policies
CREATE POLICY "Allow all access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Backups policies
CREATE POLICY "Allow all access to backups" ON public.backups FOR ALL USING (true) WITH CHECK (true);

-- Fix function search path for security
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;