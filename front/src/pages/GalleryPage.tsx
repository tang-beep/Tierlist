import { useEffect, useState } from "react";
import UploadForm from "../components/upload/UploadForm";
import ImageGrid from "../components/imagesDisplay/ImageGrid";
import TagSelector from "../components/imagesDisplay/TagSelector";
import "./GalleryPage.css";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages, deleteImage, deleteImages } from "../api/images.api";
import type { SelectableId } from "../types";

type ImageItem = {
  id: number;
  title: string;
  tag: string;
  filePath: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const loadImages = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const data = await fetchImages();
      setImages(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des images"
      );
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadImages();
  }, []);


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
  

  const handleDeleteImage = async (id: SelectableId) => {
    try {
      await deleteImage(id);
      loadImages();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };
  

  const deleteSelectedImages = async () => {
    if (selectedIds.length === 0) return;
  
    const confirmDelete = window.confirm(
      `Supprimer ${selectedIds.length} image(s) ?`
    );

    const tierListImageIds = selectedIds as number[];

    if (!confirmDelete) return;
  
    try {
      await deleteImages(tierListImageIds);
      loadImages();
    } catch {
      alert("Erreur lors de la suppression des images");
    }
  };
  


  if (loading) return <h2>Chargement...</h2>;

  return (
    <div className="gallery-page">
      <UploadForm onUploaded={loadImages} availableTags={availableTags} />

      <h1>Liste des images</h1>

      <TagSelector
        availableTags={availableTags}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
      />

      <div className="gallery-actions">
        <button
          className="tag-mode-toggle"
          onClick={toggleFilterMode}
        >
          {filterMode === "optional"
            ? "Mode : au moins un tag"
            : "Mode : tous les tags"}
        </button>

        <button onClick={toggleAll}>
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </button>

        <button
          onClick={deleteSelectedImages}
          disabled={selectedIds.length === 0}
        >
          Supprimer la sélection
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <ImageGrid
        images={imagesToShow}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        onDelete={handleDeleteImage}
        rows={8}
        cardSize={120}
        gap={8}
      />
    </div>
  );
}
