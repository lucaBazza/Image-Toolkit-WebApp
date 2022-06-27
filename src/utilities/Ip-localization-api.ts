/**
 *  ritorna object {location, lastIp}
 */
 export default async function getLocalizationInfos(){
    const ip_apiReq = `http://ip-api.com/json/?fields=country,city,query` // status,message,countryCode,region,regionName,timezone,isp,org,as,zip,lat,lon
    const res = await fetch(ip_apiReq).then(res => res.json()).catch(ex=>console.log(ex))
    return {location: `${res.country} | ${res.city}` , lastIp: `${res.query}`}
  }