import {validateTelegramInitData} from "./_telegram-auth.js";
const BOT_TOKEN=process.env.TELEGRAM_BOT_TOKEN;
const PRICES={employee:50,team:150};
async function tg(method,payload){const r=await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});const d=await r.json();if(!d.ok)throw new Error(d.description||"Telegram API error");return d.result}
export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method Not Allowed"});
  try{
    if(!BOT_TOKEN)return res.status(500).json({error:"Missing TELEGRAM_BOT_TOKEN"});
    const {initData,scope,calcId}=req.body||{}; const auth=validateTelegramInitData(initData,BOT_TOKEN);
    if(!auth.ok)return res.status(401).json({error:"Telegram session is invalid"});
    if(!PRICES[scope]||!/^[a-f0-9]{24}$/.test(String(calcId||"")))return res.status(400).json({error:"Invalid calculation"});
    const stars=PRICES[scope],payload=`fbc|${scope}|${calcId}|${stars}`;
    const title=scope==='employee'?"Mitarbeiter-Auswertung":"Team-Auswertung";
    const invoiceLink=await tg("createInvoiceLink",{title,description:"FUTURE Business Cockpit · einmalige Freischaltung des aktuellen Berechnungsstands",payload,currency:"XTR",prices:[{label:title,amount:stars}]});
    return res.status(200).json({invoiceLink,stars,scope,calcId});
  }catch(e){console.error(e);return res.status(500).json({error:String(e.message||e)})}
}
