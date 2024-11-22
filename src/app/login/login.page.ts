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
        this.apiCon.obtenerPreferencias().subscribe((data: any) => {
          this.datosGlobales.preferencias.usuario = this.datosGlobales.userGlobal;
          this.datosGlobales.preferencias.busqueda_automatica = data.preferencias.busqueda_automatica;
          this.datosGlobales.preferencias.distancia = data.preferencias.distancia;
          this.datosGlobales.preferencias.tipo_operacion = data.preferencias.tipo_operacion;
          this.datosGlobales.preferencias.tipo_vivienda = data.preferencias.tipo_vivienda;
          this.datosGlobales.preferencias.condicion = data.preferencias.condicion;
          this.datosGlobales.preferencias.area_total = data.preferencias.area_total;
          this.datosGlobales.preferencias.pisos = data.preferencias.pisos;
          this.datosGlobales.preferencias.area_construida = data.preferencias.area_construida
          this.datosGlobales.preferencias.antiguedad = data.preferencias.antiguedad;
          this.datosGlobales.preferencias.tipo_valor = data.preferencias.tipo_valor;
          this.datosGlobales.preferencias.precio_minimo = data.preferencias.precio_minimo;
          this.datosGlobales.preferencias.precio_maximo = data.preferencias.precio_maximo;
          this.datosGlobales.preferencias.tipo_subsidio = data.preferencias.tipo_subsidio;
          this.datosGlobales.preferencias.habitaciones = data.preferencias.habitaciones;
          this.datosGlobales.preferencias.banos = data.preferencias.banos;
          this.datosGlobales.preferencias.estaciona = data.preferencias.estaciona;
          this.datosGlobales.preferencias.bodega = data.preferencias.bodega;
          this.datosGlobales.preferencias.contactado = data.preferencias.contactado;
          this.datosGlobales.preferencias.notificaciones = data.preferencias.notificaciones;
          this.router.navigate(['/tabs']);
        });
        //this.navCtrl.navigateForward(['/tabs']);
      } else if (data.status == 401){
        const alert = await this.alertController.create({
          header: 'Error de logueo',
          message: 'El usuario no existe o la contraseña es incorrecta',
          buttons: ['Aceptar']
        });
        await alert.present();
        //this.limpiarFormulario();
      }
      //this.limpiarFormulario();
    },
    async (error) => {
      const alert = await this.alertController.create({
        header: 'Error de logueo',
        message: 'Error en la conexión',
        buttons: ['Aceptar']
      });
      await alert.present();
      //this.limpiarFormulario();
    }
    );
  }
  /* función para limpiar los campos en el formulario */
  limpiarFormulario(){
    this.formularioLogin.reset();
  }
}




