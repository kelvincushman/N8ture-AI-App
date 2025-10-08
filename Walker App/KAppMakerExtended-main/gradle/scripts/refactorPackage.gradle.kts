/**
 * NOTE: Create a copy of project for backup before running this command
 *
 * Before running the task set gradle caching false as below,
 * after refactoring is finished then you can set it true again
 *
 * org.gradle.configuration-cache=false
 *
 */

tasks.register("refactorPackage") {

    val newApplicationBundleId =
        "com.measify.kappmaker" // <-- Change this with new application/bundle ID
    val newApplicationName =
        "KAppMakerAllModules"      //  <-- Change this with new application name


    val oldApplicationBundleId =
        "com.measify.kappmaker" // <-- Default application/bundle id and package name
    val oldApplicationName = "KAppMakerAllModules"       // <-- Default Application Name


    // Convert package names to directory paths
    val oldPackageDir = oldApplicationBundleId.replace(".", "/")
    val newPackageDir = newApplicationBundleId.replace(".", "/")

    // Directories to be processed
    val directories = listOf(
        "src/commonMain/kotlin",
        "src/commonTest/kotlin",
        "src/androidMain/kotlin",
        "src/iosMain/kotlin",
        "src/jvmMain/kotlin",
        "src/nonMobileMain/kotlin"
    )

    // File extensions to search within
    val fileExtensions = listOf("kt", "kts", "gradle", "xml", "json")

    // Helper function to update file content
    fun updateFileContent(file: File, fileType: String) {
        if (file.exists()) {
            val content = file.readText()
            val updatedContent = content.replace(oldApplicationBundleId, newApplicationBundleId)

            if (content != updatedContent) {
                file.writeText(updatedContent)
                println("Updated $fileType: ${file.absolutePath}")
            }
        } else {
            println("$fileType not found at: ${file.absolutePath}")
        }
    }


    //Update package names inside files
    fun updatePackageNamesInFiles() {
        directories.forEach { dir ->
            val rootDir = project.layout.projectDirectory.dir(dir).asFile
            if (rootDir.exists()) {
                rootDir.walkTopDown().forEach { file ->
                    if (file.isFile && fileExtensions.any { file.extension == it }) {
                        val content = file.readText()
                        val updatedContent =
                            content.replace(oldApplicationBundleId, newApplicationBundleId)

                        if (content != updatedContent) {
                            // Overwrite the file with the updated package name
                            file.writeText(updatedContent)
                            println("Updated package in file: ${file.absolutePath}")
                        }
                    }
                }
            }
        }
    }

    // Move directories to match the new package structure
    fun movePackageDirectories() {
        directories.forEach { dir ->
            val sourceDir = project.layout.projectDirectory.dir(dir).asFile
            if (sourceDir.exists()) {
                // Build the old and new package paths
                val oldPackagePath = File(sourceDir, oldPackageDir)
                val newPackagePath = File(sourceDir, newPackageDir)

                if (oldPackagePath.exists()) {
                    if (newPackagePath.exists()) {
                        println("Target directory already exists: ${newPackagePath.absolutePath}. Skipping move.")
                    } else {
                        // Move the old package directory to the new one
                        oldPackagePath.copyRecursively(newPackagePath, overwrite = true)
                        oldPackagePath.deleteRecursively()
                        println("Moved directory from: ${oldPackagePath.absolutePath} to ${newPackagePath.absolutePath}")
                    }
                } else {
                    println("Old package directory not found: ${oldPackagePath.absolutePath}")
                }
            }
        }
    }

    fun updateGradleFiles() {
        val gradleFiles = listOf(
            "composeApp/build.gradle.kts",
            "designsystem/build.gradle.kts",
            "gradle/scripts/generateNewScreen.gradle.kts"
        ) // Add more paths as needed

        gradleFiles.forEach { filePath ->
            val gradleFile = project.rootDir.resolve(filePath)
            updateFileContent(gradleFile, "Gradle File")
        }
    }

    fun updateFirbaseGoogleService() {
        val googleServicesFileAndroid =
            project.layout.projectDirectory.file("google-services.json").asFile
        val googleServicesFileIos =
            project.rootDir.resolve("iosApp/iosApp/GoogleService-Info.plist")

        updateFileContent(googleServicesFileAndroid, "google-services.json")
        updateFileContent(googleServicesFileIos, "GoogleService-Info.plist")
    }

    // Function to update iOS-specific files (Info.plist, project.pbxproj)
    fun updateIOSFiles() {
        val infoPlistFile = project.rootDir.resolve("iosApp/iosApp/Info.plist")
        val pbxprojFile = project.rootDir.resolve("iosApp/iosApp.xcodeproj/project.pbxproj")

        updateFileContent(infoPlistFile, "Info.plist")
        updateFileContent(pbxprojFile, "project.pbxproj")
    }

    fun updateGithubActionWorkflow() {
        val publishAndroidWorkflow =
            project.rootDir.resolve(".github/workflows/publish_android_playstore.yml")
        updateFileContent(publishAndroidWorkflow, "publish_android_playstore.yml")

        val publishIosWorkflow =
            project.rootDir.resolve(".github/workflows/publish_ios_appstore.yml")
        updateFileContent(publishIosWorkflow, "publish_ios_appstore.yml")
    }


    // Function to clean up old package directories after moving
    fun cleanUpOldDirectories() {
        directories.forEach { dir ->
            val sourceDir = project.layout.projectDirectory.dir(dir).asFile
            if (sourceDir.exists()) {
                val oldParentDir = oldPackageDir.substringBeforeLast("/")
                val newParentDir = newPackageDir.substringBeforeLast("/")

                if (oldParentDir != newParentDir) {
                    val oldPackagePath = File(sourceDir, oldParentDir)
                    if (oldPackagePath.exists()) oldPackagePath.deleteRecursively()
                }
            }
        }
    }

    fun updateApplicationName() {
        val files = listOf(
            "composeApp/src/androidMain/AndroidManifest.xml",
            "settings.gradle.kts",
            "iosApp/iosApp.xcodeproj/project.pbxproj",
            ".github/workflows/publish_ios_appstore.yml"
        ) // Add more paths as needed
        files.forEach { filePath ->
            val file = project.rootDir.resolve(filePath)
            if (file.exists()) {
                val content = file.readText()
                val updatedContent = content.replace(oldApplicationName, newApplicationName)

                if (content != updatedContent) {
                    file.writeText(updatedContent)
                    println("Updated Application Name: ${file.absolutePath}")
                }
            } else {
                println("ApplicationName not found at: ${file.absolutePath}")
            }
        }
    }

    // Action to perform when the task is executed
    doLast {
        println("Starting package refactor from $oldApplicationBundleId to $newApplicationBundleId")

        updatePackageNamesInFiles()
        movePackageDirectories()
        updateGradleFiles()
        updateFirbaseGoogleService()
        updateIOSFiles()
        updateGithubActionWorkflow()
        cleanUpOldDirectories()
        updateApplicationName()

        println("Package refactoring completed.")
    }


}
