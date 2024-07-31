import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { ExchangeRate } from './services/interface/exchangeRates.interface';
import { currencyToConvert } from './constants/constants.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currencyData: ExchangeRate[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.getExchangeRates();
  }

  getExchangeRates() {
    this.currencyService.getExchangeRates().subscribe(data => {
      this.currencyData = data.filter(currency => currencyToConvert.includes(currency.cc));
    });
  }
}
