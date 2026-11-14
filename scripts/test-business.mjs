import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { sampleProject } from '../lib/sample.ts';
const base=process.env.LOTVALE_TEST_URL||'http://127.0.0.1:5180';
const report=[];
function client(){const jar=new Map();return async(path,method='GET',body)=>{const r=await fetch(base+path,{method,redirect:'manual',headers:{Origin:base,...(body?{'Content-Type':'application/json'}:{}),Cookie:[...jar].map(([k,v])=>k+'='+v).join('; ')},body:body?JSON.stringify(body):undefined});for(const c of r.headers.getSetCookie()){const first=c.split(';')[0],i=first.indexOf('=');if(/max-age=0/i.test(c))jar.delete(first.slice(0,i));else jar.set(first.slice(0,i),first.slice(i+1));}const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={text:text.slice(0,150)}}return {status:r.status,data,location:r.headers.get('location')};};}
const anon=client(),a=client(),b=client();
const mark=(name)=>{report.push({name,status:'passed'});console.log('PASS',name);};
const password=process.env.LOTVALE_TEST_PASSWORD;const email=process.env.LOTVALE_TEST_EMAIL;const otherEmail=process.env.LOTVALE_TEST_OTHER_EMAIL;
assert.ok(password&&email&&otherEmail,'Provide two verified, disposable QA accounts via LOTVALE_TEST_EMAIL, LOTVALE_TEST_OTHER_EMAIL and LOTVALE_TEST_PASSWORD. Never use customer accounts.');
try{
assert.equal((await anon('/api/business')).status,401);assert.match((await anon('/business')).location||'',/sign-in/);assert.equal((await anon('/app?sample=1')).status,200);mark('Unauthenticated APIs denied; business redirects; sample public');
let r=await a('/api/auth/sign-in/email','POST',{email,password});assert.equal(r.status,200,JSON.stringify(r.data));mark('Verified managed account sign-in');
r=await a('/api/business','PUT',{name:'Fictional QA Studio A',currency:'USD',address:'Demo address',contact_email:''});assert.equal(r.status,200,JSON.stringify(r.data));mark('Business onboarding');
const id=crypto.randomUUID();assert.equal((await a('/api/business/purchases','POST',{id,title:'Acceptance purchase'})).status,201);assert.equal((await a('/api/business/purchases','POST',{id,title:'Acceptance purchase'})).status,201);mark('Purchase creation is retry-safe');
let doc={...sampleProject(),id,title:'Cloud persistence acceptance',sample:false,workspaceState:{tab:'drafts',selectedId:null,planned:true}};r=await a('/api/business/purchases/'+id,'PUT',{revision:1,document:doc});assert.equal(r.status,200,JSON.stringify(r.data));assert.equal(r.data.revision,2);assert.equal((await a('/api/business/purchases/'+id)).data.document.title,doc.title);assert.equal((await a('/api/business/purchases/'+id)).data.document.workspaceState.tab,'drafts');mark('Purchase edits and chosen workflow persist in Postgres');
assert.equal((await a('/api/business/purchases/'+id,'PUT',{revision:1,document:{...doc,title:'stale'}})).status,409);assert.equal((await a('/api/business/purchases/'+id)).data.document.title,doc.title);mark('Stale revision cannot overwrite saved purchase');
assert.equal((await b('/api/auth/sign-in/email','POST',{email:otherEmail,password})).status,200);assert.equal((await b('/api/business/purchases/'+id)).status,404);assert.equal((await b('/api/business/purchases/'+id,'PUT',{revision:2,document:doc})).status,404);assert.equal((await b('/api/business/purchases')).data.purchases.length,0);mark('Cross-account reads and writes denied');
assert.equal((await a('/api/business/purchases/'+id,'PUT',{revision:2,document:{...doc,budgetCents:-1}})).status,400);mark('Malformed snapshot rejected');
assert.equal((await a('/api/auth/sign-out','POST',{})).status,200);assert.equal((await a('/api/business')).status,401);mark('Sign-out removes access');
const fresh=client();assert.equal((await fresh('/api/auth/sign-in/email','POST',{email,password:'incorrect-password'})).status,401);assert.equal((await fresh('/api/auth/sign-in/email','POST',{email,password})).status,200);assert.equal((await fresh('/api/business/purchases/'+id)).data.document.title,doc.title);mark('New-session sign-in recovers cloud purchase; wrong password denied');
assert.equal((await anon('/auth/reset-password')).status,200);assert.equal((await anon('/app?new=1')).status,200);mark('Password recovery entry and public local editor accessible');
}catch(e){report.push({name:'acceptance failure',status:'failed',error:e.message});console.error(e.message);process.exitCode=1;}
await fs.writeFile(new URL('../reviews/business-acceptance.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),base,report,limits:'API and server-render checks, not browser visual acceptance. Test accounts/data fictional.'},null,2));
