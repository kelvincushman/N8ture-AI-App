package com.measify.kappmaker.data.source.local.dao

import androidx.room.*
import com.measify.kappmaker.data.source.local.entity.JourneyEntity
import com.measify.kappmaker.data.source.local.entity.DiscoveryEntity
import com.measify.kappmaker.data.source.local.entity.JourneyWaypointEntity
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for Journey operations
 */
@Dao
interface JourneyDao {
    /**
     * Insert new journey
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertJourney(journey: JourneyEntity)

    /**
     * Update existing journey
     */
    @Update
    suspend fun updateJourney(journey: JourneyEntity)

    /**
     * Delete journey
     */
    @Delete
    suspend fun deleteJourney(journey: JourneyEntity)

    /**
     * Delete journey by ID
     */
    @Query("DELETE FROM journeys WHERE id = :journeyId")
    suspend fun deleteJourneyById(journeyId: String)

    /**
     * Get journey by ID
     */
    @Query("SELECT * FROM journeys WHERE id = :journeyId")
    suspend fun getJourneyById(journeyId: String): JourneyEntity?

    /**
     * Get active journey for user
     */
    @Query("SELECT * FROM journeys WHERE userId = :userId AND status = 'ACTIVE' LIMIT 1")
    suspend fun getActiveJourney(userId: String): JourneyEntity?

    /**
     * Get paused journey for user
     */
    @Query("SELECT * FROM journeys WHERE userId = :userId AND status = 'PAUSED' LIMIT 1")
    suspend fun getPausedJourney(userId: String): JourneyEntity?

    /**
     * Get all journeys for user
     */
    @Query("SELECT * FROM journeys WHERE userId = :userId ORDER BY startTime DESC")
    suspend fun getJourneysForUser(userId: String): List<JourneyEntity>

    /**
     * Get all journeys for user (Flow)
     */
    @Query("SELECT * FROM journeys WHERE userId = :userId ORDER BY startTime DESC")
    fun observeJourneysForUser(userId: String): Flow<List<JourneyEntity>>

    /**
     * Get completed journeys for user with pagination
     */
    @Query("""
        SELECT * FROM journeys
        WHERE userId = :userId AND status = 'COMPLETED'
        ORDER BY startTime DESC
        LIMIT :limit OFFSET :offset
    """)
    suspend fun getCompletedJourneys(
        userId: String,
        limit: Int,
        offset: Int
    ): List<JourneyEntity>

    /**
     * Get journeys by date range
     */
    @Query("""
        SELECT * FROM journeys
        WHERE userId = :userId
        AND startTime >= :startTime
        AND startTime <= :endTime
        ORDER BY startTime DESC
    """)
    suspend fun getJourneysByDateRange(
        userId: String,
        startTime: Long,
        endTime: Long
    ): List<JourneyEntity>

    /**
     * Get total number of journeys for user
     */
    @Query("SELECT COUNT(*) FROM journeys WHERE userId = :userId AND status = 'COMPLETED'")
    suspend fun getJourneyCount(userId: String): Int

    /**
     * Get total distance traveled by user
     */
    @Query("SELECT SUM(distanceMeters) FROM journeys WHERE userId = :userId AND status = 'COMPLETED'")
    suspend fun getTotalDistance(userId: String): Double?

    /**
     * Get total duration for user
     */
    @Query("SELECT SUM(durationMillis) FROM journeys WHERE userId = :userId AND status = 'COMPLETED'")
    suspend fun getTotalDuration(userId: String): Long?

    /**
     * Get total discoveries for user
     */
    @Query("SELECT SUM(discoveryCount) FROM journeys WHERE userId = :userId AND status = 'COMPLETED'")
    suspend fun getTotalDiscoveries(userId: String): Int?

    /**
     * Get longest journey for user
     */
    @Query("""
        SELECT * FROM journeys
        WHERE userId = :userId AND status = 'COMPLETED'
        ORDER BY distanceMeters DESC
        LIMIT 1
    """)
    suspend fun getLongestJourney(userId: String): JourneyEntity?

    /**
     * Search journeys by title
     */
    @Query("""
        SELECT * FROM journeys
        WHERE userId = :userId AND title LIKE '%' || :query || '%'
        ORDER BY startTime DESC
    """)
    suspend fun searchJourneys(userId: String, query: String): List<JourneyEntity>

    /**
     * Get public journeys (for sharing/community features)
     */
    @Query("SELECT * FROM journeys WHERE isPublic = 1 ORDER BY startTime DESC LIMIT :limit")
    suspend fun getPublicJourneys(limit: Int): List<JourneyEntity>
}

/**
 * Data Access Object for Discovery operations
 */
@Dao
interface DiscoveryDao {
    /**
     * Insert new discovery
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDiscovery(discovery: DiscoveryEntity)

    /**
     * Update existing discovery
     */
    @Update
    suspend fun updateDiscovery(discovery: DiscoveryEntity)

    /**
     * Delete discovery
     */
    @Delete
    suspend fun deleteDiscovery(discovery: DiscoveryEntity)

