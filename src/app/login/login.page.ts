import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { AlertController, NavController} from '@ionic/angular';
import { GlobalDataService } from '../servicios/global-data.service';
import { IonSegment } from '@ionic/angular';
import { DataServiceService } from '../servicios/data-service.service';
import { StorageService } from '../servicios/storage.service';
import { PreferenciaUsuarioService } from '../servicios/preferencia-usuario.service';

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
  private access_token = '';
  private refresh_token = '';
  private user_id = '';

  constructor(
    //private api: ApiService,
    public fb: FormBuilder, public alertController: AlertController,private router: Router,
    private datosGlobales: GlobalDataService,
    public navCtrl: NavController,
    private apiCon: DataServiceService,
    private storage: StorageService,
    private preferencias: PreferenciaUsuarioService
  ) {

    this.formularioLogin = this.fb.group({
      'correo': new FormControl("test@test.cl", [Validators.required, Validators.email]), /*eliminar el valor por defecto*/
      'contrasena': new FormControl("Aa12341234", Validators.required), /*eliminar el valor por defecto*/
    });

  }
  
  async ngOnInit(){
    await this.storage.init();
    this.access_token = await this.storage.get('access_token');
    this.refresh_token = await this.storage.get('refresh_token');
    this.user_id = await this.storage.get('user_id');
    if (this.access_token != null && this.refresh_token != null && this.user_id != null){
      this.apiCon.autoLogin(this.access_token, this.refresh_token, this.user_id).subscribe(async (data: any) => {
        await this.storage.set('access_token', data.access_token);
        //Guarda el usuario en local storage
        this.storage.set('userGlobal', data.user.correo);
        this.storage.set('userTipoGlobal', this.tipoUsuario);
        this.storage.set('userNombreGlobal', data.user.nombres);
        this.storage.set('userApellidoGlobal', data.user.apellidos);
        this.storage.set('userTelefonoGlobal', data.user.telefono);
        this.storage.set('activoGlobal', data.user.activo);
        this.storage.set('linksContactoGlobal', data.user.links_contacto);
        this.storage.set('imgGlobal', data.user.imagen);
        //TODO: Eliminar lo que sigue al implementar lectura de usuario desde Storage
        this.datosGlobales.userGlobal = data.user.correo;
        this.datosGlobales.userTipoGlobal = this.tipoUsuario;
        this.datosGlobales.userNombreGlobal = data.user.nombres;
        this.datosGlobales.userApellidoGlobal = data.user.apellidos;
        this.datosGlobales.userTelefonoGlobal = data.user.telefono;
        this.datosGlobales.activoGlobal = data.user.activo;
        this.datosGlobales.linksContactoGlobal = data.user.links_contacto;
        this.datosGlobales.imgGlobal = data.user.imagen;

        this.apiCon.obtenerPreferencias(this.access_token).subscribe(async (data: any) => {
          //Guardar en local storage
          this.preferencias.usuario = this.datosGlobales.userGlobal;
          this.preferencias.busqueda_automatica = data.preferencias.busqueda_automatica;
          this.preferencias.distancia = data.preferencias.distancia;
          this.preferencias.tipo_operacion = data.preferencias.tipo_operacion;
          this.preferencias.tipo_vivienda = data.preferencias.tipo_vivienda;
          this.preferencias.condicion = data.preferencias.condicion;
          this.preferencias.area_total = data.preferencias.area_total;
          this.preferencias.pisos = data.preferencias.pisos;
          this.preferencias.area_construida = data.preferencias.area_construida
          this.preferencias.antiguedad = data.preferencias.antiguedad;
          this.preferencias.tipo_valor = data.preferencias.tipo_valor;
          this.preferencias.precio_minimo = data.preferencias.precio_minimo;
          this.preferencias.precio_maximo = data.preferencias.precio_maximo;
          this.preferencias.tipo_subsidio = data.preferencias.tipo_subsidio;
          this.preferencias.habitaciones = data.preferencias.habitaciones;
          this.preferencias.banos = data.preferencias.banos;
          this.preferencias.estaciona = data.preferencias.estaciona;
          this.preferencias.bodega = data.preferencias.bodega;
          this.preferencias.contactado = data.preferencias.contactado;
          this.preferencias.notificaciones = data.preferencias.notificaciones;
          await this.storage.set('preferencias', this.preferencias);
          const token = await this.storage.get('push_token');
          this.apiCon.saveToken(data.access_token, token ).subscribe(async (data: any) => {
            console.log('Token guardado');
          });
          this.router.navigate(['/tabs']);
        });
      });
    }
  }


  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }

  navigateToRecuperarContrasena() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  navigateToDarseAlta() {
    this.router.navigate(['/darse-alta']);
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
    const f = this.formularioLogin.value;
    const usuario = {correo:f.correo, contrasena:f.contrasena};

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
        this.storage.set('access_token', data.access_token);
        this.storage.set('refresh_token', data.refresh_token);
        this.storage.set('user_id', data.user.id);
        //Guarda el usuario en local storage
        this.storage.set('userGlobal', data.user.correo);
        this.storage.set('userTipoGlobal', this.tipoUsuario);
        this.storage.set('userNombreGlobal', data.user.nombres);
        this.storage.set('userApellidoGlobal', data.user.apellidos);
        this.storage.set('userTelefonoGlobal', data.user.telefono);
        this.storage.set('activoGlobal', data.user.activo);
        this.storage.set('linksContactoGlobal', data.user.links_contacto);
        this.storage.set('imgGlobal', data.user.imagen);
        //TODO: Eliminar lo que sigue al implementar lectura de usuario desde Storage
        this.datosGlobales.userGlobal = usuario.correo;
        this.datosGlobales.userTipoGlobal = this.tipoUsuario;
        this.datosGlobales.userNombreGlobal = data.user.nombres;
        this.datosGlobales.userApellidoGlobal = data.user.apellidos;
        this.datosGlobales.userTelefonoGlobal = data.user.telefono;
        this.datosGlobales.activoGlobal = data.user.activo;
        this.datosGlobales.linksContactoGlobal = data.user.links_contacto;
        this.datosGlobales.imgGlobal = data.user.imagen;
        //HASTA ACÁ
        this.access_token = data.access_token;
        this.apiCon.obtenerPreferencias(this.access_token).subscribe(async(data: any) => {
          //Guardar en local storage
          this.preferencias.usuario = this.datosGlobales.userGlobal;
          this.preferencias.busqueda_automatica = data.preferencias.busqueda_automatica;
          this.preferencias.distancia = data.preferencias.distancia;
          this.preferencias.tipo_operacion = data.preferencias.tipo_operacion;
          this.preferencias.tipo_vivienda = data.preferencias.tipo_vivienda;
          this.preferencias.condicion = data.preferencias.condicion;
          this.preferencias.area_total = data.preferencias.area_total;
          this.preferencias.pisos = data.preferencias.pisos;
          this.preferencias.area_construida = data.preferencias.area_construida
          this.preferencias.antiguedad = data.preferencias.antiguedad;
          this.preferencias.tipo_valor = data.preferencias.tipo_valor;
          this.preferencias.precio_minimo = data.preferencias.precio_minimo;
          this.preferencias.precio_maximo = data.preferencias.precio_maximo;
          this.preferencias.tipo_subsidio = data.preferencias.tipo_subsidio;
          this.preferencias.habitaciones = data.preferencias.habitaciones;
          this.preferencias.banos = data.preferencias.banos;
          this.preferencias.estaciona = data.preferencias.estaciona;
          this.preferencias.bodega = data.preferencias.bodega;
          this.preferencias.contactado = data.preferencias.contactado;
          this.preferencias.notificaciones = data.preferencias.notificaciones;
          await this.storage.set('preferencias', this.preferencias);
          const token = await this.storage.get('push_token');
          this.apiCon.saveToken(data.access_token, token ).subscribe(async (data: any) => {
            console.log('Token guardado');
          });
          this.router.navigate(['/tabs']);
        });
        //this.navCtrl.navigateForward(['/tabs']);
      } else if (data.status == 401){
        console.log('usuario inactivo', data);
        if (data.activo == false){
          const alert = await this.alertController.create({
            header: 'Error de logueo',
            message: 'Usuario inactivo, Debe confirmar su correo',
            buttons: ['Aceptar']
          });
          await alert.present();
        } else {
        const alert = await this.alertController.create({
          header: 'Error de logueo',
          message: 'El usuario no existe o la contraseña es incorrecta',
          buttons: ['Aceptar']
        });
        await alert.present();
        //this.limpiarFormulario();
      }
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




