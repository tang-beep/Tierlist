import { Routes, Route } from "react-router-dom";

import GalleryPage from "./pages/GalleryPage";
import TierListCreatePage from "./pages/TierListCreatePage";
import TierListHomePage from "./pages/TierListHomePage";
import TierListEditorPage from "./pages/TierListEdition/TierListEditorPage";
import TierListAddImagesPage from "./pages/TierListEdition/TierListAddImagesPage";
import TierListRemoveImagesPage from "./pages/TierListEdition/TierListRemoveImagesPage";

import Header from "./components/layout/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/tierlists" element={<TierListHomePage />} />
        <Route path="/create" element={<TierListCreatePage />} />
        <Route path="/tierlists/:id" element={<TierListEditorPage />} />
        <Route path="/tierlists/:id/add-images" element={<TierListAddImagesPage />} />
        <Route path="/tierlists/:id/remove-images" element={<TierListRemoveImagesPage />} />
      </Routes>
    </>
  );
}

export default App;
