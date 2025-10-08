package com.measify.kappmaker.data

import com.measify.kappmaker.util.logging.AppLogger
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.withContext
import kotlin.coroutines.CoroutineContext
import kotlin.coroutines.cancellation.CancellationException

class BackgroundExecutor(val scope: CoroutineContext = Dispatchers.IO) {

    companion object {
        val IO by lazy { BackgroundExecutor(Dispatchers.IO) }
    }

    suspend fun <T> execute(
        func: suspend () -> Result<T>
    ): Result<T> = withContext(scope) {
        try {
            func.invoke()
        } catch (e: Exception) {
            if (e is CancellationException) {
                throw e
            } else {
                AppLogger.e("Error while executing background task: ${e.message}")
                Result.failure(e)
            }
        }
    }
}