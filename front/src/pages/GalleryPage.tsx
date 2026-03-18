import { useEffect, useState } from "react";
import UploadForm from "../components/upload/UploadForm";
import ImageGrid from "../components/imagesDisplay/ImageGrid";
import TagSelector from "../components/imagesDisplay/TagSelector";
import "./GalleryPage.css";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages, deleteImage, deleteImages } from "../api/images.api";
import type { ImageItem } from "../types";
import { useTranslation } from "../translations/useTranslation";

export default function GalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trans = useTranslation();

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
          : trans("common.errLoading")
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
      alert(trans("gallery.errRemove"));
    }
  };

  const deleteSelectedImages = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(
      trans("gallery.removeConfirmation", {nb: selectedIds.length})
    );

    if (!confirmDelete) return;

    try {
      await deleteImages(selectedIds);
      loadImages();
    } catch {
      alert(trans("gallery.errRemove"));
    }
  };

  if (loading) return (
    <div className="gallery-page">
      <div className="title--principal"> {trans("common.loading")} </div>
    </div>);

  return (
    <div className="gallery-page">
      <UploadForm onUploaded={loadImages} availableTags={availableTags} />

      <div className="title--principal"> {trans("gallery.title")} </div>

      <div className="gallery-actions">
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
        <div className="gallery-select-btns">
          <button
            className="btn btn--secondary"
            onClick={toggleFilterMode}
          >
            {filterMode === "optional"
              ? trans("tag.modeOr")
              : trans("tag.modeAnd")}
          </button>

          <button
            className="btn btn--secondary"
            onClick={toggleAll}
          >
            {allSelected ? trans("common.unselectAll") : trans("common.selectAll")}
          </button>

          <button
            className="btn btn--danger"
            onClick={deleteSelectedImages}
            disabled={selectedIds.length === 0}
          >
            {trans("gallery.removeSelected")}
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <ImageGrid
        images={imagesToShow}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        onDelete={handleDeleteImage}
        rows={8}
      />
    </div>
  );
}