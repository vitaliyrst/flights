import { Component, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MinutesToHours } from "../../../../shared/pipes/minutes-to-hours.pipe";
import { TimeToAmPmPipe } from "../../../../shared/pipes/time-to-am-pm.pipe";
import { environment } from "../../../../../environments/environment";
import { IFlightSegment } from "../../interfaces/flight.interface";

@Component({
  selector: "app-flight-segment",
  imports: [DatePipe, MinutesToHours, TimeToAmPmPipe],
  templateUrl: "./flight-segment.component.html",
  styleUrl: "./flight-segment.component.scss",
})
export class FlightSegmentComponent {
  public CDN_URL: string = environment.CDN_URL;

  @Input({ required: true })
  public flightSegment!: IFlightSegment;

  constructor() {}
}
