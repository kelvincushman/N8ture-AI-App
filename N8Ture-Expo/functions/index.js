/**
 * Firebase Cloud Functions for N8ture AI
 *
 * Main entry point for all cloud functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const geminiService = require('./services/geminiService');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Identify Species Cloud Function
 *
 * Accepts a base64 encoded image and returns species identification data
 *
 * @param {Object} data - Request data
 * @param {string} data.imageBase64 - Base64 encoded image (without data:image prefix)
 * @param {string} [data.category] - Optional category hint (plant|animal|fungi|insect)
 * @param {Object} context - Function context with auth info
 * @returns {Object} Identification response
 */
exports.identifySpecies = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '512MB',
  })
  .https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to identify species'
      );
    }

    const userId = context.auth.uid;
    console.log(`Identification request from user: ${userId}`);

    // Validate input
    if (!data.imageBase64 || typeof data.imageBase64 !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'imageBase64 is required and must be a string'
      );
    }

    // Optional: Check user's trial status via Clerk or Firestore
    // For now, we assume the client has already validated trial limits

    try {
      // Call Gemini service
      const identificationData = await geminiService.identifySpecies(
        data.imageBase64,
        data.category
      );

      // Add timestamp
      identificationData.identifiedAt = new Date().toISOString();

      // Optional: Save to Firestore for history
      // const historyRef = admin.firestore().collection('identifications').doc();
      // await historyRef.set({
      //   userId,
      //   ...identificationData,
      //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // });
      // identificationData.id = historyRef.id;

      console.log(
        `Identification successful: ${identificationData.commonName} (${identificationData.confidence}%)`
      );

      // Return success response
      return {
        success: true,
        data: identificationData,
      };
    } catch (error) {
      console.error('Error in identifySpecies function:', error);

      // Map errors to appropriate HTTP errors
      if (error.message.includes('API key')) {
        throw new functions.https.HttpsError(
          'internal',
          'API configuration error'
        );
      } else if (error.message.includes('quota')) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'API quota exceeded. Please try again later.'
        );
      } else if (error.message.includes('timeout')) {
        throw new functions.https.HttpsError(
          'deadline-exceeded',
          'Request timeout. Please try again.'
        );
      }

      throw new functions.https.HttpsError(
        'internal',
        'Species identification failed: ' + error.message
      );
    }
  });

/**
 * Health check function
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'n8ture-ai-functions',
  });
});
