import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { New_RuralElectricModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { BaseComponent } from '../../specialized-base.component';

@Component({
  selector: 'rural-electric-management',
  templateUrl: './rural-electric-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})

export class RuralElectricManagementComponent extends BaseComponent {
  //ViewChild 
  // @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'db', 't1', 'cd1', 'tl1', 't2', 'cd2', 'ccd2', 'tl2', 'tc4_1', 'tc4_2', 'tc4_3',
  ];
  public readonly dsplayMergeColumns: string[] = ['merge1', 'merge2', 'merge3', 'merge4', 'merge5', 'merge6'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<New_RuralElectricModel> = new MatTableDataSource<New_RuralElectricModel>();
  public filteredDataSource: MatTableDataSource<New_RuralElectricModel> = new MatTableDataSource<New_RuralElectricModel>();

  //Only TS Variable
  years: number[] = [];
  tongSoHo: number;
  tongSoXa: number;
  tongHoKhongCoDien: number;
  tongHoCoDien: number;
  isChecked: boolean;

  constructor(
    private injector: Injector,
    public excelService: ExcelService,
    private energyService: EnergyService,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.years = this.getYears();
    this.getDataRuralElectric();
  }

  getDataRuralElectric() {
    this.energyService.LayDuLieuQuyHoachDienNongThon().subscribe(res => {
      this.filteredDataSource = new MatTableDataSource<New_RuralElectricModel>(res['data']);
      this.caculatorValue();
      this.paginatorAgain();
      this.dataSource = new MatTableDataSource<New_RuralElectricModel>(res['data']);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  get(time_id: number) {

  }

  log(any) {
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }
  getValueOfHydroElectric(value: any) {

  }
  // applyDistrictFilter(event) {
  //   let filteredData = [];

  //   event.value.forEach(element => {
  //     this.dataSource.data.filter(x => x.ma_huyen_thi == element).forEach(x => filteredData.push(x));
  //   });

  //   if (!filteredData.length) {
  //     if (event.value.length)
  //       this.filteredDataSource.data = [];
  //     else
  //       this.filteredDataSource.data = this.dataSource.data;
  //   }
  //   else {
  //     this.filteredDataSource.data = filteredData;
  //   }
  //   this.caculatorValue();
  //   this.paginatorAgain();
  // }
  caculatorValue() {
    this.tongSoHo = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nong_thon_tong_so_ho).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.filter(x => x.nong_thon_tong_so_ho != null).length;
    this.tongHoKhongCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ccd2).reduce((a, b) => a + b) : 0;
    this.tongHoCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nong_thon_tong_so_ho_co_dien).reduce((a, b) => a + b) : 0;
  }
  // isHidden(row : any){
  //     return (this.isChecked)? (row.is_het_han) : false;
  // }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }

  getFormParams() {
    return {
      dia_ban: new FormControl(''),
      is_cap_huyen: new FormControl(1),
      tong_so_ho: new FormControl(''),
      tong_so_ho_co_dien: new FormControl(''),
      nong_thon_tong_so_ho: new FormControl(''),
      nong_thon_tong_so_ho_co_dien: new FormControl(''),
      tieu_chi_41: new FormControl(''),
      tieu_chi_42: new FormControl(''),
      tieu_chi_43: new FormControl('')
    }
  }

  tieu_chi: any[] = [
    {id: 1, value: 'Đạt'},
    {id: 2, value: 'Không đạt'}
  ]
  public prepareData(data) {
    data['tong_so_ho'] = Number(data['tong_so_ho']);
    data['tong_so_ho_co_dien'] = Number(data['tong_so_ho_co_dien']);
    data['nong_thon_tong_so_ho'] = Number(data['nong_thon_tong_so_ho']);
    data['nong_thon_tong_so_ho_co_dien'] = Number(data['nong_thon_tong_so_ho_co_dien']);
    data['tieu_chi_41'] = Number(data['tieu_chi_41']);
    data['tieu_chi_42'] = Number(data['tieu_chi_42']);
    data['tieu_chi_43'] = Number(data['tieu_chi_43']);
  }

  public callService(data) {
    let list_data = [data];
    // console.log(list_data)
    this.energyService.CapNhatDuLieuQuyHoachDienNongThon(list_data).subscribe(res => {
      this.successNotify(res);
    })
  }
}