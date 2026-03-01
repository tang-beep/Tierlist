import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TierListAddOrRemovePage from "./TierListAddOrRemovePage";

import { fetchImages } from "../../api/images.api";
import { fetchTierList, addImagesToTierList } from "../../api/tierlists.api";

import type { ImageItem } from "../../types";

export default function TierListAddImagesPage() {
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const tierListId = id;
    
    async function load() {
      try {
        setLoading(true);

        const [allImages, tierList] = await Promise.all([
          fetchImages(),
          fetchTierList(tierListId)
        ]);

        const usedIds = tierList.images.map(i => i.imageId);
        setImages(allImages.filter(img => !usedIds.includes(img.id)));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return (
    <TierListAddOrRemovePage
      title="Ajouter des images"
      images={images}
      loading={loading}
      actionVariant="primary"
      actionLabel={(count) => `Ajouter ${count} images`}
      onConfirm={addImagesToTierList}
    />
  );
}