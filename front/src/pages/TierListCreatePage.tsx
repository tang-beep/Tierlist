import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TierListCreatePage.css";
import TagSelector from "../components/imagesDisplay/TagSelector";
import ImageGrid from "../components/imagesDisplay/ImageGrid";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages } from "../api/images.api";
import { createTierList } from "../api/tierlists.api";

import type { ImageItem, TierRow } from "../types";
import { useTranslation } from "../translations/useTranslation";
import {X} from "lucide-react";


export default function TierListCreatePage() {
  const navigate = useNavigate();

  const [tierListName, setTierListName] = useState("");

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    key: string;
    vars?: Record<string, string | number>;
  } | null>(null);

  const trans = useTranslation();
  
  const MAX_TIERLIST_NAME = 50;
  const MAX_CAT_NAME = 50;

  const [rows, setRows] = useState<TierRow[]>([
    { id: crypto.randomUUID(), name: "S", color: "#ff595e", order: 0 },
    { id: crypto.randomUUID(), name: "A", color: "#ffca3a", order: 1 },
    { id: crypto.randomUUID(), name: "B", color: "#8ac926", order: 2 }
  ]);
  
  const loadImages = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const data = await fetchImages();
      setImages(data);
    } catch (err) {
      setError({key: "common.errLoading"});
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


  const handleCreateTierList = async () => {
    setError(null);
  
    if (!tierListName.trim()) {
      setError({key: "createPage.errNameRequired"});
      return;
    }

    if (tierListName.length > MAX_TIERLIST_NAME) {
      setError({key: "createPage.errNameLength", vars: {max: MAX_TIERLIST_NAME}});
      return;
    }
  
    if (selectedIds.length === 0) {
      setError({key: "createPage.errNoImage"});
      return;
    }

    if (rows.length === 0) {
      setError({key: "createPage.errNoCategory"});
      return;
    }

    if (rows.some(r => r.name.trim().length === 0)) {
      setError({key: "createPage.errEmptyCategory"});
      return;
    }
    
    if (rows.some(r => r.name.length > MAX_CAT_NAME)) {
      setError({key: "createPage.errCategoryLength", vars: {max: MAX_CAT_NAME}});
      return;
    }
  
    const payload = {
      name: tierListName,
      rows: rows.map((r, index) => ({
        name: r.name,
        color: r.color,
        order: index
      })),
      imageIds: selectedIds
    };
  
    try {
      const { id } = await createTierList(payload);
      navigate(`/tierlists/${id}`);
    } catch (err) {
      setError({key: "createPage.errCreate"});
    }
  };
  

  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trans("createPage.defaultRowName"),
        color: "#cccccc",
        order: prev.length
      }
    ]);
  }    

  const removeRow = (id: string) => {
    setRows(prev =>
      prev
        .filter(r => r.id !== id)
        .map((r, index) => ({ ...r, order: index }))
    );
  };

  if (loading) return (
    <div className="tierlist-create-page">
      <div className="title--principal"> {trans("common.loading")} </div>
    </div>);

  return (
    <div className="tierlist-create-page">
      <div className="tierlist-create-header">
        <div className="title--principal"> {trans("createPage.title")} </div>

        <input
          className="input"
          placeholder={trans("createPage.namePlaceholder")}
          value={tierListName}
          maxLength={MAX_TIERLIST_NAME}
          onChange={e => setTierListName(e.target.value)}
        />
      </div>

      <div className="tierlist-create-tags">
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />

        <div className="tierlist-create-select-btns">
          <button className="btn btn--secondary" onClick={toggleFilterMode}>
            {filterMode === "optional"
              ? trans("tag.modeOr")
              : trans("tag.modeAnd")}
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
      />

      <div className="tierlist-create-categories">
        <div className="title--secondary"> {trans("createPage.categories")} </div>

        <div className="tierlist-create-rows">
          {rows.map(row => (
            <div key={row.id} className="tierlist-create-row">
              <input
                className="input cat-input"
                value={row.name}
                maxLength={MAX_CAT_NAME}
                onChange={e =>
                  setRows(prev =>
                    prev.map(r =>
                      r.id === row.id ? { ...r, name: e.target.value } : r
                    )
                  )
                }
              />

              <input
                className="input"
                type="color"
                value={row.color}
                onChange={e =>
                  setRows(prev =>
                    prev.map(r =>
                      r.id === row.id ? { ...r, color: e.target.value } : r
                    )
                  )
                }
              />

              <button
                className="btn btn--danger"
                disabled={rows.length <= 1}
                onClick={() => removeRow(row.id)}
              >
                <X size= {20}/>
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn--primary" onClick={addRow}>
          {trans("createPage.addCategory")}
        </button>

        <button className="btn btn--primary" onClick={handleCreateTierList}>
          {trans("createPage.create")}
        </button>

        {error && (
          <div className="tierlist-create-error">
            {trans(error.key, error.vars)}
          </div>
        )}
      </div>
    </div>
  );
}
