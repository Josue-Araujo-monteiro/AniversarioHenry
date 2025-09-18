-- Atualizar tabela de confirmações para incluir novos campos
ALTER TABLE public.confirmations 
ADD COLUMN IF NOT EXISTS number_of_people INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS additional_names TEXT,
ADD COLUMN IF NOT EXISTS people_over_6 INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS has_children_over_6 BOOLEAN DEFAULT false;

-- Remover coluna antiga se existir
ALTER TABLE public.confirmations DROP COLUMN IF EXISTS additional_ages;

-- Criar tabela para configurações do admin
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  max_guests INTEGER NOT NULL DEFAULT 100,
  registration_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO public.admin_settings (max_guests, registration_enabled) 
VALUES (100, true)
ON CONFLICT DO NOTHING;

-- Habilitar RLS para admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer pessoa possa visualizar configurações
CREATE POLICY "Allow anyone to view admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Política para permitir que qualquer pessoa possa atualizar configurações
CREATE POLICY "Allow anyone to update admin settings" 
ON public.admin_settings 
FOR UPDATE 
USING (true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_admin_settings_updated_at 
    BEFORE UPDATE ON public.admin_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
