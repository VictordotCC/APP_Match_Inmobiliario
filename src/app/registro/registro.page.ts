import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController,private router: Router) {
    this.formularioRegistro = this.fb.group({
      'correo': new FormControl("", [Validators.required, Validators.email]),
      'nombres': new FormControl("", Validators.required),
      'apellidos': new FormControl("", Validators.required),
      'telefono': new FormControl("", Validators.required),
      'contrasena': new FormControl("", Validators.required),
      'repContrasena': new FormControl("", Validators.required),
  });
  }

  ngOnInit() {
  }

  async registrarse(){
    //TODO: implementar la lógica para registrar al usuario
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
