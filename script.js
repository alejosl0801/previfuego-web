/* ── Carruseles ── */
var _CS={};
function cs(id){if(!_CS[id])_CS[id]={idx:0,total:0};return _CS[id];}
function buildDots(id){var s=cs(id),el=document.getElementById(id+'-dots');if(!el)return;el.innerHTML='';for(var i=0;i<s.total;i++){var b=document.createElement('button');b.className='carr-dot'+(i===0?' active':'');b.setAttribute('data-i',i);b.setAttribute('aria-label','Foto '+(i+1));(function(n){b.onclick=function(){goSlide(id,n);startAp(id);};})(i);el.appendChild(b);}}
function goSlide(id,n){var s=cs(id);s.idx=((n%s.total)+s.total)%s.total;applySlide(id);}
function moveCarr(id,dir){var s=cs(id);goSlide(id,s.idx+dir);startAp(id);}
function applySlide(id){var s=cs(id);var t=document.getElementById(id+'-track');if(t){t.style.willChange='transform';t.style.transform='translateX(-'+(s.idx*100)+'%)';setTimeout(function(){if(t)t.style.willChange='';},450);}var c=document.getElementById(id+'-count');if(c)c.textContent=(s.idx+1)+' / '+s.total;document.querySelectorAll('#'+id+'-dots .carr-dot').forEach(function(d){d.classList.toggle('active',parseInt(d.getAttribute('data-i'))===s.idx);});}

/* Auto-count slides — no more hardcoded numbers */
function initCarr(id){
  var track=document.getElementById(id+'-track');
  if(!track)return;
  var total=track.querySelectorAll('.carr-slide').length;
  var s=cs(id);s.total=total;s.idx=0;
  applySlide(id);buildDots(id);
}

/* ── Galería ── */
function switchCat(cat,btn){
  document.querySelectorAll('.gal-cat-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  var grid=document.getElementById('galGroups');
  document.querySelectorAll('.gal-group').forEach(function(g){
    g.classList.toggle('visible',cat==='all'||g.id==='gal-'+cat);
  });
  if(cat==='all'){
    grid.classList.add('show-all');
    grid.style.gridTemplateColumns='';
    grid.style.maxWidth='';
    grid.style.margin='';
  }else{
    grid.classList.remove('show-all');
    grid.style.gridTemplateColumns='1fr';
    grid.style.maxWidth='640px';
    grid.style.margin='0 auto';
  }
}

/* ── Lightbox ── */
function openLb(src,alt){
  var img=document.getElementById('lbImg');
  img.src=src;
  img.alt=alt||'Foto de trabajo Previfuego';
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLb(){document.getElementById('lb').classList.remove('open');document.body.style.overflow='';}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();});

/* ── Calculadoras ── */
function switchCalc(id,btn){var wrap=btn.closest('.calc-wrap');wrap.querySelectorAll('.calc-tab').forEach(function(t){t.classList.remove('active');});wrap.querySelectorAll('.calc-panel').forEach(function(p){p.classList.remove('active');});btn.classList.add('active');document.getElementById('panel-'+id).classList.add('active');}

