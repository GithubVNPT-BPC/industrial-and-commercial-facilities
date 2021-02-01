import { Component } from '@angular/core';
import { RegisterModel } from '../../_models/APIModel/register.model';
import { LoginService } from '../../_services/APIService/login.service';
import { InformationService } from '../../shared/information/information.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  registerModel : RegisterModel = new RegisterModel();

  constructor(public loginService: LoginService, public info : InformationService, public router: Router) { }

  Register(){
    this.loginService.register(this.registerModel).subscribe(response =>{
      if (response.status == 200)
        this.info.msgSuccess("Tạo tài khoản thành công");
        this.router.navigate(['dashboard']);
    })
  }
}
