import { Component, Input, OnInit } from '@angular/core';
import { SAVE } from 'src/app/_enums/save.enum';

@Component({
  selector: 'app-mat-tab',
  templateUrl: './mat-tab.component.html',
  styles: []
})
export class MatTabComponent implements OnInit {

  @Input() information: SAVE;
  @Input('nameTab1') nameTab1: SAVE;
  @Input('nameTab2') nameTab2: SAVE;
  @Input('nameTab3') nameTab3: SAVE;
  constructor() { }

  ngOnInit() {
  }

}
