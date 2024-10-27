import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  user: string = '';
  pass: string = '';
  tipo: string = '';
  constructor( private route: ActivatedRoute, public navCtrl: NavController) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.user = params['user'];
      this.pass = params['pass'];
      this.tipo = params['tipo'];
      console.log('User:', this.user);
      console.log('Pass:', this.pass);
      console.log('Tipo:', this.tipo);
    });
    this.navCtrl.navigateForward(['/tabs/tab1'], {
      queryParams: { user: this.user, pass: this.pass, tipo: this.tipo}
  });
  }
}
