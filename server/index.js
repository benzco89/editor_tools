const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Endpoint to get available logos
app.get('/api/logos', (req, res) => {
  console.log('Received request for logos');
  const logosDir = path.join(__dirname, 'logos');
  fs.readdir(logosDir, (err, files) => {
    if (err) {
      console.error('Error reading logos directory:', err);
      res.status(500).send('Error reading logos');
    } else {
      const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
      res.json(pngFiles);
    }
  });
});

app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
    let processedImage;
    if (req.body.processingType === 'logo') {
      const logoPath = path.join(__dirname, 'logos', req.body.logo);
      const inputImage = sharp(req.file.path);
      const metadata = await inputImage.metadata();
      
      // Resize logo to match the width of the input image
      const logo = await sharp(logoPath)
        .resize({ width: metadata.width, height: null, fit: 'inside' })
        .toBuffer();

      processedImage = await inputImage
        .composite([{ input: logo, gravity: 'center' }])
        .toBuffer();
    } else {
      processedImage = await sharp(req.file.path)
        .resize(1600, 900, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    res.contentType('image/jpeg').send(processedImage);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

app.post('/api/convert-file', upload.single('file'), (req, res) => {
  const { targetFormat } = req.body;
  const outputPath = path.join(__dirname, 'converted', `output.${targetFormat}`);

  if (targetFormat === 'mp3' || targetFormat === 'wav') {
    ffmpeg(req.file.path)
      .toFormat(targetFormat)
      .on('end', () => {
        res.download(outputPath);
      })
      .on('error', (err) => {
        console.error('Error converting audio:', err);
        res.status(500).send('Error converting audio');
      })
      .save(outputPath);
  } else if (targetFormat === 'jpg' || targetFormat === 'png') {
    sharp(req.file.path)
      .toFormat(targetFormat)
      .toFile(outputPath)
      .then(() => {
        res.download(outputPath);
      })
      .catch((err) => {
        console.error('Error converting image:', err);
        res.status(500).send('Error converting image');
      });
  } else {
    res.status(400).send('Unsupported format');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});