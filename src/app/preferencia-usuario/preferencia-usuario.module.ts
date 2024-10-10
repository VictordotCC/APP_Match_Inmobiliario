import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferenciaUsuarioPageRoutingModule } from './preferencia-usuario-routing.module';

import { PreferenciaUsuarioPage } from './preferencia-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferenciaUsuarioPageRoutingModule
  ],
  declarations: [PreferenciaUsuarioPage]
})
export class PreferenciaUsuarioPageModule {}
