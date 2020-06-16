import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  firstCoin:string;
  secondCoin:string;

  constructor(private http: HttpClient) { }

  GetTopListCoins(currency:string):Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=' + currency).toPromise();
  }

  GetQuotation(cryptocurrency:string, currency:string):Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=' + cryptocurrency +'&tsyms='+ currency).toPromise();
  }

  GetRegisterDaily(cryptocurrency:string, currency:string):Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/v2/histoday?fsym=' + cryptocurrency + '&tsym=' + currency + '&limit=10').toPromise();
  }
}