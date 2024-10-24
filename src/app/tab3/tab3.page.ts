import { Component, AfterViewInit, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
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
  pullDeltaX = 0;
  cardlist: ElementRef[] = [];

  showDetails = false;
  maps: Leaflet.Map[] = [];
  markers: Leaflet.Marker[] = [];

  paginationConfig = {
    type: 'progressbar',
    el: '.swiper-pagination',  
  };
 
  constructor(private datosGlobales: GlobalDataService, private gestureCtrl: GestureController, private animationCtrl: AnimationController) { }

  ngAfterViewInit(){
    this.setupSwipeGesture();
    this.cardlist = this.cards!.toArray();
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
    const actualCard = this.cards!.get(index)!.nativeElement;
    this.pullDeltaX = ev.deltaX - this.initialStep;
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
    actualCard.style.transform = `translateX(${translateXvalue}px)`;
    actualCard.style.rotate = `${translateXvalue/30}deg`;
    //actualCard.style.filter = `brightness(${Math.max(1 - Math.abs(step)/2, 0.5)})`;

     const choiceE1 = this.pullDeltaX > 0 ? 
      actualCard.querySelector('.choice.like') 
      : actualCard.querySelector('.choice.nope');

    choiceE1!.style.opacity = `${Math.abs(this.pullDeltaX)/100}`;

  }

  onEnd(ev: GestureDetail, index: number){
    if (!this.animations[index] || !this.animStarted){
      return;
    }
    this.gesture?.enable(false)
    const step = this.getStep(ev);
    const actualCard = this.cards!.get(index)!.nativeElement;

    this.animations[index].progressEnd(0, step).onFinish(() => {
      actualCard.style.transform = 'translateX(0)';
      actualCard.style.rotate = '0deg';
      actualCard.style.filter = '';
      //this.gesture?.enable(true);
    });
    if (this.pullDeltaX> this.datosGlobales.likeThreshold){
      actualCard.classList.add('go-right');
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove();
      });
      this.guardarPref('like');

    } else if (this.pullDeltaX < -this.datosGlobales.likeThreshold){
      actualCard.classList.add('go-left');
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove();
      });
      this.rechazarPref('dislike');

    } else {
      actualCard.classList.add('reset');
      actualCard.classList.remove('go-right', 'go-left');
      actualCard.querySelectorAll('.choice').forEach((choice:any) => {
        choice.style.opacity = '0';
      });
    }

    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');
      this.pullDeltaX = 0;
      this.animStarted = false;
      this.gesture?.enable(true);
    });
    actualCard.querySelectorAll('.choice').forEach((choice:any) => {
      choice.style.opacity = '0';
    });
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
    this.maps.push(map);
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
    console.log(this.cardlist)
    //get current card
    const lastElement = this.cardlist.pop()?.nativeElement;
    //TODO: save fav
    //Like animation 
    const choiceCard = lastElement!.querySelector('.choice.like');
    choiceCard!.style.opacity = '1';
    setTimeout(() => {
      lastElement!.classList.add('go-right');
    }, 500);
    //remove card
    lastElement?.addEventListener('transitionend', () => {
      lastElement.remove();
    });
    
    
    console.log('Like')
  }

  rechazarPref(propiedad: string){
    const lastElement = this.cardlist.pop()?.nativeElement;   
    const choiceCard = lastElement!.querySelector('.choice.nope');
    choiceCard!.style.opacity = '1';
    setTimeout(() => {
      lastElement!.classList.add('go-left');
    }, 500);

    lastElement?.addEventListener('transitionend', () => {
      lastElement.remove();
    });
    
    console.log('Dislike')
  }

  //METODOS FETCH


  //MOSTRAR DETALLES

  toggleDetails(ev: any){
    const match_card = ev.closest('.match-card')
    const hidden_info = match_card.querySelector('.hidden-info')
    const mapMatch = match_card.querySelector('#mapMatch') as HTMLElement;
    const info = match_card.querySelector('.info')
    const match_container = match_card.closest('.match-container')
    this.showDetails = !this.showDetails;

    if (this.showDetails){
      hidden_info.style.display = 'block';
      info.style.display = 'none';
      match_container.style.justifyContent = 'flex-start';
      setTimeout(() => {
        this.initializeMap(mapMatch);
      }, 0);
    } else {
      hidden_info.style.display = 'none';
      info.style.display = 'block';
      match_container.style.justifyContent = 'center';
      const map = this.maps.pop();
      if (map){
        this.destroyMap(map);
      }
    }
  }
}
