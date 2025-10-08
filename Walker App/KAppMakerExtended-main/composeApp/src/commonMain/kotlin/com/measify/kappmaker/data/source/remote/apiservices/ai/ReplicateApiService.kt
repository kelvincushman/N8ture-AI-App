package com.measify.kappmaker.data.source.remote.apiservices.ai

import com.measify.kappmaker.data.source.remote.request.ai.replicate.ReplicatePredictionRequest
import com.measify.kappmaker.data.source.remote.response.ai.AiApiBaseResponse
import com.measify.kappmaker.data.source.remote.response.ai.replicate.ReplicatePredictionResponse
import com.measify.kappmaker.util.Constants
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.utils.io.core.Input

/**
 * A service class for interacting with the Replicate API.
 * You can check different models on Replicate from [here](https://replicate.com/explore).
 *
 * You will need to have access to KAppMaker server side
 * Firebase code as well in order to use this (Check https://kappmaker.com/#pricing)
 *
 */
class ReplicateApiService(val httpClient: HttpClient) {


    /**
     * Creates a prediction request for a specific model using the Replicate API.
     *
     * This function sends a request to create a model prediction. If the model's documentation
     * mentions "models" in the URL, such as
     * `https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions`,
     * it means that the request is for a model prediction.
     *
     * Example usage:
     * ```
     *
     * data class FluxInput(val prompt:String, val output_format:String, val num_outputs:Int)
     *
     * val response = replicateApiService.createModelPrediction(
     *     ReplicatePredictionRequest(
     *         modelOwner = "black-forest-labs",
     *         modelName = "flux-1.1-pro",
     *         input = FluxInput(
     *             prompt = "Creative, abstract logo design for a startup company",
     *             output_format = "png",
     *             num_outputs = 1
     *         )
     *     )
     * )
     * ```
     *
     * @param modelOwner The owner of the model on Replicate (e.g., `"black-forest-labs"`).
     * @param modelName The name of the model (e.g., `"flux-1.1-pro""`).
     * @param requestBody The body of the request,
     * @return The response from the Replicate API as an [AiApiBaseResponse] containing [ReplicatePredictionResponse].
     */
    suspend inline fun <reified Input> createModelPrediction(
        modelOwner: String,
        modelName: String,
        requestBody: ReplicatePredictionRequest<Input>
    ): AiApiBaseResponse<ReplicatePredictionResponse<Input>> =
        httpClient.post("${Constants.CLOUD_FUNCTIONS_URL}/replicateCreateModelPrediction") {
            parameter("model_owner", modelOwner)
            parameter("model_name", modelName)
            setBody(requestBody)
        }.body()

    /**
     * Creates a prediction request for non-official models, using the Replicate API, that has version
     *
     * Example usage:
     * ```
     *
     * data class TextInput(val text:String)
     *
     * val response = replicateApiService.createPrediction(
     *     ReplicatePredictionRequest(
     *         version = "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",
     *         input = TextInput("KAppMaker")
     *     )
     * )
     * ```
     *
     * @param requestBody The body of the request, containing the model version and input parameters.
     * @return The response from the Replicate API as an [AiApiBaseResponse] containing [ReplicatePredictionResponse].
     */
    suspend inline fun <reified Input> createPrediction(requestBody: ReplicatePredictionRequest<Input>): AiApiBaseResponse<ReplicatePredictionResponse<Input>> =
        httpClient.post("${Constants.CLOUD_FUNCTIONS_URL}/replicateCreatePrediction") {
            setBody(requestBody)
        }.body()


    /**
     * Retrieves the status of an existing prediction using the Replicate API.
     *
     * @param id The unique identifier of the prediction.
     * @return The response from the Replicate API as an [AiApiBaseResponse] containing [ReplicatePredictionResponse].
     *
     * For input type you can just pass `Unit` if you are not interested in input
     * Example usage:
     * ```
     * val response = replicateApiService.getPredictionStatus<Unit>(
     *     id = "9egch6zt35rga0cm2bk813gz3c"
     * )
     * ```
     */
    suspend inline fun <reified Input> getPredictionStatus(id: String): AiApiBaseResponse<ReplicatePredictionResponse<Input>> =
        httpClient.get("${Constants.CLOUD_FUNCTIONS_URL}/replicateGetPredictionStatus") {
            parameter("id", id)
        }.body()


    /**
     * Cancels existing prediction
     *
     * @param id The unique identifier of the prediction.
     * @return The response from the Replicate API as an [AiApiBaseResponse] containing [ReplicatePredictionResponse].
     *
     * For input type you can just pass `Unit` if you are not interested in input
     * Example usage:
     * ```
     * val response = replicateApiService.getPredictionStatus<Unit>(
     *     id = "9egch6zt35rga0cm2bk813gz3c"
     * )
     * ```
     */
    suspend inline fun <reified Input> cancelPrediction(id: String): AiApiBaseResponse<ReplicatePredictionResponse<Input>> =
        httpClient.post("${Constants.CLOUD_FUNCTIONS_URL}/replicateCancelPrediction") {
            parameter("id", id)
        }.body()
}