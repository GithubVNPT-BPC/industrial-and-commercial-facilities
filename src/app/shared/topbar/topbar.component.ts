import { Component, OnInit, Input, HostListener, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../../_services/APIService/login.service';
import { EventService } from '../services/evenet.service';
import { TYPE_OF_NAV } from '../../_enums/typeOfUser.enum';
import { STYLESCSS_TYPE } from 'src/app/_enums/styleChoose.enum';
import { SidebarService } from '../../_services/sidebar.service'
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { CertificateViewModel } from 'src/app/_models/APIModel/conditional-business-line.model';
import { formatDate, Location } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {
  public readonly AVATAR_DEFAULT: string = "../../../assets/img/avatars/1.jpg";
  public readonly username_DEFAULT: string = "Tên người dùng";
  public readonly NOTIFICATION_DEFAULT: number = 0;
  public readonly COLOR_USER_DEFUALT: string = "#ffc107";
  public readonly STYLE_SCSS_DEFAULTL: STYLESCSS_TYPE = STYLESCSS_TYPE.MATERIAL;
  public img_avatar: string = this.AVATAR_DEFAULT;
  public username: string = this.username_DEFAULT;
  public notificatios: number = this.NOTIFICATION_DEFAULT;
  public expression: boolean = true;
  public colorOfUser: string = this.COLOR_USER_DEFUALT;
  public styleOfScss: STYLESCSS_TYPE;
  public userrole: number;
  public mst: string

  @Input() open: boolean = this._eventService.open;
  @Input('typeOfUser') typeOfUser: TYPE_OF_NAV;
  @Input() sidebar: MatSidenav;
  @Input('module') module_control: string;
  constructor(
    public _loginService: LoginService,
    public _router: Router,
    public _eventService: EventService,
    public _sidebarService: SidebarService,
    public _Service: ConditionBusinessService,
  ) { }

  ngOnInit() {
    this.getBusinessList();

    this.styleOfScss = this.STYLE_SCSS_DEFAULTL;
    this.open = this._eventService.open;
    this.expression = this.typeOfUser == TYPE_OF_NAV.SPECICALIZED ? true : false;
    this.userrole = this._loginService.userValue.user_role_id
    this.mst = this._loginService.userValue.username

    this.id = '0'
  }
  ngAfterViewChecked(): void {
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyyMMdd', 'en-US');
  }

  certificate: Array<CertificateViewModel> = new Array<CertificateViewModel>();
  expirenumber: number;

  getBusinessList() {
    this._Service.GetCertificate('').subscribe(all => {
      this.certificate = all.data

      this.certificate.forEach(element => {
        if (element.ngay_het_han) {
          element.is_het_han = element.ngay_het_han < this.getCurrentDate()
        }
        else {
          element.is_het_han = false
        }
      });

      this.expirenumber = this.certificate.filter(x => x.is_het_han == true).length
    })
  }

  public expirecer(status: boolean) {
    this._router.navigate(['/specialized/commecial-management/domestic/certificate/' + status]);
  }

  id: string

  public loginClick() {
    this._router.navigate(['login'], { queryParams: { returnUrl: this._router.url } });
  }

  public checkLogin() {
    if (localStorage.getItem('currentUser')) {
      let data: any = JSON.parse(localStorage.getItem('currentUser'));
      this.username = data.full_name;
      return true;
    }
    else return
    false;
  }
  public openAccountDropdown() {
    this._eventService.setvalue(!this.open);
    this.open = this._eventService.getValue();
  }
  public openForm(id: string) {
    this._router.navigate(['/manager/user/' + id]).then(() => {
      window.location.reload()
    });
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
  public openPublicModule() {
    this._router.navigate(['/public/market/domestic/price']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }
  public openSpecializedModule() {
    this._router.navigate(['/specialized/home']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }
  public openLogger() {
    this._router.navigate(['manager/system-log']);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }

  public OpenDetailCompany(mst: string) {
    this._router.navigate(['manager/business/edit/' + mst]);
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }

  public ManageUser(id: string) {
    this._router.navigate(['/manager/manage-user/' + id]).then(() => {
      window.location.reload();
    })
    this._eventService.setvalue(false);
    this.open = this._eventService.getValue();
  }

  public openHome() {
  }

  public openDropdown() {
    document.getElementById('account-dropdown').setAttribute('style', 'display: block');
  }

  public closeDropdown() {
    document.getElementById('account-dropdown').setAttribute('style', 'display: none');
  }

  public logout() {
    this._router.navigate(['/logout']);
  }

}
