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

    // voteUp(): void {
    //     this.votes++;
    // }

    // voteDown(): void {
    //     this.votes--;
    // }

    // formatDomain(): string {
    //     try {
    //         const domain: string = this.link.split('//')[1];
    //         return domain.split('/')[0];
    //     } catch (err) {
    //         return null;
    //     }

    // }
}