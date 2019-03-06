import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExchangeRatesService, Currency } from 'src/app/services/exchange-rates.service';
import { Observable, from } from 'rxjs';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class PickerComponent implements OnInit {

  currencies: Observable<Array<Currency>>;
  @Input() currency;
  @Output() currencyChanged: EventEmitter<string> = new EventEmitter();

  @Input()  dateTo;
  @Output() dateToChanged: EventEmitter<string> = new EventEmitter();

  @Input() dateFrom;
  @Output() dateFromChanged: EventEmitter<string> = new EventEmitter();

  maxDateFrom = moment();
  maxDateTo = this.maxDateFrom;
  minDateFrom = moment([1999, 1, 1]);
  minDateTo;

  constructor(private exchangeRatesService: ExchangeRatesService) {
     this.dateFrom = moment().subtract(31, 'days');
     this.minDateTo = this.dateFrom.add(1, 'day');
     this.dateTo =  moment();
     this.currency = 'EUR';
   }

  ngOnInit() {
    this.currencies = this.exchangeRatesService.getAvailableCurrencies();
  }

  changeCurrency(event) {
    this.currency = event.value;
    this.currencyChanged.emit(event.value);
  }

  changeDateFrom(event): void {
    if (this.dateFrom === event.value) {
      return;
    }
    this.minDateTo = event.value;

    this.dateFrom = event.value;
    this.dateFromChanged.emit(event.value);
  }

  changeDateTo(event) {

    if (this.dateTo === event.value) {
      return;
    }

    if (this.minDateFrom >= event.value) {
      this.minDateFrom = event.value;
    }

    if (this.maxDateFrom >= event.value) {
      this.maxDateFrom = event.value;
    }

    this.dateTo = event.value;
    this.dateToChanged.emit(event.value);
  }

  public getDateFrom(format?: string) {
    if (format) {
      return this.dateFrom.format(format);
    }
    return this.dateFrom;
  }

  public getDateTo(format?: string) {
    if (format) {
      return this.dateTo.format(format);
    }
    return this.dateTo;
  }
}
