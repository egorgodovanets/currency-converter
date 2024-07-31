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
  firstCurrencyControl!: AbstractControl<string | null>;
  secondCurrencyControl!: AbstractControl<string | null>;
  firstAmountControl!: AbstractControl<number | null>;
  secondAmountControl!: AbstractControl<number | null>;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.convertData = [...this.inputCurrencyData, { cc: 'UAH', rate: 1 }];
    this.buildForm();
    this.setupValueChanges();
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

    this.recalculateValues();
  }

  setupValueChanges(): void {
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
      this.recalculateValues();
    });

    this.secondCurrencyControl.valueChanges.subscribe(() => {
      this.recalculateValues();
    });
  }

  recalculateValues(): void {
    const firstAmount = this.firstAmountControl.value;
    const secondAmount = this.secondAmountControl.value;

    if (firstAmount !== null) {
      this.convertFromFirstToSecond(firstAmount);
    } else if (secondAmount !== null) {
      this.convertFromSecondToFirst(secondAmount);
    }
  }

  convertFromFirstToSecond(value: number): void {
    const firstCurrency = this.firstCurrencyControl.value;
    const secondCurrency = this.secondCurrencyControl.value;
    const firstRate = this.convertData.find(currency => currency.cc === firstCurrency)?.rate || 1;
    const secondRate = this.convertData.find(currency => currency.cc === secondCurrency)?.rate || 1;

    let convertedValue = (value * firstRate) / secondRate;
    convertedValue = Number(convertedValue.toFixed(2));

    this.secondAmountControl.setValue(convertedValue, { emitEvent: false });
  }

  convertFromSecondToFirst(value: number): void {
    const firstCurrency = this.firstCurrencyControl.value;
    const secondCurrency = this.secondCurrencyControl.value;
    const firstRate = this.convertData.find(currency => currency.cc === firstCurrency)?.rate || 1;
    const secondRate = this.convertData.find(currency => currency.cc === secondCurrency)?.rate || 1;

    let convertedValue = (value * secondRate) / firstRate;
    convertedValue = Number(convertedValue.toFixed(2));

    this.firstAmountControl.setValue(convertedValue, { emitEvent: false });
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

    this.recalculateValues();
  }
}
