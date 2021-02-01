import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../_services/APIService/login.service';
import { InformationService } from '../shared/information/information.service';

@Injectable()
export class BusinessAuthGuardService implements CanActivate {
    public readonly ROLE_BUSINESS:number = 1;
    public readonly MESSAGE_REJECT:string = "Người dùng doanh nghiệp không có quyền";
    public readonly REDIRECT_PAGE:string ="/login";

    constructor(
        public router: Router,
        public authenticationService: LoginService,
        public info:InformationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user) {
            if (user.user_role == this.ROLE_BUSINESS){
                return true;
            }
            else{
                this.info.msgError(this.MESSAGE_REJECT);
                return false;
            }
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate([this.REDIRECT_PAGE], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}