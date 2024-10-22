import { DataServiceService } from './../servicios/data-service.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild(IonSegment) segmento1!: IonSegment;
  @ViewChild(IonSegment) segmento2!: IonSegment;

  viviendas!: Observable<any>;
  imagenes!: Observable<any>;
  serchVar: any[] = []; // variable para buscar en el SearchBar
  textoBuscar = "";

  constructor(private DataService: DataServiceService) {}

  ngOnInit() {
    /* // esta es la forma de obtener los datos de la api */

    this.viviendas = this.DataService.getViviendas();
    this.imagenes = this.DataService.getImagenes();

    this.DataService.getViviendaSearch().subscribe( serchVar => {
      console.log(serchVar);
      this.serchVar = serchVar;
     });
  }

  segmentPrecMtsHab(event: CustomEvent){
    const valorSegment1 = event.detail.value;
    console.log(valorSegment1);
  }
  segmentVentArriendo(event: CustomEvent){
    const valorSegment2 = event.detail.value;
    console.log(valorSegment2);
  }

  segmentChanged(event: CustomEvent) {
    const valorSegment = event.detail.value;
    return valorSegment;
    /*
    if(valorSegment === 'Todos'){
      this.filteredViviendas = this.viviendas;
      return;
    }
      */
  }

  buscar( event: any){
    //const texto = event.detail.value;
    console.log(this.textoBuscar);
    this.textoBuscar = event.detail.value;
  }

}


  // datos de prueba



