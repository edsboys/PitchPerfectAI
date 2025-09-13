// Main App component - Entry point for Pitch Perfect AI application
import React, { useState } from 'react';
import Recorder from './components/Recorder';
import Analysis from './components/Analysis';
import DarkModeToggle from './components/DarkModeToggle';
import './index.css';
import logo from './assets/logo.png';

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google's Gemini AI with API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing API key. Please set VITE_GEMINI_API_KEY in your environment variables.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  // State management for the application
  const [analysis, setAnalysis] = useState(null);      // Stores AI analysis results
  const [isLoading, setIsLoading] = useState(false);   // Loading state for UI feedback
  const [isRecording, setIsRecording] = useState(false); // Recording state from Recorder
  const [error, setError] = useState(null);            // Error messages for user feedback

  /**
   * Main function that processes speech transcript and generates AI analysis
   * @param {string} transcript - The recorded speech text
   * @param {string} mode - The coaching mode (General Feedback, Job Interview, Business Pitch)
   */
  const handleAnalysis = async (transcript, mode) => {
    // Input validation - ensure transcript is long enough for meaningful analysis
    if (!transcript || transcript.trim().length < 10) {
      setError("Please provide a longer speech sample for better analysis.");
      return;
    }

    // Verify API key is available before making requests
    if (!API_KEY) {
      setError("API key is missing. Please check your environment configuration.");
      return;
    }

    // Set loading state and clear previous results/errors
    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      // Initialize Gemini AI model for content generation
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      // Calculate speech metrics from transcript before sending to AI
      const wordCount = transcript.trim().split(/\s+/).length;           // Count total words
      const estimatedDuration = wordCount / 2.5;                        // Estimate duration (assumes ~150 WPM)
      const wordsPerMinute = Math.round(wordCount / (estimatedDuration / 60)); // Calculate WPM

      // Count filler words in the transcript
      const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally'];
      const fillerCount = fillerWords.reduce((count, filler) => {
        // Use regex to find whole word matches (case-insensitive)
        const regex = new RegExp(`\\b${filler}\\b`, 'gi');
        return count + (transcript.match(regex) || []).length;
      }, 0);

      // Construct detailed prompt for AI analysis
      const prompt = `You are 'Pitch Perfect AI', a world-class speech coach. Your feedback is always constructive, specific, and encouraging.
      Analyze the following speech transcript.

      **Context:**
      - Scenario: "${mode}"
      - Transcript Word Count: ${wordCount}
      - Estimated Duration: ${Math.round(estimatedDuration)} seconds
      - Transcript: "${transcript}"

      **Task:**
      Provide your analysis in a perfectly formatted JSON object. Do not include any text or markdown formatting (like \`\`\`json) outside of the JSON. The response MUST be only the JSON.

      **JSON Schema:**
      {
        "fillerWordCount": ${fillerCount},
        "wordsPerMinute": ${wordsPerMinute},
        "clarityScore": <integer, 1-10>,
        "positiveFeedback": "<string, one specific and encouraging sentence>",
        "negativeFeedback": "<string, one constructive area for improvement>",
        "improvementSuggestion": "<string, one actionable tip relevant to the scenario>",
        "youtubeSearchQuery": "<string, a concise YouTube search query to help with the improvement suggestion>"
      }
    
      Guidelines:
      - Use proper English grammar
      - Be specific and actionable
      - Focus on ${mode} context
      - Keep feedback concise but meaningful
      - Rate clarity based on actual content coherence`;

      // Send prompt to AI and get response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up AI response to extract pure JSON
      let cleanedJson = text.trim();
      cleanedJson = cleanedJson.replace(/```json/g, '').replace(/```/g, ''); // Remove markdown formatting
      cleanedJson = cleanedJson.replace(/^[^{]*/, '').replace(/[^}]*$/, ''); // Remove text before { and after }

      // Parse the cleaned JSON response
      const parsedAnalysis = JSON.parse(cleanedJson);
      
      // --- ACHIEVEMENT BADGE SYSTEM ---
      // Award badges based on performance metrics
      const earnedBadges = [];
      
      // Award "Clarity Champion" for high clarity score (8+/10)
      if (parsedAnalysis.clarityScore >= 8) {
        earnedBadges.push({ name: "Clarity Champion", emoji: "🏆" });
      }
      
      // Award "Eloquent Speaker" for minimal filler words (2 or fewer)
      if (parsedAnalysis.fillerWordCount <= 2) {
        earnedBadges.push({ name: "Eloquent Speaker", emoji: "🗣️" });
      }
      
      // Award "Pace Pro" for optimal speaking pace (120-150 WPM)
      if (parsedAnalysis.wordsPerMinute >= 120 && parsedAnalysis.wordsPerMinute <= 150) {
        earnedBadges.push({ name: "Pace Pro", emoji: "⏱️" });
      }

      // Add badges to analysis results
      parsedAnalysis.badges = earnedBadges;

      // Validate that AI response contains all required fields
      const requiredKeys = ['fillerWordCount', 'wordsPerMinute', 'clarityScore', 'positiveFeedback', 'negativeFeedback', 'improvementSuggestion', 'youtubeSearchQuery'];
      const missingKeys = requiredKeys.filter(key => !(key in parsedAnalysis));

      // Throw error if any required fields are missing
      if (missingKeys.length > 0) {
        throw new Error(`AI response missing required fields: ${missingKeys.join(', ')}`);
      }

      // Ensure clarity score is within valid range (1-10)
      if (parsedAnalysis.clarityScore < 1 || parsedAnalysis.clarityScore > 10) {
        parsedAnalysis.clarityScore = Math.max(1, Math.min(10, parsedAnalysis.clarityScore));
      }

      // Update state with successful analysis results
      setAnalysis(parsedAnalysis);

    } catch (error) {
      // Log error for debugging
      console.error("Error calling Gemini API:", error);

      // Provide user-friendly error messages based on error type
      if (error.message.includes('JSON')) {
        setError("Failed to process AI response. Please try again.");
      } else if (error.message.includes('API')) {
        setError("API connection failed. Please check your internet connection.");
      } else {
        setError(`Analysis failed: ${error.message}`);
      }
    } finally {
      // Always clear loading state when operation completes
      setIsLoading(false);
    }
  };

  /**
   * Reset error state and clear previous analysis results
   * Used by the retry button in error states
   */
  const handleRetry = () => {
    setError(null);
    setAnalysis(null);
  };

  // Render the main application UI
  return (
    <div className="app-container">
      {/* Dark mode toggle button */}
      <DarkModeToggle />
      
      {/* Application header with logo */}
      <header>
        <img src={logo} alt="Pitch Perfect AI Logo" className="app-logo" />
      </header>
      
      {/* Main content area */}
      <main>
        {/* Recording component - handles speech capture and mode selection */}
        <Recorder
          isRecording={isRecording}           // Current recording state
          setIsRecording={setIsRecording}     // Function to update recording state
          onAnalysis={handleAnalysis}         // Callback when recording is complete
          disabled={isLoading}                // Disable recording while analysis is processing
        />
        
        {/* Analysis component - displays AI feedback and results */}
        <Analysis
          analysisResult={analysis}           // AI analysis data to display
          isLoading={isLoading}              // Show loading spinner during analysis
          error={error}                      // Error message to display
          onRetry={handleRetry}              // Retry function for error recovery
        />
      </main>
    </div>
  );
}

export default App;