import { Component, OnInit } from '@angular/core';
import { StorageService } from '../servicios/storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  tipo: string = '';
  menu: boolean = true;
  constructor(private storage: StorageService ) {}

  async ngOnInit() {
    await this.storage.init();
    this.tipo = await this.storage.get('userTipoGlobal');
  }

  async ionViewWillEnter(){
    this.tipo = await this.storage.get('userTipoGlobal');
    if (this.tipo === 'Vendedor'){
      this.menu = false;
    } else {
      this.menu = true;
    }
  }
}
