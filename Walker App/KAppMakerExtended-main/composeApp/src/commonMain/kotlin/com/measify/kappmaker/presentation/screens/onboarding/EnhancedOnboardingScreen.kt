package com.measify.kappmaker.presentation.screens.onboarding

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.domain.model.*
import kotlinx.serialization.Serializable

@Serializable
data class EnhancedOnboardingRoute(val dummy: String = "")

/**
 * Enhanced onboarding flow with 7 screens
 * Collects user preferences for personalized experience
 */
@Composable
fun EnhancedOnboardingScreen(
    onComplete: (UserPreferences) -> Unit,
    onSkip: () -> Unit = {}
) {
    var currentStep by remember { mutableStateOf(0) }
    var selectedInterests by remember { mutableStateOf(setOf<UserInterest>()) }
    var selectedExperience by remember { mutableStateOf<ExperienceLevel?>(null) }
    var selectedEnvironments by remember { mutableStateOf(setOf<Environment>()) }

    val totalSteps = 7

    Box(modifier = Modifier.fillMaxSize()) {
        // Background gradient
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.primaryContainer,
                            MaterialTheme.colorScheme.surface
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            // Progress indicator
            OnboardingProgressBar(
                current = currentStep,
                total = totalSteps,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Content area with animation
            AnimatedContent(
                targetState = currentStep,
                transitionSpec = {
                    slideInHorizontally { it } + fadeIn() with
                            slideOutHorizontally { -it } + fadeOut()
                },
                modifier = Modifier.weight(1f)
            ) { step ->
                when (step) {
                    0 -> WelcomeScreen()
                    1 -> InterestSelectionScreen(
                        selected = selectedInterests,
                        onSelectionChange = { selectedInterests = it }
                    )
                    2 -> ExperienceLevelScreen(
                        selected = selectedExperience,
                        onSelect = { selectedExperience = it }
                    )
                    3 -> EnvironmentSelectionScreen(
                        selected = selectedEnvironments,
                        onSelectionChange = { selectedEnvironments = it }
                    )
                    4 -> JourneyTrackingIntroScreen()
                    5 -> PermissionsExplanationScreen()
                    6 -> TrialIntroductionScreen()
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Navigation buttons
            OnboardingNavigation(
                currentStep = currentStep,
                totalSteps = totalSteps,
                canProgress = canProgress(
                    currentStep,
                    selectedInterests,
                    selectedExperience,
                    selectedEnvironments
                ),
                onNext = {
                    if (currentStep < totalSteps - 1) {
                        currentStep++
                    } else {
                        // Complete onboarding
                        onComplete(
                            UserPreferences(
                                interests = selectedInterests.toList(),
                                experienceLevel = selectedExperience ?: ExperienceLevel.BEGINNER,
                                favoriteEnvironments = selectedEnvironments.toList(),
                                hasCompletedOnboarding = true
                            )
                        )
                    }
                },
                onBack = { if (currentStep > 0) currentStep-- },
                onSkip = onSkip
            )
        }
    }
}

private fun canProgress(
    step: Int,
    interests: Set<UserInterest>,
    experience: ExperienceLevel?,
    environments: Set<Environment>
): Boolean {
    return when (step) {
        0 -> true // Welcome screen
        1 -> interests.isNotEmpty() // Must select at least one interest
        2 -> experience != null // Must select experience level
        3 -> environments.isNotEmpty() // Must select at least one environment
        else -> true // Other screens don't require selection
    }
}

// ============================================================================
// Screen 1: Welcome
// ============================================================================

@Composable
fun WelcomeScreen() {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // App icon/logo placeholder
        Surface(
            modifier = Modifier.size(120.dp),
            shape = CircleShape,
            color = MaterialTheme.colorScheme.primary
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text(
                    text = "🌿",
                    style = MaterialTheme.typography.displayLarge
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = "Welcome to N8ture AI",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Your AI Companion for Every Outdoor Journey",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(48.dp))

        // Feature highlights
        FeatureHighlight(
            icon = Icons.Default.PhotoCamera,
            title = "Identify Species",
            description = "Take photos to identify plants, animals, and fungi instantly"
        )

        Spacer(modifier = Modifier.height(16.dp))

        FeatureHighlight(
            icon = Icons.Default.GraphicEq,
            title = "Record Wildlife Sounds",
            description = "Capture and identify bird songs and animal calls"
        )

        Spacer(modifier = Modifier.height(16.dp))

        FeatureHighlight(
            icon = Icons.Default.Map,
            title = "Track Your Journeys",
            description = "Map your walks and build a digital nature journal"
        )
    }
}

@Composable
fun FeatureHighlight(
    icon: ImageVector,
    title: String,
    description: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            modifier = Modifier.size(48.dp),
            shape = CircleShape,
            color = MaterialTheme.colorScheme.primaryContainer
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// ============================================================================
// Screen 2: Interest Selection
// ============================================================================

@Composable
fun InterestSelectionScreen(
    selected: Set<UserInterest>,
    onSelectionChange: (Set<UserInterest>) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        Text(
            text = "What Brings You Here?",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Select all that apply. This helps us personalize your experience.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(UserInterest.values().toList()) { interest ->
                InterestCard(
                    interest = interest,
                    isSelected = interest in selected,
                    onToggle = {
                        onSelectionChange(
                            if (interest in selected) {
                                selected - interest
                            } else {
                                selected + interest
                            }
                        )
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InterestCard(
    interest: UserInterest,
    isSelected: Boolean,
    onToggle: () -> Unit
) {
    Card(
        onClick = onToggle,
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            }
        ),
        border = if (isSelected) {
            BorderStroke(2.dp, MaterialTheme.colorScheme.primary)
        } else null
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = interest.icon,
                style = MaterialTheme.typography.displaySmall
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = interest.displayName,
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
            )
        }
    }
}

// ============================================================================
// Screen 3: Experience Level
// ============================================================================

@Composable
fun ExperienceLevelScreen(
    selected: ExperienceLevel?,
    onSelect: (ExperienceLevel) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        Text(
            text = "Your Experience Level",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "This helps us adjust the level of detail in species information.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        ExperienceLevel.values().forEach { level ->
            ExperienceLevelCard(
                level = level,
                isSelected = level == selected,
                onClick = { onSelect(level) }
            )
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExperienceLevelCard(
    level: ExperienceLevel,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            }
        ),
        border = if (isSelected) {
            BorderStroke(2.dp, MaterialTheme.colorScheme.primary)
        } else null
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = level.icon,
                style = MaterialTheme.typography.displaySmall
            )

            Spacer(modifier = Modifier.width(20.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = level.displayName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                )
                Text(
                    text = level.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Selected",
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

// ============================================================================
// Screen 4: Environment Selection
// ============================================================================

@Composable
fun EnvironmentSelectionScreen(
    selected: Set<Environment>,
    onSelectionChange: (Set<Environment>) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        Text(
            text = "Your Favorite Environments",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Where do you spend most of your outdoor time? Select all that apply.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(Environment.values().toList()) { env ->
                EnvironmentCard(
                    environment = env,
                    isSelected = env in selected,
                    onToggle = {
                        onSelectionChange(
                            if (env in selected) {
                                selected - env
                            } else {
                                selected + env
                            }
                        )
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnvironmentCard(
    environment: Environment,
    isSelected: Boolean,
    onToggle: () -> Unit
) {
    Card(
        onClick = onToggle,
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            }
        ),
        border = if (isSelected) {
            BorderStroke(2.dp, MaterialTheme.colorScheme.primary)
        } else null
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = environment.icon,
                style = MaterialTheme.typography.displaySmall
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = environment.displayName,
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
            )
        }
    }
}

// ============================================================================
// Screen 5: Journey Tracking Introduction
// ============================================================================

@Composable
fun JourneyTrackingIntroScreen() {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Track Your Nature Journeys",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Turn every walk into an adventure with our journey tracking features",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(48.dp))

        // Feature demonstrations
        JourneyFeatureDemo(
            icon = Icons.Default.Map,
            title = "Track Your Route",
            description = "See your path on a map with distance and duration"
        )

        Spacer(modifier = Modifier.height(24.dp))

        JourneyFeatureDemo(
            icon = Icons.Default.PhotoCamera,
            title = "Capture Species",
            description = "Take photos and record sounds along your journey"
        )

        Spacer(modifier = Modifier.height(24.dp))

        JourneyFeatureDemo(
            icon = Icons.Default.GraphicEq,
            title = "Record Wildlife Sounds",
            description = "Identify birds and animals by their calls"
        )

        Spacer(modifier = Modifier.height(24.dp))

        JourneyFeatureDemo(
            icon = Icons.Default.Book,
            title = "Build Your Journal",
            description = "Create a timeline of all your discoveries"
        )
    }
}

@Composable
fun JourneyFeatureDemo(
    icon: ImageVector,
    title: String,
    description: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(20.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            modifier = Modifier.size(56.dp),
            shape = CircleShape,
            color = MaterialTheme.colorScheme.primaryContainer
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(28.dp)
                )
            }
        }

        Spacer(modifier = Modifier.width(20.dp))

        Column {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// Continue in next file...
