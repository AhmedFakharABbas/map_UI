import { MainCategory } from './main-category';
import { SubCategory } from './sub-category';
import { SubSubCategory } from './sub-sub-category';
import { ObjectType } from './object-type';
import { PartManufacturer } from './part-manufacturer';

export class PartMeta {
    objectTypes: Array<ObjectType>;
    MainCategories: Array<MainCategory>;
    SubCategories: Array<SubCategory>;
    SubSubCategories: Array<SubSubCategory>;
    PartManufacturer: Array<PartManufacturer>;
    PartsVendors: Array<any>;
    AutomotivePart:Array<any>;
    BrandOrigins :Array<any>;
    MainParts : Array<any>;
    PartBrand : Array<any>;
}