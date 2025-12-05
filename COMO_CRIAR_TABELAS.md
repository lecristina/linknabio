# 🗄️ Como Criar as Tabelas no Supabase

## Passo a Passo

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta

### 2. Selecione o Projeto APP
- Escolha o projeto com URL: `https://gxlmwtfhzxhmnhifnfuv.supabase.co`
- Este é o projeto APP (não o AUTH)

### 3. Abra o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### 4. Execute o Schema
- Abra o arquivo `supabase/schema.sql` deste projeto
- Copie TODO o conteúdo do arquivo
- Cole no SQL Editor do Supabase
- Clique em **"Run"** ou pressione `Ctrl+Enter`

### 5. Verifique se Funcionou
- Você deve ver uma mensagem de sucesso
- As tabelas `profiles` e `links` devem ter sido criadas

## Verificação Rápida

Execute esta query no SQL Editor para verificar:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'links');
```

Se retornar as duas tabelas, está tudo certo! ✅

## Problemas Comuns

### Erro: "relation does not exist"
- As tabelas não foram criadas
- Execute o schema.sql novamente

### Erro: "permission denied"
- Verifique se está usando o projeto correto (APP, não AUTH)
- Verifique se tem permissões de administrador

### Erro: "duplicate key"
- O slug já está em uso
- Escolha outro slug

