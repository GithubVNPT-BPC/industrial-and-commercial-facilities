import { Pipe, PipeTransform } from '@angular/core';
import {TRANSLATE_PRODUCT} from 'src/app/i18n/nghanh_nghe';
@Pipe({name: 'translate'})
export class dich implements PipeTransform{
    transform(value: any) {
        let message = TRANSLATE_PRODUCT[value]
        return message;
    }

}