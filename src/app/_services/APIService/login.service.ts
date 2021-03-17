import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { UserModel } from '../../_models/APIModel/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RegisterModel } from '../../_models/APIModel/register.model';

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    public readonly LOCALSTORAGE_USER: string = "currentUser";
    public readonly HOME_PAGE: string = "/dashboard";
    public loggedUser: string;
    public token: string;
    public userSubject: BehaviorSubject<UserModel>;
    public user: Observable<UserModel>;
    public refreshTokenTimeout;

    public apiUrl = environment.apiEndpoint + "api/dang-nhap/dang-nhap-sct";
    public apiRegister = environment.apiEndpoint + "api/dang-ky";
    public apiGetUserInfor = environment.apiEndpoint + "api/tai-khoan";
    public apiUpdateUser = environment.apiEndpoint + "api/tai-khoan";
    public apiLogout = environment.apiEndpoint + "api/dang-xuat";
    public apiRefreshToken = environment.apiEndpoint + "api/cap-lai-token";

    /**
     * @param _http 
     * @param router 
     */
    constructor(public _http: HttpClient, public router: Router,) {
        this.userSubject = new BehaviorSubject<UserModel>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): UserModel {
        if (!this.userSubject.value) {
            return this.getUserFromStorage();
        }
        return this.userSubject.value;
    }

    public getUserFromStorage(): UserModel {
        let user: UserModel = new UserModel();
        if (localStorage.getItem(this.LOCALSTORAGE_USER)) {
            let data = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_USER));
            user.user_id = data.user_id;
            user.user_role_id = data.role;
            user.org_id = data.org_id;
            user.username = data.username;
            user.token = data.token;
            user.full_name = data.full_name;
            if (data.refresh_token != null) {
                user.refresh_token = data.refresh_token;
            }
            if (data.user_id != null) {
                user.imageUrl = data.user_id.toString();
            }
        }
        return user;
    }

    /**
     * @param loginmodel 
     */

    public validateLoginUser(loginmodel: UserModel, isBusiness) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams();
        params = params.append('isBusiness', isBusiness);
        return this._http.post<any>(this.apiUrl, loginmodel, { headers: headers, params: params })
            .pipe(tap(response => {
                if (response.data != null) {
                    if (response.data.token != null) {
                        let user = this.createUserFromRes(response.data);
                        this.updateUserToLocalstorage(user)
                        this.userSubject.next(user);
                        return response;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }),
                catchError(this.handleError)
            );
    }

    public isLoggedIn() {
        return !!this.getJwtToken();
    }

    public getJwtToken() {
        return localStorage.getItem(this.LOCALSTORAGE_USER);
    }

    /**
     * public
     * Map UserModel from response
     * @param response response from API Login server
     */

    public createUserFromRes(data: any): UserModel {
        let user: UserModel = new UserModel();
        user.user_id = data.user_id;
        user.user_role_id = data.user_role_id;
        user.org_id = data.org_id;
        user.username = data.username;
        user.token = data.token;
        user.full_name = data.full_name;
        if (data.refresh_token != null) {
            user.refresh_token = data.refresh_token.token;
        }
        if (data.user_id != null) {
            user.imageUrl = data.user_id.toString();
        }
        return user;
    }

    public updateUserToLocalstorage(user: UserModel): void {
        localStorage.setItem(this.LOCALSTORAGE_USER,
            JSON.stringify({
                token: user.token,
                role: user.user_role_id,
                user_id: user.user_id,
                username: user.username,
                org_id: user.org_id,
                full_name: user.full_name,
                refresh_token: user.refresh_token,
            }));
    }

    /**
     * @param registerModel
     */
    public register(registerModel: RegisterModel) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post<any>(
            this.apiRegister,
            registerModel,
            { headers: headers, observe: 'response' })
            .pipe(catchError(this.handleError));
    }

    public LogoutUser(): void {
        localStorage.removeItem(this.LOCALSTORAGE_USER);
        this.userSubject.next(null);
    }

    /**
     * @param userName
     * @param token
     */
    public getUser(userName, token): any {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let params = new HttpParams();
        params = params.append('isBusiness', userName.includes('admin') ? 'false' : 'true');
        let url = `${this.apiGetUserInfor}/${userName}`;
        try {
            return this._http.get<any>(url, { headers: headers, params: params });
        } catch (error) {
            this.handleError(error);
        }
    }
    /**
     * @param body 
     * @param token 
     */
    public updateUser(body, token) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let params = new HttpParams();
        params = params.append('isBusiness', body['username'] === 'admin' ? 'false' : 'true');
        let url = `${this.apiGetUserInfor}/${body['username']}`
        return this._http.post(url, body, { headers: headers, params: params });
    }

    public refreshToken() {
        let api = this.apiRefreshToken
        let data = { 'refresh_token': this.userValue.refresh_token, 'isBusiness': false };
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.userValue.token });
        return this._http.post<any>(api, data, { headers: headers })//withCredentials: true
            .pipe(tap((response) => {
                if (response) {
                    //Kiểm tra response chỗ này, xem refresh có hết hạn luôn không. Nếu có thì báo hết hạn rồi logout.
                    let user = this.createUserFromRes(response.data);
                    this.userSubject.next(user);
                    this.updateUserToLocalstorage(user)
                    //this.startRefreshTokenTimer();
                    return response;
                }
                else {
                    return throwError;
                }
            }));
    }

    public stopRefreshTokenTimer(): void {
        clearTimeout(this.refreshTokenTimeout);
    }

    /**
     * @param error 
     */
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
