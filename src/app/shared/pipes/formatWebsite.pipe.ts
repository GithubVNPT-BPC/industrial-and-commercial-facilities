import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'WebsiteFormat',
})
export class WebsiteFormatPipe implements PipeTransform {
  transform(value: string): string | null {
    if (value.indexOf("//") > 0) return value;
    else return "http://" + value;
  }
} 