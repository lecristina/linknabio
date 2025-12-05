/**
 * @package @axolutions/auth
 * Constantes e endpoints do SSO Axolutions
 */

const SSO_BASE_URL = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.axolutions.com";

export const SSO_ENDPOINTS = {
  AUTHORIZE: `${SSO_BASE_URL}/api/oauth/authorize`,
  TOKEN: `${SSO_BASE_URL}/api/oauth/token`,
  USERINFO: `${SSO_BASE_URL}/api/oauth/userinfo`,
  REVOKE: `${SSO_BASE_URL}/api/oauth/revoke`,
} as const;

export const SSO_SCOPES = ["openid"] as const;

export const AUTH_ROUTES = {
  SIGNIN: "/auth/signin",
  SIGNOUT: "/auth/signout",
  ERROR: "/auth/error",
} as const;
