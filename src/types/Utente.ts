import MD5 from "@/utilities/MD5.js";
import Catalogo from "./Catalogo";
import Immagine from "./Immagine";

export default class Utente{

    nome: string;
    email: string;
    password: string;
    secretKey: string;
    listaCataloghi: Catalogo[];
    indexCatalogNow: number;
    photoURL: string;
    uid: string;
    
    /**
     *      di default se l'utente ha più cataloghi vado a selezionare il primo
     */
    constructor(nome: string){
        this.nome = nome
        this.password = ''
        this.secretKey = ''         //MD5(nome+password)
        this.listaCataloghi = []
        this.indexCatalogNow = 0
        this.email= ''
        this.photoURL= ''
        this.uid='-'
    }

    setEmail(email: string){
        this.email = email
        return this;
    }

    setListaCataloghi(cats: Catalogo[]){
        this.listaCataloghi = cats
        return this
    }

    getListaCataloghi(): Catalogo[]{
        return this.listaCataloghi
    }

    setCurrentCatalog(index: number){
        this.indexCatalogNow = index
        return this
    }

    getCatalogoCurrent() : Catalogo{
        return this.listaCataloghi[this.indexCatalogNow];
    }

    getIndexCatalogoCurrent(){
        return this.indexCatalogNow;
    }

    isCurrentCatalog(catalogoId : number){
        //console.log(this.listaCataloghi)
        //console.log(`utente.ts isCurrentCatalog() \t ${catalogoId} === ${this.listaCataloghi[this.indexCatalogNow].getCurrentId()}`)
        //console.log(`Utente.isCurrentCatalog() ${this.nome} \t esamino: ${catalogoId} == ${this.indexCatalogNow} (selezione utente)`)
        
        //return catalogoId === this.listaCataloghi[this.indexCatalogNow].getCurrentId();
        return catalogoId === this.listaCataloghi[this.indexCatalogNow].id;
    }

    setPhotoURL(url: string){
        this.photoURL = url;
        return this
    }

    setUID(uid: string){
        this.uid = uid;
        return this
    }

    setListaImmagini_currentCatalog(li : Immagine[]){
        this.getCatalogoCurrent().listaImmagini = li
        return this
    }

}


/*
static instance: Utente;
static getInstance(){
    if( Utente.instance )
        return Utente.instance
    else throw Error('User not istanced')
}

public static InstanceB() {
    if( ! this.instance )
        console.log('Utente.InstanceB() istance not found, creating a new one')
    return this.instance || (this.instance = new this('') );
}
*/


/*
constructor(params: Utente = {} as Utente){
    // https://stackoverflow.com/questions/12702548/constructor-overload-in-typescript/40976608#40976608
    // Define the properties of the incoming `params` object here. 
    // Setting a default value with the `= 0` syntax is optional for each parameter
    let {
        nome = "",
        password = '',
        secretKey = MD5(nome+password),
        catalogoNow = new Catalogo(''),
        listaCataloghi = new Array<Catalogo>(),
        keepLogged = false
    } = params;
    
    //  Use jsdoc comments here for inline ide auto-documentation
    this.nome = nome
    this.password = password
    this.secretKey = secretKey
    this.catalogoNow = catalogoNow
    this.listaCataloghi = listaCataloghi
    this.keepLogged = keepLogged
}
*/