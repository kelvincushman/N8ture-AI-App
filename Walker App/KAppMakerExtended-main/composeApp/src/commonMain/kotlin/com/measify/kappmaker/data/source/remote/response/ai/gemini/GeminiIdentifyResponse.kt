package com.measify.kappmaker.data.source.remote.response.ai.gemini

import kotlinx.serialization.Serializable

/**
 * Response from Gemini Vision API
 */
@Serializable
data class GeminiIdentifyResponse(
    val candidates: List<GeminiCandidate>? = null,
    val promptFeedback: GeminiPromptFeedback? = null,
    val error: GeminiError? = null
)

@Serializable
data class GeminiCandidate(
    val content: GeminiResponseContent? = null,
    val finishReason: String? = null,
    val index: Int = 0,
    val safetyRatings: List<GeminiSafetyRating>? = null
)

@Serializable
data class GeminiResponseContent(
    val parts: List<GeminiResponsePart>? = null,
    val role: String = "model"
)

@Serializable
data class GeminiResponsePart(
    val text: String? = null
)

@Serializable
data class GeminiPromptFeedback(
    val blockReason: String? = null,
    val safetyRatings: List<GeminiSafetyRating>? = null
)

@Serializable
data class GeminiSafetyRating(
    val category: String,
    val probability: String
)

@Serializable
data class GeminiError(
    val code: Int,
    val message: String,
    val status: String
)

/**
 * Parsed identification result from Gemini's text response
 */
@Serializable
data class GeminiIdentificationResult(
    val primaryMatch: GeminiSpeciesMatch,
    val alternatives: List<GeminiAlternativeMatch> = emptyList()
)

@Serializable
data class GeminiSpeciesMatch(
    val commonName: String,
    val scientificName: String,
    val family: String,
    val category: String,
    val confidence: Float,
    val description: String,
    val habitat: String,
    val edibility: String,
    val edibilityDetails: String? = null,
    val herbalBenefits: String? = null,
    val safetyWarning: String? = null
)

@Serializable
data class GeminiAlternativeMatch(
    val commonName: String,
    val scientificName: String,
    val confidence: Float,
    val reason: String? = null
)