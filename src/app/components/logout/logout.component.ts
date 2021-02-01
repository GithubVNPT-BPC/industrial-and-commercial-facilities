import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../_services/APIService/login.service';
import { Router } from '@angular/router';
import { InformationService } from 'src/app/shared/information/information.service';

@Component({
  selector: 'app-logout',
  templateUrl:'./logout.component.html',
})
export class LogoutComponent implements OnInit{

  constructor(public loginService: LoginService, public info:InformationService, public router:Router ) {
  }
  ngOnInit(){
      this.LogOut();
  }
  LogOut() {
    this.loginService.LogoutUser();
    this.info.msgSuccess("Bạn đã đăng xuất thành công");
    this.router.navigate(['/public/dashboard']);
  }
}