import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { InvoiceFilter } from 'app/models/invoice-filter';
import { Invoice } from 'app/models/invoice';
import { ReturnInvoice } from 'app/models/return-invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private _customHttp: CustomHttpService) { }

  getAllInvoice(filter: InvoiceFilter){
    let url = 'api/JobCard/GetAllJobInvoices';    
    return this._customHttp.post(url, filter)
  }

  updateInvoice(jobInvoice: Invoice){
    let url ='api/JobCard/UpdateJobInvoice';
    console.log(jobInvoice);
    
    return this._customHttp.put(url, jobInvoice); 
  }

  getSingleInvoice(invoiceID: number){
    console.log("invoiceID", invoiceID);
    let url ='api/JobCard/GetSingleJobInvoice';
    return this._customHttp.get(url, {jobInvoiceID: invoiceID});
  }

  returnInvoice(returnInvoice: ReturnInvoice){
    let url ='api/JobCard/ReturnInvoice';
    return this._customHttp.post(url, returnInvoice);
  }

}
