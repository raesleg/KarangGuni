export class RecycleInfo {
    category: string;
    types: string[];
    disclaimer: string[];
    notOk: string[];
    thumbnail: string;
    images: string[];

    constructor(
        category: string,
        types: [],
        disclaimer: [],
        notOk: [],
        thumbnail: string,
        images: []
    ){
        this.category = category;
        this.types = types;
        this.disclaimer = disclaimer;
        this.notOk = notOk;
        this.thumbnail = thumbnail,
        this.images = images;
    }
}