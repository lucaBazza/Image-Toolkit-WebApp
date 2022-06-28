import Utente from "../types/Utente"
import Catalogo from "../types/Catalogo"
import Settings from "@/types/Settings"
import axios from 'axios'

var isReacheable = false;


// https://www.vuemastery.com/blog/mock-service-worker-api-mocking-for-vuejs-development-testing/

// https://javascript.info/fetch-crossorigin
export default async function FetchUser(user, password, secretKey) : Promise<Utente>{
      console.log("FetchUser()")
      var helpUser = new Utente(''/*,'',''*/);
      const urlRequest = Settings.getInstance().urlImageServer + "/user";

        // CONTROLLI INIZIALI
      if ( ! window.fetch )
        throw new Error('getUserFromServer() - non ho la funzione window.fetch') 

      if( ! window.navigator.onLine )
        throw new Error('navigator.onLine siamo offline')

      const preFetchResponse = await sendRequest(urlRequest) as XMLHttpRequest 
      if( ! serverReachable(preFetchResponse) )
        return helpUser
      
        // PREPARO LA FETCH HEADER + BODY + HANDLE RESPONSE
      const requestOptions = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          //'mode': 'cors', //'Access-Control-Allow-Origin': '*', 
        },
        body: JSON.stringify({
          utente: user,
          password: password,
          secretKey: secretKey
        })
      }

      const handleResponseToJSON = (response)=>{
        if( ! response.ok ) 
          return Promise.reject({ status: response.status, statusText: response.statusText }) //throw new Error('something went wrong!')

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json'))
          throw new Error("Oops, we haven't got JSON!");

        return response.json();
      }

      const handleFetchErrors = (err)=>{ console.log(`Error fetching /user: \t ${err.message}`); return null; }

      
      // https://stackoverflow.com/questions/71681442/catch-fetch-err-connection-refused
      const data = await fetch(urlRequest, requestOptions)
                            .then(handleResponseToJSON)
                            .then(dataJson => { return dataJson })
                            .catch(handleFetchErrors)
      
      if( ! data ) 
        return helpUser

        // CREO UTENTE DA RESPONSE
      const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo /*, cat.secretKey*/ ))
      helpUser = new Utente(data.nome/*, data.password, helpListaCat*/ ).setEmail(data.email).setListaCataloghi(helpListaCat)
      
      // TODO: metodo obsoleto, non usare id ma Catalog ID di firebase
      //helpUser.setCurrentCatalog(data.indexCatalogNow)     

      return helpUser
}


// attenzione: nonostante viene indicato come stato 0 (non definito) in prima lettura, poi va 
async function sendRequest(url : string) {
  const Http = new XMLHttpRequest(); //const url='http://localhost:8000/';
  Http.onerror = (e)=>{ return false };
  Http.ontimeout = ()=>{ return false };
  Http.timeout = 2000;
  Http.open("POST", url)

  Http.send()

  if (Http.readyState === XMLHttpRequest.DONE)
      return Http;

  let res;
  const p = new Promise((r) => res = r);
  Http.onreadystatechange = () => {
      if (Http.readyState === XMLHttpRequest.DONE)
          res(Http);
  }
  
  return p;
}


function serverReachable(preFetchResponse: XMLHttpRequest) :boolean {
  const preStatus = preFetchResponse.status;
  isReacheable = preStatus !== 0 || (preStatus >= 200 && preStatus < 400)
  console.log("server isReacheable ? " + isReacheable)
  return isReacheable
}


function serverReachableAXIOS(urlRequest: string) : boolean{
      console.log('now: axios.get() ' + urlRequest )
      try{
      axios.get(urlRequest, {})
        .then((response) => { console.log(response); return true; } )
        .catch((error) => {return false } );   
      }
      catch (err){console.log(err)}

      return false;
}


/*

export default async function FetchUser(user, password, secretKey) : Promise<Utente>{
  try {
      const response = await fetch(urlRequest,{ mode: 'cors', headers: { 'Access-Control-Allow-Origin':'*' } } )
      const data = await response.json();
      console.log(data);  //const { userId, id, title, completed } = data;
  } catch(err) {
    console.log('asdffff') //alert(err)
  }*/


/*
fetch(urlRequest).then((response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error('Something went wrong');
  })
  .then((responseJson) => {
    // Do something with the response
  })
  .catch((error) => {
    console.log(error)
  });
}


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


     /*

      function isonlineB(uri: string) :boolean {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            //if (this.readyState == 4 && this.status == 200) {
            //   console.log( xhttp.responseText );
            //}
            return (this.readyState == 4 && this.status == 200)
        };
        // Error Handling:
        xhttp.onerror = function(error){ return false  }  //console.error( error );
        xhttp.open("GET", uri, true);
        try{
        xhttp.send();
      }
      catch(err){
        return false
      
      }
      return */
      
      /*
      function isonline(uri) {
        //var uri = 'MYURL'
        var xhr = new XMLHttpRequest();
        try{
          xhr.open("GET",uri,false);
          xhr.send(null);
          //if(xhr.status == 200) { return true; }
          //else {
          //    //is offline
          //    return null;
          //}
          return xhr.status == 200
        }
        catch(err){ console.log(err); return false; }
      }
      
    }
    */


    /*
function checkServer(url : string, timeout: number) {
  const controller = new AbortController();
  const signal = controller.signal;
  const options = { mode: 'no-cors', signal };
  return fetch(url, options)
    .then(setTimeout(() => { controller.abort() }, timeout))
    .then(response => console.log('Check server response:', response.statusText))
    .catch(error => console.error('Check server error:', error.message));
}
*/

/*
//event naviagor.onLine isn't fiable.
function serverReachable() {
  // IE vs. standard XHR creation
  var x = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" ), s;
  x.open(
    // requesting the headers is faster, and just enough
    "HEAD",
    // append a random string to the current hostname,
    // to make sure we're not hitting the cache
    "//" + window.location.hostname + "/?rand=" + Math.random(),
    // make a synchronous request
    false
  );
  try {
    x.send();
    s = x.status;
    // Make sure the server is reachable
    return ( s >= 200 && s < 300 || s === 304 );
  // catch network & other problems
  } catch (e) {
    return false;
  }
}
*/


/*
function serverReachable(preFetchResponse: XMLHttpRequest) :boolean {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
      if (xhr.readyState === 4) //if complete
        return (this.readyState == 4 && this.status == 200)
  }
  try{
    xhr.open('POST', uri, true);
    return true
  }
  catch(err){ return false }
}
*/