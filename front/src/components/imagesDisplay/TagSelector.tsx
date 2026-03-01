import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  rowHeight = 2.2,
  gap = 0.5
}: Props) {
  // Texte de recherche
  const [search, setSearch] = useState("");
  // Nombre de lignes visibles
  const [rows, setRows] = useState(initialRows);

  const listRef = useRef<HTMLDivElement>(null);

  const [canGrow, setCanGrow] = useState(false);

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

  const maxHeight = rows * (rowHeight + gap) - gap;

  // détermine si on affiche le More (si il reste des tags non affichés)
  useLayoutEffect(() => {
    if (!listRef.current) return;
  
    // Taille d'un rem
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
  
    const contentHeight = listRef.current.scrollHeight;
    const visibleHeight = rows * (rowHeight + gap) - gap;
  
    setCanGrow(contentHeight / rootFontSize > visibleHeight + 0.5);
  }, [sortedTags, rows, rowHeight, gap]);

  // Pour eviter tout probleme, on reset les rows quand il y a 
  // un changement
  useEffect(() => {
    setRows(initialRows);
  }, [search, availableTags, initialRows]);

  return (
    <div className="tag-selector">
      <input
        type="text"
        placeholder="Rechercher un tag..."
        value={search}
        maxLength={60}
        onChange={e => setSearch(e.target.value)}
        className="input tag-search"
      />

      <div
        ref={listRef}
        className="tag-list"
        style={{
          gap: `${gap}rem`,
          maxHeight: `${maxHeight}rem`,
          "--tag-height": `${rowHeight}rem`
        } as React.CSSProperties}
      >
        {sortedTags.length === 0 ? (
          <div>
            Aucun tag trouvé
          </div>
        ) : (
          sortedTags.map(tag => {
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
          })
        )}
      </div>

      <div className="tag-actions">
        {rows > 1 && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setRows(r => Math.max(1, r - 2))}
          >
            − Less
          </button>
        )}

        {canGrow && (
          <button 
            type="button" 
            className="btn btn--secondary"
            onClick={() => setRows(r => r + 2)}
          >
            + More
          </button>
        )}
      </div>
    </div>
  );
}