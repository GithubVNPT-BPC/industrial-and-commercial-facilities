import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';

export const HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
    providedIn: 'root'
})
export class IndustryManagementService {
    // declare variables
    private data: any;
    private token: any;
    private username: any;

    private endpoint = environment.apiEndpoint + "api/qlcn";

    private urlGetChemicalManagement = '/hoa-chat';
    private urlGetChemicalNames = '/danh-sach-hoa-chat';
    private urlGetFoodIndustry = '/cntp';
    private urlGetLPGManagement = '/lpg';
    private urlGetComformityAnnounce = '/cbhq';
    private urlGetExplosiveMat = '/vlncn';


    private urlPostChemicalManagement = '/hoa-chat';
    private urlPostChemicalManagementQty = '/san-luong-hoa-chat';
    private urlPostLPGManagement = '/lpg';
    private urlPostFoodIndustry = '/cntp';
    private urlPostComformityAnnounce = '/cbhq';
    private urlPostExplosiveMat = '/vlncn';

    private urlGetDetailGroupCompany = '/ccn/chi-tiet';
    private urlGroupCompany = '/ccn/';

    // Update
    private urlUpdateComformityAnnounce = '/cbhq/chinh-sua';
    private urlUpdateImageIndustry = '/hinh-anh';

    private urlUploadmultipleimages = '/uploadimages';

    // Delete URLs

    private urlDeleteCertificatedRegulation = '/cbhq/xoa';
    private urlDeleteLPGManagement = '/lpg-xoa';
    private urlDeleteFoodIndustry = '/cntp-xoa';
    private urlDeleteChemistryQty = '/san-luong-hoa-chat-xoa';
    private urlDeleteChemistry = '/hoa-chat-xoa';
    private urlDeleteClusterManagement = '/xoa-ccn';
    private urlDeleteImageClusteManagement = '/xoa-hinh-anh'
    private urlDeleteExplosiveMat = '/vlncn/xoa';

    private urlPostAttachment = environment.apiEndpoint + 'api/upload-attachment';
    private urlUpdateAttachment = environment.apiEndpoint + 'api/update-attachment';
    private urlDeleteAttachment = environment.apiEndpoint + 'api/delete-attachment';

    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    // GET methods
    public GetChemicalManagement(time_id) {
        var apiUrl = this.endpoint + this.urlGetChemicalManagement;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetChemicalNameList() {
        var apiUrl = this.endpoint + this.urlGetChemicalNames;
        return this.http.get<any>(apiUrl, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetFoodIndustry(time_id) {
        var apiUrl = this.endpoint + this.urlGetFoodIndustry;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetLPGManagement(time_id) {
        var apiUrl = this.endpoint + this.urlGetLPGManagement;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetComformityAnnounce() {
        var apiUrl = this.endpoint + this.urlGetComformityAnnounce;
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetExplosiveMat(time_id) {
        var apiUrl = this.endpoint + this.urlGetExplosiveMat;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // POST methods
    public PostChemicalManagement(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostChemicalManagement;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostChemicalManagementQty(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostChemicalManagementQty;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostLPGManagement(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostLPGManagement;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostFoodIndustry(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostFoodIndustry;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostComformityAnnounce(datas) {
        let apiUrl = this.endpoint + this.urlPostComformityAnnounce;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public UpdateComformityAnnounce(datas) {
        let apiUrl = this.endpoint + this.urlUpdateComformityAnnounce;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostExplosiveMat(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostExplosiveMat;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // UNLINK
    public DeleteLPGManagement(datas) {
        let apiUrl = this.endpoint + this.urlDeleteLPGManagement;
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS }).pipe(tap(data => data),
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
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.error.message}`;
        }
        return throwError(errorMessage);
    }

    public GetDanhSachQuanLyCumCongNghiep() {
        var apiUrl = this.endpoint + this.urlGroupCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDetailGroupCompany(id) {
        var apiUrl = this.endpoint + this.urlGetDetailGroupCompany;
        let params = new HttpParams().set('id', id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostDataGroupCompany(body: any) {
        var apiUrl = this.endpoint + this.urlGroupCompany;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postFile(fileToUpload: Array<File>) {
        let apiUrl = this.endpoint + this.urlUploadmultipleimages
        const formData: FormData = new FormData();
        for (var i = 0; i < fileToUpload.length; i++) {
            formData.append('files', fileToUpload[i], fileToUpload[i].name);
        }

        return this.http.post<any>(apiUrl, formData).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteImageGroupCompany(body, id_image) {
        let apiUrl = this.endpoint + this.urlDeleteImageClusteManagement;
        let params = new HttpParams().set('id', id_image.toString());
        return this.http.post<any>(apiUrl, body, { params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteCBHQ(body: any) {
        var apiUrl = this.endpoint + this.urlDeleteCertificatedRegulation;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteFoodIndustry(body: any) {
        var apiUrl = this.endpoint + this.urlDeleteFoodIndustry;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteChemistry(body: any) {
        var apiUrl = this.endpoint + this.urlDeleteChemistry;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteChemistryQty(body: any) {
        var apiUrl = this.endpoint + this.urlDeleteChemistryQty;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteExplosiveMat(body: any) {
        var apiUrl = this.endpoint + this.urlDeleteExplosiveMat;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteClusterManagement(body: any) {
        var apiUrl = this.endpoint + this.urlDeleteClusterManagement;
        // let params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(apiUrl, body, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // ATTACHMENTS
    public PostAttachment(datas) {
        var apiUrl = this.urlPostAttachment;
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public UpdateAttachment(datas) {
        var apiUrl = this.urlUpdateAttachment;
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public DeleteAttachment(id) {
        var apiUrl = this.urlDeleteAttachment;
        return this.http.post<any>(apiUrl, id, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

}