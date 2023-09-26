import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'notFilter',
    pure: false
})

export class NotFilterPipe implements PipeTransform {
    transform(value: any, filterValue: string, propName: string) { 
        if (filterValue === '' || value == undefined || (value != undefined && value.length == 0)) {
            return value;
        }    
        var temp = value.filter(item => item[propName] != filterValue);
        return temp;
    }
}
