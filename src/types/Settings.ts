/**
 *  - TODO: leggere variabili globali app da catalogo readOnly 'appGlobalSettings' da Firestore
 *      - apiKey mail sender
 *      - 
 * 
 */
import { loadReadOnlySettings,sendMailGun } from '@/types/Firebase_settings'
import { read } from 'fs';

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
        return process.env.NODE_ENV==='development' && window.location.hostname!=='pickit.nasbazza.myds.me'
    }

    public isProductionMode(): boolean{
        return process.env.NODE_ENV==='production' && window.location.hostname!=='pickit.nasbazza.myds.me'
    }

    /**
     *  2022 06 20 - viene caricata solo la lista immagini del catalogo corrente
     *      -> TODO: caricare le immagini dei primi N cataloghi
    */
    public count_catalogImagesLoaded() : number{
        return this._number_catalogImagesLoaded
    }
    
    public async getImpostazioni(){
        const impostazioni = await loadReadOnlySettings()
        return impostazioni[0]
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