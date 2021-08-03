import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    public apihome = environment.apiEndpoint
    public urlchartproduct = "api/bieu-do/san-xuat";
    public urldomestic = "api/bieu-do/trong-nuoc";
    public urlforeign = "api/bieu-do/quoc-te";
    public urlProductSelect = "api/danh-sach/san-pham";

    token: any;
    username: any;

    constructor(public http: HttpClient) {
        // this.data = JSON.parse(localStorage.getItem('NormalUser'));
        // this.token = this.data.token;
    }

    //chart
    public GetProductChart(tuthang: string, denthang: string, productcode: number) {
        var apiUrl = this.apihome + this.urlchartproduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('tu_thang', tuthang);
        params = params.append('den_thang', denthang);
        params = params.append('id_san_pham', productcode.toString());
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDomesticChart(tungay: string, denngay: string, productcode: number) {
        var apiUrl = this.apihome + this.urldomestic;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('tu_ngay', tungay);
        params = params.append('den_ngay', denngay);
        params = params.append('id_san_pham', productcode.toString());
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetForeignChart(tungay: string, denngay: string, productcode: number) {
        var apiUrl = this.apihome + this.urlforeign;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('tu_ngay', tungay);
        params = params.append('den_ngay', denngay);
        params = params.append('id_san_pham', productcode.toString());
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetProductList() {
        var apiUrl = this.apihome + this.urlProductSelect;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    //chart

    public handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Lỗi: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }

}
