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
    selected_cid: string

    /**
     *      di default se l'utente ha più cataloghi vado a selezionare il primo
     */
    constructor(nome: string){
        this.nome = nome
        this.password = ''
        this.secretKey = ''         //MD5(nome+password)
        this.listaCataloghi = []
        this.indexCatalogNow = -999
        this.email= ''
        this.photoURL= ''
        this.uid='-'
        this.selected_cid = ''
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

    /*setCurrentCatalog(index: number){
        let newIDexists = false
        newIDexists = this.listaCataloghi.some( c => { return c.id === index })
        newIDexists ? this.indexCatalogNow = index : console.log(`Utente.setCurrentCatalog() Error: id ${index} not exist in user catalog lists`)
        return this
    }*/

    getCurrentCatalog_cid(){
        //console.log(`\n\nUtente.getCurrentCatalog_cid() \n selected cid: ${this.selected_cid} \t aviable: ${this.listaCataloghi.map(cc => cc.cid)}`)
        let out = this.listaCataloghi.filter(c => c.cid === this.selected_cid)[0]
        /*return out ? out :*/ if( ! out) console.log('Utente.getCurrentCatalog_cid() no aviable cid')
        //console.log('\n\n getCurrentCatalog_cid()',out.titolo)
        return out
    }

    selectFirstAviableCatalog(){
        //console.log('Utente.selectFirstAviableCatalog() ', this.listaCataloghi.map(c => c.cid) )
        let firstAviableCat = this.listaCataloghi[0]
        this.indexCatalogNow = firstAviableCat.id
        this.selected_cid = firstAviableCat.cid
        //console.log(`selectFirstAviableCatalog() ${this.indexCatalogNow} \t|\t ${this.selected_cid}`)
        return this
    }

    /**
     *   setta indexCatalogNow con l'indice del catalogo indicato da cid
     *          NO UTILIZZA SEMPRE L'ID
    */
    setCurrentCatalog_cid(cid: string){
        //console.log('\n 🍎 setCurrentCatalog_cid() cid: ', cid, '\n', this.listaCataloghi.map(x => x.cid))
        let newIDexists = this.listaCataloghi.findIndex(c => c.cid === cid)
        //console.log('setCurrentCatalog_cid() newIDexists: ', newIDexists)
        if(newIDexists > -1) 
            this.indexCatalogNow = newIDexists
        else 
            console.log(`Utente.setCurrentCatalog_cid() Error: id ${cid} not exist in user catalog lists`)

        console.log('setCurrentCatalog_cid() . ',newIDexists)
        return this
    }

    getCatalog_by_cid(cid : string){
        return this.listaCataloghi.filter(c => c.cid === cid)[0]//.pop()
    }

    isCurrentCatalog(/*catalogoId : number*/ cid : string){
        //console.log(this.listaCataloghi)
        //console.log(`utente.ts isCurrentCatalog() \t ${catalogoId} === ${this.listaCataloghi[this.indexCatalogNow].getCurrentId()}`)
        //console.log(`Utente.isCurrentCatalog() ${this.nome} \t esamino: ${catalogoId} == ${this.indexCatalogNow} (selezione utente)`)
        //return catalogoId === this.listaCataloghi[this.indexCatalogNow].getCurrentId();
        //return catalogoId === this.listaCataloghi[this.indexCatalogNow].id

        console.log(`CID: ${cid} === current cid: ${this.getCurrentCatalog_cid().cid} \t is: ${cid === this.getCurrentCatalog_cid().cid}`)
        return cid === this.getCurrentCatalog_cid().cid
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
        this.getCurrentCatalog_cid().listaImmagini = li
        return this
    }

    /**
     *  setta le immagini indicate per il catalogo indicato ==> ! attenzione utilizza campo cid (firebase) e non id vue
     *      - invocato da App.loadImages_ofCatalog()
     */
    setImages_by_cid(images: Immagine[], cid: string){
        //console.log('Utente.setImages_by_cid() cid: ', cid, images)

        /*
        let testImgs : Immagine[] = [ new Immagine('https://firebasestorage.googleapis.com/v0/b/image-toolkit-app.appspot.com/o/immagini%2FDSC04644_ps.jpg?alt=media&token=24724b21-eade-4504-aa54-b62c93db78c4',0),
                                      new Immagine('https://firebasestorage.googleapis.com/v0/b/image-toolkit-app.appspot.com/o/immagini%2FDSC04514_ps.jpg?alt=media&token=002e505b-941d-4a10-a619-0d31a1e6a271',1),
                                      new Immagine('https://firebasestorage.googleapis.com/v0/b/image-toolkit-app.appspot.com/o/immagini%2FDSC04483_ps.jpg?alt=media&token=aa966cbd-b5ae-41a2-a217-15560b7eb862',2),
                                      new Immagine('asdD.jpg',3), 
                                      new Immagine('asdD.jpg',4), 
                                      new Immagine('asdD.jpg',5),
                                    ]
        */
   
        let catalog = this.getCatalog_by_cid(cid)
        catalog ? this.getCatalog_by_cid(cid)!.listaImmagini = images : console.log('utente.setImages_by_cid() Cant find cid: ',cid)
        
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


/*
getCatalogoCurrent() : Catalogo{
    return this.listaCataloghi[this.indexCatalogNow]
}

getIndexCatalogoCurrent(){
    return this.indexCatalogNow
}
*/