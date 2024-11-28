import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GlobalDataService } from '../servicios/global-data.service';
import { PreferenciaUsuarioService } from '../servicios/preferencia-usuario.service';
import { DataServiceService } from '../servicios/data-service.service';
import { StorageService } from '../servicios/storage.service';


@Component({
  selector: 'app-preferencia-usuario',
  templateUrl: './preferencia-usuario.page.html',
  styleUrls: ['./preferencia-usuario.page.scss'],
})
export class PreferenciaUsuarioPage implements OnInit {

  DistanciaRango: number = 0; //para capturar el valor de la distancia
  cheCked: boolean = false; //para validar si esta activado o no la busqueda por distancia
  tipoValor: string = 'UF'; //para seleccionar si es UF o CLP
  valorMontoVivienda = {min:0, max:0}; //para capturar el valor de la vivienda
  checkSubsidio: boolean = false; //para validar si esta activado o no la busqueda por subsidio
  subSidio: string[]= ['DS01','DS19','DS49','Arriendo']; //para seleccionar el tipo de subsidio
  opSubsidio: string[] = []; //para capturar el tipo de subsidio
  cantHabitaciones: number = 0; //para capturar la cantidad de habitaciones
  cantBanos: number = 0; //para capturar la cantidad de baños
  estacionamiento: number = 0; //para capturar si hay estacionamientos
  bodega: number = 0; //para capturar si hay bodega
  opRegion: string[] = []; //para seleccionar la Región
  opComuna: string[] = []; //para seleccionar la Comuna
  opPeracion: string ='Compra'; //para seleccionar el tipo de operacion
  opPropiedad: string ='Casa';
  opInmbueble: string = 'Nuevo';
  preferenciaUsuario: PreferenciaUsuarioService = new PreferenciaUsuarioService(); //para guardar las preferencias del usuario
  //preferenciaUsuario: any = {}; //para guardar las preferencias del usuario
  areaTotal: number = 0; //para capturar los mts cuadrados totales de la vivienda
  areaConstruida: number = 0; //para capturar los mts cuadrados construidos de la vivienda
  antiguedad: number = 0; //para capturar la antiguedad de la vivienda
  pisos: number = 0; //para capturar la cantidad de pisos de la vivienda
  contactado: boolean = false; //para validar si el usuario desea ser contactado
  notificaciones: boolean = false; //para validar si el usuario desea recibir notificaciones
  precio_uf_desde: number = 0; //para convertir el valor de la vivienda a UF
  precio_uf_hasta: number = 0; //para convertir el valor de la vivienda a UF

  access_token: string = '';

  constructor( private alertController: AlertController, 
    private router: Router, 
    private datosGlobales: GlobalDataService,
    private apiCon: DataServiceService,
    private storage: StorageService) { }

