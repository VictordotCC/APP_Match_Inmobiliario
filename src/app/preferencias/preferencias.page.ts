import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GlobalDataService } from '../servicios/global-data.service';
import { StorageService } from '../servicios/storage.service';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {
  user: string = '';
  pass: string = '';
  tipo: string = '';
  nombre: string = '';
  apellido: string = '';
  fotoPerfil: string = '';
  
  constructor(private alertController: AlertController, private navController: NavController, private route: ActivatedRoute,
    private datosGlobales: GlobalDataService, private storage: StorageService) { }


  async ngOnInit() {
    await this.storage.init();
    this.user = await this.storage.get('userGlobal');
    this.tipo = await this.storage.get('userTipoGlobal');
    this.nombre = await this.storage.get('userNombreGlobal');
    this.apellido = await this.storage.get('userApellidoGlobal');
    this.fotoPerfil = await this.storage.get('imgGlobal');
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

  async cerrarSesion(){
    await this.storage.clear();
    this.showAlert();
  }

}
