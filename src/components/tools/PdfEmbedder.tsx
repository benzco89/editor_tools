import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function PdfEmbedder() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const generateEmbedCode = () => {
    if (!pdfUrl) return;

    let fileId = '';
    if (pdfUrl.includes('drive.google.com')) {
      fileId = pdfUrl.split('/d/')[1].split('/')[0];
    } else {
      fileId = pdfUrl;
    }

    const code = `<iframe src="https://drive.google.com/file/d/${fileId}/preview" width="100%" height="480"></iframe>`;
    setEmbedCode(code);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        הטמעת PDF
      </Typography>
      <TextField
        fullWidth
        label="קישור ל-PDF"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={generateEmbedCode} sx={{ mt: 2 }}>
        צור קוד הטמעה
      </Button>
      {embedCode && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">קוד הטמעה:</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={embedCode}
            InputProps={{ readOnly: true }}
          />
        </Box>
      )}
    </Box>
  );
}

export default PdfEmbedder;