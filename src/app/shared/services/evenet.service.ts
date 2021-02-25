import { Injectable, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor() { }

  open: boolean = false;

  getValue() {
    return this.open;
  }
  setvalue(param) {
    this.open = param;
  }

}