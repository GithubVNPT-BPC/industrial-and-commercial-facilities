import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, Attribute, QueryList, ViewChildren, Input } from '@angular/core';
import * as XLSX from 'xlsx';

import { ReportService } from '../../../_services/APIService/report.service';

import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, HeaderMerge, ToltalHeaderMerge } from '../../../_models/APIModel/report.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { ReportDirective } from '../../../shared/report.directive';
import { KeyboardService } from '../../../shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { Location } from '@angular/common';
import { element } from 'protractor';
import { merge } from 'rxjs';
import moment from 'moment';
import { TreeviewModule } from 'ngx-treeview';


interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-standard-report',
  templateUrl: 'standard-report.component.html',
  styleUrls: ['../report_layout.scss'],
})


export class StandardReportComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  public readonly TYPE_INDICATOR_INPUT: number = 1;
  public readonly ATTRIBUTE_CODE: string = 'IND_NAME';
  public readonly UNIT_CODE: string = 'IND_UNIT';
  public readonly ATTRIBUTE_DEFAULT: number = 1;

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;

  columns: number = 1;
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>

  arrayTextHeader = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG',
    'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV',
    'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL',
    'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'AW', 'BX', 'BY', 'BZ', 'CA',
    'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP',
    'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];

  obj_id: number;
  time_id: number;
  org_id: number = 0;
  rows: number = 0;

  thoigianbaocao: string = "";
  tenbaocao: string = "";
  ngaybatdaubaocao: string = "";
  ngayketthucbaocao: string = "";

  attributes: Array<ReportAttribute> = [];
  attributeHeaders: Array<any>;
  indicators: Array<ReportIndicator> = []
  datarows: Array<ReportDatarow> = []
  object: ReportOject[] = [];
  dataSource: MatTableDataSource<ReportTable> = new MatTableDataSource<ReportTable>();

  isBlankPage: boolean = true;
  role_org_id: number = 1;
  isEditPage: boolean = false;
  years: Array<any> = [];
  editPermission: boolean = true;

  public readonly oldDataReg = /^\{\{\d\}\}\{\{\w+\}\}$/;
  public readonly operatorReg = /\+|\-|\*|\//;
  public readonly previousYearRegEx = /\{\{2\}\}/;
  public readonly attributeReg = /\w\w+/;
  public readonly numberFieldProperty: string[] = ['fn01', 'fn02', 'fn03', 'fn04', 'fn05', 'fn06', 'fn07', 'fn08', 'fn09',
    'fn10', 'fn11', 'fn12', 'fn13', 'fn14', 'fn15', 'fn16', 'fn17', 'fn18', 'fn19', 'fn20',
    'fn21', 'fn22', 'fn23', 'fn24', 'fn25', 'fn26', 'fn27', 'fn28', 'fn29', 'fn30',
    'fn31', 'fn32', 'fn33', 'fn34', 'fn35', 'fn36', 'fn37', 'fn38', 'fn39', 'fn40'];

  public readonly cellCodes = ['fc01', 'fc02', 'fc03', 'fc04', 'fc05', 'fc06', 'fc07', 'fc08', 'fc09', 'fc10', 'fn01', 'fn01', 'fn02', 'fn03', 'fn04', 'fn05', 'fn06', 'fn07', 'fn08', 'fn09', 'fn10', 'fn11', 'fn12', 'fn13', 'fn14', 'fn15', 'fn16', 'fn17', 'fn18', 'fn19', 'fn20', 'fd01', 'fd02', 'fd03', 'fd04', 'fd05'];

  constructor(
    public reportSevice: ReportService,
    public route: ActivatedRoute,
    public keyboardservice: KeyboardService,
    public info: InformationService,
    public location: Location,
    public excelService: ExcelService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.obj_id = params['obj_id'];
      this.org_id = params['org_id'];
      this.time_id = params['time_id'];
    });
  }

  move(object) {
    const inputToArray = this.inputs.toArray()
    let index = inputToArray.findIndex(x => x.element == object.element);
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
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.years = this.InitialYears();
    if (!this.time_id)
      this.time_id = new Date().getFullYear();
    if (this.org_id) {
      this.isBlankPage = false;
      this.role_org_id = parseInt(data.org_id);

      this.GetReportById(this.obj_id, this.time_id, this.org_id);
      this.keyboardservice.keyBoard.subscribe(res => {
        this.move(res)
      })
    }
  }

  InitialYears() {
    let returnYear: Array<any> = [];
    let currentDate = new Date();
    let nextYear = currentDate.getFullYear() - 1;
    for (let index = 0; index < 6; index++) {
      returnYear.push({ time_id: nextYear + index, text: "Kỳ dữ liệu năm " + (nextYear + index) });
    }
    return returnYear;
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

  //Xuất excel
  // exportToExcel(filename: string, sheetname: string) {
  //   filename = "Dữ liệu - " + this.tenbaocao + " - " + this.thoigianbaocao
  //   this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  // }

  public exportTOExcel(withData = true) {
    let filename = this.tenbaocao + " - " + this.thoigianbaocao;
    let sheetname = this.thoigianbaocao;

    if (withData) this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    else this.excelService.exportJsonAsExcelFile(filename, sheetname, this.getExposedTable());
  }

  GetReportById(obj_id: number, time_id: number, org_id: number) {
    this.reportSevice.GetReportByKey(obj_id, time_id, org_id).subscribe(
      allRecord => {
        this.attributes = allRecord.data[1] as ReportAttribute[];
        this.attributes.sort((a, b) => a.attr_id - b.attr_id);
        this.indicators = allRecord.data[2] as ReportIndicator[];
        this.datarows = allRecord.data[3] as ReportDatarow[];
        this.object = allRecord.data[0];
        if (this.object[0]) {
          this.editPermission = (this.role_org_id == this.org_id || this.role_org_id == 1) && (this.object[0].state_id == 101 || this.object[0].state_id == 401);
          this.formatFrameReport(this.object[0]);
        }
        this.CreateMergeHeaderTable(this.attributes);

        this.CreateReportTable();
      }
    )
  }
  formatFrameReport(report: ReportOject) {
    this.tenbaocao = report.obj_name;
    this.thoigianbaocao = this.convertTimeIdToTimePeriod(parseInt(report.time_id));
    this.ngaybatdaubaocao = moment(report.start_date).format('DD/MM/YYYY');
    this.ngayketthucbaocao = moment(report.end_date).format('DD/MM/YYYY');
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
    // Swallow copy 'attributesValue' to 'attributes'
    let attributes: ReportAttribute[] = [];
    attributesValue.forEach((val) => attributes.push(Object.assign({}, val)));

    // Get the merge length for the parent
    let hashTableParentLength: HashTableNumber<number> = {};
    attributes.forEach((element) => {
      hashTableParentLength[element.attr_id] = this.countChildNode(
        element.attr_id,
        attributes
      );
    });

    let loopCount: number = 0;
    this.tableMergeHader = [];
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
      totlmerge.headerMerge = mergerHaders;

      this.mergeHeadersColumn = [];
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

    this.attributeHeaders.unshift("ind_id");
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
      tableRow.ind_index = elementIndicator.ind_index;

      for (let code of this.cellCodes) {
        let assignVal = null;
        if (code.includes('fc')) assignVal = '';
        else if (code.includes('fd')) assignVal = new Date();
        tableRow[code] = elementDatarow ? (elementDatarow[code] ? elementDatarow[code] : assignVal) : assignVal
      }
      this.dataSource.data.push(tableRow);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  SaveReport() {
    this.reportSevice
      .PostReportData(
        this.obj_id,
        this.time_id,
        this.role_org_id,
        this.dataSource.data
      )
      .subscribe(
        (response) => {
          this.info.msgSuccess("Đã lưu báo cáo thành công!");
          this.switchMode();
          this.editPermission = false;
        },
        (error) => {
          this.info.msgError("Xảy ra lỗi: " + error.message);
        }
      );
  }

  SendReport() {
    this.reportSevice
      .SendReport(this.obj_id, this.role_org_id, this.time_id.toString())
      .subscribe(
        (response) => {
          this.info.msgSuccess("Đã trình lãnh đạo thành công!");
          this.switchMode();
          this.editPermission = false;
        },
        (error) => {
          this.info.msgError("Xảy ra lỗi: " + error.message);
        }
      );
  }

  Back() {
    this.location.back();
  }

  selectionChange($event) {
    this.time_id = $event.value;
    this.isEditPage = false;
    this.GetReportById(this.obj_id, this.time_id, this.org_id);
  }

  switchMode() {
    this.isEditPage = !this.isEditPage;
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


  // ========= EXCEL PROCESSING =========

  private getExposedTable() {
    let headers = ['STT', 'CODE'].concat(this.attributes.map(att => att.attr_name));
    let exposedData = [];
    for (let record of this.dataSource.data) {
      let data = {};
      for (let header of headers) {
        if (header == 'STT') data[header] = record.ind_index;
        else if (header == "CODE") data[header] = record.ind_id;
        else if (header == "TÊN CHỈ TIÊU") data[header] = record.ind_name;
        else if (header == "ĐƠN VỊ TÍNH") data[header] = record.ind_unit;
        else data[header] = "";
      }
      exposedData.push(data);
    }
    return exposedData;
  }

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  uploadExcel(event) {
    function prepareFileData(ws) {
      function findHeaderIdx(recordList) {
        let idxList = recordList.map(x => Object.keys(x).length);
        return idxList.indexOf(Math.max(...idxList));
      }

      let recordList = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let headerIdx = findHeaderIdx(recordList);
      if (headerIdx === 0) return XLSX.utils.sheet_to_json(ws);

      let headers = recordList[headerIdx] as Array<any>;
      let datas = recordList.slice(headerIdx + 1) as Array<any>;
      let results = [];
      for (let data of datas) {
        let res = {};
        for (let [idx, r] of data.entries()) {
          res[headers[idx]] = r
        }
        results.push(res);
      }
      return results;
    }

    let self = this;
    const target: DataTransfer = <DataTransfer>(event.target);
    let isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (!isExcelFile) this.info.msgError("Bạn cần phải sử dụng file tệp có dạng là .xls hoặc .xlsx");
    if (target.files.length != 1) this.inputFile.nativeElement.value = '';

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      let importedRecords = [];

      let fileDatas = prepareFileData(ws);

      try {
        let dataDict = this.getDataDict();
        let attrCodesDict = this.getAttrCodeDictByName();
        for (let record of fileDatas) {

          let ind_id = record['CODE'];
          let displayedData = dataDict[ind_id];

          let attrNames = Object.keys(record);
          for (let name of attrNames) {
            if (name && name != "") {
              if (['STT', 'CODE', 'TÊN CHỈ TIÊU', 'ĐƠN VỊ TÍNH'].includes(name)) continue;
              if (record[name] === "") record[name] = null;
              displayedData[attrCodesDict[name]] = record[name];
            }
          }

          importedRecords.push(displayedData);
        }

        this.dataSource = new MatTableDataSource(importedRecords);
        this.info.msgSuccess("Nhập dữ liệu từ excel thành công!");
      } catch (error) {
        this.info.msgError("Gặp lỗi khi import dữ liệu: \n " + error);
      } finally {
        self.inputFile.nativeElement.value = '';
      }
    };

    reader.readAsBinaryString(target.files[0]);

    reader.onloadend = (e) => {
      self.inputFile.nativeElement.value = '';
    }
  }

  getDataDict() {
    let dataList = this.dataSource.data;
    let dataDict = {};
    for (let data of dataList) {
      dataDict[data.ind_id] = data;
    }
    return dataDict;
  }

  getAttrCodeDictByName() {
    let attributes = this.attributes;
    let attrCodesDict = {};
    for (let attr of attributes) {
      attrCodesDict[attr.attr_name] = attr.fld_code;
    }
    return attrCodesDict;
  }
}
