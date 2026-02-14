/* 
Retourne la fenêtre de pagination à afficher :
- max 5 numéros de pages
- indicateurs pour afficher des ... à gauche/droite
*/


export function getPageWindow(page: number, totalPages: number) {
    // Cas ou il n'y a pas beaucoup de pages
    if (totalPages <= 5) {
      return {
        pages: Array.from({ length: totalPages }, (_, i) => i + 1),
        showLeftDots: false,
        showRightDots: false
      };
    }
  
    // Cas ou on est dans les premieres pages
    if (page <= 3) {
      return {
        pages: [1, 2, 3, 4, 5],
        showLeftDots: false,
        showRightDots: true
      };
    }
  
    // Cas ou on est a la fin des pages
    if (page >= totalPages - 2) {
      return {
        pages: [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        ],
        showLeftDots: true,
        showRightDots: false
      };
    }
  
    return {
      // Numéros des pages à afficher dans le cas général
      pages: [page - 2, page - 1, page, page + 1, page + 2],
      // Est ce qu'il faut des ... a gauche / a droite
      showLeftDots: true,
      showRightDots: true
    };
  }
  