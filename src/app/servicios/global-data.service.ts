import { Injectable } from '@angular/core';
import { PreferenciaUsuarioService } from './preferencia-usuario.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  //FIXME: ELIMINAR y usar LocalStorage
  public userGlobal: string = '';
  //public passGlobal: string = '1234';
  public userTipoGlobal: string = '';
  public userNombreGlobal: string = '';
  public userApellidoGlobal: string = '';
  public userTelefonoGlobal: string = '';
  //public idUserGlobal: string = '1';
  public activoGlobal: boolean = true;
  public linksContactoGlobal: string = '';
  public imgGlobal: string = '';
  public access_token: string = '';
  public refresh_token: string = '';

  private ubicacion = new BehaviorSubject<{lat: number, lon: number, timestamp: number}>({lat: 0, lon: 0, timestamp: 0});
  public ubicacion$ = this.ubicacion.asObservable();

  private clearWatchEmitter = new Subject<void>();
  public clearWatch$ = this.clearWatchEmitter.asObservable();

  public historialubis: {lat: number, lon: number, timestamp: number}[] = [];
  public lat: number = 0;
  public lon: number  = 0;
  public timestamp  = 0;
  public mapZoom = 17;
  public mapMinZoom = 15;
  public likeThreshold = 200;
  public imageWidth = 412;
  public imageHeight = 440;
  public preferencias = new PreferenciaUsuarioService();

  constructor() { }

  setUbicacion(lat: number, lon: number, timestamp: number){
    this.lat = lat;
    this.lon = lon;
    this.timestamp = timestamp;
    this.ubicacion.next({lat: lat, lon: lon, timestamp: timestamp});
  }

  setPreferencias(preferencias: PreferenciaUsuarioService){
    this.preferencias = preferencias;
  }

  triggerClearWatch(){
    this.clearWatchEmitter.next();
  }

  // Haversine formula  para calcular la distancia entre dos puntos
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number{
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000;
  }
}
