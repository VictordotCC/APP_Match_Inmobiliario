import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  map: Leaflet.Map | undefined;
  markers: Leaflet.Marker[] = [];

  constructor(private datosGlobales: GlobalDataService) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.initializeMap();
  }

  initializeMap() {
    const defaultIcon = Leaflet.icon({
      iconUrl: '../../assets/markers/marker-icon.png',
      shadowUrl: '../../assets/markers/marker-shadow.png'})
    this.map = Leaflet.map('map').setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.adduserMarker(this.datosGlobales.lat, this.datosGlobales.lon, defaultIcon);
    this.nearbyMarker();
  }

  adduserMarker(lat: number, lon: number, icon: Leaflet.Icon) {
    if (this.map) {
      const marker = Leaflet.marker([lat, lon], {icon: icon}).addTo(this.map);
      this.markers.push(marker);
    }
  }

  async nearbyMarker(){
    let lat = -33.472472;
    let lon = -70.910025;
    //TODO: obtener la lista de domicilios cercanos
    if (this.map) {
      const marker = Leaflet.marker([this.datosGlobales.lat -0.001, this.datosGlobales.lon -0.001], {icon: Leaflet.icon({
        iconUrl: '../../assets/markers/casa-with-shadow.png',
        iconSize: [36, 36],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        })}).addTo(this.map).bindPopup(`<b>Vivienda cercana</b><br>Otra información en HTML`);
      this.markers.push(marker);
    }
  }

  centrarMapa(){
    if(this.map){
      this.map.setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    }
  }

  ionViewWillLeave() {
    if(this.map){
      this.map.remove();
    }
  }
}
