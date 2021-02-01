import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../_services/APIService/login.service";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { EventService } from "../../shared/services/evenet.service";
import { user_model } from "../../_models/user.model";

@Component({
  selector: "app-updateuser",
  templateUrl: "./updateuser.component.html",
  styleUrls: ["./updateuser.component.scss"],
})
export class UpdateuserComponent implements OnInit {
  constructor(
    public router: Router,
    public loginService: LoginService,
    public fb: FormBuilder,
    public eventService: EventService,
  ) {}
  profileForm: FormGroup;
  userModel: user_model;
  oldPassword: String;
  checked: boolean = false;
  hiden_pass: boolean = false;
  hiden_new_pass: boolean = false;
  user: String = '';
  ngOnInit() {
    this.profileForm = this.fb.group({
      user_name: [""],
      password: ["", Validators.required],
      full_name: [""],
      email: ["", Validators.email],
      mst: [""],
      new_password: [""],
      org_id: [""]
    });
    this.profileForm.controls['user_name'].disable();
    this.profileForm.controls['mst'].disable();
    console.log("xxx", this.update_user());
    this.updateProfile();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  async update_user() {
    // return currentUser;
  }

  updateProfile() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) currentUser = { user_name: "admin.sct", token: undefined };
    try {
      this.loginService
        .getUser(currentUser.user_name, currentUser.token)
        .subscribe((data) => {
          this.userModel = new user_model(data.data);
          this.profileForm.patchValue({
            user_name: this.userModel.user_name ? this.userModel.user_name : '',
            password: this.userModel.password ? this.userModel.password : '',
            email: this.userModel.email ? this.userModel.email : '',
            full_name: this.userModel.full_name ? this.userModel.full_name : '',
            mst: this.userModel.mst ? this.userModel.mst : '',
            org_id: this.userModel.org_id ? this.userModel.org_id : ''
          });
          console.log(this.profileForm);
          this.user = user_model['user_name'];
        });

      // debugger
    } catch (error) {
      alert(error);
    }

    // this.profileForm.patchValue({
    //   user_name: data.user_name,
    //   pass_word: data.password,
    //   email: data.email,
    //   full_name: data.full_name,
    //   org_id: data.org_id
    // });
  }

  checkuser(){
    if(this.user === 'admin')
      return true;
    return false;
  }
  onSubmit() {
    let body = {...this.profileForm.value};
    if(!body.new_password){
      body = {...body, new_password: body.password};
    }
    this.loginService.updateUser(body, undefined).subscribe(data => {
      if(data){
        // console.log('xxx',data)
        alert(data['message']);
      }
    })
    this.loginService.LogoutUser();
  }

  cancel() {
    this.router.navigate([""]);
    this.eventService.setvalue(false);
    // document.getElementById('account-dropdown').setAttribute('style', 'display: none');
  }

}
