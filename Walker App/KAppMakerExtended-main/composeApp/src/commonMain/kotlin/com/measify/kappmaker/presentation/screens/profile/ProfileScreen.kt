package com.measify.kappmaker.presentation.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.AsyncImage
import coil3.compose.LocalPlatformContext
import coil3.request.ImageRequest
import coil3.request.crossfade
import com.measify.kappmaker.domain.model.User
import com.measify.kappmaker.designsystem.generated.resources.UiRes
import com.measify.kappmaker.designsystem.generated.resources.btn_delete_account
import com.measify.kappmaker.designsystem.generated.resources.ic_delete
import com.measify.kappmaker.designsystem.generated.resources.ic_profile_img_placeholder
import com.measify.kappmaker.designsystem.components.LoadingProgress
import com.measify.kappmaker.designsystem.components.LoadingProgressMode
import com.measify.kappmaker.designsystem.components.SettingItemListContainer
import com.measify.kappmaker.designsystem.components.SettingsItemUiState
import com.measify.kappmaker.designsystem.components.UserInput
import com.measify.kappmaker.designsystem.components.modals.AppDialog
import com.measify.kappmaker.designsystem.components.modals.DeleteUserConfirmation
import com.measify.kappmaker.designsystem.components.modals.DialogType
import com.measify.kappmaker.designsystem.theme.AppTheme
import org.jetbrains.compose.resources.painterResource

@Composable
fun ProfileScreen(
    modifier: Modifier = Modifier,
    uiStateHolder: ProfileUiStateHolder,
    onSignInRequired: () -> Unit
) {
    val uiState by uiStateHolder.uiState.collectAsStateWithLifecycle()

    if (uiState.signInActionRequired) {
        LaunchedEffect(uiState) {
            onSignInRequired()
        }
    }
    if (uiState.deleteUserDialogShown) {
        DeleteUserConfirmation(
            onConfirm = uiStateHolder::onConfirmDeleteAccount,
            onDismiss = uiStateHolder::onDismissDeleteUserConfirmationDialog
        )
    }
    AppDialog(
        type = DialogType.ERROR,
        text = uiState.errorMessage,
        onConfirm = { uiStateHolder.onErrorMessageShown() }
    )
    if (uiState.isLoading) {
        LoadingProgress(mode = LoadingProgressMode.FULLSCREEN)
    } else {
        val currentUser = uiState.user
        currentUser?.let {
            ProfileScreen(
                modifier = modifier,
                currentUser = it,
                onUiEvent = uiStateHolder::onUiEvent
            )
        }
    }
}

@Composable
fun ProfileScreen(
    modifier: Modifier = Modifier,
    currentUser: User,
    onUiEvent: (ProfileScreenUiEvent) -> Unit
) {

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AppTheme.colors.background)
            .padding(horizontal = AppTheme.spacing.outerSpacing)
            .verticalScroll(rememberScrollState())
            .padding(top = AppTheme.spacing.defaultSpacing, bottom = AppTheme.spacing.outerSpacing),
        verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.sectionSpacing),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        // Profile Picture
        AsyncImage(
            model = ImageRequest.Builder(LocalPlatformContext.current)
                .data(currentUser.photoUrl)
                .crossfade(true)
                .build(),
            placeholder = painterResource(UiRes.drawable.ic_profile_img_placeholder),
            error = painterResource(UiRes.drawable.ic_profile_img_placeholder),
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier.size(100.dp).clip(CircleShape),
        )

        // Full Name
        UserInputWithLabel(label = "Display Name"){
            UserInput(
                value = currentUser.displayName ?: "",
                readOnly = true,
                onValueChange = {}
            )
        }

        // Email
        UserInputWithLabel(label = "Email"){
            UserInput(
                value = currentUser.email ?: "",
                readOnly = true,
                onValueChange = {}
            )
        }

        SettingItemListContainer(
            onClick = { onUiEvent(ProfileScreenUiEvent.OnClickDeleteAccount) },
            itemTextStyle = AppTheme.typography.h5.copy(fontWeight = FontWeight.SemiBold),
            itemList = listOf(
                SettingsItemUiState(
                    textRes = UiRes.string.btn_delete_account,
                    startIcon = UiRes.drawable.ic_delete,
                    showEndIcon = false,
                    textIconColor = AppTheme.colors.status.error
                )
            )
        )
    }


}

@Composable
fun UserInputWithLabel(
    label: String,
    modifier: Modifier = Modifier.fillMaxWidth(),
    userInput: @Composable () -> Unit
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(AppTheme.spacing.defaultSpacing)
    ) {
        Text(
            text = label,
            style = AppTheme.typography.bodyExtraLarge,
            fontWeight = FontWeight.SemiBold,
            color = AppTheme.colors.text.primary
        )
        userInput()
    }
}




