import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { GlobalDataService } from './global-data.service';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  apiML ='http://127.0.0.1:5050/'
  apiMatch = 'http://127.0.0.1:5000/';
  //apiMatch = 'https://api-match-inmobiliario.onrender.com/';
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
  constructor( private http: HttpClient, private datosGlobales: GlobalDataService, private storage: StorageService) { }

  // esta funcion es para buscar en el SearchBar
  getViviendaSearch(){
    const url = this.apiMatch + 'favoritos';
    const params = new HttpParams()
      .set('usuario', this.datosGlobales.userGlobal!)
      .set('lat', this.datosGlobales.lat.toString())
      .set('lon', this.datosGlobales.lon.toString());
    return this.http.get<any[]>(url, {params});
    //return this.http.get(this.apiViviendasUrl);
  }

  //API QUERYS
  refreshToken(): Observable<any> {
    const refresh_token = this.storage.get('refresh_token').then((val) => {
      return val;
    });
    const url = this.apiMatch + 'refresh';
    const postData = {
      refresh_token: refresh_token
    };
    return this.http.post<any>(url, postData).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  getVivienda(id: string, access_token: string): Observable<any> {
    const url = this.apiMatch + 'viviendas';
    const params = new HttpParams().set('id_vivienda', id);
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.get<any>(url, {params, headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  getViviendasApi(preferencias: any, access_token: string): Observable<any> {
    const url = this.apiMatch + 'viviendas';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
        const postData = {
          preferencias: preferencias,
          ubicacion: ubicacionValor
        };
        const auth = 'Bearer ' + access_token;
        const headers = new HttpHeaders({
          'Authorization': auth
        });
        return this.http.post<any>(url, postData, {headers: headers}).pipe(
          catchError(err => {
            return err;
          })
        );
      })
    );
  }

  getViviendasCercanas(lat: number, lon: number, access_token: string): Observable<any> {
    const url = this.apiMatch + 'viviendas_cercanas';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
        const params = new HttpParams()
          .set('lat', lat.toString())
          .set('lon', lon.toString());
        const auth = 'Bearer ' + access_token;
        const headers = new HttpHeaders({
          'Authorization': auth
        });
        return this.http.get<any>(url, {params, headers}).pipe(
          catchError(err => {
            return err;
          })
        );
      })
    );
  }

  getMatches(usuario: string, access_token: string): Observable<any> {
    const url = this.apiMatch + 'get_matches';
    return this.datosGlobales.ubicacion$.pipe(
      switchMap(ubicacionValor => {
      const params = new HttpParams()
      .set('usuario', usuario) //TODO: cambiar a this.datosGlobales.preferencias.usuario
      .set('lat', this.datosGlobales.lat.toString())
      .set('lon', this.datosGlobales.lon.toString());
      const auth = 'Bearer ' + access_token;
      const headers = new HttpHeaders({
        'Authorization': auth
      });
      return this.http.get<any>(url, {params, headers}).pipe(
        catchError(err => {
          return err;
        })
      );
    })
    );
  }

  updateMatch(id_match: string, access_token: string): Observable<any> {
    const url = this.apiMatch + 'marcar_visto';
    const params = new HttpParams().set('id_match', id_match);
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.get<any>(url, {params, headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  deleteMatches(usuario: string, access_token: string): Observable<any> {
    const url = this.apiMatch + 'delete_matches';
    const params = new HttpParams().set('usuario', usuario);
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.request('DELETE', url, {params, headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  getViviendasFavoritos(usuario: string, access_token: string): Observable<any[]> {
    const url = this.apiMatch + 'favoritos';
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('lat', this.datosGlobales.lat.toString())
      .set('lon', this.datosGlobales.lon.toString());
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.get<any[]>(url, {params, headers});
  }

  //Guardar Viviendas
  postVivienda(vivienda: any, access_token: string): Observable<any> {
    const url = this.apiMatch + 'viviendas';
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.post<any>(url, vivienda, {headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }


  guardarFavoritos(obj:any, access_token: string): Observable<any> {
    const url = this.apiMatch + 'favoritos';
    const postData = {
      id_vivienda: obj.id_vivienda,
      usuario: obj.usuario
    };
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.post<any>(url, postData, {headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  borrarFavorito(obj:any, access_token: string): Observable<any> {
    const url = this.apiMatch + 'favoritos';
    const postData = {
      id_vivienda: obj.id_vivienda,
      usuario: obj.usuario
    };
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.request('DELETE', url, {body: postData, headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  obtenerPreferencias(access_token: string): Observable<any> {
    const url = this.apiMatch + 'preferencia';
    const params = new HttpParams().set('correo', this.datosGlobales.userGlobal!);
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.get<any>(url, {params, headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  guardarPreferencias(obj:any, access_token: string): Observable<any> {
    const url = this.apiMatch + 'preferencia';
    const postData = {
      correo: obj.usuario,
      preferencias: obj
    };
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.post<any>(url, postData, {headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }


  //ZONA DE USUARIOS
  getUser(user: string): Observable<any> {
    const url = this.apiMatch + 'usuario';
    const params = new HttpParams().set('usuario', user);
    return this.http.get<any>(url, {params});
  }

  registrarUsuario(obj:any): Observable<any> {
    const url = this.apiMatch + 'registro';
    const postData = {
      contrasena: obj.contrasena,
      nombres: obj.nombres,
      apellidos: obj.apellidos,
      telefono: obj.telefono,
      correo: obj.correo
    };
    return this.http.post<any>(url, postData);

  }

  loginUsuario(obj:any): Observable<any> {
    const url = this.apiMatch + 'login';
    const postData = {
      correo: obj.correo,
      contrasena: obj.contrasena
    };
    return this.http.post<any>(url, postData).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  autoLogin(access_token: string, refresh_token: string, user_id: string): Observable<any> {
    const url = this.apiMatch + 'auto-login';
    const postData = {
      refresh_token: refresh_token,
      user_id: user_id
    };
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.post<any>(url, postData, {headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }

  recuperarContrasena(correo: string): Observable<any> {
    const url = this.apiMatch + 'recuperar';
    const params = new HttpParams().set('correo', correo);
    return this.http.get<any>(url, {params});
  }

  verificarTokenRecuperacion(correo:string, token: string): Observable<any> {
    const url = this.apiMatch + 'verificar_recuperacion';
    const params = new HttpParams().set('correo', correo).set('token', token);
    return this.http.get<any>(url, {params});
  }

  cambiarContrasena(correo:string, contrasena: string): Observable<any> {
    const url = this.apiMatch + 'recuperar';
    const postData = {
      correo: correo,
      contrasena: contrasena
    };
    return this.http.post<any>(url, postData);
  }

  darAlta(correo: string): Observable<any> {
    const url = this.apiMatch + 'dar-alta';
    const params = new HttpParams().set('correo', correo);
    return this.http.get<any>(url, {params});
  }

  //ZONA DE IMAGENES
  //guardar imagenes
  getImagenes(id: string): Observable<any> {
    const url = this.apiMatch + 'imagenes';
    const params = new HttpParams().set('id_vivienda', id);
    return this.http.get<any>(url, {params});
  }

  postImagenes(obj:any, access_token:string): Observable<any> {
    const url = this.apiMatch + 'imagenes';
    const auth = 'Bearer ' + access_token;
    const headers = new HttpHeaders({
      'Authorization': auth
    });
    return this.http.post<any>(url, obj, {headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }
  //modelo machine learning
  getPrediccion(obj:any): Observable<any> {
    const url = this.apiML + 'predict';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data = [{
      "area_total": obj.area_total,
      "habitaciones": obj.habitaciones,
      "tipo_vivienda": obj.tipo_vivienda,
      "banos": obj.banos,
      "area_construida": obj.area_construida,
      "nom_comuna": 1,
      "nom_ciudad": 1,
      "nom_region": 1,
      "nom_vecindario": obj.nom_vecindario,
      }];
    return this.http.post<any[]>(url, data, {headers: headers}).pipe(
      catchError(err => {
        return err;
      })
    );
  }


}
