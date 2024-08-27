import React from 'react';
import Link from 'next/link';

const tools = [
  { name: 'דחיסת תמונה', path: '/image-compression' },
  // Add more tools here
];

const ToolSelector: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Link key={tool.path} href={tool.path}>
          <a className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            {tool.name}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default ToolSelector;