  async ngOnInit() {
    await this.storage.init();
    this.access_token = await this.storage.get('access_token');
    window.scrollTo(0,0);
    this.datosGlobales.preferencias = await this.storage.get('preferencias');
    this.datosGlobales.userGlobal = await this.storage.get('userGlobal');
    console.log('usuario global: ',this.datosGlobales.userGlobal);
    console.log('preferencias globales: ',this.datosGlobales.preferencias);
    if (this.datosGlobales.preferencias.usuario == this.datosGlobales.userGlobal){
      this.preferenciaUsuario = this.datosGlobales.preferencias;
      this.DistanciaRango = this.preferenciaUsuario.distancia;
      this.cheCked = this.preferenciaUsuario.busqueda_automatica;
      this.opPeracion = this.preferenciaUsuario.tipo_operacion == false ? 'Compra' : 'Arriendo';
      this.opPropiedad = (this.preferenciaUsuario.tipo_vivienda == 0 ? 'Departamento' : this.preferenciaUsuario.tipo_vivienda == 1 ? 'Casa' : 'Otro');
      this.opInmbueble = this.preferenciaUsuario.condicion;
      this.areaTotal = this.preferenciaUsuario.area_total;
      this.pisos = this.preferenciaUsuario.pisos;
      this.areaConstruida = this.preferenciaUsuario.area_construida;
      this.antiguedad = this.preferenciaUsuario.antiguedad;
      this.tipoValor = this.preferenciaUsuario.tipo_valor;
      this.valorMontoVivienda.min = this.preferenciaUsuario.precio_minimo;
      this.valorMontoVivienda.max = this.preferenciaUsuario.precio_maximo;
      this.opSubsidio = this.preferenciaUsuario.tipo_subsidio;
      this.cantHabitaciones = this.preferenciaUsuario.habitaciones;
      this.cantBanos = this.preferenciaUsuario.banos;
      this.estacionamiento = this.preferenciaUsuario.estaciona;
      this.bodega = this.preferenciaUsuario.bodega;
      this.contactado = this.preferenciaUsuario.contactado;
      this.notificaciones = this.preferenciaUsuario.notificaciones;
      this.checkSubsidio = this.opSubsidio.length == 0 ? false : true;
    } else {
      //Las trae de la API
      this.apiCon.obtenerPreferencias(this.access_token).subscribe((data: any) => {
        this.DistanciaRango = data.preferencias.distancia;
        this.cheCked = data.preferencias.busqueda_automatica;
        this.opPeracion = data.preferencias.tipo_operacion == false ? 'Compra' : 'Arriendo';
        this.opPropiedad = (data.preferencias.tipo_vivienda == 0 ? 'Departamento' : data.preferencias.tipo_vivienda == 1 ? 'Casa' : 'Otro');
        this.opInmbueble = data.preferencias.condicion;
        this.areaTotal = data.preferencias.area_total;
        this.pisos = data.preferencias.pisos;
        this.areaConstruida = data.preferencias.area_construida
        this.antiguedad = data.preferencias.antiguedad;
        this.tipoValor = data.preferencias.tipo_valor;
        this.valorMontoVivienda.min = data.preferencias.precio_minimo;
        this.valorMontoVivienda.max = data.preferencias.precio_maximo;
        this.opSubsidio = data.preferencias.tipo_subsidio;
        this.cantHabitaciones = data.preferencias.habitaciones;
        this.cantBanos = data.preferencias.banos;
        this.estacionamiento = data.preferencias.estaciona;
        this.bodega = data.preferencias.bodega;
        this.contactado = data.preferencias.contactado;
        this.notificaciones = data.preferencias.notificaciones;
        this.checkSubsidio = this.opSubsidio.length == 0 ? false : true;

        this.preferenciaUsuario = data.preferencias;
        this.preferenciaUsuario.usuario = this.datosGlobales.userGlobal;
        this.datosGlobales.setPreferencias(this.preferenciaUsuario);
      });
      
    }
  }

  //para habilitar la busqueda por distancia y validar si esta activado o no
  habilitarBusqueda(){
    this.cheCked = !this.cheCked;
    if (this.cheCked == false){
      this.DistanciaRango = 0;
      console.log('la distancia se dejó en :',this.DistanciaRango);

    }
    console.log('busqueda automatica: ',this.DistanciaRango);
  }
  //para capturar el valor de la distancia
  IonChange(ev:Event){
    this.DistanciaRango = parseFloat((ev.target as HTMLInputElement).value);
    console.log('distancia: ',this.DistanciaRango);

  }

  //para seleccionar el tipo de operacion
  selectedOperacion(){
    //
    console.log('operacion seleccionada: ',this.opPeracion);

  }

  //para seleccionar el tipo de propiedad
  selectedPropiedad(){

    console.log('propiedad seleccionada: ',this.opPropiedad);

  }

  //para seleccionar el tipo de inmueble
  selectedInmueble(){

    console.log('inmueble seleccionado: ',this.opInmbueble);

  }
  //para capturar los metros cuadrados construidos
  metrosConstruidos(ev: Event){
    this.areaConstruida = parseFloat((ev.target as HTMLInputElement).value);
    console.log('metros construidos: ',this.areaConstruida);

  }

