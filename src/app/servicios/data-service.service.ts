import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GlobalDataService } from './global-data.service';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  //apiMatch = 'http://127.0.0.1:5000/';
  apiMatch = 'https://api-match-inmobiliario.onrender.com/';
  apiViviendasUrl = '../../assets/Data/viviendas.json';
  apiImagenesUrl = '../../assets/Data/imagenes.json';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      "Access-Control-Allow-Headers": "Content-Type"
    })
  };
  constructor( private http: HttpClient, private datosGlobales: GlobalDataService) { }

  // esta funcion es para buscar en el SearchBar
  getViviendaSearch(){
    const url = this.apiMatch + 'favoritos';
    const params = new HttpParams()
      .set('usuario', this.datosGlobales.userGlobal)
      .set('lat', this.datosGlobales.lat.toString())
      .set('lon', this.datosGlobales.lon.toString());
    return this.http.get<any[]>(url, {params});
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

  /*METODO ANTIGUO
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
  }*/

  getViviendasCercanas(lat: number, lon: number): Observable<any> {
    const url = this.apiMatch + 'viviendas_cercanas';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
        const params = new HttpParams()
          .set('lat', lat.toString())
          .set('lon', lon.toString())
        return this.http.get<any>(url, {params});
      })
    );
  }

  getMatches(): Observable<any> {
    const url = this.apiMatch + 'get_matches';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
      const params = new HttpParams()
      .set('usuario', this.datosGlobales.userGlobal) //TODO: cambiar a this.datosGlobales.preferencias.usuario
      .set('lat', this.datosGlobales.lat.toString())
      .set('lon', this.datosGlobales.lon.toString());
      return this.http.get<any>(url, {params});
    })
    );
  }

  updateMatch(id_match: string): Observable<any> {
    const url = this.apiMatch + 'marcar_visto';
    const params = new HttpParams().set('id_match', id_match);
    return this.http.get<any>(url, {params});
  }

  getViviendasFavoritos(): Observable<any[]> {
    const url = this.apiMatch + 'favoritos';
    const params = new HttpParams()
      .set('usuario', this.datosGlobales.userGlobal)
      .set('lat', this.datosGlobales.lat.toString())
      .set('lon', this.datosGlobales.lon.toString());
    return this.http.get<any[]>(url, {params});
  }

  guardarFavoritos(obj:any): Observable<any> {
    const url = this.apiMatch + 'favoritos';
    const postData = {
      id_vivienda: obj.id_vivienda,
      usuario: obj.usuario
    };
    return this.http.post<any>(url, postData);
  }
  /*
  guardarFavoritos(id: any): Observable<any> {
    const url = this.apiMatch + 'favoritos';
    const params = new HttpParams().set('id_vivienda', id);
    return this.http.post<any>(url, {params});
  } */
  /*
    guardarFavoritos(obj:any): Observable<any> {
      const url = this.apiMatch + 'favoritos';
      const params = new HttpParams().set('id_vivienda', obj.id_vivienda).set('id_usuario', obj.id_usuario).set('fecha_guardado', obj.fecha_guardado);
      return this.http.post<any>(url, {params});
    }
  */



  /*
  guardarFavoritos(): Observable<any> {
    const url = this.apiMatch + 'favoritos';
    return this.http.post<any>(url, this.httpOptions);
  }
  */
}
