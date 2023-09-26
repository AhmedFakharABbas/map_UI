import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'between',
  pure: true
})
export class BetweenPipe implements PipeTransform {

  transform(value: any, min: number, max: number, propName: string): any {
    if (value === '' || value == 'undefined' || value == undefined || value == undefined || (value != undefined && value.length == 0) || (min == null && max == null)) {
      return value;
  }
  // return value.filter(item => (item[propName] <= max && min >= item[propName]));
  return value.filter(item => item[propName] >= min &&  item[propName] <= max);
  }

}
