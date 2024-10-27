import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaUsuarioService {
  public usuario: String = '';
  private busquedaAutomatica: String = 'true';
  private Distancia: number = 0;
  private operacion: String = 'Compra';
  private propiedadTipo: String = 'Casa';
  private inmueble: String = 'Nueva';
  private area_total: number = 0;
  private pisos: number = 0;
  private area_construida :number = 0;
  private antiguedad: number = 0;
  private TipoValor: String = 'UF';
  private ValorMinimo: number = 0;
  private ValorMaximo: number = 0;
  private precio_uf: number = 0;
  private Subsidio: String = 'Ninguno';
  private habitaciones: number = 0;
  private banos: number = 0;
  private Estacionamiento: number = 0;
  private bodega: number = 0;
  private contactado: String = 'false';
  private notificaciones: String = 'true';

  constructor() { }
}
