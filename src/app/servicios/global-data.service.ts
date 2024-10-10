import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  public userGlobal: string = 'abc@def.com';
  public passGlobal: string = '1234';

  constructor() { }
}
