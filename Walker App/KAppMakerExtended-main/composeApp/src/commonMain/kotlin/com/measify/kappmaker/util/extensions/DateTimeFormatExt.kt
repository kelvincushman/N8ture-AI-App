package com.measify.kappmaker.util.extensions

import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

fun Long.asFormattedDate(
    timeZone: TimeZone = TimeZone.currentSystemDefault(),
    format: String = "dd.MM.yyyy"
): String {
    val dateTime = Instant.fromEpochMilliseconds(this).toLocalDateTime(timeZone)

    return format.replace("dd", dateTime.dayOfMonth.toString().padStart(2, '0'))
        .replace("MM", dateTime.monthNumber.toString().padStart(2, '0'))
        .replace("yyyy", dateTime.year.toString())
}