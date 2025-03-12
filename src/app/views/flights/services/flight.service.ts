import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { IFlightPlan, IFlightsState } from "../interfaces/flight.interface";

@Injectable({
  providedIn: "root",
})
export class FlightService {
  private http: HttpClient = inject(HttpClient);

  /**
   * To save the state of the flights view during routing
   */
  private _flightsState: IFlightsState = {
    itemsPerPage: 5,
    priceRange: {
      current: [0, 0],
      initial: [0, 0],
    },
    selectedStops: {
      all: true,
      none: false,
      one: false,
      two: false,
    },
    sortOptions: [
      { title: "Price (Lowest)", value: "price.asc" },
      { title: "Price (Highest)", value: "price.desc" },
      { title: "Arrival time (Earlier)", value: "arrival_time.asc" },
      { title: "Arrival time (Later)", value: "arrival_time.desc" },
      { title: "Departure time (Earlier)", value: "departure_time.asc" },
      { title: "Departure time (Later)", value: "departure_time.desc" },
      { title: "Duration (Lowest)", value: "duration_minutes.asc" },
      { title: "Duration (Highest)", value: "duration_minutes.desc" },
    ],
    currentSort: "price.asc",
  };

  get flightsState(): IFlightsState {
    return this._flightsState;
  }

  set flightsState(state: IFlightsState) {
    this._flightsState = state;
  }

  constructor() {}

  getFlights(): Observable<IFlightPlan[]> {
    return this.http.get<IFlightPlan[]>(environment.API_URL + "/test_flights.json");
  }
}
