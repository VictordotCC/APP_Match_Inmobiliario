import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GlobalDataService } from '../servicios/global-data.service';
@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {
  constructor(private alertController: AlertController, private navController: NavController, private route: ActivatedRoute,
    private datosGlobales: GlobalDataService) { }
  user: string = '';
  pass: string = '';
  tipo: string = '';
  nombre: string = '';
  apellido: string = '';
  fotoPerfil: string = '';

  ngOnInit() {
    /*
    this.route.queryParams.subscribe(params => { //Recibe los parametros de la URL y que se envian desde la pagina anterior
      this.user = params['user'];
      this.pass = params['pass'];
      this.tipo = params['tipo'];
      console.log('User:', this.user);
      console.log('Pass:', this.pass);
      console.log('Tipo:', this.tipo);
    });
    */
    this.user = this.datosGlobales.userGlobal!; //correo global
    //this.pass = this.datosGlobales.passGlobal;
    this.tipo = this.datosGlobales.userTipoGlobal;
    this.nombre = this.datosGlobales.userNombreGlobal;
    this.apellido = this.datosGlobales.userApellidoGlobal;
    this.fotoPerfil = this.datosGlobales.imgGlobal;
    console.log('User:', this.user);
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Salida',
      message: '¡Vuelva pronto!',
      buttons: ['OK']
    });
    await alert.present();
  }

  cerrarSesion(){
    this.showAlert();
  }

}
