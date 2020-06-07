import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  GetTopListCoins(){
    return this.http.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD')
  }
}
