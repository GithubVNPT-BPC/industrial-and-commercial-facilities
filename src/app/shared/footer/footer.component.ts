import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from '../../_services/sidebar.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: ['footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public _sidebarService: SidebarService,
  ) { }

  ngOnInit() {
    this.getIP();
  }

  getIP() {
    this._sidebarService.getIPAddress().subscribe((res: any) => {
      this.CountAccess(res.ip)
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
