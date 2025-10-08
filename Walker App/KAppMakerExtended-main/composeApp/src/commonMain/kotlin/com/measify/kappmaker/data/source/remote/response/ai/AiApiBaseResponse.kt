package com.measify.kappmaker.data.source.remote.response.ai

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AiApiBaseResponse<T>(
    @SerialName("statusCode") val statusCode: Int? = null,
    @SerialName("errorMessage") val errorMessage: String? = null,
    @SerialName("data") val data: T? = null
)