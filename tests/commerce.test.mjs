import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../server.mjs';
import {parts,priceLine,quoteCommerce,defaultOptions,vehicleSignature,productMatches,productById} from '../public/commerce.js';
const bike={id:'bike',type:'bike',brand:'Royal Enfield',model:'Classic 350',year:2022,number:'KA01AB1234',fuelType:'petrol'};
const car={id:'car',type:'car',brand:'Hyundai',model:'i20',year:2021,number:'KA02AB1234',fuelType:'petrol'};
const scooter={id:'scooter',type:'scooter',brand:'Honda',model:'Activa 6G',year:2023,number:'',fuelType:'petrol'};
const item=(kind,id,v,options={},quantity=1)=>({key:kind+'-'+id+'-'+v.id,kind,id,vehicleId:v.id,vehicleSignature:vehicleSignature(v),quantity,options:{...defaultOptions({kind,id},v),fitmentConfirmed:true,...options}});

test('oil configurations include selected parts, oil volume and labour',()=>{
 const line=priceLine(item('service','oil-change',bike,{brand:'Motul',grade:'15W-50',volume:2.5,filter:true}),bike);
 assert.equal(line.labourUnit,311);assert.equal(line.partsUnit,1647);assert.equal(line.unitPrice,1958);assert.ok(line.details.includes('2.5 L'));
 assert.throws(()=>priceLine(item('service','oil-change',bike,{fitmentConfirmed:false}),bike),/specification/);
 assert.throws(()=>priceLine(item('service','oil-change',bike,{volume:99}),bike),/quantity/);
 assert.throws(()=>priceLine(item('service','oil-change',bike,{brand:'Unknown'}),bike),/brand/);
});
test('battery choices validate Ah, voltage, category and fixed reference capacity',()=>{
 assert.equal(priceLine(item('service','battery-replace',car,{capacity:60,voltage:12}),car).partsUnit,6080);
 assert.throws(()=>priceLine(item('service','battery-replace',scooter,{capacity:74,voltage:12}),scooter),/capacity/);
 assert.throws(()=>priceLine(item('service','battery-replace',bike,{voltage:48}),bike),/12 V/);
 assert.equal(priceLine(item('part','exide-65',car),car).partsUnit,6502);
 assert.throws(()=>priceLine(item('part','exide-65',car,{capacity:45}),car),/listed/);
});
test('fuel quantities include litres and handling, and cannot be multiplied in cart',()=>{
 const fuel=item('service','petrol',bike,{litres:2,fuelConfirmed:true});
 const total=quoteCommerce([fuel],[bike]);assert.equal(total.fuelSubtotal,210);assert.equal(total.fuelHandlingSubtotal,149);assert.equal(total.labourSubtotal,0);assert.equal(total.total,359);assert.equal(total.visitFee,0);
 assert.equal(total.fulfillment,'delivery');
 assert.throws(()=>priceLine({...fuel,quantity:2},bike),/litres/);
 assert.throws(()=>priceLine({...fuel,options:{...fuel.options,litres:99}},bike),/quantity/);
 assert.throws(()=>priceLine({...fuel,options:{...fuel.options,fuelConfirmed:false}},bike),/selected fuel/);
});
test('parts-only and installation orders have different labour, discount and fulfilment',()=>{
 const delivery=quoteCommerce([item('part','air-filter',bike)],[bike]);assert.equal(delivery.labourSubtotal,0);assert.equal(delivery.deliveryFee,29);assert.equal(delivery.total,328);assert.equal(delivery.fulfillment,'delivery');
 const install=quoteCommerce([item('part','air-filter',bike,{fulfillment:'installation'})],[bike]);assert.equal(install.labourSubtotal,111.75);assert.equal(install.installationDiscount,37.25);assert.equal(install.total,459.75);assert.equal(install.fulfillment,'service');
 assert.throws(()=>priceLine(item('part','cleaning-kit',car,{fulfillment:'installation'}),car),/not available/);
});
test('multi-vehicle cart calculates each saved vehicle and freezes options per line',()=>{
 const lines=[item('service','oil-change',bike,{grade:'15W-50',volume:2}),item('service','battery-replace',car,{capacity:45})];
 const q=quoteCommerce(lines,[bike,car]);assert.equal(q.lines[0].vehicleId,'bike');assert.equal(q.lines[1].vehicleId,'car');assert.equal(q.partsSubtotal,6258);assert.equal(q.labourSubtotal,934);
 assert.throws(()=>quoteCommerce(lines,[car]),/vehicle/);
 assert.throws(()=>priceLine(lines[0],{...bike,year:2023}),/changed/);
});
test('FIRSTFIX excludes parts and fuel, and prices reject unsupported options',()=>{
 assert.throws(()=>quoteCommerce([item('part','car-battery',car)],[car],'FIRSTFIX'),/eligible/);
 const full=item('service','full-service',car);const q=quoteCommerce([full],[car],'FIRSTFIX');assert.equal(q.discount,150);assert.equal(q.total,q.subtotal-150);
 assert.throws(()=>priceLine(item('service','oil-change',bike,{price:1}),bike),/unsupported/);
 assert.throws(()=>quoteCommerce([full,{...full,key:'another'}],[car]),/identical/);
});
test('OEM references respect vehicle make/model family, without claiming exact fitment',()=>{
 assert.equal(productMatches(productById('ms-swift-air'),car),false);
 const swift={...car,brand:'Maruti Suzuki',model:'Swift',fuelType:'diesel'};
 assert.equal(productMatches(productById('ms-swift-air'),swift),true);
 assert.equal(productMatches(productById('ms-swift-air'),{...swift,model:'Baleno'}),false);
 assert.equal(priceLine(item('part','ms-swift-air',swift),swift).partsUnit,285);
 assert.ok(parts.some(p=>p.origin==='oem-reference'&&p.sourceUrl));
});
test('configured commerce API recalculates prices, saves orders and sourcing requests',async t=>{
 const dataDir=mkdtempSync(path.join(tmpdir(),'pitstop-commerce-')),server=createApp({dataDir});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 const request=async(route,method='GET',body)=>{const response=await fetch(base+'/api/'+route,{method,headers:method==='GET'?{}:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};};
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));rmSync(dataDir,{recursive:true,force:true});});
 await request('profile','PUT',{name:'Commerce Demo',phone:'9876543210'});
 const savedBike=(await request('vehicles','POST',{...bike,id:undefined})).data,savedCar=(await request('vehicles','POST',{...car,id:undefined})).data;
 const cart=[item('service','oil-change',savedBike,{grade:'15W-50',volume:2}),item('part','car-battery',savedCar,{fulfillment:'installation',capacity:45})];
 let order;
 await t.test('exposes reference catalogue and validated quote',async()=>{const catalogue=await request('parts');assert.equal(catalogue.data.liveStock,false);assert.ok(catalogue.data.parts.length>=40);assert.equal((await request('quote','POST',{items:cart})).status,200);});
 await t.test('rejects missing confirmation, unknown vehicle and legacy oil bypass',async()=>{assert.equal((await request('quote','POST',{items:[{...cart[0],options:{...cart[0].options,fitmentConfirmed:false}}]})).status,400);assert.equal((await request('quote','POST',{items:[{...cart[0],vehicleId:'missing'}]})).status,400);assert.equal((await request('orders','POST',{vehicleId:savedBike.id,addressId:'home',items:[{id:'oil-change',quantity:1}],schedule:'asap',payment:'Cash after service'})).status,400);});
 await t.test('ignores forged prices and stores chosen variants and both vehicles',async()=>{const result=await request('orders','POST',{vehicleId:savedCar.id,addressId:'home',items:cart.map(i=>({...i,unitPrice:1,partsUnit:0,labourUnit:0})),total:1,payment:'UPI after service',schedule:'asap'});assert.equal(result.status,201);order=result.data;assert.equal(order.vehicles.length,2);assert.equal(order.totals.pricingVersion,2);assert.equal(order.totals.lines[0].options.grade,'15W-50');assert.equal(order.totals.lines[1].options.capacity,45);assert.ok(order.totals.total>5000);});
 await t.test('historical line configurations survive later vehicle edits',async()=>{await request('vehicles/'+savedBike.id,'PUT',{...savedBike,model:'Classic 350 Signals',year:2023});const state=(await request('state')).data;const saved=state.orders.find(o=>o.id===order.id);assert.equal(saved.totals.lines[0].vehicleName,'Royal Enfield Classic 350');assert.equal(saved.totals.lines[0].options.volume,2);assert.equal((await request('quote','POST',{items:cart})).status,400);});
 await t.test('creates delivery-only orders with zero installation charges',async()=>{const result=await request('orders','POST',{addressId:'home',items:[item('part','cleaning-kit',savedCar)],payment:'Cash after service',schedule:'asap'});assert.equal(result.status,201);assert.equal(result.data.fulfillment,'delivery');assert.equal(result.data.totals.labourSubtotal,0);});
 await t.test('records unlisted-part requests without inventing a quote or stock',async()=>{const body={vehicleId:savedCar.id,partName:'Variant-specific brake caliper',partNumber:'OEM-REQUEST-1',fulfillment:'installation',notes:'Confirm VIN-specific fitment',referenceUrl:'https://boodmo.com/'};const result=await request('part-requests','POST',body);assert.equal(result.status,201);assert.equal(result.data.quotedPrice,null);assert.equal(result.data.referenceUrl,'https://boodmo.com/');assert.equal(result.data.source,'local-demo');assert.equal((await request('state')).data.partRequests.length,1);assert.equal((await request('part-requests','POST',{...body,referenceUrl:'javascript:alert(1)'})).status,400);assert.equal((await request('part-requests','POST',{vehicleId:'missing',partName:'Unknown',fulfillment:'delivery'})).status,400);});
});
