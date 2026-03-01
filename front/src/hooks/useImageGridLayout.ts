import { useEffect, useRef, useState } from "react";

type Params = {
  // Nombre de lignes
  rows: number;
  // Taille des images
  cardSize: number;
  // Espacement des images
  gap: number;
  // Permet de recalculer si le nb d'images change
  dependency?: number;
};

export function useImageGridLayout({
  rows,
  cardSize,
  gap, 
  dependency
}: Params) {
  // Pour connaitre la taille reelle du conteneur
  const containerRef = useRef<HTMLDivElement>(null);
  // Valeur minimale de 1 pour éviter une valeur invalide 
  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    const compute = () => {
      // Protéger pour le premier render
      if (!containerRef.current) return;

      // Taille d'un rem
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const width = containerRef.current.offsetWidth / rootFontSize;
      // On calcule le nombre d'images qui peuvent passer sur une ligne en 
      // fonction de la place dispo, de la taille des images et de l'espacement
      const cols = Math.max(1, Math.floor((width + gap) / (cardSize + gap)));

      setPageSize(cols * rows);
    };

    compute();
    // Recalculer si la fenetre change de taille
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [rows, cardSize, gap, dependency]);

  return {
    // Conteneur du DOM
    containerRef,
    // Nombre d'images par page
    pageSize
  };
}
