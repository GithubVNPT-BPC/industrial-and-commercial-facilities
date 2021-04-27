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
  }

  Login() {
    this.loading = true;
    this.loginService.validateLoginUser(this.userModel, this.isBusiness).subscribe({
      next: (response) => {
        if (response.data.user_role_id == 1 || response.data.user_role_id == 6) {
          this.info.msgSuccess("Đăng nhập thành công");
          this.returnUrl = '/specialized/home'
          this.router.navigateByUrl(this.returnUrl);
        }
        else if (response.data.user_role_id == 2) {
          this.info.msgSuccess("Đăng nhập thành công");
          this.returnUrl = '/public/market/domestic/price'
          this.router.navigateByUrl(this.returnUrl);
        }
        else if (response.data.user_role_id == 7 || response.data.user_role_id == 3
          || response.data.user_role_id == 4 || response.data.user_role_id == 5) {
          this.info.msgSuccess("Đăng nhập thành công");
          this.returnUrl = '/public/market/domestic/price'
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: error => {
        this.info.msgError("Tài khoản hoặc mật khẩu không chính xác");
        this.loading = false;
      }
    });
  }
  LogOut() {
    this.loginService.LogoutUser();
  }
}