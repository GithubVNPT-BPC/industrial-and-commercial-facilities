import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-loader></app-loader> <p-toast></p-toast> <router-outlet></router-outlet>',
  styles: []
})
export class RoutingComponent {
}
