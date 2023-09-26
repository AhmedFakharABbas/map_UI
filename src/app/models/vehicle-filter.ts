export class VehicleFilter{
    PlateNumber: string; 
    MakeID: number;
    ModelID: number;
    VIN: string;
    MinProductionYear: number= 1950;
    MaxProductionYear: number = 2020;
    CustomerName: string;  
    WorkshopID: number;
    PageNumber: number = 1;
}