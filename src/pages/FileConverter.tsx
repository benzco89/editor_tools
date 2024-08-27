import React, { useState, useCallback } from 'react';
import { Button, Box, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/imageUtils';

function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleFormatChange = (event: SelectChangeEvent<string>) => {
    setTargetFormat(event.target.value);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const convertFile = async () => {
    if (!selectedFile || !targetFormat) return;

    setIsLoading(true);

    try {
      const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
      setConvertedFileUrl(croppedImage);
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        המרת קבצים
      </Typography>
      <input
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          בחר קובץ
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
        <InputLabel id="target-format-label">פורמט יעד</InputLabel>
        <Select
          labelId="target-format-label"
          value={targetFormat}
          label="פורמט יעד"
          onChange={handleFormatChange}
        >
          <MenuItem value="jpg">JPG</MenuItem>
          <MenuItem value="png">PNG</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={convertFile}
        disabled={!selectedFile || !targetFormat || isLoading}
        sx={{ mt: 2 }}
      >
        המר קובץ
      </Button>
      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      {convertedFileUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">קובץ מומר:</Typography>
          <Button variant="contained" href={convertedFileUrl} download={`converted.${targetFormat}`}>
            הורד קובץ מומר
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default FileConverter;