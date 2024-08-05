import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ConverterComponent } from './components/converter/converter.component';
import { CurrencyControlComponent } from './components/currency-control/currency-control.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ConverterComponent,
    CurrencyControlComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
