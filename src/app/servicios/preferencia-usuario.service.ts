import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaUsuarioService {
  public usuario: string = '';
  public busquedaAutomatica: string = 'true';
  public distancia: number = 0;
  public tipo_operacion: string = 'Compra';
  public tipo_vivienda: string = 'Casa';
  public condicion: string = 'Nueva';
  public area_total: number = 0;
  public pisos: number = 0;
  public area_construida :number = 0;
  public antiguedad: number = 0;
  public TipoValor: string = 'UF';
  public ValorMinimo: number = 0;
  public ValorMaximo: number = 0;
  public precio_uf_desde: number = 0;
  public precio_uf_hasta: number = 0;
  public tipo_subsidio: string = 'Ninguno';
  public habitaciones: number = 0;
  public banos: number = 0;
  public estaciona: number = 0;
  public bodega: number = 0;
  public contactado: string = 'false';
  public notificaciones: string = 'true';

  constructor() { }
}
