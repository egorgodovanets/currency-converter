import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeRate } from 'src/app/services/interface/exchangeRates.interface';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnChanges {
  @Input() inputCurrencyData!: ExchangeRate[];
  converterForm!: FormGroup;
  convertData!: ExchangeRate[];
  firstCurrencyControl!: AbstractControl<string>;
  secondCurrencyControl!: AbstractControl<string>;
  firstAmountControl!: AbstractControl<number | null>;
  secondAmountControl!: AbstractControl<number | null>;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.convertData = [...this.inputCurrencyData, { cc: 'UAH', rate: 1 }];
    this.buildForm();
    this.setupAmountChanges();
    this.setupCurrencyChanges();
  }

  buildForm(): void {
    this.converterForm = this.fb.group({
      firstCurrency: this.convertData[0]?.cc,
      secondCurrency: this.convertData[1]?.cc,
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
    const firstRate = this.getRate(this.firstCurrencyControl.value);
    const secondRate = this.getRate(this.secondCurrencyControl.value);

    const convertedAmount = ConverterComponent.convertAmount(amount, firstRate, secondRate);

    this.secondAmountControl.setValue(convertedAmount, { emitEvent: false });
  }

  convertFromSecondToFirst(amount: number): void {
    const firstRate = this.getRate(this.firstCurrencyControl.value);
    const secondRate = this.getRate(this.secondCurrencyControl.value);

    const convertedAmount = ConverterComponent.convertAmount(amount, secondRate, firstRate);

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

  getRate(currency: string) {
    return this.convertData.find(currencyData => currencyData.cc === currency)?.rate || 1;
  }

  static convertAmount(currentAmount: number, currentRate: number, otherRate: number) {
    const convertedAmount = (currentAmount * currentRate) / otherRate;
    return Number(convertedAmount.toFixed(4));
  }
}
