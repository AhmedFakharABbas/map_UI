import { Appointment } from "./appointment";
import { Checklist } from "./checklist";
import { Gallery } from "./Gallery";
import { ImageMarker } from "./image-marker";
import { Vehicle } from "./vehicle";

export class SaveAppointment {
    AppointmentObj: Appointment;
    Gallery: Array<Gallery>;
    Vehicles: Array<Vehicle>;
    JobCardCheckList: Array<Checklist>;
    ImageMarkers: Array<ImageMarker>;


    constructor() {
        this.AppointmentObj = new Appointment();
        this.Gallery = new Array<Gallery>();
        this.Vehicles = new Array<Vehicle>();
        this.JobCardCheckList = new Array<Checklist>();
        this.ImageMarkers = new Array<ImageMarker>();
    }

}