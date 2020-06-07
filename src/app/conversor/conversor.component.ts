import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';


@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.css']
})
export class ConversorComponent implements OnInit {

  cryptoCoins:any;
  coins:Object[] = [
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

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

    this.dataService.GetTopListCoins().subscribe((res:any) => {
      this.cryptoCoins = res;
    })


  }

}
