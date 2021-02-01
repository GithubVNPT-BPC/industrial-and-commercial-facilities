import { Component, OnInit } from '@angular/core';
import { InformationService } from '../../shared/information/information.service';
import { LoginService } from '../../_services/APIService/login.service';
import { UserModel } from '../../_models/APIModel/user.model';
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  userModel: UserModel = new UserModel();
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  error = '';
  loading = false;
  isBusiness: boolean = false;
  public returnUrl: string = "";

  constructor(public info: InformationService,
    public loginService: LoginService,
    public router: Router,
    public route: ActivatedRoute,
    public location: Location) {
  }
  ngOnInit() {
    // reset login status
    this.LogOut();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if((this.returnUrl.indexOf('specialized')) ==-1||(this.returnUrl.indexOf('manager') ==-1)){
      this.returnUrl = 'specialized/home';
    }
    console.log("returnUrl", this.returnUrl);
  }
  Login() {
    this.loading = true;
    // console.log(this.userModel)
    this.loginService.validateLoginUser(this.userModel, this.isBusiness).subscribe({
      next: (response) => {
        if (response.data == null) {
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          config.verticalPosition = this.verticalPosition;
          //this.info.openSnackBar("Tài khoản hoặc mật khẩu không chính xác");
          this.router.navigate(['login']);
        }
        else {
          if (response.data.user_role == 1) {
            this.info.msgSuccess("Đăng nhập thành công với tư cách Sở Công thương");
          }
          if (response.data.user_role == 2) {
            this.info.msgSuccess("Đăng nhập thành công với tư cách các Đơn vị thuộc Sở");
          }
          if (response.data.user_role == 3) {
            this.info.msgSuccess("Đăng nhập thành công với tư cách Doanh nghiệp");
          }
          // if (document.referrer == "") {
          //   this.router.navigate(['market/domestic/price']);
          // } else {
          //   this.location.back();
          // }
          // login successful so redirect to return url
          this.router.navigateByUrl(this.returnUrl);
 
        }
      },
      error: error => {
        this.error = error;
        this.loading = false;
      }
    });
  }
  LogOut() {
    this.loginService.LogoutUser();
  }
}