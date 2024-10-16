import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  public userGlobal: string = 'abc@def.com';
  public passGlobal: string = '1234';
  public lat: number = 0;
  public lon: number  = 0;
  public timestamp  = 0;
  public mapZoom = 17;
  public likeThreshold = 150;

  constructor() { }

  setUbicacion(lat: number, lon: number, timestamp: number){
    this.lat = lat;
    this.lon = lon;
    this.timestamp = timestamp;
  }
}
