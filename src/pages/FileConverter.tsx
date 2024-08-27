import React, { useState } from 'react';
import { Button, Box, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import Jimp from 'jimp';

function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFormatChange = (event: SelectChangeEvent<string>) => {
    setTargetFormat(event.target.value);
  };

  const convertFile = async () => {
    if (!selectedFile || !targetFormat) return;

    setIsLoading(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const image = await Jimp.read(Buffer.from(buffer));

      let mimeType;
      switch (targetFormat) {
        case 'jpg':
          mimeType = Jimp.MIME_JPEG;
          break;
        case 'png':
          mimeType = Jimp.MIME_PNG;
          break;
        default:
          throw new Error('Unsupported format');
      }

      const convertedBuffer = await image.getBufferAsync(mimeType);
      const blob = new Blob([convertedBuffer], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setConvertedFileUrl(url);
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
        <Typography variant="body1" sx={{ mt: 2 }}>
          נבחר: {selectedFile.name}
        </Typography>
      )}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="target-format-label">פורמט יעד</InputLabel>
        <Select
          labelId="target-format-label"
          value={targetFormat}
          label="פורמט יעד"
          onChange={handleFormatChange}
        >
          <MenuItem value="mp3">MP3</MenuItem>
          <MenuItem value="wav">WAV</MenuItem>
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
          <Button variant="contained" href={convertedFileUrl} download>
            הורד קובץ מומר
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default FileConverter;