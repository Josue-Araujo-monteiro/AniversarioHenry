# Instruções para Atualizar o Banco de Dados

## Scripts Disponíveis

### 1. Script Inicial (001_create_confirmations_table.sql)
Este script cria a tabela inicial de confirmações. Execute apenas se for a primeira vez configurando o banco.

### 2. Script de Atualização (002_update_confirmations_table.sql) ⭐ **EXECUTAR ESTE**
Este script adiciona os novos campos necessários para o sistema atualizado:

- `number_of_people` - Número de pessoas que vão
- `additional_names` - Nomes das outras pessoas
- `additional_ages` - Idades das outras pessoas (separadas por vírgula)
- `has_children_over_6` - Se tem crianças com mais de 6 anos
- Tabela `admin_settings` - Para gerenciar configurações
- Funções e triggers para atualização automática

## Como Executar

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para o seu projeto
3. Clique em "SQL Editor" no menu lateral
4. Copie e cole o conteúdo do arquivo `scripts/002_update_confirmations_table.sql`
5. Clique em "Run" para executar o script

## Funcionalidades Adicionadas

### Página de Admin
- Acesse em: `http://localhost:3000/admin`
- Visualize estatísticas em tempo real
- Configure limite de convidados
- Pause/reative as inscrições
- Veja todas as confirmações

### Formulário Atualizado
- Campos separados para número de pessoas e nomes
- Verificação automática se as inscrições estão ativas
- Mensagens personalizadas no WhatsApp baseadas nas informações

### Controle de Inscrições
- Sistema de pausa/reativação das inscrições
- Limite configurável de convidados
- Validação automática antes de permitir confirmações

## Estrutura do Banco Atualizada

```sql
-- Tabela de confirmações (atualizada)
confirmations:
- id (UUID)
- name (TEXT)
- phone (TEXT) - opcional
- email (TEXT) - opcional
- will_attend (BOOLEAN)
- message (TEXT) - opcional
- number_of_people (INTEGER) - NOVO
- additional_names (TEXT) - NOVO
- additional_ages (TEXT) - NOVO
- has_children_over_6 (BOOLEAN) - NOVO
- created_at (TIMESTAMP)

-- Tabela de configurações (nova)
admin_settings:
- id (UUID)
- max_guests (INTEGER)
- registration_enabled (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Próximos Passos

1. Execute o script `002_update_confirmations_table.sql` no Supabase
2. Reinicie a aplicação se necessário
3. Acesse `/admin` para configurar o limite de convidados
4. Teste o formulário de confirmação
