import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "flights",
    pathMatch: "full",
  },
  {
    path: "flights",
    loadComponent: () => import("./views/flights/flights.component").then(m => m.FlightsComponent),
    title: "Flights",
  },
  {
    path: "traveller",
    loadComponent: () => import("./views/traveller/traveller.component").then(m => m.TravellerComponent),
    title: "Traveller",
  },
  {
    path: "**",
    redirectTo: "flights",
  },
];
