const DB_NAME='garage-wallet-db', STORE='state', KEY='main';
const defaults={
  salary:2440,payday:25,bills:0,savingsTarget:200,savings:10000,emergencyTarget:5000,
  car:{loan:783,petrol:170,insurance:196,roadtax:8,maintenance:125,toll:200},
  bnpl:{atomeBalance:850,atomeMonthly:425,spayBalance:0,spayMonthly:499},
  expenses:[],carLogs:[],currency:'MYR'
};
let state=structuredClone(defaults);
const $=id=>document.getElementById(id);
const money=n=>'RM'+(Number(n)||0).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2});
const val=id=>Math.max(0,Number($(id).value)||0);
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function load(){try{const db=await openDB();const data=await new Promise((res,rej)=>{const tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(KEY);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});if(data)state={...structuredClone(defaults),...data,car:{...defaults.car,...data.car},bnpl:{...defaults.bnpl,...data.bnpl}};db.close()}catch(e){toast('Local database unavailable. Changes may not persist.')}}
async function save(){try{const db=await openDB();await new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(state,KEY);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close()}catch(e){toast('Could not save data on this device.')}}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>t.classList.remove('show'),2300)}
const carTotal=()=>Object.values(state.car).reduce((a,b)=>a+(Number(b)||0),0);
const monthlyOut=()=>carTotal()+state.bnpl.atomeMonthly+state.bnpl.spayMonthly+state.bills;
const expenseTotal=()=>state.expenses.filter(x=>sameMonth(x.date)).reduce((a,x)=>a+x.amount,0);
function sameMonth(d){const a=new Date(d),b=new Date();return a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear()}
function render(){
 const out=monthlyOut(),logged=expenseTotal(),available=state.salary-out-logged,used=state.salary?((out+logged)/state.salary*100):0;
 $('monthLabel').textContent=new Date().toLocaleDateString('en-MY',{month:'long',year:'numeric'}).toUpperCase()+' OVERVIEW';
 $('available').textContent=money(available);$('salaryLabel').textContent='Salary '+money(state.salary);$('usedPct').textContent=Math.round(used)+'% allocated';
 $('outflow').textContent=money(out);$('logged').textContent=money(logged);$('budgetBar').style.width=Math.min(100,Math.max(0,used))+'%';
 $('healthPill').textContent=available>=0?'WITHIN BUDGET':'OVER BUDGET';
 $('carTotal').textContent=money(carTotal());$('bnplMonthly').textContent=money(state.bnpl.atomeMonthly+state.bnpl.spayMonthly);
 $('bnplOutstanding').textContent=money(state.bnpl.atomeBalance+state.bnpl.spayBalance);$('maintenanceMetric').textContent=money(state.car.maintenance);
 $('carBudgetBig').textContent=money(carTotal());$('atomeShow').textContent=money(state.bnpl.atomeBalance);$('spayShow').textContent=money(state.bnpl.spayBalance);
 $('expenseCount').textContent=state.expenses.length+' RECORDS';
 const sp=state.emergencyTarget?Math.min(100,state.savings/state.emergencyTarget*100):0;$('savingsBar').style.width=sp+'%';$('savingsProgress').textContent=money(state.savings)+' saved of '+money(state.emergencyTarget)+' target ('+Math.round(sp)+'%)';
 renderList('expenseHistory',state.expenses,'expense');renderList('carHistory',state.carLogs,'car');
}
function renderList(id,items,type){const el=$(id);el.innerHTML='';const sorted=[...items].sort((a,b)=>b.date.localeCompare(a.date));if(!sorted.length){el.innerHTML='<div class="notice"><p>No records yet. Add your first entry above.</p></div>';return}
 sorted.slice(0,60).forEach(item=>{const row=document.createElement('div');row.className='list-item';const left=document.createElement('div');const b=document.createElement('b');b.textContent=item.description||item.type;const small=document.createElement('small');small.textContent=[item.date,item.category||item.type,item.odometer?item.odometer+' km':'',item.notes||''].filter(Boolean).join(' • ');left.append(b,small);const right=document.createElement('div');right.style.display='flex';right.style.alignItems='center';right.style.gap='8px';const amount=document.createElement('strong');amount.textContent=money(item.amount);const del=document.createElement('button');del.className='delete';del.textContent='Delete';del.onclick=()=>deleteRecord(type,item.id);right.append(amount,del);row.append(left,right);el.append(row)})}
