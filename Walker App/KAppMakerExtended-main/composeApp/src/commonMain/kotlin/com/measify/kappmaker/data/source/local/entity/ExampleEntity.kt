package com.measify.kappmaker.data.source.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey


@Entity(tableName = "example")
data class ExampleEntity(
    @PrimaryKey val id: Int = 0,
    @ColumnInfo("title") val title: String? = null,
)
