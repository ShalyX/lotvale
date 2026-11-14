// Optional live acceptance: creates a fictional account using https://mail.tm.
// No test credentials, verification codes or reset URLs are written to disk.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
const base = process.env.LOTVALE_TEST_URL;
assert.ok(base, 'Set LOTVALE_TEST_URL to the exact trusted app origin. This sends real QA emails.');
const report = [];
const mark = name => { report.push({name, status:'passed'}); console.log('PASS', name); };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const jar = new Map();
async function app(path, method='GET', body, cookies=true) {
  const r = await fetch(base+path, {method, redirect:'manual', signal:AbortSignal.timeout(20000), headers:{Origin:base,
    ...(body ? {'Content-Type':'application/json'} : {}),
    ...(cookies ? {Cookie:[...jar].map(([k,v])=>k+'='+v).join('; ')} : {})},
    body:body ? JSON.stringify(body) : undefined});
  if(cookies) for(const cookie of r.headers.getSetCookie()) {
    const first=cookie.split(';')[0], i=first.indexOf('=');
    if(/max-age=0/i.test(cookie)) jar.delete(first.slice(0,i));
    else jar.set(first.slice(0,i),first.slice(i+1));
  }
  return r;
}
let mailboxToken;
async function mail(path, body) {
  const r=await fetch('https://api.mail.tm'+path,{method:body?'POST':'GET',signal:AbortSignal.timeout(10000),headers:{
    'Content-Type':'application/json',...(mailboxToken?{Authorization:'Bearer '+mailboxToken}:{})},
    body:body?JSON.stringify(body):undefined});
  if(!r.ok) throw Error('QA mailbox HTTP '+r.status);
  return r.json();
}
async function delivered(subject) {
  let lastObservation='No matching email received';
  for(let i=0;i<8;i++) {
    await pause(8000);
    try {
      const list=await mail('/messages');
      const message=list['hydra:member'].find(m=>m.subject.includes(subject));
      if(message) { await pause(1500); return await mail('/messages/'+message.id); }
      lastObservation='No matching email among '+list['hydra:member'].length+' inbox messages';
    } catch(e) { lastObservation=e.message; }
  }
  throw Error('QA mailbox check timed out: '+lastObservation+'. Do not infer a general email outage.');
}
try {
  const domains=await mail('/domains');
  const email='lotvale-qa-'+crypto.randomBytes(10).toString('hex')+'@'+domains['hydra:member'][0].domain;
  const password=crypto.randomBytes(24).toString('hex'), newPassword=crypto.randomBytes(24).toString('hex');
  await mail('/accounts',{address:email,password});
  mailboxToken=(await mail('/token',{address:email,password})).token;
  let r=await app('/api/auth/sign-up/email','POST',{name:'Fictional Email QA',email,password});
  assert.equal(r.status,200,'Signup');
  assert.equal((await app('/api/business')).status,401,'Unverified account must not access business');
  assert.equal((await app('/api/auth/sign-in/email','POST',{email,password})).status,403,'Unverified sign-in');
  mark('Signup requires email verification and denies business access');
  const verification=await delivered('Verify Your Email');
  const otp=verification.text.match(/\b\d{6}\b/)?.[0]; assert.ok(otp,'Delivered code');
  r=await app('/api/auth/email-otp/verify-email','POST',{email,otp:otp==='000000'?'111111':'000000'});
  assert.ok(r.status>=400,'Wrong code must fail');
  r=await app('/api/auth/email-otp/verify-email','POST',{email,otp});
  assert.equal(r.status,200,'Delivered code accepted');
  assert.equal((await r.json()).user.emailVerified,true);
  mark('Actual inbox delivery, incorrect-code rejection and verification');
  assert.equal((await app('/api/business','PUT',{name:'Fictional Recovery QA',currency:'USD',address:'QA only',contact_email:''})).status,200);
  const id=crypto.randomUUID();
  assert.equal((await app('/api/business/purchases','POST',{id,title:'Email recovery QA purchase'})).status,201);
  const priorCookies=[...jar].map(([k,v])=>k+'='+v).join('; ');
  r=await app('/api/auth/request-password-reset','POST',{email,redirectTo:base+'/auth/reset-password'});
  assert.equal(r.status,200,'Request reset');
  const reset=await delivered('Reset Your Password');
  const resetUrl=(reset.text+' '+(reset.html||[]).join(' ')).match(/https?:\/\/[^\s"<>]+/g)?.find(url=>url.includes('reset-password'));
  assert.ok(resetUrl,'Reset email link');
  r=await fetch(resetUrl,{redirect:'manual',signal:AbortSignal.timeout(20000)}); assert.equal(r.status,302);
  const destination=new URL(r.headers.get('location'));
  assert.equal(destination.origin,new URL(base).origin); assert.equal(destination.pathname,'/auth/reset-password');
  const token=destination.searchParams.get('token'); assert.ok(token);
  assert.equal((await app('/api/auth/reset-password','POST',{token,newPassword})).status,200);
  mark('Reset email delivered and link resets password');
  assert.equal((await fetch(base+'/api/business',{headers:{Cookie:priorCookies},signal:AbortSignal.timeout(20000)})).status,401,'Old session revoked');
  jar.clear();
  assert.equal((await app('/api/auth/sign-in/email','POST',{email,password})).status,401,'Old password denied');
  assert.equal((await app('/api/auth/sign-in/email','POST',{email,password:newPassword})).status,200);
  r=await app('/api/business/purchases/'+id); assert.equal(r.status,200);
  assert.equal((await r.json()).document.title,'Email recovery QA purchase');
  assert.ok((await app('/api/auth/reset-password','POST',{token,newPassword:password})).status>=400,'Single-use reset token');
  mark('Old password and session denied; new password recovers purchase; reset token single-use');
  assert.equal((await app('/app?sample=1','GET',undefined,false)).status,200);
  mark('Judge sample remains public');
} catch(e) {
  report.push({name:'Email acceptance',status:'failed',error:e.message}); process.exitCode=1;
}
await fs.writeFile(new URL('../reviews/auth-email-acceptance.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),base,report,limits:'Fictional disposable mailbox via https://mail.tm; actual provider emails. Does not establish inbox placement across all providers. No customer data or secrets retained.'},null,2));
