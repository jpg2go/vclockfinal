import React from 'react';
import { Moon, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({ darkMode, toggleDarkMode }) => {
  return (
    <header className="text-white px-3 sm:px-6 py-3 flex items-center justify-between" style={{ backgroundColor: '#0090DD' }}>
      <div className="flex items-center">
        <Link to="/">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide" style={{ fontFamily: 'Quicksand, Nunito, Poppins, Arial, sans-serif', color: '#fff', letterSpacing: '0.05em' }}>vClock</h1>
        </Link>
      </div>
      
      <nav className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
        <a href="#" className="hover:text-blue-100 transition-colors text-sm sm:text-base hidden sm:block">Holidays</a>
        <div className="relative">
          <button className="flex items-center space-x-1 hover:text-blue-100 transition-colors text-sm sm:text-base">
            <span className="hidden sm:inline">Tools</span>
            <span className="sm:hidden">•••</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button className={`p-1 rounded transition-colors ${darkMode ? 'bg-gray-800' : 'hover:bg-blue-700'}`} onClick={toggleDarkMode} title="Toggle dark mode">
          <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </nav>
    </header>
  );
});

export default React.memo(Header);