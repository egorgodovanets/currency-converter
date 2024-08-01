import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiExchangeResponse } from './interface/apiExchangeResponse.interface';
import { apiUrl, apiKey, currencies } from '../constants/constants.const';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getExchangeRates(): Observable<ApiExchangeResponse>[] {
    const url = apiUrl.replace('<API_KEY>', apiKey);

    return currencies.map((currency: string) => {
      const urlWithCurrency = url.replace('<BASE_CURRENCY>', currency);
      return this.http.get<ApiExchangeResponse>(urlWithCurrency);
    });
  }

}
