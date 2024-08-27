import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  { name: 'דחיסת תמונה', path: '/image-compression', icon: '🖼️' },
  { name: 'הטמעת לוגו', path: '/logo-embedder', icon: '🔠' },
  { name: 'הטמעת PDF', path: '/pdf-embedder', icon: '📄' },
  { name: 'המרת קבצים', path: '/file-converter', icon: '🔄' },
];

const ToolSelector: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Link key={tool.path} to={tool.path} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 flex flex-col items-center">
          <span className="text-4xl mb-4">{tool.icon}</span>
          <span className="text-xl font-semibold text-primary">{tool.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default ToolSelector;