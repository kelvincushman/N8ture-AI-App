package com.measify.kappmaker.data.source.preferences


interface UserPreferences {

    companion object Keys {
        const val KEY_IS_ONBOARD_SHOWN = "KEY_IS_ONBOARD_SHOWN"
        const val KEY_FIRST_TIME_USER = "KEY_FIRST_TIME_USER"
    }

    suspend fun getString(key: String, defaultValue: String? = null): String?
    suspend fun getInt(key: String, defaultValue: Int? = null): Int?
    suspend fun getLong(key: String, defaultValue: Long? = null): Long?
    suspend fun getBoolean(key: String, defaultValue: Boolean = false): Boolean

    suspend fun putString(key: String, value: String)
    suspend fun putInt(key: String, value: Int)
    suspend fun putLong(key: String, value: Long)
    suspend fun putBoolean(key: String, value: Boolean)
    suspend fun remove(key: String)

    suspend fun clear()
}