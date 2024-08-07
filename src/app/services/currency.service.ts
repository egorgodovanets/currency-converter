import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, Observer, of } from 'rxjs';
import { ApiExchangeResponse } from './interface/apiExchangeResponse.interface';
import { apiUrl, apiKey, currencies } from '../constants/constants.const';
import { ExchangeRate, ExchangeRates } from './interface/exchangeRates.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private destroyRef = inject(DestroyRef);

  exchangeRates = new Observable<ExchangeRates>(observer => {
    this.loadExchangeRates(observer);
    setInterval(() => {
      this.loadExchangeRates(observer);
    }, 60000);
  });

  constructor(private http: HttpClient) {}

  private loadExchangeRates(observer: Observer<ExchangeRates>): void {
    const url = apiUrl.replace('<API_KEY>', apiKey);

    const observables = currencies.map((currency: string) => {
      const urlWithCurrency = url.replace('<BASE_CURRENCY>', currency);
      return this.http.get<ApiExchangeResponse>(urlWithCurrency).pipe(
        catchError(error => {
          console.error(`Failed to load exchange rate for ${currency}`, error);
          return of(null);
        })
      );
    });


    forkJoin(observables)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: results => {
          const exchangeRates = results.reduce((accumulator, current) => {
            if (current) {
              return {
                ...accumulator,
                [current.base_code]: this.filterCurrencies(current.conversion_rates),
              };
            }
            return accumulator;
          }, {});
          observer.next(exchangeRates);
        },
        error: err => {
          console.error('Failed to load exchange rates', err);
          observer.error(err);
        }
      });
  }

  private filterCurrencies(rates: ExchangeRate): ExchangeRate {
    return Object.fromEntries(
      Object.entries(rates).filter(([currency, _]) => currencies.includes(currency))
    ) as ExchangeRate;
  }
}
