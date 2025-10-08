package com.measify.kappmaker.root

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.measify.kappmaker.presentation.screens.home.HomeScreen
import com.measify.kappmaker.presentation.screens.home.HomeScreenRoute
import com.measify.kappmaker.presentation.screens.camera.CameraScreen
import com.measify.kappmaker.presentation.screens.camera.CameraScreenRoute
import com.measify.kappmaker.presentation.screens.results.ResultsScreen
import com.measify.kappmaker.presentation.screens.results.ResultsScreenRoute
import com.measify.kappmaker.presentation.screens.detail.SpeciesDetailScreen
import com.measify.kappmaker.presentation.screens.detail.SpeciesDetailScreenRoute
import com.measify.kappmaker.presentation.screens.history.HistoryScreen
import com.measify.kappmaker.presentation.screens.history.HistoryScreenRoute
import com.measify.kappmaker.presentation.viewmodel.MainViewModel
import com.measify.kappmaker.domain.model.TrialState
import org.koin.compose.koinInject

val LocalNavigator = compositionLocalOf<NavHostController> {
    error("No LocalNavController provided")
}

@Composable
fun AppNavigation(){
    val navController = rememberNavController()
    val viewModel: MainViewModel = koinInject()

    val trialState by viewModel.trialState.collectAsState()
    val recentIdentifications by viewModel.recentIdentifications.collectAsState()
    val currentIdentification by viewModel.currentIdentification.collectAsState()

    CompositionLocalProvider(LocalNavigator provides navController) {
        NavHost(
            navController = navController,
            startDestination = HomeScreenRoute()
        ) {
            composable<HomeScreenRoute> {
                HomeScreen(
                    trialState = trialState,
                    recentIdentifications = recentIdentifications,
                    onCameraClick = { navController.navigate(CameraScreenRoute()) },
                    onHistoryClick = { navController.navigate(HistoryScreenRoute()) },
                    onUpgradeClick = { /* TODO: Navigate to subscription */ },
                    onIdentificationClick = { id ->
                        viewModel.getIdentificationById(id)
                        navController.navigate(ResultsScreenRoute(id))
                    }
                )
            }

            composable<CameraScreenRoute> {
                val isLoading by viewModel.isLoading.collectAsState()
                val error by viewModel.error.collectAsState()

                CameraScreen(
                    onBack = { navController.popBackStack() },
                    onCapture = { imageData, category ->
                        viewModel.identifySpecies(imageData, category)
                    },
                    onGallerySelect = { /* TODO: Gallery picker */ },
                    isLoading = isLoading
                )

                // Navigate when identification completes
                LaunchedEffect(currentIdentification) {
                    currentIdentification?.let { result ->
                        navController.navigate(ResultsScreenRoute(result.id)) {
                            popUpTo(HomeScreenRoute()) { inclusive = false }
                        }
                    }
                }

                // Show error message
                error?.let { errorMessage ->
                    LaunchedEffect(errorMessage) {
                        // TODO: Show snackbar or dialog with error
                        println("Error: $errorMessage")
                    }
                }
            }

            composable<ResultsScreenRoute> { backStackEntry ->
                val route = backStackEntry.toRoute<ResultsScreenRoute>()
                currentIdentification?.let { result ->
                    ResultsScreen(
                        result = result,
                        onBack = { navController.popBackStack() },
                        onViewDetails = { speciesId ->
                            navController.navigate(SpeciesDetailScreenRoute(speciesId))
                        },
                        onSave = { viewModel.toggleFavorite(result.id, true) },
                        onShare = { /* TODO: Share functionality */ }
                    )
                }
            }

            composable<SpeciesDetailScreenRoute> { backStackEntry ->
                val route = backStackEntry.toRoute<SpeciesDetailScreenRoute>()
                var species by remember { mutableStateOf<com.measify.kappmaker.domain.model.Species?>(null) }

                LaunchedEffect(route.speciesId) {
                    viewModel.getSpeciesById(route.speciesId) { species = it }
                }

                species?.let { s ->
                    SpeciesDetailScreen(
                        species = s,
                        onBack = { navController.popBackStack() }
                    )
                }
            }

            composable<HistoryScreenRoute> {
                HistoryScreen(
                    history = recentIdentifications,
                    onBack = { navController.popBackStack() },
                    onItemClick = { id ->
                        viewModel.getIdentificationById(id)
                        navController.navigate(ResultsScreenRoute(id))
                    }
                )
            }
        }
    }
}