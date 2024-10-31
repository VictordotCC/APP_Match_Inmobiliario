import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataServiceService } from '../servicios/data-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  map: Leaflet.Map | undefined;
  markers: Leaflet.Marker[] = [];
  private defaultIcon = Leaflet.icon({
    iconUrl: '../../assets/markers/marker-icon.png',
    shadowUrl: '../../assets/markers/marker-shadow.png'})

  opcionFiltro: string = 'Todos';
  user: string = '';
  pass: string = '';
  tipo: string = '';
  constructor(private datosGlobales: GlobalDataService, private route: ActivatedRoute, public navCtrl: NavController, private apiCon: DataServiceService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.user = params['user'];
      this.pass = params['pass'];
      this.tipo = params['tipo'];
      console.log('User:', this.user);
      console.log('Pass:', this.pass);
      console.log('Tipo:', this.tipo);
    });
  }

  ionViewDidEnter() {
    if(this.map){
      this.map.remove();
    }
    this.initializeMap();
    this.datosGlobales.ubicacion$.subscribe((ubicacion) => {
      if (ubicacion) {
        this.map?.setView([ubicacion.lat, ubicacion.lon], this.datosGlobales.mapZoom);
        this.markers = [];
        this.adduserMarker(ubicacion.lat, ubicacion.lon, this.defaultIcon);
        this.nearbyMarker();
      }
    });
  }

  initializeMap() {
    this.map = Leaflet.map('map').setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.adduserMarker(this.datosGlobales.lat, this.datosGlobales.lon, this.defaultIcon);
    this.nearbyMarker();
  }

  adduserMarker(lat: number, lon: number, icon: Leaflet.Icon) {
    if (this.map) {
      const marker = Leaflet.marker([lat, lon], {icon: icon}).addTo(this.map);
      this.markers.push(marker);
    }
  }

  nearbyMarker() {
    this.obtenerViviendas().subscribe((viviendas: any) => {
      viviendas.forEach((vivienda: any) => {
        if(this.map){
          const marker = Leaflet.marker([vivienda.latitud, vivienda.longitud], {icon: Leaflet.icon({
            iconUrl: '../../assets/markers/casa-with-shadow.png',
            iconSize: [36, 36],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            })}).addTo(this.map).bindPopup(`<b>${vivienda.nombre_propiedad} </b> en <b>${vivienda.tipo_operacion == false ? 'Venta': 'Arriendo'}</b><br>${vivienda.precio_uf} UF`
                                           + `<br><img src="${vivienda.imagenes[0].url}" style="width: 100px; height: 100px;">`
                                           + `<br><a href="${JSON.parse(vivienda.links_contacto)[0]}" target="_blank">Contacto</a>`);
          this.markers.push(marker);
        }
      });
    });
    /*if (this.map) {
      const marker = Leaflet.marker([this.datosGlobales.lat -0.001, this.datosGlobales.lon -0.001], {icon: Leaflet.icon({
        iconUrl: '../../assets/markers/casa-with-shadow.png',
        iconSize: [36, 36],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        })}).addTo(this.map).bindPopup(`<b>Vivienda cercana</b><br>Otra información en HTML`);
      this.markers.push(marker);
    }*/
  }

  centrarMapa(){
    if(this.map){
      this.map.setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    }
  }


  iraPreferencias(){
    console.log('ir a preferencias');
    this.navCtrl.navigateForward(['/preferencias'], {
      queryParams: { user: this.user, pass: this.pass, tipo: this.tipo}
    });
  }

  //Metodos Fetch

  obtenerViviendas(){
    return this.apiCon.getViviendasCercanas()
  }
}
