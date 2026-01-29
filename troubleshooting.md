# Android Build Troubleshooting Guide

This document outlines the issues encountered during the Android application build process and the steps taken to resolve them. It also provides recommendations for future maintenance to prevent similar problems.

## Problems Encountered & Solutions

### 1. `prefab` directory not found / "directory is not readable" error
- **Problem:** The initial build failed with an error indicating that a `prefab` directory within `node_modules/react-native-reanimated/android/build/intermediates/prefab_package/release/prefab` was not found or was unreadable. This suggested missing or corrupted native build artifacts.
- **Solution:** Performed a comprehensive cleanup of build caches and node modules:
    - Cleared global Gradle cache (`rm -rf ~/.gradle/caches`).
    - Cleaned npm cache (`npm cache clean --force`).
    - Removed `node_modules` and `package-lock.json` from `mobile/ConectameApp`.
    - Reinstalled npm dependencies (`npm install` in `mobile/ConectameApp`).
    - Removed the project-specific `.gradle` directory (`mobile/ConectameApp/android/.gradle`).

### 2. `CMake Error: add_subdirectory given source ... which is not an existing directory.`
- **Problem:** After the initial cleanup, `gradle clean` and subsequent `assembleRelease` commands failed with CMake errors, specifically complaining about missing `codegen/jni` directories for several React Native modules (e.g., `react-native-gesture-handler`, `react-native-image-picker`, `react-native-reanimated`, `react-native-vector-icons`, `react-native-worklets`). This indicated that the React Native codegen process was not generating these native code directories as expected by the build system.
- **Solution:** Explicitly deleted the `android/build` directories within each of the problematic native modules in `node_modules`. This forced the Gradle build process to re-generate these directories and their contents during the next full build.
    - `rm -rf mobile/ConectameApp/node_modules/<module-name>/android/build` for each module.

### 3. "Gradle build daemon disappeared unexpectedly" during `:app:createBundleReleaseJsAndAssets`
- **Problem:** The build crashed during the `createBundleReleaseJsAndAssets` task, which bundles the JavaScript code and assets. This often points to resource exhaustion (e.g., out of memory) during a memory-intensive task like JavaScript bundling.
- **Solution:** Increased the memory allocation for the Gradle Daemon.
    - Modified `mobile/ConectameApp/android/gradle.properties` by updating `org.gradle.jvmargs` from `-Xmx2048m -XX:MaxMetaspaceSize=512m` to `-Xmx4096m -XX:MaxMetaspaceSize=1024m`. This provided more heap and Metaspace memory for the Gradle daemon, preventing it from crashing.

## Future Recommendations

1.  **Regular Cache Cleanup:** Periodically run a full cleanup (similar to steps 1 and 2 of the solutions) to prevent accumulation of stale or corrupted build artifacts, especially after dependency updates or major code changes.
    - `rm -rf ~/.gradle/caches`
    - `npm cache clean --force` (or `yarn cache clean`)
    - `rm -rf mobile/ConectameApp/node_modules mobile/ConectameApp/package-lock.json mobile/ConectameApp/android/.gradle`
    - `npm install` (or `yarn install`)
    - `rm -rf mobile/ConectameApp/node_modules/*/android/build` (for common native modules)
    - `cd mobile/ConectameApp/android && ./gradlew clean`
2.  **Monitor Gradle Daemon Memory:** If "Gradle build daemon disappeared unexpectedly" errors reappear, consider further increasing the `org.gradle.jvmargs` in `gradle.properties` or investigating system-wide memory limits if running in a constrained environment.
3.  **Address Deprecation Warnings:** The build currently produces deprecation warnings (e.g., "Deprecated Gradle features were used...", "package=... found in source AndroidManifest.xml"). While not critical now, addressing these will ensure compatibility with future Gradle and Android versions (e.g., Gradle 10) and maintainability of the project. Keep dependencies and React Native updated.
4.  **Keep Dependencies Updated:** Regularly update React Native, its ecosystem libraries, and other dependencies to benefit from bug fixes, performance improvements, and compatibility with newer Android versions and build tools. Always check release notes for breaking changes.
5.  **Consider `npx react-native doctor`:** Use `npx react-native doctor` occasionally to diagnose potential environment issues, though it may not always pinpoint native build configuration problems.
