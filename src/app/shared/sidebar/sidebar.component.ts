import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/_services/APIService/login.service';
import { SidebarService } from '../../_services/sidebar.service'
import { onSideNavChange, animateText } from '../../_animations/animation-sidebar'

import { INavItem } from '../../_models/_nav.model';
import { TYPE_OF_NAV } from '../../_enums/typeOfUser.enum';
import { STYLESCSS_TYPE } from 'src/app/_enums/styleChoose.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class SidebarComponent implements OnInit {

  @Input('typeOfSideBar') typeOfSidebar: string;
  @ViewChild('sidebar', { static: false }) sidenav: MatSidenav;

  public readonly SIDEBAR_STATE_DEFAULT: boolean = false;
  public readonly SHOW_SUB_MENU_DEFAULT: boolean = false;
  public readonly LOGON_STATE_DEFAULT: boolean = false;
  public readonly LINK_TEXT_DEFAULT: boolean = false;
  public readonly PANEL_OPEN_STATE_DEFAULT: boolean = false;
  public readonly username_DEFUALT: string = "Tên tài khoản";
  public readonly AVATAR_DEFAULT: string = "../../../assets/img/avatars/1.jpg";
  public readonly STYLE_SCSS_DEFAULTL: STYLESCSS_TYPE = STYLESCSS_TYPE.MATERIAL;

  public styleOfScss: STYLESCSS_TYPE;
  public showSubMenus: Array<boolean> = new Array<boolean>();
  public showSubmenu: boolean = this.SHOW_SUB_MENU_DEFAULT;
  public sideNavState: boolean = this.SIDEBAR_STATE_DEFAULT;
  public linkText: boolean = this.LINK_TEXT_DEFAULT;
  public img_avatar: string = this.AVATAR_DEFAULT;
  public username: string = this.username_DEFUALT;
  public logon: boolean = this.LOGON_STATE_DEFAULT;
  public panelOpenState: boolean = this.PANEL_OPEN_STATE_DEFAULT;

  public navItems: INavItem[] = [];

  public options = {
    autoHide: true, scrollbarMinSize: 100, forceVisible: true, classNames: {
      content: 'simplebar-content',
      scrollContent: 'simplebar-scroll-content',
      scrollbar: 'simplebar-scrollbar',
      track: 'simplebar-track'
    }
  };

  constructor(
    public _sidebarService: SidebarService,
    public _loginService: LoginService,
    public _router: Router,
  ) { }

  ngOnInit() {
    this.styleOfScss = this.STYLE_SCSS_DEFAULTL;
    this._loginService.refreshToken();
    this.onSinenavToggle();
    this.logon = this._checkLocalStorage();
    this.getMenu();
    this.getIP();
  }

  public getMenu() {
    this._sidebarService.GetMenu().subscribe(
      all => {
        this.navItems = this.MenuList(all.data, this.typeOfSidebar)
      }
    )
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

  temp: Array<INavItem> = new Array<INavItem>();
  temp1: Array<INavItem> = new Array<INavItem>();

  public MenuList(navItems: Array<INavItem>, areacode: string): Array<INavItem> {
    let parentNavItems = navItems.filter(item => item.parent_id == null);
    let chilrentNavItems = navItems.filter(item => item.parent_id != null);
    parentNavItems.forEach(item => item.children = this.getChildNav(item, chilrentNavItems));
    this.temp = parentNavItems
    this.temp1 = this.temp.filter(item => item.navitems == areacode)
    return this.temp1;
  }

  public getChildNav(navItemParent: INavItem, navItems: Array<INavItem>): Array<INavItem> {
    let countChild: number = 0;
    let reOutput: Array<INavItem> = new Array<INavItem>();
    navItems.forEach(item => {
      if (item.parent_id === navItemParent.id) {
        reOutput.push(item);
        item.parent_id = null;
        countChild++;
      }
    })
    if (countChild > 0) {
      let chilrentNavItems = navItems.filter(item => item.parent_id != null);
      reOutput.forEach(item => item.children = this.getChildNav(item, chilrentNavItems));
      return reOutput
    } else {
      return null;
    }
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidebarService.sideBarState$.next(this.sideNavState)
  }

  public ngAfterContentChecked(): void {
  }

  public OpenChildren(index: number, navItem_child) {
    for (let i = 0; i < this.showSubMenus.length; i++) {
      if (i != index)
        this.showSubMenus[i] = false;
    }
    this.showSubMenus[index] = !this.showSubMenus[index];

    if (navItem_child.length === 1) {
      this._router.navigate([navItem_child[0].url]);
    }
  }

  public OpenSubChildren(index: number, navItem_child) {
    navItem_child['expand'] = !navItem_child['expand'];
  }

  public _checkLocalStorage(): boolean {
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        this.username = user.full_name;
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;
    }
  }

  navigate(url : string){
    this._router.navigateByUrl(url);
  }
}
