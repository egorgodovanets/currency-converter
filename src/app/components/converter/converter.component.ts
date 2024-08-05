import { CurrencyControlComponent } from './../currency-control/currency-control.component';
import { Component, DestroyRef, inject, Input, OnChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeRates } from 'src/app/services/interface/exchangeRates.interface';
import { currencies } from '../../constants/constants.const';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent {
  @Input() inputCurrencyData: ExchangeRates | null = null;
  private destroyRef = inject(DestroyRef);
  converterForm: FormGroup;
  firstCurrencyControl: AbstractControl<{ select: string; input: number | null }>;
  secondCurrencyControl: AbstractControl<{ select: string; input: number | null }>;
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
    ) as AbstractControl<{ select: string; input: number | null }>;

    this.setupAmountChanges();
  }

  setupAmountChanges(): void {
    this.handleConvertChanges(this.firstCurrencyControl, this.secondCurrencyControl);
    this.handleConvertChanges(this.secondCurrencyControl, this.firstCurrencyControl);
  }

  handleConvertChanges(
    control: AbstractControl<{ select: string; input: number | null }>,
    changingCurrencyControl: AbstractControl<{ select: string; input: number | null }>
  ): void {
    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.convertCurrencies(value.select, value.input, changingCurrencyControl);
    });
  }

  convertCurrencies(
    currency: string,
    amount: number | null,
    changingCurrencyControl: AbstractControl<{ select: string; input: number | null }>): void {
    if (amount === null) return;

    const rate = this.getRate(currency, changingCurrencyControl.value.select);

    const convertedAmount = ConverterComponent.convertAmount(amount, rate);

    changingCurrencyControl.setValue(
      { select: changingCurrencyControl.value.select, input: convertedAmount },
      { emitEvent: false }
    );
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
      currentFirstCurrency,
      currentFirstAmount,
      this.secondCurrencyControl
    );
  }

  getRate(baseCurrency: string, targetCurrency: string) {
    return this.inputCurrencyData![baseCurrency][targetCurrency];
  }

  static convertAmount(currentAmount: number, currentRate: number) {
    const convertedAmount = currentAmount * currentRate;
    return Number(convertedAmount.toFixed(4));
  }
}
