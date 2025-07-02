import React, { useState } from 'react';
import { MessageSquare, Send, Plus, Trash2, Moon, Sun, RefreshCw, LogOut } from 'lucide-react';
import Logo from './Logo';
import UserProfile from './UserProfile';
import VoiceRecorder from './VoiceRecorder';
import TextToSpeechButton from './TextToSpeechButton';

const ChatApp = ({ 
  language, 
  setLanguage, 
  darkMode, 
  setDarkMode, 
  onLogout, 
  logoutLoading,
  translations 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [showTelegramInput, setShowTelegramInput] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([
    { id: 1, title: 'چاتی نوێ' }
  ]);
  const [selectedChat, setSelectedChat] = useState(1);

  const API_URL = 'https://api.peshang.halwest-tech.com/api/chat';

  const chatTranslations = {
    ku: {
      newChat: 'چاتی نوێ',
      refresh: 'نوێکردنەوە',
      logout: 'چوونە دەرەوە',
      writeMessage: 'نامەیەک بنووسە...',
      typing: 'خەریکی نووسینە...',
      welcome: 'بەخێربێیت بۆ چات ئەسیستانت',
      startNewChat: 'چاتێکی نوێ دەست پێبکە',
      confirmDelete: 'دڵنیای لە سڕینەوە؟',
      addTelegram: 'زیادکردنی تیلیگرام',
      telegramPlaceholder: 'ئایدی تیلیگرام لێرە بنووسە',
      joinBot: 'جۆین بە',
      joinFirst: 'بۆ ئەوەی دەتەوێت چاتەکە هەڵگریت لە تیلیگرام جۆین بە ئینجا دوای ئەوە ئایدی تیلگرامەکەت دابنێ',
      getChatId: 'وەرگرتنی ئایدی'
    },
    kmj: {
      newChat: 'Çata nû',
      refresh: 'Nûkirin', 
      logout: 'Derketin',
      writeMessage: 'Peyamekê binivîse...',
      typing: 'Dinivîse...',
      welcome: 'Bi xêr hatî bo Chat Assistant',
      startNewChat: 'Çateke nû dest pê bike',
      confirmDelete: 'Tu dixwazî jê bibî?',
      addTelegram: 'Telegram zêde bike',
      telegramPlaceholder: 'ID ya Telegramê li vir binivîse',
      joinBot: 'Beşdar bibe',
      joinFirst: 'Ji kerema xwe pêşî beşdar bibe û ID ya xwe bigire',
      getChatId: 'ID bigire'
    }
  };
  const handleSend = async () => {
    const messageText = inputValue.trim();
    if (messageText) {
      setMessages(prev => [...prev, { text: messageText, sender: 'user' }]);
      setInputValue('');

      try {
        setMessages(prev => [...prev, { 
          text: chatTranslations[language].typing,
          sender: 'assistant',
          isLoading: true
        }]);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            message: messageText,
            telegramId: telegramId || null
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // پشکنینی داتاکە
        if (!data || !data.content || !Array.isArray(data.content) || data.content.length === 0) {
          throw new Error('Invalid response format');
        }

        setMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { 
                  text: data.content[0].text || 'Sorry, no response received',
                  sender: 'assistant' 
                }
              : msg
          )
        );
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? {
                  text: language === 'ku' 
                    ? 'ببوورە، هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەوە'
                    : 'Sorry, an error occurred. Please try again',
                  sender: 'assistant',
                  error: true
                }
              : msg
          )
        );
      }
    }
  };

  const createNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: language === 'ku' ? `چاتی ${chats.length + 1}` : `Chat ${chats.length + 1}`
    };
    setChats([...chats, newChat]);
    setSelectedChat(newChat.id);
    setMessages([]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 right-4 z-40 p-2 rounded-lg shadow-md md:hidden transition-colors duration-200 ${
          darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
        }`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static w-64 md:w-72 h-full 
        ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} 
        backdrop-blur-sm transform transition-all duration-300 shadow-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 z-30 flex flex-col
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Logo darkMode={darkMode} />
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
              }`}
            >
              <LogOut size={20} />
            </button>
          </div>

          <div className="flex justify-between items-center mt-4 mb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-purple-100 text-purple-600'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setLanguage(language === 'ku' ? 'kmj' : 'ku')}
              className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {language === 'ku' ? 'KURMANJI' : 'سۆرانی'}
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={createNewChat}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                darkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              } text-white`}
            >
              <Plus size={20} />
              <span className="font-medium">{chatTranslations[language].newChat}</span>
            </button>

            <button
              onClick={handleRefresh}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-purple-100 hover:bg-purple-200'
              } ${darkMode ? 'text-gray-200' : 'text-purple-600'}`}
            >
              <RefreshCw size={20} />
              <span className="font-medium">{chatTranslations[language].refresh}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`mx-4 mb-2 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedChat === chat.id
                  ? darkMode
                    ? 'bg-gray-700/80 text-white'
                    : 'bg-purple-100 text-purple-900'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:bg-purple-50'
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(chatTranslations[language].confirmDelete)) {
                      const newChats = chats.filter(c => c.id !== chat.id);
                      setChats(newChats);
                      if (selectedChat === chat.id) {
                        setSelectedChat(newChats[0]?.id || null);
                        setMessages([]);
                      }
                    }
                  }}
                  className={`p-1 rounded-full hover:bg-opacity-80 ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-purple-200'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col h-full relative ${
        darkMode ? 'bg-gray-800/40' : 'bg-white/40'
      } backdrop-blur-sm min-w-0`}>
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto pt-16 md:pt-0">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-6">
              <div className="max-w-md">
                <h2 className={`text-2xl font-semibold mb-3 ${
                  darkMode ? 'text-gray-200' : 'text-purple-800'
                }`}>
                  {chatTranslations[language].welcome}
                </h2>
                <p className={darkMode ? 'text-gray-400' : 'text-purple-600'}>
                  {chatTranslations[language].startNewChat}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-6">
              {messages.map((message, index) => (
  <div 
    key={index} 
    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div className="flex items-start gap-2">
      <div 
        className={`px-4 md:px-6 py-3 rounded-2xl max-w-[85%] md:max-w-[80%] shadow-sm ${
          message.sender === 'user'
            ? darkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : darkMode
              ? 'bg-gray-700 text-gray-200'
              : 'bg-white text-gray-800'
        }`}
        dir={language === 'ku' ? 'rtl' : 'ltr'}
      >
        {message.text}
      </div>
      {message.sender === 'assistant' && (
        <TextToSpeechButton 
          text={message.text} 
          darkMode={darkMode}
          language={language}
        />
      )}
    </div>
  </div>
))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className={`p-4 md:p-6 border-t backdrop-blur-sm ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-purple-100'
        }`}>
          <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
            {showTelegramInput ? (
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <p className={`text-[10px] ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {language === 'ku' 
                    ? 'بۆ هەڵگرتنی نامەکان جۆین ببە ئینجا ئایدیەکت وەربگرە لێرە دایبنێ' 
                    : 'Ji bo peyman hilgirtinê beşdar bibe û ID ya xwe bigire'}
                </p>
                <div className="flex flex-wrap md:flex-nowrap gap-2">
                  <input
                    type="text"
                    value={telegramId}
                    onChange={(e) => setTelegramId(e.target.value)}
                    placeholder={chatTranslations[language].telegramPlaceholder}
                    className={`flex-1 md:w-52 px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <div className="flex gap-2 w-full md:w-auto">
                    <a 
                      href="https://t.me/WhatChatIDBot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs flex items-center justify-center ${
                        darkMode
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      } text-white`}
                    >
                      {chatTranslations[language].getChatId}
                    </a>
                    <a 
                      href="https://t.me/kurdish_chat_ai_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs flex items-center justify-center ${
                        darkMode
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      } text-white`}
                    >
                      {chatTranslations[language].joinBot}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowTelegramInput(true)}
                className={`w-full md:w-auto px-4 py-2 rounded-xl ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {chatTranslations[language].addTelegram}
              </button>
            )}
            
            {language === 'ku' && (
              <div className="mb-2 flex justify-center">
                <VoiceRecorder
                  onTranscription={(text) => setInputValue(text)}
                  language={language}
                  darkMode={darkMode}
                />
              </div>
            )}
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={chatTranslations[language].writeMessage}
                className={`flex-1 px-4 py-3 rounded-xl border text-base md:text-lg ${
                  darkMode 
                    ? 'bg-gray-700/90 border-gray-600 text-gray-200 placeholder-gray-400 focus:bg-gray-700 focus:border-purple-500'
                    : 'bg-white/90 border-purple-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-purple-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-100`}
                dir={language === 'ku' ? 'rtl' : 'ltr'}
              />
              <button
                onClick={handleSend}
                className={`px-4 rounded-xl ${
                  darkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                } text-white`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatApp;