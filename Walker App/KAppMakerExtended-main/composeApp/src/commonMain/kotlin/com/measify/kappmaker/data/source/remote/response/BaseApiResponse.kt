package com.measify.kappmaker.data.source.remote.response

import com.measify.kappmaker.data.source.remote.CustomHttpStatusCode
import com.measify.kappmaker.domain.exceptions.PurchaseRequiredException
import com.measify.kappmaker.domain.exceptions.UnAuthorizedException
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class BaseApiResponse<T>(
    @SerialName("statusCode") val statusCode: Int? = null,
    @SerialName("errorMessage") val errorMessage: String? = null,
    @SerialName("data") val data: T? = null
) {

    val isSuccessful: Boolean get() = statusCode in 200..299

    fun <A> handleAsResult(onSuccess: (T?) -> Result<A>): Result<A> {
        return when (statusCode) {
            in 200..299 -> {
                onSuccess(data)
            }

            401, 403 -> Result.failure(UnAuthorizedException())
            CustomHttpStatusCode.PURCHASE_REQUIRED -> Result.failure(PurchaseRequiredException())
            else -> Result.failure(Exception("Error: ${errorMessage ?: ""}"))
        }
    }

}