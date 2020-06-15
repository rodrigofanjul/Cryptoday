import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {DataService} from '../data.service';
import { leadboardObject } from './leadboardObject.model';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  chart = [];
  cryptoCurrencies:any;
  cryptoCurrenciesNames = [];
  cryptoCurrenciesImages = [];
  cryptoCurrenciesPrices = [];
  cryptoCurrenciesVariation = [];
  aux:Array<leadboardObject> = [];

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

    
    this.getLeadBoardInformation();
    this.showCryptocurrenciesDaily();
  }

  showCryptocurrenciesDaily(){

    this.dataService.GetRegisterDaily("BTC").then((res) => {
      
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

    this.dataService.GetTopListCoins().then((res) => {
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

        this.aux.push(new leadboardObject(name, ("https://www.cryptocompare.com/" + image), price, variation));
      });

      console.log(this.aux);
      console.log(res);
    });
  }



}
