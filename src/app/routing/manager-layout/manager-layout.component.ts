import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../_services/sidebar.service';
import { onMainContentChange } from 'src/app/_animations/animation-sidebar';
import { MODULE_CONTROL } from 'src/app/_enums/module-control.enum';

@Component({
  selector: 'app-manager-layout',
  templateUrl: './manager-layout.component.html',
  styleUrls: ['manager-layout.component.scss'],
  animations: [ onMainContentChange ]
})
export class ManagerLayoutComponent {

  name = 'Angular';
  public onSideNavChange: boolean;
  public readonly MODULE02: MODULE_CONTROL = MODULE_CONTROL.MODULE02;

  constructor(public _sidenavService: SidebarService) {
    this._sidenavService.sideBarState$.subscribe( res => {
      //console.log(res)
      this.onSideNavChange = res;
    })
  }

}
