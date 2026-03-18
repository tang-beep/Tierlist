import { useEffect, useMemo, useState } from "react";
import "./ImageGrid.css";
import "./ImageCard.css";

import { useImageGridLayout } from "../../hooks/useImageGridLayout";
import { sortSelectedFirst } from "../../utils/sortImages";
import { paginate } from "../../utils/pagination";
import { getPageWindow } from "../../utils/pageWindow";
import { useTranslation } from "../../translations/useTranslation";

import {ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight} from "lucide-react";

type GridImage = {
  id: number;
  title: string;
  filePath: string;
};

// Définir la hauteur de l'ImageGrid avec le nombre de lignes
type Props = {
  // Images à afficher
  images: GridImage[];
  // Liste des images selectionnées
  selectedIds: number[];
  // Fonction de selection
  onToggleSelect: (id: number) => void;
  // Fonction de supression (optionnelle)
  onDelete?: (id: number) => void;

  // Taille d'une image en rem
  cardSize?: number;
  // Espacement des images en rem
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
  
  cardSize = 8,
  gap = 0.4,
  rows = 3,
  emptyLabel = "Aucune Image"
}: Props) {
  // On est à la page 1 au lancement
  const [page, setPage] = useState(1);
  
  // Calcul du nombre d'images par page et de la hauteur de la grille
  const { containerRef, pageSize } = useImageGridLayout({ 
    rows, 
    cardSize, 
    gap, 
    dependency: images.length 
  });

  // Organise les images pour mettre les selectionnées en premier
  const sortedImages = useMemo(
    () => sortSelectedFirst(images, selectedIds),
    [images, selectedIds]
  ); 

  const trans = useTranslation();

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
          gap: `${gap}rem`,
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardSize}rem, 1fr))`
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
                    className="btn btn--danger"
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(img.id);
                    }}
                  >
                    {trans("common.delete")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button
          className="btn btn--secondary"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          className="btn btn--secondary"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft size={18} />
        </button>

        <span className={`dots ${showLeftDots ? "visible" : ""}`}>…</span>

        {pages.map(p => (
          <button
            key={p}
            className={`btn btn--secondary ${p === page ? "active" : ""}`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <span className={`dots ${showRightDots ? "visible" : ""}`}>…</span>

        <button
          className="btn btn--secondary"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight size={18} />
        </button>

        <button
          className="btn btn--secondary"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </>
  );
}