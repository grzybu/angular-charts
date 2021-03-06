import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

export interface Currency {
  code: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  readonly baseUrl = 'https://api.exchangeratesapi.io';

  constructor(private httpClient: HttpClient) { }

  getExchangeRates(base: string, to: string, startAt: string, endAt: string): Observable<any> {
     const params = new HttpParams()
          .set('symbols', to)
          .set('base', base)
          .set('start_at', startAt)
          .set('end_at', endAt);

    return this.httpClient.get(this.baseUrl + '/history', { params }).pipe(
      map(response => {
        return response;
      })
    );
  }

  getAvailableCurrencies() {
    return this.httpClient.get(this.baseUrl + '/latest').pipe(
      map(response => {
        const currencies = Array<Currency>();
        currencies.push({ code: 'EUR', displayName: 'EUR' });
        for (const rate of Object.keys(response['rates'])) {
          currencies.push({ code: rate, displayName: rate});
        }
        return currencies;
      })
    );
  }
}
