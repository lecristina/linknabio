# 📋 Guia de Configuração - Link na Bio

Este documento explica como configurar e usar o sistema de Link na Bio no projeto.

## 🎯 Visão Geral

O sistema permite que cada usuário autenticado crie seu próprio perfil de "link na bio" com:
- **Slug personalizado**: URL única (ex: `seudominio.com/joao-silva`)
- **Perfil customizável**: Nome, bio, avatar
- **Múltiplos links**: Adicionar, editar, reordenar e ativar/desativar links
- **Página pública**: Acessível sem autenticação através do slug

## 🗄️ Configuração do Banco de Dados

### 1. Execute o Schema SQL

Execute o arquivo `supabase/schema.sql` no seu banco de dados Supabase (APP database):

```sql
-- O arquivo contém:
-- - Tabela profiles (perfis de link na bio)
-- - Tabela links (links de cada perfil)
-- - Índices para performance
-- - Triggers para updated_at
-- - RLS (Row Level Security) policies
```

### 2. Verifique as Variáveis de Ambiente

Certifique-se de ter configurado no `.env.local`:

```env
# Supabase APP (para dados da aplicação)
NEXT_PUBLIC_APP_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_APP_SUPABASE_ANON_KEY=sua-chave-anon

# NextAuth
NEXTAUTH_SECRET=sua-chave-secreta
SSO_CLIENT_ID=seu-client-id
```

## 🚀 Como Usar

### Para Usuários

1. **Acesse o Dashboard**: `/linkbio`
2. **Crie seu Perfil** (primeira vez):
   - Defina um slug único (ex: `joao-silva`)
   - Preencha nome, bio e avatar (opcional)
   - Clique em "Criar Perfil"

3. **Gerencie seu Perfil**:
   - **Aba Perfil**: Edite informações básicas
   - **Aba Links**: Adicione, edite, reordene ou exclua links
   - **Aba Preview**: Veja como ficará sua página pública

4. **Compartilhe seu Link**:
   - Sua página pública estará em: `seudominio.com/[seu-slug]`
   - Use o botão "Copiar URL" para compartilhar

### Estrutura de Rotas

```
/linkbio                    → Dashboard de gerenciamento (protegido)
/[slug]                     → Página pública do perfil (público)
/api/linkbio/profile        → API: GET, POST, PATCH perfil
/api/linkbio/links          → API: POST criar link
/api/linkbio/links/[id]     → API: PATCH, DELETE link
/api/linkbio/reorder        → API: POST reordenar links
/api/linkbio/click          → API: POST rastrear cliques
```

## 📁 Estrutura de Arquivos

```
app/
├── [slug]/                 # Rota pública dinâmica
│   └── page.tsx            # Página pública do perfil
├── (app)/
│   └── linkbio/
│       └── page.tsx        # Dashboard de gerenciamento
└── api/
    └── linkbio/
        ├── profile/        # API de perfil
        ├── links/          # API de links
        ├── reorder/        # API de reordenação
        └── click/          # API de tracking

components/
└── linkbio/
    ├── LinkBioPage.tsx          # Componente da página pública
    ├── LinkBioDashboard.tsx      # Dashboard de gerenciamento
    ├── LinkBioLinksManager.tsx   # Gerenciador de links
    └── LinkBioPreview.tsx        # Preview do perfil

lib/
├── repositories/
│   ├── ProfileRepository.ts     # Acesso a dados de perfis
│   └── LinkRepository.ts        # Acesso a dados de links
└── services/
    └── LinkBioService.ts         # Lógica de negócio

types/
└── linkbio.ts                    # Tipos TypeScript

supabase/
└── schema.sql                    # Schema do banco de dados
```

## 🔒 Segurança

### Row Level Security (RLS)

O schema SQL configura políticas de segurança:

- **Perfis públicos**: Qualquer um pode visualizar perfis ativos
- **Perfis privados**: Usuários só podem editar seus próprios perfis
- **Links**: Links de perfis ativos são públicos, mas apenas o dono pode editar

### Autenticação

- Todas as APIs de gerenciamento requerem autenticação via NextAuth
- O middleware protege rotas administrativas
- Rotas públicas (`/[slug]`) não requerem autenticação

## 🎨 Personalização

### Temas

Cada perfil pode ter um tema personalizado:

```typescript
{
  primaryColor: "#5D0EC1",      // Cor primária (botões)
  backgroundColor: "#ffffff",    // Cor de fundo
  textColor: "#000000",         // Cor do texto
  buttonStyle: "rounded"        // Estilo dos botões
}
```

### Componentes Customizáveis

Os componentes seguem o design system Axolutions:
- Usam shadcn/ui components
- Seguem o padrão de cores OKLCH
- Responsivos e acessíveis

## 📊 Tracking de Cliques

O sistema rastreia cliques nos links:

- Cada clique incrementa `click_count` na tabela `links`
- Tracking é feito via API `/api/linkbio/click`
- Não requer autenticação (público)

## 🔧 Troubleshooting

### Erro: "Profile not found"
- Verifique se o usuário criou um perfil
- Confirme que o `user_id` está correto na sessão

### Erro: "Slug já está em uso"
- Escolha um slug diferente
- Slugs são únicos no sistema

### Página pública não carrega
- Verifique se o perfil está `is_active = true`
- Confirme que o middleware permite rotas `/[slug]`
- Verifique logs do servidor para erros

### RLS bloqueando acesso
- Verifique as políticas no Supabase
- Confirme que `auth.jwt() ->> 'sub'` retorna o user_id correto

## 📝 Próximos Passos

Possíveis melhorias futuras:
- [ ] Analytics detalhados (visualizações, cliques por link)
- [ ] Templates de tema pré-configurados
- [ ] Suporte a imagens de capa
- [ ] Integração com redes sociais
- [ ] QR Code para compartilhamento
- [ ] Domínio customizado por usuário

## 🤝 Contribuindo

Ao adicionar novas funcionalidades:
1. Siga os padrões do projeto (Single Responsibility)
2. Use os repositórios para acesso a dados
3. Implemente validações no service layer
4. Adicione tipos TypeScript apropriados
5. Atualize este documento se necessário

