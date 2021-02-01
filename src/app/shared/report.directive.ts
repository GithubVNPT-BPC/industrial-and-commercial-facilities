import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, Optional, Host, SkipSelf, Renderer2 } from '@angular/core';
import { KeyboardService } from './services/keyboard.service';

@Directive({
  selector: '[appReport]'
})
export class ReportDirective {
  constructor(public keyboardService: KeyboardService, public element: ElementRef, public render: Renderer2) {
    this.render.setAttribute(this.element.nativeElement, "tabindex", "0")
  }

  @HostListener('keydown', ['$event']) onKeyUp(e) {

    switch (e.keyCode) {
      case 38:
        this.keyboardService.sendMessage({ element: this.element, action: 'UP' })
        break;
      case 37:
        this.keyboardService.sendMessage({ element: this.element, action: 'LEFT' })
        break;
      case 40:
        this.keyboardService.sendMessage({ element: this.element, action: 'DOWN' })
        break;
      case 13:
        this.keyboardService.sendMessage({ element: this.element, action: 'DOWN' })
        break;
      case 39:
        this.keyboardService.sendMessage({ element: this.element, action: 'RIGHT' })
        break;
    }
  }
}
