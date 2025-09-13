import React, { useState } from 'react';
import Recorder from './components/Recorder';
import Analysis from './components/Analysis';
import DarkModeToggle from './components/DarkModeToggle';
import './index.css';
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

  const handleAnalysis = async (transcript, mode) => {
    // Better input validation
    if (!transcript || transcript.trim().length < 10) {
      setError("Please provide a longer speech sample for better analysis.");
      return;
    }

    if (!API_KEY) {
      setError("API key is missing. Please check your environment configuration.");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      // Calculate basic metrics from transcript
      const wordCount = transcript.trim().split(/\s+/).length;
      const estimatedDuration = wordCount / 2.5; // Assume ~150 WPM average
      const wordsPerMinute = Math.round(wordCount / (estimatedDuration / 60));
      
      // Count filler words
      const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally'];
      const fillerCount = fillerWords.reduce((count, filler) => {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi');
        return count + (transcript.match(regex) || []).length;
      }, 0);

      const prompt = `You are a professional speech coach with expertise in ${mode.toLowerCase()} scenarios. 

      Analyze this speech transcript and provide constructive feedback:
      "${transcript}"

      Context:
      - Word count: ${wordCount}
      - Estimated speaking rate: ${wordsPerMinute} WPM
      - Filler word count: ${fillerCount}
      - Speech type: ${mode}

      Provide your analysis as a JSON object with these exact keys:
      
      {
        "fillerWordCount": ${fillerCount},
        "wordsPerMinute": ${wordsPerMinute},
        "clarityScore": [rate 1-10 based on sentence structure, vocabulary, and coherence],
        "positiveFeedback": "[One specific strength you noticed - be encouraging and specific]",
        "negativeFeedback": "[One main area for improvement - be constructive and actionable]",
        "improvementSuggestion": "[One practical tip specifically for ${mode} - make it actionable]",
        "youtubeSearchQuery": "[3-4 word search term for learning this skill]"
      }

      Guidelines:
      - Use proper English grammar
      - Be specific and actionable
      - Focus on ${mode} context
      - Keep feedback concise but meaningful
      - Rate clarity based on actual content coherence`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // More robust JSON cleaning
      let cleanedJson = text.trim();
      cleanedJson = cleanedJson.replace(/```json/g, '').replace(/```/g, '');
      cleanedJson = cleanedJson.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const parsedAnalysis = JSON.parse(cleanedJson);
      
      // Validate the response structure
      const requiredKeys = ['fillerWordCount', 'wordsPerMinute', 'clarityScore', 'positiveFeedback', 'negativeFeedback', 'improvementSuggestion', 'youtubeSearchQuery'];
      const missingKeys = requiredKeys.filter(key => !(key in parsedAnalysis));
      
      if (missingKeys.length > 0) {
        throw new Error(`AI response missing required fields: ${missingKeys.join(', ')}`);
      }

      // Ensure clarity score is reasonable
      if (parsedAnalysis.clarityScore < 1 || parsedAnalysis.clarityScore > 10) {
        parsedAnalysis.clarityScore = Math.max(1, Math.min(10, parsedAnalysis.clarityScore));
      }

      setAnalysis(parsedAnalysis);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // More user-friendly error messages
      if (error.message.includes('JSON')) {
        setError("Failed to process AI response. Please try again.");
      } else if (error.message.includes('API')) {
        setError("API connection failed. Please check your internet connection.");
      } else {
        setError(`Analysis failed: ${error.message}`);
      }
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
      <DarkModeToggle />
      <header>
        <img src={logo} alt="Pitch Perfect AI Logo" className="app-logo" />
      </header>
      <main>
        <Recorder
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onAnalysis={handleAnalysis}
          disabled={isLoading} // Disable recording while loading
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