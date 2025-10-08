package com.measify.kappmaker.data.repository

import com.measify.kappmaker.data.source.local.TrialManager
import com.measify.kappmaker.data.source.local.dao.IdentificationHistoryDao
import com.measify.kappmaker.data.source.local.dao.SpeciesDao
import com.measify.kappmaker.data.source.local.entity.toEntity
import com.measify.kappmaker.data.source.local.entity.toDomain
import com.measify.kappmaker.data.source.remote.apiservices.ai.GeminiApiService
import com.measify.kappmaker.domain.model.IdentificationResult
import com.measify.kappmaker.domain.model.Species
import com.measify.kappmaker.domain.model.SpeciesCategory
import com.measify.kappmaker.domain.model.TrialState
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/**
 * Repository for species identification operations
 * Coordinates between Gemini API, local database, and trial management
 */
class IdentificationRepository(
    private val geminiApiService: GeminiApiService,
    private val speciesDao: SpeciesDao,
    private val historyDao: IdentificationHistoryDao,
    private val trialManager: TrialManager
) {

    /**
     * Identify species from image
     * @param imageData Raw image data
     * @param category Optional category hint
     * @param isSubscribed Whether user has premium subscription
     * @return Result containing IdentificationResult or error
     */
    suspend fun identifySpecies(
        imageData: ByteArray,
        category: SpeciesCategory? = null,
        isSubscribed: Boolean = false
    ): Result<IdentificationResult> {
        // Check trial status if not subscribed
        if (!isSubscribed && !trialManager.canIdentify()) {
            return Result.failure(TrialExpiredException("No identifications remaining. Please upgrade to premium."))
        }

        // Call Gemini API
        val result = geminiApiService.identifySpecies(
            imageData = imageData,
            category = category
        )

        return result.onSuccess { identification ->
            // Save to history
            saveIdentificationToHistory(identification)

            // Cache species data
            cacheSpecies(identification.primaryMatch.species)

            // Decrement trial count if not subscribed
            if (!isSubscribed) {
                trialManager.useTrialIdentification()
            }
        }
    }

    /**
     * Get trial state
     */
    fun getTrialState(): TrialState {
        return trialManager.getTrialState()
    }

    /**
     * Get identification history
     */
    fun getHistory(limit: Int = 10): Flow<List<IdentificationResult>> {
        return historyDao.getRecentFlow(limit).map { entities ->
            entities.mapNotNull { entity ->
                val species = speciesDao.getSpeciesById(entity.primaryMatchSpeciesId)
                    ?.toDomain()

                species?.let {
                    entity.toDomain(it, emptyList())
                }
            }
        }
    }

    /**
     * Get favorites
     */
    fun getFavorites(): Flow<List<IdentificationResult>> {
        return historyDao.getFavoritesFlow().map { entities ->
            entities.mapNotNull { entity ->
                val species = speciesDao.getSpeciesById(entity.primaryMatchSpeciesId)
                    ?.toDomain()

                species?.let {
                    entity.toDomain(it, emptyList())
                }
            }
        }
    }

    /**
     * Get identification by ID
     */
    suspend fun getIdentificationById(id: String): IdentificationResult? {
        val entity = historyDao.getById(id) ?: return null
        val species = speciesDao.getSpeciesById(entity.primaryMatchSpeciesId)
            ?.toDomain()
            ?: return null

        return entity.toDomain(species, emptyList())
    }

    /**
     * Toggle favorite status
     */
    suspend fun toggleFavorite(id: String, isFavorite: Boolean) {
        historyDao.updateFavoriteStatus(id, isFavorite)
    }

    /**
     * Add notes to identification
     */
    suspend fun addNotes(id: String, notes: String) {
        historyDao.updateNotes(id, notes)
    }

    /**
     * Delete identification from history
     */
    suspend fun deleteIdentification(id: String) {
        historyDao.delete(id)
    }

    /**
     * Get species by ID
     */
    suspend fun getSpeciesById(id: String): Species? {
        return speciesDao.getSpeciesById(id)
            ?.toDomain()
    }

    /**
     * Search species
     */
    suspend fun searchSpecies(query: String): List<Species> {
        return speciesDao.searchSpecies(query).map {
            it.toDomain()
        }
    }

    /**
     * Get cached species for offline mode
     */
    fun getCachedSpecies(limit: Int = 50): Flow<List<Species>> {
        return speciesDao.getRecentlyCachedFlow(limit).map { entities ->
            entities.map { it.toDomain() }
        }
    }

    // Private helpers

    private suspend fun saveIdentificationToHistory(identification: IdentificationResult) {
        historyDao.insert(identification.toEntity())
    }

    private suspend fun cacheSpecies(species: Species) {
        speciesDao.insertSpecies(species.toEntity())
    }
}

/**
 * Custom exception for trial expiration
 */
class TrialExpiredException(message: String) : Exception(message)