import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterByCategory"
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(items: any, select?: any): any {
    if (select !== "Tất cả") {
      return select
        ? items.filter(item => item["ten_nhom_san_pham_kinh_doanh"].toLowerCase() === select.toLowerCase())
        : items;
    } else {
      return items;
    }
  }
}
