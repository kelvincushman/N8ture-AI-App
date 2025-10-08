package com.measify.kappmaker.util.logging

import io.github.aakira.napier.DebugAntilog
import io.github.aakira.napier.Napier

class NapierLogger : Logger {

    override fun initialize(isDebug: Boolean) {
        if (isDebug) Napier.base(DebugAntilog())
    }

    override fun e(message: String, throwable: Throwable?, tag: String?) {
        Napier.e(message, throwable, tag)
    }

    override fun d(message: String, throwable: Throwable?, tag: String?) {
        Napier.d(message, throwable, tag)
    }

    override fun i(message: String, throwable: Throwable?, tag: String?) {
        Napier.i(message, throwable, tag)
    }
}
