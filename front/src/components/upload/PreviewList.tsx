import "./PreviewList.css";
import { useTranslation } from "../../translations/useTranslation";

/* Composant qui affiche les images en prévisualisation
avant leur upload */

type Props = {
  // Liste des src des images a afficher en preview
  previews: string[];
  // Fonction de suppression d'une image en preview
  removeImage: (i: number) => void;
};

export default function PreviewList({ previews, removeImage }: Props) {
  if (previews.length === 0) return null;

  const trans = useTranslation();

  return (
    <>
      <div className="title--secondary"> {trans("upload.preview")} </div>
      <div className="preview-list">
        {previews.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`preview-${i}`}
            onClick={() => removeImage(i)}
            className="preview-item"
          />
        ))}
      </div>
    </>
  );
}
