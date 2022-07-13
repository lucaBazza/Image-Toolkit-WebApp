import { db } from '@/firebase'
import { Buffer } from 'buffer'

/**
 *  ...
 */
const apiKey = '2abe0627e648f2b84679d7bd05576d3c-18e06deb-f0b11713'

const freeDomainName = 'sandbox446e2a0726be4ce59e9c4a982fa29a4d.mailgun.org'
const urlDomainMailGun = `https://api.mailgun.net/v3/${freeDomainName}/messages` //'https://api.mailgun.net/v3/sandbox446e2a0726be4ce59e9c4a982fa29a4d.mailgun.org'

export async function loadReadOnly(){
    let res = await db.collection(`readonly/`)
                        .get().catch((err)=>console.warn('ERROR loadReadOnly()\n',err))
    return res.docs.map(q => q.data())
}

export async function sendMailGun(){
  sendMailGun_fetch('Mailgun Sandbox',
                      'Luca Bazzanella <luca.bazzanella94@gmail.com>',
                      'Hello Zabba Nella',
                      'Congratulations Zabba Nella, you just sent an email with Mailgun!  You are truly awesome!')
}

export async function sendMailGun_fetch(from, to, subject, text){
    const body = new FormData
    body.append("from", `Excited User <mailgun@${freeDomainName}>`)
    body.append("", "\\")
    body.append("to", `Zabba Nella <${to}>`)
    body.append("", "\\")
    body.append("subject", "Hello Zabba Nella")
    body.append("", "\\")
    body.append("text", "Congratulations Zabba Nella, you just sent an email with Mailgun!  You are truly awesome!")

    fetch(urlDomainMailGun, {
      body,
      method: 'POST',
      headers: {
        authorization: 'Basic ' + Buffer.from('api:' + apiKey).toString('base64'),
        content: "multipart/form-data",
        "Access-Control-Allow-Origin" : '*'
      }
    }).then( res => console.log(res)).catch(err => console.log(err))
}



/**
 *  https://app.mailgun.com/app/account/
 *    mail: jasam28522@runfons.com
 *    psw: 9D3vEUxCSmqKf$d
 */
export async function sendMailGun_Node(){
  
  const formData = require('form-data');
  let Mailgun //= require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: '551f92fd14bbc89e87fd11d77238c8da-18e06deb-ff509d9f',
  });
  mg.messages
  .create('sandbox5e3f2c58486c407aa0dfb08e9136a930.mailgun.org', {
    from: "Mailgun Sandbox <postmaster@sandbox5e3f2c58486c407aa0dfb08e9136a930.mailgun.org>",
    to: ["jasam28522@runfons.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomness!",
  })
  .then(msg => console.log(msg))    // logs response data
  .catch(err => console.log(err));  // logs any error`;
  
  
  // You can see a record of this email in your logs: https://app.mailgun.com/app/logs.
  // You can send up to 300 emails/day from this sandbox server.
  // Next, you should add your own domain so you can send 10000 emails/month for free.
}