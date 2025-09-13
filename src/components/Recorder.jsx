import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

// Set up the speech recognition object once
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-ZA';

const isSpeechRecognitionSupported = 
  'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

function Recorder({ isRecording, setIsRecording, onAnalysis }) {
  const [transcript, setTranscript] = useState('');
  const [coachingMode, setCoachingMode] = useState('General Feedback');
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // This effect listens for transcript updates.
  useEffect(() => {
    const handleResult = (event) => {
      let fullTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setTranscript(fullTranscript);
    };

    recognition.addEventListener('result', handleResult);

    // Cleanup function
    return () => {
      recognition.removeEventListener('result', handleResult);
    };
  }, []); // The empty array means this effect runs only once.

  
  const handleStartRecording = () => {
    setTranscript(''); // Clear the old transcript
    recognition.start();
    setIsRecording(true);
    setIsListening(true);
  };

  const handleStopRecording = () => {
    recognition.stop();
    setIsRecording(false);
    setIsListening(false);
    onAnalysis(transcript, coachingMode);
  };


  if (!isSpeechRecognitionSupported) {
    return (
      <div className="recorder-container">
        <div className="error-message">
          <h3>⚠️ Speech Recognition Not Available</h3>
          <p>Please use Chrome, Edge, or Safari for speech recognition support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recorder-container">
      <h2>1. Select a Mode & Record</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <div className="modes-container">
        {['General Feedback', 'Job Interview', 'Business Pitch'].map((mode) => (
          <button 
            key={mode}
            className={`mode-button ${coachingMode === mode ? 'active' : ''}`}
            onClick={() => setCoachingMode(mode)}
            disabled={isRecording}
            aria-pressed={coachingMode === mode}
          >
            {mode.replace(' Feedback', '')}
          </button>
        ))}
      </div>

      <div className="record-controls">
        <button 
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`record-button ${isRecording ? 'stop-button recording' : 'start-button'}`}
          disabled={!!error}
        >
          {isRecording ? (
            <>
              <span className="recording-indicator">🔴</span>
              Stop Recording
            </>
          ) : (
            '🎤 Start Recording'
          )}
        </button>
        
        {isRecording && (
          <div className="recording-status">
            <span className="pulse-dot"></span>
            {isListening ? 'Listening...' : 'Connecting...'}
          </div>
        )}
      </div>

      <div className="transcript-box">
        {transcript ? (
          <div>
            <div className="transcript-header">
              <small>Live Transcript ({transcript.split(' ').length} words)</small>
            </div>
            {transcript}
          </div>
        ) : (
          <p className="placeholder-text">
            {isRecording ? 'Start speaking...' : 'Your live transcript will appear here...'}
          </p>
        )}
      </div>
    </div>
  );
}

Recorder.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  onAnalysis: PropTypes.func.isRequired,
};

export default memo(Recorder);