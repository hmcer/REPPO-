const ST=[['Solicitado','Hemos recibido tu solicitud.'],['Técnico en camino','Tu técnico se dirige a ti.'],['En reparación','Tu equipo está siendo revisado.'],['Completado','Servicio finalizado.']];
const ETA=['Esperando confirmación','Llega en 20 minutos','Tu equipo está en reparación','Servicio finalizado'];
const CUR={id:'cur',s:'Cambio de pantalla',e:'Celular',t:'Juan Mejía',i:'JM',l:'Oro',f:'Hoy',m:'A domicilio'};
const P0={id:'p1',s:'Revisión de portátil',e:'Portátil',t:'Laura Ríos',i:'LR',l:'Plata',f:'Mañana, 3:00 p. m.',m:'En taller'};
const H0=[
{id:'h1',s:'Cambio de pantalla',e:'Celular',t:'Carlos Ramírez',i:'CR',l:'Oro',f:'Hace 2 días',m:'A domicilio'},
{id:'h2',s:'Mantenimiento',e:'Portátil',t:'Andrea López',i:'AL',l:'Plata',f:'Hace 4 días',m:'En taller'},
{id:'h3',s:'Falla de batería',e:'Celular',t:'Carlos Ramírez',i:'CR',l:'Oro',f:'Hace 1 semana',m:'A domicilio'}];
let tab='curso',rs=4,rid=null;
const S=DB.get();
if(S.step==null)S.step=1;S.rated=Object.assign({h1:5,h3:4},S.rated);S.cancel=S.cancel||[];S.pend=S.pend||[];
const save=()=>DB.set(S);
const star=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const who=x=>`<div class="who"><span class="av">${x.i}</span><div><b>${x.t}</b><div class="mut sm">${x.e} · ${x.m}</div></div><span class="lv" style="--c:${LV[x.l]}">${x.l}</span></div>`;
const pendList=()=>[P0,...S.pend].filter(p=>!S.cancel.includes(p.id));
const histList=()=>(S.step==3?[CUR]:[]).concat(H0);

