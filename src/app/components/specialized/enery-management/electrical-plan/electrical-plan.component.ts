import { Component, OnInit } from '@angular/core';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
    selector: 'electrical-plan',
    templateUrl: './electrical-plan.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ElectricalPlanComponent implements OnInit {
    //Constant
  private readonly LINK_DEFAULT:string = "/specialized/enery-management/electrical_plan";
  private readonly TITLE_DEFAULT:string = "Năng lượng";
  private readonly TEXT_DEFAULT:string = "Năng lượng";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();
  constructor(private _breadCrumService: BreadCrumService) { }
    ngOnInit() {
        this.sendLinkToNext(true);
      }
      public sendLinkToNext(type:boolean){
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
      }
}