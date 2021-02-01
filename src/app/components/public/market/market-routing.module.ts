import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomesticPriceComponent } from './domesticPrice/domestic-price.component';
import { DomesticExportComponent } from './domesticExport/domestic-export.component';
import { DomesticImportComponent } from './domesticImport/domestic-import.component';
import { DomesticProductComponent } from './domesticProduct/domestic-product.component';
import { ForeignMarketPriceComponent } from './foreignPrice/foreign-price.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Thông tin thị trường'
    },
    children: [
      {
        path: '',
        redirectTo: 'market'
      },
      {
        path: 'domestic',
        data: {
          title: 'Thị trường trong nước'
        },
        children: [
          {
            path: 'price',
            component: DomesticPriceComponent,
            data: {
              title: 'Giá cả trong nước',
            }
          },
          {
            path: 'export',
            component: DomesticExportComponent,
            data: {
              title: 'Thông tin xuất khẩu',
            }
          },
          {
            path: 'import',
            component: DomesticImportComponent,
            data: {
              title: 'Thông tin nhập khẩu',
            }
          },
          {
            path: 'product',
            component: DomesticProductComponent,
            data: {
              title: 'Thông tin nhập khẩu',
            }
          },
        ]
      },
      {
        path: 'foreign',
        component: ForeignMarketPriceComponent,
        data: {
          title: 'Thị trường quốc tế'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
