import { Injectable, ɵConsole } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginService } from '../_services/APIService/login.service';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { UserModel } from '../_models/APIModel/user.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    public isRefreshing = false;
    public refreshTokenSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);

    constructor(public authenticationService: LoginService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.apiEndpoint);
        if (isLoggedIn && isApiUrl) {
            request = this.addToken(request, user.token);
        }
        console.log(request);
        return next.handle(request).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return this.handle401Error(request, next);
            } else {
                return throwError(error);
            }
        }));
    }

    public addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
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
    public handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authenticationService.refreshToken().pipe(
                switchMap((token: any) => {
                    if (token){
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(token.data);
                        return next.handle(this.addToken(request, this.refreshTokenSubject.value.token));
                    }
                    else
                    return throwError;
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt.token));
                }));
        }
    }
}