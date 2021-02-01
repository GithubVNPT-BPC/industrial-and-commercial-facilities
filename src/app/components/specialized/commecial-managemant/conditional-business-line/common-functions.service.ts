import { Injectable } from "@angular/core";

@Injectable()
export class CommonFuntions{
    getYears() {
        return [{value: 0, des: 'Tất cả'}, ...Array(5).fill(1).map((element, index) => {
                return {value: new Date().getFullYear() - index , des: (new Date().getFullYear() - index).toString()}
            }
        )]
    }
}