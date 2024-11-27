import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DarseAltaPage } from './darse-alta.page';

const routes: Routes = [
  {
    path: '',
    component: DarseAltaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DarseAltaPageRoutingModule {}
