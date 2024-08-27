import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header';
import Home from './pages/Home';
import PdfEmbedder from './pages/PdfEmbedder';
import LogoEmbedder from './pages/LogoEmbedder';
import ImageResizer from './pages/ImageResizer';
import FileConverter from './pages/FileConverter';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pdf-embedder" element={<PdfEmbedder />} />
            <Route path="/logo-embedder" element={<LogoEmbedder />} />
            <Route path="/image-resizer" element={<ImageResizer />} />
            <Route path="/file-converter" element={<FileConverter />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;