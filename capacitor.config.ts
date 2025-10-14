import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dlenai.vitorformas',
  appName: 'Vitor Forms',
  webDir: 'dist',
  // Remove server config for production builds
  // server: {
  //   url: 'https://0bced821-3d69-4c5f-8977-3e8cb36cdc4c.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
