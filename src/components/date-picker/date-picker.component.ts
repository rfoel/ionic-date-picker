import { Component, Output, EventEmitter } from "@angular/core"
import { NavParams, Modal, ModalController, ViewController } from "ionic-angular"

import moment from "moment/moment"
import "moment/locale/pt-br"

import { DateItem, DatePickerOption } from "./date-picker.interface"

@Component({
  selector: "date-picker",
  templateUrl: "date-picker.html"
})
export class DatePicker {
  @Output() public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>()

  @Output() public onCancelled: EventEmitter<any> = new EventEmitter<any>()

  private currentMoment: moment.Moment
  private daysOfWeek = []
  private daysGroupedByWeek = []
  private selectedDateItem: DateItem
  private daysOfMonth: DateItem[]
  private calendarModal: Modal
  private datePickerOption?: DatePickerOption

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, params?: NavParams) {
    this.daysOfWeek = moment.weekdaysShort().map(day => day.charAt(0))
    this.datePickerOption = params && params.data ? params.data : this.datePickerOption
    this.currentMoment = this.getDefaultDate()
    this.renderCalender()
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date())
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth)

    this.setDefaultSelectedDate()
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
    let calendarMonth = moment(`${year}-${month}-${day}`, "YYYY-MM-DD")

    let startOfMonth = calendarMonth
      .clone()
      .startOf("month")
      .day(0)
    let endOfMonth = calendarMonth
      .clone()
      .endOf("month")
      .day(6)

    let totalDays = endOfMonth.diff(startOfMonth, "days") + 1

    let calendarDays: DateItem[] = []

    for (let i = 0; i < totalDays; i++) {
      let immunableStartOfMonth = startOfMonth.clone()

      let dateItem: DateItem = {
        isSelected: false,
        momentDate: immunableStartOfMonth.add(i, "day"),
        isEnabled: true
      }

      dateItem.isEnabled =
        this.belongsToThisMonth(immunableStartOfMonth, month) &&
        this.minDate(dateItem.momentDate) &&
        this.maxDate(dateItem.momentDate) &&
        !this.isBlocked(dateItem.momentDate)

      calendarDays.push(dateItem)
    }

    return calendarDays
  }

  private groupByWeek(daysOfMonth: DateItem[]) {
    let groupedDaysOfMonth = new Array<DateItem[]>()

    daysOfMonth.forEach((item, index) => {
      let groupIndex = Math.floor(index / 7)

      groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || []

      groupedDaysOfMonth[groupIndex].push(item)
    })

    return groupedDaysOfMonth
  }

  private selectDate(day: DateItem) {
    if (!day.isEnabled) return false

    if (this.selectedDateItem && this.selectedDateItem.isSelected) {
      this.selectedDateItem.isSelected = false
    }

    day.isSelected = true
    this.selectedDateItem = day
    this.currentMoment = day.momentDate.clone()
  }

  private setDefaultSelectedDate() {
    let date = this.getDefaultDate()
    let foundDates = this.daysOfMonth.filter((item: DateItem) => date.isSame(item.momentDate.clone().startOf("day")))

    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0]
      this.selectedDateItem.isSelected = true
    }
  }

  private getDefaultDate() {
    return this.datePickerOption || this.datePickerOption.selectedDate
      ? moment(this.datePickerOption.selectedDate).startOf("day")
      : moment().startOf("day")
  }

  private belongsToThisMonth(momentDate: moment.Moment, month: number) {
    return momentDate.month() + 1 === month
  }

  private setMonthBack() {
    this.currentMoment.subtract(1, "month")
    this.renderCalender()
  }

  private setMonthForward() {
    this.currentMoment.add(1, "month")
    this.renderCalender()
  }

  private setYearBack() {
    this.currentMoment.subtract(1, "year")
    this.renderCalender()
  }
  private setYearForward() {
    this.currentMoment.add(1, "year")
    this.renderCalender()
  }

  private minDate(currentMomentDate: moment.Moment) {
    if (!this.datePickerOption || !this.datePickerOption.min) return true
    let min = this.datePickerOption.min.setHours(0)

    return currentMomentDate.startOf("day").isSameOrAfter(moment(min).startOf("day"))
  }

  private maxDate(currentMomentDate: moment.Moment) {
    if (!this.datePickerOption || !this.datePickerOption.max) return true
    let max = this.datePickerOption.max.setHours(0)

    return currentMomentDate.startOf("day").isSameOrBefore(moment(max).startOf("day"))
  }

  private isBlocked(momentDate: moment.Moment) {
    if (!this.datePickerOption || !this.datePickerOption.blockedDates) return false
    let foundDates = this.datePickerOption.blockedDates.filter(item => {
      return momentDate.startOf("day").isSame(moment(item).startOf("day"))
    })
    if (foundDates && foundDates.length > 0) return true
    else return false
  }

  private confirmDateSelection() {
    this.viewCtrl.dismiss(this.selectedDateItem.momentDate.toDate())
  }

  private cancel() {
    this.viewCtrl.dismiss()
  }

  public showCalendar(datePickerOption?: DatePickerOption) {
    this.calendarModal = this.modalCtrl.create(DatePicker, datePickerOption)

    this.calendarModal.onDidDismiss((data: any) => {
      if (data) {
        this.onDateSelected.emit(data)
      } else {
        this.onCancelled.emit()
      }
    })
    this.calendarModal.present()
  }
}
