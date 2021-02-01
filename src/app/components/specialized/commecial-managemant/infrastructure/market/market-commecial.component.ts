//Import Library
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList, } from "@angular/core";
import * as XLSX from "xlsx";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map, isEmpty } from "rxjs/operators";
import { MatTableFilter } from "mat-table-filter";
//Import Component

//Import Model
import { HeaderMerge, ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, ToltalHeaderMerge, } from "../../../../../_models/APIModel/report.model";

//Import Services
import { ControlService } from "../../../../../_services/APIService/control.service";
import { ReportDirective } from "src/app/shared/report.directive";
import { KeyboardService } from "src/app/shared/services/keyboard.service";
import { InformationService } from "src/app/shared/information/information.service";
import { ReportService } from "src/app/_services/APIService/report.service";
import { ExcelService } from 'src/app/_services/excelUtil.service';

import * as moment from "moment";
import { CompanyDetailModel } from "src/app/_models/APIModel/domestic-market.model";
import { TreeviewConfig, TreeviewItem, TreeviewModule } from "ngx-treeview";
import { element } from "protractor";
import { MarketCommonModel } from "src/app/_models/APIModel/commecial-management.model";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { District } from "src/app/_models/district.model";
import { FilterModel } from "src/app/_models/filter.model";

interface HashTableNumber<T> {
  [key: number]: T;
}

