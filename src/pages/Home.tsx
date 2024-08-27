import React from 'react';
import { Typography, Grid, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        ברוכים הבאים לארגז הכלים לעורכי חדשות דיגיטליות
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              הטמעת PDF
            </Typography>
            <Button component={RouterLink} to="/pdf-embedder" variant="contained">
              התחל
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              עיבוד תמונה
            </Typography>
            <Button component={RouterLink} to="/image-processor" variant="contained">
              התחל
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              המרת קבצים
            </Typography>
            <Button component={RouterLink} to="/file-converter" variant="contained">
              התחל
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;