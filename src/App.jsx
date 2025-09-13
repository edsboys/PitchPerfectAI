import React, { useState } from 'react';
import Recorder from './components/Recorder';
import Analysis from './components/Analysis';
import './index.css';

// This is the new AI setup part
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // This function will be called by the Recorder when a transcript is ready
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

      // Clean up the text to make sure it's valid JSON
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
        <h1>Pitch Perfect AI 🎙️</h1>
        <p>Your Personal Public Speaking Coach</p>
      </header>
      <main>
        {/* We pass the handleRecordingComplete function to the Recorder */}
        <Recorder onRecordingComplete={handleRecordingComplete} />
        {/* We pass the analysis results and loading state to the Analysis component */}
        <Analysis analysisResult={analysis} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;