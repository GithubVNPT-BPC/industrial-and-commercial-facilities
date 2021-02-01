import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHART_THEME } from 'src/app/_enums/chart.theme.enum';
import { ThemeService, Label, BaseChartDirective } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts/ng2-charts'
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';
import { CHART_TYPE } from 'src/app/_enums/chart.type.enum';
import { regExpEscape } from '@ng-bootstrap/ng-bootstrap/util/util';
import moment from 'moment';
import * as Highcharts from "highcharts";

interface HashTableNumber<T> {
  [key: number]: T;
}
interface HashTableString<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  //Declare
  _selectedTheme: CHART_THEME = CHART_THEME.LIGHT;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public readonly RECORD_NUMBER : number = 10;
  public data: any;
  public showChart: boolean = false;
  public barChartData: Array<ChartDataSets> = new Array<ChartDataSets>();
  public barChartDataHash: HashTableNumber<ChartDataSets> = {};
  public barChartDataMemberHash: HashTableNumber<number[]> = {};
  public xLabelOfChart: string[][] = [];
  public xLabelOfChartHash: HashTableString<string[]> = {};
  public chartType: ChartType = CHART_TYPE.LINE;
  public chartLegend = true;
  public chartPlugins = [];
  public labelChart: Label[] = [];
  public listChartType: string[] = [];
  public selectedType: CHART_TYPE;

  public defaultProducts: Object[] = [{ma_san_pham: 2}, {ma_san_pham: 10}, {ma_san_pham: 4}, {ma_san_pham: 5}];
  
  @ViewChild('CHART', { static: true }) public Chart: BaseChartDirective;
  public CreateListChartType() {
    for (let type in CHART_TYPE) {
      this.listChartType.push(type.toString());
    }
  }
  public ChangeChartType() {
    // console.log(this.selectedType);
    this.chartType = this.selectedType;
    this.Chart.update();
  }
  async ngOnInit(): Promise<void> {
    this.selectedType = CHART_TYPE.BAR;
    this.CreateListChartType();
    this.data = await this.dashboardService.GetPriceAllProduct(this.RECORD_NUMBER, this.defaultProducts).toPromise();
    // let index = 0;
    if (this.data.data) {
      this.data.data.forEach(element => {

        element.forEach(data => {
          if (!this.xLabelOfChartHash[data.thoi_gian_cap_nhat]) {
                this.xLabelOfChartHash[data.thoi_gian_cap_nhat] = [];
                this.xLabelOfChartHash[data.thoi_gian_cap_nhat].push(this.GetDate(data.thoi_gian_cap_nhat));
              }
              
          if (!this.barChartDataHash[data.id_san_pham]) {
            this.barChartDataHash[data.id_san_pham] = {};
          }
          if (!this.barChartDataMemberHash[data.id_san_pham]) {
            this.barChartDataMemberHash[data.id_san_pham] = [];
          }
        });

        this.barChartDataHash[element[0].id_san_pham].label = element[0].ten_san_pham;
      });
      
      Object.keys(this.xLabelOfChartHash).forEach(key => this.labelChart.push(this.xLabelOfChartHash[key].sort()));

      this.labelChart = this.labelChart.sort();

      this.data.data.forEach(element => {
        let tempGia : number[] = [];

        this.labelChart.forEach(data => {
          var temp = element.filter(x => this.GetDate(x.thoi_gian_cap_nhat) == data);
          // console.log(temp);
          if (temp.length == 0)
            tempGia.push(0)
            else
            tempGia.push(temp[0].gia);
        });

        this.barChartDataMemberHash[element[0].id_san_pham] = tempGia;
      });

      Object.keys(this.barChartDataMemberHash).forEach(key => this.barChartDataHash[key].data = this.barChartDataMemberHash[key]);
      Object.keys(this.barChartDataHash).forEach(key => this.barChartData.push(this.barChartDataHash[key]));
      
      /*
      barChartData
      labelChart
      barChartOptions
      chartPlugins
      chartLegend
      chartType
      */
      this.showChart = true;
    }
  }
  constructor(public themeService: ThemeService, public dashboardService: DashboardService) { }

  setCurrentTheme(theme: CHART_THEME) {
    this._selectedTheme = theme;
  }

  // getDateOfFullDate(date: Date) {
  //   let result: string;
  //   let newDate = new Date(date);
  //   // result = date.substr(6, 2) + '/' + date.substr(4, 2) + '/' + date.substr(0, 4)
  //   console.log('test' + result)
  //   return result;
  // }

  // GetMonthAndYear(time: string) {
  //   let year = time.substr(0, 4);
  //   let month = time.substr(4, 2);
  //   let day = time.substr(6, 2);
  //   let result = day + "/" + month + "/" + year;
  //   return result as string;
  // }


  Highcharts = Highcharts;
  linechart = {
    series: [
      {
        data: [1, 2, 3]
      }
    ],
    chart: {
      type: "line"
    },
    title: {
      text: "linechart"
    }
  };
  barchart = {
    series: [
      {
        data: [1, 2, 3]
      }
    ],
    chart: {
      type: "bar"
    },
    title: {
      text: "barchart"
    }    
  };

  GetDate(date: string) {
    let newDate = new Date(date);
    // console.log(newDate);
    //return this.GetMonthAndYear(newDate.toISOString().replace('-', '').replace('-', ''));
    return moment(newDate).format('DD/MM/YYYY');
  }

  public get SelectedTheme() {
    return this._selectedTheme;
  }

  public set SelectedTheme(value) {
    this._selectedTheme = value;
    let overrides: ChartOptions;
    if (this._selectedTheme === CHART_THEME.LIGHT) {
      overrides = {
        legend: {
          labels: { fontColor: 'white' }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }],
          yAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }]
        }
      };
    } else {
      overrides = {};
    }
    this.themeService.setColorschemesOptions(overrides);
  }

}
