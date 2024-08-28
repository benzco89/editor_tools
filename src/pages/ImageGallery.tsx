import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Octokit } from "@octokit/rest";

interface Image {
  id: string;
  name: string;
  title: string;
  program: string;
  url: string;
  link: string;
}

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
const owner = 'benzco89';
const repo = 'editor_tools';
const path = 'gallery_data.json';

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    console.log('ImageGallery: Component mounted, fetching images...');
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      setFilteredImages(images.filter(image => image.program === selectedProgram));
    } else {
      setFilteredImages(images);
    }
  }, [selectedProgram, images]);

  const fetchImages = async () => {
    console.log('ImageGallery: Attempting to fetch images from GitHub...');
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      console.log('ImageGallery: Received response from GitHub:', response);

      if ('content' in response.data) {
        const content = decodeURIComponent(escape(atob(response.data.content)));
        console.log('ImageGallery: Decoded content:', content);
        const parsedImages = JSON.parse(content);
        console.log('ImageGallery: Parsed images:', parsedImages);
        setImages(parsedImages);
        setFilteredImages(parsedImages);
        const uniquePrograms = Array.from(new Set(parsedImages.map((image: Image) => image.program))) as string[];
        setPrograms(uniquePrograms);
      } else {
        console.error('ImageGallery: Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('ImageGallery: Error fetching images:', error);
      setSnackbarMessage('שגיאה בטעינת התמונות');
      setSnackbarOpen(true);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setSnackbarMessage('הקישור הועתק ללוח');
      setSnackbarOpen(true);
    });
  };

  console.log('ImageGallery: Rendering with images:', filteredImages);

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom align="center">גלריית תמונות לפושים</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="program-select-label">סנן לפי תוכנית</InputLabel>
        <Select
          labelId="program-select-label"
          id="program-select"
          value={selectedProgram}
          label="סנן לפי תוכנית"
          onChange={(e) => setSelectedProgram(e.target.value as string)}
        >
          <MenuItem value="">הכל</MenuItem>
          {programs.map((program) => (
            <MenuItem key={program} value={program}>{program}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={2}>
        {filteredImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card 
              onClick={() => handleCopyUrl(image.url)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={image.url}
                alt={image.title}
                sx={{
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="subtitle1" align="center">
                  {image.name} - {image.title}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  {image.program}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default ImageGallery;