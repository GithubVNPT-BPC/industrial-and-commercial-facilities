import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNumber'
})
export class FormatNumberReportPipe implements PipeTransform {

    transform(value: any): string {
        if(typeof value === 'number'){
            value = value.toString();
        }
        if(value && value.trim() != "-"){
            value = value.toString().replace(',', '').replace(',', '').replace(',', '');
            return new Intl.NumberFormat('vi-VN', {
                minimumFractionDigits: 0
            }).format(Number(value));
        } else{
            return "-";
        }
    }

}