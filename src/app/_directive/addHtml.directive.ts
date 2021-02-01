import { Directive,ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
    selector: '[add-html]'
})

export class TestDirectives{
    constructor(el:ElementRef,public sanitizer:DomSanitizer,public elementRef:ElementRef){
            this.elementRef.nativeElement.innerHTML ='<h1>Hello World</h1>';
    }
}