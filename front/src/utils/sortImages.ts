import type { SelectableId } from "../types";

/* Fonction qui permet de réorganiser une liste d'images
en mettant les selectionnées en premier */

export function sortSelectedFirst<T extends { id: SelectableId }>(
  // Images a reorganiser
  images: T[],
  // Id des images selectionnees
  selectedIds: SelectableId[]
) {
  const selectedSet = new Set(selectedIds);

  return [...images].sort((a, b) => {
    const aSel = selectedSet.has(a.id);
    const bSel = selectedSet.has(b.id);
    return Number(bSel) - Number(aSel);
  });
}
