import { Colors } from './colors';
import { Country } from './country';
import { City } from './city';
import { ServiceCenter } from './service-center';
import { Role } from './role';
import { ObjectType } from './object-type';
import { Make } from './make';
import { Model } from './model';
import { Year } from './year';
import { Customer } from './customer';
import { ObjectStatus } from './object-status';
import { UserNotification } from './user-notification';
import { ServiceContract } from './service-contract';
import { ContractPlan } from './contract-plan';
import { WorkshopSetting } from './workshop-setting';
import { PendingNotification } from './pending-notification';
import { Checklist } from './checklist';
import { ModelVariant } from './modelVariant';
import { GroupName } from './group-name';

export class CommonMeta {
    Countries: Array<Country>;
    Cities: Array<City>;
    Workshops: Array<ServiceCenter>;
    Roles: Array<Role>;
    objectTypes: Array<ObjectType>;
    Makes: Array<Make>;
    Models: Array<Model>;
    Years: Array<Year>;
    Customers: Array<Customer>;
    ObjectStatus: Array<ObjectStatus>;
    Colors: Array<Colors>;
    Notifications: Array<UserNotification>;
    Notification: UserNotification;
    ServiceContracts: Array<ServiceContract>;
    ContractPlans: Array<ContractPlan>;
    WorkshopSetting: WorkshopSetting;
    PendingNotifications: Array<PendingNotification>;
    TechPendingNotifications: Array<PendingNotification>;
    JobCardCheckList: Array<Checklist>;
    ModelVariant : Array<ModelVariant>
    GroupName: Array<GroupName>
}