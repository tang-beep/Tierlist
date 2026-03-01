import type { TierList } from "../types";
import { http } from "./http";

/* Récupère la liste des tierlists */
export function fetchTierLists() {
  return http<TierList[]>("/TierLists");
}

/* Récupère une tierlist complète */
export function fetchTierList(id: string) {
  return http<TierList>(`/TierLists/${id}`);
}

/* Créé une tierlist */
export function createTierList(payload: any) {
  return http<{ id: number }>("/TierLists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

/* Ajoute des images à une tierlist */
export function addImagesToTierList(id: string, imageIds: number[]) {
  return http<void>(`/TierLists/${id}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageItemIds: imageIds })
  });
}

/* Supprime des images d'une tierlist */
export function removeImagesFromTierList(id: string, tierListImageIds: string[]) {
  return http<void>(`/TierLists/${id}/images`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tierListImageIds })
  });
}

/* Sauvegarde le placement des images d'une tierlist */
export function updateTierListImages(
  id: string,
  images: {
    id: string;
    tierRowId: string | null;
    order: number;
  }[]) {
  return http<void>(`/TierLists/${id}/images`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images })
  });
}

/* Sauvegarde le placement des lignes d'une tierlist */
export function updateTierListRows(
  id: string,
  rows: {
    id: string;
    name: string;
    color: string;
    order: number;
  }[]) {
  return http<void>(`/TierLists/${id}/rows`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows })
  });
}
