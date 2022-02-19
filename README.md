# SunShy
Mobile app to remind you to go outside.

Built using Expo and React Native.

## Setup
Note: These steps were done on a 64-bit Windows machine and run the app in an Android emulator. Different operating systems or using a physical iOS or Android device may require different steps.

Loosely based on the following guides:

- [Installing Expo](https://docs.expo.dev/get-started/installation/)
- [Creating an Android Virtual Device](https://developer.android.com/studio/run/managing-avds)
- [Starting an Android Virtual Device](https://stackoverflow.com/questions/67182016/why-react-native-couldnt-start-project-on-android-connection-with-expo)
- [Creating and Running an Expo app](https://docs.expo.dev/get-started/create-a-new-app/)

Expect installing NodeJS and Android Studio to take a few GBs of storage and the overall setup to take 2 hours.

1. Install and set up [Github Desktop](https://desktop.github.com/)
2. Clone this repository
3. Install and set up [NodeJS](https://nodejs.org/en/)
4. Install Expo: `npm install --global expo-cli` (Commands like this are assumed to be in Windows PowerShell)
5. `Set-ExecutionPolicy RemoteSigned` (Open Windows PowerShell as administrator; the next step will complain that "execution of scripts is disabled on this system" without this)
6. Install Yarn: `corepack enable`
7. Install and set up [Android Studio](https://developer.android.com/studio) for the included Android emulator
8. Android Studio Main Menu > More Actions > Virtual Device Manager
9. Device Manager > Create Device > (use default settings; a Pixel 2 API 30 was used during testing)
10. Click the down arrow beside the newly created Android Vritual Device, then click "Show on Disk"
11. Remember the name of the folder (the testing example would be `Pixel_2_API_30.avd`)
12. Navigate to `C:\Users\<your username>\AppData\Local\Android\Sdk\emulator`
13. `emulator -avd <folder name without .avd>` (the testing example would be `emulator -avd Pixel_2_API_30`)
14. While the Android Virtual Device is running, navigate to this repository
15. `expo start`
16. When prompted to "Press a │ open Android", press `a`

If you intend to use a physical device, all the Android Studio stuff can be skipped. Instead, download the Expo Go app on your Android or iOS device and scan the QR code that appears in step 15 above.
