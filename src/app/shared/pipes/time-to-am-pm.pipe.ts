import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeToAmPm",
})
export class TimeToAmPmPipe implements PipeTransform {
  transform(time: string): string {
    let hour: string | number = time.split(":")[0];
    let min: string = time.split(":")[1];
    let part: string = +hour > 12 ? "pm" : "am";

    if (+hour === 0) {
      hour = 12;
    }

    min = min.length === 1 ? "0" + min : min;
    hour = +hour > 12 ? +hour - 12 : hour;
    hour = hour.toString().length === 1 ? "0" + hour : hour;
    return `${hour}:${min}${part}`;
  }
}
