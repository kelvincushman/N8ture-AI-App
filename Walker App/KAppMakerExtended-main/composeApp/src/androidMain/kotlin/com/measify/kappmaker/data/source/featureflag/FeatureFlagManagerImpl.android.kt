package com.measify.kappmaker.data.source.featureflag

import com.google.firebase.remoteconfig.FirebaseRemoteConfig
import com.measify.kappmaker.util.logging.AppLogger

class FeatureFlagManagerImpl(private val remoteConfig: FirebaseRemoteConfig) : FeatureFlagManager {

    override fun syncsFlagsAsync() {
        remoteConfig.fetchAndActivate()
            .addOnSuccessListener {
                AppLogger.d("Feature Flag Sync is completed, result: $it")
            }
            .addOnFailureListener {
                AppLogger.e("Feature Flag Sync Failed, Error: ${it.message}")
            }
    }

    override fun getBoolean(key: String): Boolean {
        return remoteConfig.getBoolean(key)
    }

    override fun getString(key: String): String {
        return remoteConfig.getString(key)
    }

    override fun getLong(key: String): Long {
        return remoteConfig.getLong(key)
    }

    override fun getDouble(key: String): Double {
        return remoteConfig.getDouble(key)
    }
}