import { Vehicle } from './vehicle';
import { VehicleContract } from './vehicle-contract';

export class CreateVehicle {
    vehicleObj: Vehicle;
    vehicleContractObj: VehicleContract;
    faceLift: boolean;
    /**
     *
     */
    constructor() {
        this.vehicleObj = new Vehicle();
        this.vehicleContractObj = new VehicleContract();
    }
}