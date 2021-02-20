import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { HydroElectricManagementModel, New_HydroElectrict } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
  selector: 'app-hydroelectric',
  templateUrl: './hydroelectric.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class HydroelectricComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  constructor(
    public excelService: ExcelService, 
    private energyService: EnergyService
    ) {
  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
  
  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'Tdn', 'Dd', 'Cx', 'Dthc', 'Sl6tck', 
  'Slnck', 'Dt', 'Paupttcctvhd', 'Pdpauptt', 'Paupvthkcdhctd', 'Qtvhhctd', 'Qtdhctd', 'Kdd', 'Ldhtcbvhd', 
  'Btct', 'Lcsdlhctd', 'Pabvdhctd', 'Bcdgatdhctd', 'Bchtatdhctd', 'Tkdkatdhctd'
  ];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<New_HydroElectrict>;
  public filteredDataSource: MatTableDataSource<New_HydroElectrict> = new MatTableDataSource<New_HydroElectrict>();;
  public districts: DistrictModel[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
  { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
  { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
  { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
  { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
  { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
  { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
  { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
  { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
  { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
  { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];

  // public data: Array<HydroElectricManagementModel> =
  
  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;

  ngOnInit() {
    this.years = this.getYears();
    this.laydulieuThuyDien();
    this.autoOpen();
  }

  laydulieuThuyDien(){
    this.energyService.LayDuLieuThuyDien().subscribe(res => {
      this.filteredDataSource = new MatTableDataSource<New_HydroElectrict>(res.data);
      // this.dataSource = new MatTableDataSource<New_HydroElectrict>(res.data);
      this.caculatorValue();
      this.paginatorAgain();
    })
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 100);
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

  paginatorAgain() {
    // if (this.filteredDataSource.data.length) {
    //   this.filteredDataSource.paginator = this.paginator;
    //   this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    //   this.paginator._intl.firstPageLabel = "Trang Đầu";
    //   this.paginator._intl.lastPageLabel = "Trang Cuối";
    //   this.paginator._intl.previousPageLabel = "Trang Trước";
    //   this.paginator._intl.nextPageLabel = "Trang Tiếp";
    // }
  }
  caculatorValue() {
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    // // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Cx).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }
  isHidden(row: any) {
    return (this.isChecked) ? (row.is_het_han) : false;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }
}