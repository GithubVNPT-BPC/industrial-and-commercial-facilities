import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import {
  DeleteModel, PetrolPost, PetrolValuePost, Businessman,
  PostBusinessmanValue, TobaccoPost, LiquorPost, PetrolStore, LPGPost, CertificateModel, PetrolValuePostNEW, TobaccoPostNEW, LiquorPostNEW, LPGPostNEW
} from 'src/app/_models/APIModel/conditional-business-line.model';

@Injectable({
  providedIn: 'root'
})
export class ConditionBusinessService {
  token: any;
  username: any;
  data: any;
  apiHome = environment.apiEndpoint;

  public urlProductSelect = "api/danh-sach/san-pham";
  public urlAllCareer = "api/danh-sach/nganh-nghe";
  public urlDistrict = "api/danh-sach/quan-huyen";
  public urlSubDistrict = "api/danh-sach/phuong-xa";
  public urlLHHD = "api/danh-sach/loai-hinh-hoat-dong";
  public urlCer = "api/doanh-nghiep/giay-phep";
  public DeleteCer = "api/doanh-nghiep/xoa-giay-phep";
  public PostCer = "api/doanh-nghiep/giay-phep";
  public GetCerType = "api/danh-sach/loai-giay-phep";
  public GeturlField = "api/danh-sach/linh-vuc-quan-ly";

  urlgetTobaccoValue = "api/qltm/thuoc-la";
  urlgetAllTobaccoValue = "api/qltm/thuoc-la/tat-ca";
  urlpostTobacco = "api/qltm/thuoc-la";
  urldeleteTobacco = "api/qltm/thuoc-la/xoa";
  urlpostTobaccoValueNEW = "api/qltm/them-thuoc-la";

  urlgetLiquorValue = "api/qltm/ruou";
  urlgetAllLiquorValue = "api/qltm/ruou/tat-ca";
  urlpostLiquor = "api/qltm/ruou";
  urlpostLiquorNEW = "api/qltm/them-ruou";
  urldeleteLiquor = "api/qltm/ruou/xoa";

  urlgetLPGValue = "api/qltm/lpg";
  urlgetAllLPGValue = "api/qltm/lpg";
  urlpostLPG = "api/qltm/lpg";
  urlpostLPGNEW = "api/qltm/them-lpg";
  urldeleteLPG = "api/qltm/lpg/xoa";

  urlgetPetrolValue = "api/qltm/xang-dau/san-luong";
  urlgetAllPetrolValue = "api/qltm/xang-dau/tat-ca-san-luong";
  urlgetAllPetrolStore = "api/qltm/xang-dau/cua-hang";
  urlgetBusinessman = "api/qltm/thuong-nhan";

  urlpostPetrol = "api/qltm/xang-dau/cua-hang";
  urlpostPetrolValue = "api/qltm/xang-dau/san-luong";
  urlpostPetrolValueNEW = "api/qltm/xang-dau/them-san-luong";
  urlpostBusinessman = "api/qltm/thuong-nhan";
  urlpostBusinessmanValue = "api/qltm/thuong-nhan/cung-cap";

  urlDeleteBusinessman = "api/qltm/thuong-nhan/xoa";
  urlDeleteBusinessmanValue = "api/qltm/thuong-nhan/xoa-cung-cap";
  urlDeletePetrol = "api/qltm/xang-dau/xoa-cua-hang";
  urlDeletePetrolValue = "api/qltm/xang-dau/xoa-san-luong";

  urlSendEmail = "api/doanh-nghiep/thong-bao-giay-phep"

  constructor(public http: HttpClient, public logOutService: LoginService) {
    // this.data = JSON.parse(localStorage.getItem('currentUser'));
    // this.token = this.data.token;
  }

