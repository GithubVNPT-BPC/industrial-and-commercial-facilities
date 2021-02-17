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

    private urlExpo = "api/qltm/hoi-cho-trien-lam";
    private urlSubcribeDiscount = "api/qltm/khuyen-mai";
    private urlMultiLevelTrade = "api/qltm/da-cap";

    constructor(public http: HttpClient) {}

    public getExpoData(date: any) {
        let apiUrl = this.apiHome + this.urlExpo;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', date);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getSubcribeDiscountData() {
        let apiUrl = this.apiHome + this.urlSubcribeDiscount;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getMultiLevelTradeData() {
        let apiUrl = this.apiHome + this.urlMultiLevelTrade;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
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