import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { MarketService } from '../../../../_services/APIService/market.service';
import { CompanyDetailModel } from '../../../../_models/APIModel/domestic-market.model';
import { CareerModel, DistrictModel, SubDistrictModel, BusinessTypeModel, CSTTModel } from 'src/app/_models/APIModel/domestic-market.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogBusinessComponent } from './../../business/Dialog/Dialog-business.component';

import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
    selector: 'detail-business',
    templateUrl: 'detail-business.component.html',
    styleUrls: ['../../manager_layout.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi-VI' },

        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})

export class DetailBussinessComponent implements OnInit {
    vall = new FormControl('', [
        Validators.required,

    ]);
    vall1 = new FormControl('', [
        Validators.required,

    ]);
    vall2 = new FormControl('', [
        Validators.required,

    ]);
    vall3 = new FormControl('', [
        Validators.required,

    ]);
    vall4 = new FormControl('', [
        Validators.required,

    ]);
    vall5 = new FormControl('', [
        Validators.required,

    ]);
    vall6 = new FormControl('', [
        Validators.required,

    ]);
    vall7 = new FormControl('', [
        Validators.required,

    ]);
    vall8 = new FormControl('', [
        Validators.required,

    ]);
    vall9 = new FormControl('', [
        Validators.required,

    ]);
    vall10 = new FormControl('', [
        Validators.required,

    ]);
    vall11 = new FormControl('', [
        Validators.required,

    ]);

    @Input() company: CompanyDetailModel;
    mst: string;
    errorMessage: any;
    public career: Array<CareerModel> = new Array<CareerModel>();
    public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
    public Business: Array<BusinessTypeModel> = new Array<BusinessTypeModel>();
    public CSTT: Array<CSTTModel> = new Array<CSTTModel>();
    defaultLogo: string = '../../../../assets/img/brandlogo/company_ph01.jpg';
    SLCSTT: any;

    constructor(
        public route: ActivatedRoute,
        public dialog: MatDialog,
        public marketService: MarketService) {
        // this.route.params.subscribe(params => {
        //     this.mst = params['mst'];
        // });
        this.company = new CompanyDetailModel();
    }

    openDialog(mst: string) {
        const dialogRef = this.dialog.open(DialogBusinessComponent, { data: mst });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    ngOnInit() {
        // set ma so thue 
        this.setMST();
        this.GetCompanyInfoById();
        this.GetAllNganhNghe();
        this.GetAllPhuongXa();
        // this.GetCompanyInfoTest();
        // this.GetAllLoaiHinh();
        this.GetAllCSTT();
    }

    setMST() {
        this.mst = JSON.parse(localStorage.getItem('currentUser'))['org_id'];
        // this.mst = '3801083966';
    }

    GetAllCSTT() {
        this.marketService.GetAllBasebyid(this.mst).subscribe(
            allrecords => {
                this.CSTT = allrecords.data as CSTTModel[];
                this.SLCSTT = this.CSTT.length;
            });
    }

    GetAllNganhNghe() {
        this.marketService.GetAllCareer().subscribe(
            allrecords => {
                this.career = allrecords.data as CareerModel[];
            });
    }

    GetAllPhuongXa() {
        this.marketService.GetAllSubDistrict().subscribe(
            allrecords => {
                this.subdistrict = allrecords.data as SubDistrictModel[];
            });
    }

    GetCompanyInfoById() {
        this.marketService.GetCompanyInfoById(this.mst).subscribe(
            allrecords => {
                this.company = allrecords.data[0] as CompanyDetailModel;
            },
            error => this.errorMessage = <any>error
        );
    }

    GetAllLoaiHinh() {
        this.marketService.GetAllBusinessType().subscribe(
            allrecords => {
                this.Business = allrecords.data as BusinessTypeModel[];
            });
    }

    public GetCompanyInfoTest() {
        this.marketService.GetAllCompany().subscribe(
            allrecords => {
                this.company = allrecords.data[0] as CompanyDetailModel;
                console.log(allrecords)
            },
            error => this.errorMessage = <any>error
        );
    }

    onSubmit() {

    }
}