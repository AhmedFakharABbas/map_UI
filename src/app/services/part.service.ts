import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { SharedService } from './shared.service';
import { from, Observable } from 'rxjs';
import { PartFilter } from 'app/models/part-filter';
import { PartInfo } from 'app/models/part-info';
import { AutomotivePartVehicle } from 'app/models/automotive-part-vehicle';
import { VendorPartPrice } from 'app/models/vendor-part-price';
import { SubstitutePart } from 'app/models/substitute-part';
import { PurchaseOrderItem } from 'app/models/purchase-order-item';
import { PurchaseOrderProfile } from 'app/models/purchase-order-profile';
import { PurchaseOrder } from 'app/models/purchase-order'
import { CreateVehicle } from 'app/models/create-vehicle';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }

  getMetaData() {
    let url = 'api/AutomotivePart/GetAutomotivePartMetaData';
    return this._customHttp.get(url, { workshopID: this._sharedService.currentWorkshopID})
  }

  savePart(partInfoObj:PartInfo): Observable<any>{
    var url = 'api/AutomotivePart/SaveAutomotivePart';
    var partInfo = new  PartInfo(); 
    partInfo.AutomotivePart = partInfoObj.AutomotivePart; 
    partInfo.VendorPartPrice = partInfoObj.VendorPartPrice.filter(item => item.IsModified == true); 
    partInfo.AutomotivePartVehicle = partInfoObj.AutomotivePartVehicle.filter(item => item.IsModified == true); 
    partInfo.SubstitutePart = partInfoObj.SubstitutePart.filter(item => item.IsModified == true); 
    return this._customHttp.post(url,partInfo );
  }

  getSinglePart(id: number){
    var url = 'api/AutomotivePart/GetSingleAutomotivePart';
    return this._customHttp.get(url,{automotivePartID: id});
  }

  getAllParts(filter: PartFilter){
    var url = 'api/AutomotivePart/GetAllAutomotiveParts';
    return this._customHttp.post(url, filter);
  }
  getAllPartsCount(filter: PartFilter){
    var url = 'api/AutomotivePart/GetAutomotivePartsCount';
    return this._customHttp.post(url, filter);
  }

  updatePart(partObj: PartInfo): Observable<any>{
    var url = 'api/AutomotivePart/UpdateAutomotivePart';
    var partInfo = new  PartInfo(); 
    partInfo.AutomotivePart = partObj.AutomotivePart; 
    partInfo.VendorPartPrice = partObj.VendorPartPrice.filter(item => item.IsModified == true); 
    partInfo.AutomotivePartVehicle = partObj.AutomotivePartVehicle.filter(item => item.IsModified == true); 
    partInfo.SubstitutePart = partObj.SubstitutePart.filter(item => item.IsModified == true); 
    return this._customHttp.put(url, partInfo);
  }

  deletePart(id: number){
    var url = 'api/AutomotivePart/DeleteAutomotivePart';
    return this._customHttp.delete(url,{automotivePartID: id, modifiedBy: this._sharedService.logged_user_id});
  }

  deleteVendorPartPrice(partVendor: VendorPartPrice){
    var url = 'api/AutomotivePart/DeleteVendorPartPrice';
    return this._customHttp.delete(url,{automotivePartID: partVendor.AutomotivePartID, vendorPartPriceID: partVendor.VendorPartPriceID, modifiedBy: this._sharedService.logged_user_id});
  }

  deleteAutomotivePartVehicle(partVehicle: AutomotivePartVehicle){
    var url = 'api/AutomotivePart/DeleteAutomotivePartVehicle';
    return this._customHttp.delete(url,{automotivePartID: partVehicle.AutomotivePartID, partVehicleID: partVehicle.AutomotivePartVehicleID, modifiedBy: this._sharedService.logged_user_id});
  }

  getAllCompareParts(filter: PartFilter){
    var url = 'api/AutomotivePart/GetAllCompareParts';
    return this._customHttp.post( url, filter);
  }

  deleteSubstitutePart(SubstitutePart: SubstitutePart){
    var url = 'api/AutomotivePart/DeleteSubstitutePart';
    return this._customHttp.delete(url,{automotivePartID: SubstitutePart.AutomotivePartID, substitutePartID: SubstitutePart.SubstitutePartID, modifiedBy: this._sharedService.logged_user_id})
  }

  getAllPurchaseOrders(StatusID: number, PageNo: number)
  {
    var url = 'api/PurchaseOrders/GetAllPurchaseOrders';
    return this._customHttp.get(url,{StatusID: StatusID, PageNo:PageNo}); 
  }
  getSinglePurchaseOrder(PurchaseOrderID: number)
  {
    var url = 'api/PurchaseOrders/GetSinglePurchaseOrder';
    return this._customHttp.get(url,{PurchaseOrderID: PurchaseOrderID});
  }
  updatePurchaseOrder(purchaseOrdero: PurchaseOrderProfile,purchaseOrderItems: Array<PurchaseOrderItem> )
  {
    var url = 'api/PurchaseOrders/UpdatePurchaseOrder';

    var purchaseOrder: PurchaseOrder = new PurchaseOrder();
    purchaseOrder.purchaseOrder = purchaseOrdero;
    purchaseOrder.purchaseOrderItems = purchaseOrderItems;

    return this._customHttp.put(url,purchaseOrder);
  }

  addSeriesID(makeID : number, modelID : number, seriesID : number): Observable<any>{
    var url = 'api/AutomotivePart/CheckSeriesID';
    return this._customHttp.post(url, {MakeID : makeID, ModelID : modelID, SeriesID : seriesID})
  }

  checkItemCode(itemCode : any, workshopID : number): Observable<any>{
    debugger
    var url = 'api/AutomotivePart/CheckItemCode';
    return this._customHttp.post(url, {ItemCode : itemCode , WOrkshopID : workshopID})
  }

  PartVehicleSeries( model: CreateVehicle): Observable<any> {
    debugger
    var url = 'api/AutomotivePart/PartVehicleSeries';
    return this._customHttp.post(url, model)
  }

}
