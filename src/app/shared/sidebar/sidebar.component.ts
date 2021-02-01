//Import library-----------------------------------------------------------
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
//Import service-----------------------------------------------------------
import { EventService } from '../services/evenet.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { SidebarService } from '../../_services/sidebar.service'
import { onSideNavChange, animateText } from '../../_animations/animation-sidebar'
//Import Component-----------------------------------------------------------

//Import Model-----------------------------------------------------------
import { navItemsPublic, navItemsManager, navItemsSpecialized, navItemsReport } from './_nav';
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
  //Input & viewchild-----------------------------------------------------------
  @Input('typeOfSideBar') typeOfSidebar: number = 0;
  @ViewChild('sidebar', { static: false }) sidenav: MatSidenav;

  //Constatnt-----------------------------------------------------------
  public readonly SIDEBAR_STATE_DEFAULT: boolean = false;
  public readonly SHOW_SUB_MENU_DEFAULT: boolean = false;
  public readonly LOGON_STATE_DEFAULT: boolean = false;
  public readonly LINK_TEXT_DEFAULT: boolean = false;
  public readonly PANEL_OPEN_STATE_DEFAULT: boolean = false;
  public readonly USER_NAME_DEFUALT: string = "Tên tài khoản";
  public readonly AVATAR_DEFAULT: string = "../../../assets/img/avatars/1.jpg";
  public readonly STYLE_SCSS_DEFAULTL: STYLESCSS_TYPE = STYLESCSS_TYPE.MATERIAL;

  //Variable for only TS-----------------------------------------------------------

  public styleOfScss: STYLESCSS_TYPE;
  //Variable for TS & HTML-----------------------------------------------------------
  public navItems: INavItem[] = [];
  public showSubMenus: Array<boolean> = new Array<boolean>();
  public showSubmenu: boolean = this.SHOW_SUB_MENU_DEFAULT;
  public sideNavState: boolean = this.SIDEBAR_STATE_DEFAULT;
  public linkText: boolean = this.LINK_TEXT_DEFAULT;
  public img_avatar: string = this.AVATAR_DEFAULT;
  public userName: string = this.USER_NAME_DEFUALT;
  public logon: boolean = this.LOGON_STATE_DEFAULT;
  public panelOpenState: boolean = this.PANEL_OPEN_STATE_DEFAULT;
  public options = {
    autoHide: true, scrollbarMinSize: 100, forceVisible: true, classNames: {
      // defaults
      content: 'simplebar-content',
      scrollContent: 'simplebar-scroll-content',
      scrollbar: 'simplebar-scrollbar',
      track: 'simplebar-track'
    }
  };

  //Contruction and Oninit-----------------------------------------------------------
  constructor(
    public _sidebarService: SidebarService,
    public _loginService: LoginService,
    public _router: Router,
  ) { }

  ngOnInit() {

    this.styleOfScss = this.STYLE_SCSS_DEFAULTL;
    this._loginService.refreshToken();
    this.onSinenavToggle();
    if (this.navItems) {
      let navLength = this.navItems.length;
      for (let index = 0; index < navLength; index++) {
        this.showSubMenus.push(false);
      }
    }
    this.logon = this._checkLocalStorage();
    this.navItems = this._showNavigationMenu(this.typeOfSidebar);
  }

  //Function for event HTML-----------------------------------------------------------
  //When toggle menu click
  onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidebarService.sideBarState$.next(this.sideNavState)
  }
  //Function default run when After Content Checked
  public ngAfterContentChecked(): void {
    // if (this.logon) {
    //   this._checkurlSCTData();
    // } else {
    //   this.navItems = this.navItemsLogout;
    // }
  }
  //Open child menu
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

  // Open subchildren
  public OpenSubChildren(index: number, navItem_child) {
    // console.log('xxx ', index, navItem_child)
    navItem_child['expand'] = !navItem_child['expand'];
  }

  //Function for only TS-----------------------------------------------------------
  //Check localstorage for get Login information
  public _checkLocalStorage(): boolean {
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        this.userName = user.full_name;
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;
    }
  }
  // //Check link is SCT
  // public _checkurlSCTData(): void {
  //   if (this._router.url.includes('sct')) this.navItems = navItemsReports;
  // }
  //Check user is Bussiness
  public _checkUserIsBusiness(): void {
    if (this.logon) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      let isBusiness = currentUser.role === "3" ? true : false;
    }
  }
  //Check input and show menu
  public _showNavigationMenu(typeNav: number): INavItem[] {
    let navItems: INavItem[] = [];
    switch (typeNav) {
      case TYPE_OF_NAV.NONE:
        navItems = [];
        break;
      case TYPE_OF_NAV.MANAGER:
        navItems = navItemsManager;
        break;
      case TYPE_OF_NAV.PUBLIC:
        navItems = navItemsPublic;
        break;
      case TYPE_OF_NAV.SPECICALIZED:
        navItems = navItemsSpecialized;
        break;
      case TYPE_OF_NAV.REPORT:
        navItems = navItemsReport;
        break;
      default:
        navItems = [];
        break;
    }
    return navItems;
  }
}
