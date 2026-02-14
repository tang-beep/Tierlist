import { useEffect, useRef, useState } from "react";

type Params = {
  // Nombre de lignes
  rows: number;
  // Taille des images
  cardSize: number;
  // Espacement des images
  gap: number;
};

export function useImageGridLayout({
  rows,
  cardSize,
  gap
}: Params) {
  // Pour connaitre la taille reelle du conteneur
  const containerRef = useRef<HTMLDivElement>(null);
  // Valeur minimale de 1 pour éviter une valeur invalide 
  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    const compute = () => {
      // Protéger pour le premier render
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      // On calcule le nombre d'images qui peuvent passer sur une ligne en 
      // fonction de la place dispo, de la taille des images et de l'espacement
      const cols = Math.max(1, Math.floor((width + gap) / (cardSize + gap)));

      setPageSize(cols * rows);
    };

    compute();
    // Recalculer si la fenetre change de taille
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [rows, cardSize, gap]);

  const gridHeight =
    rows * cardSize + (rows - 1) * gap;

  return {
    // Conteneur du DOM
    containerRef,
    // Nombre d'images par page
    pageSize,
    // Hauteur de la grille
    gridHeight
  };
}