  //SendEmail
  public SendEmail(cond : number) {
    var apiUrl = this.apiHome + this.urlSendEmail;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('cond', cond.toString());
    return this.http.get<any>(apiUrl, { headers: headers, params: params  }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  //SendEmail

  //Petrol
  petrol: PetrolPost
  public PostPetrol(petrol: Array<PetrolStore>) {
    var apiUrl = this.apiHome + this.urlpostPetrol;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`).append("Access-Control-Allow-Origin", "*");
    return this.http.post<any>(apiUrl, petrol, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostPetrolValue(petrolvalue: Array<PetrolValuePost>) {
    var apiUrl = this.apiHome + this.urlpostPetrolValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, petrolvalue, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostPetrolValueNEW(petrolvalue: Array<PetrolValuePostNEW>) {
    var apiUrl = this.apiHome + this.urlpostPetrolValueNEW;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, petrolvalue, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  businessman: Businessman
  public PostBusinessman(businessman: Array<Businessman>) {
    var apiUrl = this.apiHome + this.urlpostBusinessman;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`).append("Access-Control-Allow-Origin", "*");
    return this.http.post<any>(apiUrl, businessman, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostBusinessmanValue(businessmanvalue: Array<PostBusinessmanValue>) {
    var apiUrl = this.apiHome + this.urlpostBusinessmanValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`).append("Access-Control-Allow-Origin", "*");
    return this.http.post<any>(apiUrl, businessmanvalue, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetBusinessman() {
    var apiUrl = this.apiHome + this.urlgetBusinessman;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllPetrolStore() {
    var apiUrl = this.apiHome + this.urlgetAllPetrolStore;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllPetrolValue() {
    var apiUrl = this.apiHome + this.urlgetAllPetrolValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetPetrolValue(time: string) {
    var apiUrl = this.apiHome + this.urlgetPetrolValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('time_id', time);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public DeleteBusinessman(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeleteBusinessman
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  public DeleteBusinessmanValue(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeleteBusinessmanValue
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  public DeletePetrol(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeletePetrol
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  public DeletePetrolValue(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeletePetrolValue
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  //Petrol

  //Tobacco
  tobacco: TobaccoPost
  public PostTobacco(tobacco: Array<TobaccoPost>) {
    var apiUrl = this.apiHome + this.urlpostTobacco;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, tobacco, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostTobaccoValueNEW(tobaccovalue: Array<TobaccoPostNEW>) {
    var apiUrl = this.apiHome + this.urlpostTobaccoValueNEW;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, tobaccovalue, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetTobaccoValue(time: string) {
    var apiUrl = this.apiHome + this.urlgetTobaccoValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('time_id', time);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllTobaccoValue() {
    var apiUrl = this.apiHome + this.urlgetAllTobaccoValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public DeleteTobaccoValue(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urldeleteTobacco
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  //Tobacco

  //Liquor
  liquor: LiquorPost
  public PostLiquor(liquor: Array<LiquorPost>) {
    var apiUrl = this.apiHome + this.urlpostLiquor;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, liquor, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostLiquorNEW(liquor: Array<LiquorPostNEW>) {
    var apiUrl = this.apiHome + this.urlpostLiquorNEW;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, liquor, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetLiquorValue(time: string) {
    var apiUrl = this.apiHome + this.urlgetLiquorValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('time_id', time);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllLiquorValue() {
    var apiUrl = this.apiHome + this.urlgetAllLiquorValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public DeleteLiquorValue(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urldeleteLiquor
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  //Liquor

  //LPG
  lpg: LPGPost
  public PostLPG(lpg: Array<LPGPost>) {
    var apiUrl = this.apiHome + this.urlpostLPG;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, lpg, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostLPGNEW(lpg: Array<LPGPostNEW>) {
    var apiUrl = this.apiHome + this.urlpostLPGNEW;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, lpg, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetLPGValue(time: string) {
    var apiUrl = this.apiHome + this.urlgetLPGValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('time_id', time);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllLPGValue() {
    var apiUrl = this.apiHome + this.urlgetAllLPGValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public DeleteLPGValue(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urldeleteLPG
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  //Liquor

  //mat-select api
  public GetProductList() {
    var apiUrl = this.apiHome + this.urlProductSelect;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllCareer() {
    var apiUrl = this.apiHome + this.urlAllCareer;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllDistrict() {
    var apiUrl = this.apiHome + this.urlDistrict;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllSubDistrict() {
    var apiUrl = this.apiHome + this.urlSubDistrict;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllBusinessType() {
    var apiUrl = this.apiHome + this.urlLHHD;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetCertificate(mst: string) {
    var apiUrl = this.apiHome + this.urlCer;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('mst', mst);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetALLCompany(mst: string) {
    var apiUrl = this.apiHome + this.urlCer;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('mst', mst);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public DeleteCertificate(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.DeleteCer
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  certificate: CertificateModel
  public PostCertificate(certificate: Array<CertificateModel>) {
    var apiUrl = this.apiHome + this.PostCer;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, certificate, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetCertificateType() {
    var apiUrl = this.apiHome + this.GetCerType;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetField() {
    var apiUrl = this.apiHome + this.GeturlField;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  //mat-select api

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
}
