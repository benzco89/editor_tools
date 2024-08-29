import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import ImageManager from './ImageManager';

const GalleryManager: React.FC = () => {
  const [token, setToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  const handleTokenSubmit = () => {
    // כאן תוכל להוסיף לוגיקה לאימות הטוקן
    setIsTokenValid(true);
  };

  return (
    <Box>
      <TextField
        label="GitHub Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        type="password"
      />
      <Button onClick={handleTokenSubmit}>אימות טוקן</Button>
      {isTokenValid && <ImageManager token={token} />}
    </Box>
  );
};

export default GalleryManager;