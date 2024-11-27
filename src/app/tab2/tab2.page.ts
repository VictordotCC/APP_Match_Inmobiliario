import { DataServiceService } from './../servicios/data-service.service';
import { Component, ViewChild, OnInit, AfterViewInit, ElementRef  } from '@angular/core';
import { IonSegment, AlertController} from '@ionic/angular';
import { Observable} from 'rxjs';
import { GlobalDataService } from '../servicios/global-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../servicios/storage.service';
import { Chart, registerables } from 'chart.js';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit, AfterViewInit  {
  chart: any; // Add this property to store the chart instance
  @ViewChild('myChart', { static: false }) myChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild(IonSegment) segmento1!: IonSegment;
  @ViewChild(IonSegment) segmento2!: IonSegment;
  opcionAll: string = 'Todos';
  isModalOpen: boolean = false; // Add this property to control modal state
  viviendas: any[] = [];
  imagenes!: Observable<any[]>;
  serchVar: any[] = []; // variable para buscar en el SearchBar
  textoBuscar: string = "";
  filterViviendas: any[] = [];
  trustedURL: any = ''; // Correct property name
  dangerousUrl: string = ''; // Add this property to avoid undefined error
  idOpenDetalle: string = '';
  detalleVivienda: any = {};
  fotoCasa :string =''; //variable para la foto de la casa
  isModalOpen2: boolean = false; // Add this property to control modal state
  inputUfmin: number = 0;
  inputUfmax: number = 0;
  mtsMin: number = 0;
  mtsMax: number = 0;
  isModalOpen3: boolean = false; // Add this property to control modal state
  isModalOpen4: boolean = false; // Add this property to control modal state
  inputHabitacion: number = 0;
  private access_token: string = '';
  private usuario: string = '';
  prediccionPrecio: number = 0;
  constructor(private DataService: DataServiceService, private datosGlobales: GlobalDataService,
    private sanitizer: DomSanitizer, private alertController: AlertController, private storage: StorageService) {
    this.dangerousUrl = this.viviendas[0]?.links_contacto || ''; // Ensure viviendas[0] exists
    this.trustedURL = sanitizer.bypassSecurityTrustUrl(this.dangerousUrl,); // Correct property name
    Chart.register(...registerables); // Registra todos los componentes necesarios para el uso de Chart.js
  }

  async ngOnInit() {
    await this.storage.init();
    this.access_token = await this.storage.get('access_token');
    this.usuario = await this.storage.get('userGlobal');
    this.obtenerFavs();

  }

  ngAfterViewInit() {
    this.createChart();
  }
  ionViewDidEnter(){
    this.obtenerFavs();
  }

  segmentPrecMtsHab(event: CustomEvent){
    const valorSegment1 = event.detail.value;
    console.log(valorSegment1);
  }
  segmentVentArriendo(event: CustomEvent){
    this.opcionAll = event.detail.value;
    console.log(this.opcionAll);
    this.applyFilters();
  }

  segmentChanged(event: CustomEvent) {
    const valorSegment = event.detail.value;
    return valorSegment;
  }

  applyFilters(){
    let filtered = this.viviendas;
    if (this.opcionAll !== 'Todos') { //filtro por tipo de operación
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.tipo_operacion === (this.opcionAll === 'Venta' ? false : true);
      });
    }
    if (this.textoBuscar && this.textoBuscar.trim() !== '') { //filtro por nombre
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.nombre_propiedad.toLowerCase().includes(this.textoBuscar.toLowerCase());
      });
    }

    if (this.inputUfmin > 0) {//filtro valor mínimo
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.precio_uf >= this.inputUfmin;
      });
    }
    if (this.inputUfmax > 0) {//filtro valor máximo
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.precio_uf <= this.inputUfmax;
      });
    }
    if (this.mtsMin > 0) {//filtro valor mínimo
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.area_total >= this.mtsMin;
      });
    }
    if (this.mtsMax > 0) { //filtro valor máximo
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.area_total <= this.mtsMax;
      });
    }
    if (this.inputHabitacion > 0) { //filtro valor habitaciones
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.habitaciones >= this.inputHabitacion;
      });
    }



      this.filterViviendas = filtered;
  }

  buscar(event: any){
    this.textoBuscar = event.detail.value;
    this.applyFilters();
  }



  async obtenerFavs(){
    this.DataService.getViviendasFavoritos(this.usuario, this.access_token).subscribe( data => {
      this.viviendas = data;
      this.filterViviendas = this.viviendas;
    });
  }

  async borrarFav(vivienda: any){
    const fav = {id_vivienda: vivienda.id_vivienda, usuario: this.usuario};
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Desea eliminar la vivienda de favoritos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.DataService.borrarFavorito(fav, this.access_token).subscribe( data => {
              this.obtenerFavs();
              setTimeout(() => {
                this.closeModal();
              }, 500);
            });
            return true;
          }
        }
      ]
    });
    return await alert.present();
  }


  formatString(str: string){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  openDetalle(vivienda: any){
    //this.idOpenDetalle = this.viviendas[0].id_vivienda;
    this.fotoCasa = JSON.parse(vivienda.links_contacto);
    this.detalleVivienda = vivienda;
    this.isModalOpen = true;
    this.predecirPrecio(vivienda);

  }
  //FIXME: Add Generic method to close modals

  closeModal(){ // Add this method to close the modal
    this.isModalOpen = false;
  }
  closeModal2(){ // Add this method to close the modal
    this.isModalOpen2 = false;
  }
  closeModal3(){ // Add this method to close the modal
    this.isModalOpen3 = false;
  }
  closeModal4(){ // Add this method to close the modal
    this.isModalOpen4 = false;
  }

  filtroPrecio(){
    this.isModalOpen2 = true;
  }
  filtroMetros(){
    this.isModalOpen3 = true;
  }
  filtroHabitacion(){
    this.isModalOpen4 = true;
  }

  ingresoValorViviendaMin(e: Event){
    this.inputUfmin = parseFloat((e.target as HTMLInputElement).value);
  }
  ingresoValorViviendaMax(e: Event){
    this.inputUfmax = parseFloat((e.target as HTMLInputElement).value);
  }

  ingMtsMin(e: Event){
    this.mtsMin = parseFloat((e.target as HTMLInputElement).value);
  }

  ingMtsMax(e: Event){
    this.mtsMax = parseFloat((e.target as HTMLInputElement).value);
  }
  ingHabitacion(e: Event){
    this.inputHabitacion = parseFloat((e.target as HTMLInputElement).value);
  }

  filtrarPrecio(){
    this.applyFilters();
    this.closeModal2();
  }
  filtrarMetros(){
    this.applyFilters();
    this.closeModal3();
  }
  filtrarHabitacion(){
    this.applyFilters();
    this.closeModal4();
  }

  limpiarFiltro(){
    this.inputUfmin = 0;
    this.inputUfmax = 0;
    this.mtsMin = 0;
    this.mtsMax = 0;
    this.inputHabitacion = 0;
    this.applyFilters();

  }

  //metodo de predicción de precio
  predecirPrecio(vivienda: any){
    this.DataService.getPrediccion(vivienda).subscribe( data => {
      this.prediccionPrecio = Math.round(data.prediction);
      this.updateChart(this.prediccionPrecio); // Call the method to update the chart
      console.log('predicción en UF:',this.prediccionPrecio);
    });
  }

  async createChart() {
    if (this.myChart && this.myChart.nativeElement) {
      const ctx = this.myChart.nativeElement.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2024', '2025', '2026', '2027'], // Puedes ajustar las etiquetas según tus necesidades
            datasets: [{
              label: 'Predicción de Precio',
              data: [], // Inicialmente vacío
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } else {
        console.error('No se pudo obtener el contexto del canvas');
      }
    } else {
      console.error('No se pudo encontrar el elemento canvas');
    }
  }
  updateChart(prediccion: number) {
    if (this.chart) {
      this.chart.data.datasets[0].data.push(prediccion);
      this.chart.update();
    } else {
      console.error('El gráfico no está inicializado');
    }
  }



}






