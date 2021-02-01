import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNumber'
})
export class FormatNumberReportPipe implements PipeTransform {

    transform(value: any): string {
        if(value){
            value = value.toString().replace(',', '').replace(',', '').replace(',', '');
            return new Intl.NumberFormat('en-us', {
                minimumFractionDigits: 0
            }).format(Number(value));
        } else{
            return "-";
        }
    }

}