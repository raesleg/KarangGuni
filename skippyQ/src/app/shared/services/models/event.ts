export class Event {
    name: string;
    about: string;
    date: string;
    location: string;
   id: string;
   status: string;
   Pgroup: string;

   constructor(name: string,
    about: string,
    date: string,
    location: string,
    status: string,
    Pgroup?: string,
    id?: string,
   
 
) {
    this.name = name;
    this.about = about;
    this.date=date;
    this.location=location;
    this.id = id!;
    this.status=status;
    this.Pgroup=Pgroup!;

    }
   }