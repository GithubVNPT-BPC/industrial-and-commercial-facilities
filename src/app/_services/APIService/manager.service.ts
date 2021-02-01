import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DomesticManagerModel, ImportManagerModel, ProductManagerModel, ForeignManagerModel, ExportManagerModel } from '../../_models/APIModel/manager.model';
import { ExportMarketModel } from 'src/app/_models/APIModel/domestic-market.model';
import { CompanyDetailModel, TopBusinessModel } from '../../_models/APIModel/domestic-market.model'

@Injectable({
    providedIn: 'root'
})

export class ManagerService {

    public data: any;
    public apiManagerUrl = environment.apiEndpoint + "api/thi-truong";
    public apiProductUrl = environment.apiEndpoint + "api/san-pham";
    public urlDomesticManager = "/gia-ca";
    public urlDomesticManagerPrice = "/gia-ca-theo-ngay";
    public urlForeignManagerPrice = "/gia-ca-quoc-te-theo-ngay";
    public urlForeignManager = "/gia-ca-quoc-te";
    public urlExportManager = "/xuat-khau";
    public urlImportManager = "/nhap-khau";
    public urlProductManager = "/san-xuat";
    public urlTopExportManager = "/xuat-khau/top";
    public urlTopImportManager = "/nhap-khau/top";
    public urlTopProdcutManager = "/san-xuat/top";
    public urlListProduct = "/danh-sach-san-pham";
    public urlListNation = "/danh-sach-quoc-gia";

    public apiDomestic = environment.apiEndpoint + "api/danh-sach";
    public apiManager = environment.apiEndpoint + "api/qltm/";
    public newUrlListProduct = "/san-pham"
    public newUrlPrice = "gia-ca";
    public urlDomesticManager_new = "gia-ca";

    token: any;
    username: any;

    constructor(public http: HttpClient) {
        console.log("MarketService Contraction");
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    public GetDomesticMarketByTime(ngay_lay_so_lieu) {
        console.log("+ Function: GetDomesticMarketByTime(ngay_lay_so_lieu: " + ngay_lay_so_lieu.toString() + " )");
        var apiUrl = this.apiManager + this.newUrlPrice;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', ngay_lay_so_lieu);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    //GET--------------------------------------------------------------------------------------
    public GetDomesticManager(time: string) {
        var apiUrl = this.apiManagerUrl + this.urlDomesticManagerPrice;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('ngay_lay_so_lieu', time.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetNation() {
        var apiUrl = this.urlListNation;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetListProduct() {
        var apiUrl = this.apiProductUrl + this.urlListProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetListProduct_New() {
        var apiUrl = this.apiDomestic + this.newUrlListProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetListNation() {
        var apiUrl = this.apiManagerUrl + this.urlListNation;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetExportManager(month: number, year: number) {
        var apiUrl = this.apiManagerUrl + this.urlExportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetImportManager(month: number, year: number) {
        var apiUrl = this.apiManagerUrl + this.urlImportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductManager(month: number, year: number) {
        var apiUrl = this.apiManagerUrl + this.urlProductManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetForeignManager(time: string) {
        var apiUrl = this.apiManagerUrl + this.urlForeignManagerPrice;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('ngay_lay_so_lieu', time);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetForeignMarket(timeSelect: string) {
        var apiUrl = this.apiManagerUrl + this.urlForeignManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('ngay_lay_so_lieu', timeSelect);
        console.log(params);
        console.log(apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    //GET

    //POST-----------------------------------------------------------------------
    public PostDomesticManager(domesticArray: Array<DomesticManagerModel>) {
        var apiUrl = this.apiManager + this.urlDomesticManager_new;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, domesticArray, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostExportManager(month: number, year: number, exportArray: Array<ExportManagerModel>) {
        var apiUrl = this.apiManagerUrl + this.urlExportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.post<any>(apiUrl, exportArray, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostImportManager(month: number, year: number, importArray: Array<ImportManagerModel>) {
        var apiUrl = this.apiManagerUrl + this.urlImportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.post<any>(apiUrl, importArray, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostProductManager(month: number, year: number, productArray: Array<ProductManagerModel>) {
        var apiUrl = this.apiManagerUrl + this.urlProductManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.post<any>(apiUrl, productArray, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostForeignManager(foreignArray: Array<ForeignManagerModel>) {
        var apiUrl = this.apiManagerUrl + this.urlForeignManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, foreignArray, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostTopExportManager(id_xuat_khau: number, exportArray: Array<TopBusinessModel>) {
        var apiUrl = this.apiManagerUrl + this.urlExportManager + "/" + id_xuat_khau.toString();
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        console.log(apiUrl);
        console.log(headers);
        console.log(exportArray);
        return this.http.post<any>(apiUrl, exportArray, { headers: headers }).pipe(tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }

    public PostTopImportManager(id_nhap_khau: number, exportArray: Array<TopBusinessModel>) {
        var apiUrl = this.apiManagerUrl + this.urlImportManager + "/" + id_nhap_khau.toString();
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        console.log(apiUrl);
        console.log(headers);
        console.log(exportArray);
        return this.http.post<any>(apiUrl, exportArray, { headers: headers }).pipe(tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }

    public PostTopProductManager(id_san_xuat: number, exportArray: Array<TopBusinessModel>) {
        var apiUrl = this.apiManagerUrl + this.urlProductManager + "/" + id_san_xuat.toString();
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        console.log(apiUrl);
        console.log(headers);
        console.log(exportArray);
        return this.http.post<any>(apiUrl, exportArray, { headers: headers }).pipe(tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }
    //POST

    //PUT------------------------------------------------------------------------------------
    public PutDomesticManager() {
        var apiUrl = this.apiManagerUrl + this.urlDomesticManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PutExportManager() {
        var apiUrl = this.apiManagerUrl + this.urlExportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PutImportManager() {
        var apiUrl = this.apiManagerUrl + this.urlImportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PutProductManager() {
        var apiUrl = this.apiManagerUrl + this.urlImportManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);

        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PutForeignManager() {
        var apiUrl = this.apiManagerUrl + this.urlForeignManager;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    //PUT

    //-------------------------------------------------------------------------------

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
}
