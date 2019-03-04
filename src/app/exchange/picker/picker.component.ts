import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExchangeRatesService, Currency } from 'src/app/services/exchange-rates.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnInit {

  currencies: Observable<Array<Currency>>;
  @Input() currency;
  @Output() currencyChanged: EventEmitter<string> = new EventEmitter();

  @Input()  dateTo;
  @Output() dateToChanged: EventEmitter<string> = new EventEmitter();

  @Input() dateFrom;
  @Output() dateFromChanged: EventEmitter<string> = new EventEmitter();

  maxDate = new Date();
  minDate = new Date(1999, 1, 1);

  constructor(private exchangeRatesService: ExchangeRatesService) {
     this.dateFrom = moment().subtract(31, 'days').toDate();
     this.dateTo = new Date();
     this.currency = 'EUR';
   }

  ngOnInit() {
    this.currencies = this.exchangeRatesService.getAvailableCurrencies();
  }

  changeCurrency(event) {
    this.currency = event.value;
    this.currencyChanged.emit(event.value);
  }

  changeDateTo(event) {
    this.dateTo = event.value;
    this.dateToChanged.emit(event.value);
  }

  changeDateFrom(event) {
    this.dateFrom = event.value;
    this.dateFromChanged.emit(event.value);
  }

  public getDateFrom(format?: string) {
    if (format) {
      return moment(this.dateFrom).format(format);
    }
    return this.dateFrom;
  }

  public getDateTo(format?: string) {
    if (format) {
      return moment(this.dateTo).format(format);
    }
    return this.dateTo;
  }
}
