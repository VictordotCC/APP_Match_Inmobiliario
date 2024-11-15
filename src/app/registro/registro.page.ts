import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataServiceService } from '../servicios/data-service.service';
import { CorreoValidator } from '../validators/correo.validator';
import { PasswordValidator } from '../validators/password.validator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;
  validation_messages: any;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    private dataService: DataServiceService
  ) {
    this.formularioRegistro = this.fb.group({
      'correo': new FormControl("", {
        validators: [Validators.required, Validators.email],
        asyncValidators: [CorreoValidator.correoUnico(this.dataService)],
        updateOn: 'blur'
      }),
      'nombres': new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'apellidos': new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'telefono': new FormControl("56", [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      'contrasena': new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]),
      'repContrasena': new FormControl("", {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      'terms': new FormControl(false, Validators.requiredTrue)
    }, {
      validators: PasswordValidator.areEqual
    });

    this.validation_messages = {
      'correo': [
        { type: 'required', message: 'Debe ingresar un correo' },
        { type: 'email', message: 'Correo no válido' },
        { type: 'correoUnico', message: 'Correo ya registrado' }
      ],
      'nombres': [
        { type: 'required', message: 'Debe ingresar su nombre' },
        { type: 'pattern', message: 'Nombre no válido' }
      ],
      'apellidos': [
        { type: 'required', message: 'Debe ingresar su apellido' },
        { type: 'pattern', message: 'Apellido no válido' }
      ],
      'telefono': [
        { type: 'required', message: 'Un número telefónico es necesario' },
        { type: 'maxlength', message: 'Teléfono no válido' },
        { type: 'minlength', message: 'El largo debe ser de 11 números' }
      ],
      'contrasena': [
        { type: 'required', message: 'Debe indicar una contraseña' },
        { type: 'minlength', message: 'Contraseña debe tener al menos 8 caracteres' },
        { type: 'pattern', message: 'Contraseña debe tener al menos una mayúscula, una minúscula y un número' }
      ],
      'repContrasena': [
        { type: 'required', message: 'Debe repetir la contraseña' },
        { type: 'areEqual', message: 'Las contraseñas no coinciden' }
      ],
      'terms': [
        { type: 'requiredTrue', message: 'Debe aceptar los términos y condiciones' }
      ]
    };
  }

  ngOnInit() {
  }

  async registrarse() {
    // TODO: implementar la lógica para registrar al usuario
    console.log(this.formularioRegistro.value);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registro',
      message: 'Registro exitoso',
      buttons: ['OK']
    });

    await alert.present();
    this.router.navigate(['/login']);
  }
}
