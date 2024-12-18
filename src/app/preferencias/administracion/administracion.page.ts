import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DataServiceService } from 'src/app/servicios/data-service.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {
  user: string = '';
  pass: string = '';
  tipo: string = '';
  nombre: string = '';
  apellido: string = '';
  fotoPerfil: string = '';
  telefono: string = '';
  formularioAdmin : FormGroup;
  formularioCambio: FormGroup;
  validation_messages :any;
  access_token: string = '';

  constructor(private storage: StorageService, private apiCon: DataServiceService, 
    private fb: FormBuilder, private alertController: AlertController, private router: Router) {
    
      this.formularioAdmin = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      apellido: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
     });

     this.formularioCambio = this.fb.group({
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

  async ngOnInit() {
    await this.storage.init();
    this.access_token = await this.storage.get('access_token');
    this.user = await this.storage.get('userGlobal');
    this.tipo = await this.storage.get('userTipoGlobal');
    this.nombre = await this.storage.get('userNombreGlobal');
    this.apellido = await this.storage.get('userApellidoGlobal');
    this.fotoPerfil = await this.storage.get('imgGlobal');
    this.telefono = await this.storage.get('userTelefonoGlobal');

    this.formularioAdmin.patchValue({
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono
    });
  }

  actualizarDatos(){
    //TODO: implementar
  }

  cambiarContrasena(){
    //TODO: implementar
  }

  async darBaja(){
    const alert = await this.alertController.create({
      header: 'Dar de baja',
      message: '¿Está seguro que desea darse de baja?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Aceptar',
          handler: () => {
            this.apiCon.darBaja(this.access_token, this.user).subscribe(async (data) => {
              this.storage.clear();
              const alert = await this.alertController.create({
                header: 'Baja',
                message: 'Se ha dado de baja correctamente',
                buttons: ['Aceptar']
              });
              await alert.present();
              this.router.navigate(['/login']);
          });
        }
      }
      ]
    });
    await alert.present();
  }
}

