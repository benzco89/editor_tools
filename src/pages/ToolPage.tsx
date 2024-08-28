import React from 'react';
import { useParams } from 'react-router-dom';

const ToolPage: React.FC = () => {
  const { tool } = useParams<{ tool: string }>();

  return (
    <div>
      <h1>כלי: {tool}</h1>
      {/* כאן תוכל להוסיף את הלוגיקה הספציפית לכל כלי */}
    </div>
  );
};

export default ToolPage;