function curso(){
  const done=S.step==3,r=S.rated.cur;
  return `<div class="lst"><div class="card big"><div class="crd"><div><span class="ok">${ETA[S.step]}</span><h3 style="margin-top:4px">${CUR.s}</h3><p class="mut sm">Solicitud #RP-1042 · Hoy, 3:00 p. m.</p></div>${who(CUR)}</div>
  <div class="stl">${ST.map(([a,b],i)=>{const c=i<S.step||(done&&i==S.step)?'d':i==S.step?'n':'';return `<div class="sti ${c}"><i>${c=='d'?'✓':''}</i><b>${a}</b><small>${b}</small></div>`}).join('')}</div>
  <div class="row">${done?(r?`<span class="ok">Calificaste este servicio: <span class="stv">${star(r)}</span></span>`:'<button class="btn" data-rate="cur">Calificar servicio</button>'):'<button class="btn navy s" data-demo="Llamar al técnico">Llamar</button><button class="btn ghost s" data-demo="Enviar mensaje">Mensaje</button>'}
  <button class="btn ghost s" data-adv ${done?'hidden':''}>Avanzar estado (demo)</button><button class="btn ghost s" data-reset>Reiniciar demo</button></div></div>
  <div class="card"><h3>Detalle del servicio</h3><div class="pay"><span class="mut">Equipo y falla</span><span>Celular · No enciende</span></div><div class="pay"><span class="mut">Ubicación</span><span>Barrio El Prado</span></div><div class="pay"><span class="mut">Revisión</span><span>$ 40.000</span></div><div class="pay"><span class="mut">Servicio de Reppo</span><span>$ 4.000</span></div><div class="pay t"><span>Total estimado</span><span>$ 44.000</span></div></div></div>`;
}
function pendH(l){
  if(!l.length)return '<div class="card"><p class="mut">No tienes solicitudes pendientes.</p><a class="btn s" style="align-self:flex-start" href="tecnicos.html">Buscar un técnico</a></div>';
  return `<div class="lst">${l.map(p=>`<div class="card big"><div class="crd"><div><span class="warn">Pendiente de confirmación</span><h3 style="margin-top:4px">${p.s}</h3><p class="mut sm">${p.f}</p></div>${who(p)}</div><div class="row"><button class="btn navy s" data-det="${p.id}">Ver detalle</button><button class="btn ghost s" data-cancel="${p.id}">Cancelar solicitud</button></div></div>`).join('')}</div>`;
}
function histH(l){
  return `<div class="lst">${l.map(h=>{const r=S.rated[h.id];return `<div class="card big"><div class="crd"><div><h3>${h.s}</h3><p class="mut sm">${h.f}</p></div>${who(h)}</div>${r?`<span class="ok">Tu calificación: <span class="stv">${star(r)}</span></span>`:`<div class="row"><span class="mut sm" style="align-self:center">¿Cómo fue esta reparación?</span><button class="btn s" data-rate="${h.id}">Calificar al técnico</button></div>`}</div>`}).join('')}</div>`;
}
function render(){
  const p=pendList(),h=histList();
  $('#tabs').innerHTML=[['curso','En curso',1],['pend','Pendientes',p.length],['hist','Historial',h.length]].map(([k,t,n])=>`<button class="chip ${tab==k?'on':''}" data-tab="${k}">${t} (${n})</button>`).join('');
  $('#v').innerHTML=tab=='curso'?curso():tab=='pend'?pendH(p):histH(h);
}
function paint(){$('#sr').innerHTML=[1,2,3,4,5].map(n=>`<button type="button" class="${n<=rs?'on':''}" data-st="${n}" aria-label="${n} estrellas">★</button>`).join('');}
function rateD(id){
  rid=id;rs=4;const x=[CUR,...H0].find(h=>h.id==id);
  openD(`<form id="rt"><h2 style="font-size:24px">Calificar servicio</h2><p class="mut sm">${x.s} con ${x.t}</p><div class="stars" id="sr"></div>
  <b class="sm">Elige etiquetas que describan el servicio</b><div class="chips" style="margin:0">${['Puntual','Buen trato','Reparación garantizada'].map(c=>`<button type="button" class="chip" data-tg>${c}</button>`).join('')}</div>
  <textarea class="in" rows="3" placeholder="Cuéntanos más (opcional)" aria-label="Comentario"></textarea><button class="btn w">Enviar calificación</button></form>`);
  paint();
}
document.addEventListener('click',e=>{
  const t=e.target,k=t.dataset;
  if(k.tab){tab=k.tab;render();}
  else if(k.adv!==undefined){S.step=Math.min(3,S.step+1);save();render();}
  else if(k.reset!==undefined){S.step=1;delete S.rated.cur;save();render();}
  else if(k.rate){rateD(k.rate);}
  else if(k.st){rs=+k.st;paint();}
  else if(k.tg!==undefined){t.classList.toggle('on');}
  else if(k.demo){openD(`<h2 style="font-size:22px">${k.demo}</h2><p class="mut">Esta función es una demostración. En la versión final se conectaría con el técnico asignado.</p>`);}
  else if(k.det){const p=pendList().find(x=>x.id==k.det);openD(`<h2 style="font-size:22px">Detalle de la solicitud</h2><p class="mut sm" style="margin-bottom:8px">${p.s}</p>${who(p)}<div class="pay"><span class="mut">Fecha y hora</span><span>${p.f}</span></div><div class="pay"><span class="mut">Modalidad</span><span>${p.m}</span></div><div class="pay"><span class="mut">Estado</span><span class="warn">Pendiente de confirmación</span></div>`);}
  else if(k.cancel){if(k.cancel=='p1')S.cancel.push('p1');else S.pend=S.pend.filter(x=>x.id!=k.cancel);save();render();}
});
document.addEventListener('submit',e=>{
  if(e.target.id!='rt')return;
  e.preventDefault();S.rated[rid]=rs;save();
  e.target.innerHTML='<h2 style="font-size:24px">¡Gracias por tu calificación!</h2><p class="mut">Tu reseña ayuda a que otros usuarios elijan mejor.</p><button class="btn w" type="button" onclick="d.close()">Cerrar</button>';
});
d.addEventListener('close',render);
render();
