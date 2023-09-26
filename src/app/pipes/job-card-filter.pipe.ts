import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { JobCardInfo } from 'app/models/job-card-info';
import { BasicInfo } from 'app/models/basic-info';
import { debug } from 'console';
import { IfStmt } from '@angular/compiler';

@Pipe({
  name: 'searchJobCard'
})
export class JobCardFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any { 
        if (query) {  
          query = query.toLocaleLowerCase();
          return _.filter(array, (row: BasicInfo)=> 
          //row.JobCardNumber.indexOf(query) > -1
           (row.CustomerFullName != null && row.CustomerFullName.toLowerCase().indexOf(query) > -1)
          || (row.PlateNumber != null && row.PlateNumber.toLowerCase().indexOf(query) > -1)
          || (row.ContactPersonMobile != null && row.ContactPersonMobile.toLowerCase().indexOf(query) > -1)
          
          //|| (row.CardNumber != null && row.CardNumber.toLowerCase().indexOf(query) > -1) 
          || row.JobCardNumber !=null && row.JobCardNumber.toLowerCase().indexOf(query) > -1
          //|| (row.CustomerFullName!= null && row.PlateNumber!= null && (row.CustomerFullName+' '+row.PlateNumber).toLowerCase().indexOf(query) > -1)
        )
        }
        return array;
      }
}