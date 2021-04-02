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
    this.TITLE_DEFAULT = "Năng lượng - Quy hoạch điện 110KV trở lên";
    this.TEXT_DEFAULT = "Năng lượng - Quy hoạch điện 110KV trở lên";
  }

}