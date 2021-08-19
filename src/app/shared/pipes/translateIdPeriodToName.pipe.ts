import { Pipe, PipeTransform } from '@angular/core';
import { TRANSLATE } from 'src/app/i18n/period';

@Pipe({ name: 'translateName' })
export class TranslateIdPeriodToNamePipe implements PipeTransform {
    transform(value: any) {
        let message = TRANSLATE[value]
        return message;
    }

}
