import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TierListAddOrRemovePage from "./TierListAddOrRemovePage";

import { fetchTierList, removeImagesFromTierList } from "../../api/tierlists.api";

import type { TierListImage } from "../../types";

import { useTranslation } from "../../translations/useTranslation";

export default function TierListRemoveImagesPage() {
  const { id } = useParams<{ id: string }>();

  const [images, setImages] = useState<TierListImage[]>([]);
  const [loading, setLoading] = useState(true);

  const trans = useTranslation();

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
      title={trans("tlEdition.removeImgTitle")}
      images={images}
      loading={loading}
      actionVariant="danger"
      actionLabel={(count) => trans("tlEdition.removeImgs", {count: count})}
      onConfirm={removeImagesFromTierList}
    />
  );
}