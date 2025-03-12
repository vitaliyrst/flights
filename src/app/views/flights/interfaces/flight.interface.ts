export interface IFlightPlan {
  flights: IFlightSegment[];
  id: number;
  price: number;
}

export interface IFlightSegment {
  airline: string;
  arrival_airport: string;
  arrival_date: string;
  arrival_time: string;
  departure_airport: string;
  departure_date: string;
  departure_time: string;
  duration_minutes: number;
  stops: number;
}

export interface IFlightsState {
  itemsPerPage: number;
  priceRange: {
    initial: [number, number];
    current: [number, number];
  };
  selectedStops: {
    all: boolean;
    none: boolean;
    one: boolean;
    two: boolean;
    [key: string]: boolean;
  };
  sortOptions: Array<{
    title: string;
    value: string;
  }>;
  currentSort: string;
}
