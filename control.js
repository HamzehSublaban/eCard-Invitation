/* =====================================================
   الإعدادات — ضع رقم الواتساب هنا بصيغة دولية بدون +
===================================================== */
const WHATSAPP_NUMBER = "962791603407"; // مثال: "962790000000"
const WHATSAPP_MSG = "السلام عليكم، يشرفني تلبية الدعوة وحضور حفل التخرج. ألف مبروك!";

const waBtn = document.getElementById("waBtn");
waBtn.href = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`
  : `https://api.whatsapp.com/send?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.innerWidth < 640;

/* =====================================================
   القبعات المتطايرة + بارالاكس (ألوان بنية داكنة)
===================================================== */
const capSVG = (size, i) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="80" rx="26" ry="8" fill="#000" opacity=".3"/>
  <path d="M36 52 h28 v14 a14 8 0 0 1 -28 0 Z" fill="#241610"/>
  <path d="M50 22 L96 44 L50 66 L4 44 Z" fill="#2E1D12"/>
  <path d="M50 22 L96 44 L50 56 L4 44 Z" fill="#F6DE9C" opacity=".08"/>
  <circle cx="50" cy="44" r="4" fill="#D4A438"/>
  <path d="M50 44 Q76 50 78 72" stroke="#D4A438" stroke-width="3" fill="none"/>
  <rect x="73" y="70" width="10" height="14" rx="2" fill="#D4A438"/>
</svg>`;

const capsLayer = document.getElementById("capsLayer");
const caps = [];
const CAP_COUNT = isMobile ? 7 : 12;

for(let i=0;i<CAP_COUNT;i++){
  const el = document.createElement("div");
  el.className = "cap";
  const size = 30 + Math.random()*52;
  el.innerHTML = capSVG(size, i);
  el.style.left = Math.random()*94 + "%";
  el.style.top  = Math.random()*92 + "%";
  el.style.opacity = .3 + (size/85)*.5;
  capsLayer.appendChild(el);
  caps.push({el, depth: size/85});
}

if(!reduceMotion){
  caps.forEach(c=>{
    gsap.to(c.el,{
      rotation:(Math.random()>.5?1:-1)*(20+Math.random()*40),
      y:"+="+(18+Math.random()*38),
      duration:6+Math.random()*6,
      yoyo:true, repeat:-1, ease:"sine.inOut", delay:Math.random()*3
    });
  });

  // بارالاكس بالماوس (كمبيوتر)
  window.addEventListener("mousemove", e=>{
    const nx = (e.clientX/window.innerWidth - .5);
    caps.forEach(c=>{
      gsap.to(c.el,{x: nx*55*c.depth, duration:1.4, ease:"power2.out", overwrite:"auto"});
    });
  }, {passive:true});

  // بارالاكس بالسكرول (هاتف وكمبيوتر)
  window.addEventListener("scroll", ()=>{
    const sy = window.scrollY;
    caps.forEach(c=>{
      gsap.to(c.el,{yPercent:-sy*0.045*c.depth, duration:.6, ease:"power1.out", overwrite:"auto"});
    });
  }, {passive:true});

  // بارالاكس بميلان الجهاز (هاتف)
  window.addEventListener("deviceorientation", e=>{
    if(e.gamma==null) return;
    const nx = Math.max(-1, Math.min(1, e.gamma/30));
    caps.forEach(c=>{
      gsap.to(c.el,{x: nx*40*c.depth, duration:1, ease:"power2.out", overwrite:"auto"});
    });
  }, {passive:true});
}

/* =====================================================
   قصاصات الورق — ذهبي / بني / عاجي لامع
===================================================== */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
function sizeCanvas(){canvas.width=innerWidth;canvas.height=innerHeight;}
sizeCanvas();
addEventListener("resize", sizeCanvas);

const COLORS = ["#D4A438","#F6DE9C","#F5EBDA","#8F6B1E","#6B4326","#C08A3E","#FFF6E0"];

function burst(x, y, count, spread, power){
  for(let i=0;i<count;i++){
    const angle = (-Math.PI/2) + (Math.random()-.5)*spread;
    const speed = power*(.5+Math.random()*.8);
    particles.push({
      x, y,
      vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
      w:6+Math.random()*7, h:4+Math.random()*6,
      rot:Math.random()*Math.PI*2, vr:(Math.random()-.5)*.3,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      life:1, decay:.006+Math.random()*.008,
      shape:Math.random()>.5?"rect":"circle"
    });
  }
}
let confettiRunning=false;
function confettiLoop(){
  if(!particles.length){confettiRunning=false;ctx.clearRect(0,0,canvas.width,canvas.height);return;}
  confettiRunning=true;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.vy+=.12; p.vx*=.992; p.vy*=.992;
    p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life-=p.decay;
    ctx.save();
    ctx.globalAlpha=Math.max(p.life,0);
    ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillStyle=p.color;
    if(p.shape==="rect") ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    else{ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  });
  particles=particles.filter(p=>p.life>0&&p.y<canvas.height+60);
  requestAnimationFrame(confettiLoop);
}
function fireCelebration(){
  if(reduceMotion) return;
  burst(canvas.width*.5, canvas.height*.55, isMobile?90:130, 2.4, 11);
  setTimeout(()=>burst(0, canvas.height*.7, isMobile?45:70, 1.2, 13), 220);
  setTimeout(()=>burst(canvas.width, canvas.height*.7, isMobile?45:70, 1.2, 13), 220);
  if(!confettiRunning) confettiLoop();
}

/* =====================================================
   الانتقال السينمائي
===================================================== */
const splash = document.getElementById("splash");
const main = document.getElementById("main");
const openBtn = document.getElementById("openBtn");
let opened=false;

function revealMain(){
  main.style.visibility="visible";
  waBtn.style.visibility="visible";

  if(reduceMotion){splash.style.display="none";return;}

  const tl = gsap.timeline({defaults:{ease:"power3.inOut"}});
  tl.to(openBtn,{scale:.85,opacity:0,duration:.35,ease:"power2.in"},0)
    .to(".hint",{opacity:0,duration:.3},0)
    .to("#verseWrap",{y:-60,opacity:0,duration:.6},.05)
    .to(".diploma",{scale:9,rotate:8,opacity:0,duration:1.05,ease:"power4.in"},.1)
    .to(splash,{opacity:0,duration:.7,ease:"power2.out",
        onComplete:()=>{splash.style.display="none";}},.75)
    .add(()=>fireCelebration(), .95)
    .fromTo("#main .rv",
        {y:44,opacity:0},
        {y:0,opacity:1,duration:.85,stagger:.13,ease:"power3.out"},1.0)
    .fromTo(".character",
        {y:55,opacity:0,scale:.88},
        {y:0,opacity:1,scale:1,duration:.9,stagger:.15,ease:"back.out(1.6)"},1.25)
    .fromTo(waBtn,
        {y:40,opacity:0},
        {y:0,opacity:1,duration:.6,ease:"back.out(2)"},1.8);
}

openBtn.addEventListener("click", ()=>{
  if(opened) return; opened=true;
  revealMain();
});
