import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Octokit } from "@octokit/rest";

interface Image {
  id: string;
  name: string;
  program: string;
  url: string;
}

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
    fetchImages();
  }, []);

  const fetchImages = async () => {
    console.log('Attempting to fetch images...');
    console.log('REACT_APP_GITHUB_TOKEN exists:', process.env.REACT_APP_GITHUB_TOKEN ? 'Yes' : 'No');
    
    try {
      const octokit = new Octokit({ 
        auth: process.env.REACT_APP_GITHUB_TOKEN,
        userAgent: 'editor_tools v1.0.0'
      });

      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      console.log('API Response:', response);

      if ('content' in response.data) {
        const decodedContent = atob(response.data.content);
        const parsedImages: Image[] = JSON.parse(decodedContent);
        setImages(parsedImages);
        setFilteredImages(parsedImages);

        const uniquePrograms = Array.from(new Set(parsedImages.map(img => img.program)));
        setPrograms(uniquePrograms);
      } else {
        console.error('Unexpected response format:', response.data);
        setSnackbarMessage('תגובה לא צפויה מהשרת');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setSnackbarMessage('שגיאה בטעינת התמונות: ' + (error as Error).message);
      setSnackbarOpen(true);
    }
  };

  const handleProgramChange = (event: SelectChangeEvent<string>) => {
    const program = event.target.value;
    setSelectedProgram(program);
    if (program) {
      setFilteredImages(images.filter(img => img.program === program));
    } else {
      setFilteredImages(images);
    }
  };

  const handleImageClick = (image: Image) => {
    navigator.clipboard.writeText(image.url);
    setSnackbarMessage('הקישור הועתק ללוח');
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, direction: 'rtl', textAlign: 'right' }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="program-select-label" sx={{ right: 14, left: 'auto', transformOrigin: 'top right' }}>סנן לפי תוכנית</InputLabel>
        <Select
          labelId="program-select-label"
          value={selectedProgram}
          label="סנן לפי תוכנית"
          onChange={handleProgramChange}
          sx={{ 
            textAlign: 'right',
            '& .MuiSelect-select': {
              paddingRight: '14px',
              paddingLeft: '32px',
            },
            '& .MuiSelect-icon': {
              right: 'auto',
              left: '7px',
            },
          }}
        >
          <MenuItem value="">
            <em>הכל</em>
          </MenuItem>
          {programs.map((program) => (
            <MenuItem key={program} value={program}>{program}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={2}>
        {filteredImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card 
              onClick={() => handleImageClick(image)}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 0,
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  objectFit: 'cover',
                }}
                image={image.url}
                alt={image.name}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'right' }}>
                  {image.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                  {image.program}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default ImageGallery;
