import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin } from 'rxjs';
import { ExchangeRates, ExchangeRate } from './services/interface/exchangeRates.interface';
import { currencies } from './constants/constants.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  currencyData: ExchangeRates = {};
  errorMessage: string = '';

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.getExchangeRates();
  }

  getExchangeRates() {
    forkJoin(this.currencyService.getExchangeRates())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          this.errorMessage = 'Failed to fetch exchange rates';
          console.error(error);
          return [];
        })
      )
      .subscribe(results => {
        this.currencyData = results.reduce(
          (accumulator, current) => ({
            ...accumulator,
            [current.base_code]: this.filterCurrencies(current.conversion_rates),
          }),
          {}
        );
      });
  }

  private filterCurrencies(rates: ExchangeRate): ExchangeRate {
    return Object.fromEntries(
      Object.entries(rates).filter(([currency, _]) => currencies.includes(currency))
    ) as ExchangeRate;
  }
}
