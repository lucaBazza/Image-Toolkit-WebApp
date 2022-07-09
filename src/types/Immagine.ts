/**
 * 
 */

import Classification from "./Classification"
import Exif from "./Exif"

export interface ImageSize {
    width: number
    height: number
}

export type imageStyles = 'loading'|'loadingBG'|'imgUploadRequest'|'imageLoaded';

export default class Immagine implements Iterator<number>{
    nomeFile: string
    src: string
    realURL: string
    exifDatas?: Exif //any[]
    id: number
    classStyle: string
    alt?: string
    imgID: string
    catalogoID: string
    adjustmentID: string
    createdAt?: Date
    width?: number
    height?: number
    size?: number
    classificatore?: Classification[]

    constructor(src) {
        this.nomeFile = this.guessFileName(src)
        this.src = src ? src : require("./../assets/loading.gif")
        this.realURL = src
        this.id = -1
        this.imgID = ''
        this.classStyle = 'loading'
        // this.exifDatas = []
        this.catalogoID = ''
        this.adjustmentID = ''
    }

    isEmptyOrSpaces = (str)=>{ return str === null || str.match(/^ *$/) !== null }

    /**
     *  dalla stringa dell'indrizzo reale, toglie dominio e argomenti per restituire solo il nome
     */
    private guessFileName = (str) => { 
        try{ return new URL(str.replaceAll('%2F','/')).pathname.split('/').pop() as string  }
        catch(err){ return str }
    }

    // TODO: usare il firebase image ID per fare l'iterator
    public next(): IteratorResult<number> {
        return { done: false, value: this.id++ }
    }

    getTitolo() {
        return "Hello" + this.src;
    }

    getNomeFile(){
        return this.nomeFile
    }

    getDescrizione() {
        return this.alt ? this.alt : 'descrizione non prensente';
    }
    
    static requireFakeExifs() {
        const randomVal = (min :number, max:number) : number =>{ return Math.floor(Math.random() * max)+min }
        return [
            { label: "Software", val: "Adobe Photoshop 22.1 (Macintosh)" },
            { label: "Modify date", val: "2021:05:24 16:07:10" },
            { label: "Copyright", val: "zabba.lucabazzanella.com" },
            { label: "Aspect ratio", val: "4/5" },
            { label: "GPS", val: `${randomVal(0,50)}.${randomVal(0,10000)} , ${randomVal(0,50)}.${randomVal(0,10000)}` },
            { label: "Voto", val: "⭐".repeat(randomVal(0,5)) },
        //  { label: "ImageWidth", val: Math.floor(Math.random() * 6*1000)+500 },
        //  { label: "ImageHeight", val: randomVal(5000,400) },
        //  { label: "Classificazione", val: ['Landscape','Mountain','Nature','Rocks','Portrait'][randomVal(0,4)] },
            { label: "Note", val: "..." },
        ];
    }

    setCatalogID(cid:string){
        this.catalogoID = cid
        return this
    }

    setExifDatas(exifDatas: Exif /* any[] */){
        this.exifDatas = exifDatas
        return this
    }

    getStelline(count: number){
        return "⭐".repeat(count)
    }

    setNomeFile(nomeFile : string){
        this.nomeFile = nomeFile
        return this
    }

    setClassStyle(classe: imageStyles){
        this.classStyle = classe
        return this
    }

    setRealURL(realURL: string){
        this.realURL = realURL
        return this
    }

    setImageDimension(dims : ImageSize ){
        this.width = dims['width']
        this.height = dims['height']
        return this
    }

    setSize(size: number){
        this.size = size
        return this
    }

    getSize(){
        return this.size
    }

    getSizeString(){
        if( ! this.size) return
        const million = 1000000
        if( this.size > million ) 
            return `${(this.size/million).toFixed(3)} MB`
        return `${(this.size/1000).toFixed(3)} KB`
    }

    setClassificatore(cl : Classification[]){
        this.classificatore = cl
        return this
    }

    getClassificatoreString(){
        const number_of_showResults = 3
        if(this.classificatore)
            return this.classificatore.map( (r: { label: number | string }) => r.label ).join(',').split(',')
                                        .slice(0,number_of_showResults).join(',')
    }

    setTempImgId(tempImgId : string){
        this.imgID = `temp-${tempImgId}`
        return this
    }

    /**
     *  in fase di upload la preview è nel campo src, per non invarlo su FS pulisco prima
     */
    clearSrc(){
        this.src = ''
        return this
    }
}


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