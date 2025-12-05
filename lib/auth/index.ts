/**
 * @package @axolutions/auth
 * Exports principais da biblioteca de autenticação
 */

// Hooks
export { useAuth, useIsAuthenticated, useCurrentUser, useAuthLoading } from "./hooks/use-auth";
export { usePermissions, useProductPermissions } from "./hooks/use-permissions";

// Utilitários de permissões
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  isAdmin,
  getUserPermissions,
  getUserRole,
  getUserProducts,
} from "./utils/permissions";

// Utilitários de sessão
export {
  getSession,
  getCurrentUser,
  isAuthenticated,
  requireAuth,
  requirePermission,
  requireRole,
} from "./utils/session";

// Utilitários PKCE
export {
  generateCodeVerifier,
  generateCodeChallenge,
  generatePKCEPair,
} from "./utils/pkce";

// Componentes
export { PermissionGate } from "./components/permission-gate";

// Configuração
export { authConfig } from "./config/auth.config";
export { SSO_ENDPOINTS, SSO_SCOPES, AUTH_ROUTES } from "./config/constants";

// Tipos
export type {
  AxolutionsUser,
  AxolutionsProductAccess,
  AxolutionsSSOProfile,
} from "./types";
