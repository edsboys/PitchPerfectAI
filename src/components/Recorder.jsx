import React, { useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-ZA';

// The component now accepts a prop called 'onRecordingComplete'
function Recorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleToggleRecording = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      // When we stop, call the function from App.jsx with the final transcript
      onRecordingComplete(transcript);
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  recognition.onresult = (event) => {
    let fullTranscript = '';
    for (let i = 0; i < event.results.length; i++) {
      fullTranscript += event.results[i][0].transcript;
    }
    setTranscript(fullTranscript);
  };

  return (
    <div className="recorder-container">
      <h2>1. Record Your Pitch</h2>
      <button onClick={handleToggleRecording} className="record-button">
        {isRecording ? 'Stop Recording' : 'Stop Recording'}
      </button>
      <div className="transcript-box">
        {transcript ? transcript : <p>Your live transcript will appear here...</p>}
      </div>
    </div>
  );
}

export default Recorder;