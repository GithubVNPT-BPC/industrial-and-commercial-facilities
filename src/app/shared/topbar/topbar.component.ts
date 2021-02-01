//import Library ---------------------------------------------------------------------
import { Component, OnInit, Input, HostListener, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
//Import Service---------------------------------------------------------------------
import { LoginAuthGuardService } from 'src/app/_authGuard/LoginAuthGuardService';
import { LoginService } from '../../_services/APIService/login.service';
import { EventService } from '../services/evenet.service';
//Import Model---------------------------------------------------------------------
import { TYPE_OF_NAV } from '../../_enums/typeOfUser.enum';
import { NGB_TIMEPICKER_I18N_FACTORY } from '@ng-bootstrap/ng-bootstrap/timepicker/timepicker-i18n';
import { STYLESCSS_TYPE } from 'src/app/_enums/styleChoose.enum';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  //Constant---------------------------------------------------------------------
  public readonly AVATAR_DEFAULT: string = "../../../assets/img/avatars/1.jpg";
  public readonly USERNAME_DEFAULT: string = "Tên người dùng";
  public readonly NOTIFICATION_DEFAULT: number = 0;
  public readonly COLOR_USER_DEFUALT: string = "#ffc107";
  public readonly STYLE_SCSS_DEFAULTL: STYLESCSS_TYPE = STYLESCSS_TYPE.MATERIAL;
  //Variable for HTML & TS---------------------------------------------------------------------
  public img_avatar: string = this.AVATAR_DEFAULT;
  public userName: string = this.USERNAME_DEFAULT;
  public notificatios: number = this.NOTIFICATION_DEFAULT;
  public expression: boolean = true;
  public colorOfUser: string = this.COLOR_USER_DEFUALT;
  public styleOfScss: STYLESCSS_TYPE;
  //Variable for only TS---------------------------------------------------------------------

  //Input & Viewchild---------------------------------------------------------------------
  @Input() open: boolean = this._eventService.open;
  @Input('typeOfUser') typeOfUser: TYPE_OF_NAV;
  @Input() sidebar: MatSidenav;
  @Input('module') module_control: string; 
  //Contructor & Oninit---------------------------------------------------------------------
  constructor(
    public _loginAuthService: LoginAuthGuardService,
    public _loginService: LoginService,
    public _router: Router,
    public _eventService: EventService
  ) { }
  ngOnInit() {
    this.styleOfScss = this.STYLE_SCSS_DEFAULTL;
    this.open = this._eventService.open;
    this.expression = this.typeOfUser == TYPE_OF_NAV.SPECICALIZED ? true : false;
    this.colorOfUser = this._getColorOfUser(this.typeOfUser);
  }
  ngAfterViewChecked(): void {

  }
  //Functin for HTML event---------------------------------------------------------------------
  //Login
  public loginClick() {
    this._router.navigate(['login'], { queryParams: { returnUrl: this._router.url } });
  }
  public checkLogin() {
    if (localStorage.getItem('currentUser')) {
      let data: any = JSON.parse(localStorage.getItem('currentUser'));
      this.userName = data.full_name;
      return true;
    }
    else return
    false;
  }
  public openAccountDropdown() {
    this._eventService.setvalue(!this.open);
    this.open = this._eventService.getValue();
  }
  public openForm() {
    this._router.navigate(['/update_user']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }
  public openReportModule() {
    this._router.navigate(['/report/view-all']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }
  public openManagerModule() {
    this._router.navigate(['/manager/market/domestic/price']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }
  public openSpecializedModule() {
    this._router.navigate(['/specialized/commecial-management/domestic']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }

  public openHome(){
    
  }

  public openDropdown() {
    document.getElementById('account-dropdown').setAttribute('style', 'display: block');
  }

  public closeDropdown() {
    document.getElementById('account-dropdown').setAttribute('style', 'display: none');
  }

  public logout(){
    this._router.navigate(['/logout']);
  }
  //Function in TS---------------------------------------------------------------------
  public _getColorOfUser(type: number): string {
    let resultColor: string = "";
    switch (type) {
      case TYPE_OF_NAV.NONE:
        resultColor = this.COLOR_USER_DEFUALT;
        break;
      case TYPE_OF_NAV.MANAGER:
        resultColor = "#52e0eb";
        break;
      case TYPE_OF_NAV.PUBLIC:
        resultColor = "#379c08";
        break;
      case TYPE_OF_NAV.SPECICALIZED:
        resultColor = "#bd2bb3";
        break;
      default:
        resultColor = this.COLOR_USER_DEFUALT;
        break;
    }
    return resultColor;
  }
}
