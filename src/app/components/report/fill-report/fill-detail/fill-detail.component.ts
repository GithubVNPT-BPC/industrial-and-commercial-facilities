import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, Attribute, QueryList, ViewChildren, Input } from "@angular/core";
import * as XLSX from "xlsx";
import { Subject } from 'rxjs';

import { ReportService } from "../../../../_services/APIService/report.service";

import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, HeaderMerge, ToltalHeaderMerge } from "../../../../_models/APIModel/report.model";
import { MatTableDataSource } from "@angular/material/table";
import { Router, ActivatedRoute } from "@angular/router";
import { ExcelService } from "src/app/_services/excelUtil.service";

import { ReportDirective } from "../../../../shared/report.directive";
import { KeyboardService } from "../../../../shared/services/keyboard.service";
import { InformationService } from "src/app/shared/information/information.service";
import { Location } from "@angular/common";
import { element } from "protractor";
import { merge } from "rxjs";
import moment from "moment";
import { ThrowStmt } from "@angular/compiler";
import { AttachSession } from "protractor/built/driverProviders";
import { time } from "highcharts";

interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: "app-fill-report",
  templateUrl: "fill-detail.component.html",
  styleUrls: ["../../report_layout.scss"],
})
export class FillReportComponent implements OnInit {
  public readonly TYPE_INDICATOR_INPUT: number = 1;
  public readonly ATTRIBUTE_CODE: string = "IND_NAME";
  public readonly UNIT_CODE: string = "IND_UNIT";
  public readonly ATTRIBUTE_DEFAULT: number = 1;

  public readonly numberFieldProperty: string[] = ['fn01', 'fn02', 'fn03', 'fn04', 'fn05', 'fn06', 'fn07', 'fn08', 'fn09',
    'fn10', 'fn11', 'fn12', 'fn13', 'fn14', 'fn15', 'fn16', 'fn17', 'fn18', 'fn19', 'fn20'];

  public readonly oldDataReg = /^\{\{\d\}\}\{\{\w+\}\}$/;
  public readonly operatorReg = /\+|\-|\*|\//;
  public readonly previousYearRegEx = /\{\{2\}\}/;
  public readonly attributeReg = /\w\w+/;

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;

  columns: number = 1;
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>;

