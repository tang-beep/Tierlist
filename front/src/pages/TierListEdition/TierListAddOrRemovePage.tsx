import { useNavigate, useParams } from "react-router-dom";
import ImageGrid from "../../components/imagesDisplay/ImageGrid";
import TagSelector from "../../components/imagesDisplay/TagSelector";
import { useImageSelection } from "../../hooks/useImageSelection";

import "./TierListAddOrRemovePage.css";

type BaseGridImage<IdType> = {
  id: IdType;
  title: string;
  tag: string;
  filePath: string;
};

type Props<T extends BaseGridImage<any>> = {
  title: string;
  actionLabel: (count: number) => string;
  actionVariant: "primary" | "danger";
  images: T[];
  loading: boolean;
  onConfirm: (tierListId: string, selectedIds: T["id"][]) => Promise<void>;
};

export default function TierListAddOrRemovePage<T extends BaseGridImage<any>>(
{
  title,
  actionLabel,
  actionVariant,
  images,
  loading,
  onConfirm
}: Props<T>
) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleConfirm = async () => {
    if (!id || selectedIds.length === 0) return;

    await onConfirm(id, selectedIds);
    navigate(`/tierlists/${id}`);
  };

  if (loading) return <h2>Chargement...</h2>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="title--principal">{title}</div>
        <button
          className="btn btn--secondary"
          onClick={() => navigate(`/tierlists/${id}`)}
        >
          Retour
        </button>
      </div>

      <div className="tierlist-addremove-tags">
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />

        <div className="tierlist-addremove-select-btns">
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
            {allSelected ? "Désélectionner tout" : "Sélectionner tout"}
          </button>
        </div>
      </div>

      <ImageGrid
        images={imagesToShow}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        rows={5}
        cardSize={8}
      />

      <div className="footer-actions">
        <button
          className={`btn btn--${actionVariant}`}
          disabled={selectedIds.length === 0}
          onClick={handleConfirm}
        >
          {actionLabel(selectedIds.length)}
        </button>
      </div>
    </div>
  );
}