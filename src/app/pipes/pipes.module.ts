import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';

@NgModule({
  //declarations: [FiltroPipe],
  imports: [FiltroPipe],
  exports: [FiltroPipe]

})
export class PipesModule { }
