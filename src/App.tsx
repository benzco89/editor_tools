import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LogoEmbedder from './pages/LogoEmbedder';
import PdfEmbedder from './pages/PdfEmbedder';
import FileConverter from './pages/FileConverter';
import ImageCompression from './pages/ImageCompression';
import ImageGallery from './pages/ImageGallery';
import GalleryManager from './pages/GalleryManager';

function App() {
  return (
    <BrowserRouter basename="/editor_tools">
      <div className="App">
        <header className="bg-white shadow-md p-4">
          <Link to="/" className="flex items-center">
            <img src="./kan-news-logo.jpg" alt="כאן חדשות" className="h-10 mr-2" />
            <span className="text-xl font-bold text-primary">כלי עזר</span>
          </Link>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logo-embedder" element={<LogoEmbedder />} />
          <Route path="/pdf-embedder" element={<PdfEmbedder />} />
          <Route path="/file-converter" element={<FileConverter />} />
          <Route path="/image-compression" element={<ImageCompression />} />
          <Route path="/image-gallery" element={<ImageGallery />} />
          <Route path="/gallery-manager" element={<GalleryManager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

