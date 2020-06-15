import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {DataService} from '../data.service';
import { leadboardObject } from './leadboardObject.model';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { cardObject } from './cardObject.model';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  chart = [];
  cryptoCurrencies:any;
  informationList:Array<leadboardObject> = [];
  subscription: Subscription;
  counter:number = 0;
  card:cardObject;

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

    this.getCardInformation("BTC");
    this.getLeadBoardInformation();
    this.showCryptocurrenciesDaily("BTC");
  }

  showCryptocurrenciesDaily(cryptoCurrency:string){

    this.dataService.GetRegisterDaily(cryptoCurrency).then((res) => {

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
                labelString: 'Dolar Estadounidense(USD)'
              }
            }]
          }
        }
      });

    });

  }


  getLeadBoardInformation(){

    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.dataService.GetTopListCoins())
    ).subscribe(res => {
      if(this.counter > 0){
        var node = document.getElementById('tableRefresh');
        node.querySelectorAll('*').forEach(n => n.remove());
      }
        
      let allRegisters = res.Data;
      let name:string;
      let image:string;
      let price:string;
      let variation:string;

      allRegisters.forEach((res) => {

        name = res['CoinInfo']['Name'];
        image = res['CoinInfo']['ImageUrl'];
        price = res['DISPLAY']['USD']['PRICE'];
        variation = res['DISPLAY']['USD']['CHANGEPCT24HOUR'];

        this.informationList.push(new leadboardObject(this.counter++ , name, ("https://www.cryptocompare.com/" + image), price, variation));
      });
    });
  }

  public trackItem (index: number, item: leadboardObject) {
    
    return item.id;
  }

  cryptocurrencySelected(crypto:leadboardObject){
    let cryptoCurrencyName = crypto['name'];
    
    var node = document.getElementById('divChart');
    node.querySelectorAll('*').forEach(n => n.remove());

    this.createCanvas();

    this.getCardInformation(cryptoCurrencyName);
    this.showCryptocurrenciesDaily(cryptoCurrencyName);
    
    
  }

  createCanvas(){
    var node = document.getElementById('divChart');

    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "myChart");

    node.appendChild(newCanvas);
  }

  getCardInformation(cryptoCurrencyName:string){
    
    this.dataService.GetTopListCoins().then((res) => {

      let allRegisters:Array<any> = res.Data;

      allRegisters.forEach((res) => {
        
        let name = res['CoinInfo']['Name'];

        if(name == cryptoCurrencyName){

          let price = res['DISPLAY']['USD']['PRICE'];
          let variation = res['DISPLAY']['USD']['CHANGEPCT24HOUR'];
          let image = res['CoinInfo']['ImageUrl'];
          let mktCap = res['DISPLAY']['USD']['MKTCAP'];
          let circSply = res['DISPLAY']['USD']['SUPPLY'];
          let allDayVol = res['DISPLAY']['USD']['TOTALVOLUME24HTO'];
          let dayHigh = res['DISPLAY']['USD']['HIGH24HOUR'];
          let dayLow = res['DISPLAY']['USD']['LOW24HOUR'];

          this.card = new cardObject(mktCap, circSply, allDayVol, dayHigh, dayLow, "https://www.cryptocompare.com" + image, price, variation);

        }

      });
      
      console.log(this.card);
      
    });
  }

}
