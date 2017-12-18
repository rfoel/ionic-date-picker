import { Moment } from "moment"

export class DateItem {
  isSelected: boolean
  momentDate: Moment
  isEnabled: boolean
}

export class DatePickerOption {
  min?: Date
  max?: Date
  selectedDate?: Date
  blockedDates?: Array<Date>
}
