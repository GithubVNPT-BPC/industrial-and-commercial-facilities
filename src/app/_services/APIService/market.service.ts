import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { DomesticMarketModel, CompanyDetailModel, ForeignMarketModel } from "../../_models/APIModel/domestic-market.model";
import { ExportMarketModel, ImportMarketModel, ProductValueModel, TopExportModel, TopImportModel, TopProductModel } from "../../_models/APIModel/domestic-market.model";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MarketService {
    public data: any;
    public apiMarketUrl = environment.apiEndpoint + "api/thi-truong";
    public urlDomesticMarket = "/gia-ca";
    public urlForeignMarket = "/gia-ca-quoc-te";
    public urlExport = "/xuat-khau";
    public urlImport = "/nhap-khau";
    public urlProdcut = "/san-xuat";
    public urlProductById = "/gia-ca-trong-nuoc-theo-san-pham";
    public urlProductTimePeriod = "/gia-ca-trong-khoang-thoi-gian";

    public apiTopUrl = environment.apiEndpoint + "api/doanh-nghiep";
    public urlTopExport = "/top-xuat-khau";
    public urlTopImport = "/top-nhap-khau";
    public urlTopProduct = "/top-san-xuat";
    public urlAllCompany = "/danh-sach-doanh-nghiep";
    public urlAllCompanyImport = "/danh-sach-doanh-nghiep";
    public urlAllCompanyExport = "/danh-sach-doanh-nghiep";
    public urlCompanyInfo = "/thong-tin-doanh-nghiep";

    public apiProduct = environment.apiEndpoint + "api/san-pham";
    public urlAllProduct = "/danh-sach-san-pham";
    public urlProductNameById = "/ma-san-pham/";

    public apiHome = environment.apiEndpoint + "api";
    public urlAllCareer = "/nganh-nghe";
    public urlDistrict = "/quan-huyen";
    public urlSubDistrict = "/phuong-xa";
    public urlBT = "/loai-hinh";
    public urlCSTT = "/doanh-nghiep/co-so-truc-thuoc";

    public urlKNXK = '/doanh-nghiep/kim-ngach-xuat-khau';
    public urlKNNK = '/doanh-nghiep/kim-ngach-nhap-khau';
    public urlDSQG = '/thi-truong/danh-sach-quoc-gia';
    public urlUpdateKNNK = '/doanh-nghiep/kim-ngach-nhap-khau';
    public urlUpdateKNXK = '/doanh-nghiep/kim-ngach-xuat-khau';

    public apiImportExport = environment.apiEndpoint + "api/bao-cao";
    public urlListExportedCompany = "/kim-ngach-xuat-khau";
    public urlListImportedCompany = "/kim-ngach-nhap-khau";

    public apiMarketUrl_New = environment.apiEndpoint + "api/qltm";
    public urlDomesticMarket_New = "/gia-ca";

    token: any;
    username: any;
    
    constructor(public http: HttpClient) {
        console.log("MarketService Contraction");
        // this.data = JSON.parse(localStorage.getItem('NormalUser'));
        // this.token = this.data.token;
    }

    public GetDomesticMarket(date: any) {
        var apiUrl = this.apiMarketUrl + this.urlDomesticMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDomesticMarketByTime(ngay_lay_so_lieu) {
        console.log("+ Function: GetDomesticMarketByTime(ngay_lay_so_lieu: " + ngay_lay_so_lieu.toString() + " )");
        var apiUrl = this.apiMarketUrl_New + this.urlDomesticMarket_New;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', ngay_lay_so_lieu);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetForeignMarket(timeSelect: string) {
        var apiUrl = this.apiMarketUrl + this.urlForeignMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('ngay_lay_so_lieu', timeSelect);
        console.log(params);
        console.log(apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetExportedValue(thang: number, nam: number) {
        var apiUrl = this.apiMarketUrl + this.urlExport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', thang.toString());
        params = params.append('nam', nam.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductNameById(id: number) {
        var apiUrl = this.apiProduct + this.urlProductNameById;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_san_pham', id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetImportedValue(thang: number, nam: number) {
        var apiUrl = this.apiMarketUrl + this.urlImport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('thang', thang.toString());
        params = params.append('nam', nam.toString());

        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductValue(thang: number, nam: number) {
        var apiUrl = this.apiMarketUrl + this.urlProdcut;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('thang', thang.toString());
        params = params.append('nam', nam.toString());
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetTopExport(thang: number, nam: number, prodcutCode: number) {
        var apiUrl = this.apiTopUrl + this.urlTopExport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_san_pham', prodcutCode.toString());
        params = params.append('thang', thang.toString());
        params = params.append('nam', nam.toString());
        console.log("Function: GetTopExport. API: " + apiUrl + ". Params: " + params)
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetTopImport(thang: number, nam: number, prodcutCode: number) {
        var apiUrl = this.apiTopUrl + this.urlTopImport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('thang', thang.toString());
        params = params.append('nam', nam.toString());
        params = params.append('ma_san_pham', prodcutCode.toString());
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetTopProduct(thang: number, nam: number, prodcutCode: number) {
        console.log("GetTopProduct(thang: "+thang+", nam: "+nam+", prodcutCode: "+prodcutCode+") ");
        var apiUrl = this.apiTopUrl + this.urlTopProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('thang', thang.toString());
        params = params.append('nam', nam.toString());
        params = params.append('ma_san_pham', prodcutCode.toString());
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductById(id: number) {
        var apiUrl = this.apiProduct + '/' + id;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetCompanyInfoById(mst: string) {
        var apiUrl = this.apiTopUrl + this.urlCompanyInfo;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_doanh_nghiep', mst);
        console.log("+ Function: GetCompanyInfoById(" + mst);
        console.log("URL: ", apiUrl);
        console.log("Param: ", params);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllCompany() {
        var apiUrl = this.apiTopUrl + this.urlAllCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log("+ Function: GetAllCompany()");
        console.log("URL: ", apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetAllCompanyExport(reportMode:number, year:number, period: number, isSCT:boolean){
        var apiUrl = this.apiImportExport + this.urlListExportedCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('report_mode', reportMode.toString());
        params = params.append('year', year.toString());
        params = params.append('period', period.toString());
        params = params.append('is_sct', isSCT.toString());
        console.log("+ Function: GetAllCompanyExport()");
        console.log("URL: ", apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers,params:params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetAllCompanyImport(reportMode:number, year:number, period: number, isSCT:boolean){
        var apiUrl = this.apiImportExport + this.urlListImportedCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('report_mode', reportMode.toString());
        params = params.append('year', year.toString());
        params = params.append('period', period.toString());
        params = params.append('is_sct', isSCT.toString());
        console.log("+ Function: GetAllCompanyExport()");
        console.log("URL: ", apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers,params:params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetAllProduct() {
        var apiUrl = this.apiProduct + this.urlAllProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log("+ Function: GetAllProduct()");
        console.log("URL: ", apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllCareer() {
        var apiUrl = this.apiHome + this.urlAllCareer;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllDistrict() {
        var apiUrl = this.apiHome + this.urlDistrict;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllBusinessType() {
        var apiUrl = this.apiHome + this.urlBT;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllSubDistrict() {
        var apiUrl = this.apiHome + this.urlSubDistrict;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllBasebyid(mst: string) {
        var apiUrl = this.apiHome + this.urlCSTT;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_doanh_nghiep', mst);
        console.log("+ Function: GetCompanyInfoById(" + mst);
        console.log("URL: ", apiUrl);
        console.log("Param: ", params);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetPriceByProductId(id: number, period: number) {
        var apiUrl = this.apiMarketUrl + this.urlProductById;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_san_pham', id.toString());
        params = params.append('record', period.toString());
        console.log("+ Function: GetPriceByProductId(" + id.toString() + "," + period.toString() + ")");
        console.log("URL: ", apiUrl);
        console.log("Param: ", params);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetPriceByTimePeriod(productList : any[], from_date: string, to_date: string) {
        console.log(environment.apiEndpoint);
        var apiUrl = this.apiMarketUrl + this.urlProductTimePeriod;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('tu_ngay', from_date.toString());
        params.append('den_ngay',to_date.toString());
        console.log("+ Function: GetPriceByTimePeriod(from_date: " + from_date.toString() + "; to_date: " + to_date.toString() + ")");
        console.log("URL: ", apiUrl);
        return this.http.post<any>(apiUrl,productList, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Lỗi: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    GetKNXK(mst, report_mode, year, period){
        let params = new HttpParams().set('report_mode', report_mode).set('ma_doanh_nghiep', mst).set('year', year).set('period', period);
        let url = this.apiHome + this.urlKNXK;
        return this.http.get(url, {params: params}).pipe(tap(data => data), catchError(this.handleError));
    }

    GetKNNK(mst, report_mode, year, period){
        let params = new HttpParams().set('report_mode', report_mode).set('ma_doanh_nghiep', mst).set('year', year).set('period', period);
        let url = this.apiHome + this.urlKNNK;
        return this.http.get(url, {params: params}).pipe(tap(data => console.log(data)), catchError(this.handleError));
    }

    GetAllNational(){
        let url = this.apiHome + this.urlDSQG;
        return this.http.get(url).pipe(tap(data => data), catchError(this.handleError));
    }

    UpdateKNNK(body, report_mode,ma_doanh_nghiep, year, period){
        let is_sct = JSON.parse(localStorage.getItem('currentUser')) === 3 ? 'true' : 'false';// role cua doanh nghiep
        console.log(is_sct['role'], is_sct)
        let url = this.apiHome + this.urlUpdateKNNK;
        let params = new HttpParams()
        .set('report_mode', report_mode)
        .set('ma_doanh_nghiep', ma_doanh_nghiep)
        .set('year', year)
        .set('period', period)
        .set('is_sct', is_sct);
        return this.http.post(url, body, {params: params}).pipe(tap(data=> data), catchError(this.handleError));
    }

    UpdateKNXK(body, report_mode,ma_doanh_nghiep, year, period){
        let is_sct = JSON.parse(localStorage.getItem('currentUser')) === 3 ? 'true' : 'false';// role cua doanh nghiep
        console.log(is_sct['role'], is_sct)
        let url = this.apiHome + this.urlUpdateKNXK;
        let params = new HttpParams()
        .set('report_mode', report_mode)
        .set('ma_doanh_nghiep', ma_doanh_nghiep)
        .set('year', year)
        .set('period', period)
        .set('is_sct', is_sct);
        return this.http.post(url, body, {params: params}).pipe(tap(data=> data), catchError(this.handleError));
    }

}
