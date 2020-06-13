import { Component, OnInit } from '@angular/core';
import { Link } from './link.model';

@Component({
  selector: 'app-links-table',
  templateUrl: './links-table.component.html',
  styleUrls: ['./links-table.component.css']
})
export class LinksTableComponent implements OnInit {

  links:Link[];

  constructor() { 
    this.links = [
      new Link(1, "CoinBase", "https://www.coinbase.com/", "(Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Ethereum Classic)"),
      new Link(2, "Robinhood", "https://robinhood.com/", "(Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Bitcoin SV, Ethereum Classic, Dogecoin)"),
      new Link(3, "Cash App", "https://cash.app/", "(Bitcoin)"),
      new Link(4, "Binance", "https://www.binance.com/", "(Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Ripple)"),
      new Link(5, "Gate.io", "https://www.gate.io/", "199 Different Cryptocurrencies"),
      new Link(6, "Bitfinex", "https://www.coinbase.com/", "(Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Ethereum Classic)"),
      new Link(7, "Cex.io", "https://cex.io/", "(Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Bitcoin Gold, Zcash, Dash)"),
      new Link(8, "LocalBitcoins", "https://localbitcoins.com/", "(Bitcoin, Ethereum, Litecoin, XRP)"),
      new Link(9, "HitBTC", "https://hitbtc.com/", "(Bitcoin, Ethereum, Litecoin, EOS, Ripple, Dogecoin, Monero, Tron, Dash, Tether)"),
      new Link(10, "Yobit", "https://yobit.io/", "(Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Dash, Dogecoin, Monero, Zcash)")
    ];
  }

  ngOnInit(): void {

  }

}
