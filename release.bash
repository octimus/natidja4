#!/bin/bash
rm natidja-unsigned.apk
rm natidja.apk
ionic cordova build android --prod --release
cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk natidja-unsigned.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore natidja-release-key.keystore natidja-unsigned.apk natidja

~/Library/Android/sdk/build-tools/29.0.2/zipalign -v 4 natidja-unsigned.apk natidja.apk
~/Library/Android/sdk/platform-tools/adb install natidja.apk