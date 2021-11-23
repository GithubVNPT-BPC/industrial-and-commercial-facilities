import { Component, OnInit, ViewChild, QueryList, ViewChildren } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from "@angular/router";
import { InformationService } from 'src/app/shared/information/information.service';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
import { ManagerDirective } from 'src/app/shared/manager.directive';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import {
	CompanyDetailModel,
	CareerModel,
	DistrictModel,
	SubDistrictModel,
	Career,
} from "src/app/_models/APIModel/domestic-market.model";

import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';
const moment = _rollupMoment || _moment;
export const DDMMYY_FORMAT = {
	parse: {
		dateInput: 'LL',
	},
	display: {
		dateInput: 'DD-MM-YYYY',
		monthYearLabel: 'YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'YYYY',
	},
};

@Component({
	selector: 'app-company-detail',
	templateUrl: './detail-partner.component.html',
	styleUrls: ['../../public_layout.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},

		{ provide: MAT_DATE_FORMATS, useValue: DDMMYY_FORMAT },
		{ provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
		DatePipe
	],
})

export class CompanyDetailComponent implements OnInit {

	@ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	selection = new SelectionModel<Career>(true, []);
	mst: string;

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.connect().value.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.connect().value.forEach(row => this.selection.select(row));
	}

	checkboxLabel(row?: Career): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
	}

	constructor(
		public marketService: MarketServicePublic,
		public route: ActivatedRoute,
		public router: Router,
		public datepipe: DatePipe,
		public info: InformationService,
	) {
		this.route.params.subscribe((params) => {
			this.mst = params["mst"];
		});
	}

	public district: Array<DistrictModel> = new Array<DistrictModel>();
	getAllQuanHuyen() {
		this.marketService.GetAllDistrict().subscribe((allDistrict) => {
			this.district = allDistrict["data"] as DistrictModel[];
		});
	}

	public workingTypes = [];
	GetAllLoaiHinh() {
		this.marketService.GetAllBusinessType().subscribe((allrecords) => {
			this.workingTypes = allrecords.data;
		});
	}

	public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
	GetAllPhuongXa() {
		this.marketService.GetAllSubDistrict().subscribe((allrecords) => {
			this.subdistrict = allrecords.data as SubDistrictModel[];
		});
	}

	public fieldsList = [];
	GetLinhVuc() {
		this.marketService.GetAllField().subscribe((allrecords) => {
			this.fieldsList = allrecords.data;
		});
	}

	public career: Array<CareerModel> = new Array<CareerModel>();
	GetAllNganhNghe() {
		this.marketService.GetAllCareer().subscribe((allrecords) => {
			this.career = allrecords.data as CareerModel[];
		});
	}

	ngOnInit() {
		this.GetAllNganhNghe();
		this.GetAllPhuongXa();
		this.getAllQuanHuyen();
		this.GetAllLoaiHinh();
		this.GetLinhVuc();
		if (this.mst != undefined) this.GetCompanyInfoById();
	}

	dataSource: MatTableDataSource<Career> = new MatTableDataSource<Career>();
	public displayedColumns: string[] = [
		// 'select', 
		'index', 'id', 'ten_nganh_nghe', 
		'linh_vuc', 'nganh_nghe_kd_chinh', 'ma_nganh_nghe'];

	Convertdate(text) {
		return text ? text.substring(6, 8) + "/" + text.substring(4, 6) + "/" + text.substring(0, 4) : '';
	}

	companyList1: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
	companyList2 = [];
	companyList3: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
	companyList4: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
	companyList5: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
	company = {};

	GetCompanyInfoById() {
		this.marketService.GetCompanyInfoById(this.mst).subscribe(
			allrecords => {
				this.companyList1 = allrecords.data[0]
				this.companyList2 = allrecords.data[1]
				this.companyList3 = allrecords.data[2]

				this.companyList4 = this.companyList1.map(a => {
					let temp = this.companyList2.filter(b => b.mst === a.mst)
					let temp1 = temp.map(c => c.ma_nganh_nghe)
					if (temp1 == undefined || temp1 == null) {
						a.ma_nganh_nghe = null
					}
					else {
						a.ma_nganh_nghe = temp1.join('; ')
					}

					let temp2 = temp.map(c => c.ten_nganh_nghe)
					if (temp2 == undefined || temp2 == null) {
						a.ten_nganh_nghe = null
					}
					else {
						a.ten_nganh_nghe = temp2.join('; ')
					}

					let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
					if (temp3 == undefined || temp3 == null) {
						a.nganh_nghe_kd_chinh = null
					}
					else {
						a.nganh_nghe_kd_chinh = temp3.join('; ')
					}

					return a
				})

				this.companyList5 = this.companyList4.map(d => {
					let temp = this.companyList3.filter(e => e.mst === d.mst)
					let temp1 = temp.map(f => f.so_giay_phep)
					if (temp1[0] == undefined || temp1[0] == null) {
						d.so_giay_phep = null
					}
					else {
						d.so_giay_phep = temp1.join('; ')
					}

					let temp2 = temp.map(f => f.ngay_cap ? this.Convertdate(f.ngay_cap) : null)
					if (temp2[0] == undefined || temp2[0] == null) {
						d.ngay_cap = null
					}
					else {
						d.ngay_cap = temp2.join('; ')
					}

					let temp3 = temp.map(f => f.ngay_het_han ? this.Convertdate(f.ngay_het_han) : null)
					if (temp3[0] == undefined || temp3[0] == null) {
						d.ngay_het_han = null
					}
					else {
						d.ngay_het_han = temp3.join('; ')
					}

					let temp4 = temp.map(f => f.noi_cap)
					if (temp4[0] == undefined || temp4[0] == null) {
						d.noi_cap = null
					}
					else {
						d.noi_cap = temp4.join('; ')
					}

					let temp5 = temp.map(f => f.co_quan_cap)
					if (temp5[0] == undefined || temp5[0] == null) {
						d.co_quan_cap = null
					}
					else {
						d.co_quan_cap = temp5.join('; ')
					}

					let temp6 = temp.map(f => f.ghi_chu)
					if (temp6[0] == undefined || temp6[0] == null) {
						d.ghi_chu == null
					}
					else {
						d.ghi_chu = temp6.join('; ')
					}

					return d
				})

				this.companyList2.map(record => {
					record['linh_vuc'] = this.fieldsList.find(x => x.id_linh_vuc == record.id_linh_vuc).ten_linh_vuc;
				});

				this.company = this.companyList5[0];
				this.company['ngay_bd_kd'] = this.Convertdate(this.company['ngay_bd_kd']);
				// this.company['quan_huyen'] = this.company['id_quan_huyen'] ? this.district.find(x => x.id == this.company['id_quan_huyen']).ten_quan_huyen : '';
				// this.company['phuong_xa'] = this.company['id_phuong_xa'] ? this.subdistrict.find(x => x.id == this.company['id_quan_huyen']).ten_quan_huyen : '';
				
				this.dataSource.data = this.companyList2;

				this.dataSource.paginator = this.paginator;
				this.paginator._intl.itemsPerPageLabel = 'Số hàng';
				this.paginator._intl.firstPageLabel = "Trang Đầu";
				this.paginator._intl.lastPageLabel = "Trang Cuối";
				this.paginator._intl.previousPageLabel = "Trang Trước";
				this.paginator._intl.nextPageLabel = "Trang Tiếp";
			});
	}

	Back() {
		this.router.navigate(['public/partner/search/']);
	}

}
