import { useMemo, useRef, useState } from "react";
import "./TagSelector.css";

// Pour définir la largeur du TagSelector, le faire dans le css du composant parent, 
// puis regler la hauteur des lignes (hauteur des tags) et le nombre initial de lignes
type Props = {
  // Listes des tags
  availableTags: string[];
  // Tags selectionnés
  selectedTags: string[];
  // Fonction de selection de tags
  onToggleTag: (tag: string) => void;

  // Nombre de lignes de tags au démarrage
  initialRows?: number;
  // Hauteur des tags
  rowHeight?: number;
  // Espacement des tags
  gap?: number;
};

export default function TagSelector({
  availableTags,
  selectedTags,
  onToggleTag,
  initialRows = 1,
  rowHeight = 38,
  gap = 8
}: Props) {
  // Texte de recherche
  const [search, setSearch] = useState("");
  // Nombre de lignes visibles
  const [rows, setRows] = useState(initialRows);

  const listRef = useRef<HTMLDivElement>(null);

  // Filtre les tags selon la recherche et les organise pour mettre
  // les selctionnés en premier
  const sortedTags = useMemo(() => {
    const filtered = availableTags.filter(tag =>
      tag.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const aSel = selectedTags.includes(a);
      const bSel = selectedTags.includes(b);
      return Number(bSel) - Number(aSel);
    });
  }, [availableTags, selectedTags, search]);

  const maxHeight = rows * (rowHeight + gap + 2) - gap;

  const contentHeight = listRef.current?.scrollHeight ?? 0;
  // détermine si on affiche le More (si il reste des tags non affichés)
  const canGrow = contentHeight > maxHeight + 1;

  return (
    <div className="tag-selector">
      <input
        type="text"
        placeholder="Rechercher un tag..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="tag-search"
      />

        <div
          ref={listRef}
          className="tag-list"
          style={{
            gap: `${gap}px`,
            maxHeight: `${maxHeight}px`,
            "--tag-height": `${rowHeight}px`
          } as React.CSSProperties}
        >
        {sortedTags.map(tag => {
          const selected = selectedTags.includes(tag);

          return (
            <span
              key={tag}
              className={`tag-chip ${selected ? "selected" : ""}`}
              onClick={() => onToggleTag(tag)}
            >
              {tag}
            </span>
          );
        })}
      </div>

      <div className="tag-actions">
        {rows > 1 && (
          <button
            type="button"
            onClick={() => setRows(r => Math.max(1, r - 2))}
          >
            − Less
          </button>
        )}

        {canGrow && (
          <button type="button" onClick={() => setRows(r => r + 2)}>
            + More
          </button>
        )}
      </div>
    </div>
  );
}