import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
    selector: 'conditional-business-line',
    templateUrl: './conditional-business-line.component.html',
})

export class ConditionalBusinessLineComponent implements OnInit {
    private readonly LINK_DEFAULT: string = "";
    private readonly TITLE_DEFAULT: string = "KINH DOANH CÓ ĐIỀU KIỆN";
    private readonly TEXT_DEFAULT: string = "KINH DOANH CÓ ĐIỀU KIỆN";
    private _linkOutput: LinkModel = new LinkModel();

    constructor(private _breadCrumService: BreadCrumService,
        private router: Router) {
    }

    Petrol() {
        this.router.navigate(['specialized/commecial-management/domestic/petrol']);
    }

    Tobacco() {
        this.router.navigate(['specialized/commecial-management/domestic/tobacco']);
    }

    Liquor() {
        this.router.navigate(['specialized/commecial-management/domestic/liquor']);
    }

    LPG() {
        this.router.navigate(['specialized/commecial-management/domestic/lpg']);
    }

    ngOnInit() {
        this.sendLinkToNext(true);
    }

    public sendLinkToNext(type: boolean) {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }
}