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

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  getExchangeRates(base: string, to: string, from: string, endAt: string): Observable<any> {
     const params = new HttpParams()
          .set('symbols', to)
          .set('base', base)
          .set('start_at', from)
          .set('end_at', this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));

    return this.httpClient.get(this.baseUrl + '/history', { params }).pipe(
      map(response => {
        return response;
      })
    );
  }

  getAvailableCurrencies(): Observable<any> {
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
