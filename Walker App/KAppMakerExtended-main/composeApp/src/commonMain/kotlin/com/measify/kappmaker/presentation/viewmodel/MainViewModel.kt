package com.measify.kappmaker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.measify.kappmaker.data.repository.IdentificationRepository
import com.measify.kappmaker.data.source.local.TrialManager
import com.measify.kappmaker.domain.model.IdentificationResult
import com.measify.kappmaker.domain.model.Species
import com.measify.kappmaker.domain.model.SpeciesCategory
import com.measify.kappmaker.domain.model.TrialState
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class MainViewModel(
    private val repository: IdentificationRepository,
    private val trialManager: TrialManager
) : ViewModel() {
    
    private val _trialState = MutableStateFlow(TrialState(3))
    val trialState: StateFlow<TrialState> = _trialState.asStateFlow()
    
    private val _recentIdentifications = MutableStateFlow<List<IdentificationResult>>(emptyList())
    val recentIdentifications: StateFlow<List<IdentificationResult>> = _recentIdentifications.asStateFlow()
    
    private val _currentIdentification = MutableStateFlow<IdentificationResult?>(null)
    val currentIdentification: StateFlow<IdentificationResult?> = _currentIdentification.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        loadTrialState()
        loadRecentIdentifications()
    }
    
    private fun loadTrialState() {
        viewModelScope.launch {
            _trialState.value = trialManager.getTrialState()
        }
    }
    
    private fun loadRecentIdentifications() {
        viewModelScope.launch {
            repository.getHistory(10).collect { history ->
                _recentIdentifications.value = history
            }
        }
    }
    
    fun identifySpecies(imageData: ByteArray, category: SpeciesCategory?) {
        viewModelScope.launch {
            println("🎯 [MainViewModel] identifySpecies called - Image size: ${imageData.size} bytes, Category: $category")
            _isLoading.value = true
            _error.value = null

            println("🎯 [MainViewModel] Calling repository.identifySpecies...")
            repository.identifySpecies(
                imageData = imageData,
                category = category,
                isSubscribed = false
            ).onSuccess { result ->
                println("✅ [MainViewModel] Identification SUCCESS: ${result.primaryMatch.species.commonName}")
                _currentIdentification.value = result
                loadTrialState()
                _isLoading.value = false
            }.onFailure { e ->
                println("❌ [MainViewModel] Identification FAILED: ${e.message}")
                e.printStackTrace()
                _error.value = e.message ?: "Identification failed"
                _isLoading.value = false
            }
        }
    }
    
    fun getIdentificationById(id: String) {
        viewModelScope.launch {
            val result = repository.getIdentificationById(id)
            _currentIdentification.value = result
        }
    }
    
    fun getSpeciesById(id: String, onResult: (Species?) -> Unit) {
        viewModelScope.launch {
            val species = repository.getSpeciesById(id)
            onResult(species)
        }
    }
    
    fun toggleFavorite(id: String, isFavorite: Boolean) {
        viewModelScope.launch {
            repository.toggleFavorite(id, isFavorite)
        }
    }
}
