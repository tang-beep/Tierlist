import { useEffect, useState } from "react";
import UploadForm from "../components/upload/UploadForm";
import ImageGrid from "../components/imagesDisplay/ImageGrid";
import TagSelector from "../components/imagesDisplay/TagSelector";
import "./GalleryPage.css";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages, deleteImage, deleteImages } from "../api/images.api";
import type { ImageItem } from "../types";

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

  const handleDeleteImage = async (id: number) => {
    try {
      await deleteImage(id);
      loadImages();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const deleteSelectedImages = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Supprimer ${selectedIds.length} image(s) ?`
    );

    if (!confirmDelete) return;

    try {
      await deleteImages(selectedIds);
      loadImages();
    } catch {
      alert("Erreur lors de la suppression des images");
    }
  };

  if (loading) return <h2 className="title--secondary">Chargement...</h2>;

  return (
    <div className="gallery-page">
      <UploadForm onUploaded={loadImages} availableTags={availableTags} />

      <div className="title--principal">Liste des images</div>

      <TagSelector
        availableTags={availableTags}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
      />

      <div className="gallery-actions">
        <button
          className="btn btn--secondary"
          onClick={toggleFilterMode}
        >
          {filterMode === "optional"
            ? "Mode : au moins un tag"
            : "Mode : tous les tags"}
        </button>

        <button
          className="btn btn--secondary"
          onClick={toggleAll}
        >
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </button>

        <button
          className="btn btn--danger"
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