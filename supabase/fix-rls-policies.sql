-- Script para corrigir políticas RLS
-- Execute este SQL no Supabase (APP database) ANTES ou DEPOIS do schema.sql

-- Remover políticas antigas que usam auth.jwt() (não funciona com NextAuth)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage own links" ON links;

-- Criar políticas permissivas (autenticação via NextAuth na aplicação)
CREATE POLICY IF NOT EXISTS "Allow all operations on profiles"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on links"
  ON links FOR ALL
  USING (true)
  WITH CHECK (true);

