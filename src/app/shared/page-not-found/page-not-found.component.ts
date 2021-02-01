import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { InformationService } from '../information/information.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(public _location: Location, public info:InformationService,) 
  {}

  ngOnInit() {

  }

  SendRequest(){
    this.info.msgWaring("Yêu cầu đã được gửi! Chúng tôi sẽ xem xét");
    this._location.back();
  }

  GoBack(){
    this._location.back();
  }
}
