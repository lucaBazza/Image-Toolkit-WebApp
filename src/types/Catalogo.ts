import { tsImportEqualsDeclaration } from "@babel/types"
import Immagine from "./Immagine"

//interface Catalogo{
export default class Catalogo{

    titolo: string
    proprietario: string
    uid: string
    listaImmagini: Immagine[]
    secretkey: string
    id?: number
    createdAt?: Date
    // TODO implementare cid:  catalog id cioè il valore preso da firebase
    cid: string

    constructor(proprietario: string, titolo: string) {
        this.titolo = titolo
        this.proprietario = proprietario
        this.uid = ''
        this.secretkey = ''
        this.listaImmagini = []
        this.id = -1
        this.cid = ''
    }

    setListaImmagini(listaImmagini: Immagine[]) : Catalogo {
        console.log('Catalogo.ts setListaImmagini() \t',this.listaImmagini)
        this.listaImmagini = listaImmagini
        return this
    }
    
    setCatalogID(id : number){
        this.id = id
        return this
    }

    setCatalogUserID(uid : string){
        this.uid = uid
        return this
    }

    setCatalog_cid(cid: string){
        this.cid = cid
        return this
    }


    setCreateDate_fs(serverTimestamp : any){
        this.createdAt = serverTimestamp
        return this
    }

    /*
    toString(){
        return 'Catalog: ' + this.titolo
    }
    public getTitolo(): string {
        return this.titolo
    }
    public setTitolo(value: string) {
        this.titolo = value
    }  
    */     

    /*
    getCurrentId() : number{
        return Catalogo.id
    }
    getUid(): string{
        return this.uid;
    }
    */
}

interface Catalogo_extended extends Catalogo {
    secondoTitolo: string;
}

/*   
let catalogo_extended: Catalogo_extended = { 
    titolo: '1',
    proprietario: 'Mario',
    listaImmagini: [],
    secretkey: '',
    id: 99,
    secondoTitolo: 'secondo'
};
*/