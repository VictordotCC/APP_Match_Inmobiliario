import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GlobalDataService } from './global-data.service';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  apiMatch = 'http://localhost:5000/';
  apiViviendasUrl = '../../assets/Data/viviendas.json';
  apiImagenesUrl = '../../assets/Data/imagenes.json';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor( private http: HttpClient, private datosGlobales: GlobalDataService) { }

  getViviendas(){ //Eliminar este metodo//
    return this.http.get(this.apiViviendasUrl, this.httpOptions);
    //return this.http.get(this.apiViviendasUrl);
  }
  getImagenes(){ //Eliminar este metodo//
    return this.http.get(this.apiImagenesUrl, this.httpOptions);
    //return this.http.get(this.apiImagenesUrl);
  }
  // esta funcion es para buscar en el SearchBar
  getViviendaSearch(){
    return this.http.get<any[]>(this.apiViviendasUrl, this.httpOptions);
    //return this.http.get(this.apiViviendasUrl);
  }

  //API GETS
  getVivienda(id: string): Observable<any> {
    const url = this.apiMatch + 'viviendas';
    const params = new HttpParams().set('id_vivienda', id);
    return this.http.get<any>(url, {params}); //TODO: Implementar interface
  }

  getViviendasApi(): Observable<any> {
    const url = this.apiMatch + 'viviendas';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
        const postData = {
          preferencias: this.datosGlobales.preferencias,
          ubicacion: ubicacionValor
        };
        return this.http.post<any>(url, postData, this.httpOptions);
      })
    );
    /*let ubicacionValor: any;
    this.datosGlobales.ubicacion$.subscribe((value => ubicacionValor = value));

    //Prepare Post Data with Preferencias de Usuario
    const postData = {
      preferencias: this.datosGlobales.preferencias,
      ubicacion: ubicacionValor
    };
    return this.http.post<any>(url, postData, this.httpOptions);*/
  }
}
