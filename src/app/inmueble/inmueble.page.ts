import { Component, OnInit } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GlobalDataService } from '../servicios/global-data.service';
import { PreferenciaUsuarioService } from '../servicios/preferencia-usuario.service';
import { DataServiceService } from '../servicios/data-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.page.html',
  styleUrls: ['./inmueble.page.scss'],
})
export class InmueblePage implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private datosGlobales: GlobalDataService,
    private apiCon: DataServiceService
  ) { }

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
  linkContacto: string = ''; // ejemplo -> 'https://api.whatsapp.com/send?phone=56999999999&text=Hola,%20me%20interesa%20tu%20propiedad%20en%20venta';
  inLatitud: number = 0;
  inLongitud: number = 0;
  urlFotoVivienda: string = '';
  nomVivienda: string = '';
  descripVivienda: string = '';
  ngOnInit() {
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
    console.log(this.linkContacto);
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
    let imagenVivienda = {id_imagen: '1', id_vivienda: '1', url: this.urlFotoVivienda};
    this.apiCon.postImagenes(imagenVivienda).subscribe((data)=>{
      console.log(data);
    });
    console.log(this.urlFotoVivienda);
  }


  GuardarAjustes(){
    console.log('Guardando vivienda...');
    let vivienda = {
      tipo_operacion: this.opPeracion, //tipo de operación compra o arriendo
      tipo_vivienda: this.opPropiedad, //tipo de vivienda casa o departamento
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
      links_contacto: this.linkContacto,
      latitud: this.inLatitud,
      longitud: this.inLongitud,
      nombre_propiedad: this.nomVivienda,
      descripcion: this.descripVivienda,
    }
    console.log(vivienda);
    this.apiCon.postVivienda(vivienda).subscribe((data)=>{
      console.log(data);
    });
    this.router.navigate(['/preferencias']);
  }

}
