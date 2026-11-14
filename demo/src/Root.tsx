import React from 'react';
import {AbsoluteFill,Audio,Composition,Img,OffthreadVideo,Sequence,interpolate,spring,staticFile,useCurrentFrame} from 'remotion';
import timing from './timing.json';
const F=30,C={chalk:'#f5f5f2',paper:'#fbfbf9',ink:'#26272b',wine:'#792c42',rose:'#eadde0',sage:'#617869',pale:'#e5ece4',copper:'#ae8544',line:'#d7d1cf'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const sec=()=>useCurrentFrame()/F;
const ramp=(t:number,a:number,b:number,from=0,to=1)=>interpolate(t,[a,b],[from,to],clamp);
const settle=(t:number,at=0)=>spring({frame:(t-at)*F,fps:F,config:{damping:23,stiffness:120}});
const money=(n:number)=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
function Enter({at=0,dx=0,dy=45,children,style={}}:{at?:number,dx?:number,dy?:number,children:React.ReactNode,style?:React.CSSProperties}){const t=sec(),p=settle(t,at);return <div style={{opacity:p,transform:`translate(${(1-p)*dx}px,${(1-p)*dy}px)`,...style}}>{children}</div>}
function Mark({size=35}:{size?:number}){return <Img src={staticFile('mark.svg')} style={{width:size,height:size}}/>}
function Label({children,color=C.wine}:{children:React.ReactNode,color?:string}){return <div style={{fontSize:21,fontWeight:650,letterSpacing:2,color,textTransform:'uppercase'}}>{children}</div>}
function Title({children,style={}}:{children:React.ReactNode,style?:React.CSSProperties}){return <h2 style={{fontSize:76,fontWeight:650,lineHeight:1.06,letterSpacing:-3,margin:0,...style}}>{children}</h2>}
function Brand(){return <div style={{display:'flex',alignItems:'center',gap:12,fontSize:33,fontWeight:700,letterSpacing:-1.3}}><Mark/>Lotvale<span style={{color:C.wine,marginLeft:-10}}>.</span></div>}
type Crop=[number,number,number,number];
type Key={at:number,crop:Crop};
function Shot({file,video=false,keys=[{at:0,crop:[0,0,1600,1000]}],box=[80,190,1760,710],note='',border=true}:{file:string,video?:boolean,keys?:Key[],box?:number[],note?:string,border?:boolean}){
 const t=sec(),ts=keys.map(k=>k.at),crop=keys[0].crop.map((_,i)=>keys.length===1?keys[0].crop[i]:interpolate(t,ts,keys.map(k=>k.crop[i]),clamp));const [x,y,w,h]=crop,[bx,by,bw,bh]=box,scale=Math.min(bw/w,bh/h);
 const style:React.CSSProperties={position:'absolute',width:1600*scale,height:1000*scale,left:(bw-w*scale)/2-x*scale,top:(bh-h*scale)/2-y*scale};
 return <div style={{position:'absolute',left:bx,top:by,width:bw,height:bh,overflow:'hidden',background:C.paper,border:border?`1px solid ${C.line}`:undefined,boxShadow:border?'0 16px 38px #26272b0c':undefined}}>
 {video?<OffthreadVideo muted src={staticFile('media/'+file)} style={style}/>:<Img src={staticFile('media/'+file)} style={style}/>}
 {note&&<div style={{position:'absolute',bottom:0,right:0,padding:'8px 14px',background:C.chalk,fontSize:17,color:'#60565b'}}>{note}</div>}
 </div>;
}
function SupplyIcon({kind}:{kind:number}){return <svg viewBox="0 0 220 180" style={{width:210,height:172,overflow:'visible'}} fill="none" stroke={C.wine} strokeWidth="3.5" strokeLinejoin="round">
 {kind===0?<><path d="M58 35h104l-14 120H72Z" fill={C.rose}/><ellipse cx="110" cy="35" rx="52" ry="10" fill={C.paper}/><path d="M64 80h92l-6 46H69Z" fill={C.chalk}/><path d="M148 155h-76"/></>:kind===1?<><ellipse cx="110" cy="115" rx="75" ry="21" fill={C.rose}/><path d="M36 107v8M184 107v8"/><ellipse cx="110" cy="105" rx="75" ry="21" fill={C.paper}/><ellipse cx="110" cy="65" rx="61" ry="17" fill={C.rose}/><ellipse cx="110" cy="56" rx="61" ry="17" fill={C.paper}/><path d="M149 50h10" strokeWidth="6"/></>:kind===2?<><path d="M48 61l28-19h102l-23 87H71Z" fill={C.rose}/><path d="M48 61h107l23-19M155 61v68M63 77h83M67 94h75M71 111h67"/><path d="M71 129l84 0" strokeWidth="5"/></>:<>{[18,9,0].map((o,i)=><path key={i} d={`M${38+o} ${65+o}l100 -33 50 62 -102 35Z`} fill={i===2?C.paper:C.rose}/>)}</>}
 </svg>}
const supplies=[['2,400','coffee cups'],['2,400','matching lids'],['1,200','cup sleeves'],['4,000','paper napkins']];
function Opening(){const t=sec(),c=timing.cues;return <AbsoluteFill>
 <Enter at={.05} style={{position:'absolute',left:80,top:145}}><Label>THE OPENING-DAY PURCHASE</Label><Title style={{fontSize:92,marginTop:24}}>You have a café to open.</Title></Enter>
 <div style={{position:'absolute',left:80,right:80,top:350,display:'flex',gap:28}}>{supplies.map(([n,name],i)=>{const p=settle(t,c.supplies+i*.35);return <div key={name} style={{flex:1,height:345,background:C.paper,border:`1px solid ${C.line}`,padding:'22px 28px',opacity:p,transform:`translateY(${(1-p)*(90+i*20)}px) rotate(${(1-p)*(i%2?6:-6)}deg)`,boxShadow:'0 12px 28px #26272b09'}}><SupplyIcon kind={i}/><div style={{fontSize:45,fontWeight:650,letterSpacing:-1,marginTop:4}}>{n}</div><div style={{fontSize:27,marginTop:9}}>{name}</div></div>})}</div>
 <Enter at={c.budget} dx={-100} dy={0} style={{position:'absolute',left:80,top:740,width:690,padding:'25px 32px',background:C.wine,color:C.chalk,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:24}}>Your purchase budget</span><strong style={{fontSize:61,letterSpacing:-2}}>$850</strong></Enter>
 <Enter at={c.budget+.25} dx={90} dy={0} style={{position:'absolute',right:80,top:740,width:910,padding:'25px 32px',border:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:24}}>Everything needed by</span><strong style={{fontSize:61,letterSpacing:-2}}>Nov 21</strong></Enter>
 <Enter at={c.quotes} style={{position:'absolute',top:878,right:80,fontSize:23,color:C.wine}}>Three supplier quotes. One buying decision.</Enter>
 </AbsoluteFill>}
const quotes=[{name:'Moss Paperworks',ref:'MP-1048',date:'Nov 23',freight:'$45',minimum:'$0',color:C.wine},{name:'Counter Supply',ref:'CS-2206',date:'Nov 19',freight:'$28',minimum:'$0',color:C.copper},{name:'Westbridge Goods',ref:'WG-0311',date:'Nov 17',freight:'$18',minimum:'$300',color:C.sage}];
function Problem(){const t=sec(),late=settle(t,timing.cues.late),details=timing.cues.different;return <AbsoluteFill>
 <Enter style={{position:'absolute',left:80,top:145}}><Label>THE QUOTES DON’T TELL THE SAME STORY</Label><Title style={{marginTop:22}}>The cheapest pack price arrives late.</Title></Enter>
 <div style={{position:'absolute',left:80,right:80,top:350,display:'flex',gap:28}}>{quotes.map((q,i)=>{const p=settle(t,i*.15);return <div key={q.ref} style={{flex:1,position:'relative',height:370,padding:32,background:C.paper,border:`1px solid ${C.line}`,borderTop:`7px solid ${q.color}`,opacity:p,transform:`translateY(${(1-p)*80}px) rotate(${(1-p)*(i-1)*4}deg)`}}><Label color={q.color}>{q.ref}</Label><h3 style={{fontSize:34,margin:'20px 0 18px',letterSpacing:-1}}>{q.name}</h3><div style={{fontSize:24,height:58,color:q.color}}>{i===0?'Lowest pack prices':'Different terms to account for'}</div><div style={{display:'flex',justifyContent:'space-between',fontSize:27,borderTop:`1px solid ${C.line}`,paddingTop:18}}><span>Delivery</span><b>{q.date}</b></div><Enter at={details+i*.18} dy={18} style={{display:'flex',justifyContent:'space-between',fontSize:24,marginTop:17}}><span>Freight</span><b>{q.freight}</b></Enter><Enter at={details+.25+i*.18} dy={18} style={{display:'flex',justifyContent:'space-between',fontSize:24,marginTop:15}}><span>Order minimum</span><b>{q.minimum}</b></Enter>{i===0&&<div style={{position:'absolute',right:25,top:155,background:C.wine,color:'white',fontSize:20,fontWeight:700,padding:'10px 17px',transform:`rotate(-7deg) scale(${late})`,opacity:late}}>AFTER THE DEADLINE</div>}</div>})}</div>
 <div style={{position:'absolute',left:130,right:130,top:790,height:95}}><div style={{position:'absolute',left:0,right:0,top:42,height:3,background:C.line}}/>{['Nov 17','Nov 19','Nov 21','Nov 23'].map((d,i)=><div key={d} style={{position:'absolute',left:`${i*31}%`,top:28,color:i===2?C.wine:C.ink,fontSize:24}}><div style={{width:28,height:28,borderRadius:'50%',background:i===3?C.wine:C.chalk,border:`3px solid ${i>=2?C.wine:C.sage}`,marginBottom:14}}/>{d}{i===2&&<div style={{fontSize:18,fontWeight:700,marginTop:6}}>NEEDED BY</div>}</div>)}<div style={{position:'absolute',left:`${ramp(t,timing.cues.late,timing.cues.late+.9,62,93)}%`,top:-20,fontSize:20,color:C.wine,opacity:late}}>Moss arrives here ↓</div></div>
 </AbsoluteFill>}
function Product(){const t=sec(),cut=timing.cues.import;return <AbsoluteFill>
 <Enter style={{position:'absolute',left:80,top:135}}><Title>Bring the whole purchase together.</Title></Enter>
 <Sequence durationInFrames={Math.round(cut*F)}><Shot file="baseline.jpg" keys={[{at:0,crop:[0,75,1600,850]},{at:2.7,crop:[0,100,650,760]},{at:5.2,crop:[0,90,1600,850]}]} box={[80,245,1760,665]}/><Enter at={2} dx={-70} dy={0} style={{position:'absolute',right:100,top:420,padding:32,background:C.chalk,borderLeft:`5px solid ${C.wine}`,fontSize:32,lineHeight:1.6}}>The basket.<br/>The budget.<br/>The deadline.</Enter></Sequence>
 <Sequence from={Math.round(cut*F)} durationInFrames={150}><Shot file="import.mp4" video keys={[{at:0,crop:[0,90,1600,850]},{at:.8,crop:[400,260,790,570]},{at:4.7,crop:[400,180,790,700]}]} box={[80,245,1760,665]} note="Recorded quote import"/><div style={{position:'absolute',right:100,top:190,fontSize:22,color:C.wine}}>COUNTER SUPPLY / CS-2206</div></Sequence>
 </AbsoluteFill>}
function Serv(){const t=sec();return <AbsoluteFill>
 <Enter style={{position:'absolute',left:80,top:145}}><Label>THE INTERPRETATION STEP</Label><Title style={{fontSize:88,marginTop:22}}>SERV Reasoning</Title></Enter>
 <div style={{position:'absolute',left:80,top:395,width:470}}>{[['Supplier text',0],['Matched basket items',6.1],['Editable commercial terms',11.1]].map(([text,at],i)=><Enter key={i} at={Number(at)} dx={-50} dy={0} style={{padding:'25px 0',borderTop:`1px solid ${C.line}`,fontSize:29,lineHeight:1.3,color:t>=Number(at)?C.wine:C.ink}}><span style={{fontSize:19,marginRight:20}}>0{i+1}</span>{text}</Enter>)}<Enter at={14.2} style={{marginTop:36,fontSize:23,lineHeight:1.5}}>Returned as a draft.<br/>Ready for the buyer to inspect.</Enter></div>
 <Sequence durationInFrames={150}><Shot file="request.mp4" video box={[600,285,1240,625]} keys={[{at:0,crop:[400,240,790,650]},{at:3,crop:[400,300,790,590]}]} note="Actual SERV request · waiting shortened"/></Sequence>
 <Sequence from={150} durationInFrames={Math.round(7.2*F)}><Shot file="result-top.png" box={[600,285,1240,625]} keys={[{at:0,crop:[405,80,790,520]},{at:2.5,crop:[420,315,750,460]},{at:4.4,crop:[405,80,790,490]}]} note="Actual saved SERV response · held for reading"/></Sequence>
 <Sequence from={Math.round(12.2*F)} durationInFrames={210}><Shot file="review.mp4" video box={[600,285,1240,625]} keys={[{at:0,crop:[405,110,790,560]},{at:3,crop:[405,360,790,500]}]} note="Recorded returned draft"/></Sequence>
 <Sequence from={576}><Shot file="review-end.jpg" box={[600,285,1240,625]} keys={[{at:0,crop:[405,360,790,500]}]} note="Recorded returned draft"/></Sequence>
 </AbsoluteFill>}
function Review(){const t=sec(),change=8.5;let caption=t<3.7?'Check the pack size.':t<8.5?'Match the charges and date to the source.':'Confirm the terms you have reviewed.';return <AbsoluteFill>
 <Enter style={{position:'absolute',left:80,top:140}}><Label>SERV INTERPRETS. THE BUYER REVIEWS.</Label><Title style={{marginTop:22}}>Check the terms against the source.</Title></Enter>
 <Sequence durationInFrames={Math.round(4.6*F)}><Shot file="result-top.png" box={[80,310,1760,595]} keys={[{at:0,crop:[420,370,750,340]},{at:3.45,crop:[420,370,750,340]},{at:4.5,crop:[405,130,790,380]}]} note="Saved returned terms · review view"/></Sequence>
 <Sequence from={Math.round(4.6*F)} durationInFrames={Math.round((change-4.6)*F)}><Shot file="source-check.png" box={[80,310,1760,595]} keys={[{at:0,crop:[430,480,740,320]},{at:3,crop:[430,580,740,300]}]} note="Original supplier quote"/></Sequence>
 <Sequence from={Math.round(change*F)} durationInFrames={270}><Shot file="confirm.mp4" video box={[80,310,1760,595]} keys={[{at:0,crop:[405,390,790,560]},{at:5.7,crop:[405,540,790,420]},{at:8.3,crop:[280,80,1280,850]}]} note="Recorded source review and buyer confirmation"/></Sequence>
 <Sequence from={Math.round((change+9)*F)}><Shot file="reviewed-quotes.jpg" box={[80,310,1760,595]} keys={[{at:0,crop:[260,200,1300,740]}]} note="Terms reviewed and saved"/></Sequence>
 <div style={{position:'absolute',right:100,top:265,fontSize:24,color:C.wine}}>{caption}</div>
 </AbsoluteFill>}
function Digits({at=0,value='$755.08',size=114}:{at?:number,value?:string,size?:number}){const t=sec();return <div style={{display:'flex',fontSize:size,letterSpacing:-5,fontWeight:650,fontVariantNumeric:'tabular-nums',overflow:'hidden',color:C.wine}}>{value.split('').map((c,i)=>{const p=settle(t,at+i*.065);return <span key={i} style={{display:'inline-block',opacity:p,transform:`translateY(${(1-p)*size*1.1}px)`}}>{c}</span>})}</div>}
function Payoff(){const t=sec();return <AbsoluteFill>
 <Enter style={{position:'absolute',left:80,top:135}}><Label>THE COMPLETE PURCHASE</Label><Title style={{marginTop:20}}>One complete, on-time order.</Title></Enter>
 <Sequence durationInFrames={90}><Shot file="build.mp4" video box={[80,285,1760,625]} keys={[{at:0,crop:[0,80,1600,850]},{at:2.2,crop:[280,40,1280,700]}]} note="Recorded buying-plan calculation"/></Sequence>
 <Sequence from={90} durationInFrames={Math.round(8*F)}><Shot file="plan.mp4" video box={[80,285,1760,625]} keys={[{at:0,crop:[290,80,1260,650]},{at:3,crop:[310,80,1240,470]},{at:7.5,crop:[280,40,1280,850]}]} note="Actual complete plan"/></Sequence>
 <Sequence from={330} durationInFrames={Math.round(7.1*F)}>
 <Shot file="plan-still.jpg" box={[850,290,990,615]} keys={[{at:0,crop:[280,40,1280,850]}]} note="Recorded complete-plan result"/>
 <div style={{position:'absolute',left:80,top:305,width:660}}>{[['Merchandise',674.4],['Freight',28],['Tax',52.68]].map(([label,value],i)=><Enter key={String(label)} at={i*.3} dx={-90} dy={0} style={{display:'flex',justifyContent:'space-between',padding:'22px 0',borderBottom:`1px solid ${C.line}`,fontSize:31}}><span>{label}</span><b>${money(Number(value))}</b></Enter>)}<Enter at={1.2} style={{marginTop:28}}><Label>COMPLETE ORDER TOTAL</Label></Enter><Digits at={1.4}/><Enter at={2.2} style={{fontSize:25,marginTop:20,color:C.sage}}>All four items covered.</Enter></div>
 </Sequence>
 <Sequence from={Math.round(18.1*F)}>
 <div style={{position:'absolute',left:80,right:80,top:335,display:'flex',gap:38}}>
 <Enter dx={-140} dy={0} style={{width:740,padding:40,background:C.pale}}><Label color={C.sage}>WITHIN THE $850 BUDGET</Label><div style={{fontSize:104,fontWeight:650,letterSpacing:-4,marginTop:26}}>$94.92</div><div style={{fontSize:28,marginTop:18}}>budget remaining</div></Enter>
 <Enter at={.25} dx={140} dy={0} style={{flex:1,padding:40,border:`1px solid ${C.line}`,background:C.paper}}><Label>BEFORE THE NOV 21 DEADLINE</Label><div style={{display:'flex',alignItems:'center',gap:35,marginTop:35}}><strong style={{fontSize:76,color:C.wine}}>Nov 19</strong><div style={{width:120,height:3,background:C.sage}}/><span style={{fontSize:40}}>Nov 21</span></div><div style={{fontSize:28,marginTop:29}}>All items arrive two days before they’re needed.</div></Enter>
 </div><Enter at={.5} style={{position:'absolute',left:80,top:760,fontSize:29,color:C.wine}}>The late quote is excluded from this buying plan.</Enter>
 </Sequence>
 </AbsoluteFill>}
function Output(){const t=sec(),cloud=timing.cues.cloud;return <AbsoluteFill>
 <Enter style={{position:'absolute',left:80,top:135}}><Label>FROM DECISION TO SUPPLIER DRAFT</Label><Title style={{marginTop:22}}>Take the decision to your supplier.</Title></Enter>
 <Sequence durationInFrames={240}><Shot file="draft.mp4" video box={[80,290,1760,615]} keys={[{at:0,crop:[300,0,1260,800]},{at:2.2,crop:[530,300,1020,500]},{at:4.8,crop:[700,600,850,330]},{at:7.9,crop:[700,600,850,330]}]} note="Actual supplier draft · $755.08"/></Sequence>
 <Sequence from={240} durationInFrames={Math.round(2.4*F)}><Shot file="cloud-saved.png" box={[80,290,1760,615]} keys={[{at:0,crop:[0,0,1600,850]},{at:1.6,crop:[875,0,715,420]}]} note="Actual purchase saved to the business account"/></Sequence>
 <Sequence from={Math.round(10.4*F)}><Shot file="business-overview.png" box={[80,290,1760,615]} keys={[{at:0,crop:[150,130,1300,650]},{at:3,crop:[180,430,1250,330]}]} note="Actual saved purchase overview"/></Sequence>
 {t>timing.cues.automatic&&<div style={{position:'absolute',right:100,top:248,fontSize:23,fontWeight:650,color:C.wine}}>DRAFT / NOT SENT</div>}
 </AbsoluteFill>}
function Closing(){const t=sec();return <AbsoluteFill>
 <div style={{position:'absolute',left:100,top:230,width:300,height:300}}>{[0,1,2].map(i=>{const p=settle(t,i*.12);return <div key={i} style={{position:'absolute',inset:0,clipPath:`inset(${i*33.333}% 0 ${100-(i+1)*33.333}% 0)`,transform:`translateX(${(1-p)*(i===1?950:-950)}px)`,opacity:p}}><Mark size={300}/></div>})}</div>
 <Enter at={.35} dx={100} dy={0} style={{position:'absolute',left:490,top:230,right:100}}><Label>PURCHASE PLANNING</Label><Title style={{fontSize:91,marginTop:26}}>Understand the whole purchase<br/>before you place the order.</Title></Enter>
 <Enter at={.7} style={{position:'absolute',left:100,top:690,fontSize:49,color:C.wine,letterSpacing:-1}}>lotvale.vercel.app</Enter>
 <Enter at={1} style={{position:'absolute',left:100,top:790,fontSize:29}}>Quote interpretation powered by SERV Reasoning</Enter>
 </AbsoluteFill>}
function Film(){const f=useCurrentFrame(),t=f/F,caption=timing.captions.find(c=>t>=c.start&&t<c.end);const scenes=[Opening,Problem,Product,Serv,Review,Payoff,Output,Closing];return <AbsoluteFill style={{background:C.chalk,color:C.ink,fontFamily:'Segoe UI, Arial, sans-serif',overflow:'hidden'}}>
 <div style={{position:'absolute',left:80,right:80,top:39,zIndex:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}><Brand/><div style={{fontSize:18,color:'#635b60',letterSpacing:1.5,padding:'10px 15px',border:`1px solid ${C.line}`}}>FICTIONAL SAMPLE PURCHASE</div></div>
 {timing.chapters.map((c,i)=>{const Scene=scenes[i],start=Math.round(c.start*F);return <Sequence key={i} from={start} durationInFrames={Math.round(c.end*F)-start}><Scene/></Sequence>})}
 <Sequence from={Math.round(timing.lead*F)}><Audio src={staticFile('narration-master.wav')} volume={1}/></Sequence>
 {[timing.cues.supplies,timing.cues.supplies+.35,timing.cues.supplies+.7,timing.cues.supplies+1.05,timing.cues.budget,timing.chapters[1].start+.2,timing.chapters[1].start+.45,timing.chapters[1].start+.7,timing.chapters[5].start+12.4,timing.chapters[7].start+.2].map((s,i)=><Sequence key={'paper'+i} from={Math.round(s*F)} durationInFrames={8}><Audio src={staticFile('sfx/paper.wav')} volume={.6}/></Sequence>)}
 {caption&&<div style={{position:'absolute',bottom:27,left:100,right:100,zIndex:20,display:'flex',justifyContent:'center'}}><div style={{maxWidth:1640,fontSize:31,fontWeight:450,lineHeight:1.3,textAlign:'center',background:'rgba(245,245,242,.97)',padding:'12px 25px',borderRadius:3}}>{caption.text}</div></div>}
 </AbsoluteFill>}
export function Root(){return <Composition id="LotvaleStory" component={Film} durationInFrames={Math.round(timing.total*F)} fps={F} width={1920} height={1080}/>}
