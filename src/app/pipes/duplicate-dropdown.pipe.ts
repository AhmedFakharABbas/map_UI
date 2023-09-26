import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duplicateDropdown',
    pure: false
})

export class DuplicateDropdownPipe implements PipeTransform {
    
    transform( value: any, filterValue: any, propName: string, currentName: string ) { 
        
        if (filterValue === '' || filterValue.length == 0 || value == undefined || (value != undefined && value.length == 0)) {
            return value;
        }
        return value.filter(item => filterValue.findIndex(item2 => (item2[propName] == item[propName]) && item2[propName] != currentName) == -1); 
    }
}
