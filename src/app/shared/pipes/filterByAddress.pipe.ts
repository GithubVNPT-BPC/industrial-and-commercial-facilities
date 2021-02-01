
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterByAddress"
})
export class FilterByAddressPipe implements PipeTransform {
  transform(items: any, select?: any): any {
    if (select !== "Tất cả") {
      return select
        ? items.filter(item => item["dia_chi"].toLowerCase().indexOf(select.toLowerCase()) > 0)
        : items;
    } else {
      return items;
    }
  }
}
