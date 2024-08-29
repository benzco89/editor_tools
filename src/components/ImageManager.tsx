import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Octokit } from "@octokit/rest";

interface Image {
  id: string;
  name: string;
  program: string;
  url: string;
}

interface ImageManagerProps {
  token: string;
}

const ImageManager: React.FC<ImageManagerProps> = ({ token }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [newImage, setNewImage] = useState<Image>({ id: '', name: '', program: '', url: '' });
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
  const owner = 'benzco89';
  const repo = 'editor_tools';
  const path = 'gallery_data.json';

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      if ('content' in response.data) {
        const content = decodeURIComponent(escape(atob(response.data.content)));
        setImages(JSON.parse(content));
      } else {
        console.error('Unexpected response format');
      }
    } catch (error) {
      if ((error as any).status === 404) {
        console.warn('File not found, creating new file with empty array');
        await updateGalleryData([]);
        setImages([]);
      } else {
        console.error('Error fetching images:', error);
        setSnackbarMessage('שגיאה בטעינת התמונות');
        setSnackbarOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    setImages([...images, { ...newImage, id: Date.now().toString() }]);
    setNewImage({ id: '', name: '', program: '', url: '' });
  };

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setIsDialogOpen(true);
  };

  const handleUpdateImage = () => {
    if (!editingImage) return;
    setImages(images.map(img => img.id === editingImage.id ? editingImage : img));
    setIsDialogOpen(false);
    setEditingImage(null);
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setSnackbarMessage('הקישור הועתק ללוח');
      setSnackbarOpen(true);
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
  };

  const handleSaveChanges = async () => {
    try {
      await updateGalleryData(images);
      setSnackbarMessage('השינויים נשמרו בהצלחה');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSnackbarMessage('אירעה שגיאה בשמירת השינויים');
      setSnackbarOpen(true);
    }
  };

  const updateGalleryData = useCallback(async (updatedImages: Image[]) => {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedImages, null, 2))));
    const currentFile = await octokit.repos.getContent({ owner, repo, path });
    if ('sha' in currentFile.data) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: 'Update gallery data',
        content,
        sha: currentFile.data.sha,
      });
    } else {
      console.error('Unexpected response format');
    }
  }, [octokit, owner, repo, path]);

  return (
    <Box sx={{ direction: 'rtl', textAlign: 'right' }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          הוספת תמונה חדשה
        </Typography>
        <TextField
          fullWidth
          label="שם"
          value={newImage.name}
          onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
          margin="normal"
          InputProps={{ style: { textAlign: 'right' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <TextField
          fullWidth
          label="תוכנית"
          value={newImage.program}
          onChange={(e) => setNewImage({ ...newImage, program: e.target.value })}
          margin="normal"
          InputProps={{ style: { textAlign: 'right' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <TextField
          fullWidth
          label="URL"
          value={newImage.url}
          onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
          margin="normal"
          InputProps={{ style: { textAlign: 'right', direction: 'ltr' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <Button variant="contained" onClick={handleAddImage} sx={{ mt: 2 }}>
          הוספת תמונה
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        רשימת תמונות
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ border: '1px solid #ddd', my: 1, borderRadius: 1, display: 'flex', alignItems: 'center', pr: 0, pl: 2 }}
                      >
                        <Box {...provided.dragHandleProps} sx={{ mr: 2, cursor: 'move' }}>
                          <DragIndicatorIcon />
                        </Box>
                        <ListItemText 
                          primary={`${image.name} - ${image.program}`}
                          secondary={image.url}
                          primaryTypographyProps={{ style: { textAlign: 'right' } }}
                          secondaryTypographyProps={{ style: { direction: 'ltr', textAlign: 'right' } }}
                          sx={{ margin: 0, flexGrow: 1 }}
                        />
                        <IconButton onClick={() => handleCopyUrl(image.url)}>
                          <ContentCopyIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditImage(image)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteImage(image.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>עריכת תמונה</DialogTitle>
        <DialogContent>
          {editingImage && (
            <>
              <TextField
                fullWidth
                label="שם"
                value={editingImage.name}
                onChange={(e) => setEditingImage({ ...editingImage, name: e.target.value })}
                margin="normal"
                InputProps={{ style: { textAlign: 'right' } }}
                InputLabelProps={{ style: { right: 14, left: 'auto' } }}
              />
              <TextField
                fullWidth
                label="תוכנית"
                value={editingImage.program}
                onChange={(e) => setEditingImage({ ...editingImage, program: e.target.value })}
                margin="normal"
                InputProps={{ style: { textAlign: 'right' } }}
                InputLabelProps={{ style: { right: 14, left: 'auto' } }}
              />
              <TextField
                fullWidth
                label="URL"
                value={editingImage.url}
                onChange={(e) => setEditingImage({ ...editingImage, url: e.target.value })}
                margin="normal"
                InputProps={{ style: { textAlign: 'right', direction: 'ltr' } }}
                InputLabelProps={{ style: { right: 14, left: 'auto' } }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleUpdateImage} variant="contained">עדכון</Button>
        </DialogActions>
      </Dialog>

      <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ mt: 4 }}>
        שמירת שינויים
      </Button>

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

export default ImageManager;