package com.measify.kappmaker.data.source.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Query
import androidx.room.Upsert
import com.measify.kappmaker.data.source.local.entity.ExampleEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ExampleDao {
    @Query("SELECT * FROM example WHERE id = :id")
    suspend fun getById(id: Int): ExampleEntity?

    @Query("SELECT * FROM example WHERE id = :id")
    fun getByIdFlow(id: Int): Flow<ExampleEntity?>

    @Query("SELECT * FROM example")
    fun getAllFlow(): Flow<List<ExampleEntity>>

    @Query("SELECT * FROM example")
    suspend fun getAll(): List<ExampleEntity>

    //Insert or update if exists
    @Upsert
    suspend fun upsert(exampleEntity: ExampleEntity)

    @Query("DELETE FROM example WHERE id = :id")
    suspend fun deleteById(id: Int)

    @Delete
    suspend fun delete(exampleEntity: ExampleEntity)

    @Query("DELETE FROM example")
    suspend fun deleteAll()
}