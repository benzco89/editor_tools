import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/kan-news-logo.jpg" alt="כאן חדשות" className="h-10 mr-2" />
          <span className="text-xl font-bold text-primary">כלי עזר</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-gray-600 hover:text-primary">בית</Link></li>
            <li><Link to="/image-compression" className="text-gray-600 hover:text-primary">דחיסת תמונות</Link></li>
            <li><Link to="/logo-embedder" className="text-gray-600 hover:text-primary">הטמעת לוגו</Link></li>
            <li><Link to="/pdf-embedder" className="text-gray-600 hover:text-primary">הטמעת PDF</Link></li>
            <li><Link to="/file-converter" className="text-gray-600 hover:text-primary">המרת קבצים</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;