export class Product {
    model: string;   
    name: string;     
    price: number; 
    image: string;
    imagePath! : string;
    conditions: string;
    details: string;
    category: string; 
    status: string;
    isShipped: string | undefined;
    sellername: string | undefined;
    selleruserid: string | undefined;
    buyeruserid : string | undefined;
    id: string;  

    constructor(model: string,
                name: string,              
                price: number,              
                image: string,
                conditions: string,
                details: string,
                category: string, 
                status: string,
                isShipped: string,
                sellername: string | undefined,
                selleruserid: string | undefined,
                buyeruserid: string | undefined,
                id?: string,
                ) {      
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
            this.id = id!;     
        }  
} 