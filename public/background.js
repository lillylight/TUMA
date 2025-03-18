
// Background script for TUMA Chrome Extension
console.log('TUMA Extension background script initialized');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('TUMA Extension installed');
  }
});
