import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

function PdfEmbedder() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const generateEmbedCode = () => {
    if (!pdfUrl) return;

    let fileId = '';
    if (pdfUrl.includes('drive.google.com')) {
      fileId = pdfUrl.split('/d/')[1].split('/')[0];
      const code = `<iframe src="https://drive.google.com/file/d/${fileId}/preview" width="100%" height="480"></iframe>`;
      setEmbedCode(code);
    } else if (pdfUrl.includes('kan.org.il')) {
      const code = `<iframe src="${pdfUrl}" width="100%" height="480"></iframe>`;
      setEmbedCode(code);
    } else {
      setEmbedCode('קישור לא תקין. אנא השתמש בקישור מ-Google Drive או מהמערכת של כאן.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
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
    </Paper>
  );
}

export default PdfEmbedder;