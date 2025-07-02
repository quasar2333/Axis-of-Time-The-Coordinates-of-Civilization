// This component is no longer in use. Its functionality is now part of the Settings panel.
// Keeping the file for reference, but it can be safely deleted.
import React from 'react';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const isStarmap = theme === Theme.Starmap;

  const toggleTheme = () => {
    setTheme(isStarmap ? Theme.Scroll : Theme.Starmap);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isStarmap ? Theme.Scroll : Theme.Starmap} theme`}
      className={`relative inline-flex items-center h-9 w-44 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 ${
        isStarmap ? 'bg-gray-700/80 focus-visible:ring-cyan-400' : 'bg-amber-200/80 focus-visible:ring-amber-800'
      }`}
    >
      <span className="sr-only">Toggle Theme</span>
      <span
        className={`absolute left-1 top-1 h-7 w-7 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center text-white ${
          isStarmap ? 'bg-cyan-400 translate-x-0' : 'bg-amber-800 translate-x-[140px]'
        }`}
      >
        {/* Simple icons for themes */}
        {isStarmap ? '✧' : '📜'}
      </span>
      <span className={`absolute left-9 text-sm font-bold transition-opacity ${isStarmap ? 'text-white opacity-100' : 'text-amber-800/50 opacity-50'}`}>
        Starmap
      </span>
      <span className={`absolute right-4 text-sm font-bold transition-opacity ${!isStarmap ? 'text-amber-900 opacity-100' : 'text-gray-400/50 opacity-50'}`}>
        Ancient Scroll
      </span>
    </button>
  );
};

export default ThemeToggle;
