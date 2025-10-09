package com.measify.kappmaker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.measify.kappmaker.data.repository.JourneyRepository
import com.measify.kappmaker.domain.model.Discovery
import com.measify.kappmaker.domain.model.Journey
import com.measify.kappmaker.domain.model.JourneyStatsSummary
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

/**
 * ViewModel for Journey Tracking feature
 *
 * Manages:
 * - Active journey state
 * - Journey history
 * - Journey lifecycle (start, pause, resume, end)
 * - Discovery management
 * - Search and filtering
 *
 * Usage with Koin DI:
 * ```kotlin
 * val repositoryModule = module {
 *     single { LocationManager(androidContext()) }
 *     single { JourneyRepository(get()) }
 * }
 *
 * val viewModelModule = module {
 *     viewModel { JourneyViewModel(get(), get()) }
 * }
 * ```
 *
 * Usage in Composable:
 * ```kotlin
 * @Composable
 * fun JourneyScreen(viewModel: JourneyViewModel = koinViewModel()) {
 *     val activeJourney by viewModel.activeJourney.collectAsState()
 *     val uiState by viewModel.uiState.collectAsState()
 *
 *     when (val state = uiState) {
 *         is JourneyUiState.Idle -> StartJourneyButton(onClick = viewModel::startJourney)
 *         is JourneyUiState.Active -> ActiveJourneyScreen(journey = state.journey)
 *         is JourneyUiState.Error -> ErrorView(state.message)
 *     }
 * }
 * ```
 */
