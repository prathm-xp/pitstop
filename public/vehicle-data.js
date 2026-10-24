// A starter catalogue for selection, not an authoritative model-year database.
// Custom entries keep older, imported and unlisted vehicles supported.
export const vehicleCatalogue = {
  car: {
    'Maruti Suzuki':['Alto K10','Baleno','Brezza','Dzire','Ertiga','Fronx','Swift','Wagon R'],
    Hyundai:['Creta','Grand i10 Nios','i10','i20','Venue','Verna'],
    Tata:['Harrier','Nexon','Nexon EV','Punch','Punch EV','Safari','Tiago','Tiago EV','Tigor'],
    Mahindra:['Bolero','Scorpio','Scorpio N','Thar','XUV300','XUV3XO','XUV700'],
    Toyota:['Corolla Altis','Fortuner','Glanza','Innova Crysta','Innova Hycross','Urban Cruiser Hyryder'],
    Honda:['Amaze','City','Elevate','Jazz'], Kia:['Carens','Seltos','Sonet'],
    Renault:['Duster','Kiger','Kwid','Triber'], Skoda:['Kushaq','Octavia','Rapid','Slavia'],
    Volkswagen:['Polo','Taigun','Vento','Virtus'], MG:['Astor','Comet EV','Hector','ZS EV'],
    BMW:['3 Series','5 Series','X1','X3','X5'], 'Mercedes-Benz':['A-Class','C-Class','E-Class','GLA','GLC'],
    Audi:['A4','A6','Q3','Q5'], Nissan:['Magnite','Micra','Sunny'], Ford:['EcoSport','Endeavour','Figo']
  },
  bike: {
    Hero:['Glamour','HF Deluxe','Splendor Plus','Super Splendor','XPulse 200 4V','Xtreme 160R'],
    Honda:['CB350','Hornet 2.0','Shine','SP 125','Unicorn'],
    Bajaj:['CT 110','Dominar 400','Platina 100','Pulsar 150','Pulsar N250','Pulsar NS200'],
    TVS:['Apache RTR 160','Apache RTR 180','Apache RTR 200','Raider 125','Radeon','Sport'],
    'Royal Enfield':['Bullet 350','Classic 350','Himalayan','Hunter 350','Interceptor 650','Meteor 350'],
    Yamaha:['FZ','FZ-S','MT-15','R15 V4'], KTM:['125 Duke','200 Duke','250 Duke','390 Duke','RC 200','RC 390'],
    Suzuki:['Gixxer','Gixxer SF','V-Strom SX'], Jawa:['42','Perak'], Yezdi:['Adventure','Roadster','Scrambler']
  },
  scooter: {
    Honda:['Activa','Activa 6G','Activa 125','Dio','Dio 125'],
    TVS:['Jupiter','Jupiter 125','Ntorq 125','Scooty Pep+','Zest 110'],
    Suzuki:['Access 125','Avenis','Burgman Street'], Yamaha:['Aerox 155','Fascino 125','RayZR 125'],
    Hero:['Destini 125','Maestro Edge','Pleasure+'], Vespa:['SXL 125','VXL 125','VXL 150'],
    Aprilia:['SR 125','SR 160','SXR 160']
  },
  superbike: {
    Kawasaki:['Ninja 300','Ninja 650','Ninja ZX-6R','Ninja ZX-10R','Z900'],
    BMW:['F 900 R','G 310 R','G 310 RR','R 1250 GS','S 1000 RR'],
    Ducati:['Diavel','Monster','Multistrada','Panigale V2','Panigale V4'],
    Triumph:['Bonneville','Speed 400','Speed Triple','Street Triple','Tiger'],
    Suzuki:['GSX-R1000','Hayabusa','V-Strom 650'], Yamaha:['MT-09','YZF-R1','YZF-R3'],
    Honda:['CB650R','CBR650R','CBR1000RR'], 'Royal Enfield':['Continental GT 650','Interceptor 650'],
    KTM:['390 Duke','790 Duke']
  },
  ev: {
    Ather:['450S','450X','Rizta'], Ola:['S1 Air','S1 Pro','S1 X'], TVS:['iQube'],
    Bajaj:['Chetak'], 'Hero Vida':['V1','V2'], Revolt:['RV400'], Ampere:['Magnus','Primus']
  }
};
export const fuelNames={petrol:'Petrol',diesel:'Diesel',cng:'CNG / LPG',hybrid:'Hybrid',electric:'Electric'};
export const fuelsFor=type=>type==='ev'?['electric']:type==='car'?['petrol','diesel','cng','hybrid','electric']:['petrol','electric'];
export const isElectric=vehicle=>vehicle?.type==='ev'||vehicle?.fuelType==='electric';
export function indiaToday(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part=type=>parts.find(p=>p.type===type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
export const documentTypes=[{id:'registration',label:'Registration (RC)',short:'Registration',icon:'orders'},{id:'insurance',label:'Insurance',short:'Insurance',icon:'shield'},{id:'puc',label:'Pollution certificate (PUC)',short:'PUC',icon:'leaf'}];
export function expiryStatus(value,today=indiaToday()){
  if(!validDate(value))return {kind:'missing',label:'Expiry not saved',days:null};
  const days=Math.round((Date.parse(value+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
  if(days<0)return {kind:'expired',label:`Expired ${Math.abs(days)} day${days===-1?'':'s'} ago`,days};
  if(days===0)return {kind:'due',label:'Expires today',days};
  if(days<=30)return {kind:'due',label:`Expires in ${days} day${days===1?'':'s'}`,days};
  return {kind:'current',label:'Expiry saved',days};
}
export function vehicleDocuments(vehicle,today=indiaToday()){
  return documentTypes.map(type=>{
    const data=vehicle.documents?.[type.id]||{};
    const status=type.id==='puc'&&isElectric(vehicle)?{kind:'na',label:'Not applicable · electric',days:null}:expiryStatus(data.expiresOn,today);
    return {...type,data,...status,label:type.label,statusLabel:status.label};
  });
}
export function garageSummary(vehicles,today=indiaToday()){
  const records=vehicles.flatMap(vehicle=>vehicleDocuments(vehicle,today).map(doc=>({...doc,vehicle})));
  const challans=vehicles.flatMap(v=>v.challans||[]);
  return {due:records.filter(d=>d.kind==='due'),expired:records.filter(d=>d.kind==='expired'),missing:records.filter(d=>d.kind==='missing'),unpaid:challans.filter(c=>c.status==='unpaid'),disputed:challans.filter(c=>c.status==='disputed'),outstanding:challans.filter(c=>c.status==='unpaid').reduce((sum,c)=>sum+Math.round(c.amount*100),0)/100};
}
export const displayDate=value=>validDate(value)?new Date(value+'T00:00:00Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}):'Not saved';
