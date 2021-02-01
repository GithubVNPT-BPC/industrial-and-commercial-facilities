import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionalBusinessLineComponent } from './conditional-business-line/conditional-business-line.component';
import { LiquorBusinessComponent } from './conditional-business-line/liquor-business/liquor-business.component';
import { LPGBusinessComponent } from './conditional-business-line/lpg-business/lpg-business.component';
import { PetrolBusinessComponent } from './conditional-business-line/petro-business/petrol-business.component';
import { TobaccoBusinessComponent } from './conditional-business-line/tobacco-business/tobacco-business.component';
import { CommonCommecialComponent } from './infrastructure/common/common-commecial.component';
import { MarketCommecialManagementComponent } from './infrastructure/market/market-commecial.component';
import { SuperMarketCommecialManagementComponent } from './infrastructure/supermarket/supermarket-commecial.component';
import { InformedEcommerceWebsiteComponent } from './e-commerce-managemant/informed-ecommerce-website/informed-ecommerce-website.component'; import { TRSManagementComponent } from './infrastructure/total-retail-sales/total-retail-sales.component';
import { ImportManagementComponent } from "./export-import-management/import-management/import-management.component";
import { ExportManagementComponent } from "./export-import-management/export-management/export-management.component";
import { BorderTradeComponent } from './border-trade/border-trade.component';
import { RegisteredSaleWebsiteComponent } from './e-commerce-managemant/registered-sale-website/registered-sale-website.component';
import { MultilevelTradeComponent } from "./multilevel-trade/multilevel-trade.component";
import { RetailComponent } from './retail/retail.component';
import { RetailMonthComponent } from './retail/retail-month/retail-month.component';
import { TradeFairsExhibitionsComponent } from './trade-development/trade-fairs-exhibitions/trade-fairs-exhibitions.component';
import { SubscribeDiscountComponent } from './trade-development/subscribe-discount/subscribe-discount.component';
import { BorderTradeImportComponent } from './border-trade/border-trade-import/border-trade-import.component';
import { BorderTradeExportComponent } from './border-trade/border-trade-export/border-trade-export.component';
const routes: Routes = [
  {
    path: 'domestic',
    data: {
      title: 'Thương mại nội địa',
    },

    children: [
      {
        path: '',
        component: CommonCommecialComponent,
        data: {
          title: 'Quản lý thương mại chung',
        }
      },
      {
        path: 'market',
        component: MarketCommecialManagementComponent,
        data: {
          title: 'Quản lý chợ',
        }
      },
      {
        path: 'supermarket',
        component: SuperMarketCommecialManagementComponent,
        data: {
          title: 'Quản lý siêu thị',
        }
      },
      // {
      //   path: 'shoppingcentre',
      //   component:,
      //   data: {
      //     title: 'Quản lý TTTM',
      //   }
      // },
      {
        path: 'cbl',
        component: ConditionalBusinessLineComponent,
        data: {
          title: 'Quản lý các mặt hàng KD có ĐK',
        }
      },
      {
        path: 'petrol',
        component: PetrolBusinessComponent,
        data: {
          title: 'Quản lý cửa hàng bán lẻ xăng dầu',
        }
      },
      {
        path: 'tobacco',
        component: TobaccoBusinessComponent,
        data: {
          title: 'Quản lý bán buôn sản phẩm thuốc lá',
        }
      },
      {
        path: 'liquor',
        component: LiquorBusinessComponent,
        data: {
          title: 'Quản lý bán buôn rượu',
        }
      },
      {
        path: 'lpg',
        component: LPGBusinessComponent,
        data: {
          title: 'Quản lý mua bán LPG',
        }
      },
      {
        path: 'trs',
        component: TRSManagementComponent,
        data: {
          title: 'Tổng mức bán lẻ HH&DV',
        }
      },
      // {
      //   path: 'trs',
      //   component: TRSManagementComponent,
      //   data: {
      //     title: 'Đăng ký khuyến mãi',
      //   }
      // },
    ]
  },
  {
    path: 'trade-development',
    children: [
      {
        path: 'TFE',
        component: TradeFairsExhibitionsComponent,
        data: {
          title: 'Hội trợ triển lãm',
        }
      },
      {
        path: 'SD',
        component: SubscribeDiscountComponent,
        data: {
          title: 'Đăng ký khuyến mãi',
        }
      },
    ]
  },
  {
    path: 'e-commerce',
    children: [
      {
        path: 'ecommerce-website',
        component: InformedEcommerceWebsiteComponent
      },
      {
        path: 'sale-website',
        component: RegisteredSaleWebsiteComponent
      }
    ]
  },
  {
    path: 'retail',
    component: RetailComponent,
  },
  {
    path: 'retail/retail-detail',
    component: RetailMonthComponent
  },
  {
    path: 'export_import',
    children: [
      {
        path: 'imported_products',
        component: ImportManagementComponent
      },
      {
        path: 'exported_products',
        component: ExportManagementComponent
      }
    ]
  },
  {
    path: 'border_trade',
    // component: BorderTradeComponent
    children: [
      {
        path: 'import',
        component: BorderTradeImportComponent
      },
      {
        path: 'export',
        component: BorderTradeExportComponent
      }
    ]
  },
  {
    path: 'multilevel_trade',
    component: MultilevelTradeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommecialManagementRoutingModule { }
