const Logo = ({ darkMode }) => {
    return (
      <div className="flex items-center gap-3">
        {/* Kurdish Flag Logo */}
        <div className="relative">
          <svg 
            className="w-10 h-8"
            viewBox="0 0 900 600" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Red stripe */}
            <rect width="900" height="200" y="0" fill="#EE1B24"/>
            {/* White stripe */}
            <rect width="900" height="200" y="200" fill="#FFFFFF"/>
            {/* Green stripe */}
            <rect width="900" height="200" y="400" fill="#009246"/>
            {/* Sun */}
            <circle 
              cx="450" 
              cy="300" 
              r="70" 
              fill="#FEBE10"
            />
          </svg>
        </div>
  
        {/* Brand Text */}
        <div className="flex flex-col">
          <span className={`text-lg font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ژیری دەستکرد
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Kurdish AI Assistant
          </span>
        </div>
      </div>
    );
  };
  
  export default Logo;