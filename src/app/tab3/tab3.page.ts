import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';
import { Animation, GestureController, Gesture, AnimationController, GestureDetail, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements AfterViewInit{
  @ViewChildren('card', {read: ElementRef}) cards: QueryList<ElementRef> | undefined;

  animations: Animation[] = [];
  gesture : Gesture | undefined;
  animStarted = false;
  initialStep = 0;
  readonly MAX_TRANSLATE = 344 - 100 - 32;

  showDetails = false;
  maps: Leaflet.Map[] = [];
  markers: Leaflet.Marker[] = [];

  paginationConfig = {
    type: 'progressbar',
    el: '.swiper-pagination',  
  };
 
  constructor(private datosGlobales: GlobalDataService, private gestureCtrl: GestureController, private animationCtrl: AnimationController) {}

  ngAfterViewInit(){
    this.setupSwipeGesture();
  }

  //GESTOS

  setupSwipeGesture(){
    this.cards!.forEach((card, index) => {
      const animation = this.animationCtrl.create('swipe-animation')
      .addElement(card.nativeElement)
      .duration(100)

      this.animations.push(animation);

      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe-like-dislike',
        threshold: 0,
        onMove: (ev) => this.onMove(ev, index),
        onEnd: (ev) => this.onEnd(ev, index)
      });
    gesture.enable();
    });
  }

  onMove(ev: GestureDetail, index: number){
    const container = ev.event.target as HTMLElement;
    if (!this.animations[index] || container.tagName === 'ION-IMG' || container.tagName === 'SWIPER-CONTAINER' || container.tagName === 'DIV'
      || this.showDetails){
      return;
    }
    if (!this.animStarted){
      this.animations[index].progressStart();
      this.animStarted = true;
    }
    const step = this.getStep(ev);
    const translateXvalue = ev.deltaX
    this.animations[index].progressStep(step);
    this.cards!.get(index)!.nativeElement.style.transform = `translateX(${translateXvalue}px)`;
    this.cards!.get(index)!.nativeElement.style.rotate = `${translateXvalue/35}deg`;
    this.cards!.get(index)!.nativeElement.style.filter = `brightness(${Math.max(1 - Math.abs(step)/2, 0.5)})`;
  }

  onEnd(ev: GestureDetail, index: number){
    if (!this.animations[index] || !this.animStarted){
      return;
    }
    this.gesture?.enable(false)
    const step = this.getStep(ev);

    this.animations[index].progressEnd(0, step).onFinish(() => {
      this.cards!.get(index)!.nativeElement.style.transform = 'translateX(0)';
      this.cards!.get(index)!.nativeElement.style.rotate = '0deg';
      this.cards!.get(index)!.nativeElement.style.filter = '';
      //this.gesture?.enable(true);
    });
    console.log(ev.deltaX)
    if (ev.deltaX > this.datosGlobales.likeThreshold){
      this.guardarPref('like');
    } else if (ev.deltaX < -this.datosGlobales.likeThreshold){
      this.rechazarPref('dislike');
    }
    this.animStarted = false;
  }

  clamp(min: number, n: number, max: number){
    return Math.max(min, Math.min(n, max));
  }

  getStep(ev: GestureDetail){
    const deltaX = this.initialStep + ev.deltaX;
    return this.clamp(deltaX/this.MAX_TRANSLATE, -deltaX/this.MAX_TRANSLATE, 1);
  }

  //MAPA

  initializeMap(mapTag : HTMLElement) {
    const defaultIcon = Leaflet.icon({
      iconUrl: '../../assets/markers/marker-icon.png',
      shadowUrl: '../../assets/markers/marker-shadow.png'})
    const map = Leaflet.map(mapTag).setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    this.adduserMarker(map, this.datosGlobales.lat, this.datosGlobales.lon, defaultIcon);
    const marker = Leaflet.marker([this.datosGlobales.lat -0.001, this.datosGlobales.lon -0.001], {icon: Leaflet.icon({ //TODO: obtener lat y lon del domicilio seleccionado
      iconUrl: '../../assets/markers/casa-with-shadow.png',
      iconSize: [36, 36],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      })}).addTo(map);
    this.markers.push(marker);
  }

  adduserMarker(map: Leaflet.Map, lat: number, lon: number, icon: Leaflet.Icon) {
    if (map) {
      const marker = Leaflet.marker([lat, lon], {icon: icon}).addTo(map);
      this.markers.push(marker);
    }
  }

  destroyMap(map: Leaflet.Map) {
    if (map) {
      map.remove();
    }
  }

  //LIKE Y DISLIKE

  guardarPref(propiedad: string){
    console.log('Like')
  }

  rechazarPref(propiedad: string){
    console.log('Dislike')
  }

  //MOSTRAR DETALLES

  toggleDetails(ev: any){
    const match_card = ev.closest('.match-card')
    const hidden_info = match_card.querySelector('.hidden-info')
    const mapMatch = match_card.querySelector('#mapMatch') as HTMLElement;
    const info = match_card.querySelector('.info')
    this.showDetails = !this.showDetails;

    if (this.showDetails){
      hidden_info.style.display = 'block';
      info.style.display = 'none';
      setTimeout(() => {
        this.initializeMap(mapMatch);
      }, 0);
    } else {
      hidden_info.style.display = 'none';
      info.style.display = 'block';
      const map = this.maps.pop();
      if (map){
        this.destroyMap(map);
      }
    }
  }
}
