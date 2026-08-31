import {validateTelegramInitData} from "./_telegram-auth.js";
import {getEntitlement} from "./_payment-store.js";
const BOT_TOKEN=process.env.TELEGRAM_BOT_TOKEN;
export default async function handler(req,res){if(req.method!=="POST")return res.status(405).json({error:"Method Not Allowed"});try{const {initData,scope,calcId}=req.body||{};const auth=validateTelegramInitData(initData,BOT_TOKEN);if(!auth.ok)return res.status(401).json({paid:false});if(!['employee','team'].includes(scope)||!/^[a-f0-9]{24}$/.test(String(calcId||'')))return res.status(400).json({paid:false});const data=await getEntitlement(auth.user.id,scope,calcId);return res.status(200).json({paid:!!data,scope,calcId});}catch(e){console.error(e);return res.status(500).json({paid:false,error:"status unavailable"})}}
