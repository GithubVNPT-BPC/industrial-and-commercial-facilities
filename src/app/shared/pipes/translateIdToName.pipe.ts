import { Pipe, PipeTransform } from '@angular/core';
import {TRANSLATE} from 'src/app/i18n/nghanh_nghe';

@Pipe({name: 'translate'})
export class TranslateIdToNamePipe implements PipeTransform{
    transform(value: any) {
        let message = TRANSLATE[value]
        return message;
    }

}
