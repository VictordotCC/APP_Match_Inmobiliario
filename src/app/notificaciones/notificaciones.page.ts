import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificacion: boolean = false;

  constructor() { }

  ngOnInit() {
  }
  activar(){
    this.notificacion = !this.notificacion;
    if (this.notificacion){
      console.log('Notificaciones activadas', this.notificacion);
    } else {
      console.log('Notificaciones desactivadas', this.notificacion);
    }
  }

}
