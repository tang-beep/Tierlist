import { useRef, useState } from "react";
import PreviewList from "./PreviewList";
import TagSelector from "../imagesDisplay/TagSelector";
import "./UploadForm.css";

import { uploadImages } from "../../api/images.api";

/* Composant qui gère l'upload de nouvelles images dans la base de données */

type Props = {
  // Action a effectuer quand il y a un upload
  onUploaded: () => void;
  // Listes des tags deja disponible a affecter aux images uploaded
  availableTags: string[];
};

export default function UploadForm({ onUploaded, availableTags }: Props) {
  // Saisie des noms des images, séparés par des virgules
  const [titlesInput, setTitlesInput] = useState("");
  // Saisie de nouveaux tags pour les images
  const [tagInput, setTagInput] = useState("");

  // Input des fichiers
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fichiers en attente d'upload, affichés en preview
  const [files, setFiles] = useState<File[]>([]);
  // Liste des previews
  const [previews, setPreviews] = useState<string[]>([]);

  // Tags selectionnés
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Message pour informer l'utilisateur d'une erreur ou de la reussite de l'upload
  const [message, setMessage] = useState("");


  // Gestion d'ajout de fichiers à upload
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [
      ...prev,
      ...newFiles.map(f => URL.createObjectURL(f))
    ]);
  };

  // Supprimer toutes les images en preview
  const clearAll = () => {
    previews.forEach(p => URL.revokeObjectURL(p));
    setFiles([]);
    setPreviews([]);
    setTitlesInput("");
    setTagInput("");
    setSelectedTags([]);
    setMessage("");
  };

  // Supprimer une image en preview
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (files.length === 0) {
      setMessage("Sélectionne au moins une image");
      return;
    }

    // Les noms d'image sont saisis séparés d'une virgule
    const titles = titlesInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    // Verification qu'on a bien le bon nombre de noms d'images
    if (titles.length !== files.length) {
      setMessage(
        `Il faut ${files.length} titres (actuellement ${titles.length})`
      );
      return;
    }

    // Les tags sont saisis en en tapant de nouveaux
    const manualTags = tagInput.trim() == "" 
      ? [] : tagInput.split(",").map(t => t.trim()).filter(Boolean);

    // On réunit les tags tapés et les tags cliqués (deja existants)
    const finalTagsArray = Array.from(
      new Set([...manualTags, ...selectedTags])
    );

    if (finalTagsArray.length === 0) {
      setMessage("Ajoute au moins un tag (manuel ou sélectionné)");
      return;
    }

    // On doit envoyer les tags dans une seule chaine
    const finalTags = finalTagsArray.join(",");

    setMessage("Upload en cours...");

    // Appel API
    try {
      await uploadImages(files, titles, finalTags);
    
      setMessage("Upload terminé !");
      onUploaded();
      clearAll();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue pendant l’upload"
      );
    }
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="upload-container card">
      <div className="title--principal">Uploader des images</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titres (séparés par ,)</label>
          <input
            className="input"
            value={titlesInput}
            onChange={e => setTitlesInput(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tags manuels (séparés par ,)</label>
          <input
            className="input"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
          />
        </div>

        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={tag =>
            setSelectedTags(prev =>
              prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
            )
          }
        />

        <div className="form-group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={e => handleFiles(e.target.files)}
            className="file-input-hidden"
          />

          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Choisir des images
          </button>

          {files.length > 0 && (
            <span className="file-count">
              {files.length} fichier(s) sélectionné(s)
            </span>
          )}
        </div>

        <button type="submit" className="btn btn--primary">Envoyer</button>

        {files.length > 0 && (
          <button 
            type="button" 
            onClick={clearAll}
            className="btn btn--secondary"
          >
            Tout enlever
          </button>
        )}
      </form>

      {message && <p className="upload-message">{message}</p>}

      <PreviewList previews={previews} removeImage={removeImage} />
    </div>
  );
}
