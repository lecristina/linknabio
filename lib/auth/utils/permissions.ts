/**
 * @package @axolutions/auth
 * Utilitários para validação de permissões
 */

import type { AxolutionsUser, AxolutionsProductAccess } from "../types";

/**
 * Verifica se o usuário tem uma permissão específica em um produto
 */
export function hasPermission(user: AxolutionsUser | null, productSlug: string, permission: string): boolean {
  if (!user) return false;

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return false;

  return productAccess.role.permissions.includes(permission);
}

/**
 * Verifica se o usuário tem qualquer uma das permissões especificadas
 */
export function hasAnyPermission(user: AxolutionsUser | null, productSlug: string, permissions: string[]): boolean {
  if (!user) return false;

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return false;

  return permissions.some((permission) => productAccess.role.permissions.includes(permission));
}

/**
 * Verifica se o usuário tem todas as permissões especificadas
 */
export function hasAllPermissions(user: AxolutionsUser | null, productSlug: string, permissions: string[]): boolean {
  if (!user) return false;

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return false;

  return permissions.every((permission) => productAccess.role.permissions.includes(permission));
}

/**
 * Verifica se o usuário tem uma role específica em um produto
 */
export function hasRole(user: AxolutionsUser | null, productSlug: string, roleName: string): boolean {
  if (!user) return false;

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return false;

  return productAccess.role.name === roleName;
}

/**
 * Verifica se o usuário tem qualquer uma das roles especificadas
 */
export function hasAnyRole(user: AxolutionsUser | null, productSlug: string, roleNames: string[]): boolean {
  if (!user) return false;

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return false;

  return roleNames.includes(productAccess.role.name);
}

/**
 * Verifica se o usuário é admin em um produto
 */
export function isAdmin(user: AxolutionsUser | null, productSlug: string): boolean {
  return hasRole(user, productSlug, "admin");
}

/**
 * Obtém todas as permissões do usuário em um produto
 */
export function getUserPermissions(user: AxolutionsUser | null, productSlug: string): string[] {
  if (!user) return [];

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return [];

  return productAccess.role.permissions;
}

/**
 * Obtém a role do usuário em um produto
 */
export function getUserRole(user: AxolutionsUser | null, productSlug: string): string | null {
  if (!user) return null;

  const productAccess = user.products.find((access) => access.product.slug === productSlug);

  if (!productAccess) return null;

  return productAccess.role.name;
}

/**
 * Obtém todos os produtos que o usuário tem acesso
 */
export function getUserProducts(user: AxolutionsUser | null): string[] {
  if (!user) return [];

  return user.products.map((access) => access.product.slug);
}
