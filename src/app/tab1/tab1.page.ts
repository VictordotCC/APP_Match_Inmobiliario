import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { DataServiceService } from '../servicios/data-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  map: Leaflet.Map | undefined;
  markers: Leaflet.Marker[] = [];
  userMarker: Leaflet.Marker | undefined;
  private defaultIcon = Leaflet.icon({
    iconUrl: '../../assets/markers/marker-icon.png',
    shadowUrl: '../../assets/markers/marker-shadow.png'})

  opcionFiltro: string = 'Todos';
  user: string = '';
  pass: string = '';
  tipo: string = '';

  viewLat: number = 0;
  viewLon: number = 0;

  viviendas: any[] = [];
  page = 0;
  per_page = 20;
  detalleVivienda: any = {};
  isModalOpen: boolean = false; // Add this property to control modal state

  constructor(private datosGlobales: GlobalDataService, private route: ActivatedRoute, public navCtrl: NavController,
    private apiCon: DataServiceService, private alertController: AlertController) {}

  ngOnInit() {

  }

  ionViewDidEnter() {
    if(this.map){
      this.map.remove();
    }
    this.initializeMap();
    this.datosGlobales.ubicacion$.subscribe((ubicacion) => {
      if (ubicacion) {
        this.map?.setView([ubicacion.lat, ubicacion.lon])//, this.datosGlobales.mapZoom);
        this.adduserMarker(ubicacion.lat, ubicacion.lon, this.defaultIcon);
        this.nearbyMarker();
      }
    });
  }

  initializeMap() {
    this.viewLat = this.datosGlobales.lat;
    this.viewLon = this.datosGlobales.lon;
    this.map = Leaflet.map('map', {minZoom : this.datosGlobales.mapMinZoom}).setView([this.viewLat, this.viewLon], this.datosGlobales.mapZoom); //maxZoom
    Leaflet.control.scale().addTo(this.map);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.adduserMarker(this.viewLat, this.viewLon, this.defaultIcon);
    this.nearbyMarker();
    this.map.on('moveend', () => this.mapMoved());
  }

  adduserMarker(lat: number, lon: number, icon: Leaflet.Icon) {
    if (this.map) {
      if (this.userMarker) {
        this.userMarker.setLatLng([lat, lon]);
      } else {
        this.userMarker = Leaflet.marker([lat, lon], {icon: icon}).addTo(this.map);
      }
    }
  }

  nearbyMarker() {
    this.markers.forEach(marker => {
      marker.remove();
    });
    this.obtenerViviendas().subscribe((viviendas: any) => {
      this.viviendas = viviendas;
      console.log(this.viviendas[0]);
      viviendas.forEach((vivienda: any) => {
        if(this.map){
          const marker = Leaflet.marker([vivienda.latitud, vivienda.longitud], {icon: Leaflet.icon({
            iconUrl: '../../assets/markers/casa-with-shadow.png',
            iconSize: [36, 36],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            })}).addTo(this.map).bindPopup(`<b>${vivienda.nombre_propiedad} </b> en <b>${vivienda.tipo_operacion == false ? 'Venta': 'Arriendo'}</b><br>${vivienda.precio_uf} UF`
                                           + `<br><img src="${vivienda.imagenes[0].url}" style="width: 100px; height: 100px;">`
                                           + `<br><a href="${JSON.parse(vivienda.links_contacto)[0]}" target="_blank">Contacto</a>`
                                           + '<a href="" style="float: right">Ver más</a>');
          this.markers.push(marker);
        }
      });
    });
    /*if (this.map) {
      const marker = Leaflet.marker([this.viewLat -0.001, this.viewLon -0.001], {icon: Leaflet.icon({
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

  mapMoved(){
    const center = this.map!.getCenter();
    const deltaLat = Math.abs(center.lat - this.datosGlobales.lat);
    const deltaLon = Math.abs(center.lng - this.datosGlobales.lon);

    if (deltaLat > 0.0045 || deltaLon > 0.0045) {
      this.viewLat = center.lat;
      this.viewLon = center.lng;
      this.nearbyMarker();
    }
  }


  iraPreferencias(){
    console.log('ir a preferencias');
    this.navCtrl.navigateForward(['/preferencias']);
    /*
    this.navCtrl.navigateForward(['/preferencias'], {
      queryParams: { user: this.user, pass: this.pass, tipo: this.tipo}
    });
    */
  }

  //Metodos Fetch

  obtenerViviendas(){
    return this.apiCon.getViviendasCercanas(this.viewLat, this.viewLon);
  }

  openDetalle(viv: any){
    this.detalleVivienda = viv;
    this.detalleVivienda.links_contacto = JSON.parse(viv.links_contacto);
    this.isModalOpen = true;

  }
  closeModal(){ // Add this method to close the modal
    this.isModalOpen = false;
  }

  async guardarFavorito(viv: any){
    const obj = { usuario: this.datosGlobales.userGlobal, id_vivienda: viv.id_vivienda };
    this.apiCon.guardarFavoritos(obj).subscribe((data) => {
      console.log(data);

    });
    const alert = await this.alertController.create({
      header: 'Guardado',
      message: 'Se ha guarda la vivienda en favoritos',
      buttons: ['Aceptar']
    });
    await alert.present();
  }


}
