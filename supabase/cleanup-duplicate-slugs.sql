-- Script para limpar slugs duplicados ou perfis de teste
-- Execute este SQL no Supabase (APP database) se precisar limpar dados de teste

-- Ver perfis existentes
SELECT id, user_id, slug, display_name, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Deletar um perfil específico (substitua 'soufelizez' pelo slug que quer deletar)
-- DELETE FROM profiles WHERE slug = 'soufelizez';

-- Deletar todos os perfis de teste (CUIDADO: isso apaga tudo!)
-- DELETE FROM profiles;

-- Verificar se há slugs duplicados
SELECT slug, COUNT(*) as count 
FROM profiles 
GROUP BY slug 
HAVING COUNT(*) > 1;

