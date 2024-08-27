import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ארגז כלים לעורכי חדשות דיגיטליות
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            בית
          </Button>
          <Button color="inherit" component={RouterLink} to="/pdf-embedder">
            הטמעת PDF
          </Button>
          <Button color="inherit" component={RouterLink} to="/image-processor">
            עיבוד תמונה
          </Button>
          <Button color="inherit" component={RouterLink} to="/file-converter">
            המרת קבצים
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;