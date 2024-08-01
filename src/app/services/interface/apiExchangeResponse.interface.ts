export interface ApiExchangeResponse {
  base_code: string,
  conversion_rates: { [currency: string]: number }
}
