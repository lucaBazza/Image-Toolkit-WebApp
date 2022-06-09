import MD5 from "@/utilities/MD5.js";
import Catalogo from "./Catalogo";

export default class Utente{

    static instance: Utente;

    nome: string;
    email: string;
    password: string;
    secretKey: string;
    listaCataloghi: Catalogo[];
    private indexCatalogNow: number;
    
    /**
     *      di default se l'utente ha più cataloghi vado a selezionare il primo
     */
    constructor(nome: string, password: string, listaCataloghi : Catalogo[] | any){
        this.nome = nome
        this.password = password
        this.secretKey = MD5(nome+password)
        this.listaCataloghi = listaCataloghi
        this.indexCatalogNow = 0
        this.email= ''
    }
    
    //setKeepLogin(isKeepingLog: boolean){
    //    this.keepLogged = isKeepingLog
    //}

    setEmail(email: string){
        this.email = email
        return this;
    }

    setCurrentCatalog(index: number){
        this.indexCatalogNow = index
        return this
    }

    getCatalogoCurrent(){
        return this.listaCataloghi[this.indexCatalogNow];
    }

    getIndexCatalogoCurrent(){
        return this.indexCatalogNow;
    }

    isCurrentCatalog(catalogoId : number){
        console.log(this.listaCataloghi)
        //console.log(`utente.ts isCurrentCatalog() \t ${catalogoId} === ${this.listaCataloghi[this.indexCatalogNow].getCurrentId()}`)
        console.log(`Utente.isCurrentCatalog() ${this.nome} \t esamino: ${catalogoId} == ${this.indexCatalogNow} (selezione utente)`)
        return catalogoId === this.listaCataloghi[this.indexCatalogNow].getCurrentId();
    }

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
}