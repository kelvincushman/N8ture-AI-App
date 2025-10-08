package com.measify.kappmaker.presentation.screens.camera

import android.Manifest
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import java.io.ByteArrayOutputStream
import android.graphics.BitmapFactory
import android.graphics.Bitmap
import java.util.concurrent.Executors

@OptIn(ExperimentalPermissionsApi::class)
@Composable
actual fun CameraPreview(
    modifier: Modifier,
    onImageCaptured: (ByteArray) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val cameraPermissionState = rememberPermissionState(Manifest.permission.CAMERA)
    
    var imageCapture by remember { mutableStateOf<ImageCapture?>(null) }
    
    LaunchedEffect(Unit) {
        if (!cameraPermissionState.status.isGranted) {
            cameraPermissionState.launchPermissionRequest()
        }
    }
    
    if (cameraPermissionState.status.isGranted) {
        AndroidView(
            factory = { ctx ->
                val previewView = PreviewView(ctx)
                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                
                cameraProviderFuture.addListener({
                    val cameraProvider = cameraProviderFuture.get()
                    
                    val preview = Preview.Builder().build().also {
                        it.setSurfaceProvider(previewView.surfaceProvider)
                    }
                    
                    imageCapture = ImageCapture.Builder()
                        .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                        .build()
                    
                    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                    
                    try {
                        cameraProvider.unbindAll()
                        cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            cameraSelector,
                            preview,
                            imageCapture
                        )
                    } catch (exc: Exception) {
                        exc.printStackTrace()
                    }
                }, ContextCompat.getMainExecutor(ctx))
                
                previewView
            },
            modifier = modifier
        )
        
        DisposableEffect(imageCapture) {
            CameraState.imageCapture = imageCapture
            CameraState.onImageCaptured = onImageCaptured
            onDispose {
                CameraState.imageCapture = null
                CameraState.onImageCaptured = null
            }
        }
    }
}

@Composable
actual fun CaptureButton() {
    IconButton(
        onClick = {
            println("📸 [CameraButton] Capture button clicked!")
            CameraState.imageCapture?.let { capture ->
                println("📸 [CameraButton] ImageCapture available, taking picture...")
                val executor = Executors.newSingleThreadExecutor()
                capture.takePicture(
                    executor,
                    object : ImageCapture.OnImageCapturedCallback() {
                        override fun onCaptureSuccess(image: ImageProxy) {
                            println("📸 [CameraButton] Image captured successfully!")
                            val buffer = image.planes[0].buffer
                            val bytes = ByteArray(buffer.remaining())
                            buffer.get(bytes)

                            println("📸 [CameraButton] Raw image size: ${bytes.size} bytes")

                            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                            val outputStream = ByteArrayOutputStream()
                            bitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
                            val jpegBytes = outputStream.toByteArray()

                            println("📸 [CameraButton] Compressed JPEG size: ${jpegBytes.size} bytes")
                            println("📸 [CameraButton] Invoking onImageCaptured callback...")

                            CameraState.onImageCaptured?.invoke(jpegBytes)
                            image.close()
                        }

                        override fun onError(exception: ImageCaptureException) {
                            println("❌ [CameraButton] Capture error: ${exception.message}")
                            exception.printStackTrace()
                        }
                    }
                )
            } ?: run {
                println("❌ [CameraButton] ImageCapture not available!")
            }
        },
        modifier = Modifier.size(72.dp)
    ) {
        Icon(
            Icons.Default.Star,
            "Capture",
            modifier = Modifier.size(64.dp),
            tint = Color.White
        )
    }
}

private object CameraState {
    var imageCapture: ImageCapture? = null
    var onImageCaptured: ((ByteArray) -> Unit)? = null
}
