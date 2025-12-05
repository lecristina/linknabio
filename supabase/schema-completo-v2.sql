-- ============================================
-- SCHEMA COMPLETO V2 - Link na Bio
-- Inclui todos os campos para interface profissional
-- Execute este SQL no Supabase (APP database)
-- ============================================

-- Remover tudo que existe
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- TABELA: profiles
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  
  -- Informações básicas
  display_name TEXT,
  professional_title TEXT,
  subtitle TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_color TEXT DEFAULT '#87CEEB',
  
  -- Tema e personalização
  theme JSONB DEFAULT '{
    "primaryColor": "#0891b2",
    "backgroundColor": "#f0f9ff",
    "textColor": "#1e293b",
    "coverGradient": "linear-gradient(180deg, #87CEEB 0%, #f0f9ff 100%)",
    "buttonStyle": "rounded",
    "fontFamily": "Inter"
  }'::jsonb,
  
  -- Badges/Tags
  badges JSONB DEFAULT '[]'::jsonb,
  
  -- Redes sociais
  social_links JSONB DEFAULT '[]'::jsonb,
  
  -- Footer
  footer_text TEXT,
  footer_subtext TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: links
-- ============================================
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informações do link
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  
  -- Tipo: primary (destacado), secondary (normal), social
  link_type TEXT DEFAULT 'secondary' CHECK (link_type IN ('primary', 'secondary', 'social')),
  
  -- Ordenação e status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: articles (Blog/Artigos)
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informações do artigo
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  url TEXT NOT NULL,
  read_time TEXT,
  published_at TIMESTAMPTZ,
  
  -- Ordenação e status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_links_profile_id ON links(profile_id);
CREATE INDEX idx_links_order ON links(profile_id, order_index);
CREATE INDEX idx_links_type ON links(profile_id, link_type);
CREATE INDEX idx_articles_profile_id ON articles(profile_id);
CREATE INDEX idx_articles_order ON articles(profile_id, order_index);

-- ============================================
-- FUNÇÃO: updated_at automático
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at 
  BEFORE UPDATE ON links
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON articles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS DESABILITADO PARA DESENVOLVIMENTO
-- ============================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;

-- ============================================
-- DADOS DE EXEMPLO (opcional)
-- ============================================
-- Descomente para inserir dados de exemplo

/*
INSERT INTO profiles (
  user_id, 
  slug, 
  display_name, 
  professional_title,
  subtitle,
  bio,
  avatar_url,
  cover_color,
  badges,
  social_links,
  footer_text,
  footer_subtext
) VALUES (
  'mock-user-id-12345',
  'dra-ana-silva',
  'Dra. Ana Carolina Silva',
  'Psicóloga Clínica',
  'Ansiedade, Depressão e Trauma',
  'Ajudando você a navegar pelos desafios da vida com compaixão e cuidado baseado em evidências. Especializada em terapia cognitivo-comportamental e abordagens baseadas em mindfulness.',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  '#87CEEB',
  '["Psicóloga Licenciada", "Mestrado em Psicologia", "15+ Anos de Experiência"]'::jsonb,
  '[
    {"platform": "website", "url": "https://exemplo.com"},
    {"platform": "linkedin", "url": "https://linkedin.com/in/exemplo"},
    {"platform": "instagram", "url": "https://instagram.com/exemplo"},
    {"platform": "youtube", "url": "https://youtube.com/@exemplo"}
  ]'::jsonb,
  'Aceitando novos pacientes • Convênios aceitos',
  'Licenciada pelo CRP 06/123456 • Atendimento online disponível'
);

-- Links de exemplo
INSERT INTO links (profile_id, title, description, url, icon, link_type, order_index) 
SELECT 
  id,
  'Agendar Consulta',
  'Marque sua primeira sessão',
  'https://calendly.com/exemplo',
  'calendar',
  'primary',
  1
FROM profiles WHERE slug = 'dra-ana-silva';

INSERT INTO links (profile_id, title, description, url, icon, link_type, order_index)
SELECT 
  id,
  'Consulta Gratuita de 15 Min',
  'Vamos conversar sobre como posso ajudar',
  'https://calendly.com/exemplo/15min',
  'phone',
  'primary',
  2
FROM profiles WHERE slug = 'dra-ana-silva';

INSERT INTO links (profile_id, title, description, url, icon, link_type, order_index)
SELECT 
  id,
  'Abordagem Terapêutica',
  'Conheça meus métodos e filosofia',
  'https://exemplo.com/abordagem',
  'heart',
  'secondary',
  3
FROM profiles WHERE slug = 'dra-ana-silva';

INSERT INTO links (profile_id, title, description, url, icon, link_type, order_index)
SELECT 
  id,
  'Sessões Online Disponíveis',
  'Atendimento por videochamada segura',
  'https://exemplo.com/online',
  'video',
  'secondary',
  4
FROM profiles WHERE slug = 'dra-ana-silva';

-- Artigos de exemplo
INSERT INTO articles (profile_id, title, description, image_url, url, read_time, published_at, order_index)
SELECT 
  id,
  'Como Lidar com a Ansiedade no Dia a Dia',
  'Descubra técnicas práticas e eficazes para gerenciar a ansiedade e recuperar o controle da sua vida.',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
  'https://exemplo.com/blog/ansiedade',
  '5 min',
  '2025-01-15',
  1
FROM profiles WHERE slug = 'dra-ana-silva';

INSERT INTO articles (profile_id, title, description, image_url, url, read_time, published_at, order_index)
SELECT 
  id,
  'A Importância do Autocuidado',
  'Entenda por que cuidar de si mesmo não é egoísmo, mas uma necessidade fundamental para o bem-estar.',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  'https://exemplo.com/blog/autocuidado',
  '4 min',
  '2025-01-10',
  2
FROM profiles WHERE slug = 'dra-ana-silva';
*/

