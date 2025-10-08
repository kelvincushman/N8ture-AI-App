package com.measify.kappmaker.presentation.screens.history

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.IdentificationResult
import kotlinx.serialization.Serializable

@Serializable
data class HistoryScreenRoute(val dummy: String = "")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    history: List<IdentificationResult>,
    onBack: () -> Unit,
    onItemClick: (String) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("History") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { padding ->
        if (history.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.List, null, modifier = Modifier.size(64.dp))
                    Spacer(Modifier.height(16.dp))
                    Text("No history yet", style = MaterialTheme.typography.titleLarge)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(history) { result ->
                    Card(
                        onClick = { onItemClick(result.id) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(result.primaryMatch.species.commonName, fontWeight = FontWeight.SemiBold)
                                Text(result.primaryMatch.species.scientificName, style = MaterialTheme.typography.bodySmall)
                                Text(result.timestamp, style = MaterialTheme.typography.bodySmall)
                            }
                            Text("${(result.primaryMatch.confidenceScore * 100).toInt()}%", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
