export type TierRow = {
  id: string;
  name: string;
  color: string;
  order: number;
};

export type TierListImage = {
  id: string;
  imageId: number;
  title: string;
  filePath: string;
  tag: string;
  tierRowId: string | null;
};

export type TierList = {
  id: string;
  name: string;
  rows: TierRow[];
  images: TierListImage[];

  createdAt: string;
  updatedAt?: string;
};
