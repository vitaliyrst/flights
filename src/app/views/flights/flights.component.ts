import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FlightService } from "./services/flight.service";
import { CurrencyPipe, NgStyle, SlicePipe } from "@angular/common";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FlightSegmentComponent } from "./components/flight-segment/flight-segment.component";
import { Select, SelectChangeEvent } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { Slider } from "primeng/slider";
import { Checkbox, CheckboxChangeEvent } from "primeng/checkbox";
import { IFlightPlan, IFlightsState } from "./interfaces/flight.interface";

@Component({
  selector: "app-flights",
  imports: [SlicePipe, CurrencyPipe, FlightSegmentComponent, Select, FormsModule, Slider, Checkbox, NgStyle],
  templateUrl: "./flights.component.html",
  styleUrl: "./flights.component.scss",
})
export class FlightsComponent implements OnInit {
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private flightService: FlightService = inject(FlightService);

  private initialFlightPlans!: IFlightPlan[];
  public flightPlans!: IFlightPlan[];

  public preload: boolean = true;
  public flightsState!: IFlightsState;

  ngOnInit(): void {
    this.flightsState = this.flightService.flightsState;

    this.flightService
      .getFlights()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.initialFlightPlans = response;

          if (!this.flightsState.priceRange.initial[0] && !this.flightsState.priceRange.initial[1]) {
            const prices = this.initialFlightPlans.map(plan => plan.price);
            const min = +Math.min(...prices).toFixed(2);
            const max = +Math.max(...prices).toFixed(2);

            this.flightsState.priceRange = {
              initial: [0, max],
              current: [min, max],
            };
          }

          this.flightPlans = structuredClone(this.initialFlightPlans);
          this.sortFlights();
          this.preload = false;
        },
        error: error => {
          console.log(error);
          this.preload = false;
        },
      });
  }

  /**
   * Format 'hh:mm:ss y-MM-dd' to unix time
   */
  getUnixTimeForSorting(item: IFlightPlan, field: "departure_time" | "arrival_time"): number {
    const dateField = field === "departure_time" ? "departure_date" : "arrival_date";

    const parts = item.flights[0][dateField]
      .split("-")
      .concat(item.flights[0][field].split(":"))
      .map(value => +value);

    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]).getTime();
  }

  /**
   * Sort flights by current sort value
   */
  sortFlights(): void {
    const [field, key] = this.flightsState.currentSort.split(".");

    if (field === "price") {
      this.flightPlans.sort((a, b) => (key === "asc" ? a[field] - b[field] : b[field] - a[field]));
    } else if (field === "duration_minutes") {
      this.flightPlans.sort((a, b) => {
        return key === "asc" ? a.flights[0][field] - b.flights[0][field] : b.flights[0][field] - a.flights[0][field];
      });
    } else if (field === "departure_time" || field === "arrival_time") {
      this.flightPlans.sort((a, b) => {
        return key === "asc"
          ? this.getUnixTimeForSorting(a, field) - this.getUnixTimeForSorting(b, field)
          : this.getUnixTimeForSorting(b, field) - this.getUnixTimeForSorting(a, field);
      });
    }
  }

  onSortChange(event: SelectChangeEvent): void {
    this.flightsState.currentSort = event.value;
    this.sortFlights();
  }

  onPriceChange(): void {
    const current = this.flightsState.priceRange.current;
    this.flightPlans = this.initialFlightPlans.filter(plan => plan.price >= current[0] && plan.price <= current[1]);
    this.sortFlights();
  }

  onStopsChange(event: CheckboxChangeEvent, type: "all" | "none" | "one" | "two"): void {
    Object.keys(this.flightsState.selectedStops).forEach(stopKey => {
      if (stopKey !== type && event.checked) {
        this.flightsState.selectedStops[stopKey] = false;
      } else if (type !== "all" && !event.checked) {
        this.flightsState.selectedStops.all = true;
      }
    });

    const activeStops = Object.entries(this.flightsState.selectedStops).find(entry => entry[1]);

    this.flightPlans = this.initialFlightPlans.filter(plan => {
      if (activeStops) {
        if (activeStops[0] === "none") {
          return !plan.flights[0].stops || !plan.flights[1].stops;
        } else if (activeStops[0] === "one") {
          return plan.flights[0].stops === 1 || plan.flights[1].stops === 1;
        } else if (activeStops[0] === "two") {
          return plan.flights[0].stops === 2 || plan.flights[1].stops === 2;
        }
      }

      return true;
    });

    this.sortFlights();
  }

  onBookClick(flightPlan: IFlightPlan): void {
    this.flightService.flightsState = this.flightsState;
    this.router.navigate(["/traveller"], { state: { flightPlan } });
  }

  onShowMoreClick(): void {
    this.flightsState.itemsPerPage += 5;
  }
}
