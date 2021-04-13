import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';


@Component({
    selector: "app-home-specialized",
    templateUrl: "./home-specialized.component.html",
    styleUrls: ["./home-specialized.component.scss"],
})
export class HomeSpecializedComponent implements OnInit {
    loading = true;

    constructor(private _router: Router
    ) {}

    ngOnInit() {

    }

    public OpenQLTM() {
        this._router.navigate(['/specialized/commecial-management/domestic']);
    }

    public OpenQLNL() {
        this._router.navigate(['/specialized/enery-management/hydroelectric']);
    }

    public OpenQLCN() {
        this._router.navigate(['/specialized/industry-management/chemical']);
    }

    public OpenDN() {
      this._router.navigate(['/specialized/commecial-management/domestic/search']);
  }
}
