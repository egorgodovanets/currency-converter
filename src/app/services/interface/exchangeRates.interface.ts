export interface ExchangeRates { [base: string]: ExchangeRate }

export interface ExchangeRate { [currency: string]: number }
