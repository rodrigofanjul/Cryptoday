import { Component, OnInit, Input } from '@angular/core';
import {DataService} from '../data.service';


@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.css']
})
export class ConversorComponent implements OnInit {


  //Listas de monedas
  cryptoCoins:any;
  coins:any = [
    {id:"ARG", name:"Peso Argentino"},
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
  quotation:any;
  showQuotation:boolean = false;
  amount:number = 1;
  
  //Selects del HTML
  firstSelectInfo:any;
  secondSelectInfo:any;

  //Variables auxiliares
  aux:{
    key:string, value:number
  };
  aux2:number;
  counter:number = 0;

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

    this.dataService.GetTopListCoins().subscribe((res:any) => {
      this.cryptoCoins = res;
      
    });
  }

  onExchangeClick(){

    let node = document.getElementById("coinsContainerFirst");
    let secondNode = document.getElementById("coinsContainerSecond");
    let aux = node.innerHTML;

    node.innerHTML = secondNode.innerHTML;
    secondNode.innerHTML = aux;

    return this.counter++;
  }

  async onCalculateClick(){
    let firstSelect:any = document.getElementById("firstCoins");
    let firstSelectValue = firstSelect.options[firstSelect.selectedIndex].value;
    this.firstSelectInfo = firstSelect.options[firstSelect.selectedIndex].innerHTML;
    
    let secondSelect:any = document.getElementById("secondCoins");
    let secondSelectValue = secondSelect.options[secondSelect.selectedIndex].value;
    this.secondSelectInfo = secondSelect.options[secondSelect.selectedIndex].innerHTML;

    this.aux2 = this.amount;

    (await this.dataService.GetQuotation(firstSelectValue, secondSelectValue)).subscribe((res:any) => {
      this.quotation = res;

      this.showQuotation = true;
  
      this.aux = this.quotation;
  
      for (let key in this.quotation) {
        this.aux.key = key;
        this.aux.value = (parseInt(this.quotation[key]) * this.amount);
      }
    });
    
  }



}
