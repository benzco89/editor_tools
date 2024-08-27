import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { SelectChangeEvent } from '@mui/material/Select';
import { logoFiles, Logo } from '../utils/logoFiles';
import Konva from 'konva';

function LogoEmbedder() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string>('');
  const [logos] = useState<Logo[]>(logoFiles);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [logoScale, setLogoScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [backgroundImage] = useImage(selectedFile || '');
  const [logoImage] = useImage(selectedLogo ? `${process.env.PUBLIC_URL}/logos/${selectedLogo}` : '');

  useEffect(() => {
    if (backgroundImage && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = window.innerHeight * 0.7; // 70% של גובה החלון
      const imageRatio = backgroundImage.width / backgroundImage.height;
      const containerRatio = containerWidth / containerHeight;

      let newScale;
      if (imageRatio > containerRatio) {
        newScale = containerWidth / backgroundImage.width;
      } else {
        newScale = containerHeight / backgroundImage.height;
      }

      setScale(newScale);
      setStageSize({
        width: backgroundImage.width * newScale,
        height: backgroundImage.height * newScale,
      });
    }
  }, [backgroundImage]);

  useEffect(() => {
    if (backgroundImage && logoImage) {
      const scale = backgroundImage.width / logoImage.width;
      setLogoScale(scale);
      setLogoPosition({ x: backgroundImage.width / 2, y: backgroundImage.height / 2 });
    }
  }, [backgroundImage, logoImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedFile(reader.result as string);
        const img = document.createElement('img');
        img.onload = () => {
          setStageSize({ width: img.width, height: img.height });
        };
        img.src = reader.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleLogoChange = (event: SelectChangeEvent<string>) => {
    setSelectedLogo(event.target.value);
  };

  const handleExport = () => {
    setIsExporting(true);
    if (stageRef.current) {
      try {
        const stage = stageRef.current;
        const transformer = stage.findOne('Transformer');
        if (transformer) {
          transformer.hide();
        }
        
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        
        if (transformer) {
          transformer.show();
        }
        
        const link = document.createElement('a');
        link.download = 'logo_embedded_image.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Image exported successfully');
      } catch (error) {
        console.error('Error during image export:', error);
      }
    } else {
      console.error('Stage reference is null');
    }
    setIsExporting(false);
  };

  const LogoImage = () => {
    const logoRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
      if (trRef.current && logoRef.current) {
        trRef.current.nodes([logoRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }, []);

    return (
      <>
        <Image
          image={logoImage}
          x={logoPosition.x}
          y={logoPosition.y}
          scaleX={logoScale}
          scaleY={logoScale}
          offsetX={logoImage ? logoImage.width / 2 : 0}
          offsetY={logoImage ? logoImage.height / 2 : 0}
          draggable
          ref={logoRef}
          onDragEnd={(e) => {
            setLogoPosition({ x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={(e) => {
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
      <div className="flex flex-col space-y-4">
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
          <FormControl fullWidth>
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
      </div>
      {selectedFile && selectedLogo && (
        <Box 
          ref={containerRef} 
          sx={{ 
            mt: 4, 
            maxWidth: '100%', 
            height: '70vh', 
            overflow: 'auto', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        >
          <Stage 
            width={stageSize.width} 
            height={stageSize.height} 
            ref={stageRef}
            scale={{ x: scale, y: scale }}
          >
            <Layer>
              <Image image={backgroundImage} />
              <LogoImage />
            </Layer>
          </Stage>
        </Box>
      )}
      {selectedFile && selectedLogo && (
        <Button 
          variant="contained" 
          onClick={handleExport} 
          sx={{ mt: 2 }}
          disabled={isExporting}
        >
          {isExporting ? 'מייצא...' : 'ייצא תמונה'}
        </Button>
      )}
    </Paper>
  );
}

export default LogoEmbedder;