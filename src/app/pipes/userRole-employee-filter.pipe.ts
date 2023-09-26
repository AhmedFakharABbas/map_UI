import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userRoleFilter',
    pure: false
})

export class UserRoleEmployeeFilter implements PipeTransform {
    transform(value: any, role1: number, role2: number) { 

        if(value != undefined){
            return value.filter(item => item.RoleID == role1 || item.RoleID == role2 )
        }
        
    }
}
