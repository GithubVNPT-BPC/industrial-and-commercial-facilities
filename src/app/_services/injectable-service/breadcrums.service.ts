import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { LinkModel } from 'src/app/_models/link.model';

@Injectable({
    providedIn: 'root'
})

export class BreadCrumService{
    private _link: Subject<LinkModel> = new Subject<LinkModel>();
    link$ = this._link.asObservable();

    constructor(){}

    sendLink(link: LinkModel){
        this._link.next(link);
    }
}