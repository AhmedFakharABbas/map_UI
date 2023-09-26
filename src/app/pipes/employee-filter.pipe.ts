import { Employee } from 'app/models/employee';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'searchEmployeeFilter'
})
export class EmployeeFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
          query = query.toLocaleLowerCase();
          return _.filter(array, (row: Employee)=> row.FirstName.indexOf(query) > -1
          || row.FirstName.toLowerCase().indexOf(query) > -1
          || (row.LastName != null && row.LastName.indexOf(query) > -1)
          || (row.LastName!= null && row.LastName.toLowerCase().indexOf(query) > -1)
          || (row.FirstName!= null && row.LastName!= null && (row.FirstName+' '+row.LastName).indexOf(query) > -1)
          || (row.FirstName!= null && row.LastName!= null && (row.FirstName+' '+row.LastName).toLowerCase().indexOf(query) > -1)
        )
          
        }
        return array;
      }
}