async function deleteRecord(type,id){if(!confirm('Delete this record?'))return;if(type==='expense')state.expenses=state.expenses.filter(x=>x.id!==id);else state.carLogs=state.carLogs.filter(x=>x.id!==id);await save();render();toast('Record deleted')}
function fillInputs(){['salary','payday','bills','savingsTarget','savings','emergencyTarget'].forEach(k=>$(k).value=state[k]??0);Object.keys(state.car).forEach(k=>$(k).value=state.car[k]);Object.keys(state.bnpl).forEach(k=>$(k).value=state.bnpl[k]);}
function readBnpl(){['atomeBalance','atomeMonthly','spayBalance','spayMonthly'].forEach(k=>state.bnpl[k]=val(k))}
function readMoney(){['salary','payday','bills','savingsTarget'].forEach(k=>state[k]=Number($(k).value)||0)}
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>showTab(btn.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>showTab(btn.dataset.go)));
function showTab(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));window.scrollTo({top:0,behavior:'smooth'})}
$('saveCar').onclick=async()=>{Object.keys(state.car).forEach(k=>state.car[k]=val(k));await save();render();toast('Car budget saved')};
$('saveMoney').onclick=async()=>{readMoney();await save();render();toast('Income and bills saved')};
$('saveSavings').onclick=async()=>{state.savings=val('savings');state.emergencyTarget=val('emergencyTarget');state.savingsTarget=val('savingsTarget');await save();render();toast('Savings updated')};
$('saveBnpl').onclick=async()=>{readBnpl();await save();fillInputs();render();toast('BNPL figures saved')};
$('payAtome').onclick=async()=>{readBnpl();const p=state.bnpl.atomeMonthly;if(!p)return toast('Enter a payment amount');state.bnpl.atomeBalance=Math.max(0,state.bnpl.atomeBalance-p);await save();fillInputs();render();toast('Atome balance updated')};
$('paySpay').onclick=async()=>{readBnpl();const p=state.bnpl.spayMonthly;if(!p)return toast('Enter a payment amount');state.bnpl.spayBalance=Math.max(0,state.bnpl.spayBalance-p);await save();fillInputs();render();toast('SPayLater balance updated')};
$('expenseDate').value=new Date().toISOString().slice(0,10);$('carDate').value=new Date().toISOString().slice(0,10);
$('expenseForm').onsubmit=async e=>{e.preventDefault();state.expenses.push({id:crypto.randomUUID(),description:$('expenseDesc').value.trim(),amount:val('expenseAmount'),date:$('expenseDate').value,category:$('expenseCategory').value});await save();e.target.reset();$('expenseDate').value=new Date().toISOString().slice(0,10);render();toast('Expense saved')};
$('carLogForm').onsubmit=async e=>{e.preventDefault();state.carLogs.push({id:crypto.randomUUID(),type:$('carType').value,amount:val('carAmount'),date:$('carDate').value,odometer:$('odometer').value,notes:$('carNotes').value.trim()});await save();e.target.reset();$('carDate').value=new Date().toISOString().slice(0,10);render();toast('Vehicle record saved')};
$('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify({app:'Garage Wallet',version:1,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='garage-wallet-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Backup created. Save it to iCloud Drive.')};
$('importFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(!obj.state||!obj.state.car||!obj.state.bnpl)throw Error('Invalid backup');if(!confirm('Restore this backup? Current app data will be replaced.'))return;state={...structuredClone(defaults),...obj.state,car:{...defaults.car,...obj.state.car},bnpl:{...defaults.bnpl,...obj.state.bnpl}};await save();fillInputs();render();toast('Backup restored')}catch(err){toast('Could not read this backup file')}e.target.value=''};
$('resetBtn').onclick=async()=>{if(!confirm('Permanently reset all app data on this device? Export a backup first if needed.'))return;state=structuredClone(defaults);await save();fillInputs();render();toast('App reset')};
async function init(){await load();fillInputs();render();if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});}
init();