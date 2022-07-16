import Catalogo from "./Catalogo"
import Immagine from "./Immagine"

export type user_plan = 'free'|'photography'|'direction'|'full';

export default class Utente{

    private static instance: Utente;

    nome: string
    email?: string
    uid: string
    password?: string
    secretKey?: string
    listaCataloghi: Catalogo[]
    photoURL?: string
    selected_cid?: string

    // selected_imgId?: string     // dato temporaneo per sapere quale immagine va visuaizz

    // parametri che salvo su firebase ( oltre a uid e selected catalog id )
    subscription_date?: Date
    lastLogin?: Date
    allowNotifications? : boolean
    active_plan?: user_plan
    watermark_src?: string
    public_gallery?: string
    lastIp?: string
    location?: string

    /**
     *      di default se l'utente ha più cataloghi vado a selezionare il primo
     */
    private constructor(nome: string){
        this.nome = nome
        this.listaCataloghi = []
        this.uid = ''
    }

    public static getInstance(){
        return this.instance || (this.instance = new this('undefined user'))
    }

    public static newInstance(){
        return (this.instance = new this('undefined user').setListaCataloghi([]) )
    }

    setNome(nome: string){
        this.nome = nome
        return this
    }

    setEmail(email: string){
        this.email = email
        return this;
    }

    setListaCataloghi(cats: Catalogo[]){
        this.listaCataloghi = cats
        return this
    }

    addListaCataloghi(cats: Catalogo[]){
        this.listaCataloghi = [...this.listaCataloghi, ...cats]
        return this
    }

    getListaCataloghi(): Catalogo[]{
        return this.listaCataloghi
    }

    /**
     *  restituisce il catalogo selezionato:
     *      -se non settato, lo setta come primo catalogo disponibile, altrimenti restituisce undefined
     */
    getCurrentCatalog_cid() : Catalogo | undefined {
        if( this.listaCataloghi.length == 0){ 
            console.log(`No catalogs inserted for ${this.nome}`); return undefined; } //throw new Error(`No catalogs aviable for ${this.nome}`)

        let findSelected = this.listaCataloghi.find(c => c.cid === this.selected_cid)
        if(findSelected)
            return findSelected

        return ( this.listaCataloghi.length > 0 ) ? this.listaCataloghi[0] :  undefined
            
        //let firstAviable = this.getCatalog_by_cid( this.selectFirstAviableCatalog().selected_cid! )
        //if( ! firstAviable ){
        //    console.log('No catalogs inserted')}
        //return out ? out : this.getCatalog_by_cid( this.selectFirstAviableCatalog().selected_cid! )
    }

    /**
     *  metoodo complementare a getCurrentCatalog_cid() da usare quando si è sicuri che è presente un catalogo
     */
    getTheCatalog() : Catalogo { return this.listaCataloghi.find(c => c.cid === this.selected_cid)! }
    
    getCatalog_by_cid(cid : string){
        const cat = this.listaCataloghi.find(c => c.cid === cid)
        if( ! cat )
            console.log(`getCatalog_by_cid() not found catalog with cid: ${cid}`)
        return cat ? cat : null
    }

    getCid(){
        return this.selected_cid ? this.selected_cid : '' 
    }

    selectFirstAviableCatalog(){
        if( this.listaCataloghi.length < 1 ){ console.log('selectFirstAviableCatalog() \t no catalogs aviable'); return this; }
        this.selected_cid = this.listaCataloghi[0].cid
        return this
    }

    setSelected_cid(cid: string){
        this.selected_cid = cid
        return this
    }

    isCurrentCatalog(cid : string){
        //console.log(`CID: ${cid} === current cid: ${this.getCurrentCatalog_cid().cid} \t is: ${cid === this.getCurrentCatalog_cid().cid}`)
        return cid === this.getCurrentCatalog_cid()!.cid
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
        this.getCurrentCatalog_cid()!.listaImmagini = li
        return this
    }

    /**
     *  setta le immagini indicate per il catalogo indicato ==> ! attenzione utilizza campo cid (firebase) e non id vue
     *      - invocato da App.loadImages_ofCatalog()
     */
    setImages_by_cid(images: Immagine[], cid: string){
        this.getCatalog_by_cid(cid) ? this.getCatalog_by_cid(cid)!.listaImmagini = images : console.log('utente.setImages_by_cid() Cant find cid: ',cid)
        return this
    }


    /**
     *  campi 🔥 utentiprefs
     */
    setSubscription_date(date : any){
        this.subscription_date = date
        return this
    }
    
    setLastLogin(date : any){
        this.lastLogin = date
        return this
    }

    setAllowNotifications(allow: boolean){
        this.allowNotifications = allow
        return this
    }

    setActive_plan(plan :user_plan){
        this.active_plan = plan
        return this
    }

    setLastIp(ip: string){
        this.lastIp = ip
        return this
    }

    setLocation(loc: string){
        this.location = loc
        return this
    }


    /** 
     *  UTILS
     */
    getCataloghi_NON_sel(): Catalogo[]{
        if( 2 > this.listaCataloghi.length) return []
        return this.listaCataloghi.filter(c => c.cid != this.selected_cid)
    }

    getDatiUtente(){
        return `
                nome: ${this.nome}\n
                email: ${this.email}\n 
                uid: ${this.uid} \n
                password: ${this.password}\n 
                ip: ${this.lastIp}\n 
                location: ${this.location}\n
                photoUrl: ${this.photoURL}\n
                selected cid: ${this.selected_cid}\n
                watermark: ${this.watermark_src}\n
                plan: ${this.active_plan}\n
                public gallery: ${this.public_gallery}\n
                cataloghi: ${this.listaCataloghi.map(c=>` ${c.titolo}`)}\n
                allow notifications: ${this.allowNotifications}
            `
    }
}