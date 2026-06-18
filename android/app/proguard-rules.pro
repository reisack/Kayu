# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Detox's releaseAndroidTest APK loads kotlin-reflect in the app process.
# Keep Kotlin Result's synthetic ABI methods in the release app so reflection
# code compiled in the test APK can still call them after app shrinking.
-keepclassmembers class kotlin.Result {
    <methods>;
}

# Required for minified Detox releaseAndroidTest builds when androidx.test.core
# references the optional AndroidX futures adapter.
-dontwarn androidx.concurrent.futures.SuspendToFutureAdapter
