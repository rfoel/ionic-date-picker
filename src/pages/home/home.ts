import { Component } from "@angular/core"
import { IonicPage } from "ionic-angular"

import { DatePicker, DatePickerOption } from "../../components/date-picker/date-picker"
@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [DatePicker]
})
export class HomePage {
  constructor(private datePicker: DatePicker) {}

  private showCalendar() {
    let options: DatePickerOption = {
      blockedDates: [new Date("December 25 2017")]
    }
    this.datePicker.showCalendar(options)
  }
}
