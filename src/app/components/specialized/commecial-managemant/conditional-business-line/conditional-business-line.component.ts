import { Component, OnInit } from '@angular/core';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
    selector: 'conditional-business-line',
    templateUrl: './conditional-business-line.component.html',
})

export class ConditionalBusinessLineComponent implements OnInit {
    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/commecial-management/domestic/cbl";
    private readonly TITLE_DEFAULT: string = "Kinh doanh có điều kiện";
    private readonly TEXT_DEFAULT: string = "Kinh doanh có điều kiện";
    //Variable for only ts
    private _linkOutput: LinkModel = new LinkModel();
    constructor(private _breadCrumService: BreadCrumService) { }
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