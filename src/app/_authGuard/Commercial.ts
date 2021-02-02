import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../_services/APIService/login.service';
import { InformationService } from '../shared/information/information.service';

@Injectable()
export class Commercial implements CanActivate {
    public readonly MESSAGE_REJECT: string = "Tài khoản không được phép vào khu vực này";
    public readonly REDIRECT_PAGE: string = "/public/dashboard";
    constructor(public router: Router,
        public authenticationService: LoginService,
        public info: InformationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user) {
            if (user.user_role_id == 4 || user.user_role_id == 1) {
                return true;
            }
            else {
                this.info.msgError(this.MESSAGE_REJECT);
                this.router.navigate([this.REDIRECT_PAGE], { queryParams: { returnUrl: state.url } });
                // this.authenticationService.LogoutUser();
                return false;
            }
        } else {
            this.router.navigate([this.REDIRECT_PAGE], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}