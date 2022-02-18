import { ViewportScroller } from '@angular/common';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { onMainContentChange } from 'src/app/_animations/animation-sidebar';
import { MODULE_CONTROL } from 'src/app/_enums/module-control.enum';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['public-layout.component.scss'],
  styles: ['.scroll-to-top{position: fixed;background:red;bottom: 0;right: 0;cursor: pointer;}'],
  animations: [onMainContentChange]
})
export class PublicLayoutComponent implements OnInit {
  public readonly MODULE01: MODULE_CONTROL = MODULE_CONTROL.MODULE01;

  public pageYoffset = 0;
  public onSideNavChange: boolean;
  private _opened = true;
  @Input() sidebar: MatSidenav;

  constructor(
    public _sidenavService: SidebarService, 
    public scrollTop: ViewportScroller,
    private observer: BreakpointObserver) {
    this._sidenavService.sideBarState$.subscribe(res => {
      this.onSideNavChange = res;
    })
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  ngAfterViewInit() {
    this.observer.observe([`(max-width: 800px)`]).subscribe((res) => {
      this._opened = !res.matches
    });
  }

  numberOfClicks = 0;

  @HostListener('click', ['$event.target'])
  onClick(btn) {
  }
  private scrollToTop(): void {
  }
  public scrollEvent = (event: any): void => {
    this.pageYoffset = event.srcElement.scrollTop;
  }

}