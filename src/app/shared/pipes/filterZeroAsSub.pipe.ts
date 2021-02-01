import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'ZeroAsSub',
  })
  export class ZeroAsSubPipe implements PipeTransform {
    transform(value: any): string | null {
      if(!value) return "-";
      else if (value == 0) return "-";
        else return value.toString();
    }
}