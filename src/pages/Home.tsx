import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToolSelector from '../components/ToolSelector';

export default function Home() {
  useEffect(() => {
    console.log('Home component mounted');
  }, []);

  console.log('Home component rendering');

  return (
    <div>
      <h1>דף הבית</h1>
      <ToolSelector />
    </div>
  );
}