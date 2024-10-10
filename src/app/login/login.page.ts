import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController} from '@ionic/angular';
import { GlobalDataService } from '../servicios/global-data.service';
import { IonSegment } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit{

  @ViewChild(IonSegment) segment!: IonSegment;

  logueado = false;
  formularioLogin: FormGroup;
  constructor(
    //private api: ApiService,
    public fb: FormBuilder, public alertController: AlertController,private router: Router,
    private datosGlobales: GlobalDataService

  ) {

    this.formularioLogin = this.fb.group({
      'correo': new FormControl("abc@def.com", [Validators.required, Validators.email]), /*eliminar el valor por defecto*/
      'contrasena': new FormControl("1234", Validators.required), /*eliminar el valor por defecto*/
    });

  }

  ngOnInit(){
    
  }

  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }

  navigateToRecuperarContrasena() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  segmentChanged( event: any){
    const valorSegmento = event.detail.value;

  }


  get correo(){
    return this.formularioLogin.get('correo') as FormControl;
  }

  get contrasena(){
    return this.formularioLogin.get('contrasena') as FormControl;
  }

  /* Función para realizar algo al hacer click en el botón de ingresar */

  async ingresar(){
    var userGlobal = this.datosGlobales.userGlobal;
    var passGlobal = this.datosGlobales.passGlobal;
    var userCompletoGlobal = {nombre: userGlobal, clave: passGlobal}
    var f = this.formularioLogin.value;
    var usuario = {nombre:f.correo, clave:f.contrasena};

    if (usuario.nombre == null){
      const alert = await this.alertController.create({
        header: 'Error de logueo',
        message: 'Debe ingresar valores validos',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarFormulario();
    }
    if (JSON.stringify(usuario) == JSON.stringify(userCompletoGlobal)){
          const alert = await this.alertController.create({
            header: 'Bienvenido '+ userGlobal,
            message: 'Acceso Autorizado',
            buttons: ['Aceptar']
          });
          await alert.present();
          this.router.navigate(['/tabs']);

        }
    if (usuario.nombre != userGlobal && usuario.clave != passGlobal ){
        const alert = await this.alertController.create({
            header: 'Usuario',
            message: 'El usuario no existe',
            buttons: ['Aceptar']
            });
            await alert.present();
            this.limpiarFormulario();

        }

  }
  /* función para limpiar los campos en el formulario */
  limpiarFormulario(){
    this.formularioLogin.reset();
  }
  /* Falta implementar tokens y mantenció de sesión */
}




