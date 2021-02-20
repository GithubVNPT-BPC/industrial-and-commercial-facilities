import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ManageAproveElectronic } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';

@Component({
  selector: 'app-manage-approve-hddl',
  templateUrl: './manage-approve-hddl.component.html',
  styles: []
})
export class ManageApproveHddlComponent implements OnInit {

  // public dataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  consualtantData: any[] = [];
  manufacturingData: any[] = [];
  constructor(
    private energyService: EnergyService
  ) {}

  ngOnInit() {
    this.getDataConsultantElectric();
  }

  getDataConsultantElectric() {
    this.energyService.LayDuLieuTuVanDien().subscribe((res) => {
      if (res['success']) {
        this.handdleData(res['data']);
      }
    });
  }

  handdleData(data: any[]){
    data.filter(item => {
      if(item['id_group'] === 1)
        this.consualtantData.push(item);
      if(item['id_group'] === 2)
        this.manufacturingData.push(item);
    })
  }

}
