import { useState, useEffect } from "react";
import { useImageTags } from "./useImageTags";
import { useTagFilter } from "./useTagFilter";
import { useMultiSelect } from "./useMultiSelect";

/* Hook orchestrateur qui rassemble plusieurs hooks pour gérer toute
la logique de sélection des images et de filtrage par tag */

// On peut choisir si les images filtrées doivent avoir au moins
// un des tags ou tous les tags
type FilterMode = "optional" | "required";

export function useImageSelection<
  // On s'assure que les images ont un id et un (des) tag(s)
  T extends { id: number; tag: string }
>(images: T[]) {

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("optional");

  // Hook qui récupère la liste des tags présents sur les images
  const availableTags = useImageTags(images);

  // Hook qui filtre les images selon les tags selectionnés
  const filteredImages = useTagFilter(
    images,
    selectedTags,
    filterMode
  );

  // Hook qui gère toutes les logiques de selection d'images
  const {
    selectedIds,
    toggle,
    setSelectedIds
  } = useMultiSelect();

  // Récupère les images correspondant aux IDs sélectionnés
  const selectedImages = images.filter(img =>
    selectedIds.includes(img.id)
  );

  // Quand la liste d'images change, on recalcule les id selectionnés
  // au cas ou une image a ete supprimee
  useEffect(() => {
    setSelectedIds(prev =>
      prev.filter(id =>
        images.some(img => img.id === id)
      )
    );
  }, [images]);

  // Quand la liste de tags change, on recalcule les tags selectionnés
  // au cas ou un tag a ete supprime
  useEffect(() => {setSelectedTags(prev =>
    prev.filter(tag => availableTags.includes(tag)));
  }, [availableTags]);

  // On s'assure que les images selectionnées seront toujours
  // visibles au début meme si elles n'ont pas les bons tags
  const imagesToShow = [
    ...selectedImages,
    ...filteredImages.filter(
      img => !selectedIds.includes(img.id)
    )
  ];

  // Calcule si les images filtrées sont toutes selectionnées
  const visibleIds = imagesToShow.map(img => img.id);

  const allSelected =
    visibleIds.length > 0 &&
    visibleIds.every(id => selectedIds.includes(id));

  // Selectionne / deselectionne toutes les filtrées
  // Si toutes les images filtrées sont sélectionnées, on les désélectionne
  // Sinon, on sélectionne celles qui ne le sont pas encore.
  const toggleAll = () => {
    if (visibleIds.length === 0) return;

    if (allSelected) {
      setSelectedIds(prev =>
        prev.filter(id => !visibleIds.includes(id))
      );
    } else {
      setSelectedIds(prev => [
        ...prev,
        ...visibleIds.filter(id => !prev.includes(id))
      ]);
    }
  };

  // Fonction de selection de tag
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Fonction de changement de mode de filtrage par tag
  const toggleFilterMode = () => {
    setFilterMode(m => (m === "optional" ? "required" : "optional"));
  };

  return {
    // Tags
    availableTags,
    selectedTags,
    toggleTag,

    // Filtre
    filterMode,
    toggleFilterMode,

    // Images
    imagesToShow,
    filteredImages,

    // Selection
    selectedIds,
    toggle,
    toggleAll,
    allSelected,
    setSelectedIds
  };
}
