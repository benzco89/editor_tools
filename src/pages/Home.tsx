import React from 'react';
import ToolSelector from '../components/ToolSelector';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-primary">כלי עזר - כאן חדשות</h1>
      <p className="text-xl mb-8">בחרו את הכלי בו תרצו להשתמש:</p>
      <ToolSelector />
    </div>
  );
};

export default Home;