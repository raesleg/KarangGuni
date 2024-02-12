export class Voucher {
    voucherID: string;
    brand: string;
    value: number;
    pointsRequired: number;
    image;
    imagePath?: string;

    constructor(
        voucherID: string,
        brand: string,
        value: number,
        pointsRequired: number,
        image?: any
    ) {
        this.voucherID = voucherID;
        this.brand = brand;
        this.value = value;
        this.pointsRequired = pointsRequired;
        this.image = image!;
    }
}
