export class Trans {

    productIds: string[] = [];

    create_time: string;   
    currency: string;     
    amount: number; 
    buyeruserid : string | undefined;
    id: string;  

    constructor(create_time: string,
                currency: string,              
                amount: number,
                buyeruserid: string | undefined,
                id?: string,
                ) {   
            this.create_time = create_time;
            this.currency = currency;         
            this.amount = amount;     
            this.buyeruserid = buyeruserid;
            this.id = id!;     
           }  
           
} 
    

