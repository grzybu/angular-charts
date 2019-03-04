import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExchangeRatesService, Currency } from 'src/app/services/exchange-rates.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnInit {

  datePipe: DatePipe;

  currencies: Observable<Array<Currency>>;
  @Input() selectedCurrency = 'EUR';
  @Output() currencyChanged: EventEmitter<string> = new EventEmitter();

  @Input() dateTo;
  @Output() dateChanged: EventEmitter<string> = new EventEmitter();

  constructor(private exchangeRatesService: ExchangeRatesService) { }

  ngOnInit() {
    this.currencies = this.exchangeRatesService.getAvailableCurrencies();
  }

  changeCurrency(event) {
    this.selectedCurrency = event.value;
    this.currencyChanged.emit(event.value);
  }


}
