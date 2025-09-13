// src/components/Analysis.jsx
import React from 'react';
import useTypewriter from './useTypewriter';
import PropTypes from 'prop-types';

function Analysis({ analysisResult, isLoading, error, onRetry }) {
  // Use the hook for our feedback text with fallback values
  const positiveFeedbackText = useTypewriter(
    analysisResult?.positiveFeedback || 'Great job on your speech!', 
    30
  );
  const negativeFeedbackText = useTypewriter(
    analysisResult?.negativeFeedback || 'Consider working on your pacing and clarity.', 
    30
  );
  const improvementSuggestionText = useTypewriter(
    analysisResult?.improvementSuggestion || 'Practice speaking more slowly and clearly.', 
    50
  );

  // Error state - show error message with retry button
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

  // Loading state - show spinner while AI processes
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

  // Empty state - no analysis results yet
  if (!analysisResult) {
    return (
      <div className="analysis-container">
        <h2>2. AI Analysis</h2>
        <div className="placeholder-message">Your analysis will appear here.</div>
      </div>
    );
  }

  // Main analysis display
  return (
    <div className="analysis-container">
      <h2>2. AI Analysis</h2>
      
      {/* Metrics Grid - Display key speech metrics */}
      <div className="results-grid">
        <div className="metric-card">
          <h4>Clarity Score</h4>
          <p className="metric-value">
            {analysisResult.clarityScore ? `${analysisResult.clarityScore}/10` : 'N/A'}
          </p>
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
      
      {/* Achievement Badges - Show earned badges if any */}
      {analysisResult.badges && analysisResult.badges.length > 0 && (
        <div className="badges-container">
          <h4>🏅 Badges Earned</h4>
          <div className="badges-grid">
            {analysisResult.badges.map((badge, index) => (
              <div key={`${badge.name}-${index}`} className="badge">
                <span className="badge-emoji">{badge.emoji}</span>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Positive Feedback - Highlight strengths */}
      <div className="feedback-card positive-feedback">
        <h4>👍 What Went Well</h4>
        <p>{positiveFeedbackText}</p>
      </div>
      
      {/* Areas for Improvement */}
      <div className="feedback-card negative-feedback">
        <h4>⚠️ Areas for Improvement</h4>
        <p>{negativeFeedbackText}</p>
      </div>
      
      {/* Actionable Improvement Suggestion */}
      <div className="feedback-card improvement-feedback">
        <h4>💡 Improvement Suggestion</h4>
        <p>{improvementSuggestionText}</p>
      </div>
      
      {/* YouTube Learning Resource - Only show if query exists */}
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

Analysis.propTypes = {
  analysisResult: PropTypes.shape({
    clarityScore: PropTypes.number,
    fillerWordCount: PropTypes.number,
    wordsPerMinute: PropTypes.number,
    positiveFeedback: PropTypes.string,
    improvementSuggestion: PropTypes.string,
    youtubeSearchQuery: PropTypes.string,
    badges: PropTypes.array, // Add badges to prop types
  }),
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

Analysis.defaultProps = {
  analysisResult: null,
  error: null,
};

export default Analysis;