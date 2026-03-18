import { useNavigate, useParams } from "react-router-dom";
import ImageGrid from "../../components/imagesDisplay/ImageGrid";
import TagSelector from "../../components/imagesDisplay/TagSelector";
import { useImageSelection } from "../../hooks/useImageSelection";

import "./TierListAddOrRemovePage.css";
import { useTranslation } from "../../translations/useTranslation";

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

  const trans = useTranslation();

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

  if (loading) return (
    <div className="page-container">
      <div className="title--principal"> {trans("common.loading")} </div>
    </div>);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="title--principal">{title}</div>
        <button
          className="btn btn--secondary"
          onClick={() => navigate(`/tierlists/${id}`)}
        >
          {trans("common.back")}
        </button>
      </div>

      <div className="tierlist-addremove-tags">
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />

        <div className="tierlist-addremove-select-btns">
          <button className="btn btn--secondary" onClick={toggleFilterMode}>
            {filterMode === "optional" ? trans("tag.modeOr") : trans("tag.modeAnd")}
          </button>

          <button className="btn btn--secondary" onClick={toggleAll}>
            {allSelected ? trans("common.unselectAll") : trans("common.selectAll")}
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