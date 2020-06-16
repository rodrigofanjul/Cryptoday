import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  GetCoins() {
    return [
      {id:"USD", name:"Dolar estadounidense"},
      {id:"EUR", name:"Euro"},
      {id:"AUD", name:"Dolar austrailiano"},
      {id:"CNY", name:"Yuan chino"},
      {id:"ARS", name:"Peso Argentino"},
      {id:"BRL", name:"Real brasilero"},
      {id:"JPY", name:"Yen japones"},
      {id:"CAD", name:"Dolar canadiense"},
      {id:"GBP", name:"Libra esterlina"}
    ];
  }

  GetTopListCoins(currency:string): Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=' + currency).toPromise();
  }

  GetQuotation(cryptocurrency:string, currency:string): Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=' + cryptocurrency +'&tsyms='+ currency).toPromise();
  }

  GetRegisterDaily(cryptocurrency:string, currency:string): Promise<any>{
    return this.http.get('https://min-api.cryptocompare.com/data/v2/histoday?fsym=' + cryptocurrency + '&tsym=' + currency + '&limit=10').toPromise();
  }
}