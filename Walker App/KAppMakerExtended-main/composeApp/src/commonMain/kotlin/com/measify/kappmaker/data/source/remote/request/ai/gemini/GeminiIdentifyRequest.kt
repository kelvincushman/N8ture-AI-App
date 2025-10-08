package com.measify.kappmaker.data.source.remote.request.ai.gemini

import kotlinx.serialization.Serializable

/**
 * Request for Gemini Vision API to identify species
 */
@Serializable
data class GeminiIdentifyRequest(
    val contents: List<GeminiContent>,
    val generationConfig: GeminiGenerationConfig? = null,
    val safetySettings: List<GeminiSafetySetting>? = null
)

@Serializable
data class GeminiContent(
    val parts: List<GeminiPart>,
    val role: String = "user"
)

@Serializable
data class GeminiPart(
    val text: String? = null,
    val inlineData: GeminiInlineData? = null
)

@Serializable
data class GeminiInlineData(
    val mimeType: String,
    val data: String // Base64 encoded image
)

@Serializable
data class GeminiGenerationConfig(
    val temperature: Float = 0.4f,
    val topK: Int = 32,
    val topP: Float = 1.0f,
    val maxOutputTokens: Int = 2048,
    val stopSequences: List<String>? = null
)

@Serializable
data class GeminiSafetySetting(
    val category: String,
    val threshold: String = "BLOCK_MEDIUM_AND_ABOVE"
)

/**
 * Helper to create identification prompt
 */
object GeminiPrompts {
    fun createIdentificationPrompt(category: String? = null): String {
        val categoryHint = category?.let { " focusing on $it" } ?: ""

        return """
You are a wildlife and nature identification expert. Analyze the provided image$categoryHint and provide a detailed identification.

Respond in the following JSON format:
{
  "primaryMatch": {
    "commonName": "Common species name",
    "scientificName": "Genus species",
    "family": "Family name",
    "category": "PLANT|MAMMAL|BIRD|REPTILE|AMPHIBIAN|INSECT|FUNGI",
    "confidence": 0.95,
    "description": "Brief description",
    "habitat": "Natural habitat",
    "edibility": "EDIBLE|CONDITIONALLY_EDIBLE|INEDIBLE|POISONOUS|NOT_APPLICABLE",
    "edibilityDetails": "Details about edibility or why not applicable",
    "herbalBenefits": "Medicinal or herbal uses if any",
    "safetyWarning": "Important safety warnings if dangerous"
  },
  "alternatives": [
    {
      "commonName": "Alternative 1",
      "scientificName": "Genus species",
      "confidence": 0.75,
      "reason": "Why this could be an alternative"
    }
  ]
}

Important:
- Be accurate and err on the side of caution
- If unsure, lower the confidence score
- For edibility, ALWAYS include safety warnings for poisonous species
- Provide 1-3 alternative possibilities if identification isn't certain
""".trimIndent()
    }
}