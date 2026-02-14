import { useMemo } from "react";

/* Hook qui filtre les images en fonction des tags selectionné et
du mode de filtrage selectionné */

export function useTagFilter<T extends { tag: string }>(
  images: T[],
  selectedTags: string[],
  mode: "optional" | "required"
) {
  return useMemo(() => {
    if (selectedTags.length === 0) return images;

    return images.filter(img => {
      const tags = img.tag
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      return mode === "optional"
        ? selectedTags.some(t => tags.includes(t))
        : selectedTags.every(t => tags.includes(t));
    });
  }, [images, selectedTags, mode]);
}
