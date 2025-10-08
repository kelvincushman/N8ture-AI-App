package com.measify.kappmaker.data.source.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.measify.kappmaker.data.source.local.entity.IdentificationHistoryEntity
import kotlinx.coroutines.flow.Flow

/**
 * DAO for identification history
 */
@Dao
interface IdentificationHistoryDao {

    @Query("SELECT * FROM identification_history ORDER BY timestamp DESC")
    fun getAllFlow(): Flow<List<IdentificationHistoryEntity>>

    @Query("SELECT * FROM identification_history ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecent(limit: Int = 10): List<IdentificationHistoryEntity>

    @Query("SELECT * FROM identification_history ORDER BY timestamp DESC LIMIT :limit")
    fun getRecentFlow(limit: Int = 10): Flow<List<IdentificationHistoryEntity>>

    @Query("SELECT * FROM identification_history WHERE id = :id")
    suspend fun getById(id: String): IdentificationHistoryEntity?

    @Query("SELECT * FROM identification_history WHERE id = :id")
    fun getByIdFlow(id: String): Flow<IdentificationHistoryEntity?>

    @Query("SELECT * FROM identification_history WHERE isFavorite = 1 ORDER BY timestamp DESC")
    suspend fun getFavorites(): List<IdentificationHistoryEntity>

    @Query("SELECT * FROM identification_history WHERE isFavorite = 1 ORDER BY timestamp DESC")
    fun getFavoritesFlow(): Flow<List<IdentificationHistoryEntity>>

    @Query("SELECT * FROM identification_history WHERE category = :category ORDER BY timestamp DESC")
    suspend fun getByCategory(category: String): List<IdentificationHistoryEntity>

    @Query("SELECT * FROM identification_history WHERE category = :category ORDER BY timestamp DESC")
    fun getByCategoryFlow(category: String): Flow<List<IdentificationHistoryEntity>>

    @Query("""
        SELECT * FROM identification_history
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        ORDER BY timestamp DESC
    """)
    suspend fun getWithLocation(): List<IdentificationHistoryEntity>

    @Query("""
        SELECT * FROM identification_history
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        ORDER BY timestamp DESC
    """)
    fun getWithLocationFlow(): Flow<List<IdentificationHistoryEntity>>

    @Query("""
        SELECT * FROM identification_history
        WHERE primaryMatchSpeciesId = :speciesId
        ORDER BY timestamp DESC
    """)
    suspend fun getBySpeciesId(speciesId: String): List<IdentificationHistoryEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(history: IdentificationHistoryEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(histories: List<IdentificationHistoryEntity>)

    @Update
    suspend fun update(history: IdentificationHistoryEntity)

    @Query("UPDATE identification_history SET isFavorite = :isFavorite WHERE id = :id")
    suspend fun updateFavoriteStatus(id: String, isFavorite: Boolean)

    @Query("UPDATE identification_history SET notes = :notes WHERE id = :id")
    suspend fun updateNotes(id: String, notes: String?)

    @Query("DELETE FROM identification_history WHERE id = :id")
    suspend fun delete(id: String)

    @Query("DELETE FROM identification_history WHERE timestamp < :timestamp")
    suspend fun deleteOldHistory(timestamp: String)

    @Query("DELETE FROM identification_history")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM identification_history")
    suspend fun getCount(): Int

    @Query("SELECT COUNT(*) FROM identification_history WHERE isFavorite = 1")
    suspend fun getFavoritesCount(): Int
}