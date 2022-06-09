import { tsImportEqualsDeclaration } from "@babel/types"
import Immagine from "./Immagine"

//interface Catalogo{
export default class Catalogo{

    private _titolo: string
    proprietario: string
    listaImmagini: Immagine[]
    secretkey: string | undefined
    static id: number = 0

    constructor(proprietario: string, titolo: string, id: number) {
        this._titolo = titolo
        this.proprietario = proprietario
        this.listaImmagini = []
        Catalogo.id = ++Catalogo.id     //this.id = id

        //console.log(`Catalogo costruito ${titolo} \t- id: ${Catalogo.id}`)
    }

    setListaImmagini(listaImmagini: Immagine[]) {
        this.listaImmagini = listaImmagini
    }

    public get titolo(): string {
        return this._titolo
    }
    public set titolo(value: string) {
        this._titolo = value
    }       

    getCurrentId():number{
        return Catalogo.id
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