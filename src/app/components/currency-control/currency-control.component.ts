import { Component, DestroyRef, forwardRef, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { currencies } from 'src/app/constants/constants.const';

@Component({
  selector: 'app-currency-control',
  templateUrl: './currency-control.component.html',
  styleUrls: ['./currency-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyControlComponent),
      multi: true,
    },
  ],
})
export class CurrencyControlComponent implements ControlValueAccessor {
  private destroyRef = inject(DestroyRef);
  currencyControl: FormGroup;
  control = new FormControl();
  currencies: string[] = currencies;

  constructor(private fb: FormBuilder) {
    this.currencyControl = this.fb.group({
      select: null,
      input: null,
    });
  }

  writeValue(value: any): void {
    if (!value) return;

    this.currencyControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.currencyControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {}
}
