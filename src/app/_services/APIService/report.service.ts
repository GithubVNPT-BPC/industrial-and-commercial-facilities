import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})

export class ReportService {
    public data: any;
    public apiReport = environment.apiEndpoint + "api/bao-cao";
    public apiOrganization = environment.apiEndpoint + "api/don-vi";
    public urlReportMonth = "/thang";
    public urlReportYear = "/nam";
    public urlReportQuarter = "/quy";
    public urlReportHalf = "/6thang";
    public urlViewAll = "/tat-ca-da-nhap";
    public urlApprove = "/phe-duyet";
    public urlDecline = "/tu-choi";
    public urlSend = "/gui-lanh-dao";
    public urlLinhvucBaoCao = "/bao-cao-theo-linh-vuc";
    public urlReport12Months = "/du-lieu-tong-hop-12-thang";
    public urlReportPowerProduction = "/dien-thuong-pham"

    token: any;
    username: any;

    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    public GetList_ReportMonth(month: number, year: number, org_id: number) {
        var apiUrl = this.apiReport + this.urlReportMonth;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('month', month.toString());
        params = params.append('year', year.toString());
        params = params.append('org_id', org_id.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetList_ReportYear(year: number, org_id: number) {
        var apiUrl = this.apiReport + this.urlReportYear;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('year', year.toString());
        params = params.append('org_id', org_id.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetList_ReportQuarter(quarter: number, year: number, org_id: number) {
        var apiUrl = this.apiReport + this.urlReportQuarter;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('quarter', quarter.toString());
        params = params.append('year', year.toString());
        params = params.append('org_id', org_id.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetList_ReportHalf(year: number, org_id: number) {
        var apiUrl = this.apiReport + this.urlReportHalf;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('year', year.toString());
        params = params.append('org_id', org_id.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetReportByKey(obj_id: number, time_id: number, org_id: number) {
        var apiUrl = this.apiReport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        params = params.append('time_id', time_id.toString());
        params = params.append('org_id', org_id.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostReportData(obj_id: number, time_id: number, org_id: number, dataReport: any) {
        var apiUrl = this.apiReport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        params = params.append('time_id', time_id.toString());
        params = params.append('org_id', org_id.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, dataReport, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetOrganization(org_id: number) {
        var apiUrl = this.apiOrganization;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('org_id', org_id.toString());
        return this.http.post<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetViewAllReport() {
        var apiUrl = this.apiReport + this.urlViewAll;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public ApproveReport(obj_id: number, org_id: number, time_id: string) {
        var apiUrl = this.apiReport + this.urlApprove;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        params = params.append('org_id', org_id.toString());
        params = params.append('time_id', time_id);
        return this.http.post<any>(apiUrl, null, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeclineReport(obj_id: number, org_id: number, time_id: string) {
        var apiUrl = this.apiReport + this.urlDecline;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        params = params.append('org_id', org_id.toString());
        params = params.append('time_id', time_id);
        return this.http.post<any>(apiUrl, null, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public SendReport(obj_id: number, org_id: number, time_id: string) {
        var apiUrl = this.apiReport + this.urlSend;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        params = params.append('org_id', org_id.toString());
        params = params.append('time_id', time_id);
        return this.http.post<any>(apiUrl, null, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetAssignmentByObjId(obj_id: number) {
        var apiUrl = this.apiOrganization;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetReportByField(id) {
        var apiUrl = this.apiReport + this.urlLinhvucBaoCao;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('id_linh_vuc', id);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public Get12MonthReports(obj_id: number, year: number, attribute_code: string) {
        var apiUrl = this.apiReport + this.urlReport12Months;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('obj_id', obj_id.toString());
        params = params.append('year', year.toString());
        params = params.append('attribute_code', attribute_code);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetList_ReportPowerProduction(year : number) {
        var apiUrl = this.apiReport + this.urlReportPowerProduction;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('year', year.toString());
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Lỗi: ${error.error.message}`;
        } else {
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.error.message}`;
        }
        return throwError(errorMessage);
    }
}
