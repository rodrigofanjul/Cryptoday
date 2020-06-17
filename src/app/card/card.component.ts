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

  chart;
  graphicChart:Chart;
  cryptoCurrencies:any;
  coins:any;
  subscription: Subscription;
  currencySubscription: Subscription;
  cryptoCurrencySubscription: Subscription;
  chartSubscription:Subscription;
  counter:number;
  card:cardObject;
  currency:string;
  cryptoCurrency:string;
  aux;


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

    this.chart = [];
    this.coins = this.dataService.GetCoins();
    this.card = new cardObject();
    this.counter = 0;
    this.currency = "USD";
    this.cryptoCurrency = "BTC";
    
  }

  ngOnInit(): void {
    this.loadCard();
  }

  loadCard() {
    this.getCardInformation(this.cryptoCurrency, this.currency);
    this.showCryptocurrenciesGraphicWeekly(this.cryptoCurrency, this.currency);
  }

  showCryptocurrenciesGraphicWeekly(cryptoCurrency:string, currency:string){
    if(this.chartSubscription)
      this.chartSubscription.unsubscribe();

    this.reloadCanvas();
    this.dataService.GetRegisterWeekly(cryptoCurrency, currency).then((res) => {

      let allRegisters = res.Data.Data;
      let allDates = [];
      let allAverageQuotization = [];
      let allMinimumQuotization = [];
      let allMaximumQuotization = [];
      let counter = 3;

      allRegisters.forEach((res) => {
        let jsDate = new Date(res.time * 1000);
        
        if(counter < 0){

          allDates.push(jsDate.toLocaleDateString('en', {month:'long', day:'numeric'}));
  
          allAverageQuotization.push( (((res.high + res.low) / 2).toFixed(2)) );
          allMinimumQuotization.push((res.low).toFixed(2));
          allMaximumQuotization.push((res.high).toFixed(2));

        }
        counter--;

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

          this.card = new cardObject(name, mktCap, circSply, allDayVol, dayHigh, dayLow, "https://www.cryptocompare.com" + image, price, variation);
        }

      });
      
    });
  }


  checkCardVariation(variation:string){
    let check = false;

    if(this.card.variation){ 
      if( this.card.variation.charAt(0)=='-')
        check = true;
    }

    return check;
  }

  onShowCryptocurrenciesGraphicHour(){
    var activeElement:any = document.getElementsByClassName("active").item(0);
    var elementToActivate:any = document.getElementById("hour");

    if(activeElement.id != elementToActivate.id){

      activeElement.classList.remove("active");
      elementToActivate.classList.add("active");
      this.showCryptocurrenciesGraphicHour(this.cryptoCurrency, this.currency);
    }
  }

  onShowCryptocurrenciesGraphicDay(){
    var activeElement:any = document.getElementsByClassName("active").item(0);
    var elementToActivate:any = document.getElementById("day");

    if(activeElement.id != elementToActivate.id){

      console.log(activeElement);
      activeElement.classList.remove("active");
      elementToActivate.classList.add("active");
      this.showCryptocurrenciesGraphicDay(this.cryptoCurrency, this.currency);
    }
  }

  onShowCryptocurrenciesGraphicWeekly(){

    var activeElement:any = document.getElementsByClassName("active").item(0);
    var elementToActivate:any = document.getElementById("week");

    if(activeElement.id != elementToActivate.id){

      activeElement.classList.remove("active");
      elementToActivate.classList.add("active");
      this.showCryptocurrenciesGraphicWeekly(this.cryptoCurrency, this.currency);
    }
  }

  onShowCryptocurrenciesGraphicMonthly(){
    var activeElement:any = document.getElementsByClassName("active").item(0);
    var elementToActivate:any = document.getElementById("month");

    if(activeElement.id != elementToActivate.id){

      activeElement.classList.remove("active");
      elementToActivate.classList.add("active");
      this.showCryptocurrenciesGraphicWeekly(this.cryptoCurrency, this.currency);
    }
  }

  onShowCryptocurrenciesGraphicYearly(){
    var activeElement:any = document.getElementsByClassName("active").item(0);
    var elementToActivate:any = document.getElementById("year");

    if(activeElement.id != elementToActivate.id){

      activeElement.classList.remove("active");
      elementToActivate.classList.add("active");
      this.showCryptocurrenciesGraphicWeekly(this.cryptoCurrency, this.currency);
    }
  }


  showCryptocurrenciesGraphicDay(cryptoCurrency:string, currency:string){

    if(this.chartSubscription)
      this.chartSubscription.unsubscribe();

    this.reloadCanvas();
    this.dataService.GetRegisterDay(cryptoCurrency, currency).then((res) => {

      let allRegisters = res.Data.Data;
      let allDates = [];
      let allAverageQuotization = [];
      let allMinimumQuotization = [];
      let allMaximumQuotization = [];

      allRegisters.forEach((res) => {
        let jsDate = new Date(res.time * 1000);

        allDates.push(jsDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));

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

  showCryptocurrenciesGraphicHour(cryptoCurrency:string, currency:string){

    if(this.chartSubscription)
      this.chartSubscription.unsubscribe();

    this.reloadCanvas();

    this.dataService.GetRegisterHour(cryptoCurrency, currency).then((res) => {

      let allRegisters = res.Data.Data;
      let allDates = [];
      let allAverageQuotization = [];
      let allMinimumQuotization = [];
      let allMaximumQuotization = [];

      allRegisters.forEach((res) => {
        let jsDate = new Date(res.time * 1000);

        allDates.push(jsDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));

        allAverageQuotization.push( (((res.high + res.low) / 2).toFixed(2)) );
        allMinimumQuotization.push((res.low).toFixed(2));
        allMaximumQuotization.push((res.high).toFixed(2));

      });

      let currencyInfo = this.coins.find(element => element.id == currency);

      this.graphicChart = new Chart('chart-canvas', {
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

    setInterval(() => {
      this.updateHourGraphic(this.graphicChart, cryptoCurrency, currency);
    }, 60000);
  }

  updateHourGraphic(chart:Chart ,cryptoCurrency:string, currency:string){

    this.dataService.GetRegisterHour(cryptoCurrency, currency).then((res) => {

      let allRegisters:Array<any> = res.Data.Data;

      let lastRegisterTime = allRegisters[allRegisters.length-1]['time'];
      let lastRegisterHigh = allRegisters[allRegisters.length-1]['high'];
      let lastRegisterLow = allRegisters[allRegisters.length-1]['low'];
      let lastRegisterAverage = (lastRegisterHigh + lastRegisterLow) / 2;

      let jsDate = new Date(lastRegisterTime * 1000);  
      chart.data.labels.push(jsDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));
      chart.data.labels.shift();

      chart.data.datasets[0].data.push(lastRegisterAverage);
      chart.data.datasets[0].data.shift();

      chart.data.datasets[1].data.push(lastRegisterLow);
      chart.data.datasets[1].data.shift();

      chart.data.datasets[2].data.push(lastRegisterHigh);
      chart.data.datasets[2].data.shift();

      chart.update();
    });
  }


}

