import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import ChatApp from './components/ChatApp';
import AuthPages from './components/AuthPages';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [language, setLanguage] = useState('ku');
  const [darkMode, setDarkMode] = useState(false);

  const translations = {
    ku: {
      logout: 'چوونە دەرەوە',
      loading: 'چاوەڕوانبە...',
    },
    kmj: {
      logout: 'Derketin',
      loading: 'Bar dike...',
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`h-screen w-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-xl ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {translations[language].loading}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {isAuthenticated ? (
        <ChatApp 
          language={language}
          setLanguage={setLanguage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
          translations={translations}
        />
      ) : (
        <AuthPages 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
        />
      )}
    </div>
  );
}

export default App;