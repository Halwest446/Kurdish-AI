import React, { useState } from 'react';
import { Sun, Moon, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Logo from './Logo';

// Password input field component
const PasswordInput = ({ value, onChange, placeholder, darkMode, showPassword, language }) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        } group-hover:text-indigo-500 transition-colors`} size={20} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700/50 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
          dir={language === 'ku' ? 'rtl' : 'ltr'}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

const AuthPages = ({ darkMode, setDarkMode, language, setLanguage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const translations = {
    ku: {
      login: 'چوونە ژوورەوە',
      register: 'خۆتۆمارکردن',
      email: 'ئیمەیڵ',
      password: 'وشەی نهێنی',
      confirmPassword: 'دووبارە وشەی نهێنی',
      name: 'ناو',
      forgotPassword: 'وشەی نهێنیت لەبیرچووە؟',
      noAccount: 'هەژمارت نییە؟',
      haveAccount: 'هەژمارت هەیە؟',
      createAccount: 'هەژمار دروست بکە',
      signIn: 'بچۆ ژوورەوە',
      welcomeBack: 'بەخێربێیتەوە',
      createAccountText: 'هەژماری نوێ دروست بکە',
      or: 'یان',
      loading: 'چاوەڕوانبە...',
      errorOccurred: 'هەڵەیەک ڕوویدا',
      showPassword: 'پیشاندانی وشەی نهێنی',
      hidePassword: 'شاردنەوەی وشەی نهێنی'
    },
    kmj: {
      login: 'Têketin',
      register: 'Tomar kirin',
      email: 'Email',
      password: 'Şîfre',
      confirmPassword: 'Şîfreyê piştrast bike',
      name: 'Nav',
      forgotPassword: 'Şîfre ji bîr kir?',
      noAccount: 'Hesabê te tune?',
      haveAccount: 'Hesabê te heye?',
      createAccount: 'Hesab çêke',
      signIn: 'Têkeve',
      welcomeBack: 'Bi xêr hatî',
      createAccountText: 'Hesabek nû çêke',
      or: 'yan',
      loading: 'Bar dike...',
      errorOccurred: 'Çewtiyek çêbû',
      showPassword: 'Nîşan bide şîfreyê',
      hidePassword: 'Veşêre şîfreyê'
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const getErrorMessage = (errorCode, lang) => {
    const messages = {
      'auth/network-request-failed': {
        ku: 'کێشەی ئینتەرنێت هەیە، تکایە دڵنیابە لە هەبوونی ئینتەرنێت',
        en: 'Network error. Please check your internet connection'
      },
      'auth/email-already-in-use': {
        ku: 'ئەم ئیمەیڵە پێشتر بەکارهاتووە',
        en: 'Email is already in use'
      },
      'auth/invalid-email': {
        ku: 'ئیمەیڵەکە دروست نییە',
        en: 'Invalid email address'
      },
      'auth/wrong-password': {
        ku: 'وشەی نهێنی هەڵەیە',
        en: 'Incorrect password'
      }
    };
    return messages[errorCode]?.[lang] || messages['auth/network-request-failed'][lang];
  };
  const handleAuthOperation = async (authFunction) => {
    try {
      const result = await authFunction();
      return result;
    } catch (error) {
      if (error.code === 'auth/network-request-failed' && retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        setRetryCount(prev => prev + 1);
        return handleAuthOperation(authFunction);
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setRetryCount(0);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError(language === 'ku' ? 'وشەکانی نهێنی یەک ناگرنەوە' : 'Passwords do not match');
        return;
      }

      if (isLogin) {
        await handleAuthOperation(() => 
          signInWithEmailAndPassword(auth, formData.email, formData.password)
        );
      } else {
        const userCredential = await handleAuthOperation(() => 
          createUserWithEmailAndPassword(auth, formData.email, formData.password)
        );
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          language: language,
          darkMode: darkMode
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(getErrorMessage(error.code, language));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-500`}>
        {/* Background with improved blur effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/3 -top-1/3 w-2/3 h-2/3 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -right-1/3 -bottom-1/3 w-2/3 h-2/3 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        {/* Top navigation bar */}
        <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-transparent z-40">
          <div className="container mx-auto px-4 h-full flex justify-between items-center">
            <div className="flex-shrink-0">
              <Logo darkMode={darkMode} />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg shadow-sm ${
                  darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'
                } transition-colors hover:scale-105`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setLanguage(language === 'ku' ? 'kmj' : 'ku')}
                className={`px-4 py-2 rounded-full shadow-sm text-sm font-medium 
                  ${darkMode 
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                  } transition-all hover:scale-105`}
              >
                {language === 'ku' ? 'KURMANJI' : 'سۆرانی'}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full min-h-screen pt-20 sm:pt-24 pb-6 flex items-center justify-center">
          <div className={`w-full max-w-md mx-4 ${
            darkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all`}>
            
            <div className="p-6 text-center">
              <h2 className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                {isLogin ? translations[language].welcomeBack : translations[language].createAccountText}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {translations[language].name}
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } group-hover:text-indigo-500 transition-colors`} size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-gray-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      dir={language === 'ku' ? 'rtl' : 'ltr'}
                      placeholder={translations[language].name}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {translations[language].email}
                </label>
                <div className="relative group">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  } group-hover:text-indigo-500 transition-colors`} size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    dir={language === 'ku' ? 'rtl' : 'ltr'}
                    placeholder={translations[language].email}
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {translations[language].password}
                </label>
                <PasswordInput
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={translations[language].password}
                  darkMode={darkMode}
                  showPassword={showPassword}
                  language={language}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {translations[language].confirmPassword}
                  </label>
                  <PasswordInput
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder={translations[language].confirmPassword}
                    darkMode={darkMode}
                    showPassword={showPassword}
                    language={language}
                  />
                </div>
              )}

              {/* Show/Hide Password Button - Now below password fields */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span className="text-sm">
                    {showPassword 
                      ? translations[language].hidePassword
                      : translations[language].showPassword}
                  </span>
                </button>
              </div>

              {error && (
                <div className={`p-4 rounded-lg text-sm ${
                  darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium
                  ${loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  } transition-all duration-200 transform hover:scale-[1.02]
                  ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? translations[language].loading : 
                  (isLogin ? translations[language].signIn : translations[language].createAccount)}
              </button>
            </form>

            {/* Footer */}
            <div className={`p-6 text-center border-t ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isLogin ? translations[language].noAccount : translations[language].haveAccount}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className={`ml-2 font-medium ${
                    darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                  } hover:underline transition-colors`}
                >
                  {isLogin ? translations[language].createAccount : translations[language].signIn}
                </button>
              </p>
              <p className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {language === 'ku' ? 'دروست کراوە لە لایەن هەڵوێست عبداللە' : 'Powered by Halwest Abdullah'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;