import { InspectionResult } from "./inspection-result";
import { JobPart } from "./JobPart";
import { PlanFeature } from "./plan-feature";

export class GetVehicleContract{
    PlanFeatures : Array<PlanFeature>;
    ContractTasksDetail : Array<InspectionResult>;
    ContractPartsDetail : Array<JobPart>;
}