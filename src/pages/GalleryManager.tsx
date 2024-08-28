import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Octokit } from "@octokit/rest";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface Image {
  id: string;
  name: string;
  program: string;
  url: string;
}

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
const owner = 'benzco89';
const repo = 'editor_tools';
const path = 'gallery_data.json';

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [newName, setNewName] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  useEffect(() => {
    console.log('GalleryManager: Component mounted, fetching images...');
    fetchImages();
  }, []);

  const fetchImages = async () => {
    console.log('GalleryManager: Attempting to fetch images from GitHub...');
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      console.log('GalleryManager: Received response from GitHub:', response);

      const fileContent = Array.isArray(response.data) ? response.data[0] : response.data;

      if ('content' in fileContent && fileContent.content) {
        const content = decodeURIComponent(escape(atob(fileContent.content)));
        console.log('GalleryManager: Decoded content:', content);
        const parsedImages = JSON.parse(content);
        console.log('GalleryManager: Parsed images:', parsedImages);
        setImages(parsedImages);
      } else {
        console.error('GalleryManager: Unexpected response format:', response.data);
      }
    } catch (error) {
      if ((error as any).status === 404) {
        console.warn('GalleryManager: File not found, creating new file with empty array');
        const emptyArray: Image[] = [];
        await updateGitHubFile(emptyArray);
        setImages(emptyArray);
      } else {
        console.error('GalleryManager: Error fetching images:', error);
        setSnackbarMessage('שגיאה בטעינת התמונות');
        setSnackbarOpen(true);
      }
    }
  };

  const updateGitHubFile = useCallback(async (newContent: Image[]) => {
    console.log('GalleryManager: Attempting to update GitHub file...');
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if ('sha' in response.data) {
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message: 'Update gallery data',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(newContent)))),
          sha: response.data.sha,
        });
        console.log('GalleryManager: File updated successfully');
        setImages(newContent);
        setSnackbarMessage('הנתונים נשמרו בהצלחה');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('GalleryManager: Error updating file:', error);
      setSnackbarMessage('שגיאה בעדכון הנתונים');
      setSnackbarOpen(true);
    }
  }, []);

  const handleAddImage = () => {
    const newImage = { 
      id: Date.now().toString(), 
      name: newName,
      program: newProgram,
      url: newUrl
    };
    setImages([...images, newImage]);
    setNewName('');
    setNewProgram('');
    setNewUrl('');
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(image => image.id !== id));
  };

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setNewName(image.name);
    setNewProgram(image.program);
    setNewUrl(image.url);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingImage) {
      const updatedImages = images.map(image =>
        image.id === editingImage.id
          ? { ...image, name: newName, program: newProgram, url: newUrl }
          : image
      );
      setImages(updatedImages);
      setEditDialogOpen(false);
      setEditingImage(null);
      setNewName('');
      setNewProgram('');
      setNewUrl('');
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

  console.log('GalleryManager: Rendering with images:', images);

  if (!enabled) {
    return null;
  }

  return (
    <Box sx={{ p: 3, direction: 'rtl', textAlign: 'right' }}>
      <Typography variant="h4" gutterBottom align="right">ניהול גלריית תמונות</Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="שם"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ style: { textAlign: 'right' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <TextField
          label="תוכנית"
          value={newProgram}
          onChange={(e) => setNewProgram(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ style: { textAlign: 'right' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <TextField
          label="קישור לתמונה"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ style: { textAlign: 'right' } }}
          InputLabelProps={{ style: { right: 14, left: 'auto' } }}
        />
        <Button variant="contained" onClick={handleAddImage} fullWidth>הוסף תמונה</Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery-list" key="gallery-list">
          {(provided: DroppableProvided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
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
                        <IconButton onClick={() => handleEditImage(image)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteImage(image.id)}>
                          <DeleteIcon />
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
      <Button variant="contained" onClick={() => updateGitHubFile(images)} sx={{ mt: 2 }}>
        שמור שינויים
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
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>ערוך תמונה</DialogTitle>
        <DialogContent>
          <TextField
            label="שם"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ style: { textAlign: 'right' } }}
            InputLabelProps={{ style: { right: 14, left: 'auto' } }}
          />
          <TextField
            label="תוכנית"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ style: { textAlign: 'right' } }}
            InputLabelProps={{ style: { right: 14, left: 'auto' } }}
          />
          <TextField
            label="קישור לתמונה"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ style: { textAlign: 'right' } }}
            InputLabelProps={{ style: { right: 14, left: 'auto' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleSaveEdit}>שמור</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GalleryManager;