import { Component, Input, OnChanges } from '@angular/core';
import { ExchangeRate, ExchangeRates } from 'src/app/services/interface/exchangeRates.interface';
import { currencies } from 'src/app/constants/constants.const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  @Input() exchangeRates: ExchangeRates | null = null;

  uahData: ExchangeRate = {};

  constructor() {}

  ngOnChanges(): void {
    this.setUahData();
  }

  private setUahData() {
    if (this.exchangeRates === null) return;

    this.uahData = currencies.filter(value => value !== 'UAH')
      .reduce((accumulator, current) => ({
        ...accumulator,
        [current]: this.exchangeRates![current]['UAH']
      }), {});
  }
}
