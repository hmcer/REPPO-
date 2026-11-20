const P=document.body.dataset.page;
const L=[['index.html','Inicio','inicio'],['tecnicos.html','Técnicos','tecnicos'],['niveles.html','Niveles','niveles'],['mis-solicitudes.html','Mis solicitudes','mis-solicitudes'],['para-tecnicos.html','Para técnicos','para-tecnicos']];
document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="wrap nav"><a class="logo" href="index.html">Repp<i>o</i></a>
<nav class="links" aria-label="Principal">${L.map(l=>`<a href="${l[0]}" ${l[2]==P?'aria-current="page"':''}>${l[1]}</a>`).join('')}</nav>
<div class="acts"><button class="btn ghost s" data-auth="login">Iniciar sesión</button><button class="btn s" data-auth="registro">Crear cuenta</button></div></div></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><span><b class="logo" style="font-size:20px">Repp<i>o</i></b> · Proyecto académico, Corporación Universidad de la Costa (CUC)</span><span>Batista · Martínez · Cervantes · Cabrera</span></div></footer><dialog id="d" aria-label="Reppo"></dialog>`);
const T=[
{n:'Carlos Ramírez',i:'CR',e:['Celular'],d:'Reparación de celulares',l:'Oro',r:128,a:'Disponible hoy',s:'4,9'},
{n:'Andrea López',i:'AL',e:['Portátil'],d:'Reparación de portátiles',l:'Plata',r:96,a:'Disponible mañana',s:'4,7'},
{n:'Miguel Torres',i:'MT',e:['Consola','Electrodoméstico'],d:'Reparación avanzada',l:'Platino',r:212,a:'Disponible hoy',s:'4,9'},
{n:'Laura Ríos',i:'LR',e:['Portátil','Celular'],d:'Portátiles y celulares',l:'Plata',r:63,a:'Disponible mañana',s:'4,7'}];
const LV={Bronce:'#C98B55',Plata:'#A9B6C2',Oro:'#E0A92B',Platino:'#6FA8DC'};
const F=['Todos','Celular','Portátil','Consola','Electrodoméstico'];
const $=s=>document.querySelector(s),d=$('#d');
const DB={get(){try{return JSON.parse(localStorage.getItem('reppo'))||{}}catch(e){return{}}},set(v){try{localStorage.setItem('reppo',JSON.stringify(v))}catch(e){}}};
let cur=null;
let filt=new URLSearchParams(location.search).get('equipo');if(!F.includes(filt))filt='Todos';
function list(){
  if(!$('#tl'))return;
  $('#chips').innerHTML=F.map(f=>`<button class="chip ${f==filt?'on':''}" data-f="${f}">${f=='Todos'?f:f+'s'}</button>`).join('');
  const r=T.filter(t=>filt=='Todos'||t.e.includes(filt));
  $('#tl').innerHTML=r.map(t=>`<article class="card"><div class="who"><span class="av">${t.i}</span><div><b>${t.n}</b><div class="mut sm">${t.d}</div></div></div>
  <div class="who"><span class="lv" style="--c:${LV[t.l]}">${t.l}</span><span class="sm">★ ${t.s} · ${t.r} reparaciones</span></div>
  <span class="ok">${t.a}</span><button class="btn navy s" data-req="${T.indexOf(t)}">Solicitar servicio</button></article>`).join('')||'<p class="mut">Aún no hay técnicos para este tipo de equipo.</p>';
}
function openD(h){d.innerHTML=`<form method="dialog" style="gap:0"><button class="x" aria-label="Cerrar">×</button></form>`+h;d.showModal();}
let mode='login',role='u';
function auth(){
  const reg=mode=='registro',tec=role=='t';
  openD(`<form id="af"><h2 style="font-size:26px">${reg?'Crea tu cuenta':'Bienvenido de nuevo'}</h2>
  <p class="mut sm">${reg?(tec?'Verificamos tu perfil para dar confianza a los usuarios.':'Encuentra técnicos con experiencia comprobada.'):'Ingresa para seguir tus solicitudes.'}</p>
  <div class="seg"><button type="button" class="${tec?'':'on'}" data-role="u">Usuario</button><button type="button" class="${tec?'on':''}" data-role="t">Técnico</button></div>
  ${reg?`<input class="in" placeholder="${tec?'Nombre completo o del taller':'Nombre completo'}" aria-label="Nombre" required>`:''}
  <input class="in" type="email" placeholder="Correo electrónico" aria-label="Correo" required>
  ${reg?'<input class="in" type="tel" placeholder="Teléfono" aria-label="Teléfono">':''}
  <input class="in" type="password" placeholder="Contraseña" aria-label="Contraseña" required>
  ${reg&&tec?'<p class="msg">Después del registro te pediremos documento de identidad, antecedentes y, si tienes, un certificado.</p>':''}
  ${reg?'<label class="sm"><input type="checkbox" required> Acepto los términos y condiciones</label>':''}
  <button class="btn w">${reg?(tec?'Enviar para verificación':'Crear cuenta'):'Iniciar sesión'}</button>
  <p class="sm mut" style="text-align:center">${reg?'¿Ya tienes cuenta?':'¿No tienes cuenta?'} <a href="#" data-m="${reg?'login':'registro'}" style="color:var(--tx);font-weight:700">${reg?'Inicia sesión':'Regístrate'}</a></p></form>`);
}
function req(k){const t=T[k];cur=t;
  openD(`<form id="rf"><h2 style="font-size:24px">Solicitar servicio</h2><p class="mut sm">Con ${t.n} · ${t.d}</p>
  <div class="seg"><button type="button" class="on" data-mod>A domicilio</button><button type="button" data-mod>En taller</button></div>
  <input class="in" type="datetime-local" aria-label="Fecha y hora">
  <input class="in" placeholder="Dirección de servicio" aria-label="Dirección">
  <textarea class="in" rows="3" placeholder="Resumen de la falla" aria-label="Falla"></textarea>
  <button class="btn w">Confirmar solicitud</button></form>`);
}
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.dataset.f){filt=t.dataset.f;list();return;}
  if(t.dataset.req!==undefined){req(+t.dataset.req);return;}
  if(t.dataset.auth){mode=t.dataset.auth;role=t.dataset.role||'u';auth();return;}
  if(t.dataset.m){e.preventDefault();mode=t.dataset.m;auth();return;}
  if(t.dataset.role&&d.open){role=t.dataset.role;auth();return;}
  if(t.dataset.mod!==undefined){[...t.parentNode.children].forEach(c=>c.classList.toggle('on',c==t));return;}
  if(t==d)d.close();
});
document.addEventListener('submit',e=>{
  if(e.target.id=='af'){e.preventDefault();if(!e.target.querySelector('.msg.demo'))e.target.insertAdjacentHTML('beforeend','<p class="msg demo">Esto es una demostración: aquí se conectaría con el sistema de cuentas.</p>');}
  if(e.target.id=='rf'){e.preventDefault();
    const f=e.target,ins=f.querySelectorAll('.in'),fe=ins[0].value,m=f.querySelector('.seg .on').textContent;
    const st=DB.get();st.pend=st.pend||[];
    st.pend.push({id:'n'+Date.now(),s:ins[2].value.trim()||'Servicio solicitado',t:cur.n,i:cur.i,l:cur.l,e:cur.e[0],m,f:fe?new Date(fe).toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'}):'Fecha por confirmar'});DB.set(st);
    f.innerHTML='<h2 style="font-size:24px">Solicitud enviada</h2><p class="mut">Quedó como pendiente hasta que el técnico la acepte. Puedes ver su estado en Mis solicitudes.</p><a class="btn w" href="mis-solicitudes.html">Ver mis solicitudes</a><button class="btn ghost w" onclick="d.close()" type="button">Cerrar</button>';}
});
list();
