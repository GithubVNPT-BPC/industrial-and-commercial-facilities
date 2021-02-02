import { Injectable } from "@angular/core";
import { normalizeValue , unicodeToAZ} from "src/app/_services/stringUtils.service";

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private filterValues = {};

    public createFilter() {
        let filterFunction = function (data: any, filter: string): boolean {
            let searchTerms = JSON.parse(filter);
            let isFilterSet = false;
            for (const col in searchTerms) {
                if (searchTerms[col].toString() !== '') {
                    isFilterSet = true;
                } else {
                    delete searchTerms[col];
                }
            }
    
            let nameSearch = () => {
                let found = false;
                if (isFilterSet) {
                    for (const col in searchTerms) {
                        searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
                            let value = data[col].toString();
                            if (unicodeToAZ(normalizeValue(value)).indexOf(word) != -1 && isFilterSet) {
                                found = true
                            }
                        });
                    }
                    return found
                } else {
                    return true;
                }
            }
            return nameSearch()
        }
        return filterFunction
    };

    public getFilters(col, value) {
        let val = unicodeToAZ(normalizeValue(value));
        this.filterValues[col] = val;
        return JSON.stringify(this.filterValues);
    }

    public clearFilter(obj, resetFields) {
        for (let field in resetFields) {
            obj[resetFields[field]] = "";
        }
        this.filterValues = {};
    }
}