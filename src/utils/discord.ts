import type { DiscordUser } from "../types/Discord";
import type { TokenError, TokenResponse } from "../types/OAuthToken";

export async function exchangeCodeForToken(
code: string
): Promise<TokenResponse> {
  const response = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: import.meta.env.CLIENT_ID,
      client_secret: import.meta.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: import.meta.env.REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to exchange code for token");
  }

  const json: TokenResponse | TokenError = await response.json();
  if ("error" in json) {
    throw new Error(json.error_description);
  }

  return json;
}

export async function getUser(token: string): Promise<DiscordUser | null> {
  const response = await fetch("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  return response.json();
}
