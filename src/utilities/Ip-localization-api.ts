/**
 *  due servizi: uno https di produzione e uno di sviluppo http
 *  @return coppia { location, lastIp }
 */
export default async function getLocalizationInfos(){
  return (location.protocol == 'https:') ? ipGeolocationIo() : ipApiCom()
}

/*  
*    https://app.ipgeolocation.io/ 
*        user:   mexato1569@weepm.com
*        psw:    mexato1569
*        limit:  1000req / month
*/
async function ipGeolocationIo(){
  const apiKey = 'f87e60011e4d447190da24faf6c34165'
  const res = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey='+apiKey).then(res => res.json()).catch(ex=>console.log(ex))
  return {location: `${res.country_name} | ${res.district}` , lastIp: `${res.ip}`}
}


async function ipApiCom(){
  const ip_apiReq = `http://ip-api.com/json/?fields=country,city,query` // status,message,countryCode,region,regionName,timezone,isp,org,as,zip,lat,lon
  const res = await fetch(ip_apiReq).then(res => res.json()).catch(ex=>console.log(ex))
  return {location: `${res.country} | ${res.city}` , lastIp: `${res.query}`}
}