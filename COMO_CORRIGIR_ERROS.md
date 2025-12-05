# Como Corrigir Erros do Link na Bio

## Problema: Erro 500 ao criar perfil

### Solução 1: Executar Schema Simplificado (Recomendado para Desenvolvimento)

1. Acesse o Supabase Dashboard
2. Vá para o banco de dados **APP** (não o AUTH)
3. Abra o **SQL Editor**
4. Execute o arquivo `supabase/schema-simples.sql`

Este schema:
- ✅ Remove todas as tabelas antigas
- ✅ Cria as tabelas do zero
- ✅ **DESABILITA RLS** (Row Level Security) para desenvolvimento
- ✅ Configura índices e triggers

### Solução 2: Limpar Dados Duplicados

Se você já executou o schema mas ainda tem erros de slug duplicado:

1. Execute o arquivo `supabase/cleanup-duplicate-slugs.sql` no SQL Editor
2. Isso remove slugs duplicados mantendo apenas o mais recente

### Solução 3: Verificar Variáveis de Ambiente

Certifique-se de que o `.env.local` tem:

```env
# Supabase APP (para dados)
NEXT_PUBLIC_APP_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_APP_SUPABASE_ANON_KEY=sua-chave-anon

# Autenticação Mockada (para desenvolvimento)
NEXT_PUBLIC_MOCKED_AUTH=true
```

## O que foi refatorado

### 1. Repositórios
- ✅ Uso de `maybeSingle()` em vez de `single()` para evitar erros quando não encontra dados
- ✅ Tratamento correto de erros PGRST116 (não encontrado)
- ✅ Mensagens de erro mais claras

### 2. Serviços
- ✅ Validação de slug melhorada
- ✅ Tratamento de erros de duplicação

### 3. API Routes
- ✅ Status codes HTTP corretos (400 para slug duplicado, 401 para não autorizado)
- ✅ Mensagens de erro mais descritivas

### 4. Schema SQL
- ✅ Novo arquivo `schema-simples.sql` que desabilita RLS
- ✅ Mais fácil para desenvolvimento

## Próximos Passos

1. Execute `supabase/schema-simples.sql` no Supabase
2. Teste criar um novo perfil
3. Se ainda der erro, verifique o console do navegador e do servidor para mais detalhes

