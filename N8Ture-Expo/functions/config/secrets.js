/**
 * Configuration and secrets management
 *
 * Loads API keys from environment variables
 * For production, use Firebase Secret Manager: firebase functions:secrets:set GEMINI_API_KEY
 */

/**
 * Get Gemini API key from environment
 */
function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set');
    throw new Error('Gemini API key is not configured');
  }

  return apiKey;
}

/**
 * Get configuration object
 */
function getConfig() {
  return {
    gemini: {
      apiKey: getGeminiApiKey(),
      model: 'gemini-2.0-flash-exp', // or 'gemini-1.5-flash'
      maxRetries: 3,
      timeout: 30000, // 30 seconds
    },
  };
}

module.exports = {
  getGeminiApiKey,
  getConfig,
};
