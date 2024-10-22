import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string): any[] {
    //console.log(arreglo);
    if (texto === '') {
      return arreglo;
    }
    texto = texto.toLowerCase()
    return arreglo.filter( item =>{
      return item.descripcion.toLowerCase().includes(texto);
    });

  }

}
