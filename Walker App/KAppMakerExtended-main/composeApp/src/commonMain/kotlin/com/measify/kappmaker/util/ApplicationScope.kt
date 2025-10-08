package com.measify.kappmaker.util

import com.measify.kappmaker.util.logging.AppLogger
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.SupervisorJob
import kotlin.coroutines.CoroutineContext

class ApplicationScope : CoroutineScope {

    private val coroutineExceptionHandler = CoroutineExceptionHandler { _, throwable ->
        AppLogger.e("Unknown exception in application scope", throwable)
    }

    override val coroutineContext: CoroutineContext
        get() = CoroutineScope(SupervisorJob() + Dispatchers.IO + coroutineExceptionHandler).coroutineContext
}