import { useDrop } from "react-dnd";
import type { DragImageItem } from "./dnd.types";
import { DND_TYPES } from "./dnd.types";
import "./TierRowDropZone.css";

type Props = {
  // Id de la ligne, null si c'est la zone ou les images ne sont pas assignées
  rowId: string | null;
  // Fonction qui gere quand on change une image de ligne
  changeRow: (tierImageId: string, rowId: string |  null) => void;
  // Elements a afficher dans la DropZone
  children: React.ReactNode;
};

export default function TierRowDropZone({
  rowId,
  changeRow,
  children
}: Props) {
  
  /* Drop en retournant des booleens pour savoir si une zone est 
  en train d'être survolée */
  const [{ isOver, canDrop }, dropRef] = useDrop<
    DragImageItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >(() => ({
    // N'accepte que les images
    accept: DND_TYPES.IMAGE,
    // S'execute quand on lache la souris, change la ligne de l'image
    drop: item => changeRow(item.tierImageId, rowId),
    // Permet de savoir si la zone est survolée
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  return (
    <div
      ref={(node) => {
        dropRef(node);
      }}
      className={`tierlist-row-images ${isOver && canDrop ? "tierlist-row-hover" : ""}`}
    >
      {children}
    </div>
  );
}
