import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {DataService} from '../data.service';
import { leadboardObject } from './leadboardObject.model';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { cardObject } from './cardObject.model';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  chart = [];
  cryptoCurrencies:any;
  informationList:Array<leadboardObject> = [];
  leadBoardSubscription: Subscription;
  cardSubscription: Subscription;
  counter:number = 0;
  card:cardObject;
  currencies:Array<any> = [
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

  constructor(private dataService:DataService, private router: Router) {
    
    router.events.subscribe((val) => {

      let rout = val['snapshot']['_routerState']['url'];

      if(rout != "/chart"){
        if(this.leadBoardSubscription)
          this.leadBoardSubscription.unsubscribe();
        if(this.cardSubscription)
          this.cardSubscription.unsubscribe();
      }
        
    });
  }

  ngOnInit(): void {

    this.getCardInformation("BTC", "USD");
    this.getLeadBoardInformation("USD");
    this.showCryptocurrenciesGraphicDaily("BTC", "USD");
  }

  showCryptocurrenciesGraphicDaily(cryptoCurrency:string, currency:string){

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

      let currencyInfo = this.currencies.find(element => element.id == currency);

      var chart = new Chart('myChart', {
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


  getLeadBoardInformation(currency:string){

    if(this.leadBoardSubscription)
      this.leadBoardSubscription.unsubscribe();

    this.leadBoardSubscription = timer(0, 10000).pipe(
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

  public trackItem (index: number, item: leadboardObject) {
    
    return item.id;
  }

  cryptoCurrencySelected(crypto:leadboardObject){
    let cryptoCurrencyName = crypto['name'];
    var currencySelected = (<HTMLInputElement>document.getElementById('optionCurrency')).value;
    
    var node = document.getElementById('divChart');
    node.querySelectorAll('*').forEach(n => n.remove());

    this.createCanvas();

    this.getCardInformation(cryptoCurrencyName, currencySelected);
    this.showCryptocurrenciesGraphicDaily(cryptoCurrencyName, currencySelected);
  }

  currencySelected(){
    var currencySelected = (<HTMLInputElement>document.getElementById('optionCurrency')).value;
    var cryptoCurrencyName = (<HTMLInputElement>document.getElementById('imgCard')).alt;

    var node = document.getElementById('divChart');
    node.querySelectorAll('*').forEach(n => n.remove());
    this.createCanvas();

    this.getCardInformation(cryptoCurrencyName, currencySelected);
    this.showCryptocurrenciesGraphicDaily(cryptoCurrencyName, currencySelected);
    this.getLeadBoardInformation(currencySelected);
  }

  createCanvas(){
    var node = document.getElementById('divChart');

    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "myChart");

    node.appendChild(newCanvas);
  }

  getCardInformation(cryptoCurrencyName:string, currency:string){
    
    if(this.cardSubscription)
      this.cardSubscription.unsubscribe();

    this.cardSubscription = timer(0, 10000).pipe(
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
