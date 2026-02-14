/* Fonction qui permet de renvoyer les objets a afficher selon la page */

export function paginate<T>(
  // Liste des objets à paginer
  items: T[],
  // Page courante
  page: number,
  // Taille des pages (nombres d'objets)
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const pagedItems = items.slice((safePage - 1) * pageSize, safePage * pageSize);

  return {
    // Objets à afficher sur la page
    pagedItems,
    // Nombre total de pages
    totalPages,
    // Page safe pour ne pas avoir de problème
    safePage
  };
}
  