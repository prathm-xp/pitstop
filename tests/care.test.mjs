import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../server.mjs';
import {quoteSubscription,addDays,subscriptionStatus} from '../public/care.js';
import {indiaToday} from '../public/vehicle-data.js';
import {vehicleSignature} from '../public/commerce.js';
const car={id:'car',type:'car',brand:'Hyundai',model:'i20',year:2022,fuelType:'petrol',number:'KA02AB5678'};
const options={vehicleId:'car',services:['wash','pressure','glass'],duration:7,frequency:'mon-sat',slot:'morning',startDate:'2026-10-20'};
test('daily care counts scheduled visits, calendar boundaries and bundle pricing',()=>{
 const q=quoteSubscription({...options,total:1},car,{today:'2026-10-19'});assert.equal(q.visits,6);assert.equal(q.endDate,'2026-10-26');assert.equal(q.subtotal,762);assert.equal(q.discount,114);assert.equal(q.total,648);assert(!q.dates.includes('2026-10-25'));
 const single=quoteSubscription({...options,services:['pressure'],frequency:'daily',duration:30},car,{today:'2026-10-19'});assert.equal(single.visits,30);assert.equal(single.total,570);assert.equal(single.discount,0);assert.equal(single.endDate,'2026-11-18');
 assert.equal(addDays('2028-02-28',1),'2028-02-29');assert.equal(addDays('2026-12-31',1),'2027-01-01');
});
test('daily care validates vehicle eligibility, services, dates and scheduling choices',()=>{
 const quote=input=>quoteSubscription({...options,...input},car,{today:'2026-10-19'});
 for(const input of [{services:[]},{services:['wash','wash']},{services:['repair']},{duration:365},{duration:'7'},{frequency:'weekly'},{slot:'midnight'},{startDate:'2026-10-19'},{startDate:'2026-11-20'},{startDate:'2026-02-30'}])assert.throws(()=>quote(input));
 assert.throws(()=>quoteSubscription(options,{type:'bike'},{today:'2026-10-19'}),/not available/);
 assert.equal(quoteSubscription({...options,services:['pressure']},{type:'bike'},{today:'2026-10-19'}).total,114);
});
test('subscription status distinguishes scheduled, paused, completed and cancelled plans',()=>{
 const plan={status:'active',quote:{startDate:'2026-10-20',endDate:'2026-10-26'}};
 assert.equal(subscriptionStatus(plan,'2026-10-19'),'Scheduled');assert.equal(subscriptionStatus(plan,'2026-10-20'),'Active');assert.equal(subscriptionStatus({...plan,status:'paused'},'2026-10-20'),'Paused');assert.equal(subscriptionStatus({...plan,status:'paused'},'2026-10-27'),'Completed');assert.equal(subscriptionStatus({...plan,status:'cancelled'},'2026-10-27'),'Cancelled');
});
test('daily care API persists authoritative plans and reversible pause/resume states',async t=>{
 const dataDir=mkdtempSync(path.join(tmpdir(),'pitstop-care-')),server=createApp({dataDir});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));rmSync(dataDir,{recursive:true,force:true});});
 const request=async(route,method='GET',body)=>{const response=await fetch(base+route,{method,headers:method==='GET'?{}:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};};
 const saved=await request('/api/vehicles','POST',car);assert.equal(saved.status,201);const vehicle=saved.data;
 const body={...options,vehicleId:vehicle.id,vehicleSignature:vehicleSignature(vehicle),startDate:addDays(indiaToday(),1),addressId:'home',name:'Demo Rider',phone:'9876543210',demoConsent:true,total:1};let plan;
 await t.test('rejects missing consent, changed identity, invalid contact and incompatible services',async()=>{
  for(const patch of [{demoConsent:false},{vehicleSignature:'old'},{phone:'123'},{addressId:'missing'},{services:['wash','unknown']},{vehicleId:'activa'}])assert.equal((await request('/api/subscriptions','POST',{...body,...patch})).status,400);
 });
 await t.test('quotes selected services and stores snapshots without recurring payments',async()=>{
  const quote=await request('/api/subscriptions/quote','POST',body);assert.equal(quote.status,200);
  const result=await request('/api/subscriptions','POST',body);assert.equal(result.status,201);plan=result.data;assert.deepEqual(plan.quote,quote.data);assert.notEqual(plan.quote.total,1);assert.equal(plan.autoRenew,false);assert.equal(plan.status,'active');assert.equal(plan.customer.name,'Demo Rider');assert.equal(plan.quote.services.length,3);
 });
 await t.test('rejects overlapping services and supports pause, resume and cancellation',async()=>{
  assert.equal((await request('/api/subscriptions','POST',body)).status,400);
  for(const status of ['paused','active','cancelled']){const result=await request(`/api/subscriptions/${plan.id}/status`,'PUT',{status});assert.equal(result.status,200);assert.equal(result.data.status,status);assert.equal(result.data.quote.endDate,plan.quote.endDate);}
  assert.equal((await request(`/api/subscriptions/${plan.id}/status`,'PUT',{status:'active'})).status,400);assert.equal((await request('/api/subscriptions/missing/status','PUT',{status:'paused'})).status,400);
 });
 await t.test('retains plan snapshots after vehicle edits and server reopening',async()=>{
  assert.equal((await request('/api/vehicles/'+vehicle.id,'PUT',{...car,model:'Venue',year:2023})).status,200);
  const second=createApp({dataDir});await new Promise(resolve=>second.listen(0,'127.0.0.1',resolve));try{const state=await (await fetch(`http://127.0.0.1:${second.address().port}/api/state`)).json(),stored=state.subscriptions.find(p=>p.id===plan.id);assert.equal(stored.vehicle.model,'i20');assert.equal(stored.vehicle.year,2022);assert.equal(stored.status,'cancelled');assert.equal(stored.history.length,4);assert.equal(stored.quote.total,plan.quote.total);}finally{await new Promise(resolve=>second.close(resolve));}
 });
});
