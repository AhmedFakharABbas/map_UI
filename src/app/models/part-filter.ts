import { Make } from './make';
import { Model } from './model';
import { PartManufacturer } from './part-manufacturer';
import { SerialNumber } from './serial-number';

export class PartFilter {
    AutomotivePartID: number;
    AutomotivePartNameEng: string;
    WorkshopID: number;
    MainCategoryNameEng: string;
    SubCategoryNameEng: string;
    MainCategoryID: number;
    SubCategoryID: number;
    // MakeID: number;
    // ModelID: number;
    // MakeName: string
    // ModelName: string;
    // ManufacturerID: number;
    // SeriesYearStart: number;
    // SeriesYearEnd: number;
    MinNetPrice: number;
    MaxNetPrice: number;
    Price : number;
    OEMNumber : string;
    Makes: Array<Make>;
    Models: Array<Model>;
    Manufacturers: Array<PartManufacturer>
    IsNew: boolean;
    IsUsed : boolean;
    JobCardID: number;
    JobPartID: number;
    StartRow: number;
    RowsPerPage: number;
    PageNumber = 1;
    SearchQuery : string;
    BrandID : string;
    OriginID : string;
    Stock : string;
    PurchasePrice : string;
    SellingPrice : string;
    JobCardNumber: any;
    EnglishMakeName: string;
    ArabicMakeName: string;
    EnglishModelName: string;
    ArabicModelName: string;
    ProductionYear: number;
    EngineType: string;
    BodyType: string;
    EngineCode: string;
    EngineCapacity: number;
    SeriesID: string;
    SerialNumbers : Array<SerialNumber>;
    

}