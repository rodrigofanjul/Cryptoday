import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription, timer } from 'rxjs';
import { Chart } from 'chart.js';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {
  
  chart;
  graphicChart:Chart;
  cryptoCurrencies:any;
  coins:any;
  subscription: Subscription;
  currencySubscription: Subscription;
  counter:number;
  currency:string;
  @Input() cryptoCurrency: string;
  graphicChartNow:Chart;

  constructor(private dataService:DataService, private chartService: ChartService) { 
    this.currencySubscription = chartService.updateCurrency$.subscribe(
      currency => {
        this.currency = currency;
        this.loadGraphic(this.cryptoCurrency,this.currency);
    });

    this.chart = [];
    this.coins = this.dataService.GetCoins();
    this.counter = 0;
    this.currency = "USD";
  }

  ngOnInit(): void {
    this.loadGraphic(this.cryptoCurrency, this.currency);
    console.log(this.cryptoCurrency);
  }

  loadGraphic(cryptoCurrency:string, currency:string){

    this.dataService.GetRegisterNow(cryptoCurrency, currency).then((res) => {

      let allRegisters = res.Data.Data;
      let allDates = [];
      let allAverageQuotization = [];

      allRegisters.forEach((res) => {
        let jsDate = new Date(res.time * 1000);

        allDates.push(jsDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));

        allAverageQuotization.push( (((res.high + res.low) / 2).toFixed(2)) );
      });

      this.graphicChartNow = new Chart('chart-now-'+ cryptoCurrency, {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [
            {
              label:"Average",
              data: allAverageQuotization,
              borderColor: 'rgba(234, 52, 52, 1)',
              backgroundColor: 'rgba(237, 84, 128, 0.67)',
              fill: true
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          elements:{
            line:{
              tension: 0
            }
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        }
      });
    
      setInterval(() => {
        this.updateGraphicNow(this.graphicChartNow, cryptoCurrency, currency, allDates[allDates.length-1]);
      }, 10000);
    });
  }

  updateGraphicNow(chart:Chart, cryptoCurrency:string, currency:string, lastDate:string){

    this.dataService.GetRegisterNow(cryptoCurrency, currency).then((res) => {

      let allRegisters:Array<any> = res.Data.Data;

      let lastRegisterTime = allRegisters[allRegisters.length-1]['time'];
      let lastRegisterHigh = allRegisters[allRegisters.length-1]['high'];
      let lastRegisterLow = allRegisters[allRegisters.length-1]['low'];
      let lastRegisterAverage = parseInt(((lastRegisterHigh + lastRegisterLow) / 2).toFixed(2));

      let jsDate = new Date(lastRegisterTime * 1000);  

      if(jsDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}) != lastDate){

        chart.data.labels.push(jsDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));
        chart.data.labels.shift();
  
        chart.data.datasets[0].data.push(lastRegisterAverage);
        chart.data.datasets[0].data.shift();
        chart.update();
      }

    });
  }
}

