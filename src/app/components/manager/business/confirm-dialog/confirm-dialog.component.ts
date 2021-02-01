import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styles: [],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @Input()
  message:string = 'Bạn muốn xóa dữ liệu ';
  data_close: any = {
    confirm: 'Yes',
    no_confirm: 'No'
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ConfirmDelete(){
    console.log('aaaa');
  }

  ngOnInit(){

  }
}
