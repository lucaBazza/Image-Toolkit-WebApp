/**
 * 
 */

import Classification from "./Classification"
import Exif from "./Exif"

export interface ImageSize {
    width: number
    height: number
}

export type imageStyles = 'loadingError'|'loadingBG'|'imgUploadRequest'|'imageLoaded'

export default class Immagine implements Iterator<number>{
    nomeFile: string
    src?: string
    realURL: string
    exifDatas?: Exif
    orderId?: number
    classStyle: imageStyles
    alt?: string
    imgID: string
    catalogoID: string
    adjustmentID: string
    createdAt?: Date
    width?: number
    height?: number
    size?: number
    classificatore?: Classification[]
    base64?: string

    constructor(realUrl) {
        this.nomeFile = this.guessFileName(realUrl)
        //this.src = src ? src : require("./../assets/loading.gif")
        this.realURL = realUrl
        this.imgID = ''
        this.classStyle = 'loadingBG'
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
        return { done: false, value: Number(this.imgID.match( /\d+/g )) }
    }

    getTitolo() {
        return this.src;
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
        if( ! this.size ) return
        const million = 1000000
        return this.size > million ? `${(this.size/million).toFixed(3)} MB` : `${(this.size/1000).toFixed(0)} KB`
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

    getClassificatoreAllTags(){
        return this.classificatore && this.classificatore.map( (r: { label: number | string }) => `${r.label}`.trim() ).join(',').split(',')
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

    getExposureTime(){
        if(this.exifDatas && this.exifDatas['ExposureTime']){
            const expTime = this.exifDatas['ExposureTime']
            return expTime > 1 ? `${expTime} s` : `${Math.floor(expTime*1000)} ms`
        }
    }

    getCustomExifDatas(){
        if( ! this.exifDatas) return []
        let out : {label, val}[] = [] //[{label:'a', val: 'b'}, {label:'b', val: 'b'}, {label:'c', val: 'b'}]
        const checkExist = etichetta => { return this.exifDatas![etichetta] ? true : false }

        if(checkExist('Make') && checkExist('Model') )
            out.push({
                label: 'Device', 
                val: this.exifDatas['Model'].includes(this.exifDatas['Make']) ? this.exifDatas['Model'] : `${this.exifDatas['Make']} ${this.exifDatas['Model']}`
            })
    
        if(checkExist('FNumber') && checkExist('ExposureTime') )
            out.push({ label:'Exposition', val:`f.${this.exifDatas['FNumber']} for ${this.getExposureTime()}` })

        const otherTags = [/* 'FNumber','ExposureTime', */'DateTime','Copyright']
        otherTags.forEach( e => checkExist(e) && out.push({ label: e, val: this.exifDatas![e] }) )
        
        return out
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