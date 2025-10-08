package com.measify.kappmaker.presentation.screens.detail

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.Species
import com.measify.kappmaker.presentation.components.SafetyIndicator
import kotlinx.serialization.Serializable

@Serializable
data class SpeciesDetailScreenRoute(val speciesId: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpeciesDetailScreen(
    species: Species,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Species Details") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(species.commonName, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                        Text(species.scientificName, style = MaterialTheme.typography.titleMedium, fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                        Spacer(Modifier.height(8.dp))
                        Text("Family: ${species.family}", style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
            
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                            Text("Safety & Edibility", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                            SafetyIndicator(edibilityStatus = species.edibility)
                        }
                        Spacer(Modifier.height(8.dp))
                        species.edibilityDetails?.let { Text(it) }
                        species.safetyWarning?.let {
                            Spacer(Modifier.height(8.dp))
                            Text("⚠️ Warning: $it", color = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }
            
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Description", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Text(species.description)
                        species.detailedDescription?.let {
                            Spacer(Modifier.height(8.dp))
                            Text(it)
                        }
                    }
                }
            }
            
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Habitat", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Text(species.habitat)
                    }
                }
            }
            
            species.herbalBenefits?.let { benefits ->
                item {
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Herbal Benefits", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(8.dp))
                            Text(benefits)
                        }
                    }
                }
            }
        }
    }
}
