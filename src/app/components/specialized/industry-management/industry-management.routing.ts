import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChemicalManagementComponent } from './chemical-management/chemical-management.component';
import { ClusterManagementComponent } from './cluster-management/cluster-management.component';
import { DetailClusterManagementComponent } from './cluster-management/detail-cluster-management/detail-cluster-management.component';
import { FoodIndustryManagementComponent } from './food-industry/food-industry-management.component';
import { IIPIndustrialComponent } from './iip-industrial/iip-industrial.component';
import { IIPMonthComponent } from './iip-industrial/iip-month/iip-month-component';
import { IndustrialExplosivesComponent } from './industrial-explosives/industrial-explosives.component';
import { LPGManagementComponent } from './lpg-management/lpg-management.component';
import { CertificateRegulationComponent } from './certificate-regulation/certificate-regulation.component';
import { ReportExplosivesComponent } from './report-explosives/report-explosives.component';
import { IipMonthNewComponent } from './iip-industrial/iip-month-new/iip-month-new.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Quản lý công nghiệp',
        },
        children: [
            {
                path: 'chemical',
                component: ChemicalManagementComponent,
                data: {
                    title: 'Hóa chất',
                }
            },
            {
                path: 'lpg',
                component: LPGManagementComponent,
                data: {
                    title: 'Chiết nạp khí hóa lỏng',
                }
            },
            {
                path: 'food',
                component: FoodIndustryManagementComponent,
                data: {
                    title: 'Công nghiệp - Công nghiệp thực phẩm',
                }
            },
            {
                path: 'iip',
                component: IipMonthNewComponent,
                data: {
                    title: 'Chỉ số sản xuất công nghiệp',
                },
                children: [
                ]
            },
            {
                path: 'iip-detail',
                component: IIPMonthComponent,
                data: {
                    title: 'Chỉ số sản xuất công nghiệp',
                },
                children: [
                ]
            },
            {
                path: 'explosives',
                component: IndustrialExplosivesComponent,
                data: {
                    title: 'Vật liệu nổ CN',
                }
            },
            {
                path: 'cluster',
                component: ClusterManagementComponent,
                data: {
                    title: 'Quản lý Cụm Công nghiệp',
                }
            },
            {
                path: 'report',
                component: ReportExplosivesComponent,
                data: {
                    title: 'Báo cáo cụm công nghiệp',
                }
            },
            {
                path: 'cluster/:id',
                component: DetailClusterManagementComponent,
                data: {
                    title: 'Cụm công nghiệp A',
                }
            },
            {
                path: 'cr',
                component: CertificateRegulationComponent,
                data: {
                    title: 'Công bố hợp quy',
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndustryManagementRoutingModule { }
