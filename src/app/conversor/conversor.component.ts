import { Component, OnInit, Input } from '@angular/core';
import {DataService} from '../data.service';


@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.css']
})
export class ConversorComponent implements OnInit {

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
  @Input() cryptoCoinCode:String;
  @Input() coinCode:String;
  quotation:any;
  showQuotation:boolean = false;
  aux:{
    key:string, value:number
  };
  amount:number = 2;

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

    this.dataService.GetTopListCoins().subscribe((res:any) => {
      this.cryptoCoins = res;
      
    });
  }

  onExchangeClick(){

    var node = document.getElementById("coinsContainerFirst");
    var secondNode = document.getElementById("coinsContainerSecond");
    var aux = node.innerHTML;

    node.innerHTML = secondNode.innerHTML;
    secondNode.innerHTML = aux;
  }

  async onCalculateClick(){
    var firstSelect:any = document.getElementById("firstCoins");
    var firstSelectValue = firstSelect.options[firstSelect.selectedIndex].value;

    var secondSelect:any = document.getElementById("secondCoins");
    var secondSelectValue = secondSelect.options[secondSelect.selectedIndex].value;

    console.log(this.amount);

    (await this.dataService.GetQuotation(firstSelectValue, secondSelectValue)).subscribe((res:any) => {
      this.quotation = res;

      this.showQuotation = true;
  
      this.aux = this.quotation;
  
      for (let key in this.quotation) {
        this.aux.key = key;
        this.aux.value = (parseInt(this.quotation[key]) * this.amount);
      }
      console.log(this.aux.value);
      console.log(this.amount);
    });
    
    
  }

}
