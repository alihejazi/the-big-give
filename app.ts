import Donation from './models/Donation';
import MatchFund, {MatchFundTypes} from './models/MatchFund';

class App {

    matchFunds: MatchFund[] = [
        //highest priority match fund, ratio 1:1
        new MatchFund(1, "Match Fund 1", MatchFundTypes.PLEDGE,   100000, 0, 1),

        //second highest priority match fund, ratio 2:1
        new MatchFund(2, "Match Fund 2", MatchFundTypes.CHAMPION, 100000, 0, 2, 2),

        //third highest priority match fund, ratio 3:1
        new MatchFund(3, "Match Fund 3", MatchFundTypes.PLEDGE,   100000, 0, 3, 3)
    ];

    // POST
    reserveMatchFund(donation:Donation) {
        const orderedMatchFunds = this.matchFunds.sort((a, b)=> a.getMatchOrder() - b.getMatchOrder());

        for (let i = 0; i < orderedMatchFunds.length; i++) {
            const matchFund = orderedMatchFunds[i];

            if (matchFund.isMaxedOut()) {
                continue;
            }

            if (donation.getAmount() <= matchFund.getMaxDonationsToMatch()) {
                matchFund.allocateDonation(donation);

                //exit loop so we don't apply same donation unnecessarily to the next match fund
                break;
            }

            else {
                // works on condition that TS passes by reference not by value
                this.reservePartialMatchFund(donation, matchFund);
            }
        }

        //if there's excess after iterating through all match funds? -> ignore for now.    
    }

    // helper
    private reservePartialMatchFund(donation: Donation, matchFund: MatchFund) {
        //let's split the donation to what can be fit in the current match fund, and pass the rest to the next match fund
        const excess = donation.getAmount() - matchFund.getMaxDonationsToMatch();

        donation.setAmount(donation.getAmount() - excess);
        matchFund.allocateDonation(donation);

        //for the next iteration's match fund, set the amount to the excess from this one
        donation.setAmount(excess);
    }

    // POST
    public collectDonation(donation: Donation) : void {

        if (donation.getMatchingExpired()) {
            throw new Error("Matching expred. Cannot collect donation.");
        }

        if (!donation.getMatchFundId()) {
            throw new Error("Match fund must be resserved for donation first before it can be collected.");
        }

        //otherwise, collect the donation.
        const matchFundForThisDonation = this.getMatchFundById(donation.getMatchFundId());
        matchFundForThisDonation.collectDonation(donation);
    }

    // helper
    private getMatchFundById(matchFundId:number) : MatchFund {
        for (let i = 0; i < this.matchFunds.length; i++) {
            const matchFund = this.matchFunds[i];
            if (matchFund.getId() == matchFundId) {
                return matchFund;
            }
        }
    }

    // POST
    expireMatching(donation:Donation) {
        const matchFundForThisDonation = this.getMatchFundById(donation.getMatchFundId());
        matchFundForThisDonation.expireMatching(donation);
    }

    // GET
    getAllMatchFundAllocations() {
        this.matchFunds.forEach(matchFund => {
            // const donations = matchFund.getDonations();
            console.log("--------------------------------------------------------");
            console.log("Match Fund and its donations are as follows: ", matchFund);
            // console.log("Its donations are:");
            // donations.forEach(donation => console.log(donation));
            console.log("--------------------------------------------------------\n\n");
        })
    }

}

const app = new App();
const donation  = new Donation(1, 1, 5000);
const donation2 = new Donation(2, 2, 10000);
const donation3 = new Donation(3, 3, 10000);
const donation4 = new Donation(3, 3, 100000);
app.reserveMatchFund(donation);
app.reserveMatchFund(donation2);
app.reserveMatchFund(donation3);
app.reserveMatchFund(donation4);
app.getAllMatchFundAllocations();

export default App;