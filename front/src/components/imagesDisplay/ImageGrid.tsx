import { useEffect, useMemo, useState } from "react";
import "./ImageGrid.css";
import "./ImageCard.css";

import { useImageGridLayout } from "../../hooks/useImageGridLayout";
import { sortSelectedFirst } from "../../utils/sortImages";
import { paginate } from "../../utils/pagination";
import { getPageWindow } from "../../utils/pageWindow";

import type { SelectableId } from "../../types";

type GridImage = {
  id: SelectableId;
  title: string;
  filePath: string;
};

// Pour définir la largeur de l'ImageGrid, le faire dans le css du composant parent, 
// puis regler la hauteur avec le nombre de lignes
type Props = {
  // Images à afficher
  images: GridImage[];
  // Liste des images selectionnées
  selectedIds: SelectableId[];
  // Fonction de selection
  onToggleSelect: (id: SelectableId) => void;
  // Fonction de supression (optionnelle)
  onDelete?: (id: SelectableId) => void;

  // Taille d'une image
  cardSize?: number;
  // Espacement des images
  gap?: number;
  // Nombres de lignes par page
  rows?: number;
  // Texte s'il n'y a pas d'images
  emptyLabel?: string;
};


export default function ImageGrid({
  images,
  selectedIds,
  onToggleSelect,
  onDelete, 
  
  cardSize = 120,
  gap = 10,
  rows = 3,
  emptyLabel = "Aucune Image"
}: Props) {
  // On est à la page 1 au lancement
  const [page, setPage] = useState(1);
  
  // Calcul du nombre d'images par page et de la hauteur de la grille
  const { containerRef, pageSize, gridHeight } = useImageGridLayout({ rows, cardSize, gap });

  // Organise les images pour mettre les selectionnées en premier
  const sortedImages = useMemo(
    () => sortSelectedFirst(images, selectedIds),
    [images, selectedIds]
  );  

  // Récupère les images à afficher sur la page courante, le nb total de pages 
  // et une safePage qui permet de ne pas dépasser totalPages
  const { pagedItems, totalPages, safePage } = paginate(sortedImages, page, pageSize);

  // En cas de suppression d'images on assure que la page est toujours valide
  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);
  
  // On affiche pas toutes les pages mais une fenetre dans le navigateur de pages
  const { pages, showLeftDots, showRightDots } = getPageWindow(page, totalPages);

  // Si aucune image
  if (images.length === 0) {
    return <p style={{ marginTop: 20 }}>{emptyLabel}</p>;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="image-grid"
        style={{
          gap: `${gap}px`,
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardSize}px, 1fr))`,
          height: `${gridHeight}px`
        }}
      >
        {pagedItems.map(img => {
          const selected = selectedIds.includes(img.id);

          return (
            <div
              key={img.id}
              className={`image-card ${selected ? "selected" : ""}`}
              onClick={() => onToggleSelect(img.id)}
            >
              <img src={img.filePath} alt={img.title} />

              <div className="image-overlay">
                <h3>{img.title}</h3>

                {onDelete && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(img.id);
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>
          ⏮
        </button>

        <button onClick={() => setPage(p => Math.max(1, p - 1))}>
          ◀
        </button>

        <span className={`dots ${showLeftDots ? "visible" : ""}`}>…</span>

        {pages.map(p => (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <span className={`dots ${showRightDots ? "visible" : ""}`}>…</span>

        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
          ▶
        </button>

        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          ⏭
        </button>
      </div>
    </>
  );
}