    /**
     * Delete discovery by ID
     */
    @Query("DELETE FROM discoveries WHERE id = :discoveryId")
    suspend fun deleteDiscoveryById(discoveryId: String)

    /**
     * Get discovery by ID
     */
    @Query("SELECT * FROM discoveries WHERE id = :discoveryId")
    suspend fun getDiscoveryById(discoveryId: String): DiscoveryEntity?

    /**
     * Get all discoveries for a journey
     */
    @Query("SELECT * FROM discoveries WHERE journeyId = :journeyId ORDER BY timestamp ASC")
    suspend fun getDiscoveriesForJourney(journeyId: String): List<DiscoveryEntity>

    /**
     * Get all discoveries for a journey (Flow)
     */
    @Query("SELECT * FROM discoveries WHERE journeyId = :journeyId ORDER BY timestamp ASC")
    fun observeDiscoveriesForJourney(journeyId: String): Flow<List<DiscoveryEntity>>

    /**
     * Get all discoveries (not linked to journey)
     */
    @Query("SELECT * FROM discoveries WHERE journeyId IS NULL ORDER BY timestamp DESC")
    suspend fun getStandaloneDiscoveries(): List<DiscoveryEntity>

    /**
     * Get favorite discoveries
     */
    @Query("SELECT * FROM discoveries WHERE isFavorite = 1 ORDER BY timestamp DESC")
    suspend fun getFavoriteDiscoveries(): List<DiscoveryEntity>

    /**
     * Get favorite discoveries (Flow)
     */
    @Query("SELECT * FROM discoveries WHERE isFavorite = 1 ORDER BY timestamp DESC")
    fun observeFavoriteDiscoveries(): Flow<List<DiscoveryEntity>>

    /**
     * Get discoveries by type
     */
    @Query("SELECT * FROM discoveries WHERE type = :type ORDER BY timestamp DESC")
    suspend fun getDiscoveriesByType(type: String): List<DiscoveryEntity>

    /**
     * Get recent discoveries with limit
     */
    @Query("SELECT * FROM discoveries ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecentDiscoveries(limit: Int): List<DiscoveryEntity>

    /**
     * Get discoveries within date range
     */
    @Query("""
        SELECT * FROM discoveries
        WHERE timestamp >= :startTime AND timestamp <= :endTime
        ORDER BY timestamp DESC
    """)
    suspend fun getDiscoveriesByDateRange(
        startTime: Long,
        endTime: Long
    ): List<DiscoveryEntity>

    /**
     * Search discoveries by notes or tags
     */
    @Query("""
        SELECT * FROM discoveries
        WHERE userNotes LIKE '%' || :query || '%' OR tags LIKE '%' || :query || '%'
        ORDER BY timestamp DESC
    """)
    suspend fun searchDiscoveries(query: String): List<DiscoveryEntity>

    /**
     * Delete all discoveries for a journey
     */
    @Query("DELETE FROM discoveries WHERE journeyId = :journeyId")
    suspend fun deleteDiscoveriesForJourney(journeyId: String)

    /**
     * Get total discovery count
     */
    @Query("SELECT COUNT(*) FROM discoveries")
    suspend fun getTotalDiscoveryCount(): Int

    /**
     * Get discovery count by type
     */
    @Query("SELECT COUNT(*) FROM discoveries WHERE type = :type")
    suspend fun getDiscoveryCountByType(type: String): Int
}

/**
 * Data Access Object for Journey Waypoint operations
 */
@Dao
interface JourneyWaypointDao {
    /**
     * Insert new waypoint
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWaypoint(waypoint: JourneyWaypointEntity)

    /**
     * Update existing waypoint
     */
    @Update
    suspend fun updateWaypoint(waypoint: JourneyWaypointEntity)

    /**
     * Delete waypoint
     */
    @Delete
    suspend fun deleteWaypoint(waypoint: JourneyWaypointEntity)

    /**
     * Delete waypoint by ID
     */
    @Query("DELETE FROM journey_waypoints WHERE id = :waypointId")
    suspend fun deleteWaypointById(waypointId: String)

    /**
     * Get waypoint by ID
     */
    @Query("SELECT * FROM journey_waypoints WHERE id = :waypointId")
    suspend fun getWaypointById(waypointId: String): JourneyWaypointEntity?

    /**
     * Get all waypoints for a journey
     */
    @Query("SELECT * FROM journey_waypoints WHERE journeyId = :journeyId ORDER BY timestamp ASC")
    suspend fun getWaypointsForJourney(journeyId: String): List<JourneyWaypointEntity>

    /**
     * Get all waypoints for a journey (Flow)
     */
    @Query("SELECT * FROM journey_waypoints WHERE journeyId = :journeyId ORDER BY timestamp ASC")
    fun observeWaypointsForJourney(journeyId: String): Flow<List<JourneyWaypointEntity>>

    /**
     * Delete all waypoints for a journey
     */
    @Query("DELETE FROM journey_waypoints WHERE journeyId = :journeyId")
    suspend fun deleteWaypointsForJourney(journeyId: String)
}
