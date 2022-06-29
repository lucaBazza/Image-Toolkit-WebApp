///import MD5 from "@/utilities/MD5.js";
///import Catalogo from "./Catalogo";

export default class Settings{

    static instance: Settings
    private _urlImageServer: string;
    private _number_catalogImagesLoaded: number
    
    /**
     *     singleton pattern: private prevent use of of new
     */
    private constructor(){
        this._urlImageServer = new String(window.location.protocol +"//"+window.location.hostname+":3000") as string
        this._number_catalogImagesLoaded = 2
    }

    static getInstance(){
        if(!Settings.instance)
            Settings.instance = new Settings()
        return Settings.instance
    }

    public get urlImageServer(): string {
        return this._urlImageServer;
    }

    public isDevelopMode(): boolean{
        return process.env.NODE_ENV==='development'
    }

    public isProductionMode(): boolean{
        return process.env.NODE_ENV==='production'
    }

    /**
     *  2022 06 20 - viene caricata solo la lista immagini del catalogo corrente
     *      -> TODO: caricare le immagini dei primi N cataloghi
    */
    public count_catalogImagesLoaded() : number{
        return this._number_catalogImagesLoaded
    }
    
}


/*
//keepLogged: boolean

isKeepLogged():boolean{
    return this.keepLogged
}

setKeepLogin(isKeepingLog: boolean){
    this.keepLogged = isKeepingLog
}
*/