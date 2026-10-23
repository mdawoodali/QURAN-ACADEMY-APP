// Capacitor Configuration without strict external dependency on @capacitor/cli during web typecheck
interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    url?: string;
    cleartext?: boolean;
    androidScheme?: string;
    [key: string]: unknown;
  };
  plugins?: Record<string, unknown>;
  android?: Record<string, unknown>;
  ios?: Record<string, unknown>;
  [key: string]: unknown;
}

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
