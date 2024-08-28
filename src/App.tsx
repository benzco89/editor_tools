import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Home from './pages/Home';
import LogoEmbedder from './pages/LogoEmbedder';
import PdfEmbedder from './pages/PdfEmbedder';
import FileConverter from './pages/FileConverter';
import ImageCompression from './pages/ImageCompression';
import ImageGallery from './pages/ImageGallery';
import GalleryManager from './pages/GalleryManager';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
        },
      },
    },
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {[
          { text: 'דף הבית', path: '/' },
          { text: 'הטמעת לוגו', path: '/logo-embedder' },
          { text: 'הטמעת PDF', path: '/pdf-embedder' },
          { text: 'המרת קבצים', path: '/file-converter' },
          { text: 'דחיסת תמונות', path: '/image-compression' },
          { text: 'גלריית תמונות', path: '/image-gallery' },
          { text: 'ניהול גלריה', path: '/gallery-manager' },
        ].map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <CacheProvider value={cacheRtl}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router basename="/editor_tools">
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <AppBar position="static">
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
                    <img src="./kan-news-logo.jpg" alt="כאן חדשות" style={{ height: '40px', marginLeft: '10px' }} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>כלי עזר</span>
                  </Link>
                </Toolbar>
              </AppBar>
              <nav aria-label="תפריט ראשי">
                <Drawer
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                  }}
                >
                  {drawer}
                </Drawer>
              </nav>
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/logo-embedder" element={<LogoEmbedder />} />
                  <Route path="/pdf-embedder" element={<PdfEmbedder />} />
                  <Route path="/file-converter" element={<FileConverter />} />
                  <Route path="/image-compression" element={<ImageCompression />} />
                  <Route path="/image-gallery" element={<ImageGallery />} />
                  <Route path="/gallery-manager" element={<GalleryManager />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

export default App;

