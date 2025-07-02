import React from 'react';
import { LogOut } from 'lucide-react';

const UserProfile = ({ darkMode, language, translations, onLogout, logoutLoading }) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onLogout}
        disabled={logoutLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
          ${darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
            : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
          }
          ${logoutLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <LogOut size={18} />
        <span>{logoutLoading ? translations[language].loading : translations[language].logout}</span>
      </button>
    </div>
  );
};

export default UserProfile;