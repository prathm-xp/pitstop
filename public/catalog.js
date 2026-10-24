import {isElectric} from './vehicle-data.js';
export const categories = [
  { id: 'all', name: 'All services', icon: 'grid' },
  { id: 'periodic', name: 'Periodic service', icon: 'tool' },
  { id: 'tyres', name: 'Tyres & wheels', icon: 'wheel' },
  { id: 'battery', name: 'Battery & electrical', icon: 'battery' },
  { id: 'rescue', name: 'Roadside rescue', icon: 'bolt' },
  { id: 'cleaning', name: 'Wash & detailing', icon: 'sparkles' },
  { id: 'repairs', name: 'Repairs & care', icon: 'shield' },
  { id: 'fuel', name: 'Fuel delivery', icon: 'fuel' },
];
export const vehicleTypes = [
  { id: 'scooter', name: 'Scooty / Scooter', factor: 1, examples: 'Activa, Jupiter, Access' },
  { id: 'bike', name: 'Bike', factor: 1.25, examples: 'Splendor, Pulsar, Classic' },
  { id: 'superbike', name: 'Superbike', factor: 2.8, examples: 'Ninja, Duke, Interceptor' },
  { id: 'car', name: 'Car', factor: 2.5, examples: 'Swift, Nexon, Creta' },
  { id: 'ev', name: 'Electric vehicle', factor: 1.2, examples: 'Ather, Ola, Chetak' },
];
const all = vehicleTypes.map(v => v.id);
const combustion = ['scooter', 'bike', 'superbike', 'car'];
export const services = [
  { id:'basic-service', name:'Essential service', subtitle:'A little care. A smoother ride.', category:'periodic', price:599, original:799, time:'60–90 min', rating:'4.9', reviews: '2.4k', badge:'BESTSELLER', art:'scooter', vehicles:all, includes:['40-point vehicle inspection','Engine oil level & condition check (where applicable)','Brake adjustment and chain lubrication','Tyre pressure and electrical checks','Detailed digital service report'], note:'Engine oil, filters and replacement parts are charged separately after your approval.' },
  { id:'full-service', name:'Complete service', subtitle:'The full works, for your daily companion.', category:'periodic', price:1199, original:1499, time:'2–3 hrs', rating:'4.9', reviews:'1.8k', badge:'RECOMMENDED', art:'engine', vehicles:all, includes:['Everything in Essential service','Air filter cleaning and spark plug check','Brake cleaning and full fluid inspection','Drive system inspection','Exterior wash and road test'], note:'Parts and fluids are extra and require approval. Workshop pickup may be needed for complex work.' },
  { id:'puncture', name:'Puncture repair', subtitle:'Flat tyre? We’ll get you rolling.', category:'tyres', price:199, original:299, time:'20–30 min', rating:'4.8', reviews:'3.1k', badge:'QUICK FIX', art:'tyre', vehicles:all, includes:['One tubeless tyre puncture repair','Leak inspection','Air pressure adjustment','Tyre condition check'], note:'Tube replacement or a new tyre is quoted separately. Price covers one repairable puncture.' },
  { id:'jump-start', name:'Battery jumpstart', subtitle:'A fresh start, right where you are.', category:'battery', price:349, original:499, time:'15–20 min', rating:'4.8', reviews:'1.2k', badge:'AT YOUR DOOR', art:'battery', vehicles:all, includes:['Battery voltage assessment','Safe auxiliary battery jumpstart','Charging system check','Battery health advice'], note:'For EVs, this covers the auxiliary battery only. High-voltage batteries require a specialist.' },
  { id:'wash', name:'Doorstep foam wash', subtitle:'That fresh-out-of-the-showroom feeling.', category:'cleaning', price:249, original:399, time:'30–45 min', rating:'4.9', reviews:'2.1k', badge:'FEEL-GOOD CARE', art:'wash', vehicles:all, includes:['pH-balanced foam wash','Wheel and tyre cleaning','Microfibre hand dry','Exterior dashboard / trim wipe'], note:'A safe parking area and access to water and electricity are required.' },
  { id:'oil-change', name:'Engine oil change', subtitle:'Keep your engine running happy.', category:'periodic', price:249, original:349, time:'30–40 min', rating:'4.9', reviews:'980', art:'oil', vehicles:combustion, includes:['Old engine oil drain','New oil refill using approved grade','Oil leak inspection','Responsible used-oil collection'], note:'Configure the oil brand, viscosity, fill quantity and optional filter. The estimate includes selected oil, filter and labour. Exact specification and supply require confirmation.' },
  { id:'tyre-change', name:'Tyre replacement', subtitle:'More grip. More confidence.', category:'tyres', price:299, original:449, time:'40–60 min', rating:'4.8', reviews:'760', art:'tyre', vehicles:all, includes:['Removal and fitment of one tyre','Valve inspection','Pressure setting','Wheel safety inspection'], note:'Choose a tyre brand, size and wheel position. Selected tyre and fitting labour are included in the configured estimate. Balancing is not included.' },
  { id:'battery-replace', name:'Battery replacement', subtitle:'Reliable power for every journey.', category:'battery', price:249, original:399, time:'30–45 min', rating:'4.9', reviews:'840', art:'battery', vehicles:all, includes:['Battery health test','Auxiliary battery replacement labour','Terminal cleaning','Charging check'], note:'Choose a 12 V auxiliary battery brand and Ah capacity. The configured estimate includes the selected battery and replacement labour. Traction batteries and exchange credits are excluded.' },
  { id:'petrol', name:'Emergency petrol', subtitle:'A little fuel to get you going.', category:'fuel', price:149, original:199, time:'30–45 min', rating:'4.7', reviews:'640', art:'fuel', vehicles:combustion, includes:['Your selected petrol quantity','Delivery to a safe accessible location','Approved fuel container handling'], note:'Demo only. Choose litres before checkout; the estimate includes illustrative fuel charges and delivery / handling. Actual rates and authorized supply are not connected.' },
  { id:'diesel', name:'Emergency diesel', subtitle:'Your next fuel stop, brought to you.', category:'fuel', price:149, original:199, time:'30–45 min', rating:'4.8', reviews:'420', art:'fuel', vehicles:['car'], includes:['Your selected diesel quantity','Delivery to a safe accessible location','Fuel compatibility confirmation'], note:'Demo only. Choose litres before checkout; the estimate includes illustrative fuel charges and delivery / handling. Actual rates and authorized supply are not connected.' },
  { id:'rescue', name:'Breakdown assistance', subtitle:'Stuck somewhere? We’re on our way.', category:'rescue', price:399, original:599, time:'30–60 min', rating:'4.9', reviews:'1.6k', art:'toolbox', vehicles:all, includes:['On-site breakdown diagnosis','Minor roadside adjustments','Safety and mobility assessment','Repair or towing recommendation'], note:'Visit and diagnosis fee only. Repairs, parts and towing are extra. For medical emergencies, contact emergency services.' },
  { id:'towing', name:'Safe vehicle towing', subtitle:'A careful ride to the workshop.', category:'rescue', price:799, original:999, time:'45–90 min', rating:'4.8', reviews:'540', art:'truck', vehicles:all, includes:['Vehicle pickup from an accessible road','Secure vehicle loading','Transport up to 5 km','Drop-off at a workshop of your choice'], note:'Extra distance, specialist carriers and tolls are quoted before dispatch.' },
  { id:'brakes', name:'Brake service', subtitle:'Because every stop matters.', category:'repairs', price:349, original:499, time:'45–60 min', rating:'4.9', reviews:'1.1k', art:'brake', vehicles:all, includes:['Front and rear brake inspection','Brake pad / shoe cleaning','Cable and free-play adjustment','Brake function test'], note:'Pads, shoes, discs and brake fluid are extra. Replacement requires approval.' },
  { id:'chain', name:'Chain clean & lube', subtitle:'Less friction. More adventure.', category:'repairs', price:199, original:299, time:'20–30 min', rating:'4.9', reviews:'900', art:'chain', vehicles:['bike','superbike'], includes:['Chain degreasing','Chain lubrication','Slack adjustment','Sprocket condition inspection'], note:'Chain and sprocket replacement parts are extra.' },
  { id:'diagnostic', name:'Vehicle health check', subtitle:'Understand what your ride needs.', category:'repairs', price:299, original:449, time:'30–45 min', rating:'4.8', reviews:'720', art:'diagnostic', vehicles:all, includes:['Mechanical and electrical inspection','Noise and vibration assessment','Tyre and brake condition checks','Repair estimate and digital report'], note:'Advanced electronic scanning depends on vehicle compatibility and may cost extra.' },
  { id:'electrical', name:'Lights & electrical', subtitle:'Small fixes. Brighter journeys.', category:'battery', price:249, original:399, time:'30–60 min', rating:'4.8', reviews:'530', art:'bulb', vehicles:all, includes:['Light and horn diagnosis','Fuse and wiring inspection','Connector cleaning','Repair estimate'], note:'Replacement bulbs, fuses and wiring work are extra.' },
  { id:'detailing', name:'Premium detailing', subtitle:'A little extra love for your ride.', category:'cleaning', price:899, original:1199, time:'2–3 hrs', rating:'4.9', reviews:'610', art:'wash', vehicles:all, includes:['Detailed exterior wash','Paint decontamination','Hand-applied protective wax','Trim and tyre dressing'], note:'Safe parking, water and electricity required. Paint correction is excluded.' },
  { id:'ac', name:'AC diagnosis', subtitle:'Cool drives, even in Indian summers.', category:'repairs', price:499, original:699, time:'45–60 min', rating:'4.8', reviews:'450', art:'fan', vehicles:['car'], includes:['Cooling performance test','Cabin filter inspection','Compressor and vent checks','Repair estimate'], note:'Refrigerant, leak repairs and replacement parts are extra.' },
  { id:'alignment', name:'Wheel alignment', subtitle:'Stay on the straight and narrow.', category:'tyres', price:599, original:799, time:'60–90 min', rating:'4.8', reviews:'390', art:'tyre', vehicles:['car'], includes:['Workshop pickup coordination','Computerized wheel alignment','Steering centering','Alignment report'], note:'Workshop service. Wheel balancing and weights are extra.' },
  { id:'clutch', name:'Clutch & gear inspection', subtitle:'Bring back those effortless shifts.', category:'repairs', price:349, original:499, time:'45–60 min', rating:'4.8', reviews:'380', art:'engine', vehicles:combustion, includes:['Clutch free-play check','Cable adjustment where applicable','Gear shift inspection','Repair recommendation'], note:'Internal repairs and replacement parts are extra and may require workshop service.' },
  { id:'ev-check', name:'EV wellness check', subtitle:'Good energy for your electric ride.', category:'periodic', price:499, original:699, time:'45–60 min', rating:'4.9', reviews:'620', art:'ev', vehicles:['ev'], includes:['Dashboard fault review','Auxiliary battery and charger inspection','Brake and tyre inspection','Connector visual inspection'], note:'High-voltage pack work and proprietary firmware diagnostics require an authorized service centre.' },
  { id:'inspection', name:'Pre-purchase inspection', subtitle:'Meet your next ride with confidence.', category:'repairs', price:799, original:999, time:'60–90 min', rating:'4.9', reviews:'510', art:'diagnostic', vehicles:all, includes:['Comprehensive condition inspection','Accident and wear indicators review','Test ride if permitted','Photo report with estimated repairs'], note:'Inspection is based on accessible components; ownership and legal-document verification are excluded.' },
  { id:'pickup', name:'Workshop pickup & drop', subtitle:'We’ll handle the workshop run.', category:'rescue', price:399, original:549, time:'Scheduled', rating:'4.8', reviews:'870', art:'truck', vehicles:all, includes:['Scheduled pickup coordination','Vehicle handover checklist','Workshop drop-off within 5 km','Return pickup coordination'], note:'Workshop charges and additional distance are extra. Return trip time is confirmed separately.' },
  { id:'accessories', name:'Accessory installation', subtitle:'Make your ride your own.', category:'repairs', price:299, original:449, time:'45–60 min', rating:'4.8', reviews:'310', art:'toolbox', vehicles:all, includes:['Compatibility assessment','Installation of one simple accessory','Mounting safety check','Basic function test'], note:'Accessory cost is extra. Major electrical modifications and safety-critical alterations are excluded.' },
];
export const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:2}).format(value);
export function priceFor(service, type) { return Math.round(service.price * (vehicleTypes.find(v=>v.id===type)?.factor || 1)); }
export function supportsService(service,vehicle){
  if(!service.vehicles.includes(vehicle?.type))return false;
  if(isElectric(vehicle)&&['oil-change','clutch','petrol','diesel'].includes(service.id))return false;
  if(service.id==='petrol'&&vehicle.fuelType==='diesel')return false;
  if(service.id==='diesel'&&vehicle.fuelType&&vehicle.fuelType!=='diesel')return false;
  return true;
}
export function quote(items, type, coupon='', fuelType) {
  let subtotal = 0;
  const lines = items.map(item => {
    const service = services.find(s=>s.id===item.id);
    if (!service || !supportsService(service,{type,fuelType}) || !Number.isInteger(item.quantity) || item.quantity<1 || item.quantity>3) throw new Error('Please check your selected services and vehicle.');
    const unitPrice=priceFor(service,type); subtotal+=unitPrice*item.quantity;
    return {id:service.id,name:service.name,quantity:item.quantity,unitPrice};
  });
  const code=coupon.trim().toUpperCase();
  if(code && code!=='FIRSTFIX') throw new Error('That offer code is not valid. Try FIRSTFIX.');
  const discount=code && subtotal>=499?Math.min(150,Math.round(subtotal*.15)):0;
  if(code && subtotal<499) throw new Error('FIRSTFIX needs a service subtotal of at least ₹499.');
  const visitFee=subtotal>=999?0:49;
  return {lines,subtotal,discount,visitFee,total:subtotal-discount+visitFee,coupon:code};
}
