import { tsImportEqualsDeclaration } from "@babel/types"
import Immagine from "./Immagine"

//interface Catalogo{
export default class Catalogo{

    titolo: string
    proprietario: string
    uid: string
    listaImmagini: Immagine[]
    secretkey: string
    static id: number = 0
    createdAt: Date

    constructor(proprietario: string, titolo: string) {
        this.titolo = titolo
        this.proprietario = proprietario
        this.uid = ''
        this.secretkey = ' '
        this.listaImmagini = []
        Catalogo.id = ++Catalogo.id
        this.createdAt = new Date
        //console.log(`Catalogo costruito ${titolo} \t- id: ${Catalogo.id}`)
    }

    setListaImmagini(listaImmagini: Immagine[]) {
        this.listaImmagini = listaImmagini
    }

    /*public getTitolo(): string {
        return this.titolo
    }
    public setTitolo(value: string) {
        this.titolo = value
    }  */     

    getCurrentId() : number{
        return Catalogo.id
    }

    getUid(): string{
        return this.uid;
    }
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