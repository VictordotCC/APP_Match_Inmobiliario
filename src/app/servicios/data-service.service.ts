import { AppModule } from './../app.module';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {


  constructor( private http: HttpClient) { }

  // para utilizar este Json y propbar datos en la vista del TAb2 (favoritos)
  getVivivendas(): Observable<any> {
    return this.http.get('/src/assets/data/viviendas.json');
  }

  getImagenes(): Observable<any> {
    return this.http.get('/src/assets/data/imagenes.json');
  }

}
