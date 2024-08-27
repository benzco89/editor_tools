import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          כלי עריכה
        </Typography>
        <Button color="inherit" component={Link} to="/">
          דף הבית
        </Button>
        <Button color="inherit" component={Link} to="/logo-embedder">
          הטמעת לוגו
        </Button>
        <Button color="inherit" component={Link} to="/pdf-embedder">
          הטמעת PDF
        </Button>
        <Button color="inherit" component={Link} to="/file-converter">
          המרת קבצים
        </Button>
        {/* <Button color="inherit" component={Link} to="/file-compressor">
          דחיסת קבצים
        </Button> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;