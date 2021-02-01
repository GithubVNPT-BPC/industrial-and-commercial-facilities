import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';


import { TOGGLE_STATUS } from './toggle-status';
import { Subject, Observable } from 'rxjs';

@Directive({
  selector: '[dropdown]',
  exportAs: 'dropdown',
})
export class DropdownDirective {

  public status: TOGGLE_STATUS = TOGGLE_STATUS.CLOSE;
  public status$: Subject<TOGGLE_STATUS> = new Subject<TOGGLE_STATUS>();

  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
  ) { }

  setActive(active = true) {
    active ? this.renderer.addClass(this.elementRef.nativeElement, 'active'): this.renderer.removeClass(this.elementRef.nativeElement, 'active');
  }

  toggle() {
    if (this.status === TOGGLE_STATUS.OPEN) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.renderer.addClass(this.elementRef.nativeElement, 'open');
    if (this.status !== TOGGLE_STATUS.OPEN) {
      this.status$.next(TOGGLE_STATUS.OPEN);
    }
    this.status = TOGGLE_STATUS.OPEN;
  }

  close() {
    this.renderer.removeClass(this.elementRef.nativeElement, 'open');
    if (this.status !== TOGGLE_STATUS.CLOSE) {
      this.status$.next(TOGGLE_STATUS.CLOSE);
    }
    this.status = TOGGLE_STATUS.CLOSE;
  }

  statusChange(): Observable<TOGGLE_STATUS> {
    return this.status$.asObservable();
  }
}