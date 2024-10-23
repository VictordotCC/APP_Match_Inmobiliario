import { Injectable } from '@angular/core';
import { GlobalDataService } from './global-data.service';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private datosGlobales: GlobalDataService) { }

  async resizeImage(img: string){
    const height = this.datosGlobales.imageHeight;
    const width = this.datosGlobales.imageWidth;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.src = img;

    await new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(0);
      }
    });

    canvas.width = width;
    canvas.height = height;

    ctx!.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg');
  }
}


