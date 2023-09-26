import { JobPart } from './JobPart';
import { JobPartAlternates } from './job-part-alternates';

export class UpdateJobPart{
    JobCardID: number;
    WorkshopID: number;
    ModifiedBy: number;
    JobParts: Array<JobPart>;
    JobPartAlternates: Array<JobPartAlternates>;
}