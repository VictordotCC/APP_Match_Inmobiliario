import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-preferencia-usuario',
  templateUrl: './preferencia-usuario.page.html',
  styleUrls: ['./preferencia-usuario.page.scss'],
})
export class PreferenciaUsuarioPage implements OnInit {

  DistanciaRango: any = 0; //para capturar el valor de la distancia
  cheCked: boolean = false; //para validar si esta activado o no la busqueda por distancia
  tipoValor: string = ''; //para seleccionar si es UF o CLP
  valorMontoVivienda = {min:0, max:0}; //para capturar el valor de la vivienda
  checkSubsidio: boolean = false; //para validar si esta activado o no la busqueda por subsidio
  subSidio: string[]= ['Ninguno','DS01','DS19','DS49','Arriendo']; //para seleccionar el tipo de subsidio
  opSubsidio: string = ''; //para capturar el tipo de subsidio
  cantHabitaciones: number = 0; //para capturar la cantidad de habitaciones
  cantBanos: number = 0; //para capturar la cantidad de baños
  estacionamiento: boolean= false; //para capturar si hay estacionamientos
  bodega: boolean= false; //para capturar si hay bodega
  opRegion: string[] = []; //para seleccionar la Región
  opComuna: string[] = []; //para seleccionar la Comuna
  opPeracion: string =''; //para seleccionar el tipo de operacion
  opPropiedad: string ='';
  opInmbueble: string = '';
  preferenciaUsuario: any = {}; //para guardar las preferencias del usuario


  constructor( private alertController: AlertController, private router: Router ) { }

  ngOnInit() {
  }

  //para habilitar la busqueda por distancia y validar si esta activado o no
  habilitarBusqueda(){
    this.cheCked = !this.cheCked;
    if (this.cheCked == false){
      this.DistanciaRango = 0;
      console.log('la distancia se dejó en :',this.DistanciaRango);

    }
  }
  //para capturar el valor de la distancia
  IonChange(ev:Event){
    this.DistanciaRango = (ev as RangeCustomEvent).detail.value;
    console.log('distancia: ',this.DistanciaRango);
  }

  //para seleccionar el tipo de operacion
  selectedOperacion(){
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

  //para seleccionar si es UF o CLP
  inputTipoValor(ev: Event){
    this.tipoValor = (ev.target as HTMLInputElement).value;
    console.log('tipo de valor: ',this.tipoValor);
  }

  //para capturar el valor de la vivienda
  ingresoValorViviendaMin(valor1: Event){
    this.valorMontoVivienda.min = parseFloat((valor1.target as HTMLInputElement).value);
    console.log('valor minimo: ',this.valorMontoVivienda.min +' '+this.tipoValor);

  }
  ingresoValorViviendaMax(valor2: Event){
    this.valorMontoVivienda.max = parseFloat((valor2.target as HTMLInputElement).value);
    console.log('valor maximo: ',this.valorMontoVivienda.max +' '+this.tipoValor);
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
      console.log('valor minimo corregido: ',this.valorMontoVivienda.min +' '+this.tipoValor);
      console.log('valor maximo corregido: ',this.valorMontoVivienda.max +' '+this.tipoValor);
    }
  }

  //para habilitar la busqueda por subsidio y validar si esta activado o no
  habilitarSub(){
    this.checkSubsidio = !this.checkSubsidio;
    if (this.checkSubsidio == false){
      this.opSubsidio = 'Ninguno';
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
  inEstacionamienot(){
    this.estacionamiento = !this.estacionamiento;
    //this.estacionamiento = (document.getElementById('estacionamiento') as HTMLInputElement).value;
    console.log('estacionamiento: ',this.estacionamiento);
  }

  //para capturar si hay bodega
  inBodega(){
    this.bodega = !this.bodega;
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

  //Para Guardar las preferencias del usuario se genera un objeto para después enviarlo a la base de datos
  GuardarAjustes(){
    this.preferenciaUsuario = {
      busquedaAutomatica: this.cheCked,
      Distancia: this.DistanciaRango,
      operacion: this.opPeracion,
      propiedadTipo: this.opPropiedad,
      inmueble: this.opInmbueble,
      TipoValor: this.tipoValor,
      ValorMinimo: this.valorMontoVivienda.min,
      ValorMaximo: this.valorMontoVivienda.max,
      Subsidio: this.opSubsidio,
      CantidadHabitaciones: this.cantHabitaciones,
      CantidadBanos: this.cantBanos,
      Estacionamiento: this.estacionamiento,
      Bodega: this.bodega,
      Region: this.opRegion,
      Comuna: this.opComuna
    }
    console.log('preferencias del usuario: ',JSON.stringify(this.preferenciaUsuario));
    // Para navegra a la pagina de preferencias.
    //this.router.navigate(['/preferencias']);
    //para limpiar los campos

  }

}
