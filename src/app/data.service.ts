import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  firstCoin:string;
  secondCoin:string;

  constructor(private http: HttpClient) { }

  GetQuotationInterval(param1, param2){
    let interval = setInterval(() => this.GetQuotation.bind(this, param1, param2), 2000);

    return interval;
  }

  GetTopListCoins():Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD').toPromise();
  }

  GetQuotation(firstCoin:String, secondCoin:String):Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=' + firstCoin +'&tsyms='+secondCoin).toPromise();
  }
}
