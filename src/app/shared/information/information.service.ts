import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { InformationComponent } from './information.component';

@Injectable()
export class InformationService {
  public readonly DURING_SECOND = 2;
  public readonly PANEL_SUCCESS ="success";
  public readonly PANEL_WARNING ="warning";
  public readonly PANEL_ERROR = "error";
  message: string;

  constructor(public _snackBar: MatSnackBar) {
  }

  public openSnackBar(message: string, panelClass: string) {
    this.message = message;
    const snackBar = this._snackBar.openFromComponent(InformationComponent, {
      duration: this.DURING_SECOND * 1000,
      panelClass:[panelClass]
    });
    snackBar.instance.message = message;
  }

  public msgSuccess(message){
    this.openSnackBar(message,this.PANEL_SUCCESS);
  }

  public msgWaring(message){
    this.openSnackBar(message,this.PANEL_WARNING);
  }

  public msgError(message){
    this.openSnackBar(message,this.PANEL_ERROR);
  }
}
