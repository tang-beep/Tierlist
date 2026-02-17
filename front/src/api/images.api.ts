import { http, BASE_URL } from "./http";
import type { ImageItem, SelectableId } from "../types";

/* Récupère toutes les images */
export function fetchImages() {
  return http<ImageItem[]>("/Images");
}

/* Supprime une image */
export function deleteImage(id: SelectableId) {
  return http<void>(`/Images/${id}`, {
    method: "DELETE"
  });
}

/* Supprime plusieurs images */
export function deleteImages(ids: number[]) {
  return Promise.all(ids.map(deleteImage));
}

/* Upload des images */
export async function uploadImages(files: File[], titles: string[], tag: string) {
  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append("Title", titles[i]);
    formData.append("Tag", tag);
    formData.append("File", files[i]);

    const res = await fetch(BASE_URL + "/Images/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const message = await res.text();
      // Erreur de l'API sinon erreur par défaut
      throw new Error(message || "Erreur lors de l’upload");
    }
  }
}
