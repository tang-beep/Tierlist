import { useMemo } from "react";

/* Hook pour récupérer tous les tags présents sur les différentes images */

export function useImageTags<T extends { tag: string }>(images: T[]) {
  return useMemo(() => {
    return Array.from(
      // On assure qu'il n'y a pas de doublons avec un Set
      new Set(
        images.flatMap(img =>
          img.tag
          // Les tags sont sous forme de string séparés par des virgules
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)
        )
      )
    );
  }, [images]);
}
