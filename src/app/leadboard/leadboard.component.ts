import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { leadboardObject } from './leadboardObject.model';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-leadboard',
  templateUrl: './leadboard.component.html',
  styleUrls: ['./leadboard.component.css']
})
export class LeadboardComponent implements OnInit {

  chart = [];
  cryptoCurrencies:any;
  coins:any = this.dataService.GetCoins();
  informationList:Array<leadboardObject> = [];
  subscription: Subscription;
  currencySubscription: Subscription;
  counter:number = 0;
  currency:string = "USD";
  cryptoCurrency:string = "BTC";

  constructor(private dataService:DataService, private chartService: ChartService) {
    this.currencySubscription = chartService.updateCurrency$.subscribe(
      currency => {
        this.getLeadBoardInformation(currency);
    });
   }

  ngOnInit(): void {
    this.getLeadBoardInformation(this.currency);
  }

  getLeadBoardInformation(currency:string){

    if(this.subscription)
      this.subscription.unsubscribe();

    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.dataService.GetTopListCoins(currency))
    ).subscribe(res => {
      
      var node = document.getElementById('tableRefresh');
      node.querySelectorAll('*').forEach(n => n.remove());

      let allRegisters = res.Data;
      let name:string;
      let image:string;
      let price:string;
      let variation:string;

      allRegisters.forEach((res) => {

        name = res['CoinInfo']['Name'];
        image = res['CoinInfo']['ImageUrl'];
        price = res['DISPLAY'][currency]['PRICE'];
        variation = res['DISPLAY'][currency]['CHANGEPCT24HOUR'];

        this.informationList.push(new leadboardObject(this.counter++ , name, ("https://www.cryptocompare.com/" + image), price, variation));
      });
    });
  }

  onChangeCryptoCurrency(crypto:leadboardObject){
    this.cryptoCurrency = crypto['name'];
    this.chartService.setCryptoCurrency(this.cryptoCurrency)
  }

  onChangeCurrency(){
    this.currency = (<HTMLInputElement>document.getElementById('optionCurrency')).value;
    this.chartService.setCurrency(this.currency);
  }
}