export class Group {
    name: string;
    about: string;
   image: string;
   imagePath!: string;
   id: string;
   creator: string;
   members:string[];
   constructor(name: string,
    about: string,
    image: string,
    id?: string,
    creator?: string,
    members?:string[]) {
    this.name = name;
    this.about = about;
    this.image = image;
    this.id = id!;
    this.creator=creator!;
    this.members=[];
    }
   }