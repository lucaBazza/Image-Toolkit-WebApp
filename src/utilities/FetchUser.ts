import Utente from "../types/Utente"
import Catalogo from "../types/Catalogo"
import Settings from "@/types/Settings"

export default async function FetchUser(user, password, secretKey) : Promise<Utente>{
      console.log("getUserFromServer()")
      
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utente: user,
          password: password,
          secretKey: secretKey
        })
      }

      const res = await fetch(Settings.getInstance().urlImageServer+"/user", requestOptions)
                          .then(response => response.json())
                          .then(data => {
                            //console.log('Success:', data);
                            return data
                          })
                          .catch((error) => {
                            console.error('Error fetching /user: \n', error)  //return null;
                          }) 

      //if (!res.ok) {
      //  return null //throw new Error(`HTTP error! status: ${res.status}`);
      //}
      const data = res
      if( !data ) return new Utente('','','') //if( !res.ok) return null

      const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo, cat.secretKey ))
      const helpUser : Utente = new Utente(data.nome, data.password, helpListaCat ).setEmail(data.email)
      helpUser.setCurrentCatalog(data.indexCatalogNow)     

      return helpUser

  /*
      const response = await fetch(this.settings.urlImageServer+"/user", requestOptions)
                              .then(async (response) => {
                                  const isJson = response.headers.get("content-type")?.includes("application/json");
                                  if( ! isJson ){
                                    console.log('API /user has not JSON response')
                                    return Promise.reject('API /user has not JSON response')
                                  }

                                  if ( ! response.ok ) {
                                    //const error = (data && data.message) || response.status;
                                    //console.log('API /user ! response.ok')
                                    return Promise.reject(response.status);
                                  }
                                  return response.json();
                              })
                              .catch((err) => {
                                //console.log(`Server api ${this.settings.urlImageServer} is down 😭`);
                                throw new Error(`Server api ${Settings.getInstance().urlImageServer} is down 😭 \n ${err}`);
                              });

        if( ! response )
          return null 
      //try{
          const data  =  await response.json();
          const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo, cat.secretKey ))
          const helpUser : Utente = new Utente(data.nome, data.password, helpListaCat ).setEmail(data.email)
          helpUser.setCurrentCatalog(data.indexCatalogNow)
          return helpUser
      //}
      //catch(ex){
        //console.log(ex);
        //return null; ///new Utente('','',[])
      //}
*/
      //const data = await response;
      //if( ! data ){ console.log("getUserFromServer() has no data"); return; }
      /*
      const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo, cat.secretKey ))
      const helpUser : Utente = new Utente(data.nome, data.password, helpListaCat ).setEmail(data.email)
      helpUser.setCurrentCatalog(data.indexCatalogNow)
      return helpUser
      */
}