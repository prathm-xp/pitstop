import {randomUUID} from 'node:crypto';
import {fuelsFor,validDate,indiaToday} from './public/vehicle-data.js';
const ensure=(condition,message)=>{if(!condition)throw new Error(message);};
function field(value,label,max=100){if(value==null)return '';ensure(typeof value==='string',`${label} must be text.`);ensure(value.trim().length<=max,`${label} is too long.`);return value.trim();}
function date(value,label){const result=field(value,label,10);ensure(!result||validDate(result),`Enter a real date for ${label}.`);ensure(!result||Number(result.slice(0,4))>=1900,`${label} must be in 1900 or later.`);return result;}
export function validateIdentity(body,existing,vehicles){
  const type=field(body.type,'Vehicle type',20);
  ensure(['scooter','bike','superbike','car','ev'].includes(type),'Choose a vehicle type.');
  const brand=field(body.brand,'Brand',40),model=field(body.model,'Model',60);
  ensure(brand.length>=2&&model.length>=2,'Enter the brand and model.');
  const number=field(body.number,'Registration number',20).toUpperCase().replace(/\s/g,'');
  ensure(!number||/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(number)||/^\d{2}BH\d{4}[A-Z]{1,2}$/.test(number),'Enter a valid Indian registration or leave it blank.');
  ensure(!number||!vehicles.some(v=>v.id!==existing?.id&&v.number===number),'This registration is already saved in your garage.');
  ensure(body.year===undefined||body.year===null||typeof body.year==='string'||typeof body.year==='number','Choose a valid model year.');
  const year=body.year===undefined?existing?.year??null:body.year===''||body.year===null?null:Number(body.year);
  const maxYear=Number(indiaToday().slice(0,4))+1;
  ensure(year===null||Number.isInteger(year)&&year>=1900&&year<=maxYear,`Choose a model year between 1900 and ${maxYear}, or leave it blank.`);
  const fuelType=body.fuelType===undefined?(existing?.fuelType&&fuelsFor(type).includes(existing.fuelType)?existing.fuelType:type==='ev'?'electric':'petrol'):field(body.fuelType,'Fuel type',20);
  ensure(fuelsFor(type).includes(fuelType),'Choose a fuel type compatible with the vehicle type.');
  return {id:existing?.id||randomUUID(),type,brand,model,number,year,fuelType,documents:existing?.documents||{},challans:existing?.challans||[]};
}
export function validateDocuments(body,existing={}){
  ensure(body&&typeof body==='object'&&!Array.isArray(body),'Enter document details.');
  const result={...existing};
  for(const kind of ['registration','insurance','puc']){
    if(body[kind]===undefined)continue;
    const data=body[kind];ensure(data&&typeof data==='object'&&!Array.isArray(data),'Enter valid document details.');
    const startsOn=date(data.startsOn,kind==='registration'?'registration date':`${kind} issue date`),expiresOn=date(data.expiresOn,`${kind} expiry`);
    ensure(!startsOn||!expiresOn||startsOn<=expiresOn,`${kind==='puc'?'PUC':kind[0].toUpperCase()+kind.slice(1)} expiry must be on or after its start or issue date.`);
    result[kind]={startsOn,expiresOn};
    if(kind==='registration')result[kind].rto=field(data.rto,'RTO',80);
    else result[kind].number=field(data.number,kind==='puc'?'PUC certificate number':'Policy number',64);
    if(kind==='insurance')result[kind].provider=field(data.provider,'Insurer',80);
  }
  return result;
}
export function validateChallan(body,existing,records){
  const reference=field(body.reference,'Challan number',64),description=field(body.description,'Reason',250),location=field(body.location,'Location',120);
  ensure(reference.length>=3,'Enter the challan number (at least 3 characters).');
  ensure(!records.some(c=>c.id!==existing?.id&&c.reference.toLowerCase()===reference.toLowerCase()),'This challan number is already recorded for the vehicle.');
  const issuedOn=date(body.issuedOn,'challan issue date');ensure(issuedOn&&issuedOn<=indiaToday(),'Choose a challan issue date on or before today.');
  ensure(description.length>=3,'Add a brief reason or description.');
  const amount=Number(body.amount);ensure((typeof body.amount==='number'||typeof body.amount==='string'&&body.amount.trim()!=='')&&Number.isFinite(amount)&&amount>0&&amount<=10000000&&Math.abs(Math.round(amount*100)-amount*100)<.000001,'Enter a positive challan amount with up to two decimal places.');
  const status=field(body.status,'Status',20);ensure(['unpaid','paid','disputed'].includes(status),'Choose an unpaid, paid or disputed status.');
  return {id:existing?.id||randomUUID(),reference,description,location,issuedOn,amount,status,source:'manual',createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
}
