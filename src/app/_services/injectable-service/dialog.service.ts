import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public transformData;

  private _close$ = new Subject();

  public close$ = this._close$.asObservable();

  constructor() { }

  close(reson?: any){
    this._close$.next(reson);
  }

  getDataTransform(){
    return this.transformData;
  }

  setDataTransformer(dataTransform: any[]){
    this.transformData = dataTransform;
  }
}
