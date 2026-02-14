import { useDrag, useDrop } from "react-dnd";
import { DND_TYPES } from "./dnd.types";
import type { DragImageItem } from "./dnd.types";
import { useRef } from "react";
import "./TierImageCard.css";

type Props = {
  // Id de l'image dans la tierlist
  tierImageId: string;
  // Nom de l'image
  title: string;
  // Chemin vers le fichier de l'image
  filePath: string;
  // Ligne dans laquelle est l'image
  rowId: string | null;
  // Position de l'image dans la ligne
  index: number;
  // Fonction qui gère le mouvement de l'image dans une ligne avec 
  // l'Id de l'image, l'index dans la ligne et l'Id de la ligne
  moveImageOnRow: (
    draggedId: string,
    targetIndex: number,
    rowId: string | null
  ) => void;
};

export default function TierImageCard({
  tierImageId,
  title,
  filePath,
  rowId,
  index,
  moveImageOnRow
}: Props) {
  // Référence vers le DOM pour permettre à react-dnd d’attacher le drag et le drop
  const ref = useRef<HTMLDivElement>(null);
  

  /* Drag */
  const [, drag] = useDrag({
    // Les drops qui acceptent ce type pourront recevoir l'objet
    type: DND_TYPES.IMAGE,
    // Informations dynamiques de l'item draggé
    item: { tierImageId, rowId, index }
  });

  
  /* Drop */
  const [, drop] = useDrop<DragImageItem>({
    // N'accepte que les images
    accept: DND_TYPES.IMAGE,
    // Appelé a chaque frame quand un objet le survole
    hover(item) {
      if (!ref.current) return;
      // Si on survole la position actuelle de l'image, ne fait rien
      if (item.tierImageId === tierImageId) return;
      // Si on change de row, ne fait rien (changement de row géré ailleurs)
      if (item.rowId !== rowId) return;

      // Réorganise les images dans la row
      moveImageOnRow(item.tierImageId, index, rowId);
      item.index = index;
    }
  });

  // On attache le drag et le drop a l'element TierImageCard
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="tierlist-image-wrapper"
    >
      <img src={filePath} alt={title} />
      <div className="tierlist-image-overlay">{title}</div>
    </div>
  );
}