import { Routes, Route, Link } from "react-router-dom";
import GalleryPage from "./pages/GalleryPage";
import TierListCreatePage from "./pages/TierListCreatePage";
import TierListHomePage from "./pages/TierListHomePage";
import TierListEditorPage from "./pages/TierListEditorPage";
import TierListAddImagesPage from "./pages/TierListAddImagesPage";
import TierListRemoveImagesPage from "./pages/TierListRemoveImagesPage";

function App() {
  return (
    <>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Galerie</Link>
        {" | "}
        <Link to="/tierlists">Tierlists</Link>
        {" | "}
        <Link to="/tierlists/create">Créer une tierlist</Link>
      </nav>

      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/tierlists" element={<TierListHomePage />} />
        <Route path="/tierlists/create" element={<TierListCreatePage />} />
        <Route path="/tierlists/:id" element={<TierListEditorPage />} />
        <Route path="/tierlists/:id/add-images" element={<TierListAddImagesPage />} />
        <Route path="/tierlists/:id/remove-images" element={<TierListRemoveImagesPage />} />
      </Routes>
    </>
  );
}

export default App;
