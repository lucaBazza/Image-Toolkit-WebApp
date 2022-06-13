import MD5 from "@/utilities/MD5.js";
import Catalogo from "./Catalogo";

export default class Settings{

    static instance: Settings

    keepLogged: boolean
    private _urlImageServer: string;

    
    /**
     *     singleton pattern: private prevent use of of new
     */
    private constructor(){
        //console.log("Settings constructor() called")
        this.keepLogged = true
        this._urlImageServer = new String(window.location.protocol +"//"+window.location.hostname+":3000") as string
    }

    static getInstance(){
        if(!Settings.instance)
            Settings.instance = new Settings()
        return Settings.instance
    }
    
    isKeepLogged():boolean{
        return this.keepLogged
    }

    setKeepLogin(isKeepingLog: boolean){
        this.keepLogged = isKeepingLog
    }

    public get urlImageServer(): string {
        return this._urlImageServer;
    }

    public isDevelopMode(): boolean{
        return process.env.NODE_ENV=='development'
    }

    
}