  //para capturar los metros cuadrados totales
  metrosTotales(ev: Event){
    this.areaTotal = parseFloat((ev.target as HTMLInputElement).value);
    console.log('metros totales: ',this.areaTotal);
  }

  //para capturar la antiguedad de la vivienda
  ingresarAntiguedad(ev: Event){
    this.antiguedad = parseFloat((ev.target as HTMLInputElement).value);
    console.log('antiguedad: ',this.antiguedad);
  }

  //para capturar la cantidad de pisos de la vivienda
  cantPisos(ev: Event){
    this.pisos = parseFloat((ev.target as HTMLInputElement).value);
    console.log('pisos: ',this.pisos);
  }
  //para seleccionar si es UF o CLP
  inputTipoValor(ev: Event){
    this.tipoValor = (ev.target as HTMLInputElement).value;
    console.log('tipo de valor: ',this.tipoValor);

  }

  //para capturar el valor de la vivienda
  ingresoValorViviendaMin(valor1: Event){
    this.valorMontoVivienda.min = parseFloat((valor1.target as HTMLInputElement).value);
    if (this.tipoValor === 'CLP'){
      console.log('valor minimo: ',this.valorMontoVivienda.min +' '+this.tipoValor);
    } else {
      console.log('valor minimo: ',this.valorMontoVivienda.min +' '+this.tipoValor);
    }

  }
  ingresoValorViviendaMax(valor2: Event){
    this.valorMontoVivienda.max = parseFloat((valor2.target as HTMLInputElement).value);
    if (this.tipoValor === 'CLP'){
      console.log('valor maximo: ',this.valorMontoVivienda.max +' '+this.tipoValor);
    } else {
      console.log('valor maximo: ',this.valorMontoVivienda.max +' '+this.tipoValor);
    }
  }

