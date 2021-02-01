import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../_services/sidebar.service';
import { onMainContentChange } from 'src/app/_animations/animation-sidebar';
import { MODE } from 'src/app/_models/APIModel/manager.model';
import { MODULE_CONTROL } from 'src/app/_enums/module-control.enum';

@Component({
  selector: 'app-specialized-layout',
  templateUrl: './specialized-layout.component.html',
  styleUrls: ['./specialized-layout.component.scss'],
  animations: [ onMainContentChange ]
})
export class SpecializedLayoutComponent {

  name = 'Angular';
  public onSideNavChange: boolean;
  public readonly MODULE01: MODULE_CONTROL = MODULE_CONTROL.MODULE03;

  constructor(public _sidenavService: SidebarService) {
    this._sidenavService.sideBarState$.subscribe( res => {
      //console.log(res)
      this.onSideNavChange = res;
    })
  }

}
