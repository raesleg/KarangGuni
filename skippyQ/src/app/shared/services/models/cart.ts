export class Cart {
    model: string;   
    name: string;     
    price: number; 
    image: string;
    imagePath! : string;
    conditions: string;
    details: string;
    category: string; 
    status: string;
    isShipped: boolean | undefined;
    sellername: string | undefined;
    selleruserid: string | undefined;
    buyeruserid : string | undefined;
    productid : string;
    id: string;   

    constructor(model: string,
                name: string,              
                price: number,              
                image: string,
                conditions: string,
                details: string,
                category: string, 
                status: string,
                isShipped: boolean | undefined,
                sellername: string | undefined,
                selleruserid: string | undefined,
                buyeruserid: string | undefined,
                productid: string,
                id: string) {   // optional parameters with ? in constructor parameter   
            this.model = model
            this.name = name;         
            this.price = price;         
            this.image = image;  
            this.details = details;
            this.conditions = conditions;
            this.category = category;
            this.status = status;
            this.isShipped = isShipped;
            this.sellername = sellername;
            this.selleruserid = selleruserid;
            this.buyeruserid = buyeruserid;
            this.productid = productid;
            this.id = id!;     
           }  
           
} 