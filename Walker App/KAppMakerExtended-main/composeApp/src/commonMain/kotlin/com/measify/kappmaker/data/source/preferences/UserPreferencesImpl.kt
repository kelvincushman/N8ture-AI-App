package com.measify.kappmaker.data.source.preferences

import com.russhwolf.settings.Settings

internal class UserPreferencesImpl(private val multiplatformSettings: Settings) : UserPreferences {

    override suspend fun getString(key: String, defaultValue: String?): String? {
        val value = multiplatformSettings.getStringOrNull(key)
        return value ?: defaultValue
    }

    override suspend fun getInt(key: String, defaultValue: Int?): Int? {
        val value = multiplatformSettings.getIntOrNull(key)
        return value ?: defaultValue
    }

    override suspend fun getLong(key: String, defaultValue: Long?): Long? {
        val value = multiplatformSettings.getLongOrNull(key)
        return value ?: defaultValue
    }

    override suspend fun getBoolean(key: String, defaultValue: Boolean): Boolean {
        return multiplatformSettings.getBoolean(key, defaultValue)

    }

    override suspend fun putString(key: String, value: String) {
        multiplatformSettings.putString(key, value)
    }

    override suspend fun putInt(key: String, value: Int) {
        multiplatformSettings.putInt(key, value)
    }

    override suspend fun putLong(key: String, value: Long) {
        multiplatformSettings.putLong(key, value)
    }

    override suspend fun putBoolean(key: String, value: Boolean) {
        multiplatformSettings.putBoolean(key, value)
    }

    override suspend fun remove(key: String) {
        multiplatformSettings.remove(key)
    }

    override suspend fun clear() {
        multiplatformSettings.clear()
    }
}