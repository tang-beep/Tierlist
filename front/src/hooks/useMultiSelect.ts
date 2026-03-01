import { useState, useMemo } from "react";

/* Hook qui permet de gérer la selection d'images */

export function useMultiSelect<T extends { id: number }>(filteredItems: T[]) {

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Quand on clique sur une image pour la selectionner / déselectionner
  const toggle = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  
  const filteredIds = useMemo(
    () => filteredItems.map(item => item.id),
    [filteredItems]
  );

  // Calcule si les images filtrées sont toutes selectionnées
  const allSelected =
    filteredIds.length > 0 &&
    filteredIds.every(id => selectedIds.includes(id));

  // Selectionne / deselectionne toutes les filtrées
  // Si toutes les images filtrées sont sélectionnées, on les désélectionne
  // Sinon, on sélectionne celles qui ne le sont pas encore.

  const toggleAll = () => {
    if (filteredIds.length === 0) return;

    if (allSelected) {
      setSelectedIds(prev =>
        prev.filter(id => !filteredIds.includes(id))
      );
    } else {
      setSelectedIds(prev => [
        ...prev,
        ...filteredIds.filter(id => !prev.includes(id))
      ]);
    }
  };

  return {
    selectedIds,
    toggle,
    toggleAll,
    allSelected,
    setSelectedIds
  };
}
