import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaUsuarioService {
  public usuario: String = '';
  private busquedaAutomatica: String = 'true';
  private distancia: number = 0;
  private tipo_operacion: String = 'Compra';
  private tipo_vivienda: String = 'Casa';
  private condicion: String = 'Nueva';
  private area_total: number = 0;
  private pisos: number = 0;
  private area_construida :number = 0;
  private antiguedad: number = 0;
  private TipoValor: String = 'UF';
  private ValorMinimo: number = 0;
  private ValorMaximo: number = 0;
  private precio_uf_desde: number = 0;
  private precio_uf_hasta: number = 0;
  private tipo_subsidio: String = 'Ninguno';
  private habitaciones: number = 0;
  private banos: number = 0;
  private estaciona: number = 0;
  private bodega: number = 0;
  private contactado: String = 'false';
  private notificaciones: String = 'true';

  constructor() { }
}
