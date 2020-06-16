export class cardObject {
    name: string;
    mktCap:string;
    circSply:string;
    allDayVol:string;
    dayHigh:string;
    dayLow:string;
    image: string;
    price: string;
    variation: string;

    constructor(name:string, mktCap:string, circSply:string, allDayVol:string, dayHigh:string, dayLow:string, image: string, price: string, variation: string) {
        this.name = name;
        this.mktCap = mktCap; 
        this.circSply = circSply; 
        this.allDayVol = allDayVol; 
        this.dayHigh = dayHigh; 
        this.dayLow = dayLow; 
        this.image = image;
        this.price = price;
        this.variation = variation;
    }
}