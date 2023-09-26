import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hourToMin'
  })
  export class HoursToMinPipe implements PipeTransform {
    transform(value: number): string {
       if(value > 0 && value/60 < 1) {
         return value + ' Minutes';
  
       }
       else if((Math.round( value/60 * 100) / 100)==0){
        return Math.round( value/60 * 100) / 100 + ' Hour' ;
       }
       else {
         return Math.round( value/60 * 100) / 100 + ' Hour(s)' ;
       }
    }
  }