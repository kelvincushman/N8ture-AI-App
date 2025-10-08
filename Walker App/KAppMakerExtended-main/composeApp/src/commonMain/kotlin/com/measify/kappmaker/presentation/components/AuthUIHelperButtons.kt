package com.measify.kappmaker.presentation.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.measify.kappmaker.designsystem.components.AppleSignInButton
import com.measify.kappmaker.designsystem.components.GoogleSignInButton
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.btn_continue_with_apple
import com.measify.kappmaker.designsystem.generated.resources.btn_continue_with_google
import com.measify.kappmaker.designsystem.generated.resources.btn_sign_in_with_apple
import com.measify.kappmaker.designsystem.generated.resources.btn_sign_in_with_google
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.domain.model.AuthProvider
import com.measify.kappmaker.util.logging.AppLogger
import com.mmk.kmpauth.firebase.apple.AppleButtonUiContainer
import com.mmk.kmpauth.firebase.google.GoogleButtonUiContainerFirebase
import dev.gitlive.firebase.auth.FirebaseUser


@Composable
fun AuthUIHelperButtons(
    modifier: Modifier = Modifier,
    authProviders: List<AuthProvider> = AuthProvider.entries,
    shape: Shape = CircleShape,
    height: Dp = 56.dp,
    spaceBetweenButtons: Dp = AppTheme.spacing.groupedVerticalElementSpacing,
    autoClickEnabledIfOneProviderExists: Boolean = true,
    linkAccount: Boolean = false,
    onFirebaseResult: (Result<FirebaseUser?>) -> Unit,
) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(spaceBetweenButtons)) {
        val isExistOnlyOneAuthProvider by remember { mutableStateOf(authProviders.size == 1) }
        val updatedOnFirebaseResult by rememberUpdatedState(onFirebaseResult)
        if (authProviders.contains(AuthProvider.GOOGLE)) {
            //Google Sign-In Button and authentication with Firebase
            GoogleButtonUiContainerFirebase(linkAccount = linkAccount, onResult = {
                AppLogger.d("GoogleSignIn Result: $it")
                updatedOnFirebaseResult(it)
            }) {
                LaunchedEffect(Unit) { if (isExistOnlyOneAuthProvider && autoClickEnabledIfOneProviderExists) this@GoogleButtonUiContainerFirebase.onClick() }
                GoogleSignInButton(
                    height = height,
                    textRes = if (linkAccount) UiRes.string.btn_continue_with_google else UiRes.string.btn_sign_in_with_google,
                    shape = shape
                ) { this.onClick() }
            }
        }

        if (authProviders.contains(AuthProvider.APPLE)) {
            //Apple Sign-In Button and authentication with Firebase
            AppleButtonUiContainer(linkAccount = linkAccount, onResult = {
                AppLogger.d("AppleSignIn Result: $it")
                updatedOnFirebaseResult(it)
            }) {
                LaunchedEffect(Unit) { if (isExistOnlyOneAuthProvider && autoClickEnabledIfOneProviderExists) this@AppleButtonUiContainer.onClick() }
                AppleSignInButton(
                    height = height,
                    textRes = if (linkAccount) UiRes.string.btn_continue_with_apple else UiRes.string.btn_sign_in_with_apple,
                    shape = shape,
                ) { this.onClick() }
            }
        }
    }
}