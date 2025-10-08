package com.measify.kappmaker.util.logging

import com.measify.kappmaker.util.AppUtil
import com.measify.kappmaker.util.ApplicationScope
import com.measify.kappmaker.util.isAndroid
import io.ktor.client.HttpClient
import io.ktor.client.request.forms.FormDataContent
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.Parameters
import io.ktor.http.contentType
import kotlinx.coroutines.launch
import kotlinx.datetime.Clock
import kotlin.coroutines.cancellation.CancellationException

class TelegramLogger(
    private val httpClient: HttpClient,
    private val appUtil: AppUtil,
    private val applicationScope: ApplicationScope
) : Logger {

    private companion object {
        /**
         * To get your Telegram Bot Token:
         * 1. Open Telegram app and search for the user "@BotFather".
         * 2. Start a chat and send the command /newbot.
         * 3. Follow the instructions to name your bot and get a unique bot username.
         * 4. BotFather will provide you with the Bot Token (a long string) after creation.
         *
         * To get your Telegram Chat ID:
         * 1. Add your bot to a Telegram group or chat where you want to receive messages.
         * 2. Alternatively, start a direct chat with your bot.
         * 3. To find the chat ID, send a message to the bot or group.
         * 4. Use the Telegram API or a tool like https://api.telegram.org/bot<YourBotToken>/getUpdates
         *    to fetch updates and find the "chat":{"id": ... } value corresponding to your chat.
         *
         * Insert your Bot Token and Chat ID below to enable sending messages.
         */
        const val TELEGRAM_BOT_TOKEN = ""
        const val TELEGRAM_CHAT_ID = ""
    }

    override fun initialize(isDebug: Boolean) {}

    override fun e(message: String, throwable: Throwable?, tag: String?) {
        prepareLogAndSendToTelegram("❌ Level: ERROR", message, throwable)
    }

    override fun d(message: String, throwable: Throwable?, tag: String?) {
        //No need to send debug logs to telegram
    }

    override fun i(message: String, throwable: Throwable?, tag: String?) {
        prepareLogAndSendToTelegram("ℹ️ Level: INFO", message, throwable)
    }

    private fun prepareLogAndSendToTelegram(
        level: String,
        message: String,
        throwable: Throwable?
    ) = applicationScope.launch {
        try {
            if (message.isEmpty() || TELEGRAM_BOT_TOKEN.isEmpty() || TELEGRAM_CHAT_ID.isEmpty()) return@launch
            val platform = if (isAndroid) "Android" else "iOS"

            val fullMessage = buildString {
                appendLine("📱 App: ${appUtil.getAppName()}")
                appendLine(level)
                appendLine("🕒 Time: ${getCurrentFormattedTime()}")
                appendLine()
                appendLine("🤖 Platform and App Version: $platform, ${appUtil.getAppVersionInfo()}")
                appendLine()
                appendLine(message)
                throwable?.let {
                    appendLine()
                    appendLine()
                    appendLine("⚠️ Exception: ${it.stackTraceToString()}")
                }
            }

            sendMessageToTelegram(fullMessage)

        } catch (e: Exception) {
            if (e is CancellationException) throw e
            //Do nothing on exception
        }
    }

    private fun getCurrentFormattedTime(): String {
        val now = Clock.System.now().toString()
        return now
    }

    private suspend fun sendMessageToTelegram(text: String) {
        val url = "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage"
        val formParameters = Parameters.build {
            append("chat_id", TELEGRAM_CHAT_ID)
            append("text", text)
        }
        httpClient.post(url) {
            contentType(ContentType.Application.FormUrlEncoded)
            setBody(FormDataContent(formParameters))
        }
    }
}