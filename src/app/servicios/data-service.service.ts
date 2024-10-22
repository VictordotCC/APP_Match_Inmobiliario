import { AppModule } from './../app.module';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  apiViviendasUrl = '../../assets/Data/viviendas.json';
  apiImagenesUrl = '../../assets/Data/imagenes.json';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  constructor( private http: HttpClient) { }

  getViviendas(){
    return this.http.get(this.apiViviendasUrl, this.httpOptions);
    //return this.http.get(this.apiViviendasUrl);
  }
  getImagenes(){
    return this.http.get(this.apiImagenesUrl, this.httpOptions);
    //return this.http.get(this.apiImagenesUrl);
  }
  // esta funcion es para buscar en el SearchBar
  getViviendaSearch(){
    return this.http.get<any[]>(this.apiViviendasUrl, this.httpOptions);
    //return this.http.get(this.apiViviendasUrl);
  }


}
