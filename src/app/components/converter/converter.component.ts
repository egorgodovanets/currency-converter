import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ExchangeRate } from 'src/app/services/interface/exchangeRates.interface';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnChanges {
  @Input() currencyData!: ExchangeRate[];
  converterForm!: FormGroup;
  convertData!: ExchangeRate[];

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.convertData = [...this.currencyData];
    this.convertData.push({cc: 'UAH', rate: 1});
    this.buildForm();
    this.setupValueChanges();
    this.setupCurrencyChanges();
    this.converterForm.get('firstCurrency')?.valueChanges.subscribe(value => {
      if (value === null) {
        this.converterForm.patchValue({
          firstCurrency: this.convertData[0]?.cc
        })
      }
    })
    this.converterForm.get('secondCurrency')?.valueChanges.subscribe(value => {
      if (value === null) {
        this.converterForm.patchValue({
          secondCurrency: this.convertData[1]?.cc
        })
      }
    })
  }

  buildForm(): void {
    this.converterForm = this.fb.group({
      firstCurrency: this.convertData[0]?.cc,
      secondCurrency: this.convertData[1]?.cc,
      firstValue: null,
      secondValue: null,
    })

    this.recalculateValues();
  }

  setupValueChanges(): void {
    this.converterForm.get('firstValue')?.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        this.convertFromFirstToSecond(value);
      }
    });

    this.converterForm.get('secondValue')?.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        this.convertFromSecondToFirst(value);
      }
    });
  }

  setupCurrencyChanges(): void {
    this.converterForm.get('firstCurrency')?.valueChanges.subscribe(() => {
      this.recalculateValues();
    });

    this.converterForm.get('secondCurrency')?.valueChanges.subscribe(() => {
      this.recalculateValues();
    });
  }

  recalculateValues(): void {
    const firstValue = this.converterForm.get('firstValue')?.value;
    const secondValue = this.converterForm.get('secondValue')?.value;

    if (firstValue !== null && firstValue !== '') {
      this.convertFromFirstToSecond(firstValue);
    } else if (secondValue !== null && secondValue !== '') {
      this.convertFromSecondToFirst(secondValue);
    }
  }

  convertFromFirstToSecond(value: number): void {
    const firstCurrency = this.converterForm.get('firstCurrency')?.value;
    const secondCurrency = this.converterForm.get('secondCurrency')?.value;
    const firstRate = this.convertData.find(currency => currency.cc === firstCurrency)?.rate || 1;
    const secondRate = this.convertData.find(currency => currency.cc === secondCurrency)?.rate || 1;

    let convertedValue = (value * firstRate) / secondRate;
    convertedValue = Number(convertedValue.toFixed(2));

    this.converterForm.get('secondValue')?.setValue(convertedValue, { emitEvent: false });
  }

  convertFromSecondToFirst(value: number): void {
    const firstCurrency = this.converterForm.get('firstCurrency')?.value;
    const secondCurrency = this.converterForm.get('secondCurrency')?.value;
    const firstRate = this.convertData.find(currency => currency.cc === firstCurrency)?.rate || 1;
    const secondRate = this.convertData.find(currency => currency.cc === secondCurrency)?.rate || 1;

    let convertedValue = (value * secondRate) / firstRate;
    convertedValue = Number(convertedValue.toFixed(2));

    this.converterForm.get('firstValue')?.setValue(convertedValue, { emitEvent: false });
  }


  swapCurrencies(): void {
    const currentFirstCurrency = this.converterForm.get('firstCurrency')?.value;
    const currentSecondCurrency = this.converterForm.get('secondCurrency')?.value;

    this.converterForm.get('firstCurrency')?.setValue(currentSecondCurrency, { emitEvent: false });
    this.converterForm.get('secondCurrency')?.setValue(currentFirstCurrency, { emitEvent: false });

    this.recalculateValues();
  }

  filterInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let filteredValue = input.value.replace(/[^0-9.]/g, '');

    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      filteredValue = parts[0] + '.' + parts.slice(1).join('');
    }

    if (this.isValidNumber(filteredValue)) {
      this.converterForm.get(controlName)?.setValue(filteredValue, { emitEvent: false });
    }

    this.converterForm.get(controlName)?.setValue(filteredValue, { emitEvent: false });
  }

  isValidNumber(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }
}
