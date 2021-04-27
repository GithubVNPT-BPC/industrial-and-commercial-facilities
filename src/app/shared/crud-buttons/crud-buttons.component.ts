import { Component, OnInit, ElementRef, ViewChild ,Injector, Input } from '@angular/core';
import { BaseComponent } from 'src/app/components/specialized/base.component';

@Component({
  selector: 'app-crud-buttons',
  templateUrl: './crud-buttons.component.html',
  styleUrls: ['./crud-buttons.component.scss']
})
export class CrudButtonsComponent implements OnInit {

  @Input('name_report') name_report;
  @Input('authorize') authorize;
  @Input('selection') selection;
  @Input('table') table: ElementRef;

  constructor(private injector : Injector) {

  }
  
  ngOnInit(){
  }

}
