import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'editAcceptedJob',
    pure: false
})

export class EditAcceptedJobPipe implements PipeTransform {
    transform(value: any, loggedID: number, jp: any, jcID: number) {
        if (jp === '' || jp.length == 0 || loggedID == undefined || jcID == 0 || value == undefined || (value != undefined && value.length == 0)) {
            return value;
        }
        var temp = jp.filter(item => item.UserID == loggedID && item.IsAccepted == true && jcID == item.JobCardID)
        // return value.filter(item => item[propName] == filterValue);
        if (temp.length > 0) {
            return true;
        } else
            return false;
    }
}
