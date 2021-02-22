import { Component, Injector, OnInit } from '@angular/core';
import { LinkModel } from 'src/app/_models/link.model';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
  selector: 'electrical-plan',
  templateUrl: './electrical-plan.component.html',
  styleUrls: ['/../../special_layout.scss'],
})

export class ElectricalPlanComponent {
  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/enery-management/electrical_plan";
  private readonly TITLE_DEFAULT: string = "Năng lượng";
  private readonly TEXT_DEFAULT: string = "Năng lượng";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();
  constructor(
    private _breadCrumService: BreadCrumService,
    // private injector: Injector,
    private energyService: EnergyService
  ) {
    // super(injector);
  }
  ngOnInit() {
    // super.ngOnInit();
    this.sendLinkToNext(true);
  }
  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  // getFormParams() {
  //   return {
  //     ten_tram: new FormControl(),
  //     duong_day: new FormControl(),
  //     tba: new FormControl(),
  //     tiet_dien_day_dan: new FormControl(),
  //     dien_ap: new FormControl(),
  //     chieu_dai: new FormControl(),
  //     p_max: new FormControl(),
  //     p_min: new FormControl(),
  //     p_tb: new FormControl(),
  //     mang_tai: new FormControl(),
  //     id_trang_thai_hoat_dong: new FormControl(),
  //     id_loai_quy_hoach: new FormControl(),
  //   }
  // }
}