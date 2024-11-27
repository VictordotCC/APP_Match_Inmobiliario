import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DataServiceService } from '../servicios/data-service.service';

@Component({
  selector: 'app-darse-alta',
  templateUrl: './darse-alta.page.html',
  styleUrls: ['./darse-alta.page.scss'],
})
export class DarseAltaPage implements OnInit {

  formularioAlta: FormGroup;

  constructor(private fb: FormBuilder, private alertController: AlertController, 
    private apiCon: DataServiceService) {
    this.formularioAlta = this.fb.group({
      'correo': new FormControl('', [Validators.required, Validators.email])
   });
  }

  ngOnInit() {
  }

  async recuperarCuenta(){
    const correo = this.formularioAlta.value.correo;
    const alert = await this.alertController.create({
      header: 'Recuperar Cuenta',
      message: 'Si el correo ingresado es válido, recibirá un correo con un las instrucciones para recuperar su cuenta.',
      buttons: ['OK']
    });
    await alert.present();
    this.apiCon.darAlta(correo).subscribe((data) => {
      console.log(data);
    });
  }

}