  arrayTextHeader = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "AA",
    "AB",
    "AC",
    "AD",
    "AE",
    "AF",
    "AG",
    "AH",
    "AI",
    "AJ",
    "AK",
    "AL",
    "AM",
    "AN",
    "AO",
    "AP",
    "AQ",
    "AR",
    "AS",
    "AT",
    "AU",
    "AV",
    "AW",
    "AX",
    "AY",
    "AZ",
    "BA",
    "BB",
    "BC",
    "BD",
    "BE",
    "BF",
    "BG",
    "BH",
    "BI",
    "BJ",
    "BK",
    "BL",
    "BM",
    "BN",
    "BO",
    "BP",
    "BQ",
    "BR",
    "BS",
    "BT",
    "BU",
    "BV",
    "AW",
    "BX",
    "BY",
    "BZ",
    "CA",
    "CB",
    "CC",
    "CD",
    "CE",
    "CF",
    "CG",
    "CH",
    "CI",
    "CJ",
    "CK",
    "CL",
    "CM",
    "CN",
    "CO",
    "CP",
    "CQ",
    "CR",
    "CS",
    "CT",
    "CU",
    "CV",
    "CW",
    "CX",
    "CY",
    "CZ",
  ];

  obj_id: number = 0;
  time_id: number;
  org_id: number = 0;
  rows: number = 0;
  is_sent: boolean = false;

  thoigianbaocao: string = "";
  tenbaocao: string = "";
  ngaybatdaubaocao: string = "";
  ngayketthucbaocao: string = "";

  attributes: Array<ReportAttribute> = [];
  attributeHeaders: Array<any>;
  indicators: Array<ReportIndicator> = [];
  // [{ formula: ' ', ind_code: 'CT01', ind_id: 123, ind_name: 'Chỉ tiêu 01', ind_type: 1, ind_unit: 'Tỷ đồng', obj_id: 123, parent_id: 123 },
  // { formula: ' ', ind_code: 'CT02', ind_id: 123, ind_name: 'Chỉ tiêu 02', ind_type: 1, ind_unit: 'Triệu đồng', obj_id: 123, parent_id: 123 },
  // { formula: ' ', ind_code: 'CT03', ind_id: 123, ind_name: 'Chỉ tiêu 03', ind_type: 10, ind_unit: '%', obj_id: 123, parent_id: 123 },
  // { formula: ' ', ind_code: 'CT04', ind_id: 123, ind_name: 'Chỉ tiêu 04', ind_type: 10, ind_unit: 'USD', obj_id: 123, parent_id: 123 },
  // { formula: ' ', ind_code: 'CT05', ind_id: 123, ind_name: 'Chỉ tiêu 05', ind_type: 1, ind_unit: 'Đồng', obj_id: 123, parent_id: 123 },]
  datarows: Array<ReportDatarow> = [];
  //  [{ data_id: 123, fc01: ' ', fc02: ' ', fc03: ' ', fc04: ' ', fc05: ' ', fc06: ' ', fc07: ' ', fc08: ' ', fc09: ' ', fc10: ' ', fd01: null, fd02: null, fd03: null, fd04: null, fd05: null, fn01: 10000, fn02: 1234, fn03: 99, fn04: 342, fn05: 1000000, fn06: 0, fn07: 0, fn08: 0, fn09: 0, fn10: 0, fn11: 0, fn12: 0, fn13: 0, fn14: 0, fn15: 0, fn16: 0, fn17: 0, fn18: 0, fn19: 0, fn20: 0, ind_id: 123, obj_id: 123, org_id: 123, time_id: 202002 },
  // { data_id: 123, fc01: ' ', fc02: ' ', fc03: ' ', fc04: ' ', fc05: ' ', fc06: ' ', fc07: ' ', fc08: ' ', fc09: ' ', fc10: ' ', fd01: null, fd02: null, fd03: null, fd04: null, fd05: null, fn01: 10000, fn02: 1234, fn03: 99, fn04: 342, fn05: 1000000, fn06: 0, fn07: 0, fn08: 0, fn09: 0, fn10: 0, fn11: 0, fn12: 0, fn13: 0, fn14: 0, fn15: 0, fn16: 0, fn17: 0, fn18: 0, fn19: 0, fn20: 0, ind_id: 123, obj_id: 123, org_id: 123, time_id: 202002 },
  // { data_id: 123, fc01: ' ', fc02: ' ', fc03: ' ', fc04: ' ', fc05: ' ', fc06: ' ', fc07: ' ', fc08: ' ', fc09: ' ', fc10: ' ', fd01: null, fd02: null, fd03: null, fd04: null, fd05: null, fn01: 10000, fn02: 1234, fn03: 99, fn04: 342, fn05: 1000000, fn06: 0, fn07: 0, fn08: 0, fn09: 0, fn10: 0, fn11: 0, fn12: 0, fn13: 0, fn14: 0, fn15: 0, fn16: 0, fn17: 0, fn18: 0, fn19: 0, fn20: 0, ind_id: 123, obj_id: 123, org_id: 123, time_id: 202002 },
  // { data_id: 123, fc01: ' ', fc02: ' ', fc03: ' ', fc04: ' ', fc05: ' ', fc06: ' ', fc07: ' ', fc08: ' ', fc09: ' ', fc10: ' ', fd01: null, fd02: null, fd03: null, fd04: null, fd05: null, fn01: 10000, fn02: 1234, fn03: 99, fn04: 342, fn05: 1000000, fn06: 0, fn07: 0, fn08: 0, fn09: 0, fn10: 0, fn11: 0, fn12: 0, fn13: 0, fn14: 0, fn15: 0, fn16: 0, fn17: 0, fn18: 0, fn19: 0, fn20: 0, ind_id: 123, obj_id: 123, org_id: 123, time_id: 202002 },
  // { data_id: 123, fc01: ' ', fc02: ' ', fc03: ' ', fc04: ' ', fc05: ' ', fc06: ' ', fc07: ' ', fc08: ' ', fc09: ' ', fc10: ' ', fd01: null, fd02: null, fd03: null, fd04: null, fd05: null, fn01: 10000, fn02: 1234, fn03: 99, fn04: 342, fn05: 1000000, fn06: 0, fn07: 0, fn08: 0, fn09: 0, fn10: 0, fn11: 0, fn12: 0, fn13: 0, fn14: 0, fn15: 0, fn16: 0, fn17: 0, fn18: 0, fn19: 0, fn20: 0, ind_id: 123, obj_id: 123, org_id: 123, time_id: 202002 }];

  object: ReportOject[] = [];
  dataSource: MatTableDataSource<ReportTable> = new MatTableDataSource<ReportTable>();

  constructor(
    public reportSevice: ReportService,
    public route: ActivatedRoute,
    public keyboardservice: KeyboardService,
    public info: InformationService,
    public excelService: ExcelService,
    public location: Location
  ) {
    this.route.queryParams.subscribe((params) => {
      this.obj_id = parseInt(params["obj_id"]);
      this.time_id = params["time_id"];
      this.org_id = params["org_id"];
    });

  }

  move(object) {
    const inputToArray = this.inputs.toArray();
    let index = inputToArray.findIndex((x) => x.element == object.element);
    switch (object.action) {
      case "UP":
        index -= this.columns;
        break;
      case "DOWN":
        index += this.columns;
        break;
      case "LEFT":
        index -= this.rows;
        break;
      case "RIGHT":
        index += this.rows;
        break;
    }

    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
      // inputToArray[index].element.nativeElement.style.backgroundColor = '#5789D8';
    }
  }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    if (this.org_id == 0)
      this.org_id = parseInt(data.org_id);

    this.GetReportById(this.obj_id, this.time_id, this.org_id);
    this.keyboardservice.keyBoard.subscribe((res) => {
      this.move(res);
    });
  }

  checkAccessObj() {
    var ret = 0;
    if (ret > 0) {
      return true;
    }
    switch (ret) {
      case -2:
        //alertify.error('Đã trình lãnh đạo!');
        break;
      case -3:
        //alertify.error('Đã trình đơn vị giao!');
        break;
      case -4:
        //alertify.error('Đơn vị giao đã phê duyệt!');
        break;
      case -7:
        //alertify.error('Đã gửi yêu cầu đính chính đến đơn vị giao!');
        break;
      case -9:
        //alertify.error('Đơn vị giao từ chối yêu cầu đính chính!');
        break;
      case -10:
        //alertify.error('Không hoàn thành!');
        break;
      case -19:
        //alertify.error('Báo cáo không tồn tại!');
        break;
      case -20:
        //alertify.error('Báo cáo chưa được giao!');
        break;
      case -21:
        //alertify.error('Báo cáo đã hết hạn!');
        break;
      case -22:
        //alertify.error('Báo cáo là nhóm báo cáo!');
        break;
      case -23:
        //alertify.error('Báo cáo chưa được kích hoạt!');
        break;
      case -24:
        //alertify.error('Tài khoản không có quyền thực hiện báo cáo!');
        break;
      case -25:
        //alertify.error('Báo cáo không phải là báo cáo số liệu, báo cáo danh sách!');
        break;
      case -26:
        //alertify.error('Báo cáo đột xuất không được thực hiện liên kết báo cáo!');
        break;
      case -99:
        //alertify.error('Có lỗi xảy ra!');
        break;
    }
    return false;
  }

  GetReportById(obj_id: number, time_id: number, org_id: number) {
    this.reportSevice
      .GetReportByKey(obj_id, time_id, org_id)
      .subscribe((allRecord) => {
        this.attributes = allRecord.data[1] as ReportAttribute[];
        this.attributes.sort((a, b) => a.attr_id - b.attr_id);
        // this.attributes.sort((a, b) => a.attr_code.localeCompare(b.attr_code));
        this.indicators = allRecord.data[2] as ReportIndicator[];
        this.datarows = allRecord.data[3] as ReportDatarow[];
        this.object = allRecord.data[0];
        if (this.object[0]) {
          this.is_sent = !(
            this.object[0].state_id == 101 ||
            this.object[0].state_id == 401
          );
          this.formatFrameReport(this.object[0]);
        }
        this.indicators.sort((a, b) => a.ind_id - b.ind_id);
        this.CreateMergeHeaderTable(this.attributes);

        this.CreateReportTable();
        //this.dataSynthesis();
      });
  }
  formatFrameReport(report: ReportOject) {
    this.tenbaocao = report.obj_name;
    this.thoigianbaocao = this.convertTimeIdToTimePeriod(
      parseInt(report.time_id)
    );
    this.ngaybatdaubaocao = moment(report.start_date).format("DD/MM/YYYY");
    this.ngayketthucbaocao = moment(report.end_date).format("DD/MM/YYYY");
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
      // if (element.parent_id != null){
      //   if (!hashTableParentLength[element.parent_id]){
      //     hashTableParentLength[element.parent_id] = 0;
      //   }
      //   hashTableParentLength[element.parent_id]  +=1;
      // }
      hashTableParentLength[element.attr_id] = this.countChildNode(
        element.attr_id,
        attributes
      );
    });
    let loopCount: number = 0;
    while (attributes.length > 3) {
      loopCount += 1;
      this.indexOftableMergeHader += 1;
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
      this.mergeHeadersColumn = mergerHaders
        .sort((a, b) => b.colDefault - a.colDefault)
        .map((c) => c.colName.toLowerCase());
      totlmerge.headerColName = this.mergeHeadersColumn;
      this.mergeHeadersColumn = [];
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
    for (let index = 0; index < this.indicators.length; index++) {
      const elementIndicator = this.indicators[index];
      const elementDatarow = this.datarows.find(
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
      this.dataSource.data.push(tableRow);
    }
    // this.summaryReportObjectId();
  }


  @ViewChild("TABLE", { static: false }) table: ElementRef;

  public exportTOExcel(filename: string, sheetname: string) {
    filename = this.tenbaocao + " - " + this.thoigianbaocao
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  uploadExcel(evt: any) {
    let data;
    let isExcelFile: boolean;
    const target: DataTransfer = <DataTransfer>(evt.target);
    isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length != 1) {
      this.inputFile.nativeElement.value = '';
    }
    else if (isExcelFile) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        let importedData = [];

        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        data = XLSX.utils.sheet_to_json(ws);
        data.forEach(item => {
          let datarow: ReportTable = new ReportTable();
          datarow.ind_name = item['TÊN CHỈ TIÊU'];
          datarow.ind_unit = item['ĐƠN VỊ TÍNH'];
          datarow.fn01 = item['Ước đến 31/12 năm báo cáo']
          importedData.push(datarow);
        });
        this.dataSource = new MatTableDataSource(importedData);
        this.info.msgSuccess("Nhập dữ liệu từ excel thành công!");
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  // summaryReportObjectId() {
  //   switch (this.obj_id) {
  //     // BÁO CÁO THÁNG - TỔNG MỨC BÁN LẺ HÀNG HÓA VÀ DOANH THU DỊCH VỤ
  //     case 1:
  //       this.CT1();
  //       break;
  //     // BÁO CÁO - CHỈ SỐ SẢN XUẤT CÔNG NGHIỆP THÁNG
  //     case 2:
  //       this.CT2();
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // CT1(){
  //   // Thuc hien thang truoc
  //   let tem2 = 0;
  //   let tem16 = 0;
  //   let tem24 = 0;
  //   // Thuc hien thang nay
  //   let _tem2 = 0;
  //   let _tem16 = 0;
  //   let _tem24 = 0;

  //   // parent_id = 2;16;24
  //   // Thuc hien thang truoc
  //   let sum_parentid2 : any[] = [];
  //   let sum_parentid16 : any[] = [];
  //   let sum_parentid24 : any[] = [];
  //   // Thuc hien thang nay
  //   // Thuc hien thang truoc
  //   let _sum_parentid2 : any[] = [];
  //   let _sum_parentid16 : any[] = [];
  //   let _sum_parentid24 : any[] = [];
  //   this.dataSource.data.forEach(element => {
  //     switch (element.ind_parent_id) {
  //       case 2:
  //         sum_parentid2.push(element);
  //         break;
  //       case 16:
  //         sum_parentid16.push(element);
  //         break;
  //       case 24:
  //         sum_parentid24.push(element);
  //         break;
  //       default:
  //         break;
  //     }
  //   });

  //   this.dataSource.data.forEach(element => {
  //     if(element.ind_parent_id == 1 && element.ind_id == 2){
  //       sum_parentid2.forEach(ele => {
  //         tem2 += ele['fn01'];
  //         _tem2 += ele['fn02'];
  //         element.fn01 = tem2;
  //         element.fn02 = _tem2;

  //       })
  //     }
  //     if(element.ind_parent_id == 1 && element.ind_id == 16){
  //       sum_parentid16.forEach(ele => {
  //         tem16 += ele['fn01'];
  //         _tem16 += ele['fn02'];
  //         element.fn01 = tem16;
  //         element.fn02 = _tem16;

  //       })
  //     }
  //     if(element.ind_parent_id == 1 && element.ind_id == 24){
  //       sum_parentid24.forEach(ele => {
  //         tem24 += ele['fn01'];
  //         _tem24 += ele['fn02'];
  //         element.fn01 = tem24;
  //         element.fn02 = _tem24;

  //       })
  //     }
  //     element.fn04 = element.fn02 - element.fn01;
  //   })
  //   this.dataSource.data[0].fn01 = tem2 + tem16 + tem24;
  //   this.dataSource.data[0].fn02 = _tem2 + _tem16 + _tem24;
  //   // Thuc hien thang nay

  // }

  // CT2(){

  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  SaveReport() {
    this.reportSevice
      .PostReportData(
        this.obj_id,
        this.time_id,
        this.org_id,
        this.dataSource.data
      )
      .subscribe(
        (response) => {
          this.info.msgSuccess("Đã lưu báo cáo thành công!");
        },
        (error) => {
          this.info.msgError("Xảy ra lỗi: " + error.message);
        }
      );
  }

  SendReport() {
    this.reportSevice
      .SendReport(this.obj_id, this.org_id, this.time_id.toString())
      .subscribe(
        (response) => {
          this.info.msgSuccess("Đã trình lãnh đạo thành công!");
        },
        (error) => {
          this.info.msgError("Xảy ra lỗi: " + error.message);
        }
      );
    this.is_sent = true;
  }

  Back() {
    this.location.back();
  }

  dataSynthesis() {
    this.rowCalculate();
    this.colCalculate();
  }

  rowCalculate() {
    this.dataSource.data.reverse().forEach(rowData => {
      switch (rowData.ind_type) {
        case 1:
          this.numberFieldProperty.forEach(fn => rowData[fn] = rowData[fn] ? rowData[fn] : null);
          break;

        case 2:
          this.numberFieldProperty.forEach(fn => rowData[fn] = null);
          break;

        case 3:
          let filteredDataRow = this.dataSource.data.filter(x => x.ind_parent_id == rowData.ind_id);
          this.numberFieldProperty.forEach(fn => rowData[fn] = filteredDataRow.reduce((a, b) => a + (b[fn] || 0), 0));
          break;

        default: {

        }
      }
    });
    this.dataSource.data.reverse();
  }

  colCalculate() {
    this.attributes.filter(x => x.formula).forEach(attribute => {
      let operands = attribute.formula.split(this.operatorReg);
      if (operands[0].match(this.oldDataReg))
        this.calculateData(operands[0], attribute.attr_code, null);
      else
        this.replaceData(operands[0], attribute.fld_code, null);
      let operator = attribute.formula.match(this.operatorReg);
      if (operator)
        if (operands[1].match(this.oldDataReg))
          this.calculateData(operands[1], attribute.attr_code, operator[0]);
        else
          this.replaceData(operands[1], attribute.fld_code, operator[0]);
    });
  }

  replaceData(formula: string, fld_code: string, operator: any): string {
    let fnProp = this.attributes.filter(x => x.attr_code == formula.substr(2, formula.length - 4))[0].fld_code;
    // this.dataSource.data.forEach(x => x[fld_code] = x[fnProp]);
    switch (operator) {
      case '+':
        this.dataSource.data.forEach(element => {
          if (element.ind_type != 2)
            element[fld_code] = element[fld_code] + element[fnProp];
        });
        break;

      case '-':
        this.dataSource.data.forEach(element => {
          if (element.ind_type != 2)
            element[fld_code] = element[fld_code] - element[fnProp];
        });
        break;

      case '*':
        this.dataSource.data.forEach(element => {
          if (element.ind_type != 2)
            element[fld_code] = element[fld_code] * element[fnProp];
        });
        break;

      case '/':
        this.dataSource.data.forEach(element => {
          if (element.ind_type != 2)
            element[fld_code] = (element[fnProp] == null || element[fnProp] == 0) ? null : element[fld_code] / element[fnProp];
        });
        break;

      default:
        this.dataSource.data.forEach(element => {
          if (element.ind_type != 2)
            element[fld_code] = element[fnProp];
        });
        break;
    }
    return fnProp;
  }

  calculateData(formula: string, attr_code: string, operator: any): string {
    let is_previous_year = formula.match(this.previousYearRegEx) ? true : false;
    let attribute_code = formula.match(this.attributeReg)[0];
    let fnProp = '';
    this.reportSevice.GetOldData(this.obj_id, this.calculateTimeId(this.time_id, is_previous_year), this.org_id,
      attribute_code, attr_code).subscribe(res => {
        fnProp = Object.getOwnPropertyNames(res.data[0])[1].toString();
        switch (operator) {
          case '+':
            res.data.forEach(element => {
              let tempRow = this.dataSource.data.filter(x => x.ind_id == element.ind_id && x.ind_type != 2)[0];
              tempRow[fnProp] = tempRow[fnProp] + element[fnProp];
            });
            break;

          case '-':
            res.data.forEach(element => {
              let tempRow = this.dataSource.data.filter(x => x.ind_id == element.ind_id && x.ind_type != 2)[0];
              tempRow[fnProp] = tempRow[fnProp] - element[fnProp];
            });
            break;

          case '*':
            res.data.forEach(element => {
              let tempRow = this.dataSource.data.filter(x => x.ind_id == element.ind_id && x.ind_type != 2)[0];
              tempRow[fnProp] = tempRow[fnProp] * element[fnProp];
            });
            break;

          case '/':
            res.data.forEach(element => {
              let tempRow = this.dataSource.data.filter(x => x.ind_id == element.ind_id && x.ind_type != 2)[0];
              tempRow[fnProp] = (element[fnProp] == null || element[fnProp] == 0) ? null : tempRow[fnProp] / element[fnProp];
            });
            break;

          default:
            res.data.forEach(element => {
              let tempRow = this.dataSource.data.filter(x => x.ind_id == element.ind_id && x.ind_type != 2)[0];
              tempRow[fnProp] = element[fnProp];
            });
            break;
        }
      })
    return fnProp;
  }

  calculateTimeId(time_id: number, is_previous_year: boolean): number {
    switch (this.object[0].submit_type) {
      case 1:
        if (!is_previous_year)
          return (time_id % 100 == 1) ? (time_id / 100 - 1) * 100 + 12 : time_id - 1;
        else
          return (time_id / 100 - 1) * 100;

      case 2:
        if (!is_previous_year)
          return (time_id % 10 == 1) ? (time_id / 10 - 1) * 10 + 4 : time_id - 1;
        else
          return (time_id / 10 - 1) * 10;

      default:
        return time_id - 1;
    }
  }
}
