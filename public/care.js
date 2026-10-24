import {indiaToday,validDate} from './vehicle-data.js';
export const dailyServices=[
 {id:'wash',name:'Daily car wash',rate:79,icon:'wash',types:['car'],copy:'Gentle exterior wash and microfibre dry. Water and safe parking required.'},
 {id:'pressure',name:'Tyre pressure check',rate:19,icon:'tyre',types:['car','bike','scooter','superbike','ev'],copy:'Cold-tyre pressure check and adjustment to your vehicle’s specified pressure.'},
 {id:'glass',name:'Glass cleaning',rate:29,icon:'sparkles',types:['car'],copy:'Exterior windscreen, windows and mirrors. No interior or stain restoration.'}
];
export const careSlots=[['morning','6–9 AM'],['daytime','9 AM–12 PM'],['evening','5–8 PM']];
export function addDays(date,days){return new Date(Date.parse(date+'T00:00:00Z')+days*86400000).toISOString().slice(0,10);}
const ensure=(ok,message)=>{if(!ok)throw new Error(message);};
export function quoteSubscription(input,vehicle,{today=indiaToday()}={}){
 ensure(vehicle,'Choose a saved vehicle.');
 ensure(Array.isArray(input.services)&&input.services.length>0&&input.services.length<=3&&new Set(input.services).size===input.services.length,'Select one or more different daily services.');
 const selected=input.services.map(id=>dailyServices.find(s=>s.id===id));
 ensure(selected.every(s=>s&&s.types.includes(vehicle.type)),'One of these daily services is not available for this vehicle.');
 ensure([7,30].includes(input.duration),'Choose a 7-day trial or a 30-day plan.');
 ensure(['daily','mon-sat'].includes(input.frequency),'Choose every day or Monday–Saturday.');
 ensure(careSlots.some(([id])=>id===input.slot),'Choose a preferred visit window.');
 ensure(validDate(input.startDate)&&input.startDate>today&&input.startDate<=addDays(today,30),'Start from tomorrow, within the next 30 days.');
 const dates=Array.from({length:input.duration},(_,i)=>addDays(input.startDate,i)).filter(d=>input.frequency==='daily'||new Date(d+'T00:00:00Z').getUTCDay()!==0);
 const dailySubtotal=selected.reduce((sum,s)=>sum+s.rate,0),subtotal=dailySubtotal*dates.length,discount=selected.length>=2?Math.round(subtotal*.15):0;
 return {services:selected.map(({id,name,rate})=>({id,name,rate})),visits:dates.length,dates,startDate:input.startDate,endDate:addDays(input.startDate,input.duration-1),duration:input.duration,frequency:input.frequency,slot:input.slot,dailySubtotal,subtotal,discount,total:subtotal-discount,currency:'INR',demo:true};
}
export function subscriptionStatus(plan,today=indiaToday()){
 if(plan.status==='cancelled')return 'Cancelled';
 if(plan.quote.endDate<today)return 'Completed';
 if(plan.status==='paused')return 'Paused';
 return plan.quote.startDate>today?'Scheduled':'Active';
}
