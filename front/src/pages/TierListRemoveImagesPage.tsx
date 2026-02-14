import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ImageGrid from "../components/imagesDisplay/ImageGrid";
import TagSelector from "../components/imagesDisplay/TagSelector";
import "../styles/imageSelection.css";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages } from "../api/images.api";
import { fetchTierList, removeImagesFromTierList } from "../api/tierlists.api";

import type { TierListImage } from "../types";

/**
 * Image adaptée à ImageGrid
 * id = TierListImage.id (relation)
 */
type TierListImageFlat = {
  id: string; 
  title: string;
  tag: string;
  filePath: string;
};

export default function TierListRemoveImagesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [images, setImages] = useState<TierListImageFlat[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        if (!id) return;

        setLoading(true);

        const [tierList, allImages] = await Promise.all([
          fetchTierList(id),
          fetchImages()
        ]);

        // map imageId -> tag
        const tagMap = new Map<number, string>();
        allImages.forEach(img => {
          tagMap.set(img.id, img.tag ?? "");
        });

        const flatImages: TierListImageFlat[] = tierList.images.map(
          (rel: TierListImage) => ({
            id: rel.id, // TierListImage.id
            title: rel.title,
            tag: tagMap.get(rel.imageId) ?? "",
            filePath: rel.filePath
          })
        );

        setImages(flatImages);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);


  const {
    availableTags,
    selectedTags,
    toggleTag,
    filterMode,
    toggleFilterMode,
    imagesToShow,
    selectedIds,
    toggle,
    toggleAll,
    allSelected
  } = useImageSelection(images);


  const removeImages = async () => {
    if (!id || selectedIds.length === 0) return;

    const tierListImageIds = selectedIds as number[];

    await removeImagesFromTierList(id, tierListImageIds);
    navigate(`/tierlists/${id}`);
  };

  if (loading) return <h2>Chargement...</h2>;


  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Supprimer des images</h1>
        <button
          className="secondary"
          onClick={() => navigate(`/tierlists/${id}`)}
        >
          ← Retour
        </button>
      </div>

      <TagSelector
        availableTags={availableTags}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
      />

      <div className="page-actions">
        <button onClick={toggleFilterMode}>
          {filterMode === "optional"
            ? "Mode : au moins un tag"
            : "Mode : tous les tags"}
        </button>

        <button onClick={toggleAll}>
          {allSelected ? "Désélectionner tout" : "Sélectionner tout"}
        </button>
      </div>

      <ImageGrid
        images={imagesToShow}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        rows={5}
        cardSize={100}
      />

      <div className="footer-actions">
        <button
          className="danger"
          disabled={selectedIds.length === 0}
          onClick={removeImages}
        >
          Supprimer {selectedIds.length} images
        </button>
      </div>
    </div>
  );
}
