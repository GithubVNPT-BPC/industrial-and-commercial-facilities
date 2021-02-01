import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { LoginService } from '../_services/APIService/login.service';
import { InformationService } from '../shared/information/information.service';

@Injectable()
export class LoginAuthGuardService implements CanActivate {
    public readonly MESSAGE_REJECT:string = "Người dùng doanh nghiệp không có quyền! Vui lòng đang nhập.";
    public readonly REDIRECT_PAGE:string ="/login";
    constructor(public router: Router, public location: Location, public authenticationService: LoginService, public info:InformationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user) {
            return true;
        } else {
            // not logged in so redirect to login page with the return url
            this.info.msgError(this.MESSAGE_REJECT);
            this.authenticationService.LogoutUser();
            //this.router.navigate([this.REDIRECT_PAGE], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}