export class Appointment {
    AppointmentID: number;
    LicensePlateFront: string;
    LicensePlateBack: string;
    MileageImageURL: string;
    VehicleFront: string;
    VehicleRear: string;
    VehicleRight: string;
    VehicleLeft: string;
    VehicleInside: string;
    VehicleRoof: string;
    Dashboard: string;
    Rim1: string;
    Rim2: string;
    Rim3: string;
    Rim4: string;
    Mileage: number;
    MileageUnit: number = 43;
    CreatedBy: number;
    IsDeleted: boolean;
    CreatedOn: Date;
    CustomerMobile: string;
    PlateNumber: string;
    WorkshopID: number;
    FuelTankReading: number;
    VehicleID: number;
    CustomerID: number;
    AppointmentDateTime: any;
    IsValet: boolean;
    Note: string;
    PriorityTypeID: number;
    VehicleTypeID: number = 15;
    MileageUnitName: string;
    AppointmentCount: number;
    InspectionSignatureURL: string;
    JobCardID: number;
    
}