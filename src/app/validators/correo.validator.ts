import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { DataServiceService } from "../servicios/data-service.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class CorreoValidator {
  static correoUnico(dataService: DataServiceService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return dataService.getUser(control.value).pipe(
        map(data => {
          return data.length > 0 ? { correoUnico: true } : null;
        })
      );
    };
  }
}