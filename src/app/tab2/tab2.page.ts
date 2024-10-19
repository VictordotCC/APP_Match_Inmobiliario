import { DataServiceService } from './../servicios/data-service.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { Observable, of } from 'rxjs';
//import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
  filteredViviendas!: Observable<any>;

  constructor(
    private DataService: DataServiceService) {}
  ngOnInit() {
    /* // esta es la forma de obtener los datos de la api
    this.DataServiceService.getVivivendas().subscribe((data: any) => {
      console.log(data);
    }); */
    this.viviendas = this.DataService.getVivivendas();
    this.imagenes = this.DataService.getImagenes();
    this.filteredViviendas = this.viviendas;
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
    const selectedValue = event.detail.value;
    this.filteredViviendas = this.viviendas.pipe(
      map((viviendas: any[]) => {
        if (selectedValue === 'Todos') {
          return viviendas;
        } else {
          return viviendas.filter((vivienda: any) => vivienda.type === selectedValue);
        }
      })
    );
  }


}
