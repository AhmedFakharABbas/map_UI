import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'yearFilter',
    pure: false
})
export class YearFilterPipe implements PipeTransform {
    transform(value: any, filterValue: string, propName: string) {
       
        if (filterValue === '' || value == undefined || (value != undefined && value.length == 0)) {
            return value;
        }
        return value.filter(item => item[propName] >= filterValue);
    }
}
