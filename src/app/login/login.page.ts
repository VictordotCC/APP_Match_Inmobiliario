import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { AlertController, NavController} from '@ionic/angular';
import { GlobalDataService } from '../servicios/global-data.service';
import { IonSegment } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { TabsPage } from '../tabs/tabs.page';
import { DataServiceService } from '../servicios/data-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit{

  @ViewChild(IonSegment) segment!: IonSegment;

  logueado = false;
  formularioLogin: FormGroup;
  tipoUsuario: string = 'Comprador';

  constructor(
    //private api: ApiService,
    public fb: FormBuilder, public alertController: AlertController,private router: Router,
    private datosGlobales: GlobalDataService,
    private appComponent: AppComponent,
    public navCtrl: NavController,
    private apiCon: DataServiceService
  ) {

    this.formularioLogin = this.fb.group({
      'correo': new FormControl("test@test.cl", [Validators.required, Validators.email]), /*eliminar el valor por defecto*/
      'contrasena': new FormControl("Aa12341234", Validators.required), /*eliminar el valor por defecto*/
    });

  }

  ngOnInit(){
    //TODO: Implementar autologin
  }

  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }

  navigateToRecuperarContrasena() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  segmentChanged( event: any){
    const valorSegmento = event.detail.value;
    this.tipoUsuario = valorSegmento;
    console.log('tipo usuario',this.tipoUsuario);
  }


  get correo(){
    return this.formularioLogin.get('correo') as FormControl;
  }

  get contrasena(){
    return this.formularioLogin.get('contrasena') as FormControl;
  }

  /* Función para realizar algo al hacer click en el botón de ingresar */

  async ingresar(){
    var f = this.formularioLogin.value;
    var usuario = {correo:f.correo, contrasena:f.contrasena};

    if (usuario.correo == null){
      const alert = await this.alertController.create({
        header: 'Error de logueo',
        message: 'Debe ingresar valores validos',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarFormulario();
    }
    this.apiCon.loginUsuario(usuario).subscribe(async (data: any) => {
      console.log(data);
      if (data.status == 200){
        //this.datosGlobales.preferencias.usuario = usuario.correo;
        const alert = await this.alertController.create({
          header: 'Bienvenido '+ data.user.nombres+' '+data.user.apellidos,
          message: 'Acceso Autorizado',
          buttons: ['Aceptar']
        });
        await alert.present();
        //TODO Guardar el token de acceso en el local storage
        //TODO: Eliminar lo que sigue
        this.datosGlobales.userGlobal = usuario.correo;
        this.datosGlobales.userTipoGlobal = this.tipoUsuario;
        this.datosGlobales.userNombreGlobal = data.user.nombres;
        this.datosGlobales.userApellidoGlobal = data.user.apellidos;
        this.datosGlobales.userTelefonoGlobal = data.user.telefono;
        this.datosGlobales.activoGlobal = data.user.activo;
        this.datosGlobales.linksContactoGlobal = data.user.links_contacto;
        this.datosGlobales.imgGlobal = data.user.imagen;
        this.datosGlobales.access_token = data.access_token;
        this.datosGlobales.refresh_token = data.refresh_token;
        //HASTA ACÁ
        this.navCtrl.navigateForward(['/tabs']);
      } else if (data.status == 401){
        const alert = await this.alertController.create({
          header: 'Error de logueo',
          message: 'El usuario no existe o la contraseña es incorrecta',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.limpiarFormulario();
      }
    });

  }
  /* función para limpiar los campos en el formulario */
  limpiarFormulario(){
    this.formularioLogin.reset();
  }
}




