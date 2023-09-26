import { InspectionResult } from './inspection-result';
import { JobPart } from './JobPart';
import { Gallery } from './Gallery';

export class TaskProfile{
    JobTask: InspectionResult;
    JobParts: Array<JobPart>;
    Gallery: Array<Gallery>;
 
}