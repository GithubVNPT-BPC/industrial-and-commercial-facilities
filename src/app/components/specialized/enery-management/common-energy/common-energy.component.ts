import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';

export interface PeriodicElement {
  name: string;
  stt: number;
  t1: string,
  t2: string,
  t3: string,
  t4: string,
  t5: string,
  t6: string,
  t7: string,
  t8: string,
  t9: string,
  t10: string,
  t11: string,
  t12: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    stt: 1, name: 'Lĩnh vực về Năng lượng - Thủy điện.',
    t1: '1', t2: '2', t3: '3', t4: '4', t5: '5', t6: '6',
    t7: '7', t8: '8', t9: '9', t10: '10', t11: '11', t12: '12'
  },
  {
    stt: 2, name: 'Phát triển điện',
    t1: '1', t2: '2', t3: '3', t4: '4', t5: '5', t6: '6',
    t7: '7', t8: '8', t9: '9', t10: '10', t11: '11', t12: '12'
  },
  {
    stt: 3, name: 'Cơ sở sử dụng năng lượng trọng điểm',
    t1: '1', t2: '2', t3: '3', t4: '4', t5: '5', t6: '6',
    t7: '7', t8: '8', t9: '9', t10: '10', t11: '11', t12: '12'
  },
];

@Component({
  selector: 'app-common-energy',
  templateUrl: './common-energy.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class CommonEnergyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  displayedColumns: string[] = [
    'stt', 'name', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12'
  ];
  dataSource = ELEMENT_DATA;
}
