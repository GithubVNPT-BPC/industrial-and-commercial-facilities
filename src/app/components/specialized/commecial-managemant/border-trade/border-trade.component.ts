import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ModalComponent } from '../export-import-management/dialog-import-export/modal.component';
import { BorderTrade } from 'src/app/_models/APIModel/border-trade.model'
import { concat, Observable, from, forkJoin } from 'rxjs';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import * as XLSX from 'xlsx';
import { mergeMap, tap } from 'rxjs/operators';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

export class GroupProduct {
  group_code: number;
  group_name: string;
  isGroup: boolean;
}

@Component({
  selector: 'app-border-trade',
  templateUrl: './border-trade.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class BorderTradeComponent implements OnInit {
  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/commecial-management/border_trade";
  private readonly TITLE_DEFAULT: string = "Thương mại biên giới";
  private readonly TEXT_DEFAULT: string = "Thương mại biên giới";
  //
  displayedColumns: string[] = [
    "id_mat_hang_xnk",
    "so_luong",
    "don_vi",
    "kim_ngach",
    "ten_doanh_nghiep"
  ];
  danh_sach: any[] = [
    { id: 1, value: 'I. Hàng hóa xuất khẩu, nhập khẩu thương mại' },
    { id: 2, value: 'II. Hàng hóa mua bán, trao đổi của cư dân biên giới' },
    { id: 3, value: 'III. Hàng kinh doanh miễn thuế' },
    { id: 4, value: 'IV. Hàng hóa kinh doanh tậm nhập, tái xuất: ' },
    { id: 5, value: 'V. Hàng hóa khác' },
  ];

  danh_sach_con: string[] = [
    '1.Xuất khẩu',
    '2. Nhập khẩu',
    '1. Tái xuất',
    '2. Tạm nhập'
  ];

  gr1: GroupProduct[] = [
    { group_code: 1, group_name: this.danh_sach[0].value, isGroup: true },
    { group_code: 1, group_name: this.danh_sach_con[0], isGroup: true },
    { group_code: 1, group_name: this.danh_sach_con[1], isGroup: true },
  ];
  gr2: GroupProduct[] = [
    { group_code: 2, group_name: this.danh_sach[1].value, isGroup: true },
    { group_code: 2, group_name: this.danh_sach_con[0], isGroup: true },
    { group_code: 2, group_name: this.danh_sach_con[1], isGroup: true }
  ]
  gr3: GroupProduct[] = [
    { group_code: 3, group_name: this.danh_sach[2].value, isGroup: true },
    { group_code: 3, group_name: this.danh_sach_con[2], isGroup: true },
    { group_code: 3, group_name: this.danh_sach_con[3], isGroup: true },
  ]
  gr4: GroupProduct[] = [
    { group_code: 4, group_name: this.danh_sach[3].value, isGroup: true },
    { group_code: 4, group_name: this.danh_sach_con[0], isGroup: true },
    { group_code: 4, group_name: this.danh_sach_con[1], isGroup: true },
  ]
  gr5: GroupProduct[] = [
    { group_code: 5, group_name: this.danh_sach[4].value, isGroup: true },
    { group_code: 5, group_name: this.danh_sach_con[0], isGroup: true },
    { group_code: 5, group_name: this.danh_sach_con[1], isGroup: true },
  ]
  danh_sach_cua_khau: any[] = [
    { ten_cua_khau: 'Tất cả', id_cua_khau: 4 },
    { ten_cua_khau: "Lộc Thịnh", id_cua_khau: 3 },
    { ten_cua_khau: "Hoàng Diệu", id_cua_khau: 2 },
    { ten_cua_khau: "Hoa Lư", id_cua_khau: 1 }
  ]
  id_cua_khau: number = 1;
  cua_khau: string = this.danh_sach_cua_khau[3].ten_cua_khau;
  dataSource: (BorderTrade | GroupProduct)[] = [];
  dataSourceI: (BorderTrade | GroupProduct)[] = [];
  dataSourceII: (BorderTrade | GroupProduct)[] = [];
  dataSourceIII: (BorderTrade | GroupProduct)[] = [];

  AlldataSource: any[] = [];

  // Hoa Lu Gate 
  dulieuI_gateI: (BorderTrade | GroupProduct)[] = [];
  dulieuII_gateI: (BorderTrade | GroupProduct)[] = [];
  dulieuIII_gateI: (BorderTrade | GroupProduct)[] = [];
  dulieuIV_gateI: (BorderTrade | GroupProduct)[] = [];
  dulieuV_gateI: (BorderTrade | GroupProduct)[] = [];

  // Hoang Diu Gate 
  dulieuI_gateII: (BorderTrade | GroupProduct)[] = [];
  dulieuII_gateII: (BorderTrade | GroupProduct)[] = [];
  dulieuIII_gateII: (BorderTrade | GroupProduct)[] = [];
  dulieuIV_gateII: (BorderTrade | GroupProduct)[] = [];
  dulieuV_gateII: (BorderTrade | GroupProduct)[] = [];

  // Loc Thinh Gate 
  dulieuI_gateIII: (BorderTrade | GroupProduct)[] = [];
  dulieuII_gateIII: (BorderTrade | GroupProduct)[] = [];
  dulieuIII_gateIII: (BorderTrade | GroupProduct)[] = [];
  dulieuIV_gateIII: (BorderTrade | GroupProduct)[] = [];
  dulieuV_gateIII: (BorderTrade | GroupProduct)[] = [];

  filteredDataSource: (BorderTrade | GroupProduct)[] = [];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  isChecked: boolean;
  pagesize: number = 0;
  curentmonth: number = new Date().getMonth() + 1;
  @ViewChild("table", { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild("paginator", { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  groupI: GroupProduct;
  groupII: GroupProduct;
  groupIII: GroupProduct;
  groupIV: GroupProduct;
  groupV: GroupProduct;
  Id_Array: number[] = [];
  ds_san_pham_chu_luc: any[] = [
    { id: 1, ten_sp: 'Hạt điều' }
  ]
  TongKimNgachThangNhomIxk: number = 0;
  TongLuongThangNhomIxk: number = 0;
  TongKimNgachThangNhomInk: number = 0;
  TongLuongThangNhomInk: number = 0;

  TongKimNgachThangNhomIIxk: number = 0;
  TongLuongThangNhomIIxk: number = 0;
  TongKimNgachThangNhomIInk: number = 0;
  TongLuongThangNhomIInk: number = 0;

  TongKimNgachThangNhomIIIxk: number = 0;
  TongLuongThangNhomIIIxk: number = 0;
  TongKimNgachThangNhomIIInk: number = 0;
  TongLuongThangNhomIIInk: number = 0;

  TongKimNgachThangNhomIVxk: number = 0;
  TongLuongThangNhomIVxk: number = 0;
  TongKimNgachThangNhomIVnk: number = 0;
  TongLuongThangNhomIVnk: number = 0;

  TongKimNgachThangNhomVxk: number = 0;
  TongLuongThangNhomVxk: number = 0;
  TongKimNgachThangNhomVnk: number = 0;
  TongLuongThangNhomVnk: number = 0;

  // Hoa Lu
  TongKimNgachxk: number = 0;
  TongKimNgachnk: number = 0;

  // Hoang Diu
  TongKimNgachxkII: number = 0;
  TongKimNgachnkII: number = 0;

  // Loc Thinh
  TongKimNgachxkIII: number = 0;
  TongKimNgachnkIII: number = 0;

  // tong kim ngach ca 3 cua khau
  TongKimNgach3xk: number = 0;
  TongKimNgach3nk: number = 0;
  //Private Variable for TS
  private _linkOutput: LinkModel = new LinkModel();
  constructor(
    public excelService: ExcelService,
    private sctService: SCTService,
    private matDialog: MatDialog,
    private marketService: MarketService,
    private _breadCrumService: BreadCrumService
  ) { }

  ngOnInit() {
    // this.autoOpen();
    this.createGroup();
    console.log(this.groupI)
    this.getThuongMaiBG(this.curentmonth);
    this.autoOpen();
    this.sendLinkToNext(true);
    console.log("Border Trade:", this._linkOutput.title);
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  createGroup() {
    this.initGroup(this.groupI = new GroupProduct(), 1);
    this.initGroup(this.groupII = new GroupProduct(), 2);
    this.initGroup(this.groupIII = new GroupProduct(), 3);
    this.initGroup(this.groupIV = new GroupProduct(), 4);
    this.initGroup(this.groupV = new GroupProduct(), 5);
  }

  initGroup(gr: GroupProduct, code: number) {
    gr.group_code = code;
    gr.group_name = this.danh_sach[code - 1].value;
    gr.isGroup = true;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.getThuongMaiBGGateII();
    // this.getThuongMaiBGGateIII();

  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  // getTotalCost() {
  //   return this.dataSource.data.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  // }

  selectGate(id_gate) {

    this.id_cua_khau = id_gate;
    let tem_cua_khau = this.danh_sach_cua_khau.find(item => item.id_cua_khau === id_gate);
    this.cua_khau = tem_cua_khau.ten_cua_khau;
    // this.Id_Array = [];

    this.getThuongMaiBG(this.curentmonth);
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  selectMonth(month) {
    this.curentmonth = month;
    this.getThuongMaiBG(this.curentmonth);
    this.Id_Array = [];

  }
  dulieutonghop() {
    let three_ck = [
      { cua_khau: 'Hoa Lư - ', TongKimNgachxk: this.TongKimNgachxk, TongKimNgachnk: this.TongKimNgachnk },
      { cua_khau: 'Hoàng Diệu - ', TongKimNgachxk: this.TongKimNgachxkII, TongKimNgachnk: this.TongKimNgachnkII },
      { cua_khau: 'Lộc Thịnh', TongKimNgachxk: this.TongKimNgachxkIII, TongKimNgachnk: this.TongKimNgachnkIII },
    ];
    this.cua_khau = '';
    three_ck.forEach(item => {
      this.cua_khau = this.cua_khau.concat(item.cua_khau);
    });
    console.log('zzzz', this.cua_khau, this.TongKimNgachxk, this.TongKimNgachnk)
  }

  getThuongMaiBG(thang) {
    this.initValueXNK();
    switch (this.id_cua_khau) {
      case 1:
        this.getThuongMaiBGGateI();
        break;
      case 2:
        this.getThuongMaiBGGateII();
        break;
      case 3:
        this.getThuongMaiBGGateIII();
        break;
      case 4:
        this.AlldataSource = [];
        this.excuteAllGate()
        break;
      default:
        break;
    }
  }

  excuteAllGate() {
    let tem = new Date().getFullYear() * 100 + this.curentmonth;
    const excuteallgate = forkJoin(
      [
        this.sctService.GetDanhSachXuatNhapKhauBG(tem, 1),
        this.sctService.GetDanhSachXuatNhapKhauBG(tem, 2),
        this.sctService.GetDanhSachXuatNhapKhauBG(tem, 3)
      ]).pipe(tap(console.log)).subscribe((data) => {
        this.xulyDulieunhomI(data[0]);
        this.initValueXNK();
        this.xulyDulieunhomII(data[1]);
        this.initValueXNK();
        this.xulyDulieunhomIII(data[2]);
        let tongxk3 = this.TongKimNgachxk;
        let tongnk3 = this.TongKimNgachnk;
        this.TongKimNgach3xk = this.TongKimNgachxk + this.TongKimNgachxkII + this.TongKimNgachxkIII;
        this.TongKimNgach3nk = this.TongKimNgachnk + this.TongKimNgachnkII + this.TongKimNgachnkIII;
        // this.AlldataSource = [this.dataSourceI, this.dataSourceII, this.dataSourceIII]
        this.dulieutonghop();
      })
  }

  xulyDulieunhomI(result) {
    this.getNhomI(result, this.dulieuI_gateI);
    this.getNhomII(result, this.dulieuII_gateI);
    this.getNhomIII(result, this.dulieuIII_gateI);
    this.getNhomIV(result, this.dulieuIV_gateI);
    this.getNhomV(result, this.dulieuV_gateI);
    this.dataSourceI = [...result.data[0], ...result.data[1], ...result.data[2], ...result.data[3], ...result.data[4], ...result.data[5], ...result.data[6], ...result.data[7], ...result.data[8], ...result.data[9]];
    this.dataSource = this.dataSourceI
    this.AlldataSource.push({ data: this.dataSourceI, cua_khau: 'Hoa Lư' })
    console.log(this.dataSourceI)

    this.TongKimNgachxk = this.TongKimNgachThangNhomIxk + this.TongKimNgachThangNhomIIxk + this.TongKimNgachThangNhomIIIxk + this.TongKimNgachThangNhomIVxk + this.TongKimNgachThangNhomVxk;
    this.TongKimNgachnk = this.TongKimNgachThangNhomInk + this.TongKimNgachThangNhomIInk + this.TongKimNgachThangNhomIIInk + this.TongKimNgachThangNhomIVnk + this.TongKimNgachThangNhomVnk;
    console.log('tong xk', this.TongKimNgachxk)
  }
  xulyDulieunhomII(result) {
    this.getNhomI(result, this.dulieuI_gateII);
    this.getNhomII(result, this.dulieuII_gateII);
    this.getNhomIII(result, this.dulieuIII_gateII);
    this.getNhomIV(result, this.dulieuIV_gateII);
    this.getNhomV(result, this.dulieuV_gateII);
    this.dataSourceII = [...result.data[0], ...result.data[1], ...result.data[2], ...result.data[3], ...result.data[4], ...result.data[5], ...result.data[6], ...result.data[7], ...result.data[8], ...result.data[9]]
    this.dataSource = this.dataSourceII
    this.AlldataSource.push({ data: this.dataSourceII, cua_khau: 'Hoang Diệu' })
    console.log(this.dataSourceII)

    this.TongKimNgachxkII = this.TongKimNgachThangNhomIxk + this.TongKimNgachThangNhomIIxk + this.TongKimNgachThangNhomIIIxk + this.TongKimNgachThangNhomIVxk + this.TongKimNgachThangNhomVxk;
    this.TongKimNgachnkII = this.TongKimNgachThangNhomInk + this.TongKimNgachThangNhomIInk + this.TongKimNgachThangNhomIIInk + this.TongKimNgachThangNhomIVnk + this.TongKimNgachThangNhomVnk;
    console.log('tong xk', this.TongKimNgachxk)
  }

  xulyDulieunhomIII(result) {
    this.getNhomI(result, this.dulieuI_gateIII);
    this.getNhomII(result, this.dulieuII_gateIII);
    this.getNhomIII(result, this.dulieuIII_gateIII);
    this.getNhomIV(result, this.dulieuIV_gateIII);
    this.getNhomV(result, this.dulieuV_gateIII);
    this.dataSourceIII = [...result.data[0], ...result.data[1], ...result.data[2], ...result.data[3], ...result.data[4], ...result.data[5], ...result.data[6], ...result.data[7], ...result.data[8], ...result.data[9]]
    this.dataSource = this.dataSourceIII
    this.AlldataSource.push({ data: this.dataSourceIII, cua_khau: 'Lộc Thịnh' })
    console.log(this.dataSourceIII)
    console.log(this.AlldataSource)

    this.TongKimNgachxkIII = this.TongKimNgachThangNhomIxk + this.TongKimNgachThangNhomIIxk + this.TongKimNgachThangNhomIIIxk + this.TongKimNgachThangNhomIVxk + this.TongKimNgachThangNhomVxk;
    this.TongKimNgachnkIII = this.TongKimNgachThangNhomInk + this.TongKimNgachThangNhomIInk + this.TongKimNgachThangNhomIIInk + this.TongKimNgachThangNhomIVnk + this.TongKimNgachThangNhomVnk;
    console.log('tong xk', this.TongKimNgachxk)
  }

  initValueXNK() {
    this.TongKimNgachThangNhomIxk = 0
    this.TongKimNgachThangNhomIIxk = 0
    this.TongKimNgachThangNhomIIIxk = 0
    this.TongKimNgachThangNhomIVxk = 0
    this.TongKimNgachThangNhomVxk = 0
    // this.TongKimNgachxk = 0
    this.TongKimNgachThangNhomInk = 0;
    this.TongKimNgachThangNhomIInk = 0;
    this.TongKimNgachThangNhomIIInk = 0;
    this.TongKimNgachThangNhomIVnk = 0;
    this.TongKimNgachThangNhomVnk = 0;
    // this.TongKimNgachnk = 0;
    if(this.id_cua_khau !==4){
      this.AlldataSource = [];
    }
  }

  getThuongMaiBGGateI() {
    this.initValueXNK();
    let tem = new Date().getFullYear() * 100 + this.curentmonth;
    this.sctService.GetDanhSachXuatNhapKhauBG(tem, this.id_cua_khau).subscribe((result) => {
      this.xulyDulieunhomI(result)
    });
  }
  getThuongMaiBGGateII() {
    this.initValueXNK();
    let tem = new Date().getFullYear() * 100 + this.curentmonth;
    this.sctService.GetDanhSachXuatNhapKhauBG(tem, 2).subscribe((result) => {
      this.xulyDulieunhomII(result)
    });
  }
  getThuongMaiBGGateIII() {
    this.initValueXNK();
    let tem = new Date().getFullYear() * 100 + this.curentmonth;
    this.sctService.GetDanhSachXuatNhapKhauBG(tem, 3).subscribe((result) => {
      this.xulyDulieunhomIII(result)
    });
  }

  getNhomI(result, dulieu?) {
    this.sapxepXK(result.data[0], this.gr1, 1);
    this.sapxepNK(result.data[1], this.gr1, 1);
    dulieu = [...result.data[0], ...result.data[1]]

  }
  getNhomII(result, dulieu?) {
    this.sapxepXK(result.data[2], this.gr2, 2);
    this.sapxepNK(result.data[3], this.gr2, 2);
    dulieu = [...result.data[2], ...result.data[3]]
  }
  getNhomIII(result, dulieu?) {
    this.sapxepXK(result.data[4], this.gr3, 3);
    this.sapxepNK(result.data[5], this.gr3, 3);
    dulieu = [...result.data[4], ...result.data[5]]
  }
  getNhomIV(result, dulieu?) {
    this.sapxepXK(result.data[6], this.gr4, 4);
    this.sapxepNK(result.data[7], this.gr4, 4);
    dulieu = [...result.data[6], ...result.data[7]]
  }
  getNhomV(result, dulieu?) {
    this.sapxepXK(result.data[8], this.gr5, 5);
    this.sapxepNK(result.data[9], this.gr5, 5);
    dulieu = [...result.data[8], ...result.data[9]]
  }

  sapxepXK(resultDataXK, gr, ind) {
    let dataGroupIxk = this.xulysolieu(resultDataXK);
    resultDataXK.splice(0, 0, gr[0]);
    resultDataXK.splice(1, 0, gr[1]);
    // console.log(resultDataXK)
    resultDataXK.push(dataGroupIxk);
    switch (ind) {
      case 1:
        this.TongKimNgachThangNhomIxk += dataGroupIxk.kim_ngach
        break;
      case 2:
        this.TongKimNgachThangNhomIIxk += dataGroupIxk.kim_ngach
        break;
      case 3:
        this.TongKimNgachThangNhomIIIxk += dataGroupIxk.kim_ngach
        break;
      case 4:
        this.TongKimNgachThangNhomIVxk += dataGroupIxk.kim_ngach
        break;
      case 5:
        this.TongKimNgachThangNhomVxk += dataGroupIxk.kim_ngach
        break;
      default:
        break;
    }
    // this.TongKimNgachThangNhomIxk = dataGroupIxk.kim_ngach;
    // console.log(resultDataXK)

  }
  sapxepNK(resulDatatNK, gr, ind) {
    let dataGroupIxk = this.xulysolieu(resulDatatNK);
    resulDatatNK.push(dataGroupIxk);
    resulDatatNK.splice(0, 0, gr[2]);
    switch (ind) {
      case 1:
        this.TongKimNgachThangNhomInk += dataGroupIxk.kim_ngach
        break;
      case 2:
        this.TongKimNgachThangNhomIInk += dataGroupIxk.kim_ngach
        break;
      case 3:
        this.TongKimNgachThangNhomIIInk += dataGroupIxk.kim_ngach
        break;
      case 4:
        this.TongKimNgachThangNhomIVnk += dataGroupIxk.kim_ngach
        break;
      case 5:
        this.TongKimNgachThangNhomVnk += dataGroupIxk.kim_ngach
        break;
      default:
        break;
    }
  }

  xulysolieu(data) {
    let tong_so_luong = 0;
    let tong_kim_ngach = 0;
    for (const iterator of data) {
      tong_so_luong += iterator.so_luong;
      tong_kim_ngach += iterator.kim_ngach;
    }
    // this.TongLuongThangThucHien = tong_so_luong;
    // this.TongKimNgachThangThucHien = tong_kim_ngach;
    let ob = {
      id_mat_hang_xnk: 0,
      so_luong: tong_so_luong,
      don_vi: '',
      kim_ngach: tong_kim_ngach,
      ten_doanh_nghiep: ''
    }
    return ob;
  }

  isGroup(index, item): boolean {
    return item.isGroup;
  }

  log(any) {
    console.log(any);
  }

  getYears() {
    return Array(5)
      .fill(1)
      .map((element, index) => new Date().getFullYear() - index);
  }

  concatData(dataSource?, dulieuI?, dulieuII?, dulieuIII?, dulieuIV?, dulieuV?) {
    dataSource.concat(dulieuI, dulieuII, dulieuIII, dulieuIV, dulieuV);
  }

  applyGroupFilter(id_array) {
    console.log(id_array, this.Id_Array)
    this.dataSourceI = [];
    if (id_array.length == 0) {
      if (this.id_cua_khau === 1)
        this.concatData(this.dataSourceI, this.dulieuI_gateI, this.dulieuII_gateI, this.dulieuIII_gateI, this.dulieuIV_gateI, this.dulieuV_gateI);

      if (this.id_cua_khau === 2)
        this.concatData(this.dataSourceII, this.dulieuI_gateII, this.dulieuII_gateII, this.dulieuIII_gateII, this.dulieuIV_gateII, this.dulieuV_gateII);

      if (this.id_cua_khau === 3)
        this.concatData(this.dataSourceIII, this.dulieuI_gateIII, this.dulieuII_gateIII, this.dulieuIII_gateIII, this.dulieuIV_gateIII, this.dulieuV_gateIII);

      if (this.id_cua_khau === 4) {
        this.concatData(this.dataSourceI, this.dulieuI_gateI, this.dulieuII_gateI, this.dulieuIII_gateI, this.dulieuIV_gateI, this.dulieuV_gateI);
        this.concatData(this.dataSourceII, this.dulieuI_gateII, this.dulieuII_gateII, this.dulieuIII_gateII, this.dulieuIV_gateII, this.dulieuV_gateII);
        this.concatData(this.dataSourceIII, this.dulieuI_gateIII, this.dulieuII_gateIII, this.dulieuIII_gateIII, this.dulieuIV_gateIII, this.dulieuV_gateIII);
      }

    } else {
      for (const iterator of id_array) {
        switch (iterator) {
          case 1:
            this.dataSourceI = this.dataSourceI.concat(this.dulieuI_gateI);
            break;
          case 2:
            this.dataSourceI = this.dataSourceI.concat(this.dulieuII_gateI);
            break;
          case 3:
            this.dataSourceI = this.dataSourceI.concat(this.dulieuIII_gateI);
            break;
          case 4:
            this.dataSourceI = this.dataSourceI.concat(this.dulieuIV_gateI);
            break;
          case 5:
            this.dataSourceI = this.dataSourceI.concat(this.dulieuV_gateI);
            break;
          default:
            break;
        }
      }
    }
  }
}
