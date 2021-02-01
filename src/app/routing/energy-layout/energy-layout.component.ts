import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../_services/sidebar.service';
import { onMainContentChange } from 'src/app/_animations/animation-sidebar';

@Component({
  selector: 'app-energy-layout',
  templateUrl: './energy-layout.component.html',
  styles: [ ],
  animations: [ onMainContentChange ]
})
export class EnergyLayoutComponent implements OnInit {

  name = 'Angular';
  public onSideNavChange: boolean;

  constructor(public _sidenavService: SidebarService) {
    this._sidenavService.sideBarState$.subscribe( res => {
      //console.log(res)
      this.onSideNavChange = res;
    })
  }

  ngOnInit() {
  }

}
