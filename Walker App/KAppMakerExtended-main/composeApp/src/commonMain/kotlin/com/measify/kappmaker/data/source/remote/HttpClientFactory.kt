package com.measify.kappmaker.data.source.remote

import com.measify.kappmaker.util.logging.AppLogger
import dev.gitlive.firebase.Firebase
import dev.gitlive.firebase.auth.auth
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpSend
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.client.plugins.plugin
import io.ktor.client.request.header
import io.ktor.http.HttpHeaders
import io.ktor.http.URLProtocol
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json


object HttpClientFactory {
    fun default() = HttpClient {
        defaultRequest {
            url("BASE_URL")
            header(HttpHeaders.ContentType, "application/json")
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 60000  // Total request timeout: 60 seconds
            connectTimeoutMillis = 10000 // Connection establishment timeout: 10 seconds
            socketTimeoutMillis = 60000  // Inactivity timeout: 60 seconds
        }

        install(Logging) {
            logger = object : Logger {
                override fun log(message: String) {
                    AppLogger.d("NetworkRequest: $message")
                }
            }
            level = LogLevel.ALL
        }

        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                encodeDefaults = true
                explicitNulls = false
            })
        }
    }.also {
        it.plugin(HttpSend).intercept { request ->
            //For all requests you can send user token here, for example
            val userToken = Firebase.auth.currentUser?.getIdToken(true)
            request.header("Authorization", "Bearer $userToken")
            execute(request)
        }
    }


}

