import React from 'react';
import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface Image {
  id: string;
  name: string;
  program: string;
  url: string;
}

const GalleryManager = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // Assuming the JSON file is in the public folder
      const response = await fetch('/gallery_data.json');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newImages = Array.from(images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    setImages(newImages);
  };

  return (
    <Box sx={{ p: 3, direction: 'rtl', textAlign: 'right' }}>
      <Typography variant="h4" gutterBottom align="right">גלריית תמונות</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery-list">
          {(provided: DroppableProvided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image: Image, index: number) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided: DraggableProvided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        pr: 0,
                        pl: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <DragIndicatorIcon sx={{ ml: 2 }} />
                        <ListItemText 
                          primary={`${image.name} - ${image.program}`} 
                          secondary={image.url} 
                          primaryTypographyProps={{ style: { textAlign: 'right' } }}
                          secondaryTypographyProps={{ style: { direction: 'ltr', textAlign: 'right' } }}
                          sx={{ margin: 0 }}
                        />
                      </Box>
                      <Box>
                        <IconButton onClick={() => handleCopyUrl(image.url)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default GalleryManager;