const URL=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL||"";
const TOKEN=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN||"";
async function cmd(path){if(!URL||!TOKEN)throw new Error("Payment store is not configured");const r=await fetch(`${URL}${path}`,{headers:{Authorization:`Bearer ${TOKEN}`}});const d=await r.json();if(!r.ok||d.error)throw new Error(d.error||"Payment store error");return d.result}
export const entitlementKey=(uid,scope,calcId)=>`fbc:paid:${uid}:${scope}:${calcId}`;
export async function setEntitlement(uid,scope,calcId,data){return cmd(`/set/${encodeURIComponent(entitlementKey(uid,scope,calcId))}/${encodeURIComponent(JSON.stringify(data))}`)}
export async function getEntitlement(uid,scope,calcId){const v=await cmd(`/get/${encodeURIComponent(entitlementKey(uid,scope,calcId))}`);if(!v)return null;try{return JSON.parse(v)}catch{return v}}
export async function setCharge(chargeId,data){return cmd(`/set/${encodeURIComponent('fbc:charge:'+chargeId)}/${encodeURIComponent(JSON.stringify(data))}`)}
