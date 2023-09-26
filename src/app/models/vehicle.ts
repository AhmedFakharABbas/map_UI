export class Vehicle {
  VehicleID: number;
  InternalVehicleNo: string;
  MakeID: number;
  ModelID: number;
  Year: number;
  ProductionYear: number;
  SeriesYearStart: number;
  SeriesYearEnd: number;
  ModelVersionID: number;
  VIN: string;
  Color: string = "Black";
  PlateTypeID: number = 25;
  PlateNumber: string;
  EngineNumber: string;
  EngineCapacity: number;
  EngineCapacityUnit: string;
  EngineCapacityUnitID: number = 32;
  VehicleTypeID: number;
  EngineTypeID: number = 26;
  FaceLiftTypeID: number;
  CustomerID: number;
  WorkshopID: number;
  CreatedBy: number;
  ModifiedBy: number;
  ColorID: number = 1;
  ColorCode: string = "000";
  EnglishMakeName: string;
  ArabicMakeName: string;
  EnglishModelName: string;
  ArabicModelName: string;
  NumberOfServices: number;
  TotalCosts: number;
  CustomerTypeID: number;
  EngineTypeName: string;
  VehicleTypeName: string;
  VehicleRegionID: number = 62;
  CylinderTypeID: number = 76;
  ImgURL: string;
  LicensePlateFront: string;
  LicensePlateBack: string;
  RegionTypeName: string;
  CylinderTypeName: string;
  ColorName: string;
  IsContractVehicle: boolean = false;
  ContractFullName: string;
  ContractPlanID: number;
  CustomerFullName: string;
  ServiceContractID: number;
  EngineCode: string;
  SeriesID: string;
  GroupName: string;
  JobCardNumber: string;
  
}
