import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { leadboardObject } from './leadboardObject.model';
import { cardObject } from './cardObject.model';


@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.css']
})
export class ConversorComponent implements OnInit {


  //Listas de monedas
  cryptoCoins:any;
  coins:any = [
    {id:"ARS", name:"Peso Argentino"},
    {id:"USD", name:"Dolar estadounidense"},
    {id:"EUR", name:"Euro"},
    {id:"AUD", name:"Dolar austrailiano"},
    {id:"CNY", name:"Yuan chino"},
    {id:"BRL", name:"Real brasilero"},
    {id:"JPY", name:"Yen japones"},
    {id:"CAD", name:"Dolar canadiense"},
    {id:"GBP", name:"Libra esterlina"}
  ];

  //Inputs
  @Input() cryptoCoinCode:String;
  @Input() coinCode:String;

  //Variables
  showCryptoQuotation:boolean = true;
  showCoinQuotation:boolean = false;
  amount:number = 1;
  
  //Selects del HTML
  firstSelectInfo:any;
  secondSelectInfo:any;

  //Variables auxiliares
  aux:{
    key:string, value:string
  };
  aux2:number;
  conversorCounter:number = 0;
  // private fetchData: Observable<any> = this.dataService.GetTopListCoins();
  subscription: Subscription;
  statusText: string;

  //Chartss
  chart = [];
  cryptoCurrencies:any;
  informationList:Array<leadboardObject> = [];
  chartCounter:number = 0;
  card:cardObject;

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

    this.dataService.GetTopListCoins().then((res) => {
        this.cryptoCoins = res;
      }
    ).catch(function(val){
      console.log(val);
    });

    this.onLoad();

    this.getLeadBoardInformation();
    this.getCardInformation("BTC");    
    this.showCryptocurrenciesDaily("BTC");
  }

  onExchangeClick(){

    if(this.subscription)
      this.subscription.unsubscribe();

    let firstSelect:any = document.getElementById("firstCoins");
    let firstSelectValue = firstSelect.options[firstSelect.selectedIndex].value;
  
    let secondSelect:any = document.getElementById("secondCoins");
    let secondSelectValue = secondSelect.options[secondSelect.selectedIndex].value;

    let firstNode:any = document.getElementById("coinsContainerFirst");
    let secondNode:any = document.getElementById("coinsContainerSecond");
    let aux = firstNode.innerHTML;

    firstNode.innerHTML = secondNode.innerHTML;
    secondNode.innerHTML = aux;

    if((this.conversorCounter % 2) == 0){

      firstNode.firstChild.value = secondSelectValue;
      secondNode.firstChild.value = firstSelectValue;
    }else{
      firstNode.firstChild.value = firstSelectValue;
      secondNode.firstChild.value = secondSelectValue;
    }


    this.onCalculateClick();

    return this.conversorCounter++;
  }

  onCalculateClick(){

    if(this.subscription)
      this.subscription.unsubscribe();

    let firstSelect:any = document.getElementById("firstCoins");
    let firstSelectValue = firstSelect.options[firstSelect.selectedIndex].value;
    this.firstSelectInfo = firstSelect.options[firstSelect.selectedIndex].innerHTML;

    let secondSelect:any = document.getElementById("secondCoins");
    let secondSelectValue = secondSelect.options[secondSelect.selectedIndex].value;
    this.secondSelectInfo = secondSelect.options[secondSelect.selectedIndex].innerHTML;

    this.aux2 = this.amount;

    this.subscription = timer(0, 5000).pipe(
      switchMap(() => this.dataService.GetQuotation(firstSelectValue,secondSelectValue))
    ).subscribe(res => {

      let quotation:any = res;

      this.aux = quotation;

      if((this.conversorCounter % 2) == 0){

        for (let key in quotation) {
          this.aux.key = key;
          this.aux.value = (parseFloat(quotation[key]) * this.amount).toFixed(2);
        }
  
        this.showCryptoQuotation = true;
        this.showCoinQuotation = false;

      }else{
        for (let key in quotation) {
          this.aux.key = key;
          this.aux.value = (this.amount / parseFloat(quotation[key])).toFixed(7);
        }
  
        this.showCryptoQuotation = false;
        this.showCoinQuotation = true;
      }

    });
  }

  onLoad(){

    if(this.subscription)
      this.subscription.unsubscribe();

    this.firstSelectInfo = "Bitcoin(BTC)";
    this.secondSelectInfo = "Peso Argentino(ARS)";

    this.aux2 = this.amount;

    this.subscription = timer(0, 5000).pipe(
      switchMap(() => this.dataService.GetQuotation("BTC","ARS"))
    ).subscribe(res => {
        let quotation:any = res;
  
        this.aux = quotation;
  
        for (let key in quotation) {
          this.aux.key = key;
          this.aux.value = (parseFloat(quotation[key]) * this.amount).toFixed(2);
        }

    });

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
      if(this.chartCounter > 0){
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

        this.informationList.push(new leadboardObject(this.chartCounter++ , name, ("https://www.cryptocompare.com/" + image), price, variation));
      });
    });
  }

  public trackItem (index: number, item: leadboardObject) {
    
    return item.id;
  }

  cryptocurrencySelected(crypto:leadboardObject){
    let cryptoCurrencyName = crypto['name'];
    
    var node = document.getElementById('chart');
    node.querySelectorAll('*').forEach(n => n.remove());

    this.createCanvas();

    this.getCardInformation(cryptoCurrencyName);
    this.showCryptocurrenciesDaily(cryptoCurrencyName);
    
    
  }

  createCanvas(){
    var node = document.getElementById('chart');
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "chart-canvas");
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
