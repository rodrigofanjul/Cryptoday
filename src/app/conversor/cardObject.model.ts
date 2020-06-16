export class cardObject {
    mktCap:string;
    circSply:string;
    allDayVol:string;
    dayHigh:string;
    dayLow:string;
    image: string;
    price: string;
    variation: string;

    constructor(mktCap:string, circSply:string, allDayVol:string, dayHigh:string, dayLow:string, image: string, price: string, variation: string) {
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