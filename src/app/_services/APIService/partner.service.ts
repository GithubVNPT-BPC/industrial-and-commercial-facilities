import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PartnerService {
    public data: any;
    public apiPartner = environment.apiEndpoint + "api/doanh-nghiep";
    public urlListPartner = "/danh-sach-doanh-nghiep";

    token: any;
    username: any;


    constructor(public http: HttpClient) {
        console.log("PartnerService");
        // this.data = JSON.parse(localStorage.getItem('NormalUser'));
        // this.token = this.data.token;
    }
    public GetAllCompany() {
        var apiUrl = this.apiPartner + this.urlListPartner;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log("+ Function: GetAllCompany()");
        console.log("URL: ", apiUrl);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
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
