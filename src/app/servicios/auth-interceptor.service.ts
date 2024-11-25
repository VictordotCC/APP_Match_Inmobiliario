import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DataServiceService } from './data-service.service';
import { StorageService } from './storage.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private apiCon: DataServiceService, private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expirado, intenta refrescar el token
          return this.apiCon.refreshToken().pipe(
            switchMap((newToken: any) => {
              // Actualiza el token en el almacenamiento
              this.storage.set('access_token', newToken.access_token);
              this.storage.set('refresh_token', newToken.refresh_token);
              // Clona la solicitud original y agrega el nuevo token
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken.access_token}`
                }
              });
              // Reintenta la solicitud con el nuevo token
              return next.handle(clonedRequest);
            }),
            catchError((refreshError) => {
              // Si el refresco del token falla, redirige al usuario a la página de inicio de sesión
              this.storage.clear();
              return throwError(refreshError);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}