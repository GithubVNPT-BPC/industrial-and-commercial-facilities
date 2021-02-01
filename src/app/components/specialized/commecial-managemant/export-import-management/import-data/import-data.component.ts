import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { SAVE } from "src/app/_enums/save.enum";
@Component({
  selector: "app-import-data",
  templateUrl: "./import-data.component.html",
  styleUrls: ["../../../special_layout.scss"],
})
export class ImportDataComponent implements OnInit{
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData
  ){
    if(dialogData.data['isImport']){
      this.type = SAVE.IMPORT;
    }
    if(dialogData.data['isExport']){
      this.type = SAVE.EXPORT;
    }
  }
  ngOnInit(): void {
    this.mapNameTabs();
    // throw new Error("Method not implemented.");
  }
  type: SAVE = SAVE.NONE;
  nameTab1: SAVE;
  nameTab2: SAVE;
  nameTab3: SAVE;
  mapNameTabs(){
    switch (this.type) {
      case SAVE.IMPORT:
        this.nameTab1 = SAVE.DATA_IMPORT;
        this.nameTab2 = SAVE.DETAIL_IMPORT;
        this.nameTab3 = SAVE.LIST_IMPORTED_COMPANY;
        break;
    
      case SAVE.EXPORT:
        this.nameTab1 = SAVE.DATA_EXPORT;
        this.nameTab2 = SAVE.DETAIL_EXPORT;
        this.nameTab3 = SAVE.LIST_EXPORTED_COMPANY;
      default:
        break;
    }
  }
}
