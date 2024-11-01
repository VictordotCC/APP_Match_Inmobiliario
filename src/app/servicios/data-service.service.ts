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

  //API QUERYS
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
  }

  getViviendasCercanas(): Observable<any> {
    const url = this.apiMatch + 'viviendas_cercanas';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
        const params = new HttpParams()
          .set('lat', ubicacionValor.lat.toString())
          .set('lon', ubicacionValor.lon.toString())
        return this.http.get<any>(url, {params});
      })
    );
  }

  getMatches(): Observable<any> {
    const url = this.apiMatch + 'get_matches';
    const params = new HttpParams().set('usuario', this.datosGlobales.userGlobal); //TODO: cambiar a this.datosGlobales.preferencias.usuario
    return this.http.get<any>(url, {params});
  }

  updateMatch(id_match: string): Observable<any> {
    const url = this.apiMatch + 'marcar_visto';
    const params = new HttpParams().set('id_match', id_match);
    return this.http.get<any>(url, {params});
  }
}
