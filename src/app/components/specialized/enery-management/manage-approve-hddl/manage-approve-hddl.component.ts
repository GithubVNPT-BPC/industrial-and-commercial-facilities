import { Component, OnInit } from "@angular/core";
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
}