  //para mostrar un mensaje de error si el monto maximo es menor al monto minimo
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El monto máximo no puede ser menor al monto mínimo, se invertirán los valores',
      buttons: ['OK']
    });
    await alert.present();
  }

  //para validar que el monto maximo no sea menor al monto minimo
  validarMontoMax(monto: Event){
    const montoMax = parseFloat((monto.target as HTMLInputElement).value);

    if (this.valorMontoVivienda.min > this.valorMontoVivienda.max){
      this.showAlert();
      const aux = this.valorMontoVivienda.max;
      this.valorMontoVivienda.max = this.valorMontoVivienda.min;
      this.valorMontoVivienda.min = aux;
      //console.log('valor minimo corregido: ',this.valorMontoVivienda.min +' '+this.tipoValor);
      //console.log('valor maximo corregido: ',this.valorMontoVivienda.max +' '+this.tipoValor);
      console.log('monto maximo y mínimo corregidos: ');
    }
  }

  //para habilitar la busqueda por subsidio y validar si esta activado o no
  habilitarSub(){
    this.checkSubsidio = !this.checkSubsidio;
    if (this.checkSubsidio == false){
      console.log('no se seleccionó ningun subsidio');
    }

  }

  //para seleccionar el tipo de subsidio
  selectedSubsidio(){
    console.log('subsidio seleccionado: ',this.opSubsidio);
  }

  //para capturar la cantidad de habitaciones
  ingresoHabitaciones(){
    //this.cantHabitaciones = parseInt((document.getElementById('habitaciones') as HTMLInputElement).value);
    console.log('cantidad de habitaciones: ',this.cantHabitaciones);

  }

  //para capturar la cantidad de baños
  ingresoBanos(){
    //this.cantBanos = parseInt((document.getElementById('banos') as HTMLInputElement).value);
    console.log('cantidad de baños: ',this.cantBanos);

  }

  //para capturar si hay estacionamientos
  inEstacionamiento(){
    //this.estacionamiento = !this.estacionamiento;
    //this.estacionamiento = (document.getElementById('estacionamiento') as HTMLInputElement).value;
    console.log('estacionamiento: ',this.estacionamiento);

  }

  //para capturar si hay bodega
  inBodega(){
    //this.bodega = !this.bodega;
    //this.bodega = (document.getElementById('Bodega') as HTMLInputElement).value;
    console.log('bodega: ',this.bodega);

  }

  //para seleccionar la Región
  selectedRegion(){
    console.log('region seleccionada: ', this.opRegion);
  }

  //para seleccionar la Comuna
  selectedComuna(){
    console.log('comuna seleccionada: ', this.opComuna);
  }

  //para validar si el usuario desea ser contactado
  contactar(){
    this.contactado = !this.contactado;
    console.log('contactado: ',this.contactado);
  }

  //para validar si el usuario desea recibir notificaciones
  notificar(){
    this.notificaciones = !this.notificaciones;
    console.log('notificaciones: ',this.notificaciones);
  }

  //Para Guardar las preferencias del usuario se genera un objeto para después enviarlo a la base de datos
  GuardarAjustes() {
    if (this.opSubsidio == null){
      this.opSubsidio = [];
    }

    if (this.tipoValor === 'CLP'){
      this.precio_uf_hasta = parseFloat((this.valorMontoVivienda.max / 38000).toFixed(1)); //para darle 1 decimal
      this.precio_uf_desde = parseFloat((this.valorMontoVivienda.min / 38000).toFixed(1)); //para darle 1 decimal
      //this.precioUF = Math.round(this.valorMontoVivienda.max / 38000); //para manejar el valor entero
    } else {
      this.precio_uf_hasta = this.valorMontoVivienda.max;
      this.precio_uf_desde = this.valorMontoVivienda.min;
     }

    this.preferenciaUsuario = {
      usuario : this.datosGlobales.userGlobal,
      busqueda_automatica: this.cheCked,
      distancia: this.DistanciaRango,
      tipo_operacion: this.opPeracion == 'Compra' ? false : true,
      tipo_vivienda: (this.opPropiedad == 'Departamento' ? 0 : this.opPropiedad == 'Casa' ? 1 : 2),
      condicion: this.opInmbueble,
      area_total: this.areaTotal ? parseFloat((this.areaTotal).toFixed(1)) : 0,
      pisos: this.pisos ? Math.round(this.pisos) : 0,
      area_construida :this.areaConstruida ? parseFloat((this.areaConstruida).toFixed(1)) : 0,
      antiguedad: this.antiguedad ? Math.round(this.antiguedad) : 0,
      tipo_valor: this.tipoValor,
      precio_minimo: this.valorMontoVivienda.min ? parseFloat((this.valorMontoVivienda.min).toFixed(1)) : 0,
      precio_maximo: this.valorMontoVivienda.max ? parseFloat((this.valorMontoVivienda.max).toFixed(1)) : 0,
      precio_uf_desde: this.precio_uf_desde, 
      precio_uf_hasta: this.precio_uf_hasta, 
      tipo_subsidio: this.checkSubsidio ? this.opSubsidio : [],
      habitaciones: this.cantHabitaciones ? Math.round(this.cantHabitaciones) : 0,
      banos: this.cantBanos ? Math.round(this.cantBanos) : 0,
      estaciona: this.estacionamiento ? Math.round(this.estacionamiento) : 0,
      bodega: this.bodega ? Math.round(this.bodega) : 0,
      contactado: this.contactado,
      notificaciones: this.notificaciones
    };

    // Guardar las preferencias del usuario en datos globales
    this.datosGlobales.setPreferencias(this.preferenciaUsuario);

    //Guardar las preferencias del usuario en la base de datos
    this.apiCon.guardarPreferencias(this.preferenciaUsuario, this.access_token).subscribe(async (data: any) => {
      if (data.status == 200){
        console.log(data);
        const alert = await this.alertController.create({
          header: 'Preferencias Guardadas',
          message: 'Preferencias guardadas exitosamente',
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        //TODO guardar localmente
      }
    });
    // Para navegra a la pagina de preferencias.
    //this.router.navigate(['preferencias'], {state: {preferencias: this.preferenciaUsuario}});
    this.router.navigate(['/preferencias']);

  }

}
