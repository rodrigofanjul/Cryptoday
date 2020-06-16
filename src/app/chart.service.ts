import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class ChartService {

  // Observable string sources
  private updateCurrency = new Subject<string>();
  private updateCrypto = new Subject<string>();

  // Observable string streams
  updateCurrency$ = this.updateCurrency.asObservable();
  updateCrypto$ = this.updateCrypto.asObservable();

  // Service message commands
  setCurrency(currency: string) {
    this.updateCurrency.next(currency);
  }

  setCryptoCurrency(cryptoCurrency: string) {
    this.updateCrypto.next(cryptoCurrency);
  }
}