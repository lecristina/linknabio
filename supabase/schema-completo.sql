-- ============================================
-- SCHEMA COMPLETO - LINK NA BIO
-- Execute este arquivo no Supabase (APP database)
-- Este script DROP tudo e recria do zero
-- ============================================

-- ============================================
-- PASSO 1: REMOVER TUDO QUE EXISTE
-- ============================================

-- Remover políticas RLS existentes
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON links;
DROP POLICY IF EXISTS "Users can manage own links" ON links;
DROP POLICY IF EXISTS "Allow all operations on links" ON links;

-- Remover triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_links_updated_at ON links;

-- Remover função
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Remover índices
DROP INDEX IF EXISTS idx_profiles_user_id;
DROP INDEX IF EXISTS idx_profiles_slug;
DROP INDEX IF EXISTS idx_links_profile_id;
DROP INDEX IF EXISTS idx_links_order;

-- Remover tabelas (em ordem devido às foreign keys)
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- PASSO 2: CRIAR TABELAS
-- ============================================

-- Tabela de perfis (link na bio)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme JSONB DEFAULT '{"primaryColor": "#5D0EC1"}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de links
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASSO 3: CRIAR ÍNDICES
-- ============================================

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_links_profile_id ON links(profile_id);
CREATE INDEX idx_links_order ON links(profile_id, order_index);

-- ============================================
-- PASSO 4: CRIAR FUNÇÃO E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at 
  BEFORE UPDATE ON links
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASSO 5: CONFIGURAR RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ler perfis ativos (para páginas públicas)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Política: Permitir todas as operações em perfis
-- A autenticação é feita no nível da aplicação (NextAuth + middleware)
CREATE POLICY "Allow all operations on profiles"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- Política: Qualquer um pode ler links de perfis ativos
CREATE POLICY "Public links are viewable by everyone"
  ON links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = links.profile_id
      AND profiles.is_active = true
    )
  );

-- Política: Permitir todas as operações em links
-- A autenticação é feita no nível da aplicação (NextAuth + middleware)
CREATE POLICY "Allow all operations on links"
  ON links FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FIM DO SCHEMA
-- ============================================

