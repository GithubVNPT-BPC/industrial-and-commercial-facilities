import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from '../../_services/sidebar.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./custom-footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(
    public _sidebarService: SidebarService,
    public _loginService: LoginService
  ) { }

  ngOnInit() {
    this.getIP();
  }

  getIP() {
    this._sidebarService.getIPAddress().subscribe((res: any) => {
      if (this._loginService.userValue.user_role_id == 0) {
        this.CountAccess(res.ip)
      }
      else {
        this.CountAccess('')
      }
    });
  }

  tong_luot_truy_cap: number
  so_luot_truy_cap_nam: number
  so_luot_truy_cap_thang: number
  so_luot_truy_cap_ngay: number

  public CountAccess(ip: string) {
    this._sidebarService.CountAccess(ip).subscribe(
      all => {
        this.tong_luot_truy_cap = all.data.tong_luot_truy_cap
        this.so_luot_truy_cap_nam = all.data.so_luot_truy_cap_nam
        this.so_luot_truy_cap_thang = all.data.so_luot_truy_cap_thang
        this.so_luot_truy_cap_ngay = all.data.so_luot_truy_cap_ngay
      }
    )
  }

}
