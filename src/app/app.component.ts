import { Component, DestroyRef, inject } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExchangeRates } from './services/interface/exchangeRates.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  {
  private destroyRef = inject(DestroyRef);
  exchangeRates: ExchangeRates | null = null;

  constructor(private currencyService: CurrencyService) {
    this.currencyService.exchangeRates
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        this.exchangeRates = result;
      });
  }
}
