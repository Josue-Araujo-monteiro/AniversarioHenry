-- Criar tabela para confirmações de presença
CREATE TABLE IF NOT EXISTS public.confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  will_attend BOOLEAN NOT NULL DEFAULT true,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.confirmations ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer pessoa possa inserir confirmações
CREATE POLICY "Allow anyone to insert confirmations" 
ON public.confirmations 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir que qualquer pessoa possa visualizar confirmações
CREATE POLICY "Allow anyone to view confirmations" 
ON public.confirmations 
FOR SELECT 
USING (true);
