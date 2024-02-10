export class Profile {
    userID: string;
    isAdmin: boolean;
    email: string;
    phoneNumber: number;
    name: string;
    password: string;
    ageRange: string;
    bio?: string;
    shippingAddress: string;
    image;
    imagePath?: string;

    constructor(
        userID: string,
        isAdmin: boolean,
        email: string,
        phoneNumber: number,
        name: string,
        password: string,
        ageRange: string,
        shippingAddress: string,
        bio?: string,
        image?: any
    ) {
        this.userID = userID;
        this.isAdmin = isAdmin;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.password = password;
        this.ageRange = ageRange;
        this.shippingAddress = shippingAddress;
        this.bio = bio!;
        this.image = image!;
    }
}
