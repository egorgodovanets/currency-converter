import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeRates } from 'src/app/services/interface/exchangeRates.interface';
import { currencies } from '../../constants/constants.const';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnChanges {
  @Input() inputCurrencyData!: ExchangeRates;
  converterForm!: FormGroup;
  firstCurrencyControl!: AbstractControl<string>;
  secondCurrencyControl!: AbstractControl<string>;
  firstAmountControl!: AbstractControl<number | null>;
  secondAmountControl!: AbstractControl<number | null>;
  currencies: string[] = currencies;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(): void {
    this.buildForm();
    this.setupAmountChanges();
    this.setupCurrencyChanges();
  }

  buildForm(): void {
    this.converterForm = this.fb.group({
      firstCurrency: this.currencies[0],
      secondCurrency: this.currencies[1],
      firstAmount: null,
      secondAmount: null,
    });

    this.firstCurrencyControl = this.converterForm.get('firstCurrency')!;
    this.secondCurrencyControl = this.converterForm.get('secondCurrency')!;
    this.firstAmountControl = this.converterForm.get('firstAmount')!;
    this.secondAmountControl = this.converterForm.get('secondAmount')!;

    this.recalculateAmounts();
  }

  setupAmountChanges(): void {
    this.firstAmountControl.valueChanges.subscribe(value => {
      if (value !== null) {
        this.convertFromFirstToSecond(value);
      }
    });

    this.secondAmountControl.valueChanges.subscribe(value => {
      if (value !== null) {
        this.convertFromSecondToFirst(value);
      }
    });
  }

  setupCurrencyChanges(): void {
    this.firstCurrencyControl.valueChanges.subscribe(() => {
      this.recalculateAmounts();
    });

    this.secondCurrencyControl.valueChanges.subscribe(() => {
      this.recalculateAmounts();
    });
  }

  recalculateAmounts(): void {
    const firstAmount = this.firstAmountControl.value;
    const secondAmount = this.secondAmountControl.value;

    if (firstAmount !== null) {
      this.convertFromFirstToSecond(firstAmount);
      return;
    }

    if (secondAmount !== null) {
      this.convertFromSecondToFirst(secondAmount);
    }
  }

  convertFromFirstToSecond(amount: number): void {
    const rate = this.getRate(this.firstCurrencyControl.value, this.secondCurrencyControl.value);

    const convertedAmount = ConverterComponent.convertAmount(amount, rate);

    this.secondAmountControl.setValue(convertedAmount, { emitEvent: false });
  }

  convertFromSecondToFirst(amount: number): void {
    const rate = this.getRate(this.secondCurrencyControl.value, this.firstCurrencyControl.value);

    const convertedAmount = ConverterComponent.convertAmount(amount, rate);

    this.firstAmountControl.setValue(convertedAmount, { emitEvent: false });
  }

  swapCurrencies(): void {
    const currentFirstCurrency = this.firstCurrencyControl.value;
    const currentSecondCurrency = this.secondCurrencyControl.value;

    this.firstCurrencyControl.setValue(currentSecondCurrency, {
      emitEvent: false,
    });
    this.secondCurrencyControl.setValue(currentFirstCurrency, {
      emitEvent: false,
    });

    this.recalculateAmounts();
  }

  getRate(baseCurrency: string, targetCurrency: string) {
    return this.inputCurrencyData[baseCurrency][targetCurrency];
  }

  static convertAmount(currentAmount: number, currentRate: number) {
    const convertedAmount = currentAmount * currentRate;
    return Number(convertedAmount.toFixed(4));
  }
}
