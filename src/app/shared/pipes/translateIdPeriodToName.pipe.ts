import { Pipe, PipeTransform } from '@angular/core';
import * as T from 'src/app/i18n/period';

@Pipe({ name: 'translateName' })
export class TranslateIdPeriodToNamePipe implements PipeTransform {
    transform(value: any, agr) {
        let message = T[agr][value]
        return message;
    }

}
