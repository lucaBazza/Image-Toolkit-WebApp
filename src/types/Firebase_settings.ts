import { IMPOSTAZIONI_COL } from '@/types/FirebaseModel'
import { db } from '@/firebase'
import { Buffer } from 'buffer'

export async function loadReadOnlySettings(){
    let res = await db.collection(`${IMPOSTAZIONI_COL}/`)
                        .get().catch((err)=>console.warn('ERROR loadReadOnlySettings()\n',err))
    return res.docs.map(q => q.data())
}

export async function sendMailGun(){
  sendMailGun_fetch('Mailgun Sandbox',
                      'Luca Bazzanella <luca.bazzanella94@gmail.com>',
                      'Hello Zabba Nella',
                      'Congratulations Zabba Nella, you just sent an email with Mailgun!  You are truly awesome!')
}

const apiKey_mailGun = ''
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
        authorization: 'Basic ' + Buffer.from('api:' + apiKey_mailGun).toString('base64'),
        content: "multipart/form-data",
        "Access-Control-Allow-Origin" : '*'
      }
    }).then( res => console.log(res)).catch(err => console.log(err))
}


const freeDomainName = 'sandbox446e2a0726be4ce59e9c4a982fa29a4d.mailgun.org'
const urlDomainMailGun = `https://api.mailgun.net/v3/${freeDomainName}/messages` //'https://api.mailgun.net/v3/sandbox446e2a0726be4ce59e9c4a982fa29a4d.mailgun.org'
export async function sendMailGun_Node(){
  
  const formData = require('form-data');
  let Mailgun //= require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api',key: apiKey_mailGun });
  mg.messages
  .create('sandbox5e3f2c58486c407aa0dfb08e9136a930.mailgun.org', {
    from: "Mailgun Sandbox <postmaster@sandbox5e3f2c58486c407aa0dfb08e9136a930.mailgun.org>",
    to: ["1234@runfons.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomness!",
  })
  .then(msg => console.log(msg))    // logs response data
  .catch(err => console.log(err));  // logs any error`;
  
  
  // You can see a record of this email in your logs: https://app.mailgun.com/app/logs.
  // You can send up to 300 emails/day from this sandbox server.
  // Next, you should add your own domain so you can send 10000 emails/month for free.
}

export async function sendMail_sendgrid(from, to, subject, text, apiKey_sendgrid){
  const sendGrid_url = 'https://api.sendgrid.com/v3/mail/send'
  console.log('sendMail_sendgrid() \t', apiKey_sendgrid)
  fetch(sendGrid_url, { 
    headers: {
      mode: 'no-cors',
      method: 'post',
        'Authorization': `Bearer ${apiKey_sendgrid}`,
        'Content-Type': 'application/json',
        'Origin': '',
        body: '{"personalizations": [{"to": [{"email": "luca.bazzanella94@gmail.com"}]}],"from": {"email": "test@example.com"},"subject": "Sending with SendGrid is Fun","content": [{"type": "text/plain", "value": "and easy to do anywhere, even with cURL"}]}'
      }
    })

}