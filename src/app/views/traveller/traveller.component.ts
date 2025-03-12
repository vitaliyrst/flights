import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RadioButton } from "primeng/radiobutton";
import { DatePicker } from "primeng/datepicker";
import { IFlightPlan } from "../flights/interfaces/flight.interface";
import { Select } from "primeng/select";
import { COUNTRIES_LIST } from "./sevices/countries-list";
import { TravellerService } from "./sevices/traveller.service";
import { CurrencyPipe, SlicePipe } from "@angular/common";

@Component({
  selector: "app-traveller",
  imports: [ReactiveFormsModule, RadioButton, DatePicker, Select, CurrencyPipe, SlicePipe],
  templateUrl: "./traveller.component.html",
  styleUrl: "./traveller.component.scss",
})
export class TravellerComponent implements OnInit {
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private travellerService: TravellerService = inject(TravellerService);

  public daysForSelect: string[] = [...Array(31).keys()].map(i => (i + 1 < 10 ? "0" + (i + 1) : i + 1 + ""));
  public countriesForSelect: Array<{ name: string; code: string }> = COUNTRIES_LIST as Array<{
    name: string;
    code: string;
  }>;

  public flightPlan!: IFlightPlan;
  public form!: FormGroup;

  constructor() {
    this.flightPlan = this.router.getCurrentNavigation()?.extras.state?.["flightPlan"];

    if (!this.flightPlan) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    const formData = this.travellerService.travellerData;

    this.form = this.fb.group({
      firstName: [formData.firstName, [Validators.required]],
      lastName: [formData.lastName, [Validators.required]],
      gender: [formData.gender, [Validators.required]],
      month: [formData.month, [Validators.required]],
      day: [formData.day, [Validators.required]],
      year: [formData.year, [Validators.required]],
      citizenship: [formData.citizenship, [Validators.required]],
    });
  }

  onBackClick(): void {
    this.travellerService.travellerData = this.form.getRawValue();
    this.router.navigate(["flights"]);
  }

  onConfirmClick(): void {
    if (this.form.valid) {
      this.travellerService.travellerData = this.form.getRawValue();
      console.log("Flight ID:", this.flightPlan.id, "\nForm Data: ", this.form.getRawValue());
    } else {
      Object.entries(this.form.controls).forEach(control => {
        control[1].markAsDirty();
      });
    }
  }
}
