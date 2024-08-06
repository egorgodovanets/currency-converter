import { Component, DestroyRef, inject, Input, OnChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { currencies } from '../../constants/constants.const';
import { CustomControl } from 'src/app/services/interface/customControl.interface';
import { ExchangeRates } from 'src/app/services/interface/exchangeRates.interface';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnChanges {
  @Input() exchangeRates: ExchangeRates | null = null;

  private destroyRef = inject(DestroyRef);
  private firstCurrencyControl: AbstractControl<CustomControl>;
  private secondCurrencyControl: AbstractControl<CustomControl>;

  converterForm: FormGroup;
  currencies: string[] = currencies;

  constructor(private fb: FormBuilder) {
    this.converterForm = this.fb.group({
      firstCurrencyControl: [{ select: this.currencies[0], input: null }],
      secondCurrencyControl: [{ select: this.currencies[1], input: null }],
    });

    this.firstCurrencyControl = this.converterForm.get('firstCurrencyControl') as AbstractControl<{
      select: string;
      input: number | null;
    }>;
    this.secondCurrencyControl = this.converterForm.get(
      'secondCurrencyControl'
    ) as AbstractControl<CustomControl>;

    this.setupAmountChanges();
  }

   ngOnChanges(): void {
    this.convertCurrencies(
      this.firstCurrencyControl.value.select,
      this.firstCurrencyControl.value.input,
      this.secondCurrencyControl)
   }

  private setupAmountChanges(): void {
    this.handleConvertChanges(this.firstCurrencyControl, this.secondCurrencyControl);
    this.handleConvertChanges(this.secondCurrencyControl, this.firstCurrencyControl);
  }

  private handleConvertChanges(
    control: AbstractControl<CustomControl>,
    changingCurrencyControl: AbstractControl<CustomControl>
  ): void {
    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.convertCurrencies(value.select, value.input, changingCurrencyControl);
    });
  }

  private convertCurrencies(
    currency: string,
    amount: number | null,
    changingCurrencyControl: AbstractControl<CustomControl>): void {
    if (amount === null) return;

    const rate = this.getRate(currency, changingCurrencyControl.value.select);

    const convertedAmount = ConverterComponent.convertAmount(amount, rate);

    changingCurrencyControl.setValue(
      { select: changingCurrencyControl.value.select, input: convertedAmount },
      { emitEvent: false }
    );
  }

  private getRate(baseCurrency: string, targetCurrency: string) {
    if (this.exchangeRates === null) {
      return 0;
    }

    return this.exchangeRates[baseCurrency][targetCurrency];
  }

  private static convertAmount(currentAmount: number, currentRate: number) {
    const convertedAmount = currentAmount * currentRate;
    return Number(convertedAmount.toFixed(4));
  }

  swapCurrencies(): void {
    const currentFirstCurrency = this.firstCurrencyControl.value.select;
    const currentSecondCurrency = this.secondCurrencyControl.value.select;
    const currentFirstAmount = this.firstCurrencyControl.value.input;
    const currentSecondAmount = this.secondCurrencyControl.value.input;

    this.firstCurrencyControl.setValue(
      { select: currentSecondCurrency, input: currentFirstAmount },
      { emitEvent: false });
    this.secondCurrencyControl.setValue(
      { select: currentFirstCurrency, input: currentSecondAmount },
      { emitEvent: false });

    this.convertCurrencies(
      currentSecondCurrency,
      currentFirstAmount,
      this.secondCurrencyControl
    );
  }
}
