import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../_services/sidebar.service';
import { onMainContentChange } from 'src/app/_animations/animation-sidebar';
import { MODE } from 'src/app/_models/APIModel/manager.model';
import { MODULE_CONTROL } from 'src/app/_enums/module-control.enum';

@Component({
  selector: 'app-report-layout',
  templateUrl: './report-layout.component.html',
  styleUrls: ['./report-layout.component.scss'],
  animations: [ onMainContentChange ]
})
export class ReportLayoutComponent {

  name = 'Angular';
  public onSideNavChange: boolean;
  public readonly MODULE04: MODULE_CONTROL = MODULE_CONTROL.MODULE04;

  constructor(public _sidenavService: SidebarService) {
    this._sidenavService.sideBarState$.subscribe( res => {
      //console.log(res)
      this.onSideNavChange = res;
    })
  }

}
