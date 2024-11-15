import { FormControl, FormGroup } from '@angular/forms';

export class PasswordValidator {
  static areEqual(formGroup: FormGroup) {
    const password = formGroup.get('contrasena')?.value;
    const confirmPassword = formGroup.get('repContrasena')?.value;

    if (password !== confirmPassword) {
      return { areEqual: true };
    }
    return null;
  }
}