import { Component, Input } from '@angular/core';
import { ExchangeRate } from 'src/app/services/interface/exchangeRates.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() currencyData!: ExchangeRate[];
}