function calcularExtintores(){
  var area=parseFloat(document.getElementById('calcArea').value);
  var riesgo=document.getElementById('calcRiesgo').value;
  var tipo=document.getElementById('calcTipo').value;
  var cocina=document.getElementById('calcCocina').value;
  if(!area||area<=0){alert('Por favor ingresa el área de tu local.');return;}
  var cobertura={leve:278,ordinario:139,extra:93};
  var cap={leve:'10 lbs PQS (2-A)',ordinario:'10 lbs PQS (2-A)',extra:'20 lbs PQS (4-A)'};
  var extPQS=Math.ceil(area/cobertura[riesgo]);
  if(extPQS<1)extPQS=1;
  document.getElementById('resPQS').textContent=extPQS+(extPQS===1?' extintor':' extintores');
  document.getElementById('resCap').textContent=cap[riesgo];
  var co2row=document.getElementById('resCO2row');
  var tipoKrow=document.getElementById('resTipoKrow');
  var nota='';
  if(cocina==='si'||tipo==='restaurante'){
    co2row.style.display='flex';
    document.getElementById('resCO2').textContent='1 mínimo (50 lbs)';
    tipoKrow.style.display='flex';
    nota='⚠️ Las cocinas industriales requieren sistema fijo de CO₂ y extintor Tipo K (acetato de potasio) según NFPA 10 y normativa Bomberos Guayaquil. El sistema CO₂ es independiente de los extintores PQS.';
  }else{
    co2row.style.display='none';
    tipoKrow.style.display='none';
    nota='📋 Cálculo basado en NFPA 10 Tabla 6.2.1.1 y NTE INEN 802. Distancia máxima hasta cualquier extintor: 23 metros. Resultado orientativo — contáctanos para inspección gratuita.';
  }
  document.getElementById('resNota').textContent=nota;
  var r=document.getElementById('calcResult');
  r.classList.add('show');
  r.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function calcularHumo(){
  var area=parseFloat(document.getElementById('humoArea').value);
  var altura=document.getElementById('humoAltura').value;
  var tipo=document.getElementById('humoTipo').value;
  var zonas=parseInt(document.getElementById('humoZonas').value);
  if(!area||area<=0){alert('Por favor ingresa el área de tu local.');return;}
  var cob={normal:83,alto:56,industrial:37};
  var detectores=Math.ceil(area/cob[altura]);
  if(detectores<1)detectores=1;
  var panel=(zonas>=3||detectores>20)?'Direccionable':'Convencional';
  var lamparas=Math.ceil(area/50);
  if(lamparas<2)lamparas=2;
  document.getElementById('humoDetectores').textContent=detectores+(detectores===1?' detector':' detectores')+' fotoeléctricos';
  document.getElementById('humoPanel').textContent='Panel '+panel;
  document.getElementById('humoLamparas').textContent=lamparas+(lamparas===1?' lámpara':' lámparas')+' de emergencia';
  var nota='⚠️ Los detectores a batería ya NO son permitidos por Bomberos Guayaquil. Todo sistema debe ser cableado y certificado. ';
  if(tipo==='restaurante'){nota+='En cocinas se recomienda detector de calor sobre las campanas. ';}
  nota+='📋 Basado en NFPA 72. Resultado orientativo — contáctanos para cotización oficial.';
  document.getElementById('humoNota').textContent=nota;
  var r=document.getElementById('humoResult');
  r.classList.add('show');
  r.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function calcularCI(){
  var area=parseFloat(document.getElementById('ciArea').value);
  var pisos=parseInt(document.getElementById('ciPisos').value);
  var riesgo=document.getElementById('ciRiesgo').value;
  var bombaExiste=document.getElementById('ciBomba').value;
  if(!area||area<=0){alert('Por favor ingresa el área a proteger.');return;}
  var cobRoc={leve:20.9,ordinario:12.1,extra:9.3};
  var rociadores=Math.ceil((area*pisos)/cobRoc[riesgo]);
  var tuberia={leve:'2" (50mm)',ordinario:'2½" (65mm)',extra:'3" (75mm)'};
  var potencia={leve:'5.5 HP',ordinario:'7.5 HP',extra:'15 HP'};
  if(pisos>=3){potencia={leve:'7.5 HP',ordinario:'15 HP',extra:'25 HP'};}
  document.getElementById('ciRociadores').textContent=rociadores+' rociadores';
  document.getElementById('ciTuberia').textContent='Tubería '+tuberia[riesgo];
  document.getElementById('ciBombaRes').textContent=bombaExiste==='si'?'Revisar capacidad actual':'Bomba centrífuga '+potencia[riesgo];
  document.getElementById('ciJockeyRow').style.display='flex';
  var nota='📋 Basado en NFPA 13 y NFPA 20. Bomba Jockey obligatoria para mantener presión. ';
  if(bombaExiste==='si'){nota+='⚠️ Verificaremos la capacidad de tu bomba en la inspección gratuita. ';}
  nota+='Resultado orientativo — contáctanos para diseño hidráulico certificado.';
  document.getElementById('ciNota').textContent=nota;
  var r=document.getElementById('ciResult');
  r.classList.add('show');
  r.scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ── Contadores animados ── */
function animateCounter(el){
  var target=parseInt(el.getAttribute('data-target'));
  var duration=1800;
  var start=null;
  function step(ts){
    if(!start)start=ts;
    var progress=Math.min((ts-start)/duration,1);
    var ease=1-Math.pow(1-progress,3);
    el.textContent=Math.floor(ease*target).toLocaleString();
    if(progress<1)requestAnimationFrame(step);
    else el.textContent=target.toLocaleString();
  }
  requestAnimationFrame(step);
}

/* ── Autoplay ── */
var _ap={};
var _reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
function startAp(id){
  if(_reducedMotion)return;
  if(_ap[id])clearInterval(_ap[id]);
  _ap[id]=setInterval(function(){var s=cs(id);goSlide(id,s.idx+1);},4500);
}
function stopAp(id){clearInterval(_ap[id]);_ap[id]=null;}

/* ── Init al cargar ── */
document.addEventListener('DOMContentLoaded',function(){
  /* Touch swipe en carruseles */
  document.querySelectorAll('.carr').forEach(function(carr){
    var id=carr.id,sx=0,sy=0,rt=null;
    carr.addEventListener('touchstart',function(e){
      sx=e.touches[0].clientX;sy=e.touches[0].clientY;
      stopAp(id);if(rt)clearTimeout(rt);
    },{passive:true});
    carr.addEventListener('touchend',function(e){
      var dx=sx-e.changedTouches[0].clientX;
      var dy=sy-e.changedTouches[0].clientY;
      if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>40)moveCarr(id,dx>0?1:-1);
      rt=setTimeout(function(){startAp(id);},3000);
    });
    carr.addEventListener('mouseenter',function(){stopAp(id);});
    carr.addEventListener('mouseleave',function(){startAp(id);});
  });

  /* Auto-init all carousels */
  document.querySelectorAll('.carr').forEach(function(carr){
    initCarr(carr.id);
    startAp(carr.id);
  });

  /* Show all gallery groups */
  document.querySelectorAll('.gal-group').forEach(function(g){g.classList.add('visible');});
  var galGrid=document.getElementById('galGroups');if(galGrid)galGrid.classList.add('show-all');

  /* Contadores animados */
  var counters=document.querySelectorAll('.counter[data-target]');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){animateCounter(e.target);obs.unobserve(e.target);}
      });
    },{threshold:0.5});
    counters.forEach(function(c){obs.observe(c);});
  }else{
    counters.forEach(function(c){animateCounter(c);});
  }
});
