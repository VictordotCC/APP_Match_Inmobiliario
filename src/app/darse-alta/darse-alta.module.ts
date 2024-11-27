import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DarseAltaPageRoutingModule } from './darse-alta-routing.module';

import { DarseAltaPage } from './darse-alta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DarseAltaPageRoutingModule
  ],
  declarations: [DarseAltaPage]
})
export class DarseAltaPageModule {}
