import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ImageGrid from "../components/imagesDisplay/ImageGrid";
import TagSelector from "../components/imagesDisplay/TagSelector";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages } from "../api/images.api";
import { fetchTierList, addImagesToTierList } from "../api/tierlists.api";

import type { ImageItem } from "../types";

import "../styles/imageSelection.css";

export default function TierListAddImagesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!id) return;
  
    const tierListId = id;
  
    async function load() {
      try {
        setLoading(true);
  
        const [allImages, tierList] = await Promise.all([
          fetchImages(),
          fetchTierList(tierListId)
        ]);
  
        const usedIds = tierList.images.map(i => i.imageId);
        setImages(allImages.filter(img => !usedIds.includes(img.id)));
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


  const addImages = async () => {
    if (!id || selectedIds.length === 0) return;

    const tierListImageIds = selectedIds as number[];

    await addImagesToTierList(id, tierListImageIds);
    navigate(`/tierlists/${id}`);
  };

  if (loading) return <h2>Chargement...</h2>;


  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Ajouter des images</h1>
        <button className="secondary" onClick={() => navigate(`/tierlists/${id}`)}>
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
          className="primary"
          disabled={selectedIds.length === 0}
          onClick={addImages}
        >
          Ajouter {selectedIds.length} images
        </button>
      </div>
    </div>
  );
}
