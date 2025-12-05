/**
 * @package @axolutions/auth
 * Utilitários PKCE para OAuth 2.0
 */

/**
 * Gera um code verifier aleatório para PKCE
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Gera um code challenge a partir do code verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Gera um par completo de code verifier e code challenge
 */
export async function generatePKCEPair(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return {
    codeVerifier,
    codeChallenge,
  };
}
