import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  async ngOnInit(): Promise<void> {
  }
  constructor(public dashboardService: DashboardService) { }

}
