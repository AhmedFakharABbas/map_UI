import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'partfilter',
    pure: false
})

export class PartFilterPipe implements PipeTransform {
    transform(value: any, filterValue: string, propName: string) {
     
        if (filterValue != undefined || (value != undefined && value.length == 0)) {
            return value;
        }
        return value.filter(item => item[propName] == filterValue);
    }
}