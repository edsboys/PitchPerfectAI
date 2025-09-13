import React, { useState } from 'react';
import Recorder from './components/Recorder';
import Analysis from './components/Analysis';
import './index.css';
import logo from './assets/logo.png'; // <-- 1. IMPORT THE LOGO

import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecordingComplete = async (transcript) => {
    if (!transcript) {
      alert("Could not hear any speech. Please try again.");
      return;
    }
    
    setIsLoading(true);
    setAnalysis(null);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

    const prompt = `Analyze the following speech transcript. The user was speaking for approximately 30-60 seconds. Provide your analysis in a clean JSON object. Do not include any text or markdown formatting outside of the JSON. The JSON object must have the following keys: "fillerWordCount", "wordsPerMinute", "clarityScore" (out of 10), "positiveFeedback" (one sentence), and "improvementSuggestion" (one actionable tip). Here is the transcript: "${transcript}"`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '');
      const parsedAnalysis = JSON.parse(cleanedJson);
      setAnalysis(parsedAnalysis);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      alert("There was an error analyzing your speech. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        {/* 2. DISPLAY THE LOGO INSTEAD OF THE OLD TEXT */}
        <img src={logo} alt="Pitch Perfect AI Logo" className="app-logo" />
      </header>
      <main>
        <Recorder onRecordingComplete={handleRecordingComplete} />
        <Analysis analysisResult={analysis} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;