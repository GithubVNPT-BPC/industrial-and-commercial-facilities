//import Library ---------------------------------------------------------------------
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, HostListener, Output, Inject } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
//Import Service---------------------------------------------------------------------
import { LoginAuthGuardService } from 'src/app/_authGuard/LoginAuthGuardService';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { LoginService } from '../../_services/APIService/login.service';
import { EventService } from '../services/evenet.service';
import { filter } from 'rxjs/operators';
//Import Model------------------------------------------------- --------------------

class Node<T>{
  next: Node<T>;
  constructor(public data: T) {
  }
}

export class Queue<T> {
  head: Node<T>;
  tail: Node<T>;

  constructor() {
    this.head = this.tail = null;
  }

  enqueue(data: T): void {
    const node = new Node(data);

    if (this.isEmpty()) {
      this.head = this.tail = node;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  dequeue(): T {
    if (this.isEmpty()) {
      return null;
    }

    const data = this.head.data;

    if (this.tail === this.head) {
      this.head = this.tail = null;
    } else {
      this.head = this.head.next;
    }

    return data;
  }

  isEmpty() {
    return this.head === null;
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  //Constant---------------------------------------------------------------------
  public readonly AVATAR_DEFAULT: string = "../../../assets/img/avatars/1.jpg";
  //Variable for HTML & TS---------------------------------------------------------------------
  public breadcrumbs: Queue<LinkModel> = new Queue<LinkModel>();
  public link: LinkModel = new LinkModel();
  //Variable for only TS---------------------------------------------------------------------
  private _previousUrl: string;
  //Input & Viewchild---------------------------------------------------------------------
  // @Input() link: LinkModel = new LinkModel();
  //Contructor & Oninit---------------------------------------------------------------------
  constructor(
    public _router: Router,
    private _breadCrumService: BreadCrumService,
    private _location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.link.title = "";
    _router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // console.log('prev:', event.url);
        this._previousUrl = event.url;
      });
  }
  ngOnInit() {
    this._breadCrumService.link$.subscribe(
      linkPass => {
        this.link = linkPass;
      }
    )
  }
  @HostListener('window:scroll', [])

  onWindowScroll() {
    console.log("scroll");
    var header = document.getElementById("myHeader");
    var sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
  //Functin for HTML event---------------------------------------------------------------------
  public back(): void {
    // this._router.navigate([ this._previousUrl]);
    this._location.back();
  }
}
