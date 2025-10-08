package com.measify.kappmaker.util

import org.koin.core.module.Module

internal expect val platformModule: Module
internal expect fun onApplicationStartPlatformSpecific()
internal expect val isAndroid: Boolean
internal expect val isDebug: Boolean

