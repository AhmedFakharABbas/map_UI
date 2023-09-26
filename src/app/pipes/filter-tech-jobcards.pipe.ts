import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { BasicInfo } from 'app/models/basic-info';
@Pipe({
  name: 'searchTechJobCards'
})
export class FilterTechJobCards implements PipeTransform {
    transform(array: any[], query: string): any {  
        if (query) {  
          query = query.toLocaleLowerCase();
          return _.filter(array, (row: BasicInfo) => 
          (row.PlateNumber != null && row.PlateNumber.toLowerCase().indexOf(query) > -1)
          || row.JobCardNumber !=null && row.JobCardNumber.toLowerCase().indexOf(query) > -1
          || ((row.EnglishMakeName+' '+row.EnglishModelName).toLowerCase().indexOf(query) > -1)
        )
        }
        return array;
      }
}