import React, { useState, useEffect } from 'react';
import Recorder from './components/Recorder';
import Analysis from './components/Analysis';
import DarkModeToggle from './components/DarkModeToggle';
import './index.css';

// 1. Import your single logo file
import logo from './assets/logo.png'; 

import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing API key. Please set VITE_GEMINI_API_KEY in your environment variables.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return savedMode === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const handleAnalysis = async (transcript, mode, duration) => {
    // This function is already correct and doesn't need changes
    if (!transcript) {
      alert("Could not hear any speech. Please try again.");
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const wordCount = transcript.trim().split(/\s+/).length;
    const prompt = `
      You are 'Pitch Perfect AI', a world-class speech coach. Analyze the following speech.
      Context: Scenario is "${mode}", Word Count is ${wordCount}, Duration is ${Math.round(duration)} seconds.
      Transcript: "${transcript}"
      Task: Provide analysis in a perfect JSON object, with no markdown.
      JSON Schema: { "fillerWordCount": <integer>, "wordsPerMinute": <integer>, "clarityScore": <integer, 1-10>, "positiveFeedback": "<string>", "improvementSuggestion": "<string>", "youtubeSearchQuery": "<string>" }
    `;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '');
      let parsedAnalysis = JSON.parse(cleanedJson);
      const earnedBadges = [];
      if (parsedAnalysis.clarityScore >= 8) earnedBadges.push({ name: "Clarity Champion", emoji: "🏆" });
      if (parsedAnalysis.fillerWordCount <= 2) earnedBadges.push({ name: "Eloquent Speaker", emoji: "🗣️" });
      if (parsedAnalysis.wordsPerMinute >= 120 && parsedAnalysis.wordsPerMinute <= 150) earnedBadges.push({ name: "Pace Pro", emoji: "⏱️" });
      parsedAnalysis.badges = earnedBadges;
      setAnalysis(parsedAnalysis);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setAnalysis(null);
  };

  return (
    <div className="app-container">
      <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <header>
        {/* 2. Display your single logo. No conditional logic needed. */}
        <img src={logo} alt="Pitch Perfect AI Logo" className="app-logo" />
      </header>
      <main>
        <Recorder 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onAnalysis={handleAnalysis} 
        />
        <Analysis 
          analysisResult={analysis} 
          isLoading={isLoading} 
          error={error}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
}

export default App;