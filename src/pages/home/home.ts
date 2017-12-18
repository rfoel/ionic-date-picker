import { Component } from "@angular/core"
import { IonicPage } from "ionic-angular"

import { DatePicker } from "../../components/date-picker/date-picker"
@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [DatePicker]
})
export class HomePage {
  constructor(private datePicker: DatePicker) {}

  private showCalendar() {
    this.datePicker.showCalendar()
  }
}
