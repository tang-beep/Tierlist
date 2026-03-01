import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TierListAddOrRemovePage from "./TierListAddOrRemovePage";

import { fetchTierList, removeImagesFromTierList } from "../../api/tierlists.api";

import type { TierListImage } from "../../types";

export default function TierListRemoveImagesPage() {
  const { id } = useParams<{ id: string }>();

  const [images, setImages] = useState<TierListImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const tierListId = id;

    async function load() {
      try {
        setLoading(true);
        const tierList = await fetchTierList(tierListId);

        setImages(tierList.images);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return (
    <TierListAddOrRemovePage
      title="Supprimer des images"
      images={images}
      loading={loading}
      actionVariant="danger"
      actionLabel={(count) => `Supprimer ${count} images`}
      onConfirm={removeImagesFromTierList}
    />
  );
}