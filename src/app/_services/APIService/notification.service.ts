import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { DomesticMarketModel, CompanyDetailModel, ForeignMarketModel } from "../../_models/APIModel/domestic-market.model";
import { ExportMarketModel, ImportMarketModel, ProductValueModel, TopExportModel, TopImportModel, TopProductModel } from "../../_models/APIModel/domestic-market.model";
// import { environment } from "src/app/Shared/environment";
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    // declare variable
    public data: any;
    public apiNotification = environment.apiEndpoint + "api/thong-bao";

    token: any;
    username: any;


    constructor(public http: HttpClient) {
        console.log("NotificationService Contraction");
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        //this.token = this.data.Token;
        //this.username = this.data.Username;
    }

    public GetNotification(org_id: number) {
        var apiUrl = this.apiNotification;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('org_id', org_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public handleError(error: HttpErrorResponse)
    {
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