const $=(s,scope=document)=>scope.querySelector(s);const $$=(s,scope=document)=>[...scope.querySelectorAll(s)];

// Mobile navigation
const menu=$('.menu-btn'),nav=$('.nav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Scroll reveal
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Place field notes
const places={
 vigan:{tag:'DAY 01 / ILOCOS SUR',title:'Vigan',text:'We arrived in the late afternoon, when the stone streets began to hold the last warm light. The old quarter felt less like a museum and more like a neighborhood with a long memory. We walked slowly, photographed details, and let the evening traffic become part of the scene.',meta:'17:20 — Calle Crisologo / 18:40 — Dinner / 8.4 km walked'},
 sagada:{tag:'DAY 02 / MOUNTAIN PROVINCE',title:'Sagada',text:'The alarm went off before sunrise. The trail was cool and quiet, with pine trees breaking up the fog. At the viewpoint, the valley appeared for only a few minutes before the clouds closed over it again. That brief window became the day’s favorite frame.',meta:'06:48 — Viewpoint / 10:15 — Trail / 12.1 km walked'},
 banaue:{tag:'DAY 03 / IFUGAO',title:'Banaue',text:'Banaue changed the scale of the trip. From the ridge, the terraces made years of work visible in a single landscape. We spent more time listening than photographing and left with a stronger appreciation for the knowledge embedded in the terrain.',meta:'09:14 — Ridge walk / 13:30 — Local lunch / 9.7 km walked'},
 baguio:{tag:'DAY 04–05 / BENGUET',title:'Baguio',text:'The final stop traded mountain silence for a busier rhythm. We visited a small art space, wandered through a market and ended the night with coffee. By the fifth afternoon, the trip had become less about collecting places and more about comparing the way each place made us feel.',meta:'14:06 — Art district / 18:02 — Market / 7.6 km walked'}
};
const modal=$('#noteModal');
$$('.read-place').forEach(btn=>btn.addEventListener('click',()=>{const p=places[btn.dataset.place];$('#modalTag').textContent=p.tag;$('#modalTitle').textContent=p.title;$('#modalText').textContent=p.text;$('#modalMeta').textContent=p.meta;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));
const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''};$('.modal-close').addEventListener('click',closeModal);$('.modal-backdrop').addEventListener('click',closeModal);

// Journal filters
$$('.filter').forEach(filter=>filter.addEventListener('click',()=>{$$('.filter').forEach(f=>f.classList.remove('active'));filter.classList.add('active');const type=filter.dataset.filter;$$('.note').forEach(note=>{note.style.display=type==='all'||note.dataset.category===type?'flex':'none'})}));

// Budget calculator
const currency=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(n);const inputs=$$('.budget-list input');
function updateBudget(){let total=inputs.reduce((sum,input)=>sum+(Number(input.value)||0),0);$('#totalCost').textContent=currency(total);const daily=total/5;$('.budget-meta').firstElementChild.textContent=`${currency(daily)} / day`;$('#budgetBar').style.width=Math.min(100,Math.max(8,total/200))+'%'}
inputs.forEach(input=>input.addEventListener('input',updateBudget));updateBudget();

// Checklist with small feedback toast
const toast=$('#toast');let toastTimer;$$('#checklist input').forEach(box=>box.addEventListener('change',()=>{toast.textContent=box.checked?'Added to your packing list':'Removed from your packing list';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1700)}));

// Gallery lightbox
const lightbox=$('#lightbox'),lbImg=$('#lightboxImage'),lbCap=$('#lightboxCaption');
function openLightbox(item){lbImg.src=item.dataset.src;lbImg.alt=item.querySelector('img').alt;lbCap.textContent=item.dataset.caption||'';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
$$('.gallery-item').forEach(item=>item.addEventListener('click',()=>openLightbox(item)));$('#openGallery').addEventListener('click',()=>openLightbox($('.gallery-item')));
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';lbImg.src=''}
$('.lightbox-close').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});

// Keyboard accessibility
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeLightbox()}});

// Active navigation based on scroll position
const sections=$$('main section[id]');const navLinks=$$('.nav a');window.addEventListener('scroll',()=>{let current='';sections.forEach(section=>{if(scrollY>=section.offsetTop-180)current=section.id});navLinks.forEach(link=>link.classList.toggle('current',link.getAttribute('href')===`#${current}`))},{passive:true});