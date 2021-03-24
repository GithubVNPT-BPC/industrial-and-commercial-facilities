import { NgModule } from '@angular/core';
import { ZeroAsSubPipe } from './shared/pipes/filterZeroAsSub.pipe';
import { FormatNumberReportPipe } from 'src/app/shared/pipes/formatNumber.pipe';


@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    ZeroAsSubPipe,
    FormatNumberReportPipe
  ],
  exports: [
    ZeroAsSubPipe,
    FormatNumberReportPipe
  ]
})
export class PipeModule { }


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */