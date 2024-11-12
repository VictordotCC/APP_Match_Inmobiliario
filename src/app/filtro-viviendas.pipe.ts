import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroViviendas',
  standalone: true
})
export class FiltroViviendasPipe implements PipeTransform {

  transform(viviendas: any[], searchText: string): any[] {
    if (!viviendas) return [];
    if (!searchText) return viviendas;

    searchText = searchText.toLowerCase();
    return viviendas.filter(vivienda => {
      return vivienda.nombre_propiedad.toLowerCase().includes(searchText);
    });
  }
  /*
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
  */
}
