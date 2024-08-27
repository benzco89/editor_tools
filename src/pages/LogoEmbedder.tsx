import React, { useState, useCallback } from 'react';
import { Button, Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/imageUtils';

function LogoEmbedder() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSelectedFile(reader.result as string));
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const embedLogo = async () => {
    if (selectedFile && croppedAreaPixels && selectedLogo) {
      try {
        const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
        // Here you would typically send the cropped image and selected logo to a server
        // for processing. For now, we'll just set the cropped image as the result.
        setProcessedImageUrl(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        הטמעת לוגו
      </Typography>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          בחר תמונה
        </Button>
      </label>
      {selectedFile && (
        <Box sx={{ position: 'relative', width: '100%', height: 400, mt: 2 }}>
          <Cropper
            image={selectedFile}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Box>
      )}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="logo-select-label">בחר לוגו</InputLabel>
        <Select
          labelId="logo-select-label"
          value={selectedLogo}
          label="בחר לוגו"
          onChange={(e) => setSelectedLogo(e.target.value as string)}
        >
          <MenuItem value="logo1.png">לוגו 1</MenuItem>
          <MenuItem value="logo2.png">לוגו 2</MenuItem>
          {/* Add more logo options as needed */}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={embedLogo}
        disabled={!selectedFile || !selectedLogo}
        sx={{ mt: 2 }}
      >
        הטמע לוגו
      </Button>
      {processedImageUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">תמונה מעובדת:</Typography>
          <img src={processedImageUrl} alt="Processed" style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </Paper>
  );
}

export default LogoEmbedder;