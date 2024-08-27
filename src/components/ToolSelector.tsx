import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PdfEmbedder from '../pages/PdfEmbedder';
import ImageProcessor from '../pages/ImageProcessor';
import FileConverter from '../pages/FileConverter';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tool-tabpanel-${index}`}
      aria-labelledby={`tool-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ToolSelector() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tool selector tabs">
          <Tab label="הטמעת PDF" />
          <Tab label="עיבוד תמונה" />
          <Tab label="המרת קבצים" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PdfEmbedder />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImageProcessor />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FileConverter />
      </TabPanel>
    </Box>
  );
}

export default ToolSelector;