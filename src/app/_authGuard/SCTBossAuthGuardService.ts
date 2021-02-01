import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../_services/APIService/login.service';
import { InformationService } from '../shared/information/information.service';

@Injectable()
export class SCTBossAuthGuardService implements CanActivate {
    public readonly ROLE_ADMIN: number = 1;
    public readonly ROLE_DEPARTMENT: number = 2;
    public readonly MESSAGE_REJECT: string = "Chỉ Sở công thương mới có quyền! Vui lòng đăng nhập tài khoản của sở";
    public readonly REDIRECT_PAGE: string = "/public/dashboard";
    constructor(public router: Router,
        public authenticationService: LoginService,
        public info: InformationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user) {
            // console.log("SCTBossAuthGuardService", user);
            if (user.user_role == this.ROLE_ADMIN || user.user_role == this.ROLE_DEPARTMENT) {
                return true;
            }
            else{
                this.info.msgError(this.MESSAGE_REJECT);
                this.router.navigate([this.REDIRECT_PAGE], { queryParams: { returnUrl: state.url } });
                this.authenticationService.LogoutUser();
                return false;
            }
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate([this.REDIRECT_PAGE], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}