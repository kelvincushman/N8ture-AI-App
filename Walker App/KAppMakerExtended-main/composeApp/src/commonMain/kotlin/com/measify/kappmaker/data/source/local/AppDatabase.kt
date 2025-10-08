package com.measify.kappmaker.data.source.local

import androidx.room.ConstructedBy
import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.RoomDatabaseConstructor
import com.measify.kappmaker.data.source.local.dao.ExampleDao
import com.measify.kappmaker.data.source.local.entity.ExampleEntity

@Database(
    entities = [
        ExampleEntity::class,
        com.measify.kappmaker.data.source.local.entity.SpeciesEntity::class,
        com.measify.kappmaker.data.source.local.entity.IdentificationHistoryEntity::class
    ],
    version = 2,
    exportSchema = true
)
@ConstructedBy(AppDatabaseConstructor::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun exampleDao(): ExampleDao
    abstract fun speciesDao(): com.measify.kappmaker.data.source.local.dao.SpeciesDao
    abstract fun identificationHistoryDao(): com.measify.kappmaker.data.source.local.dao.IdentificationHistoryDao
}





interface DatabaseProvider {
    fun provideAppDatabaseBuilder(): RoomDatabase.Builder<AppDatabase>
}

// The Room compiler generates the `actual` implementations.
@Suppress("NO_ACTUAL_FOR_EXPECT")
expect object AppDatabaseConstructor : RoomDatabaseConstructor<AppDatabase> {
    override fun initialize(): AppDatabase
}