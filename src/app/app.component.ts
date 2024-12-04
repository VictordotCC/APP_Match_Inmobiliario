import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GlobalDataService } from './servicios/global-data.service';
import { Capacitor } from '@capacitor/core';
import { NotificationsPushService } from './servicios/notifications-push.service';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {chevronDownCircle,
  chevronForwardCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe} from 'ionicons/icons';
import { DataServiceService } from './servicios/data-service.service';
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
  private subscriptions: Subscription[] = [];
  private lastPosition: { lat: number, lon: number } | null = null;


  constructor(private platform: Platform, private datosGlobales: GlobalDataService,
              private notificationsPushService: NotificationsPushService,
              private apiCon: DataServiceService)
              { this.init();
                addIcons({ chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe });
               }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.requestLocationPermission();
      this.watchLocation();
      this.subscriptions.push(
        this.datosGlobales.ubicacion$.pipe(debounceTime(10000)).subscribe(() => this.getLocation())
      );
      this.subscriptions.push(
        this.datosGlobales.clearWatch$.subscribe(() => this.clearWatch())
      );
      this.subscriptions.push(
        this.watchEmitter.subscribe(() => this.watchLocation())
      );
    });    
  }

  ngOndestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      const { latitude, longitude } = position.coords;
      if (this.lastPosition && this.lastPosition.lat === latitude && this.lastPosition.lon === longitude) {
        return; // No llamar a setUbicacion si la ubicación no ha cambiado
      }
      this.lastPosition = { lat: latitude, lon: longitude };
      this.datosGlobales.setUbicacion(latitude, longitude, position.timestamp);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
    this.apiCon.getViviendasApi().subscribe((data) => {
      console.log(data);
    });
    console.log('Ubicación actualizada');
  }

  watchLocation() {
    console.log('Iniciando watch');
    this.posWatch = Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 1000
      }, (position, err) => {
      if (err) {
        console.error('Error al obtener la ubicación:', err);
        return;
      }
      if (!position) {
        console.error('Error al obtener la ubicación', this.posWatch);
        return;
      }
      this.datosGlobales.setUbicacion(position.coords.latitude, position.coords.longitude, position.timestamp);
      this.apiCon.getViviendasApi().subscribe((data) => {
        console.log(data);
      });
    }).toString();
  }

  clearWatch() {
    console.log('Limpiando watch :', this.posWatch);
    if (this.posWatch){
      Geolocation.clearWatch({ id: this.posWatch });
      this.posWatch = null;
    }
  }
}
