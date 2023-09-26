import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'employeeFilter',
    pure: false
})

export class RoleBaseEmployeeFilterPipe implements PipeTransform {
    transform(value: any, filterValue: any, propName: string, roles: any) { 
        if (filterValue === '' || value == undefined || (value != undefined && value.length == 0) || roles == undefined || (roles != undefined && roles.length == 0)) {
            return value;
        }
        if (filterValue == 8) {
            const id = JSON.parse(localStorage.getItem('UserID'));
            var logged_user_id = parseInt(id)

            // console.log(logged_user_id,'id');
            // visual inspection
            return value.filter(item => roles.findIndex(item2 => ( item2.RoleID == 6 || item2.RoleID == 3) && item2.UserID == item.UserID && item2.UserID != logged_user_id)> -1);
        }
        if (filterValue == 9) {
            // initial inspection
            return value.filter(item => roles.findIndex(item2 => ( item2.RoleID ==8 || item2.RoleID == 5) && item2.UserID == item.UserID )> -1);
        }
        if (filterValue == 10) {
            // part pricing
            return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 7 ) && item2.UserID == item.UserID )> -1);
        }
        if (filterValue == 11) {
            // Quotation and Approval
            return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 3 ) && item2.UserID == item.UserID )> -1);
        }
        // if (filterValue == 12) {
        //     // Pending approval
        //     return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 3 ) && item2.UserID == item.UserID )> -1);
        // }
        // if (filterValue == 13) {
        //     // Parts Delivery
        //     return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 6 ) && item2.UserID == item.UserID) > -1);
        // }
        // if (filterValue == 14) {
        //     // Work inprogress
        //     return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 6 ) && item2.UserID == item.UserID )> -1);
        // }
        if (filterValue == 12) {
            // Quality Assurance
            return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 9 ) && item2.UserID == item.UserID) > -1);
        }
        // if (filterValue == 16) {
        //     // closed
        //     return value.filter(item => roles.findIndex(item2 => (  item2.RoleID == 10) && item2.UserID == item.UserID )> -1);
        // }
    }
}
