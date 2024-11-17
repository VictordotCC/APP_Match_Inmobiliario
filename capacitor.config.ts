import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  //appId: 'io.ionic.starter',
  appId: 'app-matchinmobiliario',
  appName: 'app.web.matchInmobiliario',
  //appName: 'app-MatchInmobiliario',
  webDir: 'www',
  plugins	: { //agregado para push notifications 16/11/2024 manu
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
