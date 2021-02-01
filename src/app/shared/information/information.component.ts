import {Component, Input, OnInit, Directive, NgModule} from '@angular/core';
import { NgModel } from '@angular/forms';
/**
 * @title Snack-bar with a custom component
 */

@Component({
  selector: 'app-information',
  templateUrl: 'information.component.html',
  styleUrls: ['information.component.scss']
})

export class InformationComponent implements OnInit {
  @Input() message: string;
  constructor() { }
  ngOnInit() {
  }
}
/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */