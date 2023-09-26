import { BodyTypes } from "./body-types";
import { GeneralVehicle } from "./general-vehicle";


export class GeneralVehicles {
 GeneralVehicles: Array<GeneralVehicle>;
 BodyTypes : Array<BodyTypes>;
 MinYear: number;
 MaxYear: number;
    /**
     *
     */
    constructor() {
        this.GeneralVehicles = new Array<GeneralVehicle>();
    }
}