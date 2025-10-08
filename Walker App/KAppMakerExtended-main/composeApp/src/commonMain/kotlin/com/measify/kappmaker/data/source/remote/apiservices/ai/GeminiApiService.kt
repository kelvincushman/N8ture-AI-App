package com.measify.kappmaker.data.source.remote.apiservices.ai

import com.measify.kappmaker.data.source.remote.request.ai.gemini.*
import com.measify.kappmaker.data.source.remote.response.ai.gemini.GeminiIdentifyResponse
import com.measify.kappmaker.domain.model.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.serialization.json.Json
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

/**
 * API service for Google Gemini Vision API
 * Used for AI-powered species identification
 */
class GeminiApiService(
    private val httpClient: HttpClient,
    private val apiKey: String,
    private val baseUrl: String = "https://generativelanguage.googleapis.com/v1beta"
) {
    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = false
        isLenient = true
    }

    /**
     * Identify species from image
     * @param imageData Base64 encoded image data
     * @param mimeType Image MIME type (e.g., "image/jpeg")
     * @param category Optional category hint (PLANT, BIRD, etc.)
     * @return IdentificationResult with primary and alternative matches
     */
    @OptIn(ExperimentalEncodingApi::class)
    suspend fun identifySpecies(
        imageData: ByteArray,
        mimeType: String = "image/jpeg",
        category: SpeciesCategory? = null
    ): Result<IdentificationResult> {
        return try {
            println("🔍 [GeminiAPI] Starting identification... Image size: ${imageData.size} bytes")
            val startTime = System.currentTimeMillis()

            // Encode image to base64
            val base64Image = Base64.encode(imageData)
            println("🔍 [GeminiAPI] Image encoded to Base64. Length: ${base64Image.length}")

            // Create prompt
            val prompt = GeminiPrompts.createIdentificationPrompt(category?.name)
            println("🔍 [GeminiAPI] Prompt created. Category: ${category?.name ?: "None"}")

            // Build request
            val request = GeminiIdentifyRequest(
                contents = listOf(
                    GeminiContent(
                        parts = listOf(
                            GeminiPart(text = prompt),
                            GeminiPart(
                                inlineData = GeminiInlineData(
                                    mimeType = mimeType,
                                    data = base64Image
                                )
                            )
                        )
                    )
                ),
                generationConfig = GeminiGenerationConfig(
                    temperature = 0.4f,
                    maxOutputTokens = 2048
                )
            )

            println("🔍 [GeminiAPI] Sending request to Gemini API...")
            println("🔍 [GeminiAPI] URL: $baseUrl/models/gemini-2.0-flash-exp:generateContent")
            println("🔍 [GeminiAPI] API Key: ${apiKey.take(10)}...")

            // Make API call
            val response: GeminiIdentifyResponse = httpClient.post("$baseUrl/models/gemini-2.0-flash-exp:generateContent") {
                url {
                    parameters.append("key", apiKey)
                }
                contentType(ContentType.Application.Json)
                setBody(request)
            }.body()

            println("🔍 [GeminiAPI] Response received")

            // Check for errors
            if (response.error != null) {
                println("❌ [GeminiAPI] API Error: ${response.error.message}")
                return Result.failure(Exception("Gemini API Error: ${response.error.message}"))
            }

            // Parse response
            val textResponse = response.candidates?.firstOrNull()
                ?.content?.parts?.firstOrNull()?.text

            if (textResponse == null) {
                println("❌ [GeminiAPI] No text response from API")
                println("❌ [GeminiAPI] Response: $response")
                return Result.failure(Exception("No response from Gemini API"))
            }

            println("✅ [GeminiAPI] Got text response. Length: ${textResponse.length}")
            println("🔍 [GeminiAPI] Response preview: ${textResponse.take(200)}...")

            // Parse JSON result from text
            val identificationResult = parseIdentificationResult(textResponse)

            val processingTime = System.currentTimeMillis() - startTime

            println("✅ [GeminiAPI] Identification successful! Time: ${processingTime}ms")
            println("✅ [GeminiAPI] Species: ${identificationResult.primaryMatch.commonName}")

            // Convert to domain model
            val result = convertToIdentificationResult(
                geminiResult = identificationResult,
                imageData = imageData,
                processingTimeMs = processingTime,
                category = category
            )

            Result.success(result)

        } catch (e: Exception) {
            println("❌ [GeminiAPI] Exception: ${e.message}")
            e.printStackTrace()
            Result.failure(e)
        }
    }

    /**
     * Parse Gemini's text response into structured data
     */
    private fun parseIdentificationResult(jsonText: String): com.measify.kappmaker.data.source.remote.response.ai.gemini.GeminiIdentificationResult {
        // Extract JSON from response (may be wrapped in markdown code blocks)
        val cleanJson = jsonText
            .replace("```json", "")
            .replace("```", "")
            .trim()

        return json.decodeFromString(cleanJson)
    }

    /**
     * Convert Gemini result to domain IdentificationResult
     */
    @OptIn(ExperimentalEncodingApi::class)
    private fun convertToIdentificationResult(
        geminiResult: com.measify.kappmaker.data.source.remote.response.ai.gemini.GeminiIdentificationResult,
        imageData: ByteArray,
        processingTimeMs: Long,
        category: SpeciesCategory?
    ): IdentificationResult {
        val primarySpecies = convertToSpecies(geminiResult.primaryMatch)
        val primaryMatch = SpeciesMatch(
            species = primarySpecies,
            confidenceScore = geminiResult.primaryMatch.confidence
        )

        val alternatives = geminiResult.alternatives.map { alt ->
            val altSpecies = Species(
                id = generateSpeciesId(alt.scientificName),
                commonName = alt.commonName,
                scientificName = alt.scientificName,
                family = "",
                category = category ?: SpeciesCategory.UNKNOWN,
                description = alt.reason ?: "",
                habitat = "",
                edibility = EdibilityStatus.UNKNOWN
            )
            SpeciesMatch(
                species = altSpecies,
                confidenceScore = alt.confidence,
                matchDetails = alt.reason
            )
        }

        return IdentificationResult(
            id = generateIdentificationId(),
            timestamp = getCurrentTimestamp(),
            imageUri = "data:image/jpeg;base64,${Base64.encode(imageData)}", // Temporary URI
            primaryMatch = primaryMatch,
            alternativeMatches = alternatives,
            category = category ?: SpeciesCategory.UNKNOWN,
            processingTimeMs = processingTimeMs
        )
    }

    /**
     * Convert Gemini species match to domain Species
     */
    private fun convertToSpecies(match: com.measify.kappmaker.data.source.remote.response.ai.gemini.GeminiSpeciesMatch): Species {
        return Species(
            id = generateSpeciesId(match.scientificName),
            commonName = match.commonName,
            scientificName = match.scientificName,
            family = match.family,
            category = try {
                SpeciesCategory.valueOf(match.category)
            } catch (e: Exception) {
                SpeciesCategory.UNKNOWN
            },
            description = match.description,
            habitat = match.habitat,
            edibility = try {
                EdibilityStatus.valueOf(match.edibility)
            } catch (e: Exception) {
                EdibilityStatus.UNKNOWN
            },
            edibilityDetails = match.edibilityDetails,
            herbalBenefits = match.herbalBenefits,
            safetyWarning = match.safetyWarning
        )
    }

    /**
     * Generate unique species ID from scientific name
     */
    private fun generateSpeciesId(scientificName: String): String {
        return scientificName.lowercase()
            .replace(" ", "_")
            .replace(Regex("[^a-z0-9_]"), "")
    }

    /**
     * Generate unique identification ID
     */
    private fun generateIdentificationId(): String {
        return "id_${System.currentTimeMillis()}_${(0..9999).random()}"
    }

    /**
     * Get current timestamp in ISO 8601 format
     */
    private fun getCurrentTimestamp(): String {
        // Simplified timestamp - should use kotlinx.datetime in production
        return System.currentTimeMillis().toString()
    }
}