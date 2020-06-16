import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { cardObject } from './cardObject.model';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  chart = [];
  cryptoCurrencies:any;
  coins:any = this.dataService.GetCoins();
  subscription: Subscription;
  currencySubscription: Subscription;
  cryptoCurrencySubscription: Subscription;
  counter:number = 0;
  card:cardObject;
  currency:string = "USD";
  cryptoCurrency:string = "BTC";

  constructor(private dataService:DataService, private chartService: ChartService) { 
    this.currencySubscription = chartService.updateCurrency$.subscribe(
      currency => {
        this.currency = currency;
        this.loadCard();
    });

    this.cryptoCurrencySubscription = chartService.updateCrypto$.subscribe(
      cryptoCurrency => {
        this.cryptoCurrency = cryptoCurrency;
        this.loadCard();
    });
  }

  ngOnInit(): void {
    this.loadCard();
  }

  loadCard() {
    this.getCardInformation(this.cryptoCurrency, this.currency);
    this.showCryptocurrenciesGraphicDaily(this.cryptoCurrency, this.currency);
  }

  showCryptocurrenciesGraphicDaily(cryptoCurrency:string, currency:string){

    this.reloadCanvas();
    this.dataService.GetRegisterDaily(cryptoCurrency, currency).then((res) => {

      let allRegisters = res.Data.Data;
      let allDates = [];
      let allAverageQuotization = [];
      let allMinimumQuotization = [];
      let allMaximumQuotization = [];

      allRegisters.forEach((res) => {
        let jsDate = new Date(res.time * 1000);

        allDates.push(jsDate.toLocaleDateString('en', {month:'long', day:'numeric'}));

        allAverageQuotization.push( (((res.high + res.low) / 2).toFixed(2)) );
        allMinimumQuotization.push((res.low).toFixed(2));
        allMaximumQuotization.push((res.high).toFixed(2));
      });

      let currencyInfo = this.coins.find(element => element.id == currency);

      var chart = new Chart('chart-canvas', {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [
            {
              label:"Average",
              data: allAverageQuotization,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true
            },
            {
              type:'bar',
              label: 'Minimum',
              data: allMinimumQuotization,
              borderColor: 'rgba(0, 0, 0, 0)',
              backgroundColor: 'rgba(192, 75, 192, 0.5)',
              fill: false
            },
            {
              type:'bar',
              label:'Maximum',
              data: allMaximumQuotization,
              borderColor: 'rgba(231, 208, 29, 0.77)',
              backgroundColor: 'rgba(231, 208, 29, 0.77)',
              fill: false
            }
          ]
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: (currencyInfo.name + '(' +currencyInfo.id + ')')
              }
            }]
          }
        }
      });
    });
  }

  reloadCanvas(){
    var node = document.getElementById('chart');
    node.querySelectorAll('*').forEach(n => n.remove());
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "chart-canvas");
    node.appendChild(newCanvas);
  }

  getCardInformation(cryptoCurrencyName:string, currency:string){
    
    if(this.subscription)
      this.subscription.unsubscribe();

    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.dataService.GetTopListCoins(currency))
    ).subscribe((res) => {

      let allRegisters:Array<any> = res.Data;

      allRegisters.forEach((res) => {
        
        let name = res['CoinInfo']['Name'];

        if(name == cryptoCurrencyName){

          let price = res['DISPLAY'][currency]['PRICE'];
          let variation = res['DISPLAY'][currency]['CHANGEPCT24HOUR'];
          let image = res['CoinInfo']['ImageUrl'];
          let mktCap = res['DISPLAY'][currency]['MKTCAP'];
          let circSply = res['DISPLAY'][currency]['SUPPLY'];
          let allDayVol = res['DISPLAY'][currency]['TOTALVOLUME24HTO'];
          let dayHigh = res['DISPLAY'][currency]['HIGH24HOUR'];
          let dayLow = res['DISPLAY'][currency]['LOW24HOUR'];

          this.card = new cardObject(cryptoCurrencyName, mktCap, circSply, allDayVol, dayHigh, dayLow, "https://www.cryptocompare.com" + image, price, variation);
        }

      });
      
    });
  }

}