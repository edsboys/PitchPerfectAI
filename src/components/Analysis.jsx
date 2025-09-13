import React from 'react';

// The component now accepts props: 'analysisResult' and 'isLoading'
function Analysis({ analysisResult, isLoading }) {
  // If the AI is thinking, show a loading message
  if (isLoading) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="loading-message">Analyzing your speech...</div>
      </div>
    );
  }

  // If there's no result yet, show the placeholder
  if (!analysisResult) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="placeholder-message">Your analysis will appear here.</div>
      </div>
    );
  }

  // If we have a result, display it
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
        <p>{analysisResult.positiveFeedback}</p>
      </div>
      <div className="feedback-card improvement-feedback">
        <h4>💡 Improvement Suggestion</h4>
        <p>{analysisResult.improvementSuggestion}</p>
      </div>
    </div>
  );
}

export default Analysis;