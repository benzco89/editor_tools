/// <reference types="react" />

import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Box, Slider } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Konva from 'konva';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { logoFiles, Logo } from '../utils/logoFiles';

declare const process: { env: { PUBLIC_URL: string } };

const MAX_DISPLAY_SIZE = 1000; // גודל מקסימלי לתצוגה

function LogoEmbedder() {
  const [selectedFile, setSelectedFile] = useState<HTMLImageElement | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string>('');
  const [logos] = useState<Logo[]>(logoFiles);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [logoScale, setLogoScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [exportQuality, setExportQuality] = useState<number>(0.8);
  const stageRef = useRef<Konva.Stage>(null);
  const logoRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          setOriginalImageSize({ width, height });
          
          let newWidth = width;
          let newHeight = height;
          if (width > MAX_DISPLAY_SIZE || height > MAX_DISPLAY_SIZE) {
            if (width > height) {
              newWidth = MAX_DISPLAY_SIZE;
              newHeight = (height / width) * MAX_DISPLAY_SIZE;
            } else {
              newHeight = MAX_DISPLAY_SIZE;
              newWidth = (width / height) * MAX_DISPLAY_SIZE;
            }
          }
          setStageSize({ width: newWidth, height: newHeight });
          setSelectedFile(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (event: SelectChangeEvent<string>) => {
    setSelectedLogo(event.target.value);
  };

  const handleExport = () => {
    if (stageRef.current && selectedFile && logoImage) {
      const stage = stageRef.current;
      const scaleX = originalImageSize.width / stageSize.width;
      const scaleY = originalImageSize.height / stageSize.height;
      
      // Hide transformer before export
      if (trRef.current) {
        trRef.current.hide();
      }
      
      // יצירת אלמנט זמני
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);
      
      // יצירת במה חדשה עם המימדים המקוריים של התמונה
      const exportStage = new Konva.Stage({
        container: container,
        width: originalImageSize.width,
        height: originalImageSize.height,
      });

      // שכפול השכבה וסידור מחדש לגודל המקורי
      const layer = stage.findOne('Layer') as Konva.Layer;
      const clonedLayer = layer.clone();
      exportStage.add(clonedLayer);

      // התאמת התמונה המקורית לגודל המלא
      const backgroundImage = clonedLayer.findOne('Image') as Konva.Image;
      backgroundImage.size({
        width: originalImageSize.width,
        height: originalImageSize.height,
      });

      // התאמת הלוגו
      const logo = clonedLayer.findOne('#logo') as Konva.Image;
      if (logo) {
        const currentScale = logo.scaleX();
        const newScale = currentScale * scaleX;
        logo.scale({ x: newScale, y: newScale });
        logo.position({
          x: logo.x() * scaleX,
          y: logo.y() * scaleY,
        });
      }

      // ייצוא התמונה כ-JPEG
      const dataURL = exportStage.toDataURL({ 
        pixelRatio: 1,
        mimeType: 'image/jpeg',
        quality: exportQuality 
      });
      
      // מחיקת הבמה הזמנית והאלמנט
      exportStage.destroy();
      document.body.removeChild(container);
      
      // Show transformer after export
      if (trRef.current) {
        trRef.current.show();
      }
      
      const link = document.createElement('a');
      link.download = 'logo_embedded_image.jpg';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    if (selectedFile && selectedLogo) {
      const logoImg = new Image();
      logoImg.onload = () => {
        const scale = stageSize.width * 0.8 / logoImg.width; // שינוי ל-80% מרוחב התמונה
        setLogoScale(scale);
        setLogoPosition({
          x: stageSize.width / 2,
          y: stageSize.height / 2
        });
        setLogoImage(logoImg);
      };
      logoImg.src = `${process.env.PUBLIC_URL}/logos/${selectedLogo}`;
    }
  }, [selectedFile, selectedLogo, stageSize]);

  const updateTransformer = () => {
    if (logoRef.current && trRef.current) {
      trRef.current.nodes([logoRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  };

  useEffect(() => {
    updateTransformer();
  }, [logoImage, logoPosition, logoScale]);

  const LogoImage = () => {
    if (!logoImage) return null;

    return (
      <>
        <KonvaImage
          id="logo"
          image={logoImage}
          x={logoPosition.x}
          y={logoPosition.y}
          scaleX={logoScale}
          scaleY={logoScale}
          offsetX={logoImage.width / 2}
          offsetY={logoImage.height / 2}
          draggable
          ref={logoRef}
          onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
            setLogoPosition({ x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
            const node = logoRef.current;
            if (node) {
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              setLogoScale(Math.max(scaleX, scaleY));
              setLogoPosition({ x: node.x(), y: node.y() });
            }
          }}
        />
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        הטמעת לוגו
      </Typography>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          בחר תמונה
        </Button>
      </label>
      {selectedFile && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="logo-select-label">בחר לוגו</InputLabel>
          <Select
            labelId="logo-select-label"
            value={selectedLogo}
            label="בחר לוגו"
            onChange={handleLogoChange}
          >
            {logos.map((logo) => (
              <MenuItem key={logo.filename} value={logo.filename}>{logo.displayName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {selectedFile && selectedLogo && (
        <Box sx={{ mt: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
          <Stage 
            width={stageSize.width} 
            height={stageSize.height} 
            ref={stageRef}
            onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
              // בדיקה אם הקליק היה מחוץ ללוגו
              const clickedOnEmpty = e.target === e.target.getStage();
              if (clickedOnEmpty) {
                trRef.current?.nodes([]);
              } else {
                updateTransformer();
              }
            }}
          >
            <Layer>
              <KonvaImage
                image={selectedFile}
                width={stageSize.width}
                height={stageSize.height}
              />
              <LogoImage />
            </Layer>
          </Stage>
        </Box>
      )}
      {selectedFile && selectedLogo && (
        <>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>איכות הייצוא</Typography>
            <Slider
              value={exportQuality}
              onChange={(event: Event, newValue: number | number[]) => setExportQuality(newValue as number)}
              min={0.1}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            />
          </Box>
          <Button 
            variant="contained" 
            onClick={handleExport} 
            sx={{ mt: 2 }}
          >
            ייצא תמונה
          </Button>
        </>
      )}
    </Paper>
  );
}

export default LogoEmbedder;