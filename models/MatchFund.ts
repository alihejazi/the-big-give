import Donation from './Donation';

enum MatchFundTypes {
    PLEDGE = "PLEDGE FUND",
    CHAMPION = "CHAMPION FUND"
}

class MatchFund {
    private id: number;
    private name: string;
    private type: string;
    private limit: number;
    private amountAllocated: number;
    private matchOrder: number;
    private matchingRatio: number;

    private amountCollected: number = 0;
    private donations: Donation[] = [];

    constructor(id:number, name:string, type:string, limit:number, amountAllocated:number, matchOrder:number, matchingRatio:number = 1) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.limit = limit;
        this.amountAllocated = amountAllocated;
        this.matchOrder = matchOrder;
        this.matchingRatio = matchingRatio; //defaults to 1
    }

    getId() {
        return this.id;
    }

    getDonations() {
        return this.donations;
    }

    getMatchOrder() : number {
        return this.matchOrder;
    }

    getMaxDonationsToMatch() : number {
        return (this.limit - this.amountAllocated - this.amountCollected) / this.matchingRatio;
    }

    isMaxedOut() : boolean {
        return this.amountAllocated + this.amountCollected == this.limit;
    }

    allocateDonation(donation: Donation) {
        donation.setMatchFundId(this.id);
        this.donations.push(donation);
        this.amountAllocated += donation.getAmount() * this.matchingRatio;
    }

    collectDonation(donation: Donation) {
        donation.collect();
        const matchedAmount = donation.getAmount() * this.matchingRatio;
        this.amountCollected += matchedAmount;
        this.amountAllocated -= matchedAmount;
    }

    expireMatching(donation: Donation) {
        donation.setMatchFundId(null);
        let index: number;

        for (let i = 0; i < this.donations.length; i++) {
            const currentDonation = this.donations[i];

            if (currentDonation.getId() == donation.getId()) {
                index = i;
                break;
            }
        }

        delete this.donations[index];
        donation.setMatchingExpired();

        //unlock funds
        this.amountAllocated -= donation.getAmount() * this.matchingRatio;
    }
}

export default MatchFund;
export {MatchFundTypes};