import crypto from "crypto";
export function validateTelegramInitData(initData, botToken, maxAgeSeconds=86400){
  if(!initData||!botToken)return {ok:false,error:"missing initData"};
  const p=new URLSearchParams(initData),hash=p.get("hash"); if(!hash)return {ok:false,error:"missing hash"};
  p.delete("hash");
  const check=[...p.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join("\n");
  const secret=crypto.createHmac("sha256","WebAppData").update(botToken).digest();
  const expected=crypto.createHmac("sha256",secret).update(check).digest("hex");
  const a=Buffer.from(expected,"hex"),b=Buffer.from(hash,"hex");
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return {ok:false,error:"invalid signature"};
  const auth=Number(p.get("auth_date")||0); if(!auth||Math.abs(Date.now()/1000-auth)>maxAgeSeconds)return {ok:false,error:"expired initData"};
  let user=null; try{user=JSON.parse(p.get("user")||"null")}catch{}
  if(!user?.id)return {ok:false,error:"missing user"};
  return {ok:true,user,params:p};
}
