import React, { useState, useEffect } from 'react';
import Recorder from './components/Recorder';
import Analysis from './components/Analysis';
import DarkModeToggle from './components/DarkModeToggle';
import './index.css';

// 1. Import your single logo file
import logo from './assets/Logo.png';

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
    if (!transcript) {
      alert("Could not hear any speech. Please try again.");
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const wordCount = transcript.trim().split(/\s+/).length;
    const prompt = `
      You are 'Pitch Perfect AI', an encouraging and insightful public speaking coach. Your goal is to help users improve their presentation skills.
      Analyze the speech provided based on the following context:
      - **Scenario**: "${mode}"
      - **Word Count**: ${wordCount}
      - **Duration**: ${Math.round(duration)} seconds
      - **Transcript**: "${transcript}"

      Please provide your analysis in a valid JSON object format, without any markdown formatting (e.g., \`\`\`json).

      Your JSON response MUST follow this schema:
      {
        "fillerWordCount": <integer>, // Count of filler words like "um", "ah", "like".
        "wordsPerMinute": <integer>, // Calculated words per minute.
        "clarityScore": <integer>, // A score from 1-10 on the clarity of the speech.
        "positiveFeedback": "<string>", // Specific, encouraging feedback on what the user did well. (e.g., "Your pacing was excellent, creating a confident tone.")
        "improvementSuggestion": "<string>", // A single, actionable suggestion for improvement. (e.g., "Try to reduce the use of 'like' to make your message more impactful.")
        "youtubeSearchQuery": "<string>" // A concise, relevant search query for a YouTube video to help with the improvement suggestion. (e.g., "how to stop using filler words")
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // More robust JSON parsing
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from AI. Could not find JSON.");
      }

      const cleanedJson = jsonMatch[0];
      let parsedAnalysis = JSON.parse(cleanedJson);

      const earnedBadges = [];
      if (parsedAnalysis.clarityScore >= 8) earnedBadges.push({ name: "Clarity Champion", emoji: "🏆" });
      if (parsedAnalysis.fillerWordCount <= 2) earnedBadges.push({ name: "Eloquent Speaker", emoji: "🗣️" });
      if (parsedAnalysis.wordsPerMinute >= 120 && parsedAnalysis.wordsPerMinute <= 150) earnedBadges.push({ name: "Pace Pro", emoji: "⏱️" });
      parsedAnalysis.badges = earnedBadges;

      setAnalysis(parsedAnalysis);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setError("Sorry, there was an error analyzing your speech. Please try again.");
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