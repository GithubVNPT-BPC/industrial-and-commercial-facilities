import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { CompanyPost } from "../../_models/APIModel/domestic-market.model";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MarketService {
    public data: any;
    public apiHome = environment.apiEndpoint;

    public urlDomesticMarket = "api/qltm/gia-ca";
    public urlForeignMarket = "api/qltm/gia-ca-quoc-te";
    public urlImport = "api/qltm/xnk/nhap-khau-tong-hop";
    public urlExport = "api/qltm/xnk/xuat-khau-tong-hop";
    public urlProduct = "api/qltm/thong-tin-san-xuat";

    public urlProductById = "/gia-ca-trong-nuoc-theo-san-pham";
    public urlProductTimePeriod = "/gia-ca-trong-khoang-thoi-gian";
    public urlPostCompany = "api/doanh-nghiep/them-doanh-nghiep";
    public urlAllCompany = "api/doanh-nghiep/danh-sach-doanh-nghiep";
    public urlDeleteCompany = "api/doanh-nghiep/xoa-hoat-dong";
    public urlCompanyInfo = "api/doanh-nghiep";
    public urlAllCareer = "api/danh-sach/nganh-nghe";
    public urlDistrict = "api/danh-sach/quan-huyen";
    public urlSubDistrict = "api/danh-sach/phuong-xa";
    public urlLHHD = "api/danh-sach/loai-hinh-hoat-dong";
    public urlAllProduct = "api/danh-sach/san-pham";
    public urlProductNameById = "/ma-san-pham/";
    public urlKNXK = '/doanh-nghiep/kim-ngach-xuat-khau';
    public urlKNNK = '/doanh-nghiep/kim-ngach-nhap-khau';
    public urlUpdateKNNK = '/doanh-nghiep/kim-ngach-nhap-khau';
    public urlUpdateKNXK = '/doanh-nghiep/kim-ngach-xuat-khau';
    public urlListExportedCompany = "/kim-ngach-xuat-khau";
    public urlListImportedCompany = "/kim-ngach-nhap-khau";
    public urlDomesticMarket_New = "gia-ca";

    token: any;
    username: any;

    constructor(public http: HttpClient) {
    }

    public GetDomesticMarket(timeSelect: string) {
        var apiUrl = this.apiHome + this.urlDomesticMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeSelect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetForeignMarket(timeSelect: string) {
        var apiUrl = this.apiHome + this.urlForeignMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeSelect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetImportValue(timeselect: string) {
        var apiUrl = this.apiHome + this.urlImport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeselect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetExportValue(timeselect: string) {
        var apiUrl = this.apiHome + this.urlExport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeselect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductValue(timeselect: string) {
        var apiUrl = this.apiHome + this.urlProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeselect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }



    public GetProductNameById(id: number) {
        var apiUrl = this.apiHome + this.urlProductNameById;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_san_pham', id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductById(id: number) {
        var apiUrl = this.apiHome + '/' + id;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetCompanyInfoById(mst: string) {
        var apiUrl = this.apiHome + this.urlCompanyInfo;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('mst', mst);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    companyinfo: CompanyPost
    public PostCompany() {
        var apiUrl = this.apiHome + this.urlPostCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, this.companyinfo, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllCompany() {
        var apiUrl = this.apiHome + this.urlAllCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public DeleteCompany(mst: string) {
        var apiUrl = this.apiHome + this.urlDeleteCompany
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('mst', mst)
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data), catchError(this.handleError))
    }
    public GetAllCompanyExport(reportMode: number, year: number, period: number, isSCT: boolean) {
        var apiUrl = this.apiHome + this.urlListExportedCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('report_mode', reportMode.toString());
        params = params.append('year', year.toString());
        params = params.append('period', period.toString());
        params = params.append('is_sct', isSCT.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetAllCompanyImport(reportMode: number, year: number, period: number, isSCT: boolean) {
        var apiUrl = this.apiHome + this.urlListImportedCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('report_mode', reportMode.toString());
        params = params.append('year', year.toString());
        params = params.append('period', period.toString());
        params = params.append('is_sct', isSCT.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetAllProduct() {
        var apiUrl = this.apiHome + this.urlAllProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
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
        var apiUrl = this.apiHome + this.urlLHHD;
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

    public GetPriceByProductId(id: number, period: number) {
        var apiUrl = this.apiHome + this.urlProductById;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_san_pham', id.toString());
        params = params.append('record', period.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetPriceByTimePeriod(productList: any[], from_date: string, to_date: string) {
        var apiUrl = this.apiHome + this.urlProductTimePeriod;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('tu_ngay', from_date.toString());
        params.append('den_ngay', to_date.toString());
        return this.http.post<any>(apiUrl, productList, { headers: headers, params: params }).pipe(tap(data => data),
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

    GetKNXK(mst, report_mode, year, period) {
        let params = new HttpParams().set('report_mode', report_mode).set('ma_doanh_nghiep', mst).set('year', year).set('period', period);
        let url = this.apiHome + this.urlKNXK;
        return this.http.get(url, { params: params }).pipe(tap(data => data), catchError(this.handleError));
    }

    GetKNNK(mst, report_mode, year, period) {
        let params = new HttpParams().set('report_mode', report_mode).set('ma_doanh_nghiep', mst).set('year', year).set('period', period);
        let url = this.apiHome + this.urlKNNK;
        return this.http.get(url, { params: params }).pipe(tap(data => console.log(data)), catchError(this.handleError));
    }

    UpdateKNNK(body, report_mode, ma_doanh_nghiep, year, period) {
        let is_sct = JSON.parse(localStorage.getItem('currentUser')) === 3 ? 'true' : 'false';// role cua doanh nghiep
        let url = this.apiHome + this.urlUpdateKNNK;
        let params = new HttpParams()
            .set('report_mode', report_mode)
            .set('ma_doanh_nghiep', ma_doanh_nghiep)
            .set('year', year)
            .set('period', period)
            .set('is_sct', is_sct);
        return this.http.post(url, body, { params: params }).pipe(tap(data => data), catchError(this.handleError));
    }

    UpdateKNXK(body, report_mode, ma_doanh_nghiep, year, period) {
        let is_sct = JSON.parse(localStorage.getItem('currentUser')) === 3 ? 'true' : 'false';// role cua doanh nghiep
        let url = this.apiHome + this.urlUpdateKNXK;
        let params = new HttpParams()
            .set('report_mode', report_mode)
            .set('ma_doanh_nghiep', ma_doanh_nghiep)
            .set('year', year)
            .set('period', period)
            .set('is_sct', is_sct);
        return this.http.post(url, body, { params: params }).pipe(tap(data => data), catchError(this.handleError));
    }

}
