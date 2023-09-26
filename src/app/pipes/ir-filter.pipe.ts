import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'irFilter',
    pure: false
})

export class IRFilterPipe implements PipeTransform {
    transform(value: any, filterValue: number, propName: string, filter2: number, prop2: string) { 
        if (filterValue == null|| value == undefined || (value != undefined && value.length == 0) || filter2 == null) {
            return value;
        }
        return value.filter(item => item[propName] != filterValue && item[prop2] != filter2);
    }
}
