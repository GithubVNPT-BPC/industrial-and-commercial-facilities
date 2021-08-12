import { Component, Injector} from '@angular/core';
import { BaseComponent } from 'src/app/components/specialized/base.component';

@Component({
  selector: 'electrical-plan',
  templateUrl: './electrical-plan.component.html',
  styleUrls: ['/../../special_layout.scss'],
})

export class ElectricalPlanComponent extends BaseComponent {
  
  constructor(
    private injector: Injector,
  ){
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  autoOpen() {}

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/electrical_plan";
    this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Quy hoạch điện 110kV trở lên";
    this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Quy hoạch điện  110kV trở lên";
  }

}