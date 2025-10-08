package com.measify.kappmaker.util

interface AppUtil {
    fun getAppName():String
    fun shareApp()
    fun openFeedbackMail()
    fun getAppVersionInfo(): String
}