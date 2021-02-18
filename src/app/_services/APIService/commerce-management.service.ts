import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const HEADERS = { 'Content-Type': 'application/json' }

@Injectable({
    providedIn: 'root'
})
export class CommerceManagementService {
    public apiHome = environment.apiEndpoint;

    // GET
    private urlGetExpo = "api/qltm/hoi-cho-trien-lam";
    private urlGetSubcribeDiscount = "api/qltm/khuyen-mai";
    private urlGetSubcribeDiscountType = "api/qltm/danh-sach-hinh-thuc-km";
    private urlGetMultiLevelTrade = "api/qltm/da-cap";

    // POST
    private urlPostExpo = "api/qltm/cap-nhat-hoi-cho-trien-lam";
    private urlPostSubcribeDiscount = "api/qltm/cap-nhat-khuyen-mai";
    private urlPostMultiLevelTrade = "api/qltm/cap-nhat-du-lieu-da-cap";

    constructor(public http: HttpClient) {}

    // Expo
    public getExpoData(date: any) {
        let apiUrl = this.apiHome + this.urlGetExpo;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', date);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postExpoData(datas) {
        let apiUrl = this.apiHome + this.urlPostExpo;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // Subcribe Discount
    public getSubcribeDiscountData() {
        let apiUrl = this.apiHome + this.urlGetSubcribeDiscount;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getSubcribeDiscountTypeData() {
        let apiUrl = this.apiHome + this.urlGetSubcribeDiscountType;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postSubcribeDiscountData(datas) {
        let apiUrl = this.apiHome + this.urlPostSubcribeDiscount;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // Multi-level Trade
    public getMultiLevelTradeData() {
        let apiUrl = this.apiHome + this.urlGetMultiLevelTrade;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postMultiLevelTradeData(datas) {
        let apiUrl = this.apiHome + this.urlPostMultiLevelTrade;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
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