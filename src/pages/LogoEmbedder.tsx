/// <reference types="react" />

import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Box, Slider, useMediaQuery } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Konva from 'konva';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { logoFiles, Logo } from '../utils/logoFiles';

declare const process: { env: { PUBLIC_URL: string } };

const MAX_DISPLAY_SIZE = 1000;

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

  const isMobile = useMediaQuery('(max-width:600px)');
  const containerRef = useRef<HTMLDivElement>(null);

  const updateStageSize = () => {
    if (containerRef.current && selectedFile) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = window.innerHeight * 0.5;

      const imageAspectRatio = selectedFile.width / selectedFile.height;
      let newWidth, newHeight;

      if (containerWidth / containerHeight > imageAspectRatio) {
        newHeight = containerHeight;
        newWidth = newHeight * imageAspectRatio;
      } else {
        newWidth = containerWidth;
        newHeight = newWidth / imageAspectRatio;
      }

      setStageSize({ width: newWidth, height: newHeight });
    }
  };

  useEffect(() => {
    if (selectedFile) {
      updateStageSize();
    }
  }, [selectedFile]);

  useEffect(() => {
    const handleResize = () => {
      if (selectedFile) {
        updateStageSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          setOriginalImageSize({ width, height });
          setSelectedFile(img);
          updateStageSize(); // Call updateStageSize here
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
        const scale = stageSize.width * 0.8 / logoImg.width;
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
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        הטמעת לוגו
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: '100%' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" fullWidth>
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
                fullWidth
              >
                ייצא תמונה
              </Button>
            </>
          )}
        </Box>
        {selectedFile && (
          <Box 
            ref={containerRef} 
            sx={{ 
              width: '100%', 
              height: '50vh',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #ddd',
            }}
          >
            <Stage 
              width={stageSize.width} 
              height={stageSize.height} 
              ref={stageRef}
              onMouseDown={handleStageMouseDown}
              onTouchStart={handleStageMouseDown}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            >
              <Layer>
                <KonvaImage
                  image={selectedFile}
                  width={stageSize.width}
                  height={stageSize.height}
                />
                {selectedLogo && <LogoImage />}
              </Layer>
            </Stage>
          </Box>
        )}
      </Box>
    </Paper>
  );

  function handleStageMouseDown(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    // בדיקה אם הקליק היה מחוץ ללוגו
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      trRef.current?.nodes([]);
    } else {
      updateTransformer();
    }

    // הוספת תמיכה במחוות מגע
    if (isMobile && e.evt instanceof TouchEvent) {
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];

      if (touch1 && touch2) {
        const stage = stageRef.current;
        if (stage) {
          stage.stopDrag();
          const p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
          };
          const p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
          };

          if (!logoRef.current) return;

          const newScale = getDistance(p1, p2) / getDistance(stage.getPointerPosition() || p1, p2);
          logoRef.current.scale({ x: newScale, y: newScale });
        }
      }
    }
  }

  function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
}

export default LogoEmbedder;