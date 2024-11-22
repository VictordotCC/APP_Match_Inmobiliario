import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaUsuarioService {
  public usuario: string = 'None';
  public busqueda_automatica: boolean = true;
  public distancia: number = 0;
  public tipo_operacion: boolean = false;
  public tipo_vivienda: number = 1;
  public condicion: string = 'Nueva';
  public area_total: number = 0;
  public pisos: number = 0;
  public area_construida :number = 0;
  public antiguedad: number = 0;
  public tipo_valor: string = 'UF';
  public precio_minimo: number = 0;
  public precio_maximo: number = 0;
  public precio_uf_desde: number = 0;
  public precio_uf_hasta: number = 0;
  public tipo_subsidio: string[] = [];
  public habitaciones: number = 0;
  public banos: number = 0;
  public estaciona: number = 0;
  public bodega: number = 0;
  public contactado: boolean = false;
  public notificaciones: boolean = true;

  constructor() { }
}
