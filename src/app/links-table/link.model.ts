export class Link {
    rank:number;
    title: string;
    link: string;
    cryptocurrencies: string;

    constructor(rank:number, title: string, link: string, cryptocurrencies: string) {
        this.rank = rank; 
        this.title = title;
        this.link = link;
        this.cryptocurrencies = cryptocurrencies;
    }
}