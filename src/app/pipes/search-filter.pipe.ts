import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(array: any[], query: string , param: string): any {
    if (query == undefined || query == '') {
      return array;
    } else {
      query = query.toLowerCase();
      return _.filter(array, row =>
        (row[param] != null && row[param].toLowerCase().indexOf(query) > -1)
      );
    }

}
}
