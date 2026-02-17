export const BASE_URL = import.meta.env.VITE_API_URL + '/api';

/* Fonction de base pour faire une requête http */
export async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    const text = await res.text();
    // Erreur renvoyée par l'API ou erreur par défaut sinon
    throw new Error(text || "API error");
  }

  // Si ok mais réponse vide
  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}
