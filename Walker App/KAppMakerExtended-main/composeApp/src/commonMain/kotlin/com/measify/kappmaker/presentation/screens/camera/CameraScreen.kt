package com.measify.kappmaker.presentation.screens.camera

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.SpeciesCategory
import kotlinx.serialization.Serializable

@Serializable
data class CameraScreenRoute(val dummy: String = "")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CameraScreen(
    onBack: () -> Unit,
    onCapture: (ByteArray, SpeciesCategory?) -> Unit,
    onGallerySelect: () -> Unit,
    isLoading: Boolean = false
) {
    var selectedCategory by remember { mutableStateOf<SpeciesCategory?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Identify Species") },
                navigationIcon = {
                    IconButton(onClick = onBack, enabled = !isLoading) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Camera preview will be rendered here via expect/actual
            CameraPreview(
                modifier = Modifier.fillMaxSize(),
                onImageCaptured = { imageData ->
                    onCapture(imageData, selectedCategory)
                }
            )

            // Loading overlay
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    Card {
                        Column(
                            modifier = Modifier.padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            CircularProgressIndicator()
                            Text("Identifying species...", style = MaterialTheme.typography.titleMedium)
                        }
                    }
                }
            }
            
            // Category selector overlay
            Column(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(16.dp)
            ) {
                CategorySelector(
                    selectedCategory = selectedCategory,
                    onCategorySelected = { selectedCategory = it }
                )
            }
            
            // Bottom controls
            if (!isLoading) {
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                        .padding(32.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onGallerySelect,
                        modifier = Modifier.size(56.dp)
                    ) {
                        Icon(
                            Icons.Default.AccountBox,
                            "Gallery",
                            modifier = Modifier.size(32.dp)
                        )
                    }

                    // Capture button - handled by platform-specific code
                    CaptureButton()

                    IconButton(
                        onClick = { /* Toggle flash */ },
                        modifier = Modifier.size(56.dp)
                    ) {
                        Icon(
                            Icons.Default.Build,
                            "Flash",
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CategorySelector(
    selectedCategory: SpeciesCategory?,
    onCategorySelected: (SpeciesCategory?) -> Unit
) {
    Card {
        Row(
            modifier = Modifier.padding(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedCategory == null,
                onClick = { onCategorySelected(null) },
                label = { Text("All") }
            )
            FilterChip(
                selected = selectedCategory == SpeciesCategory.PLANT,
                onClick = { onCategorySelected(SpeciesCategory.PLANT) },
                label = { Text("🌿 Plants") }
            )
            FilterChip(
                selected = selectedCategory == SpeciesCategory.BIRD,
                onClick = { onCategorySelected(SpeciesCategory.BIRD) },
                label = { Text("🦋 Wildlife") }
            )
            FilterChip(
                selected = selectedCategory == SpeciesCategory.FUNGI,
                onClick = { onCategorySelected(SpeciesCategory.FUNGI) },
                label = { Text("🍄 Fungi") }
            )
        }
    }
}

// Platform-specific implementations
@Composable
expect fun CameraPreview(
    modifier: Modifier,
    onImageCaptured: (ByteArray) -> Unit
)

@Composable
expect fun CaptureButton()
