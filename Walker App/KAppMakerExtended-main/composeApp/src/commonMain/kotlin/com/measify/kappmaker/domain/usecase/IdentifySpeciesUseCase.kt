package com.measify.kappmaker.domain.usecase

import com.measify.kappmaker.data.repository.IdentificationRepository
import com.measify.kappmaker.domain.model.IdentificationResult
import com.measify.kappmaker.domain.model.SpeciesCategory

/**
 * Use case for identifying species from images
 */
class IdentifySpeciesUseCase(
    private val repository: IdentificationRepository
) {
    suspend operator fun invoke(
        imageData: ByteArray,
        category: SpeciesCategory? = null,
        isSubscribed: Boolean = false
    ): Result<IdentificationResult> {
        return repository.identifySpecies(
            imageData = imageData,
            category = category,
            isSubscribed = isSubscribed
        )
    }
}

/**
 * Use case for checking trial status
 */
class CheckTrialStatusUseCase(
    private val repository: IdentificationRepository
) {
    operator fun invoke() = repository.getTrialState()
}

/**
 * Use case for getting identification history
 */
class GetIdentificationHistoryUseCase(
    private val repository: IdentificationRepository
) {
    operator fun invoke(limit: Int = 10) = repository.getHistory(limit)
}

/**
 * Use case for managing favorites
 */
class ManageFavoritesUseCase(
    private val repository: IdentificationRepository
) {
    fun getFavorites() = repository.getFavorites()

    suspend fun toggleFavorite(id: String, isFavorite: Boolean) {
        repository.toggleFavorite(id, isFavorite)
    }
}

/**
 * Use case for searching species
 */
class SearchSpeciesUseCase(
    private val repository: IdentificationRepository
) {
    suspend operator fun invoke(query: String) = repository.searchSpecies(query)
}