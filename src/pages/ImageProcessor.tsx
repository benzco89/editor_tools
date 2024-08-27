import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import Jimp from 'jimp';

function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logos, setLogos] = useState<string[]>(['logo1.png', 'logo2.png']); // Hardcoded logos
  const [selectedLogo, setSelectedLogo] = useState<string>('');
  const [processingType, setProcessingType] = useState<'logo' | 'compress'>('logo');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleProcessingTypeChange = (event: SelectChangeEvent<'logo' | 'compress'>) => {
    setProcessingType(event.target.value as 'logo' | 'compress');
  };

  const handleLogoChange = (event: SelectChangeEvent<string>) => {
    setSelectedLogo(event.target.value);
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const image = await Jimp.read(Buffer.from(buffer));

      if (processingType === 'logo' && selectedLogo) {
        const logo = await Jimp.read(`${process.env.PUBLIC_URL}/logos/${selectedLogo}`);
        logo.resize(image.getWidth(), Jimp.AUTO);
        image.composite(logo, 0, 0, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 0.8,
          opacityDest: 1.0
        });
      } else {
        image.resize(1600, 900, Jimp.RESIZE_BILINEAR);
        image.quality(80);
      }

      const processedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      const blob = new Blob([processedBuffer], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
    } catch (error) {
      console.error('שגיאה בעיבוד התמונה:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Typography variant="body1" sx={{ mt: 2 }}>
          נבחר: {selectedFile.name}
        </Typography>
      )}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>סוג עיבוד</InputLabel>
        <Select
          value={processingType}
          onChange={handleProcessingTypeChange}
        >
          <MenuItem value="logo">הטמעת לוגו</MenuItem>
          <MenuItem value="compress">דחיסת תמונה</MenuItem>
        </Select>
      </FormControl>

      {processingType === 'logo' && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>בחר לוגו</InputLabel>
          <Select
            value={selectedLogo}
            onChange={handleLogoChange}
          >
            {logos.map((logo) => (
              <MenuItem key={logo} value={logo}>{logo}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        onClick={processImage}
        disabled={!selectedFile || isLoading || (processingType === 'logo' && !selectedLogo)}
        sx={{ mt: 2 }}
      >
        עבד תמונה
      </Button>
      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      {processedImageUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">תמונה מעובדת:</Typography>
          <img src={processedImageUrl} alt="תמונה מעובדת" style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </Paper>
  );
}

export default ImageProcessor;