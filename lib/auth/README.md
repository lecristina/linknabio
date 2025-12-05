# 🔐 @axolutions/auth

Biblioteca modular de autenticação para integração com Axolutions SSO usando OAuth 2.0 com PKCE.

## 📦 Estrutura

```
lib/auth/
├── config/
│   ├── auth.config.ts      # Configuração do NextAuth
│   └── constants.ts         # Constantes e endpoints
├── types/
│   └── index.ts            # Tipos TypeScript
├── utils/
│   ├── pkce.ts             # Utilitários PKCE
│   ├── permissions.ts       # Validação de permissões
│   └── session.ts          # Gerenciamento de sessão
├── hooks/
│   ├── use-auth.ts         # Hook de autenticação
│   └── use-permissions.ts   # Hook de permissões
├── providers/
│   └── axolutions-sso.ts   # Provider OAuth customizado
├── components/
│   └── permission-gate.tsx  # Componente de permissões
└── index.ts                # Exports principais
```

## 🚀 Instalação

1. **Instale as dependências:**
```bash
npm install next-auth@beta
```

2. **Configure variáveis de ambiente:**
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
SSO_CLIENT_ID=seu-client-id
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-secret-key
NEXT_PUBLIC_SSO_URL=https://sso.axolutions.com
```

3. **Adicione o SessionProvider no layout:**
```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## 📖 Uso

### Autenticação no Cliente

```tsx
'use client'

import { useAuth } from '@/lib/auth'

export function MyComponent() {
  const { user, isLoading, isAuthenticated, signIn, signOut } = useAuth()

  if (isLoading) return <div>Carregando...</div>

  if (!isAuthenticated) {
    return <button onClick={signIn}>Entrar</button>
  }

  return (
    <div>
      <p>Olá, {user.name}!</p>
      <button onClick={signOut}>Sair</button>
    </div>
  )
}
```

### Logout Completo

O `signOut()` do `useAuth()` realiza um **logout completo** em 2 etapas:

1. **Revogação do token no SSO**: Invalida o access token no servidor SSO
2. **Limpeza da sessão local**: Remove a sessão do NextAuth no navegador

Isso garante que o usuário seja completamente deslogado, tanto localmente quanto no SSO. Se você usar `signOut()` diretamente do `next-auth/react`, apenas a sessão local será limpa, mas o token no SSO permanecerá válido.

```tsx
// ✅ Recomendado: Logout completo com revogação de token
import { useAuth } from '@/lib/auth'
const { signOut } = useAuth()
await signOut()

// ⚠️ Não recomendado: Apenas limpa sessão local
import { signOut } from 'next-auth/react'
await signOut()
```

> **Nota**: O evento `signOut` do NextAuth também está configurado para revogar o token automaticamente, mas usar `useAuth().signOut()` garante que a revogação seja feita antes do redirect.

### Autenticação no Servidor

```tsx
// app/admin/page.tsx
import { getCurrentUser, requireAuth } from '@/lib/auth'

export default async function AdminPage() {
  // Opção 1: Obter usuário (pode ser null)
  const user = await getCurrentUser()

  // Opção 2: Requer auth (lança erro se não autenticado)
  const user = await requireAuth()

  return <div>Olá, {user.name}!</div>
}
```

### Validação de Permissões (Cliente)

```tsx
'use client'

import { usePermissions } from '@/lib/auth'

export function AdminPanel() {
  const permissions = usePermissions('blog-manager')

  if (!permissions.hasPermission('write')) {
    return <div>Você não pode editar</div>
  }

  return <button>Editar Post</button>
}
```

### Validação de Permissões (Servidor)

```tsx
import { getCurrentUser, hasPermission } from '@/lib/auth'

export default async function EditPage() {
  const user = await getCurrentUser()

  if (!hasPermission(user, 'blog-manager', 'write')) {
    return <div>Acesso negado</div>
  }

  return <form>...</form>
}
```

### Componente de Proteção

```tsx
'use client'

import { AuthGuard } from '@/components/auth/auth-guard'

export function ProtectedContent() {
  return (
    <AuthGuard
      productSlug="blog-manager"
      requiredPermission="write"
      fallback={<div>Você não tem acesso</div>}
    >
      <AdminPanel />
    </AuthGuard>
  )
}
```

