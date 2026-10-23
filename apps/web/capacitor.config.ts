import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.quranlearnacademy.app",
  appName: "Quran Learn Academy",
  webDir: "public",
  server: {
    // In production, the native shell routes to the high-availability live deployment
    url: process.env.NEXT_PUBLIC_APP_URL || "https://quranacademyapp.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: "#021811",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#021811",
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: "always",
    preferredContentMode: "mobile",
  },
};

export default config;
