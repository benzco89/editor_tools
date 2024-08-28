const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let images = [
  // ... התמונות הראשוניות שלך
];

app.get('/api/images', (req, res) => {
  res.json(images);
});

app.post('/api/images', (req, res) => {
  const newImage = { id: Date.now().toString(), ...req.body };
  images.push(newImage);
  res.status(201).json(newImage);
});

app.delete('/api/images/:id', (req, res) => {
  images = images.filter(image => image.id !== req.params.id);
  res.status(204).send();
});

app.put('/api/images/reorder', (req, res) => {
  images = req.body.images;
  res.status(200).json(images);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));