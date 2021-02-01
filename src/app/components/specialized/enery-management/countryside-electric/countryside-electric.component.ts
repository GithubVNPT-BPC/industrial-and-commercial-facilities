import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
  selector: 'app-countryside-electric',
  templateUrl: './countryside-electric.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class CountrysideElectricComponent implements OnInit {
  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/enery-management/countryside_electric";
  private readonly TITLE_DEFAULT: string = "Phát triển điện";
  private readonly TEXT_DEFAULT: string = "Phát triển điện";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();
  constructor(private _breadCrumService: BreadCrumService) { }
  //@INPUT & VIEWCHILD
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;

  ngOnInit() {
    this.sendLinkToNext(true);
  }
  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

}
