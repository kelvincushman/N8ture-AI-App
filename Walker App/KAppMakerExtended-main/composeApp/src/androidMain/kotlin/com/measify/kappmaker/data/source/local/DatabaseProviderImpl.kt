package com.measify.kappmaker.data.source.local

import android.content.Context
import androidx.room.Room
import androidx.room.RoomDatabase
import com.measify.kappmaker.util.Constants

class DatabaseProviderImpl(private val context: Context) : DatabaseProvider {
    override fun provideAppDatabaseBuilder(): RoomDatabase.Builder<AppDatabase> {
        val appContext = context.applicationContext
        val dbFile = appContext.getDatabasePath(Constants.LOCAL_DB_STORAGE_NAME)
        return Room.databaseBuilder<AppDatabase>(
            context = appContext,
            name = dbFile.absolutePath
        )
    }
}