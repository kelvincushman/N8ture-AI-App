package com.measify.kappmaker.data.source.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.measify.kappmaker.data.source.local.entity.SpeciesEntity
import kotlinx.coroutines.flow.Flow

/**
 * DAO for species data (offline cache)
 */
@Dao
interface SpeciesDao {

    @Query("SELECT * FROM species WHERE id = :speciesId")
    suspend fun getSpeciesById(speciesId: String): SpeciesEntity?

    @Query("SELECT * FROM species WHERE id = :speciesId")
    fun getSpeciesByIdFlow(speciesId: String): Flow<SpeciesEntity?>

    @Query("SELECT * FROM species WHERE category = :category ORDER BY commonName ASC")
    suspend fun getSpeciesByCategory(category: String): List<SpeciesEntity>

    @Query("SELECT * FROM species WHERE category = :category ORDER BY commonName ASC")
    fun getSpeciesByCategoryFlow(category: String): Flow<List<SpeciesEntity>>

    @Query("""
        SELECT * FROM species
        WHERE commonName LIKE '%' || :query || '%'
        OR scientificName LIKE '%' || :query || '%'
        OR family LIKE '%' || :query || '%'
        ORDER BY commonName ASC
        LIMIT :limit
    """)
    suspend fun searchSpecies(query: String, limit: Int = 20): List<SpeciesEntity>

    @Query("SELECT * FROM species ORDER BY cachedAt DESC LIMIT :limit")
    suspend fun getRecentlyCached(limit: Int = 50): List<SpeciesEntity>

    @Query("SELECT * FROM species ORDER BY cachedAt DESC LIMIT :limit")
    fun getRecentlyCachedFlow(limit: Int = 50): Flow<List<SpeciesEntity>>

    @Query("SELECT * FROM species WHERE isPremiumContent = 0")
    suspend fun getFreeSpecies(): List<SpeciesEntity>

    @Query("SELECT * FROM species WHERE id IN (:speciesIds)")
    suspend fun getSpeciesByIds(speciesIds: List<String>): List<SpeciesEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSpecies(species: SpeciesEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSpecies(species: List<SpeciesEntity>)

    @Update
    suspend fun updateSpecies(species: SpeciesEntity)

    @Query("DELETE FROM species WHERE id = :speciesId")
    suspend fun deleteSpecies(speciesId: String)

    @Query("DELETE FROM species WHERE cachedAt < :timestamp")
    suspend fun deleteOldCache(timestamp: Long)

    @Query("DELETE FROM species")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM species")
    suspend fun getCount(): Int
}