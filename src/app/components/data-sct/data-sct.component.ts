import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HeaderMerge, ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, ToltalHeaderMerge } from 'src/app/_models/APIModel/report.model';
import { Data, TreeDataType } from './data-sct-type';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';
import { typeSourceSpan } from '@angular/compiler';

// Services
import { ReportService } from 'src/app/_services/APIService/report.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-data-sct',
  templateUrl: './data-sct.component.html',
  styles: []
})

export class DataSCTComponent implements OnInit {

  @ViewChild('PRINT_TABLE', { static: false }) table: ElementRef;

  // control = new FormControl();
  tableRows: Array<any> = [];
  cols: Array<any> = [];
  filterMode: string = 'contains';
  options: any[] = [];
  // filteredOptions: Observable<string[]>;
  filteredOptions: any[];
  searchIndex: string;
  id;

  attributes: Array<ReportAttribute> = [];
  attributeHeaders: Array<any>;
  indicators: Array<ReportIndicator> = [];
  datarows: Array<ReportDatarow> = [];
  object: ReportOject[] = [];
  dataSource: MatTableDataSource<ReportTable> = new MatTableDataSource<ReportTable>();
  rows: number = 0;
  public readonly TYPE_INDICATOR_INPUT: number = 1;
  public readonly ATTRIBUTE_CODE: string = 'IND_NAME';
  public readonly UNIT_CODE: string = 'IND_UNIT';
  public readonly ATTRIBUTE_DEFAULT: number = 1;

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;
  reportTypes: any[] = [];
  periods: any[];
  selectedPeriod: any;

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public reportSevice: ReportService,
    public excelService: ExcelService,
  ) { 
    
  }

  ngOnInit() {
    // this.filteredOptions = this.control.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );

    // this.control.valueChanges.subscribe(value => {
    //   this.searchIndex = value;
    //   // console.log(this.searchIndex);
    // });

    // this.id = this.getIdUrl();
    
    this.activeRoute.params.subscribe(params => {
      this.id = params.id
      // this.callReportService(this.selectedType, );
      // console.log('lol', this.id)
      this.getLinhvucbaocao(this.id)
    });
    // this.getLinhvucbaocao(this.id)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  callReportService(obj_id: number, time_id: number, org_id: number){
    this.reportSevice.GetReportByKey(1, 202010, 1).subscribe(data => {
      this.cols = [];
      data.data[1].forEach(element => {
        if (element.attr_code != 'IND_NAME')
          this.cols.push({ field: element.fld_code, header: element.attr_name });
        else
          this.cols.push({ field: element.attr_code, header: element.attr_name });
      });
      // console.log(this.cols);

      this.tableRows = this.getNestedChildren(data.data[2], data.data[3], null);
      // console.log(this.tableRows);
      // console.log(this.options);
      this.attributes = data.data[1] as ReportAttribute[];
      this.attributes.sort((a, b) => a.attr_code.localeCompare(b.attr_code));
      this.indicators = data.data[2] as ReportIndicator[];
      this.datarows = data.data[3] as ReportDatarow[];
      this.object = data.data[0];
      // console.log(this.attributes);
      // console.log(this.indicators);
      // console.log(this.datarows);
      // console.log(this.object);
      this.indicators.forEach(e => { console.log(e.ind_unit) });
      this.CreateMergeHeaderTable(this.attributes);

      this.CreateReportTable();
      // console.log(this.dataSource);
    });
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    
    // console.log('id url', this.id, this.getIdUrl(), typeof this.getIdUrl(), typeof this.id)
    // if(this.id !== this.getIdUrl())
    //   this.callReportService();
    // return;
  }

  getIdUrl(){
    let a;
    this.activeRoute.params.subscribe(data => {
      this.id = data.id;
      a = data.id;
      // console.log(this.id, data)
    })
    return a;
  }

  exportToExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  getNestedChildren(indicators: Array<ReportIndicator>, values: Array<ReportDatarow>, parent) {
    var out = []
    for (var i in indicators) {
      if (indicators[i].parent_id == parent) {
        this.options.push({ name: indicators[i].ind_name });
        let temp = new TreeDataType();
        if (values.length) {
          var value = values.filter(x => x.ind_id == indicators[i].ind_id)[0];
          var data = new Data;
          data.IND_NAME = indicators[i].ind_name;
          data.FD01 = value['fd01'];
          data.FD02 = value['fd02'];
          data.FD03 = value['fd03'];
          data.FD04 = value['fd04'];
          data.FD05 = value['fd05'];
          data.FN01 = value['fn01'];
          data.FN02 = value['fn02'];
          data.FN03 = value['fn03'];
          data.FN04 = value['fn04'];
          data.FN05 = value['fn05'];
          data.FN06 = value['fn06'];
          data.FN07 = value['fn07'];
          data.FN08 = value['fn08'];
          data.FN09 = value['fn09'];
          data.FN10 = value['fn10'];
          data.FN11 = value['fn11'];
          data.FN12 = value['fn12'];
          data.FN13 = value['fn13'];
          data.FN14 = value['fn14'];
          data.FN15 = value['fn15'];
          data.FN16 = value['fn16'];
          data.FN17 = value['fn17'];
          data.FN18 = value['fn18'];
          data.FN19 = value['fn19'];
          data.FN20 = value['fn20'];
          data.FC01 = value['fc01'];
          data.FC02 = value['fc02'];
          data.FC03 = value['fc03'];
          data.FC04 = value['fc04'];
          data.FC05 = value['fc05'];
          data.FC06 = value['fc06'];
          data.FC07 = value['fc07'];
          data.FC08 = value['fc08'];
          data.FC09 = value['fc09'];
          data.FC10 = value['fc10'];
          // temp.data = { IND_NAME: indicators[i].ind_name, VALUE: value['fc02'].toString() }
          temp.data = data;
        }
        else {
          var data = new Data;
          data.IND_NAME = indicators[i].ind_name;
          data.FC01 = '';
          data.FC02 = '';
          data.FC03 = '';
          data.FC04 = '';
          data.FC05 = '';
          data.FC06 = '';
          data.FC07 = '';
          data.FC08 = '';
          data.FC09 = '';
          data.FC10 = '';
          data.FN01 = null;
          data.FN01 = null;
          data.FN02 = null;
          data.FN03 = null;
          data.FN04 = null;
          data.FN05 = null;
          data.FN06 = null;
          data.FN07 = null;
          data.FN08 = null;
          data.FN09 = null;
          data.FN10 = null;
          data.FN11 = null;
          data.FN12 = null;
          data.FN13 = null;
          data.FN14 = null;
          data.FN15 = null;
          data.FN16 = null;
          data.FN17 = null;
          data.FN18 = null;
          data.FN19 = null;
          data.FN20 = null;
          data.FD01 = new Date();
          data.FD02 = new Date();
          data.FD03 = new Date();
          data.FD04 = new Date();
          data.FD05 = new Date();

          temp.data = data;
        }
        //temp.data = { IND_NAME: indicators[i].ind_name, VALUE: "" }

        var children = this.getNestedChildren(indicators, values, indicators[i].ind_id)

        if (children.length) {
          temp.children = children;
        }

        temp.expanded = true;
        out.push(temp);
      }
    }
    return out
  }

  getListString(list: any[]) {
    return list.map(x => x.name);
  }

  //   onIndicatorChange(field) {
  //     // this.table.filter(event.value, 'ind_name', 'in');
  //     console.log(this.filteredOptions);
  //     if (this.filteredOptions.length)
  //       this.table.filter(this.filteredOptions, field, 'in');
  // }

  // public _filter(value: string): string[] {
  //   const filterValue = this._normalizeValue(value);
  //   return this.options.filter(opt => this._normalizeValue(opt).includes(filterValue));
  // }

  // public _normalizeValue(value: string): string {
  //   return value.toLowerCase().replace(/\s/g, '');
  // }

  countChildNode(attr_id: number, attributes: ReportAttribute[]): number {
    var temp = attributes.filter(x => x.parent_id == attr_id);
    if (temp.length == 0)
      return 1;
    else {
      let sum = 0;
      temp.forEach(attr => {
        sum += this.countChildNode(attr.attr_id, attributes);
      })
      return sum;
    }
  }

  CreateMergeHeaderTable(attributesValue: ReportAttribute[]) {
    let attributes: ReportAttribute[] = [];
    attributesValue.forEach(val => attributes.push(Object.assign({}, val)));
    let hashTableParentLength: HashTableNumber<number> = {};
    attributes = attributes.filter(a => a.attr_code.toLowerCase() != 'rn');

    attributes.forEach(element => {
      // if (element.parent_id != null){
      //   if (!hashTableParentLength[element.parent_id]){
      //     hashTableParentLength[element.parent_id] = 0;
      //   }
      //   hashTableParentLength[element.parent_id]  +=1;
      // }
      hashTableParentLength[element.attr_id] = this.countChildNode(element.attr_id, attributes);
    });
    let loopCount: number = 0;
    while (attributes.length > 3) {
      loopCount += 1;
      this.indexOftableMergeHader += 1;
      let totlmerge: ToltalHeaderMerge = new ToltalHeaderMerge();
      let mergerHaders: HeaderMerge[] = [];
      let layerTop: ReportAttribute[] = attributes.filter(element => element.parent_id == null);
      let lengthBeforeOfAttributes: number = attributes.length;
      attributes = attributes.filter(e => e.parent_id != null || e.is_default == 1 || hashTableParentLength[e.attr_id] == 1);
      attributes.forEach(attribute => {
        //if (attribute.is_default == 1) {
        attribute.attr_code = attribute.attr_code + loopCount.toString();
        //}
      });
      layerTop.forEach(layer => {
        let mergeHeader: HeaderMerge = new HeaderMerge();
        mergeHeader.colLenght = hashTableParentLength[layer.attr_id] ? hashTableParentLength[layer.attr_id] : 1;
        mergeHeader.colName = (layer.attr_code + "_TEST").toLowerCase();
        mergeHeader.colText = hashTableParentLength[layer.attr_id] > 1 && hashTableParentLength[layer.attr_id] ? layer.attr_name : "";
        mergeHeader.colDefault = layer.is_default;
        mergerHaders.push(mergeHeader);
      });
      this.mergeHeadersColumn = mergerHaders.sort((a, b) => b.colDefault - a.colDefault)
        .map(c => c.colName.toLowerCase());
      totlmerge.headerColName = this.mergeHeadersColumn;
      this.mergeHeadersColumn = [];
      totlmerge.headerMerge = mergerHaders;
      this.tableMergeHader.push(totlmerge);
      attributes.forEach(element => {
        layerTop.forEach(layer => {
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
    this.attributes = this.attributes.filter(a => a.fld_code && a.fld_code.toLowerCase() != 'null'
      && a.attr_code.toLowerCase() != 'ind_code'
      && a.attr_code.toLowerCase() != 'rn');
    this.attributeHeaders = this.attributes.sort((a, b) => b.is_default - a.is_default)
      .filter(a => a.fld_code.toLowerCase() != null)
      .map(c => c.is_default == 1 ? c.attr_code.toLowerCase() : c.fld_code.toLowerCase());
    this.attributeHeaders = this.attributeHeaders.filter(a => a.toLowerCase() != 'ind_code' && a.toLowerCase() != 'rn')
    this.attributeHeaders.unshift('index');
    console.log(this.attributeHeaders);
    for (let index = 0; index < this.indicators.length; index++) {
      const elementDatarow = this.datarows[index];
      const elementIndicator = this.indicators[index];
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
        tableRow.fc01 = '';
        tableRow.fc02 = '';
        tableRow.fc03 = '';
        tableRow.fc04 = '';
        tableRow.fc05 = '';
        tableRow.fc06 = '';
        tableRow.fc07 = '';
        tableRow.fc08 = '';
        tableRow.fc09 = '';
        tableRow.fc10 = '';
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
    this.dataSource.data.forEach(element => {
      if (element.ind_formula == null && element.ind_type == 1) this.rows++;
    });
  }

  getLinhvucbaocao(id) {
    this.reportSevice.GetReportByField(id).subscribe((data) => {
      if(data['data'][0]){
        let reortType = data["data"][0];
        this.reportTypes.push(reortType);
      }
      this.changeDulieuKyBaoCao(data["data"]);
      this.periods = [...data['data']];
    });
  }

  changeDulieuKyBaoCao(data) {
    data.map((item) => {
      let loaikybaocao = item["submit_type"];
      let m = item['ky_bao_cao'].toString().slice(4);
      switch (loaikybaocao) {
        case 1:
          // thang
          let thang = 'Tháng ' + m;
          item['kybaocao'] = thang;
          break;
        case 2:
          // quy
          let qu;
          if (m <= 3) qu = 'I'
          if (3 < m && m <= 6) qu = 'II'
          if (6 < m && m <= 9) qu = 'III'
          if (9 < m && m <= 12) qu = 'IV'
          let quy = 'Quý ' + qu;
          item['kybaocao'] = quy;
          break;
        case 3:
          // nam
          item['kybaocao'] = 'Nam ' + item['ky_bao_cao'].toString().slice(0, 4)
          break;
        case 4:
          // 6 thang
          item['kybaocao'] = 'Nam ' + item['ky_bao_cao'].toString().slice(0, 4)
          break;
        default:
          break;
      }
    });
  }

  changeReportType() {
    console.log(this.selectedType)
  }
  selectedType(selectedType: any) {
    throw new Error("Method not implemented.");
  }

  changePeriod() {
    console.log(this.selectedPeriod)
    this.reportSevice.GetReportByKey(this.selectedPeriod, this.selectedPeriod['ky_bao_cao'], this.selectedPeriod['org_id']).subscribe(data => {
      console.log(data)
    })
  }
}
