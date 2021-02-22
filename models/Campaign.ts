class Campaign {
    private id: number;
    private charityId: number; //each campaign belongs to one charity (foreign key in db)
    private name: string;
    private amountRaised: number; //defaults to 0

    constructor(id:number, charityId:number, name:string, amountRaised:number = 0) {
        this.id = id;
        this.charityId = charityId;
        this.name = name;
        this.amountRaised = amountRaised;
    }
}

export default Campaign;