import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TierImageCard from "../../components/tierlist/TierImageCard";
import TierRowDropZone from "../../components/tierlist/TierRowDropZone";
import "./TierListEditorPage.css";

import type { TierRow, TierListImage } from "../../types";
import {
  fetchTierList,
  updateTierListImages,
  updateTierListRows
} from "../../api/tierlists.api";
import { useTranslation } from "../../translations/useTranslation";
import {ChevronsUp, ChevronsDown} from "lucide-react";

export default function TierListEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [rows, setRows] = useState<TierRow[]>([]);
  const [images, setImages] = useState<TierListImage[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuRow, setMenuRow] = useState<TierRow | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [colorValue, setColorValue] = useState("#cccccc");
  const [newRowNameAbove, setNewRowNameAbove] = useState("");
  const [newRowNameBelow, setNewRowNameBelow] = useState("");

  const [imageSize] = useState(6);
  const MAX_ROW_NAME_LENGTH = 50;

  const trans = useTranslation();

  useEffect(() => {
    if (!id) return;

    const tierListId = id;

    async function load() {
      const data = await fetchTierList(tierListId);
      setName(data.name);
      setRows(data.rows);
      setImages(data.images);
      setLoading(false);
    }

    load();
  }, [id]);


  const moveImageOnRow = useCallback(
    (draggedId: string, targetIndex: number, rowId: string | null) => {
      setImages(prev => {
        const sameRow = prev.filter(i => i.tierRowId === rowId);
        const draggedIndex = sameRow.findIndex(i => i.id === draggedId);
        if (draggedIndex === -1) return prev;

        const updatedRow = [...sameRow];
        const [dragged] = updatedRow.splice(draggedIndex, 1);
        updatedRow.splice(targetIndex, 0, dragged);

        return [
          ...prev.filter(i => i.tierRowId !== rowId),
          ...updatedRow
        ];
      });
    },
    []
  );

  const changeRow = (tierImageId: string, rowId: string | null) => {
    setImages(prev =>
      prev.map(img =>
        img.id === tierImageId
          ? { ...img, tierRowId: rowId }
          : img
      )
    );
  };

  const unassignAllImages = () => {
    setImages(prev => prev.map(img => ({ ...img, tierRowId: null })));
  };


  const renameRowWithValue = (row: TierRow, value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return;

    if (trimmed.length > MAX_ROW_NAME_LENGTH) return;

    setRows(prev =>
      prev.map(r => (r.id === row.id ? { ...r, name: value } : r))
    );
  };

  const changeRowColorWithValue = (row: TierRow, value: string) => {
    setRows(prev =>
      prev.map(r => (r.id === row.id ? { ...r, color: value } : r))
    );
  };

  const addRowWithName = (
    row: TierRow,
    position: "above" | "below",
    name?: string
  ) => {
    setRows(prev => {
      const trimmedName = name?.trim() || "Nouvelle ligne";
      if (trimmedName.length > MAX_ROW_NAME_LENGTH) return prev;

      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex(r => r.id === row.id);
      if (index === -1) return prev;
  
      const insertIndex = position === "above" ? index : index + 1;
  
      const newRow: TierRow = {
        id: crypto.randomUUID(),
        name: trimmedName,
        color: "#ccc",
        order: 0
      };
  
      const updated = [
        ...sorted.slice(0, insertIndex),
        newRow,
        ...sorted.slice(insertIndex)
      ];
  
      // Recalcul des orders
      return updated.map((r, i) => ({
        ...r,
        order: i
      }));
    });
  };

  const deleteRow = (row: TierRow) => {
    if (rows.length <= 1) return;
    
    if (!confirm("Supprimer la ligne ? Les images seront déplacées en unassigned."))
      return;

    setImages(prev =>
      prev.map(img =>
        img.tierRowId === row.id ? { ...img, tierRowId: null } : img
      )
    );

    setRows(prev => prev.filter(r => r.id !== row.id));
  };


  const saveTierList = async () => {
    if (!id) return;

    const hasInvalidRow = rows.some(
      r => !r.name.trim() || r.name.length > MAX_ROW_NAME_LENGTH
    );
    
    if (hasInvalidRow) {
      alert("Chaque catégorie doit avoir max 50 caractères");
      return;
    }

    await updateTierListImages(
      id,
      images.map(img => ({
        id: img.id,
        tierRowId: img.tierRowId,
        order: images
          .filter(i => i.tierRowId === img.tierRowId)
          .findIndex(i => i.id === img.id)
      }))
    );

    await updateTierListRows(
      id,
      rows.map(r => ({
        id: r.id,
        name: r.name,
        color: r.color,
        order: r.order
      }))
    );
  };

  const imagesForRow = (rowId: string) =>
    images.filter(img => img.tierRowId === rowId);

  const unassignedImages = images.filter(img => img.tierRowId === null);

  
  if (loading) return (
    <div className="tierlist-editor">
      <div className="title--principal"> {trans("common.loading")} </div>
    </div>);

  return (
    <div 
      className="tierlist-editor"
      style={{ "--tier-image-size": `${imageSize}rem` } as React.CSSProperties}
    >
      <div className="editor-header">
        <button className="btn btn--secondary" onClick={saveTierList}>
          {trans("tlEdition.save")}
        </button>
        <button className="btn btn--danger" onClick={unassignAllImages}>
          {trans("tlEdition.withdrawAll")}
        </button>
      </div>

      <div className="title--principal">{name}</div>

      <div className="tierlist-table">
        {[...rows]
          .sort((a, b) => a.order - b.order)
          .map(row => (
            <div key={row.id} className="tierlist-row">
              <div
                className="tierlist-row-label"
                style={{ backgroundColor: row.color }}
                onClick={() => {
                  setMenuRow(row);
                  setRenameValue(row.name);
                  setColorValue(row.color);
                  setNewRowNameAbove("");
                  setNewRowNameBelow("");
                }}
              >
                {row.name}
              </div>

              <TierRowDropZone rowId={row.id} changeRow={changeRow}>
                {imagesForRow(row.id).map((img, index) => (
                  <TierImageCard
                    key={img.id}
                    tierImageId={img.id}
                    title={img.title}
                    filePath={img.filePath}
                    rowId={row.id}
                    index={index}
                    moveImageOnRow={moveImageOnRow}
                  />
                ))}
              </TierRowDropZone>
            </div>
          ))}
      </div>

      <div className="title--principal"> {trans("tlEdition.unassignedTitle")} </div>

      <TierRowDropZone rowId={null} changeRow={changeRow}>
        {unassignedImages.map((img, index) => (
          <TierImageCard
            key={img.id}
            tierImageId={img.id}
            title={img.title}
            filePath={img.filePath}
            rowId={null}
            index={index}
            moveImageOnRow={moveImageOnRow}
          />
        ))}
      </TierRowDropZone>

      <div className="tierlist-actions">
        <button 
          onClick={() => navigate(`/tierlists/${id}/add-images`)}
          className="btn btn--primary"
        >
          {trans("tlEdition.addImgTitle")}
        </button>
        <button 
          onClick={() => navigate(`/tierlists/${id}/remove-images`)}
          className="btn btn--primary"
        >
          {trans("tlEdition.removeImgTitle")}
        </button>
      </div>

      {menuRow && (
        <div className="row-menu-backdrop" onClick={() => setMenuRow(null)}>
          <div className="row-menu" onClick={e => e.stopPropagation()}>
          <div className="title--secondary">{menuRow.name}</div>

            <div className="row-menu-line">
              <button
                className="btn btn--primary"
                onClick={() => {
                  renameRowWithValue(menuRow, renameValue);
                  setMenuRow(null);
                }}
              >
                {trans("tlEdition.rename")}
              </button>
              <input
                className="input"
                value={renameValue}
                maxLength={50}
                onChange={e => setRenameValue(e.target.value)}
              />
            </div>

            <div className="row-menu-line">
              <button
                className="btn btn--primary"
                onClick={() => {
                  changeRowColorWithValue(menuRow, colorValue);
                  setMenuRow(null);
                }}
              >
                {trans("tlEdition.changeColor")}
              </button>
              <input
                className="input"
                type="color"
                value={colorValue}
                onChange={e => setColorValue(e.target.value)}
              />
            </div>

            <div className="row-menu-line">
              <button
                className="btn btn--primary"
                onClick={() => {
                  addRowWithName(menuRow, "above", newRowNameAbove);
                  setMenuRow(null);
                }}
              >
                {trans("tlEdition.newline")} <ChevronsUp size={16} />
              </button>
              <input
                className="input"
                value={newRowNameAbove}
                maxLength={50}
                onChange={e => setNewRowNameAbove(e.target.value)}
              />
            </div>

            <div className="row-menu-line">
              <button
                className="btn btn--primary"
                onClick={() => {
                  addRowWithName(menuRow, "below", newRowNameBelow);
                  setMenuRow(null);
                }}
              >
                {trans("tlEdition.newline")} <ChevronsDown size={16} />
              </button>
              <input
                className="input"
                value={newRowNameBelow}
                maxLength={50}
                onChange={e => setNewRowNameBelow(e.target.value)}
              />
            </div>

            <button
              className="btn btn--danger"
              disabled={rows.length <= 1}
              onClick={() => {
                if (rows.length <= 1) return;
                deleteRow(menuRow);
                setMenuRow(null);
              }}
            >
              {trans("tlEdition.removeLine")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
