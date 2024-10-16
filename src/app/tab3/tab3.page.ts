import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';
import { GestureController, Gesture } from '@ionic/angular';
import { Swiper, SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  showDetails = false;
  map: Leaflet.Map | undefined;
  markers: Leaflet.Marker[] = [];

  paginationConfig = {
    type: 'progressbar',
    el: '.swiper-pagination',  
  };
 
  constructor(private datosGlobales: GlobalDataService, private gestureCtrl: GestureController) {}

  ngAfterViewInit(){
  }

  initializeMap() {
    const defaultIcon = Leaflet.icon({
      iconUrl: '../../assets/markers/marker-icon.png',
      shadowUrl: '../../assets/markers/marker-shadow.png'})
    this.map = Leaflet.map('mapMatch').setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.adduserMarker(this.datosGlobales.lat, this.datosGlobales.lon, defaultIcon);
    const marker = Leaflet.marker([this.datosGlobales.lat -0.001, this.datosGlobales.lon -0.001], {icon: Leaflet.icon({ //TODO: obtener lat y lon del domicilio seleccionado
      iconUrl: '../../assets/markers/casa-with-shadow.png',
      iconSize: [36, 36],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      })}).addTo(this.map);
    this.markers.push(marker);
  }

  adduserMarker(lat: number, lon: number, icon: Leaflet.Icon) {
    if (this.map) {
      const marker = Leaflet.marker([lat, lon], {icon: icon}).addTo(this.map);
      this.markers.push(marker);
    }
  }

  destroyMap() {
    if (this.map) {
      this.map.remove();
    }
  }

  guardarPref(propiedad: string){
    // Guardar preferencias
  }

  rechazarPref(propiedad: string){
    // Rechazar preferencias
  }

  toggleDetails(){
    this.showDetails = !this.showDetails;

    if (this.showDetails){
      setTimeout(() => {
        this.initializeMap();
      }, 0);
    } else {
      this.destroyMap();
    }
  }
}
