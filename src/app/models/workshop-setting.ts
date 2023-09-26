import { NumberValueAccessor } from '@angular/forms';
import { create } from "domain";

export class WorkshopSetting {
    SettingID: number;
    MaximumRepairDiscount: number;
    MaximumPartDiscount: number;
    WorkshopID: number;
    EditRepairDiscount : boolean = false;
    EditPartDiscount : boolean = false;

}