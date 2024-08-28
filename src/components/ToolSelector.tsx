import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const tools = [
  { name: 'דחיסת תמונה', path: '/image-compression', icon: '🖼️' },
  { name: 'הטמעת לוגו', path: '/logo-embedder', icon: '🔠' },
  { name: 'הטמעת PDF', path: '/pdf-embedder', icon: '📄' },
  { name: 'המרת קבצים', path: '/file-converter', icon: '🔄' },
  { name: 'גלריית תמונות לפושים', path: '/image-gallery', icon: '🖼️' },
  { name: 'ניהול גלריית תמונות', path: '/gallery-manager', icon: '⚙️' },
];

const ToolSelector: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {tools.map((tool) => (
        <Grid item xs={12} sm={6} md={4} key={tool.path}>
          <Card component={Link} to={tool.path} sx={{ textDecoration: 'none', height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Box sx={{ fontSize: '3rem', mb: 2 }}>{tool.icon}</Box>
              <Typography variant="h6" align="center" color="text.primary">
                {tool.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ToolSelector;