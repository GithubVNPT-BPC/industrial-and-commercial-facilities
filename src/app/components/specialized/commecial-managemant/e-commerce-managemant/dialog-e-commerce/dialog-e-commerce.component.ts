import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import _ from 'lodash';
@Component({
  selector: 'app-dialog-e-commerce',
  templateUrl: './dialog-e-commerce.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class DialogECommerceComponent implements OnInit {
  form = new FormGroup({
    mst: new FormControl('', Validators.required),
    ten_mien: new FormControl('', Validators.required),
    nganh_nghe: new FormControl('', [Validators.required]),
    ma_so_nganh_nghe: new FormControl('', [Validators.required])

  });
  form_TMDT = new FormGroup({
    mst: new FormControl('', Validators.required),
    ten_mien: new FormControl(''),
    loai_hang_hoa: new FormControl(''),
    so_gian_hang: new FormControl(0),
    // email: new FormControl('',Validators.email),
  })
  constructor(
    public sctService: SCTService,
    @Inject(MAT_DIALOG_DATA) public data: {saleWebsite: boolean}
  ) { 
  }

  ngOnInit() {
    console.log(this.data.saleWebsite);
  }

  onSubmit() {
    
    // alert(JSON.stringify(this.form.value));
    this.data.saleWebsite ?
    this.sctService.CapNhatDanhSachWebBH(Object.assign([this.form.value], this.form.value)).subscribe(res => {
      if(res.id === 1){
        alert(res.message)
      }
    })
    :
    // console.log(Object.assign([this.form_TMDT.value], this.form_TMDT.value))
    this.sctService.CapNhatDanhSachWebTMDT(Object.assign([this.form_TMDT.value], this.form_TMDT.value)).subscribe(res => {
      debugger
      console.log(res)
      if(res.id === 1) {
        alert(res.message)
      }
    })
  }


}


