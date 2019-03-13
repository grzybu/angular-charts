import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExchangeRatesService, Currency } from 'src/app/services/exchange-rates.service';
import { Observable, from } from 'rxjs';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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

  readonly DEFAULT_CURRENCY = 'EUR';

  currencies: Array<Currency>;
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


  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
    this.route.data.subscribe(
        (resolvedData) => {
          this.currencies = resolvedData.currencies;
        }
    );

    this.route.queryParams.subscribe(queryParams => {
      this.currency = queryParams.currency ? queryParams.currency : this.DEFAULT_CURRENCY;
      this.dateFrom = queryParams['date-from'] ? moment(queryParams['date-from']) : moment().subtract(31, 'days');
      this.minDateTo = moment(this.getDateFrom('YYYY-MM-DD')).add(1, 'day');
      this.dateTo = queryParams['date-to'] ? moment(queryParams['date-to']) : moment();
      });
  }

  changeCurrency(event) {
    this.currency = event.value;
    this.currencyChanged.emit(event.value);
    this.navigate();
  }

  changeDateFrom(event): void {
    if (this.dateFrom === event.value) {
      return;
    }
    this.minDateTo = event.value;
    this.dateFrom = event.value;
    this.dateFromChanged.emit(event.value);
    this.navigate();
  }

  navigate(): void {
    this.router.navigate(['exchange'],
    { queryParams: {currency: this.currency, 'date-from': this.getDateFrom('YYYY-MM-DD'), 'date-to' : this.getDateTo('YYYY-MM-DD')}}
    );
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
    this.navigate();
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
