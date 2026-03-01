import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TierListCreatePage.css";
import TagSelector from "../components/imagesDisplay/TagSelector";
import ImageGrid from "../components/imagesDisplay/ImageGrid";

import { useImageSelection } from "../hooks/useImageSelection";

import { fetchImages } from "../api/images.api";
import { createTierList } from "../api/tierlists.api";

import type { ImageItem, TierRow } from "../types";


export default function TierListCreatePage() {
  const navigate = useNavigate();

  const [tierListName, setTierListName] = useState("");

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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


  const handleCreateTierList = async () => {
    setError(null);
  
    if (!tierListName.trim()) {
      setError("Nom de la tierlist requis");
      return;
    }

    if (tierListName.length > 50) {
      setError("Nom de la tierlist au maximum 50 caractères");
      return;
    }
  
    if (selectedIds.length === 0) {
      setError("Sélectionne au moins une image");
      return;
    }

    if (rows.length === 0) {
      setError("Il faut au moins une catégorie");
      return;
    }

    if (rows.some(r => r.name.trim().length === 0)) {
      setError("Chaque catégorie doit avoir un nom");
      return;
    }
    
    if (rows.some(r => r.name.length > 50)) {
      setError("Chaque nom de catégorie doit faire maximum 50 caractères");
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
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la tierlist"
      );
    }
  };
  

  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Nouvelle ligne",
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
      <div className="title--principal">Chargement...</div>
    </div>);

  return (
    <div className="tierlist-create-page">
      <div className="tierlist-create-header">
        <div className="title--principal">Créer une tierlist</div>

        <input
          className="input"
          placeholder="Nom de la tierlist"
          value={tierListName}
          maxLength={50}
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
              ? "Mode : au moins un tag"
              : "Mode : tous les tags"}
          </button>

          <button className="btn btn--secondary" onClick={toggleAll}>
            {allSelected ? "Désélectionner tout" : "Sélectionner tout"}
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
        <div className="title--secondary">Catégories</div>

        <div className="tierlist-create-rows">
          {rows.map(row => (
            <div key={row.id} className="tierlist-create-row">
              <input
                className="input cat-input"
                value={row.name}
                maxLength={50}
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
                ✖
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn--primary" onClick={addRow}>
          Ajouter une catégorie
        </button>

        <button className="btn btn--primary" onClick={handleCreateTierList}>
          Créer la tierlist
        </button>

        {error && <div className="tierlist-create-error">{error}</div>}
      </div>
    </div>
  );
}
