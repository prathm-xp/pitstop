import {services,priceFor,supportsService} from './catalog.js';
import {isElectric} from './vehicle-data.js';

export const partCategories=[['all','All parts','grid'],['oils','Oils & fluids','oil'],['filters','Filters','filter'],['battery','Batteries','battery'],['brakes','Brakes','shield'],['tyres','Tyres & wheels','wheel'],['engine','Engine & transmission','tool'],['electrical','Electrical & lighting','bolt'],['body','Body & mirrors','car'],['accessories','Accessories','sparkles']];
const all=['car','bike','scooter','superbike','ev'], two=['bike','scooter','superbike','ev'], ice=['car','bike','scooter','superbike'];
const msgp='https://www.marutisuzuki.com/genuine-parts/swift-from-aug-2011/2011-till-present/ldi';
const base=(id,name,category,art,price,labour,types=all,extra={})=>({id,name,category,art,price,labour,types,brand:'OEM / supplier to confirm',origin:'demo',unit:'1 unit',installation:labour>0,sourceUrl:null,priceBasis:'Illustrative demo estimate',...extra});
// Public manufacturer references are distinct from illustrative supplier listings.
// Nothing here represents verified local stock, an authorized supply relationship or VIN fitment.
export const parts=[
 base('oil-4t','4T engine oil','oils','oil',449,249,['bike','scooter','superbike'],{brand:'Castrol / Motul / Shell',unit:'Select brand, grade & litres'}),
 base('car-engine-oil','Car engine oil','oils','oil',649,499,['car'],{brand:'Castrol / Shell / Mobil',unit:'Select brand, grade & litres'}),
 base('two-battery','12 V two-wheeler battery','battery','battery',1499,249,two,{brand:'Exide / Amaron',unit:'1 battery'}),
 base('car-battery','12 V car battery','battery','battery',4999,499,['car'],{brand:'Exide / Amaron',unit:'1 battery'}),
 base('exide-65','Exide RIDE700L · 65 Ah','battery','battery',6502,499,['car'],{brand:'Exide',origin:'manufacturer-reference',partNumber:'RIDE700L',capacity:65,sourceUrl:'https://www.exidecare.com/find-exide/products/exide-ride/ride700l',priceBasis:'Public manufacturer MRP reference; not a live offer',unit:'12 V · 65 Ah · left layout',make:null}),
 base('air-filter','Air filter element','filters','engine',299,149,ice),
 base('oil-filter','Engine oil filter','filters','engine',199,149,ice),
 base('cabin-filter','Cabin AC filter','filters','fan',449,199,['car']),
 base('fuel-filter','Fuel filter','filters','engine',549,249,ice),
 base('ms-oil','Maruti Suzuki oil filter','filters','engine',115,149,['car'],{brand:'Maruti Suzuki',origin:'oem-reference',partNumber:'16510M73070',make:'Maruti Suzuki',sourceUrl:'https://www.marutisuzuki.com/genuine-parts/oil-filter/16510m73070',priceBasis:'Public OEM MRP reference; exact fitment unverified'}),
 ...[['ms-swift-air','Swift diesel air filter','filters','engine',285,149,'13780M86J00'],['ms-swift-brake','Swift brake pad set','brakes','brake',1677.5,499,'55810M75J30'],['ms-swift-shoe','Swift brake shoe set','brakes','brake',1700.5,499,'53200M74L00'],['ms-swift-clutch','Swift clutch disc','engine','engine',1889.5,999,'22400M86J43'],['ms-swift-fuel','Swift diesel fuel filter','filters','engine',1250,299,'15411M55KD0'],['ms-swift-belt','Swift water-pump belt','engine','chain',255,399,'17521M68K50']].map(([id,name,category,art,price,labour,partNumber])=>base(id,name,category,art,price,labour,['car'],{brand:'Maruti Suzuki',origin:'oem-reference',partNumber,make:'Maruti Suzuki',models:['Swift'],fuelTypes:['diesel'],sourceUrl:msgp,priceBasis:'Public OEM catalogue MRP reference; verify variant',workshop:category==='engine'})),
 base('brake-pads','Disc brake pad set','brakes','brake',699,349,all),
 base('brake-shoes','Drum brake shoe set','brakes','brake',449,349,all),
 base('brake-disc','Brake disc / rotor','brakes','brake',1299,499,all),
 base('brake-cable','Brake cable','brakes','chain',249,199,two),
 base('brake-fluid','Brake fluid','oils','oil',299,249,all,{unit:'500 ml pack'}),
 base('two-tyre','Two-wheeler tyre','tyres','tyre',1799,299,two,{brand:'MRF / CEAT / Apollo'}),
 base('car-tyre','Passenger car tyre','tyres','tyre',4499,499,['car'],{brand:'MRF / CEAT / Apollo'}),
 base('inner-tube','Tyre inner tube','tyres','tyre',249,199,two),
 base('wheel-bearing','Wheel bearing kit','tyres','brake',599,399,all,{workshop:true}),
 base('spark-plug','Spark plug','engine','bulb',199,149,ice),
 base('chain-kit','Chain & sprocket kit','engine','chain',1599,399,['bike','superbike']),
 base('clutch-cable','Clutch cable','engine','chain',299,199,['bike','superbike','car']),
 base('clutch-kit','Clutch plate kit','engine','engine',1899,999,ice,{workshop:true}),
 base('scooter-belt','Scooter CVT drive belt','engine','chain',799,499,['scooter'],{workshop:true}),
 base('gasket','Engine gasket set','engine','engine',599,999,ice,{workshop:true}),
 base('coolant','Engine coolant','oils','oil',349,249,ice,{unit:'1 litre pack'}),
 base('headlamp-bulb','Headlamp bulb','electrical','bulb',249,149,all),
 base('headlamp-unit','Headlamp assembly','electrical','bulb',1999,399,all),
 base('indicator','Turn indicator assembly','electrical','bulb',399,199,all),
 base('horn','Replacement horn','electrical','bulb',499,199,all),
 base('fuse-kit','Automotive fuse kit','electrical','battery',149,149,all),
 base('starter-relay','Starter relay','electrical','battery',699,249,ice),
 base('side-mirror','Rear-view mirror','body','toolbox',599,149,all),
 base('wipers','Wiper blade pair','body','toolbox',649,149,['car'],{unit:'1 pair'}),
 base('suspension','Suspension component kit','body','engine',2499,799,all,{workshop:true}),
 base('body-panel','Body panel / trim','body','toolbox',1299,499,all,{workshop:true}),
 base('seat-cover','Vehicle seat cover','accessories','toolbox',799,199,all),
 base('floor-mats','Car floor mat set','accessories','toolbox',999,149,['car'],{unit:'1 set'}),
 base('phone-holder','Phone mount','accessories','toolbox',499,149,all),
 base('dashcam','Car dash camera','accessories','diagnostic',3499,699,['car']),
 base('cleaning-kit','Vehicle cleaning kit','accessories','wash',399,0,all,{unit:'1 kit'}),
 base('microfibre','Microfibre cloth set','accessories','wash',199,0,all,{unit:'3 cloths'}),
 base('usb-adapter','Low-voltage USB adapter','accessories','battery',399,149,all)
];
export const productById=id=>parts.find(p=>p.id===id);
export const catalogueReferenceDate='2026-10-18';
const normalize=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'').replace(/^maruti$/,'marutisuzuki');
export function productMatches(product,vehicle){
 if(!product||!vehicle||!product.types.includes(vehicle.type))return false;
 if(isElectric(vehicle)&&['oil-4t','car-engine-oil','air-filter','oil-filter','fuel-filter','spark-plug','coolant','starter-relay'].includes(product.id))return false;
 if(product.make&&normalize(product.make)!==normalize(vehicle.brand))return false;
 if(product.models&&!product.models.some(m=>normalize(vehicle.model).includes(normalize(m))))return false;
 if(product.fuelTypes&&vehicle.fuelType&&!product.fuelTypes.includes(vehicle.fuelType))return false;
 return true;
}
export const capacityOptions=v=>v.type==='car'?[35,45,60,65,74]:v.type==='superbike'?[8,9,12]:v.type==='bike'?[4,5,8,9]:[3,4,5,7];
export const suggestedCapacity=v=>v.type==='car'?45:v.type==='superbike'?9:v.type==='bike'?8:4;
export const oilGrades=v=>v.type==='car'?['0W-20','5W-30','5W-40','10W-40']:v.type==='scooter'?['10W-30','10W-40','5W-40']:['10W-30','10W-40','10W-50','15W-50','20W-50'];
export const oilVolumes=v=>v.type==='car'?[3,3.5,4,4.5,5,6]:v.type==='superbike'?[2,2.5,3,3.5,4]:v.type==='bike'?[1,1.2,1.5,2,2.5]:[.8,1,1.2];
export const tyreSizes=v=>v.type==='car'?['165/80 R14','175/65 R14','185/65 R15','195/55 R16','205/65 R16']:v.type==='scooter'||v.type==='ev'?['90/100-10','90/90-12','100/80-12','110/80-12']:['80/100-18','90/90-17','100/90-17','110/70-17','120/80-17','150/60-17'];
export const oilBrands=['Castrol','Motul','Shell','Mobil','OEM specified'];
export const batteryBrands=['Exide','Amaron','OEM specified'];
export const tyreBrands=['MRF','CEAT','Apollo','OEM specified'];
const scopeMap={
 'basic-service':[['essential','Essential inspection & adjustments',0,0],['care','Essential + cleaning consumables',0,99]],
 'full-service':[['complete','Complete care + consumable kit',0,199],['extended','Extended care + consumable kit',299,299]],
 puncture:[['tubeless','One tubeless puncture repair',0,50],['tube','Tube-type puncture repair',100,100]],
 'jump-start':[['auxiliary','Auxiliary battery jumpstart & test',0,0]],
 wash:[['exterior','Exterior foam wash + supplies',0,49],['premium','Exterior wash + protective wax',149,149]],
 rescue:[['diagnose','On-site diagnosis & minor adjustments',0,0]],
 towing:[['standard','Secure towing · first 5 km',0,0],['extended','Secure towing · first 10 km',399,0]],
 brakes:[['clean','Inspection & cleaning consumables',0,99],['replace','Replace one brake pad set',0,699]],
 chain:[['lube','Clean & lube with consumables',0,149],['replace','Replace chain & sprocket kit',200,1599]],
 diagnostic:[['standard','Mechanical & electrical health check',0,0],['scan','Health check + electronic scan (where supported)',299,0]],
 electrical:[['diagnose','Electrical diagnosis',0,0],['bulb','Diagnosis + one headlamp bulb',0,249],['horn','Diagnosis + replacement horn',50,499]],
 detailing:[['wax','Exterior detail + wax & supplies',0,299],['premium','Premium detail + protection supplies',399,499]],
 ac:[['diagnose','AC performance diagnosis',0,0],['filter','Diagnosis + cabin filter',149,449]],
 alignment:[['align','Wheel alignment at workshop',0,0],['balance','Alignment + balancing / weights allowance',299,150]],
 clutch:[['inspect','Clutch & gear inspection',0,0],['cable','Inspection + clutch cable replacement',100,299]],
 'ev-check':[['standard','EV auxiliary and safety check',0,0]],
 inspection:[['standard','Vehicle inspection + photo report',0,0]],
 pickup:[['standard','Pickup & return coordination · 5 km',0,0],['extended','Pickup & return coordination · 10 km',299,0]],
 accessories:[['mount','Phone mount + installation',0,499],['cover','Seat cover + fitting',0,799]]
};
export const scopesFor=id=>scopeMap[id]||[];
export const specialized=['oil-change','battery-replace','tyre-change','petrol','diesel'];
const has=(list,value,message)=>{if(!list.includes(value))throw new Error(message);};
const ensure=(condition,message)=>{if(!condition)throw new Error(message);};
const round=value=>Math.round(value*100)/100;
export function configurationKey(item){return JSON.stringify([item.kind,item.id,item.vehicleId,Object.entries(item.options||{}).sort(([a],[b])=>a.localeCompare(b))]);}
export const vehicleSignature=vehicle=>JSON.stringify([vehicle.id,vehicle.type,vehicle.brand,vehicle.model,vehicle.year??null,vehicle.fuelType||'',vehicle.number||'']);
export function defaultOptions(item,vehicle){
 if(item.kind==='part'){
  const options={fulfillment:'delivery',fitmentConfirmed:false};
  if(['two-battery','car-battery','exide-65'].includes(item.id))Object.assign(options,{brand:'Exide',capacity:productById(item.id)?.capacity||suggestedCapacity(vehicle)});
  if(['oil-4t','car-engine-oil'].includes(item.id))Object.assign(options,{brand:'Castrol',grade:oilGrades(vehicle)[0],volume:oilVolumes(vehicle)[0]});
  if(['two-tyre','car-tyre'].includes(item.id))Object.assign(options,{brand:'MRF',size:tyreSizes(vehicle)[0]});
  return options;
 }
 if(item.id==='oil-change')return {brand:'Castrol',grade:oilGrades(vehicle)[0],volume:oilVolumes(vehicle)[0],filter:false,fitmentConfirmed:false};
 if(item.id==='battery-replace')return {brand:'Exide',capacity:suggestedCapacity(vehicle),voltage:12,fitmentConfirmed:false};
 if(item.id==='tyre-change')return {brand:'MRF',size:tyreSizes(vehicle)[0],position:'Rear',fitmentConfirmed:false};
 if(['petrol','diesel'].includes(item.id))return {litres:1,fuelConfirmed:false};
 return {scope:scopesFor(item.id)[0]?.[0]||'standard',...(item.id==='brakes'?{position:'Both'}:{}),fitmentConfirmed:false};
}
function oilPrice(options){return Math.round(({Castrol:449,Motul:599,Shell:499,Mobil:649,'OEM specified':549}[options.brand]||449)*options.volume);}
function batteryPrice(vehicle,options){return Math.round((vehicle.type==='car'?3200:850)+options.capacity*(vehicle.type==='car'?48:135)+(options.brand==='Amaron'?150:options.brand==='OEM specified'?300:0));}
export function priceLine(item,vehicle,{preview=false}={}){
 ensure(vehicle,'Choose a saved vehicle for each item.');
 if(!preview)ensure(item.vehicleSignature===vehicleSignature(vehicle),'Vehicle details changed. Edit this cart item and confirm its configuration again.');
 ensure(['service','part'].includes(item.kind),'Choose a service or spare part.');
 const options=item.options;
 ensure(options&&typeof options==='object'&&!Array.isArray(options),'Configure this item before adding it.');
 const allowed=item.kind==='part'?['fulfillment','fitmentConfirmed',...(['two-battery','car-battery','exide-65'].includes(item.id)?['brand','capacity']:['oil-4t','car-engine-oil'].includes(item.id)?['brand','grade','volume']:['two-tyre','car-tyre'].includes(item.id)?['brand','size']:[])]:item.id==='oil-change'?['brand','grade','volume','filter','fitmentConfirmed']:item.id==='battery-replace'?['brand','capacity','voltage','fitmentConfirmed']:item.id==='tyre-change'?['brand','size','position','fitmentConfirmed']:['petrol','diesel'].includes(item.id)?['litres','fuelConfirmed','fitmentConfirmed']:['scope','fitmentConfirmed',...(item.id==='brakes'?['position']:[])];
 ensure(Object.keys(options).every(key=>allowed.includes(key)),'This configuration contains an unsupported option. Please configure it again.');
 let labour=0,regularLabour=0,material=0,fuel=0,label='',art='toolbox',details=[],sourceUrl=null,installation=false,requiresFitment=false;
 if(item.kind==='service'){
  const service=services.find(s=>s.id===item.id);ensure(service&&supportsService(service,vehicle),'This service is not available for the selected vehicle.');
  labour=priceFor(service,vehicle.type);label=service.name;art=service.art;installation=true;
  if(item.id==='oil-change'){
   has(oilBrands,options.brand,'Select an oil brand.');has(oilGrades(vehicle),options.grade,'Choose an available oil grade or request your specification.');has(oilVolumes(vehicle),options.volume,'Select an oil quantity.');ensure(typeof options.filter==='boolean','Choose whether to include an oil filter.');
   material=oilPrice(options)+(options.filter?(vehicle.type==='car'?199:149):0);details=[options.brand,options.grade,`${options.volume} L`,options.filter?'Oil filter included':'Oil filter not selected'];requiresFitment=true;
  }else if(item.id==='battery-replace'){
   has(batteryBrands,options.brand,'Select a battery brand.');has(capacityOptions(vehicle),options.capacity,'Choose an offered battery capacity or request a different specification.');ensure(options.voltage===12,'Only 12 V auxiliary batteries are offered.');material=batteryPrice(vehicle,options);details=[options.brand,`12 V · ${options.capacity} Ah`,'No old-battery exchange credit assumed'];requiresFitment=true;
  }else if(item.id==='tyre-change'){
   has(tyreBrands,options.brand,'Choose a tyre brand.');has(tyreSizes(vehicle),options.size,'Choose an offered tyre size or request your size.');has(['Front','Rear','Spare'],options.position,'Choose wheel position.');material=vehicle.type==='car'?4499:vehicle.type==='superbike'?6499:1799;details=[options.brand,options.size,options.position+' wheel'];requiresFitment=true;
  }else if(['petrol','diesel'].includes(item.id)){
   labour=149;const allowed=item.id==='petrol'?[1,2,3,5]:[1,2,5,10];has(allowed,options.litres,'Select an offered fuel quantity.');if(!preview)ensure(options.fuelConfirmed===true,'Confirm that the selected fuel is suitable for this vehicle.');fuel=options.litres*(item.id==='petrol'?105:95);details=[`${options.litres} litres`,`${item.id==='petrol'?'₹105':'₹95'}/L illustrative fuel rate`,'Delivery / handling ₹149'];
  }else{
   const scope=scopesFor(item.id).find(row=>row[0]===options.scope);ensure(scope,'Choose a service package.');labour+=scope[2];material=scope[3];details=[scope[1]];requiresFitment=material>=249&&['brakes','chain','electrical','clutch','accessories','ac'].includes(item.id);
   if(item.id==='brakes'){has(['Front','Rear','Both'],options.position,'Choose brake position.');details.push(options.position+' brakes');if(options.scope==='replace'&&options.position==='Both'){material*=2;labour=Math.round(labour*1.5);}}
  }
  regularLabour=labour;
 }else{
  const product=productById(item.id);ensure(productMatches(product,vehicle),'This listing does not match the selected vehicle category or model family. Request a part for this vehicle instead.');
  has(['delivery','installation'],options.fulfillment,'Choose delivery or delivery with installation.');ensure(options.fulfillment!=='installation'||product.installation,'Installation is not available for this listing.');
  label=product.name;art=product.art;material=product.price;installation=options.fulfillment==='installation';regularLabour=installation?product.labour:0;labour=round(regularLabour*.75);sourceUrl=product.sourceUrl;requiresFitment=product.category!=='accessories'||product.installation;
  details=[product.brand,product.partNumber?'P/N '+product.partNumber:'Supplier part number pending',product.unit,installation?(product.workshop?'Scheduled workshop installation · 25% off labour':'Delivery + installation · 25% off labour'):'Parts delivery only'];
  if(['two-battery','car-battery','exide-65'].includes(item.id)){
   if(product.capacity){ensure(options.capacity===product.capacity,'Choose the listed battery capacity.');ensure(options.brand===product.brand,'Choose the brand specified by this listing.');}else has(capacityOptions(vehicle),options.capacity,'Choose a battery capacity.');has(batteryBrands,options.brand,'Choose a battery brand.');details.push(options.brand,`12 V · ${options.capacity} Ah`);if(!product.capacity)material=batteryPrice(vehicle,options);
  }
  if(['oil-4t','car-engine-oil'].includes(item.id)){has(oilBrands,options.brand,'Select an oil brand.');has(oilGrades(vehicle),options.grade,'Select oil grade.');has(oilVolumes(vehicle),options.volume,'Select oil quantity.');material=oilPrice(options);details.push(options.brand,options.grade,options.volume+' L');}
  if(['two-tyre','car-tyre'].includes(item.id)){has(tyreBrands,options.brand,'Choose a tyre brand.');has(tyreSizes(vehicle),options.size,'Choose tyre size.');details.push(options.brand,options.size);}
 }
 if(!preview&&requiresFitment)ensure(options.fitmentConfirmed===true,'Confirm the specification check before adding this item.');
 const quantity=item.quantity??1;ensure(Number.isInteger(quantity)&&quantity>=1&&quantity<=5,'Choose a quantity between 1 and 5.');
 if(['petrol','diesel'].includes(item.id))ensure(quantity===1,'Adjust fuel litres in the configuration, not the cart quantity.');
 const unitPrice=round(labour+material+fuel);
 return {key:item.key,id:item.id,kind:item.kind,name:label,art,vehicleId:vehicle.id,vehicleName:`${vehicle.brand} ${vehicle.model}`,vehicleNumber:vehicle.number||'',options:{...options},quantity,unitPrice,labourUnit:labour,regularLabourUnit:regularLabour,partsUnit:material,fuelUnit:fuel,installationDiscount:round((regularLabour-labour)*quantity),lineTotal:round(unitPrice*quantity),details,sourceUrl,installation,requiresFitment,fitmentStatus:requiresFitment?'Customer specification check recorded; supplier fitment pending':'Not independently verified'};
}
export function quoteCommerce(items,vehicles,coupon='',{preview=false}={}){
 ensure(Array.isArray(items)&&items.length>0&&items.length<=50,'Add between 1 and 50 configured items.');
 ensure(items.every(i=>!i.key||typeof i.key==='string'&&i.key.length<=80),'Invalid cart line identifier.');
 ensure(new Set(items.filter(i=>i.key).map(i=>i.key)).size===items.filter(i=>i.key).length,'Cart line identifiers must be unique.');
 ensure(new Set(items.map(configurationKey)).size===items.length,'Merge identical item configurations in your cart.');
 const lines=items.map(item=>priceLine(item,vehicles.find(v=>v.id===item.vehicleId),{preview}));
 const sum=fn=>round(lines.reduce((total,line)=>total+fn(line),0));
 const partsSubtotal=sum(l=>l.partsUnit*l.quantity),labourSubtotal=sum(l=>['petrol','diesel'].includes(l.id)?0:l.labourUnit*l.quantity),fuelHandlingSubtotal=sum(l=>['petrol','diesel'].includes(l.id)?l.labourUnit*l.quantity:0),fuelSubtotal=sum(l=>l.fuelUnit*l.quantity),installationDiscount=sum(l=>l.installationDiscount);
 const subtotal=round(partsSubtotal+labourSubtotal+fuelSubtotal+fuelHandlingSubtotal),eligibleSubtotal=labourSubtotal;
 const code=String(coupon||'').trim().toUpperCase();ensure(!code||code==='FIRSTFIX','That offer code is not valid. Try FIRSTFIX.');
 if(code)ensure(eligibleSubtotal>=499,'FIRSTFIX requires at least ₹499 in eligible service / labour charges. Parts and fuel are excluded.');
 const discount=code?Math.min(150,Math.round(eligibleSubtotal*.15)):0;
 const hasVisit=lines.some(l=>l.installation&&!['petrol','diesel'].includes(l.id)),hasPartDelivery=lines.some(l=>l.kind==='part'&&!l.installation);
 const visitFee=hasVisit&&subtotal<999?49:0,deliveryFee=!hasVisit&&hasPartDelivery&&!fuelHandlingSubtotal&&subtotal<999?29:0;
 return {lines,partsSubtotal,labourSubtotal,fuelSubtotal,fuelHandlingSubtotal,installationDiscount,eligibleSubtotal,subtotal,discount,visitFee,deliveryFee,total:round(subtotal-discount+visitFee+deliveryFee),coupon:code,fulfillment:lines.every(l=>l.kind==='part'&&!l.installation||['petrol','diesel'].includes(l.id))?'delivery':'service',pricingVersion:2};
}
