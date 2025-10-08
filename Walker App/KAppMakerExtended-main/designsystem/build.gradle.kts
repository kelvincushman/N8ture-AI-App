@file:OptIn(ExperimentalKotlinGradlePluginApi::class, ExperimentalWasmDsl::class)

import org.jetbrains.kotlin.compose.compiler.gradle.ComposeFeatureFlag
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl


plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.multiplatform)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.compose)
    alias(libs.plugins.composeHotReload)
}

apply(from = rootProject.file("gradle/scripts/refactorPackage.gradle.kts"))

kotlin {
    applyDefaultHierarchyTemplate {
        common {
            group("mobile") {
                group("ios")
                withAndroidTarget()
            }

            group("nonMobile") {
                withJs()
                withWasmJs()
                withJvm()
            }
        }
    }

    androidTarget()

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    jvm()

    wasmJs()
    js {
        browser()
    }

    sourceSets {
        commonMain.dependencies {
            api(compose.runtime)
            api(compose.foundation)
            api(compose.animation)
            api(libs.compose.material.icons)
            api(compose.material3)
            api(compose.components.resources)
            api(compose.components.uiToolingPreview)
            api(libs.coil.compose)
            implementation(libs.kmpauth.uihelper)
        }
        androidMain.dependencies {
            implementation(libs.androidx.core.ktx)
        }
        jvmMain.dependencies {
            implementation(compose.desktop.currentOs)
        }
    }
}

android {
    namespace = "com.measify.kappmaker.designsystem"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlin {
        jvmToolchain(17)
    }
}

compose.resources {
    publicResClass = true
    nameOfResClass = "UiRes"
    packageOfResClass = "com.measify.kappmaker.designsystem.generated.resources"
}

dependencies {
    debugImplementation(compose.uiTooling)
}

// Hot reload support
composeCompiler {
    featureFlags.add(ComposeFeatureFlag.OptimizeNonSkippingGroups)
}
