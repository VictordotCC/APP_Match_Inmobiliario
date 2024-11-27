import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, RangeCustomEvent } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { GlobalDataService } from '../servicios/global-data.service';
import { DataServiceService } from '../servicios/data-service.service';
import { Router } from '@angular/router';
import { StorageService } from '../servicios/storage.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.page.html',
  styleUrls: ['./inmueble.page.scss'],
})
export class InmueblePage implements OnInit {
  opPeracion: string ='Compra'; //para seleccionar el tipo de operacion
  opPropiedad: string ='Casa';
  opInmbueble: string = 'Nuevo';
  areaConstruida: number = 0;
  antiguedad: number = 0;
  areaTotal: number = 0;
  pisos: number = 0;
  valorMontoVivienda: number = 0;
  checkSubsidio: boolean = false;
  subSidio: string[]= ['Ninguno','DS01','DS19','DS49','Arriendo']; //para seleccionar el tipo de subsidio
  opSubsidio: string = 'Ninguno';
  cantHabitaciones: number = 0;
  cantBanos: number = 0;
  estacionamiento: number = 0;
  bodega: number = 0;
  linksContacto: string[] = []; ; // ejemplo -> 'https://api.whatsapp.com/send?phone=56999999999&text=Hola,%20me%20interesa%20tu%20propiedad%20en%20venta';
  linkContacto: string = '';
  inLatitud: number = 0;
  inLongitud: number = 0;
  urlsFotoVivienda: string[] = [];
  urlFotoVivienda: string = '';
  nomVivienda: string = '';
  descripVivienda: string = '';
  private access_token: string = '';
  private correo: string = '';
  private viewLat: number = 0;
  private viewLon: number = 0;
  private map: Leaflet.Map | undefined;
  private marker: Leaflet.Marker | undefined;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private router: Router,
    private datosGlobales: GlobalDataService,
    private apiCon: DataServiceService,
    private storage: StorageService
    ) { }


  async ngOnInit() {
    await this.storage.init();
    this.access_token = await this.storage.get('access_token');
    this.correo = await this.storage.get('userGlobal');
  }

  ionViewDidEnter(){
    if(this.map){
      this.map.remove();
    }
    this.initializeMap();
    this.datosGlobales.ubicacion$.subscribe((ubicacion)=>{
      if(ubicacion){
        this.map?.setView([ubicacion.lat, ubicacion.lon]);
      }
    });
  }

  initializeMap(){
    if (this.map) {
      this.map.remove();
    }
    this.viewLat = this.datosGlobales.lat;
    this.viewLon = this.datosGlobales.lon;
    this.map = Leaflet.map('map').setView([this.viewLat, this.viewLon], 13);
    Leaflet.control.scale().addTo(this.map);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: Leaflet.LeafletMouseEvent) => {
      this.inLatitud = e.latlng.lat;
      this.inLongitud = e.latlng.lng;
      this.addMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  addMarker(lat: number, lon: number){
    if (this.marker){
      this.map?.removeLayer(this.marker);
    }
    this.marker = Leaflet.marker([lat, lon], {
      icon: Leaflet.icon({
        iconUrl: '../../assets/markers/marker-icon.png',
        shadowUrl: '../../assets/markers/marker-shadow.png',
      })
    }).addTo(this.map!);
  }

  async addContacto(){
    if (this.linkContacto == '') {
      console.log('No se puede agregar un link vacío');
      return;
    }
    this.linksContacto.push(this.linkContacto);
    this.linkContacto = '';
    await this.closeModal();  
  }

  async addImagen(){
    if (this.urlFotoVivienda == '') {
      console.log('No se puede agregar una imagen vacía');
      return;
    }
    this.urlsFotoVivienda.push(this.urlFotoVivienda);
    this.urlFotoVivienda = '';
    await this.closeModal();
  }

  async closeModal(){
    this.linkContacto = '';
    this.urlFotoVivienda = '';
    const modal = await this.modalController.getTop();
    modal?.dismiss();
  }

  selectedOperacion(){
    console.log(this.opPeracion);
  }
  selectedPropiedad(){
    console.log(this.opPropiedad);
  }
  selectedInmueble(){
    console.log(this.opInmbueble);
  }
  metrosConstruidos(e: Event){
    this.areaConstruida = parseInt((<HTMLInputElement>e.target).value);
    console.log(this.areaConstruida);
  }
  ingresarAntiguedad(e: Event){
    this.antiguedad = parseInt((<HTMLInputElement>e.target).value);
    console.log(this.antiguedad);
  }
  metrosTotales(e:Event){
    this.areaTotal = parseInt((<HTMLInputElement>e.target).value);
    console.log(this.areaTotal);
  }
  cantPisos(e:Event){
    this.pisos = parseInt((<HTMLInputElement>e.target).value);
    console.log(this.pisos);
  }
  ingresoValorVivienda(e:Event){
    this.valorMontoVivienda = parseFloat((<HTMLInputElement>e.target).value);
    console.log(this.valorMontoVivienda);
  }
  habilitarSub(){
    this.checkSubsidio = !this.checkSubsidio;
    console.log(this.checkSubsidio);
  }
  selectedSubsidio(){
    console.log('subsidio seleccionado: ',this.opSubsidio);
  }
  ingresoHabitaciones(){
    console.log(this.cantHabitaciones);
  }
  ingresoBanos(){
    console.log(this.cantBanos);
  }
  inEstacionamiento(){
    console.log(this.estacionamiento);
  }
  inBodega(){
    console.log(this.bodega);
  }
  inContacto(){
    console.log(this.linksContacto);
  }
  ingresoLatitud(){
    console.log(this.inLatitud);
  }
  ingresoLongitud(){
    console.log(this.inLongitud);
  }
  nombreVivienda(){
    console.log(this.nomVivienda);
  }
  descripcionVivienda(){
    console.log(this.descripVivienda);
  }

  fotoVivienda(){
    const imagenes = JSON.stringify(this.urlsFotoVivienda);
    /*this.apiCon.postImagenes(imagenVivienda, this.access_token).subscribe((data)=>{
      console.log(data);
    });*/
    console.log(this.urlsFotoVivienda);
  }


  GuardarVivienda(){
    console.log('Guardando vivienda...');
    const vivienda = {
      correo : this.correo,
      tipo_operacion: this.opPeracion == 'Compra' ? false : true,
      tipo_vivienda: (this.opPropiedad == 'Departamento' ? 0 : this.opPropiedad == 'Casa' ? 1 : 2),
      condicion: this.opInmbueble, //condición del inmueble
      area_construida: this.areaConstruida,
      antiguedad: this.antiguedad,
      area_total: this.areaTotal,
      pisos: this.pisos,
      precio_uf: this.valorMontoVivienda,
      tipo_subsidio: this.opSubsidio,
      habitaciones: this.cantHabitaciones,
      banos: this.cantBanos,
      estaciona: this.estacionamiento,
      bodega: this.bodega,
      links_contacto: JSON.stringify(this.linksContacto),
      latitud: this.inLatitud,
      longitud: this.inLongitud,
      nombre_propiedad: this.nomVivienda,
      descripcion: this.descripVivienda,
    }
    console.log(vivienda);
    this.apiCon.postVivienda(vivienda, this.access_token).subscribe((data)=>{
      console.log(data);
    });
    //this.router.navigate(['/preferencias']);
  }

}