### Renderização Condicional

```tsx
'use client'

import { PermissionGate } from '@/lib/auth/components/permission-gate'

export function MyPage() {
  return (
    <div>
      <h1>Minha Página</h1>

      <PermissionGate
        productSlug="blog-manager"
        permission="write"
        fallback={<p>Somente leitura</p>}
      >
        <button>Editar</button>
      </PermissionGate>

      <PermissionGate
        productSlug="blog-manager"
        role="admin"
      >
        <button>Excluir</button>
      </PermissionGate>
    </div>
  )
}
```

### Menu do Usuário

```tsx
import { UserMenu } from '@/components/auth/user-menu'

export function Header() {
  return (
    <header>
      <nav>
        <UserMenu />
      </nav>
    </header>
  )
}
```

## 🔒 API Routes Protegidas

```tsx
// app/api/blogs/route.ts
import { NextResponse } from 'next/server'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (!hasPermission(user, 'blog-manager', 'write')) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  // Criar blog post...
}
```

## 🛡️ Middleware de Proteção

O middleware já está configurado para proteger rotas automaticamente:

```tsx
// middleware.ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
  ],
}
```

## 📝 Tipos Disponíveis

```typescript
interface AxolutionsUser {
  id: string
  email: string
  name: string
  avatar?: string
  email_verified: boolean
  products: AxolutionsProductAccess[]
}

interface AxolutionsProductAccess {
  product: {
    id: string
    name: string
    slug: string
  }
  role: {
    id: string
    name: string
    permissions: string[]
  }
}
```

## 🔧 Utilitários

### Permissões

- `hasPermission(user, productSlug, permission)` - Verifica uma permissão
- `hasAnyPermission(user, productSlug, permissions)` - Verifica qualquer permissão
- `hasAllPermissions(user, productSlug, permissions)` - Verifica todas as permissões
- `hasRole(user, productSlug, roleName)` - Verifica uma role
- `hasAnyRole(user, productSlug, roleNames)` - Verifica qualquer role
- `isAdmin(user, productSlug)` - Verifica se é admin

### Sessão

- `getSession()` - Obtém sessão atual
- `getCurrentUser()` - Obtém usuário atual
- `isAuthenticated()` - Verifica se está autenticado
- `requireAuth()` - Requer autenticação (lança erro)

### PKCE

- `generateCodeVerifier()` - Gera code verifier
- `generateCodeChallenge(verifier)` - Gera code challenge
- `generatePKCEPair()` - Gera par completo

## 🌐 Endpoints SSO

- Authorization: `https://sso.axolutions.com/api/oauth/authorize`
- Token: `https://sso.axolutions.com/api/oauth/token`
- UserInfo: `https://sso.axolutions.com/api/oauth/userinfo`

## 🔄 Fluxo de Autenticação

1. Usuário clica em "Entrar"
2. Redireciona para SSO com PKCE challenge
3. Usuário faz login no SSO
4. SSO redireciona de volta com código
5. NextAuth troca código por access token
6. Obtém informações do usuário
7. Cria sessão local com JWT

## 🚨 Tratamento de Erros

```tsx
'use client'

import { useAuth } from '@/lib/auth'

export function MyComponent() {
  const { user, error } = useAuth()

  if (error === 'RefreshAccessTokenError') {
    return (
      <div>
        <p>Sua sessão expirou</p>
        <button onClick={() => window.location.reload()}>
          Fazer login novamente
        </button>
      </div>
    )
  }

  // ...
}
```

## 📦 Extraindo como Package

Para transformar em package npm:

1. Copie toda a pasta `lib/auth`
2. Crie `package.json`:
```json
{
  "name": "@axolutions/auth",
  "version": "1.0.0",
  "main": "index.ts",
  "peerDependencies": {
    "next": "^15.0.0",
    "next-auth": "^5.0.0-beta",
    "react": "^19.0.0"
  }
}
```

3. Publique no npm ou use localmente com `npm link`

## 🆘 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@axolutions.com
- 📚 Docs: https://docs.axolutions.com/sso


