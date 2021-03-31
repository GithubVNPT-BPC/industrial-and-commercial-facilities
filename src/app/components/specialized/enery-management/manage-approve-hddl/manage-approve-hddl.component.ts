import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { ManageAproveElectronic } from "src/app/_models/APIModel/electric-management.module";
import { LinkModel } from "src/app/_models/link.model";
import { EnergyService } from "src/app/_services/APIService/energy.service";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";

@Component({
  selector: "app-manage-approve-hddl",
  templateUrl: "./manage-approve-hddl.component.html",
  styles: [],
})
export class ManageApproveHddlComponent implements OnInit {
  // public dataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  consualtantData: any[] = [];
  manufacturingData: any[] = [];
  constructor(
    private energyService: EnergyService,
    private _breadCrumService: BreadCrumService
  ) {
    
  }

  ngOnInit() {
    // this.getDataConsultantElectric();
    
  }

  getDataConsultantElectric() {
    this.energyService.LayDuLieuTuVanDien().subscribe((res) => {
      if (res["success"]) {
        this.handleData(res["data"]);
      }
    });
  }

  handleData(data: any[]) {
    data.filter((item) => {
      if (item["id_group"] === 1) this.consualtantData.push(item);
      if (item["id_group"] === 2) this.manufacturingData.push(item);
    });
  }

  // _linkOutput: LinkModel = new LinkModel();
  // //Constant
  // LINK_DEFAULT: string = "";
  // TITLE_DEFAULT: string = "";
  // TEXT_DEFAULT: string = "";
  // getLinkDefault() {
  //   this.LINK_DEFAULT = "/specialized/enery-management/manage_aprove_hddl";
  //   this.TITLE_DEFAULT ="Quy hoạch phát triển lưới điện - Quản lý cấp phép hoạt động";
  //   this.TEXT_DEFAULT ="Quy hoạch phát triển lưới điện - Quản lý cấp phép hoạt động";
  // }

  // public sendLinkToNext(type: boolean) {
  //   this.getLinkDefault();
  //   this._linkOutput.link = this.LINK_DEFAULT;
  //   this._linkOutput.title = this.TITLE_DEFAULT;
  //   this._linkOutput.text = this.TEXT_DEFAULT;
  //   this._linkOutput.type = type;
  //   this._breadCrumService.sendLink(this._linkOutput);
  // }
}
