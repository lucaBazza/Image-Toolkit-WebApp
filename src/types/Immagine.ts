
//interface Immagine{ }

export default class Immagine implements Iterator<number>{
    nomeFile: string
    src: string
    realURL: string
    exifDatas: any[]
    id: number
    classStyle: string
    alt?: string
    catalogoID: number
    adjustmentID: number
    createdAt: Date

    constructor(src, id) {
        this.nomeFile = this.checkFileName(src)
        this.src = require("./../assets/loading.gif") //this.isEmptyOrSpaces(src) ? require("./../assets/loading.gif") : src
        this.realURL = src
        this.id = id
        this.classStyle = 'loading'
        this.exifDatas = this.requireFakeExifs()
        this.catalogoID = -1
        this.adjustmentID = -1
        this.createdAt = new Date
    }

    isEmptyOrSpaces = (str)=>{ return str === null || str.match(/^ *$/) !== null }

    checkFileName = (str) => { 
        try{ return new URL(str.replaceAll('%2F','/')).pathname.split('/').pop() as string  }
        catch(err){ return str }   
    }

    public next(): IteratorResult<number> {
        return { done: false, value: this.id++ }
    }

    getTitolo() {
        return "Hello" + this.src;
    }

    getDescrizione() {
        return this.alt ? this.alt : 'descrizione non prensente';
    }
    
    requireFakeExifs() {
        const randomVal = (min :number, max:number) :number=>{ return Math.floor(Math.random() * max)+min }
        return [
          { label: "ImageWidth", val: Math.floor(Math.random() * 6*1000)+500 },
          { label: "ImageHeight", val: randomVal(5000,400) },
          { label: "Software", val: "Adobe Photoshop 22.1 (Macintosh)" },
          { label: "ModifyDate", val: "2021:05:24 16:07:10" },
          { label: "Copyright", val: "zabba.lucabazzanella.com" },
          { label: "Aspect ratio", val: "4/5" },
          { label: "gps", val: `${randomVal(0,50)}.${randomVal(0,10000)} , ${randomVal(0,50)}.${randomVal(0,10000)}` },
          { label: "classificazione", val: this.getStelline(randomVal(0,5)) },
          { label: "note", val: "..." },
        ];
    }

    setExifDatas(exifDatas: any[]){
        this.exifDatas = exifDatas
    }

    getStelline(count: number): string{
        return "⭐".repeat(count)
    }

    setNomeFile(nomeFile : string){
        this.nomeFile = nomeFile
        return this
    }
}

//export default Immagine


/*
getImagePlaceHolder() {
    return [
        {
        name: "loading",
        src: require("./../assets/loading.gif"),
        class: "loading",
        datas: [], //this.requireFakeExifs(),
        id: 0,
        done: false,
        title: "Passo Sella",
        },
        //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
        //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
    ];
}
*/