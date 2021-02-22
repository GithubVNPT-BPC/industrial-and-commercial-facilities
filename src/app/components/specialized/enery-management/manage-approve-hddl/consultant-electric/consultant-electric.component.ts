import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from "@angular/core";
import {
  MatAccordion,
  MatPaginator,
  MatTableDataSource,
} from "@angular/material";
import { ManageAproveElectronic } from "src/app/_models/APIModel/electric-management.module";
import { DistrictModel } from "src/app/_models/APIModel/domestic-market.model";
import { consualtantData } from "../dataMGN";
import { ExcelService } from "src/app/_services/excelUtil.service";
import * as XLSX from "xlsx";
import { EnergyService } from "src/app/_services/APIService/energy.service";
import { FormControl } from "@angular/forms";
import { BaseComponent } from "../../../specialized-base.component";
import { Router } from "@angular/router";
@Component({
  selector: "app-consultant-electric",
  templateUrl: "./consultant-electric.component.html",
  styleUrls: ["../../../special_layout.scss"],
})
export class ConsultantElectricComponent extends BaseComponent {

  //ViewChild
  // @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("TABLE", { static: false }) table: ElementRef;
  // Input
  @Input('consualtantData') input_data: ManageAproveElectronic[];
  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quản lý cấp phép HĐĐL");
    XLSX.writeFile(wb, "Quản lý cấp phép HĐĐL.xlsx");
  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(
      filename,
      sheetname,
      this.table.nativeElement
    );
  }

  //Constant variable
  public readonly displayedColumns: string[] = [
    "index",
    "ten_doanh_nghiep",
    "dia_diem",
    "so_dien_thoai",
    "so_giay_phep",
    "ngay_cap",
    "ngay_het_han",
  ];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  public filteredDataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  public districts: DistrictModel[] = [
    { id: 1, ten_quan_huyen: "Thị xã Phước Long" },
    { id: 2, ten_quan_huyen: "Thành phố Đồng Xoài" },
    { id: 3, ten_quan_huyen: "Thị xã Bình Long" },
    { id: 4, ten_quan_huyen: "Huyện Bù Gia Mập" },
    { id: 5, ten_quan_huyen: "Huyện Lộc Ninh" },
    { id: 6, ten_quan_huyen: "Huyện Bù Đốp" },
    { id: 7, ten_quan_huyen: "Huyện Hớn Quản" },
    { id: 8, ten_quan_huyen: "Huyện Đồng Phú" },
    { id: 9, ten_quan_huyen: "Huyện Bù Đăng" },
    { id: 10, ten_quan_huyen: "Huyện Chơn Thành" },
    { id: 11, ten_quan_huyen: "Huyện Phú Riềng" },
  ];
  // public data: Array<ManageAproveElectronic> = consualtantData.filter(
  //   (item) => item.id_group === 1
  // );
  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  soLuongDoanhNghiepExpired: number = 0;
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
    this.getDataConsultantElectric();
    this.years = this.getYears();
  }

  getDataConsultantElectric() {
    this.energyService.LayDuLieuTuVanDien().subscribe((res) => {
      if (res['success']) {
        this.handdleData(res['data'], 1);
      }
    });
    // this.filteredDataSource = new MatTableDataSource<ManageAproveElectronic>(this.input_data);
    // this.dataSource = new MatTableDataSource<ManageAproveElectronic>(this.input_data);
  }

  handdleData(data: ManageAproveElectronic[], id_group: number) {
    this.filteredDataSource = new MatTableDataSource<ManageAproveElectronic>(data.filter(item => {
      return item['id_group'] === id_group;
    }));
    this.dataSource.data = this.filteredDataSource.data;
    this.caculatorValue();
    this.paginatorAgain();
    // console.log(this.filteredDataSource.data)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  get(time_id: number) { }

  log(any) { }

  getYears() {
    return Array(20)
      .fill(1)
      .map((element, index) => (new Date().getFullYear() + index - 11))
  }

  LocDulieuTheoNgayCap(year) {
    let data_temp = [...this.dataSource.data];
    this.filteredDataSource.data = data_temp;
    if (year) {
      this.filteredDataSource.data = this.filteredDataSource.data.filter(item => {
        return item.ngay_cap.includes(year);
      })
    }
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
    // this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.handeldateExpired();
    // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_xuat_thiet_ke).reduce((a, b) => a + b) : 0;
    // this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }

  auto_caculator() {
    setTimeout(() => {
      this.caculatorValue();
    }, 1000);
  }

  handeldateExpired() {
    this.filteredDataSource.data.filter((item) => {
      let today = new Date();
      Date.parse(item.ngay_het_han) < Date.parse(today.toString())
        ? this.soLuongDoanhNghiepExpired++
        : 0;
    });
  }

  applyActionCheck(event) {
    let today = new Date();

    if (event.checked) {
      this.filteredDataSource.data = this.filteredDataSource.data.filter(e => {
        return Date.parse(today.toString()) > Date.parse(e.ngay_het_han)
      })
    } else {
      this.filteredDataSource.data = [...this.dataSource.data];
    }
    // this.caculatorValue();
    this.paginatorAgain();
  }

  getFormParams() {
    return {
      ten_doanh_nghiep: new FormControl(''),
      dia_chi: new FormControl(''),
      dien_thoai: new FormControl(''),
      so_giay_phep: new FormControl(''),
      ngay_cap: new FormControl(''),
      ngay_het_han: new FormControl(''),
      id_group: new FormControl(1)
    }
  }

  public prepareData(data) {
  }

  public callService(data) {
    let list_data = [data];
    // console.log(list_data)
    this.energyService.CapNhatDuLieuQuyHoachDienNongThon(list_data).subscribe(res => {
      this.successNotify(res);
    })
  }
}
