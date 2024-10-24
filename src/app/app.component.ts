import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GlobalDataService } from './servicios/global-data.service';

import { register } from 'swiper/element/bundle';
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

  constructor(private platform: Platform, private datosGlobales: GlobalDataService) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.requestLocationPermission();
      this.watchLocation();
    this.positionEmmitter.subscribe(() => this.getLocation());
    this.clearWatchEmitter.subscribe(() => this.clearWatch());
    this.watchEmitter.subscribe(() => this.watchLocation());
    });
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
      console.log('Ubicación actual:', position.coords.latitude, position.coords.longitude);
      this.datosGlobales.setUbicacion(position.coords.latitude, position.coords.longitude, position.timestamp);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  watchLocation() {
    const posWatch = Geolocation.watchPosition({ 
      enableHighAccuracy: true,
      timeout: 10000
      }, (position, err) => {
      if (err) {
        console.error('Error al obtener la ubicación:', err);
        return;
      }
      if (!position) {
        console.error('Error al obtener la ubicación', posWatch);
        return;
      }
      console.log('Ubicación actual posWatch:', position.coords.latitude, position.coords.longitude);
      this.datosGlobales.setUbicacion(position.coords.latitude, position.coords.longitude, position.timestamp);
      //TODO: Logica de guardar ubicacion cada vez que cambie, evaluar necesidad de ASYNC AWAIT
    });
  }

  clearWatch() {
    if (this.posWatch){
      Geolocation.clearWatch({ id: this.posWatch });
      this.posWatch = null;
    }
  }
}
