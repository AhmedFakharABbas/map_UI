import { Customer } from './customer';
import { Vehicle } from './vehicle';
import { BasicInfo } from './basic-info';

export class CustomerInfo {
   Customer : Customer;
   Vehicle : Array<Vehicle>;
   JobCards : Array<BasicInfo>;
}