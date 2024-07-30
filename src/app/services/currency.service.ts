import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRate } from './interface/exchangeRates.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  apiUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'

  constructor(private http: HttpClient) { }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get<ExchangeRate[]>(this.apiUrl);
  }

}
