import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ExchangeRatesService } from '../services/exchange-rates.service';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesResolverService  implements Resolve<any> {

  constructor(private exchangeService: ExchangeRatesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
   return this.exchangeService.getAvailableCurrencies();
  }
}
