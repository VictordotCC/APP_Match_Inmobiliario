import { DataServiceService } from './../servicios/data-service.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { Observable} from 'rxjs';
import { GlobalDataService } from '../servicios/global-data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {

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

  constructor(private DataService: DataServiceService, private datosGlobales: GlobalDataService, private sanitizer: DomSanitizer) {
    this.dangerousUrl = this.viviendas[0]?.links_contacto || ''; // Ensure viviendas[0] exists
    this.trustedURL = sanitizer.bypassSecurityTrustUrl(this.dangerousUrl); // Correct property name
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
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

    if (this.inputUfmin > 0) {//(this.inputUfmin != null) { //filtro valor mínimo
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.precio_uf >= this.inputUfmin;
      });
    }
    if (this.inputUfmax > 0) { //(this.inputUfmax != null) {//filtro valor máximo
      filtered = filtered.filter((vivienda: any) => {
        return vivienda.precio_uf <= this.inputUfmax;
      });
    }
      this.filterViviendas = filtered;
  }

  buscar(event: any){
    this.textoBuscar = event.detail.value;
    this.applyFilters();
  }



  obtenerFavs(){
    this.DataService.getViviendasFavoritos().subscribe( data => {
      this.viviendas = data;
      this.filterViviendas = this.viviendas;
    });
  }

  formatString(str: string){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  openDetalle(vivienda: any){
    //this.idOpenDetalle = this.viviendas[0].id_vivienda;
    this.fotoCasa = JSON.parse(vivienda.links_contacto);
    this.detalleVivienda = vivienda;
    this.isModalOpen = true;

  }

  closeModal(){ // Add this method to close the modal
    this.isModalOpen = false;
  }
  closeModal2(){ // Add this method to close the modal
    this.isModalOpen2 = false;
  }

  filtroPrecio(){
    this.isModalOpen2 = true;
  }

  ingresoValorViviendaMin(e: Event){
    this.inputUfmin = parseFloat((e.target as HTMLInputElement).value);
  }
  ingresoValorViviendaMax(e: Event){
    this.inputUfmax = parseFloat((e.target as HTMLInputElement).value);
  }
  filtrarPrecio(){
    this.applyFilters();
    this.closeModal2();
  }
  limpiarFiltroPrecio(){
    this.inputUfmin = 0;
    this.inputUfmax = 0;
    this.applyFilters();
    //this.closeModal2();
  }


}






