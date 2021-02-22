enum DonationStatus {
    RESERVED = "RESERVED",
    COLLECTED = "COLLECTED"
}

class Donation {
    private id: number;
    private campaignId: number; //foreign key
    private amount: number;
    private status: string = DonationStatus.RESERVED;
    private matchFundId: number;
    private matchingExpired = false;

    constructor(id:number, campaignId:number, amount:number) {
        this.id = id;
        this.campaignId = campaignId;
        this.amount = amount;
    }

    getId() : number {
        return this.id;
    }

    getAmount() : number {
        return this.amount;
    }

    setAmount(amount:number) : void {
        this.amount = amount;
    }

    getMatchFundId() : number {
        return this.matchFundId;
    }

    setMatchFundId(matchFundId: number) {
        this.matchFundId = matchFundId;
    }

    collect() : void {
        if (this.matchFundId) {
            this.status = DonationStatus.COLLECTED;
        }

        else {
            throw new Error("Donation must have a match fund to be collected. Reserve the donation first.");
        }
    }

    getMatchingExpired() : boolean {
        return this.matchingExpired;
    }

    setMatchingExpired() : void {
        this.matchingExpired = true;
    }
}

export default Donation;
export {DonationStatus};