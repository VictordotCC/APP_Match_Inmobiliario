import { Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, IonModal } from '@ionic/angular';
import { DataServiceService } from '../servicios/data-service.service';
import { StorageService } from '../servicios/storage.service';
import { addIcons } from 'ionicons';
import {chevronDownCircle,
  chevronForwardCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('modal') modal: IonModal | undefined;

  map: Leaflet.Map | undefined;
  markers: Leaflet.Marker[] = [];
  userMarker: Leaflet.Marker | undefined;
  private defaultIcon = Leaflet.icon({
    iconUrl: '../../assets/markers/marker-icon.png',
    shadowUrl: '../../assets/markers/marker-shadow.png'})
  textSearch: string = '';
  opcionFiltro: string = 'Todos';
  pass: string = '';
  tipo: string = '';
  filterViviendas: any[] = [];
  viewLat: number = 0;
  viewLon: number = 0;
  searchText: string = '';
  viviendas: any[] = [];
  page = 0;
  per_page = 20;
  detalleVivienda: any = {};
  isModalOpen: boolean = false; // Add this property to control modal state
  isFavorite: boolean = false; // Check if the current item is in favorites
  favoritos: any[] = [];
  mostrarMapa: boolean = true;
  private access_token: string = '';
  private usuario: string = '';


  constructor(private datosGlobales: GlobalDataService, private route: ActivatedRoute, public navCtrl: NavController,
    private apiCon: DataServiceService, private alertController: AlertController, private storage: StorageService) {
      addIcons({ chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe });
    }

  async ngOnInit() {
    await this.storage.init();
    this.access_token = await this.storage.get('access_token');
    this.usuario = await this.storage.get('userGlobal');
    this.obtenerFavoritos();

  }

  ionViewDidEnter() {
    this.obtenerFavoritos();
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
  
  showMapa(){
    this.mostrarMapa = !this.mostrarMapa;
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
    this.markers = [];
    this.viviendas = [];
    this.filterViviendas = [];
    this.obtenerViviendas().subscribe((viviendas: any) => {
      console.log(viviendas);
      this.viviendas = viviendas;
      this.filterViviendas = viviendas;
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
                                           );
          this.markers.push(marker);
        }
      });
    });
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

    if (deltaLat > 0.0015 || deltaLon > 0.0015) {
      this.viewLat = center.lat;
      this.viewLon = center.lng;
      this.nearbyMarker();
    }
    this.viewLat = center.lat;
    this.viewLon = center.lng;
  }


  iraPreferencias(){
    this.navCtrl.navigateForward(['/preferencias']);
    /*
    this.navCtrl.navigateForward(['/preferencias'], {
      queryParams: { user: this.user, pass: this.pass, tipo: this.tipo}
    });
    */
  }

  openDetalle(viv: any){
    this.detalleVivienda = {...viv};
    this.detalleVivienda.links_contacto = JSON.parse(viv.links_contacto);
    this.isModalOpen = true;
    this.isFavorite = this.favoritos.some((Fav) => Fav.id_vivienda === this.detalleVivienda.id_vivienda);
  }

  closeModal(){ // Add this method to close the modal
    this.isModalOpen = false;
    setTimeout(() => {
      this.isFavorite = false;
    }, 300);
  }

  //Metodos Fetch

  obtenerViviendas(){
    console.log(this.viewLat, this.viewLon);
    return this.apiCon.getViviendasCercanas(this.viewLat, this.viewLon, this.access_token);
  }

  async guardarFavorito(viv: any){
    const obj = { usuario: this.usuario, id_vivienda: viv.id_vivienda };
    this.apiCon.guardarFavoritos(obj, this.access_token).subscribe((data) => {
    });
    this.isFavorite = true;
    const alert = await this.alertController.create({
      header: 'Guardado',
      message: 'Se ha guarda la vivienda en favoritos',
      buttons: ['Aceptar']
    });
    this.favoritos.push(viv);
    await alert.present();
  }

  async obtenerFavoritos(){
    this.apiCon.getViviendasFavoritos(this.usuario, this.access_token).subscribe((data) => {
      this.favoritos = data;
    });
  }

  onSegmentChange(event: any) {
    this.opcionFiltro = event.detail.value;
    this.applyFilters();
  }
  searchVivienda(event: any) {
    this.searchText = event.target.value;
    this.applyFilters();
  }
  applyFilters() {
    let filtered = this.viviendas;

    if (this.opcionFiltro !== 'Todos') {
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.tipo_operacion === (this.opcionFiltro === 'Venta' ? false : true);
      });
    }

    if (this.searchText && this.searchText.trim() !== '') {
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.nombre_propiedad.toLowerCase().includes(this.searchText.toLowerCase());
      });
    }

    this.filterViviendas = filtered;
  }

  /*
  searchVivienda(event: any){
    this.textSearch = event.target.value;
    //this.nearbyMarker();
    if (this.textSearch && this.textSearch.trim() !== '') {
      this.filterViviendas = this.filterViviendas.filter((vivienda: any) => {
        return (vivienda.nombre_propiedad.toLowerCase().indexOf(this.textSearch.toLowerCase()) > -1);
      });
    } else if (this.opcionFiltro === 'Todos') {
      this.filterViviendas = this.viviendas;
    } else if (this.opcionFiltro === 'Venta'){
      this.textSearch = this.opcionFiltro;
    } else if (this.opcionFiltro === 'Arriendo'){
      this.textSearch = this.opcionFiltro;
    }
  }
    */
}