class JourneyViewModel(
    private val journeyRepository: JourneyRepository,
    private val userId: String // From user session/auth
) : ViewModel() {

    // Active journey state
    val activeJourney: StateFlow<Journey?> = journeyRepository.activeJourney
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            null
        )

    // Journey history
    val journeyHistory: StateFlow<List<Journey>> = journeyRepository.journeyHistory
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

    // UI State
    private val _uiState = MutableStateFlow<JourneyUiState>(JourneyUiState.Idle)
    val uiState: StateFlow<JourneyUiState> = _uiState.asStateFlow()

    // Error state
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    // Loading state
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    // Search query
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    // Filtered journeys based on search
    val filteredJourneys: StateFlow<List<Journey>> = combine(
        journeyHistory,
        searchQuery
    ) { history, query ->
        if (query.isEmpty()) {
            history
        } else {
            history.filter { journey ->
                journey.title.contains(query, ignoreCase = true) ||
                journey.description?.contains(query, ignoreCase = true) == true ||
                journey.tags.any { it.contains(query, ignoreCase = true) }
            }
        }
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )

    // Journey statistics summary
    private val _statsSummary = MutableStateFlow<JourneyStatsSummary?>(null)
    val statsSummary: StateFlow<JourneyStatsSummary?> = _statsSummary.asStateFlow()

    init {
        // Load journey history on init
        loadJourneyHistory()
        loadStatsSummary()

        // Update UI state based on active journey
        viewModelScope.launch {
            activeJourney.collect { journey ->
                _uiState.value = when {
                    journey != null -> JourneyUiState.Active(journey)
                    else -> JourneyUiState.Idle
                }
            }
        }
    }

    /**
     * Start a new journey
     */
    fun startJourney(title: String = "Nature Walk", description: String? = null) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null

            journeyRepository.startJourney(userId, title, description)
                .onSuccess { journey ->
                    _uiState.value = JourneyUiState.Active(journey)
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Failed to start journey"
                    _uiState.value = JourneyUiState.Error(exception.message ?: "Unknown error")
                }

            _isLoading.value = false
        }
    }

    /**
     * Pause active journey
     */
    fun pauseJourney() {
        viewModelScope.launch {
            activeJourney.value?.let { journey ->
                _isLoading.value = true

                journeyRepository.pauseJourney(journey.id)
                    .onFailure { exception ->
                        _error.value = exception.message ?: "Failed to pause journey"
                    }

                _isLoading.value = false
            }
        }
    }

    /**
     * Resume paused journey
     */
    fun resumeJourney() {
        viewModelScope.launch {
            activeJourney.value?.let { journey ->
                _isLoading.value = true

                journeyRepository.resumeJourney(journey.id)
                    .onFailure { exception ->
                        _error.value = exception.message ?: "Failed to resume journey"
                    }

                _isLoading.value = false
            }
        }
    }

    /**
     * End active journey
     */
    fun endJourney(onComplete: (Journey) -> Unit = {}) {
        viewModelScope.launch {
            activeJourney.value?.let { journey ->
                _isLoading.value = true

                journeyRepository.endJourney(journey.id)
                    .onSuccess { completedJourney ->
                        _uiState.value = JourneyUiState.Completed(completedJourney)
                        loadJourneyHistory() // Refresh history
                        loadStatsSummary()   // Update stats
                        onComplete(completedJourney)
                    }
                    .onFailure { exception ->
                        _error.value = exception.message ?: "Failed to end journey"
                    }

                _isLoading.value = false
            }
        }
    }

    /**
     * Cancel active journey
     */
    fun cancelJourney() {
        viewModelScope.launch {
            activeJourney.value?.let { journey ->
                _isLoading.value = true

                journeyRepository.cancelJourney(journey.id)
                    .onSuccess {
                        _uiState.value = JourneyUiState.Idle
                    }
                    .onFailure { exception ->
                        _error.value = exception.message ?: "Failed to cancel journey"
                    }

                _isLoading.value = false
            }
        }
    }

    /**
     * Add discovery to active journey
     */
    fun addDiscovery(discovery: Discovery) {
        viewModelScope.launch {
            activeJourney.value?.let { journey ->
                journeyRepository.addDiscovery(journey.id, discovery)
                    .onFailure { exception ->
                        _error.value = exception.message ?: "Failed to add discovery"
                    }
            }
        }
    }

    /**
     * Update journey metadata
     */
    fun updateJourneyTitle(journeyId: String, newTitle: String) {
        viewModelScope.launch {
            journeyRepository.updateJourneyMetadata(journeyId, title = newTitle)
                .onSuccess {
                    loadJourneyHistory() // Refresh to show updated title
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Failed to update title"
                }
        }
    }

    /**
     * Delete journey
     */
    fun deleteJourney(journeyId: String, onComplete: () -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true

            journeyRepository.deleteJourney(journeyId)
                .onSuccess {
                    loadJourneyHistory()
                    loadStatsSummary()
                    onComplete()
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Failed to delete journey"
                }

            _isLoading.value = false
        }
    }

    /**
     * Share journey
     */
    fun shareJourney(journeyId: String, onSuccess: (String) -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true

            journeyRepository.shareJourney(journeyId)
                .onSuccess { shareUrl ->
                    onSuccess(shareUrl)
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Failed to share journey"
                }

            _isLoading.value = false
        }
    }

    /**
     * Export journey as GPX
     */
    fun exportJourneyAsGPX(journeyId: String, onSuccess: (String) -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true

            journeyRepository.exportJourneyAsGPX(journeyId)
                .onSuccess { gpxContent ->
                    onSuccess(gpxContent)
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Failed to export journey"
                }

            _isLoading.value = false
        }
    }

    /**
     * Search journeys
     */
    fun searchJourneys(query: String) {
        _searchQuery.value = query
    }

    /**
     * Clear search
     */
    fun clearSearch() {
        _searchQuery.value = ""
    }

    /**
     * Get journey by ID
     */
    fun getJourneyById(journeyId: String): Flow<Journey?> = flow {
        emit(journeyRepository.getJourneyById(journeyId))
    }

    /**
     * Load journey history
     */
    private fun loadJourneyHistory() {
        viewModelScope.launch {
            // In future, this will load from database
            // For now, repository manages state via StateFlow
        }
    }

    /**
     * Load statistics summary
     */
    private fun loadStatsSummary() {
        viewModelScope.launch {
            _statsSummary.value = journeyRepository.getJourneyStatsSummary(userId)
        }
    }

    /**
     * Clear error
     */
    fun clearError() {
        _error.value = null
    }

    /**
     * Reset to idle state
     */
    fun resetToIdle() {
        _uiState.value = JourneyUiState.Idle
    }
}

/**
 * UI State for Journey screens
 */
sealed class JourneyUiState {
    /** No active journey */
    object Idle : JourneyUiState()

    /** Journey is active or paused */
    data class Active(val journey: Journey) : JourneyUiState()

    /** Journey completed, showing summary */
    data class Completed(val journey: Journey) : JourneyUiState()

    /** Error occurred */
    data class Error(val message: String) : JourneyUiState()
}
