import { Injectable } from "@angular/core";
import { ITraveller } from "../interfaces/traveller.interface";

@Injectable({
  providedIn: "root",
})
export class TravellerService {
  private _travellerData: ITraveller = {
    firstName: "",
    lastName: "",
    gender: "",
    month: "",
    day: "",
    year: "",
    citizenship: "",
  };

  get travellerData(): ITraveller {
    return this._travellerData;
  }

  set travellerData(data: ITraveller) {
    this._travellerData = data;
  }

  constructor() {}
}
