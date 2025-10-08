import androidx.compose.ui.window.singleWindowApplication
import com.measify.kappmaker.designsystem.AllComponentsGallery

//Note: First time run can take a while because of downloading Jetbrains JDK
fun main() {
    singleWindowApplication(title = "All Components Gallery", alwaysOnTop = true) {
        AllComponentsGallery()
    }
}