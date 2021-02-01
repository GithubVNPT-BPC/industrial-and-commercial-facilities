import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ControlService {

    public data: any;
    public apiControlUrl = environment.apiEndpoint + "api/quan-lu=y";
    public urlMarketControl = "/cho";


    token: any;
    username: any;

    constructor(public http: HttpClient) {
        console.log("MarketService Contraction");
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        if(this.data){
            this.token = this.data.token;
            this.username = this.data.username;
        }       
    }

    public GetReportMarketControl(month: number, year: number) {
        console.log("+ Function: GetReportMarketControl(month: " + month.toString() + ", year: ", +year.toString() +" )");
        var apiUrl = this.apiControlUrl + this.urlMarketControl;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('thang', month.toString());
        params = params.append('nam', year.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

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
