-- Schema para sistema de Link na Bio
-- Execute este SQL no Supabase (APP database)

-- Tabela de perfis (link na bio)
CREATE TABLE IF NOT EXISTS profiles (
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
CREATE TABLE IF NOT EXISTS links (
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);
CREATE INDEX IF NOT EXISTS idx_links_profile_id ON links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_order ON links(profile_id, order_index);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Políticas de segurança
-- IMPORTANTE: Como estamos usando NextAuth (não Supabase Auth),
-- as políticas RLS precisam ser permissivas. A autenticação é feita
-- no nível da aplicação (NextAuth + middleware)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ler perfis ativos (para páginas públicas)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Política: Permitir todas as operações (autenticação via NextAuth na aplicação)
-- A segurança é garantida pelo middleware e APIs que verificam o token NextAuth
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

-- Política: Permitir todas as operações em links (autenticação via NextAuth na aplicação)
CREATE POLICY "Allow all operations on links"
  ON links FOR ALL
  USING (true)
  WITH CHECK (true);

