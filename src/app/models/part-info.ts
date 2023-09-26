import { Part } from './part';
import { VendorPartPrice } from './vendor-part-price';
import { AutomotivePartVehicle } from './automotive-part-vehicle';
import { SubstitutePart } from './substitute-part';
import { CreateVehicle } from './create-vehicle';
import { Vehicle } from './vehicle';
import { MainPart } from './main-part';

export class PartInfo {
    AutomotivePart: Part;
    VendorPartPrice: Array<VendorPartPrice>;
    AutomotivePartVehicle: Array<AutomotivePartVehicle>;
    AutomotivePartsList: Array<Part>;
    SubstitutePart: Array<SubstitutePart>;
    vehicleObj: Vehicle;
    mainPart: MainPart;

    constructor() {
        this.AutomotivePart = new Part();
        this.VendorPartPrice = new Array<VendorPartPrice>();
        this.AutomotivePartVehicle = new Array<AutomotivePartVehicle>();
        this.AutomotivePartsList = new Array<Part>();
        this.SubstitutePart = new Array<SubstitutePart>();
        this.vehicleObj = new Vehicle();
    }
}