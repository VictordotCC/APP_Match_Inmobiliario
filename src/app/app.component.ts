import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GlobalDataService } from './servicios/global-data.service';
import { Capacitor } from '@capacitor/core';
import { NotificationsPushService } from './servicios/notifications-push.service';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import {chevronDownCircle,
  chevronForwardCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe} from 'ionicons/icons';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  posWatch: string | null = null;
  positionEmmitter: EventEmitter<void> = new EventEmitter();
  clearWatchEmitter: EventEmitter<void> = new EventEmitter();
  watchEmitter: EventEmitter<void> = new EventEmitter();

  constructor(private platform: Platform, private datosGlobales: GlobalDataService,
              private notificationsPushService: NotificationsPushService)
              { this.init();
                addIcons({ chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe });
               }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.requestLocationPermission();
      this.watchLocation();
    this.datosGlobales.ubicacion$.subscribe(() => this.getLocation());
    this.datosGlobales.clearWatch$.subscribe(() => this.clearWatch());
    this.watchEmitter.subscribe(() => this.watchLocation());
    });
  }
  init() {
    if (Capacitor.isNativePlatform()) {
      this.notificationsPushService.init();
    }
  }

  async requestLocationPermission() {
    try {
      const hasPermission = await Geolocation.checkPermissions();

      if (hasPermission.location === 'denied') {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          console.warn('Permiso de ubicación denegado');
          return;
        }
      }

      this.getLocation();
    } catch (error) {
      console.error('Error al verificar permisos de ubicación:', error);
    }
  }

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.datosGlobales.setUbicacion(position.coords.latitude, position.coords.longitude, position.timestamp);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  watchLocation() {
    this.posWatch = Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000
      }, (position, err) => {
      if (err) {
        console.error('Error al obtener la ubicación:', err);
        return;
      }
      if (!position) {
        console.error('Error al obtener la ubicación', this.posWatch);
        return;
      }
      console.log('Ubicación actual posWatch:', position.coords.latitude, position.coords.longitude);
      this.datosGlobales.setUbicacion(position.coords.latitude, position.coords.longitude, position.timestamp);
      //TODO: Logica de guardar ubicacion cada vez que cambie
    }).toString();
  }

  clearWatch() {
    console.log('Limpiando watch :', this.posWatch);
    if (this.posWatch){
      console.log('Limpiando watch');
      Geolocation.clearWatch({ id: this.posWatch });
      this.posWatch = null;
      console.log('this.posWatch:', this.posWatch);
    }
  }
}
