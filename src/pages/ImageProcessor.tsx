import React, { useState, useCallback } from 'react';
import { Button, Box, Typography, Paper, Slider } from '@mui/material';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/imageUtils';

function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

  const showCroppedImage = useCallback(async () => {
    try {
      if (selectedFile && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          selectedFile,
          croppedAreaPixels
        );
        console.log('donee', { croppedImage });
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, selectedFile]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        עיבוד תמונה
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
      <Box sx={{ mt: 2 }}>
        <Typography>זום</Typography>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom as number)}
        />
      </Box>
      <Button
        variant="contained"
        onClick={showCroppedImage}
        disabled={!selectedFile}
        sx={{ mt: 2 }}
      >
        עבד תמונה
      </Button>
    </Paper>
  );
}

export default ImageProcessor;