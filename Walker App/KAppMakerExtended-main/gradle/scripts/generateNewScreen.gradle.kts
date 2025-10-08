tasks.register("generateNewScreen") {

    // Default values for the task
    val defaultPackageName = "com.measify.kappmaker"
    var screenSuffix = "Screen"
    var uiStateSuffix = "UiState"
    var uiEventSuffix = "UiEvent"
    var viewModelSuffix = "UiStateHolder"


    doLast {
        // Input for the task: Screen name passed as a parameter
        // Extract the first argument (screen name) from the task names
        val screenBasePrefix = (project.findProperty("screenName") as String?)
            ?.let { it.replaceFirstChar { char -> char.uppercase() } }
            ?: throw IllegalArgumentException("Screen name must be provided using -PscreenName=ScreenName")

        // Class and package name formatting
        val screensPackageName = "$defaultPackageName.presentation.screens"
        val screenClassName = "$screenBasePrefix$screenSuffix"
        val uiStateClassName = "$screenBasePrefix$uiStateSuffix"
        val uiEventClassName = "$screenBasePrefix$uiEventSuffix"
        val viewModelClassName = "$screenBasePrefix$viewModelSuffix"
        val screenRouteClassName = "${screenBasePrefix}${screenSuffix}Route"

        // Lowercase screen name for folder path
        val lowerScreenName = screenBasePrefix.lowercase()
        val packgageDir = defaultPackageName.replace(".", "/")
        val screenDir =
            file("src/commonMain/kotlin/${packgageDir}/presentation/screens/$lowerScreenName")

        // Ensure directory exists

        if (!screenDir.exists()) {
            screenDir.mkdirs()
        }


        // Generate UiState.kt file
        val uiStateFile = file("$screenDir/${uiStateClassName}.kt")
        uiStateFile.writeText(
            """
            package $screensPackageName.$lowerScreenName

            class $uiStateClassName()

            sealed class $uiEventClassName {
                data object OnClick : $uiEventClassName()
            }
        """.trimIndent()
        )

        // Generate UiStateHolder.kt (ViewModel) file
        val viewModelFile = file("$screenDir/${viewModelClassName}.kt")
        viewModelFile.writeText(
            """
            package $screensPackageName.$lowerScreenName

            import $defaultPackageName.util.UiStateHolder
            import kotlinx.coroutines.flow.MutableStateFlow
            import kotlinx.coroutines.flow.StateFlow
            import kotlinx.coroutines.flow.asStateFlow

            class $viewModelClassName() : UiStateHolder() {
                private val _uiState = MutableStateFlow($uiStateClassName())
                val uiState: StateFlow<$uiStateClassName> = _uiState.asStateFlow()
            }
        """.trimIndent()
        )

        // Generate Screen.kt file
        val screenFile = file("$screenDir/${screenClassName}.kt")
        screenFile.writeText(
            """
            package $screensPackageName.$lowerScreenName

            import androidx.compose.foundation.layout.Box
            import androidx.compose.foundation.layout.fillMaxSize
            import androidx.compose.runtime.Composable
            import androidx.compose.runtime.getValue
            import androidx.compose.ui.Modifier
            import androidx.lifecycle.compose.collectAsStateWithLifecycle

            @Composable
            fun $screenClassName(
                modifier: Modifier = Modifier,
                uiStateHolder: $viewModelClassName,
            ) {
                val uiState by uiStateHolder.uiState.collectAsStateWithLifecycle()

                $screenClassName(
                    modifier = modifier.fillMaxSize(),
                    uiState = uiState,
                    onUiEvent = {}
                )
            }

            @Composable
            fun $screenClassName(
                modifier: Modifier = Modifier,
                uiState: $uiStateClassName,
                onUiEvent: ($uiEventClassName) -> Unit
            ) {
                Box(modifier = modifier) {
                    // UI components go here
                }
            }
        """.trimIndent()
        )

        // Generate ScreenRoute.kt file
        val screenRouteFile = file("$screenDir/${screenRouteClassName}.kt")
        screenRouteFile.writeText(
            """
            package $screensPackageName.$lowerScreenName

            import androidx.compose.runtime.Composable
            import $defaultPackageName.util.ScreenRoute
            import $defaultPackageName.util.uiStateHolder

            class $screenRouteClassName : ScreenRoute {

                @Composable
                override fun Content() {
                    val uiStateHolder = uiStateHolder<$viewModelClassName>()
                    $screenClassName(uiStateHolder = uiStateHolder)
                }
            }
        """.trimIndent()
        )

        println("Screen files for $screenClassName have been created in $screenDir")
    }
}
