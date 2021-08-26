import { Component, ViewChild, ElementRef, OnInit, QueryList, ViewChildren, Input } from '@angular/core';

import { ReportService } from '../../../../../_services/APIService/report.service';

import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, HeaderMerge, ToltalHeaderMerge } from '../../../../../_models/APIModel/report.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { ReportDirective } from '../../../../../shared/report.directive';
import { KeyboardService } from '../../../../../shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { Location } from '@angular/common';
import moment from 'moment';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { LinkModel } from 'src/app/_models/link.model';


interface HashTableNumber<T> {
    [key: string]: T;
}

@Component({
    selector: 'app-month-detail',
    templateUrl: './month-detail.component.html',
    styleUrls: ['../../../../report/report_layout.scss'],
})


export class MonthDetailComponent implements OnInit {
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    public readonly TYPE_INDICATOR_INPUT: number = 1;
    public readonly ATTRIBUTE_CODE: string = 'IND_NAME';
    public readonly UNIT_CODE: string = 'IND_UNIT';
    public readonly ATTRIBUTE_DEFAULT: number = 1;

    private readonly LINK_DEFAULT: string = "/specialized/enery-management/power-production-month-detail";
    private readonly TITLE_DEFAULT: string = "Các chỉ tiêu chủ yếu đối với lĩnh vực năng lượng";
    private readonly TEXT_DEFAULT: string = "Các chỉ tiêu chủ yếu đối với lĩnh vực năng lượng";

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

    obj_id: number = 28;
    time_id: number;
    org_id: number = 5;
    rows: number = 0;
    state_id: number = 0;

    thoigianbaocao: string = "";
    tenbaocao: string = "";
    ngaybatdaubaocao: string = "";
    ngayketthucbaocao: string = "";

    years: Array<number> = [];
    months: Array<object> = [{ id: 1, value: '6 tháng đầu năm' }, { id: 2, value: '6 tháng cuối năm' }];
    selectedYear: number;
    selectedMonth: number = 1;

    private _linkOutput: LinkModel = new LinkModel();

    attributes: Array<ReportAttribute> = [];
    attributeHeaders: Array<any>;
    indicators: Array<ReportIndicator> = []

    datarows: Array<ReportDatarow> = []

    object: ReportOject[] = [];
    dataSource: MatTableDataSource<ReportTable> = new MatTableDataSource<ReportTable>();

    constructor(
        public reportSevice: ReportService,
        public route: ActivatedRoute,
        public _router : Router,
        public keyboardservice: KeyboardService,
        public info: InformationService,
        public location: Location,
        public excelService: ExcelService,
        private _breadCrumService: BreadCrumService
    ) {
        this.route.queryParams.subscribe(params => {
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
        //this.org_id = parseInt(data.org_id);
        this.org_id = 5;
        this.years = this.InitialYears();
        this.selectedYear = new Date().getFullYear();
        
        this.calculateTimeId();

        this.sendLinkToNext(true);
        this.GetReportById(this.time_id);
        this.keyboardservice.keyBoard.subscribe(res => {
            this.move(res)
        })
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
    exportToExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    GetReportById(time_id: number) {
        this.reportSevice.GetReportByKey(this.obj_id, time_id, this.org_id).subscribe(
            allRecord => {
                if (allRecord.data.length) {
                    this.attributes = allRecord.data[1] as ReportAttribute[];
                    this.attributes.sort((a, b) => a.attr_id - b.attr_id);
                    // this.attributes.sort((a, b) => a.attr_code.localeCompare(b.attr_code));
                    this.indicators = allRecord.data[2] as ReportIndicator[];
                    this.datarows = allRecord.data[3] as ReportDatarow[];
                    this.object = allRecord.data[0];
                    if (this.object[0]) {
                        this.state_id = this.object[0].state_id;
                        this.formatFrameReport(this.object[0]);
                    }
                    this.CreateMergeHeaderTable(this.attributes);

                    this.CreateReportTable();
                }
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
                return "Kỳ " + time.substr(4, 1) + " năm " + time.slice(0, 4);
            default:
                return time;
        }
    }

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
        this.tableMergeHader = [];
        while (attributes.length > 3) {
            loopCount += 1;
            this.indexOftableMergeHader += 1;
            let totlmerge: ToltalHeaderMerge = new ToltalHeaderMerge();
            let mergerHaders: HeaderMerge[] = [];
            let layerTop: ReportAttribute[] = attributes.filter(element => element.parent_id == null);
            let lengthBeforeOfAttributes: number = attributes.length;
            attributes = attributes.filter(e => e.parent_id != null || e.is_default == 1 || hashTableParentLength[e.attr_id] == 1);
            attributes.forEach(attribute => {
                if (attribute.is_default == 1) {
                attribute.attr_code = attribute.attr_code + loopCount.toString();
                }
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
        this.dataSource = new MatTableDataSource<ReportTable>();
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
            tableRow.ind_index = elementIndicator.ind_index;
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    SendReport() {
        this.reportSevice.PostReportData(this.obj_id, this.time_id, this.org_id, this.dataSource.data).subscribe(response => {
            this.info.msgSuccess("Đã lưu báo cáo thành công!");
        },
            error => {
                this.info.msgError("Xảy ra lỗi: " + error.message);
            })
    }
    Back() {
        this.location.back();
    }

    private sendLinkToNext(type: boolean): void {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT + ' kỳ ' + this.time_id.toString().substr(4, 2) + "/" + this.time_id.toString().slice(0, 4);
        this._linkOutput.text = this.TEXT_DEFAULT + ' kỳ ' + this.time_id.toString().substr(4, 2) + "/" + this.time_id.toString().slice(0, 4);
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    InitialYears() {
        let returnYear: Array<any> = [];
        let currentDate = new Date();
        let nextYear = currentDate.getFullYear() - 1;
        for (let index = 0; index < 6; index++) {
            returnYear.push(nextYear + index);
        }
        return returnYear;
    }

    calculateTimeId() {
        this.time_id = this.selectedYear * 10 + this.selectedMonth;
    }

    OpenDetail() {
        this._router.navigate(['/report/edit'], { queryParams: { obj_id: this.obj_id, org_id: this.org_id, time_id: this.time_id } });
    }
}
