import React, { memo } from 'react';
import PropTypes from 'prop-types';

const DarkModeToggle = memo(function DarkModeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <button 
      className="dark-mode-toggle" 
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
});

DarkModeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
};

export default DarkModeToggle;