@Component({
  selector: "app-market-commecial",
  templateUrl: "./market-commecial.component.html",
  styleUrls: ['../../../special_layout.scss'],
})
export class MarketCommecialManagementComponent implements OnInit {
  //Constant-------------------------------------------------------------------------
  public readonly OBJ_ID: number = 10592419;
  public readonly TIME_ID: number = 2020;
  public readonly ORG_ID: number = 1;
  public readonly TYPE_INDICATOR_INPUT: number = 1;
  public readonly ATTRIBUTE_CODE: string = "IND_NAME";
  public readonly UNIT_CODE: string = "IND_UNIT";
  public readonly ATTRIBUTE_DEFAULT: number = 1;
  public readonly RANK_LABLE = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 của ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} của ${length}`;
  }
  public readonly districts: FilterModel[] = [
    { key: 1, code: "PLG", name: "Phước Long" },
    { key: 2, code: "DXI", name: "Đồng Xoài" },
    { key: 3, code: "BLG", name: "Bình Long" },
    { key: 4, code: "BGM", name: "Bù Gia Mập" },
    { key: 5, code: "LNH", name: "Lộc Ninh" },
    { key: 6, code: "BDP", name: "Bù Đốp" },
    { key: 7, code: "HQN", name: "Hớn Quản" },
    { key: 8, code: "DPU", name: "Đồng Phú" },
    { key: 9, code: "BDG", name: "Bù Đăng" },
    { key: 10, code: "CTH", name: "Chơn Thành" },
    { key: 11, code: "PRG", name: "Phú Riềng" },
  ];
  public readonly businesses: FilterModel[] = [
    { key: 1, code: "KIENCO", name: "Kiên cố" },
    { key: 2, code: "BANKIENCO", name: "Bán kiên cố" },
    { key: 3, code: "CHUACONHUCAU", name: "Chưa có nhu cầu xây dựng" },
    { key: 4, code: "DEXUAT", name: "Đề xuất xây dựng" },
    { key: 5, code: "KEHOACH", name: "Đã có kế hoạch xây dựng" },
    { key: 1, code: "KHAC", name: "Khác" },
  ];

  public readonly marketRanks: FilterModel[] = [
    { key: 1, code: "HANGI", name: "Chợ hạng I" },
    { key: 2, code: "HANGII", name: "Chợ hạng II" },
    { key: 3, code: "HANGIII", name: "Chợ hạng III" },
    { key: 4, code: "HANGIV", name: "Chợ khác" },
    { key: 5, code: "HANGV", name: "Chưa có chợ" },
  ];
  public readonly managerTypes: FilterModel[] = [
    { key: 1, code: "BAN", name: "Ban quản lý" },
    { key: 2, code: "TO", name: "Tổ quản lý" },
    { key: 3, code: "DNHTX", name: "Doanh nghiệp/Hợp tác xã" },
  ];

  //Viewchild & Input-----------------------------------------------------------------------
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>;
  @ViewChild("new_element", { static: false }) ele: ElementRef;
  @ViewChild("form", { static: false }) ngForm: NgForm;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HTTM - Chợ');

    XLSX.writeFile(wb, 'HTTM - Chợ.xlsx');

  }

  //Variable for HTML&TS-------------------------------------------------------------------------
  public year: number = 2019;
  //Variable for Total---------------------------------------------------------------------------
  public tong_SoCho: number = 0;
  //--
  public diaban_NongThon: number = 0;
  public diaban_ThanhThi: number = 0;
  public diaban_DauMoi: number = 0;
  public diaban_TrongQuyHoach: number = 0;
  public diaban_TuPhat: number = 0;
  public diaban_Khac: number = 0;
  //--
  public hang_HangI: number = 0;
  public hang_HangII: number = 0;
  public hang_HangIII: number = 0;
  //--
  public xaydung_Moi: number = 0;
  public xaydung_CaiTao:number = 0;
  public xaydung_KhongHoatDong: number = 0;
  public xaydung_KhongHoatDong70:number = 0;
  public xaydung_ChuyenDoi: number = 0;
  //--
  public quanly_BanTo:number = 0;
  public quanly_DoanhNghiep:number = 0;
  public quanly_HopTacXa:number = 0;
  public quanly_HoKinhDoanh:number = 0;
  //--
  public kinhdoanh_choBanLe: number = 0;
  public kinhdoanh_choDauMoiChuyenDoanh: number =0;
  public kinhdoanh_choDauMoiTongHop:number =0;
  //--
  public congtrinh_KienCo: number = 0;
  public congtrinh_Tam: number = 0;
  public congtrinh_BanKienCo: number = 0;
  //--
  public tongvon_DNHTXHL:number =0;
  public tongvon_Khac:number = 0;
  public tongvon_VonNganSachTW: number = 0;
  public tongvon_VonNganSachDiaPhuong: number = 0;
  //--
  public chokhac_NgoaiQuyHoach:number = 0;
  public chokhac_ChoDem:number = 0;
  public chokhac_BienGioi:number = 0;


  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public filteredDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public attributes: Array<ReportAttribute> = [];
  public attributeHeaders: Array<any>;
  public dataSource: MatTableDataSource<ReportTable> = new MatTableDataSource<ReportTable>();
  //Variable for only TS-------------------------------------------------------------------------
  private _obj_id: number;
  private _mergeHeadersColumn: Array<string> = [];
  private _indexOftableMergeHader: number = 0;
  private _time_id: number;
  private _org_id: number = 0;
  private _rows: number = 0;
  private _indicators: Array<ReportIndicator> = [];
  private _datarows: Array<ReportDatarow> = [];
  private _object: ReportOject[] = [];
  private _tableData: MatTableDataSource<ReportTable> = new MatTableDataSource<ReportTable>();
  //Angular FUnction --------------------------------------------------------------------
  constructor(
    public excelService: ExcelService,
    public reportSevice: ReportService,
    public route: ActivatedRoute,
    public keyboardservice: KeyboardService,
    public info: InformationService
  ) { }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    this._org_id = parseInt(data.org_id);
    this._obj_id = this.OBJ_ID;
    this._time_id = this.TIME_ID;
    this.GetReportById(this._obj_id, this._time_id, this._org_id);
    this._autoOpenPanel();
  }

  //Xuất excel
  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
  cols: Array<any> = [];
  filteredOptions: any[];
  getListString(list: any[]) {
    return list.map((x) => x.name);
  }

  GetReportById(obj_id: number, time_id: number, org_id: number) {
    console.log("+ Function: GetReportById(obj_id:", +obj_id + ",time_id: ", +time_id + ", org_id:" + org_id + ")");
    this.reportSevice
      .GetReportByKey(obj_id, time_id, org_id)
      .subscribe((allRecord) => {
        this.cols = [];
        allRecord.data[1].forEach((element) => {
          if (element.attr_code != "IND_NAME")
            this.cols.push({
              field: element.fld_code,
              header: element.attr_name,
            });
          else
            this.cols.push({
              field: element.attr_code,
              header: element.attr_name,
            });
        });

        this.attributes = allRecord.data[1] as ReportAttribute[];
        this.attributes.sort((a, b) => a.attr_code.localeCompare(b.attr_code));
        this._indicators = allRecord.data[2] as ReportIndicator[];
        this._indicators.sort((a, b) =>
          a.ind_code.toLocaleString().localeCompare(b.ind_code.toLocaleString())
        );
        console.log(this._indicators);
        this._datarows = allRecord.data[3] as ReportDatarow[];
        this._object = allRecord.data[0];
        this.CreateMergeHeaderTable(this.attributes);
        this.CreateReportTable();
        this._paginatorAgain();
        this._autoOpenPanel()
      });
  }

  convertTimeIdToTimePeriod(time_id: number): string {
    let time: string = time_id.toString();
    switch (time.length) {
      case 4:
        return "Năm " + time;
      case 6:
        return "Tháng " + time.substr(4, 2) + " năm " + time.slice(0, 4);
      case 5:
        return "Quý " + time.substr(4, 1) + " năm " + time.slice(0, 4);
      default:
        return time;
    }
  }

  countChildNode(attr_id: number, attributes: ReportAttribute[]): number {
    var temp = attributes.filter((x) => x.parent_id == attr_id);
    if (temp.length == 0) return 1;
    else {
      let sum = 0;
      temp.forEach((attr) => {
        sum += this.countChildNode(attr.attr_id, attributes);
      });
      return sum;
    }
  }

  CreateMergeHeaderTable(attributesValue: ReportAttribute[]) {
    let attributes: ReportAttribute[] = [];
    attributesValue.forEach((val) => attributes.push(Object.assign({}, val)));
    let hashTableParentLength: HashTableNumber<number> = {};
    attributes = attributes.filter((a) => a.attr_code.toLowerCase() != "rn");

    attributes.forEach((element) => {
      hashTableParentLength[element.attr_id] = this.countChildNode(
        element.attr_id,
        attributes
      );
    });
    let loopCount: number = 0;
    while (attributes.length > 3) {
      loopCount += 1;
      this._indexOftableMergeHader += 1;
      let totlmerge: ToltalHeaderMerge = new ToltalHeaderMerge();
      let mergerHaders: HeaderMerge[] = [];
      let layerTop: ReportAttribute[] = attributes.filter(
        (element) => element.parent_id == null
      );
      let lengthBeforeOfAttributes: number = attributes.length;
      attributes = attributes.filter(
        (e) =>
          e.parent_id != null ||
          e.is_default == 1 ||
          hashTableParentLength[e.attr_id] == 1
      );
      attributes.forEach((attribute) => {
        //if (attribute.is_default == 1) {
        attribute.attr_code = attribute.attr_code + loopCount.toString();
        //}
      });
      layerTop.forEach((layer) => {
        let mergeHeader: HeaderMerge = new HeaderMerge();
        mergeHeader.colLenght = hashTableParentLength[layer.attr_id]
          ? hashTableParentLength[layer.attr_id]
          : 1;
        mergeHeader.colName = (layer.attr_code + "_TEST").toLowerCase();
        mergeHeader.colText =
          hashTableParentLength[layer.attr_id] > 1 &&
            hashTableParentLength[layer.attr_id]
            ? layer.attr_name
            : "";
        mergeHeader.colDefault = layer.is_default;
        mergerHaders.push(mergeHeader);
      });
      this._mergeHeadersColumn = mergerHaders
        .sort((a, b) => b.colDefault - a.colDefault)
        .map((c) => c.colName.toLowerCase());
      totlmerge.headerColName = this._mergeHeadersColumn;
      this._mergeHeadersColumn = [];
      totlmerge.headerMerge = mergerHaders;
      this.tableMergeHader.push(totlmerge);
      attributes.forEach((element) => {
        layerTop.forEach((layer) => {
          if (element.parent_id == layer.attr_id) {
            element.parent_id = null;
          }
        });
      });
      if (lengthBeforeOfAttributes == attributes.length) {
        break;
      }
    }
    this.tableMergeHader.pop();
  }

  CreateReportTable() {
    this.attributes = this.attributes.filter(
      (a) =>
        a.fld_code &&
        a.fld_code.toLowerCase() != "null" &&
        a.attr_code.toLowerCase() != "ind_code" &&
        a.attr_code.toLowerCase() != "rn"
    );
    this.attributeHeaders = this.attributes
      .sort((a, b) => b.is_default - a.is_default)
      .filter((a) => a.fld_code.toLowerCase() != null)
      .map((c) =>
        c.is_default == 1 ? c.attr_code.toLowerCase() : c.fld_code.toLowerCase()
      );
    this.attributeHeaders = this.attributeHeaders.filter(
      (a) => a.toLowerCase() != "ind_code" && a.toLowerCase() != "rn"
    );
    this.attributeHeaders.unshift("index");
    console.log("Attribute Header:", this.attributeHeaders);
    for (let index = 0; index < this._indicators.length; index++) {
      const elementIndicator = this._indicators[index];
      const elementDatarow = this._datarows.find(
        (e) => e.ind_id == elementIndicator.ind_id
      );

      let tableRow: ReportTable = new ReportTable();
      tableRow.ind_formula = elementIndicator.formula;
      tableRow.ind_id = elementIndicator.ind_id;
      tableRow.ind_name = elementIndicator.ind_name;
      tableRow.ind_type = elementIndicator.ind_type;
      tableRow.ind_unit = elementIndicator.ind_unit;
      tableRow.ind_parent_id = elementIndicator.parent_id;
      if (elementDatarow) {
        tableRow.fc01 = elementDatarow.fc01 ? elementDatarow.fc01 : "";
        tableRow.fc02 = elementDatarow.fc02 ? elementDatarow.fc02 : "";
        tableRow.fc03 = elementDatarow.fc03 ? elementDatarow.fc03 : "";
        tableRow.fc04 = elementDatarow.fc04 ? elementDatarow.fc04 : "";
        tableRow.fc05 = elementDatarow.fc05 ? elementDatarow.fc05 : "";
        tableRow.fc06 = elementDatarow.fc06 ? elementDatarow.fc06 : "";
        tableRow.fc07 = elementDatarow.fc07 ? elementDatarow.fc07 : "";
        tableRow.fc08 = elementDatarow.fc08 ? elementDatarow.fc08 : "";
        tableRow.fc09 = elementDatarow.fc09 ? elementDatarow.fc09 : "";
        tableRow.fc10 = elementDatarow.fc10 ? elementDatarow.fc10 : "";
        tableRow.fc11 = elementDatarow.fc11 ? elementDatarow.fc11 : "";
        tableRow.fc12 = elementDatarow.fc12 ? elementDatarow.fc12 : "";
        tableRow.fc13 = elementDatarow.fc13 ? elementDatarow.fc13 : "";
        tableRow.fc14 = elementDatarow.fc14 ? elementDatarow.fc14 : "";
        tableRow.fc15 = elementDatarow.fc15 ? elementDatarow.fc15 : "";
        tableRow.fc16 = elementDatarow.fc16 ? elementDatarow.fc16 : "";
        tableRow.fc17 = elementDatarow.fc17 ? elementDatarow.fc17 : "";
        tableRow.fc18 = elementDatarow.fc18 ? elementDatarow.fc18 : "";
        tableRow.fc19 = elementDatarow.fc19 ? elementDatarow.fc19 : "";
        tableRow.fc10 = elementDatarow.fc10 ? elementDatarow.fc20 : "";
        tableRow.fn01 = elementDatarow.fn01 ? elementDatarow.fn01 : null;
        tableRow.fn01 = elementDatarow.fn01 ? elementDatarow.fn01 : null;
        tableRow.fn02 = elementDatarow.fn02 ? elementDatarow.fn02 : null;
        tableRow.fn03 = elementDatarow.fn03 ? elementDatarow.fn03 : null;
        tableRow.fn04 = elementDatarow.fn04 ? elementDatarow.fn04 : null;
        tableRow.fn05 = elementDatarow.fn05 ? elementDatarow.fn05 : null;
        tableRow.fn06 = elementDatarow.fn06 ? elementDatarow.fn06 : null;
        tableRow.fn07 = elementDatarow.fn07 ? elementDatarow.fn07 : null;
        tableRow.fn08 = elementDatarow.fn08 ? elementDatarow.fn08 : null;
        tableRow.fn09 = elementDatarow.fn09 ? elementDatarow.fn09 : null;
        tableRow.fn10 = elementDatarow.fn10 ? elementDatarow.fn10 : null;
        tableRow.fn11 = elementDatarow.fn11 ? elementDatarow.fn11 : null;
        tableRow.fn12 = elementDatarow.fn12 ? elementDatarow.fn12 : null;
        tableRow.fn13 = elementDatarow.fn13 ? elementDatarow.fn13 : null;
        tableRow.fn14 = elementDatarow.fn14 ? elementDatarow.fn14 : null;
        tableRow.fn15 = elementDatarow.fn15 ? elementDatarow.fn15 : null;
        tableRow.fn16 = elementDatarow.fn16 ? elementDatarow.fn16 : null;
        tableRow.fn17 = elementDatarow.fn17 ? elementDatarow.fn17 : null;
        tableRow.fn18 = elementDatarow.fn18 ? elementDatarow.fn18 : null;
        tableRow.fn19 = elementDatarow.fn19 ? elementDatarow.fn19 : null;
        tableRow.fn20 = elementDatarow.fn20 ? elementDatarow.fn20 : null;
        tableRow.fd01 = elementDatarow.fd01 ? elementDatarow.fd01 : new Date();
        tableRow.fd02 = elementDatarow.fd02 ? elementDatarow.fd02 : new Date();
        tableRow.fd03 = elementDatarow.fd03 ? elementDatarow.fd03 : new Date();
        tableRow.fd04 = elementDatarow.fd04 ? elementDatarow.fd04 : new Date();
        tableRow.fd05 = elementDatarow.fd05 ? elementDatarow.fd05 : new Date();
      } else {
        tableRow.fc01 = "";
        tableRow.fc02 = "";
        tableRow.fc03 = "";
        tableRow.fc04 = "";
        tableRow.fc05 = "";
        tableRow.fc06 = "";
        tableRow.fc07 = "";
        tableRow.fc08 = "";
        tableRow.fc09 = "";
        tableRow.fc10 = "";
        tableRow.fn01 = null;
        tableRow.fn01 = null;
        tableRow.fn02 = null;
        tableRow.fn03 = null;
        tableRow.fn04 = null;
        tableRow.fn05 = null;
        tableRow.fn06 = null;
        tableRow.fn07 = null;
        tableRow.fn08 = null;
        tableRow.fn09 = null;
        tableRow.fn10 = null;
        tableRow.fn11 = null;
        tableRow.fn12 = null;
        tableRow.fn13 = null;
        tableRow.fn14 = null;
        tableRow.fn15 = null;
        tableRow.fn16 = null;
        tableRow.fn17 = null;
        tableRow.fn18 = null;
        tableRow.fn19 = null;
        tableRow.fn20 = null;
        tableRow.fd01 = new Date();
        tableRow.fd02 = new Date();
        tableRow.fd03 = new Date();
        tableRow.fd04 = new Date();
        tableRow.fd05 = new Date();
      }
      if (tableRow.ind_name.length > 10)
        this._tableData.data.push(tableRow);
    }
    this._tableData.data.forEach((element) => {
      if (element.ind_formula == null && element.ind_type == 1) this._rows++;
    });
    this.dataSource.data = [...this._tableData.data];
    console.log("attributes:", this.attributes);
    this._caculator(this.dataSource.data);
  }


  getNestedChildren(indicators: Array<ReportIndicator>, parent: number) {
    var out = [];
    for (var i in indicators) {
      if (indicators[i].parent_id == parent) {
        let temp = new TreeviewItem({
          text: indicators[i].ind_name,
          value: indicators[i].ind_id,
        });
        var children = this.getNestedChildren(indicators, indicators[i].ind_id);
        if (children.length) {
          temp.children = children;
        }
        out.push(temp);
      }
    }
    return out;
  }

  isSticky(column): boolean {
    return column.attr_code.toLowerCase() === "ind_unit" ? true : false;
  }

  private _conditionArray: HashTableNumber<number[]> = {};
  applyCondictionFilter(type, event: any) {
    this._conditionArray[type] = event.value;

    console.log("Filter: ", this._conditionArray);
    this._filterDataSource();
  }

  applyExpireCheck(event) {
    this.filteredDataSource.filter = event.checked ? "true" : "";
  }
  //FUNCTION FOR ONLY TS _------------------------------
  private _filterDataSource() {
    if (this._countCondition() > 0) {
      let dataFilterOriginal: ReportTable[] = [];
      let dataFilterFinal: ReportTable[] = [];
      dataFilterOriginal = [... this._tableData.data];
      Object.keys(this._conditionArray).forEach(key => {
        let array = this._conditionArray[key];
        if (array && array.length > 0) {
          switch (key) {
            case "1":
              array.forEach((element) => {
                dataFilterOriginal.filter((x) => x.fc03.includes(element)).forEach((item) => dataFilterFinal.push(item));
              });
              break;
            case "2":
              array.forEach((element) => {
                if (element == 1) {
                  dataFilterOriginal.filter((x) => x.fn03 == 1).forEach((item) => dataFilterFinal.push(item));
                }
                else if (element == 2) {
                  dataFilterOriginal.filter((x) => x.fn07 == 1).forEach((item) => dataFilterFinal.push(item));
                } else {
                  dataFilterOriginal.filter((x) => x.fn09 == 1).forEach((item) => dataFilterFinal.push(item));
                }
              });
              break;
            case "3":
              array.forEach((element) => {
                dataFilterOriginal.filter((x) => x.fc11.includes(element)).forEach((item) => dataFilterFinal.push(item));
              });

              break;
            default:
              array.forEach((element) => {
                if (element == 1) {
                  dataFilterOriginal.filter((x) => x.fn10 >= 1).forEach((item) => dataFilterFinal.push(item));
                }
                else if (element == 2) {
                  dataFilterOriginal.filter((x) => x.fn20 >= 1).forEach((item) => dataFilterFinal.push(item));
                } else {
                  dataFilterOriginal.filter((x) => x.fn08 >= 1).forEach((item) => dataFilterFinal.push(item));
                }
              });
              break;
          }
          dataFilterOriginal = [...dataFilterFinal];
          dataFilterFinal = [];
        }

      });
      this.dataSource = new MatTableDataSource<ReportTable>(dataFilterOriginal);
    } else {
      this.dataSource = new MatTableDataSource<ReportTable>(this._tableData.data);
    }
    this._paginatorAgain();
    this._caculator(this.dataSource.data);
  }
  private _countCondition(): number {
    let countOfCondition = 0;
    Object.keys(this._conditionArray).forEach(key => {
      if (this._conditionArray[key])
        countOfCondition += this._conditionArray[key].length;
    });
    return countOfCondition;
  }
  private _autoOpenPanel() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }
  private _caculator(data: Array<ReportTable>) {

    //--
    this.diaban_NongThon = data.filter((x) => x.fc01.includes("Nông thôn")).length;
    this.diaban_ThanhThi = data.filter((x) => x.fc01.includes("Thành thị")).length;
    //
    this.tong_SoCho = this.diaban_NongThon + this.diaban_ThanhThi;
    //--
    this.hang_HangI = data.filter((x) => x.fn03 == 1).length;
    this.hang_HangII = data.filter((x) => x.fn07 == 1).length;;
    this.hang_HangIII = data.filter((x) => x.fn09 == 1).length;;
    //--
    this.congtrinh_KienCo = data.filter((x) => x.fc11.includes("Kiên cố")).length;

    this.congtrinh_BanKienCo = data.filter((x) => x.fc11.includes("Bán kiên cố")).length;
    this.congtrinh_Tam = this.tong_SoCho - this.congtrinh_BanKienCo - this.congtrinh_KienCo;
    //--
    this.kinhdoanh_choBanLe = 0;
    //--
    //--

    data.forEach(element => {
      if (element.fn04)
        this.tongvon_VonNganSachTW += element.fn04;
    });
    data.forEach(element => {
      if (element.fn11)
        this.tongvon_VonNganSachDiaPhuong += element.fn11;
    });
    //--
  }
  private _paginatorAgain() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
    this.paginator._intl.getRangeLabel = this.RANK_LABLE;
  }
}
