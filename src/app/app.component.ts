import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { forkJoin } from 'rxjs';
import { ExchangeRates, ExchangeRate } from './services/interface/exchangeRates.interface';
import { currencies } from './constants/constants.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currencyData: ExchangeRates = {};

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.getExchangeRates();
  }

  getExchangeRates() {
    forkJoin(this.currencyService.getExchangeRates()).subscribe(results => {
      this.currencyData = results.reduce((accumulator, current) => ({
        ...accumulator,
        [current.base_code]: this.filterCurrencies(current.conversion_rates)
      }), {});
    });
  }

  private filterCurrencies(rates: ExchangeRate): ExchangeRate {
    return Object.fromEntries(
      Object.entries(rates)
        .filter(([currency, _]) => currencies.includes(currency))
    ) as ExchangeRate;
  }

}
