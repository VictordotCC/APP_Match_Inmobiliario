import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GlobalDataService } from '../servicios/global-data.service';
import { Animation, GestureController, Gesture, AnimationController, GestureDetail, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('card', {static: false}) card: ElementRef | undefined;

  animation: Animation | undefined;
  gesture : Gesture | undefined;
  animStarted = false;
  initialStep = 0;
  readonly MAX_TRANSLATE = 344 - 100 - 32;

  showDetails = false;
  map: Leaflet.Map | undefined;
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
    if (this.card){
      this.animation = this.animationCtrl.create('swipe-animation')
      .addElement(this.card.nativeElement)
      .duration(100)
      
      const gesture: Gesture = this.gestureCtrl.create({
        el: this.card.nativeElement,
        gestureName: 'swipe-like-dislike',
        threshold: 0,
        onMove: (ev) => this.onMove(ev),
        onEnd: (ev) => this.onEnd(ev)
      });
      gesture.enable();
    }
  }

  onMove(ev: GestureDetail){
    const container = ev.event.target as HTMLElement;
    if (container.tagName === 'ION-IMG' || container.tagName === 'SWIPER-CONTAINER' || container.tagName === 'DIV'
      || this.showDetails){
      return;
    }
    if (!this.animation){
      return;
    }
    if (!this.animStarted){
      this.animation.progressStart();
      this.animStarted = true;
    }
    const step = this.getStep(ev);
    const translateXvalue = ev.deltaX
    this.animation.progressStep(step);
    this.card!.nativeElement.style.transform = `translateX(${translateXvalue}px)`;
    this.card!.nativeElement.style.filter = `brightness(${1 - Math.abs(step)/2})`;
  }

  onEnd(ev: GestureDetail){
    if (!this.animation){
      return;
    }
    if (!this.animStarted){
      return;
    }
    this.gesture?.enable(false)
    const step = this.getStep(ev);

    this.animation.progressEnd(0, step).onFinish(() => {
      this.card!.nativeElement.style.transform = 'translateX(0)';
      //this.gesture?.enable(true);
    });
    console.log(ev.deltaX)
    if (ev.deltaX > this.datosGlobales.likeThreshold){
      this.guardarPref('like');
    } else if (ev.deltaX < -this.datosGlobales.likeThreshold){
      this.rechazarPref('dislike');
    }
    this.animStarted = false;
    this.card!.nativeElement.style.filter = '';
  }

  clamp(min: number, n: number, max: number){
    return Math.max(min, Math.min(n, max));
  }

  getStep(ev: GestureDetail){
    const deltaX = this.initialStep + ev.deltaX;
    return this.clamp(deltaX/this.MAX_TRANSLATE, -deltaX/this.MAX_TRANSLATE, 1);
  }

  //MAPA

  initializeMap() {
    const defaultIcon = Leaflet.icon({
      iconUrl: '../../assets/markers/marker-icon.png',
      shadowUrl: '../../assets/markers/marker-shadow.png'})
    this.map = Leaflet.map('mapMatch').setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.adduserMarker(this.datosGlobales.lat, this.datosGlobales.lon, defaultIcon);
    const marker = Leaflet.marker([this.datosGlobales.lat -0.001, this.datosGlobales.lon -0.001], {icon: Leaflet.icon({ //TODO: obtener lat y lon del domicilio seleccionado
      iconUrl: '../../assets/markers/casa-with-shadow.png',
      iconSize: [36, 36],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      })}).addTo(this.map);
    this.markers.push(marker);
  }

  adduserMarker(lat: number, lon: number, icon: Leaflet.Icon) {
    if (this.map) {
      const marker = Leaflet.marker([lat, lon], {icon: icon}).addTo(this.map);
      this.markers.push(marker);
    }
  }

  destroyMap() {
    if (this.map) {
      this.map.remove();
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

  toggleDetails(){
    this.showDetails = !this.showDetails;

    if (this.showDetails){
      setTimeout(() => {
        this.initializeMap();
      }, 0);
    } else {
      this.destroyMap();
    }
  }
}
