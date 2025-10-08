package com.measify.kappmaker.data.repository

import com.measify.kappmaker.data.BackgroundExecutor
import com.measify.kappmaker.data.source.preferences.UserPreferences
import com.measify.kappmaker.data.source.preferences.UserPreferences.Keys.KEY_FIRST_TIME_USER
import com.measify.kappmaker.domain.exceptions.UnAuthorizedException
import com.measify.kappmaker.domain.model.User
import com.measify.kappmaker.util.ApplicationScope
import com.measify.kappmaker.util.logging.AppLogger
import dev.gitlive.firebase.Firebase
import dev.gitlive.firebase.auth.FirebaseUser
import dev.gitlive.firebase.auth.auth
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.shareIn
import kotlinx.coroutines.launch
import kotlinx.datetime.Clock

class UserRepository(
    private val subscriptionRepository: SubscriptionRepository,
    private val userPreferences: UserPreferences,
    private val backgroundExecutor: BackgroundExecutor = BackgroundExecutor.IO,
    private val applicationScope: ApplicationScope
) {

    init {
        signInAnonymouslyIfNecessary()
    }

    private val authTrigger = MutableStateFlow(Clock.System.now().toEpochMilliseconds())

    val currentUser: SharedFlow<Result<User>> =
        combine(authTrigger, Firebase.auth.authStateChanged) { _, currentUser -> currentUser }
            .map { currentUser ->
                AppLogger.d("CUrrent user is updated")
                if (currentUser == null) {
                    Result.failure(UnAuthorizedException())
                } else {
                    subscriptionRepository.login(userId = currentUser.uid)
                    val user = currentUser.asUser()
                        .copy(hasPremiumAccess = subscriptionRepository.hasPremiumAccess())
                    Result.success(user)
                }

            }.shareIn(applicationScope, SharingStarted.Eagerly, 1)

    fun signInAnonymouslyIfNecessary() = applicationScope.launch {
        backgroundExecutor.execute {
            val isFirstTimeUser = userPreferences.getBoolean(KEY_FIRST_TIME_USER, true)
            if (Firebase.auth.currentUser == null && isFirstTimeUser) {
                Firebase.auth.signInAnonymously()
                userPreferences.putBoolean(KEY_FIRST_TIME_USER, false)
                AppLogger.d("Signed in anonymously")
            }
            Result.success(Unit)
        }.onFailure {
            AppLogger.e("signInAnonymouslyIfNecessary exception ${it.message}")
        }
    }

    //This is added because when linking anonymous account with google account, firebase listener is not triggered
    fun onSuccessfulOauthSign() {
        applicationScope.launch { authTrigger.emit(Clock.System.now().toEpochMilliseconds()) }
    }

    suspend fun logOut() = backgroundExecutor.execute {
        subscriptionRepository.logOut()
        Firebase.auth.signOut()
        Result.success(Unit)
    }

    suspend fun deleteAccount() = backgroundExecutor.execute {
        val currentUser = Firebase.auth.currentUser
        //Here you can send delete request to the server if needed

        currentUser?.delete()
        logOut()
        Result.success(Unit)
    }

    private fun FirebaseUser.asUser(): User {

        val emailFromProviders =
            providerData.firstOrNull { it.email.isNullOrEmpty().not() && it.email != "null" }?.email
        val displayNameFromProviders = providerData.firstOrNull {
            it.displayName.isNullOrEmpty().not() && it.displayName != "null"
        }?.displayName
        val pictureFromProviders = providerData.firstOrNull {
            it.photoURL.isNullOrEmpty().not() && it.photoURL != "null"
        }?.photoURL

        return User(
            id = uid,
            isAnonymous = isAnonymous,
            email = emailFromProviders ?: email,
            displayName = displayNameFromProviders ?: displayName,
            photoUrl = pictureFromProviders ?: photoURL
        )
    }


}



