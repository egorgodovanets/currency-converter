import { Component, Input, OnChanges } from '@angular/core';
import { ExchangeRate, ExchangeRates } from 'src/app/services/interface/exchangeRates.interface';
import { currencies } from 'src/app/constants/constants.const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  @Input() currencyData!: ExchangeRates;
  uahData: ExchangeRate = {};

  ngOnChanges(): void {
    if (!this.currencyData || Object.keys(this.currencyData).length === 0) {
      return;
    }

    this.uahData = currencies.filter(value => value !== 'UAH')
      .reduce((a, v) => ({
        ...a,
        [v]: this.currencyData[v]['UAH']
      }), {});
  }
}
