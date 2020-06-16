export class leadboardObject {
    id:number;
    name:string;
    image: string;
    price: string;
    variation: string;

    constructor(id:number, name:string, image: string, price: string, variation: string) {
        this.id = id;
        this.name = name; 
        this.image = image;
        this.price = price;
        this.variation = variation;
    }
}