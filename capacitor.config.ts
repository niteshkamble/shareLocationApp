import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sharelocation.android',
  appName: 'ShareLocarion',
  webDir: 'www',
  plugins:{
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "714343719403-eeksodnkhgghdub8arjgpl1ut3td1pai.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
