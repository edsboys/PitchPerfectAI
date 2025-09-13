// src/components/Analysis.jsx
import React from 'react';
import useTypewriter from './useTypewriter'; // Import our new hook

function Analysis({ analysisResult, isLoading }) {
  // Use the hook for our feedback text
  const positiveFeedbackText = useTypewriter(analysisResult?.positiveFeedback || '', 20);
  const improvementSuggestionText = useTypewriter(analysisResult?.improvementSuggestion || '', 20);

  if (isLoading) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="loading-message">Analyzing your speech...</div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="placeholder-message">Your analysis will appear here.</div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <h2>2. AI Analysis</h2>
      <div className="results-grid">
        <div className="metric-card">
          <h4>Clarity Score</h4>
          <p className="metric-value">{analysisResult.clarityScore}/10</p>
        </div>
        <div className="metric-card">
          <h4>Filler Words</h4>
          <p className="metric-value">{analysisResult.fillerWordCount}</p>
        </div>
        <div className="metric-card">
          <h4>Pace (WPM)</h4>
          <p className="metric-value">{analysisResult.wordsPerMinute}</p>
        </div>
      </div>
      <div className="feedback-card positive-feedback">
        <h4>👍 What Went Well</h4>
        <p>{positiveFeedbackText}</p> {/* Use the animated text */}
      </div>
      <div className="feedback-card improvement-feedback">
        <h4>💡 Improvement Suggestion</h4>
        <p>{improvementSuggestionText}</p> {/* Use the animated text */}
      </div>
    </div>
  );
}

export default Analysis;