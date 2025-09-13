// src/components/Analysis.jsx
import React from 'react';
import useTypewriter from './useTypewriter';

function Analysis({ analysisResult, isLoading, error, onRetry }) {
  // Use the hook for our feedback text
  const positiveFeedbackText = useTypewriter(analysisResult?.positiveFeedback || '', 30);
  const negativeFeedbackText = useTypewriter(analysisResult?.negativeFeedback || '', 30);
  const improvementSuggestionText = useTypewriter(analysisResult?.improvementSuggestion || '', 50);

  if (error) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="error-message">
          <p>{error}</p>
          {onRetry && <button onClick={onRetry}>Try Again</button>}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="loading-message">
          <div className="spinner"></div>
          Analyzing your speech...
        </div>
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
          <p className="metric-value">{analysisResult.clarityScore || 'N/A'}/10</p>
        </div>
        <div className="metric-card">
          <h4>Filler Words</h4>
          <p className="metric-value">{analysisResult.fillerWordCount || 0}</p>
        </div>
        <div className="metric-card">
          <h4>Pace (WPM)</h4>
          <p className="metric-value">{analysisResult.wordsPerMinute || 'N/A'}</p>
        </div>
      </div>
      <div className="feedback-card positive-feedback">
        <h4>👍 What Went Well</h4>
        <p>{positiveFeedbackText}</p>
      </div>
      <div className="feedback-card negative-feedback">
        <h4>⚠️ Areas for Improvement</h4>
        <p>{negativeFeedbackText}</p>
      </div>
      <div className="feedback-card improvement-feedback">
        <h4>💡 Improvement Suggestion</h4>
        <p>{improvementSuggestionText}</p>
      </div>
      {analysisResult.youtubeSearchQuery && (
        <div className="feedback-card">
          <h4>📺 Learn More</h4>
          <a 
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(analysisResult.youtubeSearchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-link"
          >
            Search YouTube: "{analysisResult.youtubeSearchQuery}"
          </a>
        </div>
      )}
    </div>
  );
}

export default Analysis;