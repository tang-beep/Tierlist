import { useState } from "react";

/* Hook qui permet de gérer la selection d'images */

export function useMultiSelect() {

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Quand on clique sur une image pour la selectionner / déselectionner
  const toggle = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return {
    selectedIds,
    toggle,
    setSelectedIds
  };
}
