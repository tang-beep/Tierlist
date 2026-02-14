// Types pour le drag and drop

export const DND_TYPES = {
    IMAGE: "IMAGE"
};

export type DragImageItem = {
    // Id dans la tierlist
    tierImageId: string;
    // Dans quelle row est l'image
    rowId: string | null;
    // Position dans la row
    index: number;
};
