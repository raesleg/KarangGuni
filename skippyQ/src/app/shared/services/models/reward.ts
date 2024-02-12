export class Reward {
    rewardsID: string;
    userEmail: string;
    points: number;
    voucherID: string [];
    

    constructor(
        rewardsID: string,
        userEmail: string,
        points: number,
        voucherID: []
    ) {
        this.rewardsID = rewardsID
        this.userEmail = userEmail;
        this.points = points;
        this.voucherID = [];
    }
}
