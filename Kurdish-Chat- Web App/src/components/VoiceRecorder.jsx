import React, { useState, useRef } from 'react';
import { Mic, Square, X } from 'lucide-react';

const VoiceRecorder = ({ onTranscription, language, darkMode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('تکایە ڕێگە بدە بە بەکارهێنانی مایکرۆفۆن');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setAudioBlob(null);
    audioChunks.current = [];
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'asr-large-beta');
      formData.append('response_format', 'json');
      formData.append('language', 'ckb');

      const response = await fetch('https://api.platform.krd/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pk-KPfnlHVNqjobGAonsawabYsjFsBpTNbmzdbqfwfhjYArgjPd'
        },
        body: formData
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }
      
      const data = JSON.parse(responseText);

      if (data.text) {
        onTranscription(data.text);
        setAudioBlob(null);
        setError(null);
      } else {
        throw new Error('No transcription in response');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('هەڵەیەک ڕوویدا لە وەرگێڕانی دەنگ بۆ نووسین');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-2 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : darkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-purple-100 hover:bg-purple-200'
        }`}
      >
        {isRecording ? (
          <Square className="text-white" size={20} />
        ) : (
          <Mic className={darkMode ? 'text-gray-200' : 'text-purple-600'} size={20} />
        )}
      </button>

      {(isRecording || audioBlob) && (
        <button
          onClick={cancelRecording}
          className={`p-2 rounded-full transition-all duration-200 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-red-400'
              : 'bg-red-100 hover:bg-red-200 text-red-600'
          }`}
          title={language === 'ku' ? 'پاشگەزبوونەوە' : 'Betal bike'}
        >
          <X size={20} />
        </button>
      )}

      {audioBlob && (
        <button
          onClick={handleTranscribe}
          className={`px-3 py-1 rounded-lg text-sm ${
            darkMode
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
          }`}
        >
          {language === 'ku' ? 'ناردنی دەنگ' : 'Wergerandin'}
        </button>
      )}

      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
};

export default VoiceRecorder;