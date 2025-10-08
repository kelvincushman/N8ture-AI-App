package com.measify.kappmaker.data.source.remote.apiservices

import com.measify.kappmaker.data.source.remote.request.ExampleRequest
import com.measify.kappmaker.data.source.remote.response.ExampleResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody

class ApiService(private val httpClient: HttpClient) {

    suspend fun getExampleData(): ExampleResponse {
        return httpClient.post("/example") {
            setBody(ExampleRequest())
        }.body()
    }
}