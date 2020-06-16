import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.css']
})
export class ConversorComponent implements OnInit {

  //Listas de monedas
  cryptoCoins:any;
  coins:any = this.dataService.GetCoins();

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
  counter:number = 0;
  subscription: Subscription;
  statusText: string;

  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad(){

    if(this.subscription)
      this.subscription.unsubscribe();
      
    this.dataService.GetTopListCoins("USD").then((res) => {
        this.cryptoCoins = res;
      }
    ).catch(function(val){
      console.log(val);
    });

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

  onExchange(){

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

    if((this.counter % 2) == 0){

      firstNode.firstChild.value = secondSelectValue;
      secondNode.firstChild.value = firstSelectValue;
    }else{
      firstNode.firstChild.value = firstSelectValue;
      secondNode.firstChild.value = secondSelectValue;
    }

    this.onCalculate();

    return this.counter++;
  }

  onCalculate(){

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

      if((this.counter % 2) == 0){

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
}