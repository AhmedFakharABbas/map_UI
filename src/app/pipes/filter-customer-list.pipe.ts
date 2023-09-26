import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { JobCardInfo } from 'app/models/job-card-info';
import { BasicInfo } from 'app/models/basic-info';
import { debug } from 'console';
import { IfStmt } from '@angular/compiler';
import { Customer } from 'app/models/customer';

@Pipe({
    name: 'filterCustomers'
})
export class FilterCustomerList implements PipeTransform {
 
    transform(array: any[], queryName: string, queryEmail: string, queryMobile: string, minBalance: number, maxBalance: number): any {

        if (queryName) {
            queryName = queryName.toLocaleLowerCase();
            return _.filter(array, (row: Customer) =>
                (row.FirstName + ' ' + row.LastName) != null && (row.FirstName + ' ' + row.LastName).toLowerCase().indexOf(queryName) > -1
                || row.CompanyName != null && row.CompanyName.toLowerCase().indexOf(queryName) > -1 
            )
        }
        else if (queryEmail) {
            queryEmail = queryEmail.toLocaleLowerCase();
            return _.filter(array, (row: Customer) =>
                row.ContactEmail != null && row.ContactEmail.toLowerCase().indexOf(queryEmail) > -1
            )
        }
        else if (queryMobile) {
            return _.filter(array, (row: Customer) =>
                row.ContactMobile != null && row.ContactMobile.indexOf(queryMobile) > -1
            )
        }
        else if (maxBalance > 0) {
            return _.filter(array, (row: Customer) =>
                row.MaxCreditLimit != null && (row.MaxCreditLimit >= minBalance && row.MaxCreditLimit <= maxBalance)
            )
        }


        return array;
    }
}