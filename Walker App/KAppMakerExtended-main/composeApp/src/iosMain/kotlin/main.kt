import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.window.ComposeUIViewController
import com.measify.kappmaker.root.App
import com.measify.kappmaker.util.LocalNativeViewFactory
import com.measify.kappmaker.util.NativeViewFactory
import com.measify.kappmaker.util.SwiftLibDependencyFactory
import com.measify.kappmaker.util.swiftLibDependenciesModule
import org.koin.core.KoinApplication
import platform.UIKit.UIViewController

fun MainViewController(nativeViewFactory: NativeViewFactory): UIViewController =
    ComposeUIViewController {
        CompositionLocalProvider(LocalNativeViewFactory provides nativeViewFactory) {
            App()
        }
    }

//This is called on application started on Swift side
fun KoinApplication.provideSwiftLibDependencyFactory(factory: SwiftLibDependencyFactory) =
    run { modules(swiftLibDependenciesModule(factory)) }