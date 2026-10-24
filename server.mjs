import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { services, vehicleTypes } from './public/catalog.js';
import {validateIdentity,validateDocuments,validateChallan} from './vehicle-records.mjs';
import {parts,quoteCommerce,specialized,defaultOptions,vehicleSignature} from './public/commerce.js';
import {quoteSubscription,subscriptionStatus} from './public/care.js';

const root=path.dirname(fileURLToPath(import.meta.url));
const text=(value,max=200)=>typeof value==='string'?value.trim().slice(0,max):'';
const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const stages=['confirmed','assigned','enroute','arrived','in_progress','completed'];
const cities=['Bengaluru','Mumbai','Delhi','Hyderabad','Chennai','Pune'];
export function createApp({dataDir=path.join(root,'data')}={}) {
  mkdirSync(dataDir,{recursive:true});
  const dbFile=path.join(dataDir,'store.json');
  if(!existsSync(dbFile)) writeFileSync(dbFile,JSON.stringify({profile:{name:'',phone:''},addresses:[{id:'home',label:'Home',line:'12, 3rd Cross, Indiranagar',area:'Indiranagar',city:'Bengaluru',pin:'560038',landmark:''}],vehicles:[{id:'activa',type:'scooter',brand:'Honda',model:'Activa 6G',number:''}],orders:[]},null,2));
  const read=()=>JSON.parse(readFileSync(dbFile,'utf8'));
  const save=db=>{writeFileSync(dbFile+'.tmp',JSON.stringify(db,null,2));renameSync(dbFile+'.tmp',dbFile);};
  return http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
    try {
      const url=new URL(req.url,'http://localhost');
      if(url.pathname.startsWith('/api/')) {
        if(req.headers.origin && req.headers.origin!==`http://${req.headers.host}`) return json(403,{error:'This local app only accepts requests from its own page.'});
        let body={};
        if(req.method!=='GET') {
          assert(req.headers['content-type']?.startsWith('application/json'),'Please send JSON data.');
          let raw=''; for await(const chunk of req) { raw+=chunk;assert(raw.length<50000,'Request is too large.'); }
          body=raw?JSON.parse(raw):{};
        }
        const db=read(), route=url.pathname, method=req.method;
        if(method==='GET' && route==='/api/state') return json(200,{...db,demo:true,cities});
        if(method==='GET' && route==='/api/catalog') return json(200,{services,vehicleTypes});
        if(method==='GET' && route==='/api/parts')return json(200,{parts,demo:true,liveStock:false,verifiedFitment:false});
        if(method==='POST' && route==='/api/quote')return json(200,quoteCommerce(body.items,db.vehicles,text(body.coupon,20)));
        if(method==='POST' && route==='/api/subscriptions/quote')return json(200,quoteSubscription(body,db.vehicles.find(v=>v.id===body.vehicleId)));
        if(method==='POST' && route==='/api/subscriptions'){
          const vehicle=db.vehicles.find(v=>v.id===body.vehicleId),address=db.addresses.find(a=>a.id===body.addressId);
          assert(vehicle,'Choose a saved vehicle.');assert(address,'Choose a saved address.');
          assert(body.vehicleSignature===vehicleSignature(vehicle),'Vehicle details changed. Review your subscription configuration.');
          assert(body.demoConsent===true,'Confirm that this is a demo subscription.');
          const name=text(body.name,60),phone=text(body.phone,10);
          assert(name.length>=2,'Enter your name (at least 2 characters).');assert(/^[6-9]\d{9}$/.test(phone),'Enter a valid 10-digit Indian mobile number.');
          const quote=quoteSubscription(body,vehicle);db.subscriptions||=[];
          assert(db.subscriptions.length<100,'You can save up to 100 daily care plans.');
          assert(!db.subscriptions.some(p=>p.vehicle.id===vehicle.id&&!['Cancelled','Completed'].includes(subscriptionStatus(p))&&p.quote.services.some(s=>quote.services.some(next=>next.id===s.id))&&p.quote.dates.some(d=>quote.dates.includes(d))),'An overlapping plan already includes this service for this vehicle. Cancel the existing plan or choose other dates.');
          const plan={id:'PC-'+randomUUID().slice(0,8).toUpperCase(),createdAt:new Date().toISOString(),status:'active',vehicle:{...vehicle},address:{...address},customer:{name,phone},quote,notes:text(body.notes,500),payment:'No payment collected · local demo',autoRenew:false,history:[{status:'active',at:new Date().toISOString()}]};
          db.subscriptions.unshift(plan);db.profile={name,phone};save(db);return json(201,plan);
        }
        const subscriptionMatch=route.match(/^\/api\/subscriptions\/([^/]+)\/status$/);
        if(method==='PUT'&&subscriptionMatch){
          const plan=db.subscriptions?.find(p=>p.id===subscriptionMatch[1]);assert(plan,'Daily care plan not found.');
          assert(!['Completed','Cancelled'].includes(subscriptionStatus(plan)),'This daily care plan has ended.');
          assert(['active','paused','cancelled'].includes(body.status)&&body.status!==plan.status,'Choose a different valid plan status.');
          plan.status=body.status;plan.history.push({status:plan.status,at:new Date().toISOString()});save(db);return json(200,plan);
        }
        if(method==='POST' && route==='/api/part-requests'){
          const vehicle=db.vehicles.find(v=>v.id===body.vehicleId);assert(vehicle,'Choose a saved vehicle.');
          const partName=text(body.partName,120),partNumber=text(body.partNumber,64),notes=text(body.notes,500),referenceUrl=text(body.referenceUrl,500);
          if(referenceUrl){let reference;try{reference=new URL(referenceUrl);}catch{throw new Error('Enter a valid catalogue link.');}assert(reference.protocol==='https:'&&!reference.username&&!reference.password,'Use an HTTPS catalogue link without login details.');}
          assert(partName.length>=3,'Describe the part or accessory you need.');assert(['delivery','installation'].includes(body.fulfillment),'Choose a fulfilment option.');
          db.partRequests||=[];assert(db.partRequests.length<100,'You can save up to 100 sourcing requests.');
          const request={id:'PR-'+randomUUID().slice(0,8).toUpperCase(),createdAt:new Date().toISOString(),status:'awaiting_sourcing',vehicle:{id:vehicle.id,type:vehicle.type,brand:vehicle.brand,model:vehicle.model,year:vehicle.year||null,number:vehicle.number||''},partName,partNumber,notes,referenceUrl,fulfillment:body.fulfillment,source:'local-demo',quotedPrice:null};
          db.partRequests.unshift(request);save(db);return json(201,request);
        }
        if(method==='PUT' && route==='/api/profile') {
          const name=text(body.name,60),phone=text(body.phone,10);
          assert(name.length>=2,'Enter your name (at least 2 characters).');
          assert(/^[6-9]\d{9}$/.test(phone),'Enter a valid 10-digit Indian mobile number.');
          db.profile={name,phone};save(db);return json(200,db.profile);
        }
        if((method==='POST' && route==='/api/addresses') || (method==='PUT' && /^\/api\/addresses\/[^/]+$/.test(route))) {
          const existing=method==='PUT'?db.addresses.find(a=>a.id===route.split('/').pop()):null;
          assert(method!=='PUT'||existing,'Address not found.');
          const address={id:existing?.id||randomUUID(),label:text(body.label,30)||'Home',line:text(body.line,180),area:text(body.area,80),city:text(body.city,40),pin:text(body.pin,6),landmark:text(body.landmark,120)};
          assert(address.line.length>=5,'Enter your house or building and street.');assert(address.area.length>=2,'Enter your locality.');
          assert(cities.includes(address.city),'Choose one of the demo service cities.');assert(/^[1-9]\d{5}$/.test(address.pin),'Enter a valid 6-digit PIN code.');
          assert(existing||db.addresses.length<15,'You can save up to 15 addresses.');if(existing)db.addresses=db.addresses.map(a=>a.id===existing.id?address:a);else db.addresses.push(address);save(db);return json(existing?200:201,address);
        }
        if(method==='DELETE' && route.startsWith('/api/addresses/')) {
          const id=route.split('/').pop();assert(db.addresses.some(a=>a.id===id),'Address not found.');db.addresses=db.addresses.filter(a=>a.id!==id);save(db);return json(200,{ok:true});
        }
        if((method==='POST' && route==='/api/vehicles') || (method==='PUT' && /^\/api\/vehicles\/[^/]+$/.test(route))) {
          const existing=method==='PUT'?db.vehicles.find(v=>v.id===route.split('/').pop()):null;
          assert(method!=='PUT'||existing,'Vehicle not found.');
          const vehicle=validateIdentity(body,existing,db.vehicles);
          assert(existing||db.vehicles.length<15,'You can save up to 15 vehicles.');if(existing)db.vehicles=db.vehicles.map(v=>v.id===existing.id?vehicle:v);else db.vehicles.push(vehicle);save(db);return json(existing?200:201,vehicle);
        }
        const documentMatch=route.match(/^\/api\/vehicles\/([^/]+)\/documents$/);
        if(method==='PUT'&&documentMatch){
          const vehicle=db.vehicles.find(v=>v.id===documentMatch[1]);assert(vehicle,'Vehicle not found.');
          vehicle.documents=validateDocuments(body,vehicle.documents);save(db);return json(200,vehicle);
        }
        const challanMatch=route.match(/^\/api\/vehicles\/([^/]+)\/challans(?:\/([^/]+))?$/);
        if(challanMatch&&['POST','PUT','DELETE'].includes(method)){
          const vehicle=db.vehicles.find(v=>v.id===challanMatch[1]);assert(vehicle,'Vehicle not found.');
          const records=vehicle.challans||[],challanId=challanMatch[2],existing=records.find(c=>c.id===challanId);
          assert(method==='POST'?!challanId:existing,method==='POST'?'Use the challan collection to add a record.':'Challan record not found.');
          if(method==='DELETE'){vehicle.challans=records.filter(c=>c.id!==challanId);save(db);return json(200,vehicle);}
          assert(existing||records.length<100,'You can save up to 100 challans per vehicle.');
          const challan=validateChallan(body,existing,records);
          vehicle.challans=existing?records.map(c=>c.id===existing.id?challan:c):[challan,...records];
          save(db);return json(existing?200:201,challan);
        }
        if(method==='DELETE' && route.startsWith('/api/vehicles/')) {
          const id=route.split('/').pop();assert(db.vehicles.some(v=>v.id===id),'Vehicle not found.');db.vehicles=db.vehicles.filter(v=>v.id!==id);save(db);return json(200,{ok:true});
        }
        if(method==='POST' && route==='/api/orders') {
          const configured=Array.isArray(body.items)&&body.items.some(i=>i.kind);
          const vehicle=db.vehicles.find(v=>v.id===(configured?body.items[0]?.vehicleId:body.vehicleId)),address=db.addresses.find(a=>a.id===body.addressId);
          assert(vehicle,'Choose a saved vehicle.');assert(address,'Choose a saved address.');
          assert(db.profile.name && db.profile.phone,'Save your name and mobile number before booking.');
          assert(Array.isArray(body.items) && body.items.length>0 && body.items.length<=50,'Your cart needs at least one item (maximum 50).');
          if(!configured){assert(new Set(body.items.map(i=>i.id)).size===body.items.length,'Please remove duplicate cart entries.');assert(!body.items.some(i=>specialized.includes(i.id)),'Choose vehicle-specific options, parts and quantities for this service before booking.');}
          assert(['Cash after service','UPI after service','Cash on delivery','UPI on delivery'].includes(body.payment),'Choose a payment method.');
          const scheduled=body.schedule==='asap'?'asap':text(body.schedule,60);
          if(scheduled!=='asap') { const date=new Date(scheduled);assert(Number.isFinite(date.getTime()) && date.getTime()>Date.now()+30*60000 && date.getTime()<Date.now()+8*86400000,'Choose a future slot within the next 7 days.');const hour=Number(new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',hourCycle:'h23'}).format(date));assert(hour>=8 && hour<=18,'Choose a slot between 8 AM and 6 PM India time.'); }
          const pricedItems=configured?body.items:body.items.map((item,index)=>({...item,key:'legacy-'+index,kind:'service',vehicleId:vehicle.id,vehicleSignature:vehicleSignature(vehicle),options:defaultOptions({kind:'service',id:item.id},vehicle)}));
          const totals=quoteCommerce(pricedItems,db.vehicles,text(body.coupon,20));
          if(totals.coupon) assert(!db.orders.some(o=>o.status!=='cancelled'&&o.totals.coupon==='FIRSTFIX'),'FIRSTFIX is available on your first booking only.');
          if(totals.coupon) assert(!db.orders.some(o=>o.status!=='cancelled'),'FIRSTFIX is available on your first booking only.');
          const orderVehicles=configured?[...new Set(body.items.map(i=>i.vehicleId))].map(id=>{const v=db.vehicles.find(v=>v.id===id);return {id:v.id,type:v.type,brand:v.brand,model:v.model,year:v.year||null,number:v.number||'',fuelType:v.fuelType||''};}):[{...vehicle}];
          const order={id:'PS-'+randomUUID().slice(0,8).toUpperCase(),createdAt:new Date().toISOString(),status:'confirmed',vehicle:{...vehicle},vehicles:orderVehicles,fulfillment:totals.fulfillment||'service',address:{...address},customer:{...db.profile},totals,payment:totals.fulfillment==='delivery'?body.payment.replace('after service','on delivery'):body.payment,schedule:scheduled,notes:text(body.notes,500),rating:null,history:[{status:'confirmed',at:new Date().toISOString()}]};
          db.orders.unshift(order);save(db);return json(201,order);
        }
        const orderMatch=route.match(/^\/api\/orders\/([^/]+)\/(advance|cancel|rate)$/);
        if(method==='POST' && orderMatch) {
          const order=db.orders.find(o=>o.id===orderMatch[1]);assert(order,'Booking not found.');
          if(orderMatch[2]==='cancel') {assert(['confirmed','assigned','enroute'].includes(order.status),'This booking can no longer be cancelled.');order.status='cancelled';}
          if(orderMatch[2]==='advance') {const index=stages.indexOf(order.status);assert(index>=0&&index<stages.length-1,'This booking has already ended.');order.status=stages[index+1];}
          if(orderMatch[2]==='rate') {assert(order.status==='completed','You can rate a completed service.');assert(Number.isInteger(body.rating)&&body.rating>=1&&body.rating<=5,'Choose a rating from 1 to 5.');order.rating=body.rating;}
          else order.history.push({status:order.status,at:new Date().toISOString()});
          save(db);return json(200,order);
        }
        return json(404,{error:'This action could not be found.'});
      }
      if(!['GET','HEAD'].includes(req.method)) return json(405,{error:'Method not allowed.'});
      const relative=decodeURIComponent(url.pathname)==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
      const publicRoot=path.join(root,'public'), file=path.resolve(publicRoot,relative);
      if(!file.startsWith(publicRoot+path.sep)) return json(403,{error:'Forbidden'});
      let content;try{content=readFileSync(file);}catch{return json(404,{error:'Page not found.'});}
      const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ico':'image/x-icon','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
      res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);
    }catch(error){json(400,{error:error instanceof SyntaxError?'Invalid request data.':error.message});}
  });
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT)||3000;
  const server=createApp();server.listen(port,'127.0.0.1',()=>console.log(`Pitstop is ready: http://127.0.0.1:${port}\nLocal demo • Data saved in ${path.join(root,'data')}\nPress Ctrl+C to stop.`));
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is busy. Set PORT to another port and try again.`:error.message);process.exitCode=1;});
}
