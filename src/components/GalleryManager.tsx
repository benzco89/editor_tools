import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Octokit } from "@octokit/rest";
import ImageManager from './ImageManager';

const GalleryManager: React.FC = () => {
  const [token, setToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleTokenSubmit = async () => {
    setIsLoading(true);
    try {
      const octokit = new Octokit({ auth: token });
      await octokit.users.getAuthenticated();
      setIsTokenValid(true);
      setSnackbarMessage('הטוקן תקין ונשמר בהצלחה');
      setIsSnackbarOpen(true);
    } catch (error) {
      setIsTokenValid(false);
      setSnackbarMessage('הטוקן אינו תקין. אנא נסה שנית.');
      setIsSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ direction: 'rtl', textAlign: 'right' }}>
      <Typography variant="h5" gutterBottom>
        ניהול גלריית תמונות
      </Typography>
      <Box display="flex" alignItems="flex-start">
        <TextField
          fullWidth
          label="GitHub Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
          margin="normal"
          InputProps={{ style: { textAlign: 'right' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <Button 
          variant="contained" 
          onClick={handleTokenSubmit} 
          sx={{ mr: 2, mt: 2, height: 56 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'אימות טוקן'}
        </Button>
        {isTokenValid !== null && (
          isTokenValid ? (
            <CheckCircleIcon color="success" sx={{ mr: 2, mt: 3 }} />
          ) : (
            <CancelIcon color="error" sx={{ mr: 2, mt: 3 }} />
          )
        )}
      </Box>
      {isTokenValid && <ImageManager token={token} />}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default GalleryManager;