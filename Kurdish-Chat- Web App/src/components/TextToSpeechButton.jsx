import React, { useState } from 'react';
import { Volume2, Loader } from 'lucide-react';

const TextToSpeechButton = ({ text, darkMode, language }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  const handleTextToSpeech = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('https://api.platform.krd/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pk-KPfnlHVNqjobGAonsawabYsjFsBpTNbmzdbqfwfhjYArgjPd',
          'Content-Type': 'application/json',
          'Accept': 'audio/wav'
        },
        body: JSON.stringify({
          model: 'tts-mini-exp',
          input: text,
          language: 'ckb',
          voice: 'default',
          response_format: 'wav',
          speed: 1.0,
          sample_rate: 16000
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // پاککردنەوەی ئۆدیۆی پێشوو ئەگەر هەبوو
      if (audio) {
        URL.revokeObjectURL(audio);
      }
      
      setAudio(audioUrl);
      
      // پەخشکردنی دەنگەکە
      const audioElement = new Audio(audioUrl);
      audioElement.play();

    } catch (error) {
      console.error('Text to speech error:', error);
      // دەتوانیت لێرە مەسج بۆ یوزەر دەربخەیت
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleTextToSpeech}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-all duration-200 ${
        darkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={language === 'ku' ? 'گوێگرتن لە دەنگ' : 'Guhdarî bike'}
    >
      {isLoading ? (
        <Loader className="animate-spin" size={20} />
      ) : (
        <Volume2 size={20} />
      )}
    </button>
  );
};

export default TextToSpeechButton;