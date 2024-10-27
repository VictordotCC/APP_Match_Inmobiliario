import { Injectable } from '@angular/core';
import { PreferenciaUsuarioService } from './preferencia-usuario.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  public userGlobal: string = 'abc@def.com';
  public passGlobal: string = '1234';
  public userTipoGlobal: string = 'Comprador';

  private ubicacion = new BehaviorSubject<{lat: number, lon: number, timestamp: number}>({lat: 0, lon: 0, timestamp: 0});
  public ubicacion$ = this.ubicacion.asObservable();

  private clearWatchEmitter = new Subject<void>();
  public clearWatch$ = this.clearWatchEmitter.asObservable();

  public historialubis: {lat: number, lon: number, timestamp: number}[] = [];
  public lat: number = 0;
  public lon: number  = 0;
  public timestamp  = 0;
  public mapZoom = 17;
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
}
