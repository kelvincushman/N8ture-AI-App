package com.measify.kappmaker

import android.app.Application
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.measify.kappmaker.root.App
import com.measify.kappmaker.root.AppInitializer
import com.measify.kappmaker.util.logging.AppLogger
import com.mmk.kmpnotifier.extensions.onCreateOrOnNewIntent
import com.mmk.kmpnotifier.notification.NotifierManager
import com.mmk.kmpnotifier.permission.permissionUtil
import org.koin.android.ext.koin.androidContext


class AndroidApp : Application() {

    override fun onCreate() {
        super.onCreate()
        AppInitializer.initialize {
            androidContext(this@AndroidApp)
        }
    }
}

class AppActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { App() }
        val permissionUtil by permissionUtil()
        permissionUtil.askNotificationPermission {
            AppLogger.d("HasNotification Permission: $it")
        }
        NotifierManager.onCreateOrOnNewIntent(intent)

    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        NotifierManager.onCreateOrOnNewIntent(intent)
    }

}

@Preview
@Composable
fun AppPreview() {
    App()
}
        
        