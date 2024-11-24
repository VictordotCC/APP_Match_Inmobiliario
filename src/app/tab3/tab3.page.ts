import { Component, AfterViewInit, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Animation, GestureController, Gesture, AnimationController, GestureDetail } from '@ionic/angular';

import { GlobalDataService } from '../servicios/global-data.service';
import { DataServiceService } from '../servicios/data-service.service';
import { PreferenciaUsuarioService } from '../servicios/preferencia-usuario.service';
import { StorageService } from '../servicios/storage.service';
//import { NotificationsPushService } from '../servicios/notifications-push.service'; // Importa el servicio de notificaciones



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements AfterViewInit {
  @ViewChildren('card', {read: ElementRef}) cards: QueryList<ElementRef> | undefined;

  animations: Animation[] = [];
  gesture : Gesture | undefined;
  animStarted = false;
  initialStep = 0;
  readonly MAX_TRANSLATE = 344 - 100 - 32;
  pullDeltaX = 0;
  cardlist: ElementRef[] = [];

  showDetails = false;
  private defaultIcon = Leaflet.icon({
    iconUrl: '../../assets/markers/marker-icon.png',
    shadowUrl: '../../assets/markers/marker-shadow.png'})
  maps: Leaflet.Map[] = [];
  markers: Leaflet.Marker[] = [];
  usermarkers: Leaflet.Marker[] = [];

  preferencias: PreferenciaUsuarioService = this.datosGlobales.preferencias;
  matches: any[] = [];
  favoritos: any = {}; //para crear el objeto que se va  a enviar a la api
  paginationConfig = {
    type: 'progressbar',
    el: '.swiper-pagination',
  };
  private access_token = '';
  private usuario = '';

  constructor(private datosGlobales: GlobalDataService, private apiCon: DataServiceService,
    private gestureCtrl: GestureController, private animationCtrl: AnimationController,
    private storage: StorageService,
    /*private notificationsPushService: NotificationsPushService*/ ) { }

  async ionViewDidEnter(){
    await this.storage.init();
    this.usuario =  await this.storage.get('userGlobal');
    this.preferencias = await this.storage.get('preferencias');
    this.access_token = await this.storage.get('access_token');
    //Obtiene los datos si las preferencias han cambiado
    console.log(this.preferencias);
    if(this.preferencias != this.datosGlobales.preferencias){
      console.log('Preferencias cambiadas');
      this.preferencias = this.datosGlobales.preferencias;
      this.actualizarMatches();
    }
  }

  async ngAfterViewInit(){
    this.usuario =  await this.storage.get('userGlobal');
    await this.storage.init();
    this.preferencias = await this.storage.get('preferencias');
    this.datosGlobales.preferencias = this.preferencias;
    this.access_token = await this.storage.get('access_token');
    //this.notificationsPushService.init(); // Inicializa el servicio de notificaciones
    this.actualizarMatches();
    this.obtenerMatches();
    this.maps.forEach((map) => {
      if (map) {
        this.destroyMap(map);
      }
    });
    this.cards?.changes.subscribe(() => {
      this.setupSwipeGesture();
      this.cardlist = this.cards!.toArray();
    });
    this.datosGlobales.ubicacion$.subscribe((ubicacion) => {
      if (ubicacion) {
        this.updateMaps(ubicacion.lat, ubicacion.lon);
      }
    });


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
    const map = Leaflet.map(mapTag).setView([this.datosGlobales.lat, this.datosGlobales.lon], this.datosGlobales.mapZoom);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    this.adduserMarker(map, this.datosGlobales.lat, this.datosGlobales.lon, this.defaultIcon);
    const marker = Leaflet.marker([this.datosGlobales.lat -0.001, this.datosGlobales.lon -0.001], {icon: Leaflet.icon({ //TODO: obtener lat y lon del domicilio seleccionado
      iconUrl: '../../assets/markers/casa-with-shadow.png',
      iconSize: [36, 36],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      })}).addTo(map);
    this.markers.push(marker);
    this.maps.push(map);
  }

  updateMaps(lat: number, lon: number) {
    this.maps.forEach((map) => {
      if (map && map.getContainer().style.display !== 'none') {
        map.setView([lat, lon], this.datosGlobales.mapZoom);
        this.usermarkers.forEach((marker) => {
          marker.setLatLng([lat, lon]);
        });
      }
    });
  }

  adduserMarker(map: Leaflet.Map, lat: number, lon: number, icon: Leaflet.Icon) {
    if (map) {
      const marker = Leaflet.marker([lat, lon], {icon: icon}).addTo(map);
      this.usermarkers.push(marker);
    }
  }

  destroyMap(map: Leaflet.Map) {
    if (map) {
      map.remove();
    }
  }

  //LIKE Y DISLIKE

  guardarPref(propiedad: string){
    //get current card
    const lastElement = this.cardlist.pop()?.nativeElement;
    const id_match  = lastElement!.getAttribute('id-match');
    // obtener id de la vivienda
    const id_vivienda = lastElement!.getAttribute('id-vivienda');

    // Agregar a favoritos
    this.favoritos = {id_vivienda: id_vivienda, usuario: this.usuario}
    this.guardarFavoritos(this.favoritos).subscribe((data) => {
      console.log(data);
      if (data[1] == 200){
        console.log('Favorito guardado');
        this.updateMatch(id_match!);
      } else {
        console.log('Error al guardar favorito');
      }
    });
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
  }

  rechazarPref(propiedad: string){
    const lastElement = this.cardlist.pop()?.nativeElement;
    const id_match  = lastElement?.getAttribute('id-match');

    const choiceCard = lastElement!.querySelector('.choice.nope');
    choiceCard!.style.opacity = '1';
    setTimeout(() => {
      lastElement!.classList.add('go-left');
    }, 500);

    lastElement?.addEventListener('transitionend', () => {
      lastElement.remove();
    });


    this.updateMatch(id_match!);
  }

  //METODOS FETCH

  actualizarMatches(){
    console.log('Actualizando matches');
    console.log(this.access_token);
    console.log(this.preferencias);
    this.apiCon.getViviendasApi(this.preferencias, this.access_token).subscribe((data) => {
      console.log(data);
    });
  }

  obtenerMatches(){
    this.apiCon.getMatches(this.preferencias.usuario, this.access_token).subscribe((data) => {
      this.matches = data;
      console.log(data[0]);
      let filtered = this.matches;
      if (filtered.length > 0){
        //this.notificationsPushService.sendNotification('Match encontrado', `Se encontraron ${filtered.length} viviendas que coinciden con tus criterios de búsqueda.`);
      }
    });
  }

  updateMatch(id_match: string){
    this.apiCon.updateMatch(id_match, this.access_token).subscribe((data) => {
      console.log(data);
      let filtered = data;
      if (filtered.length > 0){
        //this.notificationsPushService.sendNotification('Match encontrado', `Se encontraron ${filtered.length} viviendas que coinciden con tus criterios de búsqueda.`);
      }
    });
  }

  guardarFavoritos(ob :any){
    return this.apiCon.guardarFavoritos(ob, this.access_token);
  }
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

  //Formateos
  formatNumber(num: number){
    const number = Math.ceil(num);
    return new Intl.NumberFormat('es-CL').format(number);
  }

  formatString(str: string){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
