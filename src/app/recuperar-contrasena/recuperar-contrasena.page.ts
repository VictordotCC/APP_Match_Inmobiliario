import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataServiceService } from '../servicios/data-service.service';
import { AlertController } from '@ionic/angular';
import { PasswordValidator } from '../validators/password.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

  formularioRC: FormGroup;
  formularioNC: FormGroup;
  validation_messages :any;

  constructor(private fb: FormBuilder, private apiCon: DataServiceService, 
    private alertController: AlertController, private router: Router) {
    this.formularioRC = this.fb.group({
      'correo': new FormControl('', [Validators.required, Validators.email]),
      'token': new FormControl('')
    });
    this.formularioNC = this.fb.group({
      'contrasena': new FormControl('', [Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]),
      'repContrasena': new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
    }, {
      validator: PasswordValidator.areEqual
    });

    this.validation_messages = {
      'contrasena': [
        { type: 'required', message: 'Debe indicar una contraseña' },
        { type: 'minlength', message: 'Contraseña debe tener al menos 8 caracteres' },
        { type: 'pattern', message: 'Contraseña debe tener al menos una mayúscula, una minúscula y un número' }
      ],
      'repContrasena': [
        { type: 'required', message: 'Debe repetir la contraseña' },
        { type: 'areEqual', message: 'Las contraseñas no coinciden' }
      ]
    };
  }

  ngOnInit() {
  }

  async enviarCorreoRC() {
    const correo = this.formularioRC.value.correo;
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Si el correo ingresado es válido, recibirá un correo con un token para recuperar su contraseña.',
      buttons: ['OK']
    });
    await alert.present();
    this.formularioRC.patchValue({ token: '' });
    this.apiCon.recuperarContrasena(correo).subscribe((data) => {
      if (data['status'] == 200){
        document.getElementById('bRecuperar')!.setAttribute('disabled', 'false');
      }
    });
  }

  verificarTokenContrasena() {
    const correo = this.formularioRC.value.correo;
    const token = this.formularioRC.value.token;
    this.apiCon.verificarTokenRecuperacion(correo, token).subscribe(async (data) => {
      if (data['status'] == 200){
        document.getElementById('bRecuperar')!.setAttribute('disabled', 'true');
        document.getElementById('bEnviar')!.setAttribute('disabled', 'true');
        document.getElementById('recovery')!.style.display = 'block';
      } else {
        const alert = await this.alertController.create({
          header: 'Recuperar Contraseña',
          message: 'El token ingresado no es válido.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  cambiarContrasena() {
    const correo = this.formularioRC.value.correo;
    const contrasena = this.formularioNC.value.contrasena;
    this.apiCon.cambiarContrasena(correo, contrasena).subscribe(async (data) => {
      if (data['status'] == 200){
        const alert = await this.alertController.create({
          header: 'Recuperar Contraseña',
          message: 'Contraseña cambiada exitosamente.',
          buttons: ['OK']
        });
        await alert.present();
        this.formularioRC.reset();
        this.formularioNC.reset();
        this.router.navigate(['/login']);
      } else {
        const alert = await this.alertController.create({
          header: 'Recuperar Contraseña',
          message: 'No es posible cambiar la contraseña, por favor verifique el correo ingresado.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
