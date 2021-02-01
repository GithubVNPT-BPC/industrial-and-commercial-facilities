import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    // declare variable
    public data: any;
    public apiMarketUrl = environment.apiEndpoint + "api/thi-truong";
    public urlChartDomesticPrice = "/gia-ca";
    public urlForeignMarket = "/gia-ca-the-gioi";
    public urlExport = "/xuat-khau";
    public urlImport = "/nhap-khau";
    public urlProdcut = "/san-xuat";
    public urlProductById = "/gia-ca-trong-nuoc-theo-san-pham";
    public urlProductAll = "/gia-ca-tong-hop";

    public apiTopUrl = environment.apiEndpoint + "api/doanh-nghiep";
    public urlTopExport = "/top-xuat-khau";
    public urlTopImport = "/top-nhap-khau";
    public urlTopProduct = "/top-san-xuat";
    public urlCompanyInfo = "/thong-tin-doanh-nghiep"
    public urlAllCompany = "/danh-sach-doanh-nghiep";

    public apiProduct = environment.apiEndpoint + "api/san-pham";
    public urlProductNameById = "/ma-san-pham/";
    public urlAllProduct = "/danh-sach-san-pham";

    token: any;
    username: any;

    constructor(public http: HttpClient) {
        console.log("MarketService Contraction");
        // this.data = JSON.parse(localStorage.getItem('NormalUser'));
        // this.token = this.data.token;
    }

    // Get DomesticMarket price
    public GetAllPriceOfDomestic(ngayLaySoLieu: string) {
        var apiUrl = this.apiMarketUrl + this.urlChartDomesticPrice;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('ngay_lay_so_lieu', ngayLaySoLieu.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    // Get DomesticMarket price
    public GetForeignMarket(timeSelect: string) {
        var apiUrl = this.apiMarketUrl + this.urlForeignMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // GetExportedValue
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
    // GetExportedValue
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

    // GetExportedValue
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
    // GetExportedValue
    public GetTopExport(thang: number, nam: number, prodcutCode: string) {
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
    // GetExportedValue
    public GetTopImport(thang: number, nam: number, prodcutCode: string) {
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
    public GetTopProduct(thang: number, nam: number, prodcutCode: string) {
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
    public GetProductNameById(id: number) {
        var apiUrl = this.apiProduct + this.urlProductNameById;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_san_pham', id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetCompanyInfoById(id: number) {
        var apiUrl = this.apiTopUrl + this.urlCompanyInfo;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('ma_doanh_nghiep', id.toString());
        console.log("+ Function: GetCompanyInfoById(" + id);
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
    public GetAllProduct() {
        var apiUrl = this.apiProduct + this.urlAllProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log("+ Function: GetAllProduct()");
        console.log("URL: ", apiUrl);
       
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
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
    public GetPriceAllProduct(period: number, productList : any[]) {
        console.log(environment.apiEndpoint);
        var apiUrl = this.apiMarketUrl + this.urlProductAll;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('so_dong', period.toString());
        console.log("+ Function: GetPriceByProductId(period: " + period.toString() + ")");
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

}
