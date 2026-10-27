'use strict';

/* =========================================================
   14-4. 반짝이 극장 (v0.21.0)
     양치가 끝나면 약 20초짜리 짧은 이야기 (v0.35.0: 줄거리 있는 10편으로 새로 씀, 예전 개그 12편은 뺌). 아이 의견: "미미자우르처럼 끝나고 영상이 나왔으면, 매번 다르게"
     의도: "내일 또 닦고 싶게" — 다음 화가 궁금하게. 진짜 영상 파일이 아니라 코드 애니메이션이라
           그림체 B 그대로, 파일 크기가 거의 늘지 않고, 언어를 바꾸면 대사도 바뀜
     매번 다르게: 이야기(THEATER) × 배경(THEATER_BGS) × 데리고 다니는 펫 × 오늘의 대장 세균 × 마무리 말 × 아침/저녁
       최근 5화의 이야기 · 최근 3화의 배경은 다시 안 고름 (저장 bj_theater {n:몇 화, g:[최근 이야기], b:[최근 배경]})
     흐름: finishDone() 이 기록 · 별을 먼저 저장 → 극장 → 완료 화면 (보다가 앱을 꺼도 보상은 남음)
     부모님 설정에서 끌 수 있음 (bj_theaterOn). 언제든 "건너뛰기", 안드로이드 뒤로 가기도 건너뛰기
     새 이야기 추가: THEATER 에 { id, bg, night?, setup?(c), run(c) } 하나 + 언어팩 'th.<id>.t'(제목) · 'th.<id>.1' …(대사). 1화부터 차례로 (bj_theater.k)
       대사: c.line(배우|null, 키) = 말풍선 + 읽는 시간만큼 기다림. 문구 안 {pet} = 펫 이름, {boss} = 오늘의 대장 세균
       c 도구: c.hero · c.pet · c.boss(x,y) · c.prop(그림,폭,x,y,z,세로비) · c.go(배우,x,y,ms) · c.pose(배우,동작,ms,반복)
               c.say(배우|null, 문구키) · c.brush(배우,켜기) · c.flip · c.burst · c.snd(소리) · c.wait(ms)
       좌표: 무대 % (x = 가운데, y = 바닥에서 위로). 땅은 y 5 근처
   ========================================================= */
const THEATER_BGS = ['bath', 'room', 'safari', 'bug', 'bird', 'sea', 'swamp', 'castle'];
const BATH_BG = '<rect width="400" height="260" fill="#cdeefc"/>' +
  '<g data-noink="1" stroke="#ffffff" stroke-width="3">' + Array.from({ length:9 }, (_, i) => `<path d="M${i * 46 + 10} 0 V200"/>`).join('') +
    Array.from({ length:4 }, (_, i) => `<path d="M0 ${i * 46 + 20} H400"/>`).join('') + '</g>' +
  '<rect x="140" y="22" width="120" height="96" rx="40" fill="#f2fbff"/>' +
  '<path data-noink="1" d="M162 44 L184 34 M166 62 L206 40" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>' +
  '<g><rect x="138" y="150" width="124" height="22" rx="10" fill="#ffffff"/><rect x="186" y="128" width="8" height="24" rx="4" fill="#b8c6d6"/><rect x="178" y="126" width="26" height="8" rx="4" fill="#b8c6d6"/></g>' +
  '<g><rect x="42" y="112" width="40" height="50" rx="8" fill="#ff9ec0"/><rect x="50" y="98" width="24" height="16" rx="5" fill="#ffd54a"/></g>' +
  '<g><rect x="322" y="122" width="14" height="40" rx="5" fill="#8fd3ff"/><rect x="340" y="132" width="14" height="30" rx="5" fill="#b48cff"/></g>' +
  '<rect y="200" width="400" height="60" fill="#9fd3ef"/>';
const TH_ART = {
  banana: stickerSvg('<svg viewBox="-30 -20 60 40" aria-hidden="true"><path d="M-24 6 Q0 22 24 2 Q22 -6 18 -2 Q0 12 -20 -2Z" fill="#ffe066"/><path d="M-24 6 L-28 10 M24 2 L28 -4" stroke="#8a5a32" stroke-width="3" stroke-linecap="round"/></svg>', 3),
  star: stickerSvg('<svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M0 -10 L3 -3 L10 -3 L4.5 2 L6.5 9.5 L0 5 L-6.5 9.5 L-4.5 2 L-10 -3 L-3 -3Z" fill="#ffd54a"/></svg>', 1.6),
  bubble: '<svg viewBox="-50 -50 100 100" aria-hidden="true"><circle r="46" fill="#e6f7ff99" stroke="#24324a" stroke-width="3"/><ellipse cx="-16" cy="-20" rx="10" ry="6" fill="#fff" transform="rotate(-30 -16 -20)"/></svg>',
  note: stickerSvg('<svg viewBox="-12 -16 24 30" aria-hidden="true"><path d="M4 -14 V6" stroke="#b48cff" stroke-width="3"/><ellipse cx="-1" cy="7" rx="6" ry="4.5" fill="#b48cff" transform="rotate(-20 -1 7)"/><path d="M4 -14 Q12 -10 10 -2" stroke="#b48cff" stroke-width="3" fill="none"/></svg>', 2),
  bush: stickerSvg('<svg viewBox="-60 -50 120 60" aria-hidden="true"><g fill="#6cc46a"><circle cx="-30" cy="-12" r="22"/><circle cx="0" cy="-24" r="28"/><circle cx="30" cy="-12" r="22"/><rect x="-52" y="-14" width="104" height="24" rx="10"/></g><g fill="#ff9ec0"><circle cx="-18" cy="-26" r="4"/><circle cx="16" cy="-34" r="4"/><circle cx="34" cy="-16" r="4"/></g></svg>', 3.5),
  tear: '<svg viewBox="-6 -8 12 16" aria-hidden="true"><path d="M0 -7 Q6 2 0 7 Q-6 2 0 -7Z" fill="#8fd3ff" stroke="#24324a" stroke-width="1.5"/></svg>',
  heart: stickerSvg('<svg viewBox="-12 -11 24 22" aria-hidden="true"><path d="M0 9 C-14 -2 -7 -12 0 -5 C7 -12 14 -2 0 9Z" fill="#ff7aa8"/></svg>', 1.6),
  rocket: () => `<svg viewBox="-40 -100 80 100" aria-hidden="true"><path class="flame" d="M-9 -16 Q0 12 9 -16Z" fill="#ffb347"/>${stickered(TOPPERS.rocket, 4)}</svg>`
};
const P_HOP = [{ transform:'translateY(0)' }, { transform:'translateY(-30%)' }, { transform:'translateY(0)' }];
const P_BIG = [{ transform:'translateY(0)' }, { transform:'translateY(-80%)' }, { transform:'translateY(0)' }];
const P_SPIN = [{ transform:'rotate(0)' }, { transform:'rotate(360deg)' }];
const P_FLIPJ = [{ transform:'translateY(0) rotate(0)' }, { transform:'translateY(-60%) rotate(-180deg)' }, { transform:'translateY(0) rotate(-360deg)' }];
const P_WIG = [{ transform:'rotate(-10deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(-10deg)' }];
const P_SQ = [{ transform:'scale(1,1)' }, { transform:'scale(1.25,.75)' }, { transform:'scale(1,1)' }];
const P_SHAKE = [{ transform:'translateX(0)' }, { transform:'translateX(-6%)' }, { transform:'translateX(6%)' }, { transform:'translateX(0)' }];
const P_WALK = [{ transform:'translateY(0) rotate(-4deg)' }, { transform:'translateY(-8%) rotate(4deg)' }, { transform:'translateY(0) rotate(-4deg)' }];
const P_GROW = [{ transform:'scale(0)' }, { transform:'scale(1.15)' }, { transform:'scale(1)' }];
const TH_SND = {
  boing(){ tone(300, .1, 'sine', .15); tone(620, .16, 'sine', .12, .08); },
  pop(){ tone(900, .06, 'square', .05); tone(1400, .12, 'sine', .12, .04); },
  slip(){ [880, 740, 600, 470].forEach((f, i) => tone(f, .09, 'triangle', .12, i * .06)); },
  thud(){ tone(110, .22, 'triangle', .25); },
  whoosh(){ tone(380, .32, 'sine', .1); tone(760, .3, 'sine', .08, .12); },
  ding(i = 0){ tone(1319 * Math.pow(2, i / 12), .22, 'sine', .14); },
  sneeze(){ tone(520, .08, 'square', .05); tone(240, .28, 'triangle', .22, .08); },
  blow(){ tone(330, .7, 'sine', .06); },
  swish(){ [1500, 1300, 1100].forEach((f, i) => tone(f, .14, 'sine', .07, i * .1)); },
  magic(){ [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .12, 'sine', .1, i * .07)); },
  fanfare(){ [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? .4 : .14, 'triangle', .16, i * .12)); },
  beep(){ tone(880, .1, 'square', .05); },
  music(){ [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047].forEach((f, i) => tone(f, .16, 'triangle', .1, i * .2)); }
};
var theaterOn = store.get('theaterOn', true);      // var: 설정 화면 코드가 이보다 앞에 있어서
let thTok = 0, thEnd = null;
const TH_STOP = { stop:true };
function pickFresh(list, recent, key = (x) => x){
  const fresh = list.filter(x => !recent.includes(key(x)));
  return pick(fresh.length ? fresh : list);
}
function thBgSvg(id){
  const raw = id === 'bath' ? inkScene(BATH_BG, 3.5) : id === 'room' ? roomBG() : habBG(id);
  return `<svg class="th-bg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${raw}</svg>`;
}
function thCtx(stage, tok){
  const chk = () => { if (tok !== thTok) throw TH_STOP; };
  const wait = async (ms) => { await new Promise(r => setTimeout(r, ms)); chk(); };
  const actor = (svg, w, x, y, z = 2, ratio = 1) => {
    const a = document.createElement('div'); a.className = 'th-a';
    a.style.cssText = `width:${w}%;margin-left:${-w / 2}%;left:${x}%;bottom:${y}%;z-index:${z}`;
    a.innerHTML = `<div class="th-in">${svg}</div>`;
    a.pos = { x, y }; a.w = w; a.h = w * ratio;
    stage.appendChild(a); return a;
  };
  const go = async (a, x, y, ms, ease = 'ease-in-out') => {
    const from = { left:a.pos.x + '%', bottom:a.pos.y + '%' }; a.pos = { x, y };
    const an = a.animate([from, { left:x + '%', bottom:y + '%' }], { duration:ms, easing:ease, fill:'forwards' });
    try{ await an.finished; }catch(e){}
    chk();
  };
  const pose = async (a, frames, ms, it = 1) => {
    const an = a.firstChild.animate(frames, { duration:ms, iterations:it, easing:'ease-in-out' });
    try{ await an.finished; }catch(e){}
    chk();
  };
  const morph = async (a, tf, ms) => {
    const an = a.firstChild.animate([{ transform:a.tf || 'none' }, { transform:tf }], { duration:ms, easing:'cubic-bezier(.3,1.5,.5,1)', fill:'forwards' });
    a.tf = tf;
    try{ await an.finished; }catch(e){}
    chk();
  };
  let bubT = 0;
  const say = (a, key, prm = {}, dur = 2600) => {
    prm = Object.assign({}, c.P || {}, prm);
    const txt = t(key, prm);
    stage.querySelectorAll('.th-bub').forEach(b => b.remove());
    const b = document.createElement('div'); b.className = 'th-bub' + (a ? '' : ' nar'); b.textContent = txt;
    if (a){
      const x = Math.max(24, Math.min(76, a.pos.x)), y = Math.min(80, Math.max(8, a.pos.y + a.h + 3));
      b.style.left = x + '%'; b.style.bottom = y + '%';
    }
    stage.appendChild(b);
    if (a){                                                          // 무대 밖으로 나가지 않게 가운데 위치를 당김
      const sw = stage.clientWidth, bw = b.offsetWidth, cx = parseFloat(b.style.left) / 100 * sw;
      b.style.left = Math.max(bw / 2 + 6, Math.min(sw - bw / 2 - 6, cx)) + 'px';
    }
    clearTimeout(bubT); bubT = setTimeout(() => b.remove(), dur);
    Voice.play('theater', txt);
    return txt;
  };
  const lineMs = (txt) => Math.max(1700, 700 + [...txt].length * (lang === 'en' ? 55 : 95));   // 읽는 시간 (한 · 일은 글자당 더 길게)
  const line = async (a, key, prm = {}) => { const txt = t(key, Object.assign({}, c.P || {}, prm)), ms = lineMs(txt); say(a, key, prm, ms + 300); await wait(ms); };
  const burst = (a, n = 7) => {
    const cx = a.pos ? a.pos.x : a.x, cy = a.pos ? a.pos.y + a.h / 2 : a.y;
    for (let i = 0; i < n; i++){
      const f = document.createElement('div'); f.className = 'th-fx'; f.innerHTML = TH_ART.star;
      f.style.left = cx + '%'; f.style.bottom = cy + '%'; stage.appendChild(f);
      const ang = i / n * Math.PI * 2, r = 120 + Math.random() * 80;
      f.animate([{ transform:'translate(0,0) scale(.4)', opacity:1 }, { transform:`translate(${Math.cos(ang) * r}%,${Math.sin(ang) * r}%) scale(1) rotate(180deg)`, opacity:0 }],
        { duration:700 + Math.random() * 300, easing:'cubic-bezier(.1,.7,.3,1)' }).onfinish = () => f.remove();
    }
  };
  const floatProp = (svg, w, x, y) => {
    const p = actor(svg, w, x, y, 6);
    p.animate([{ transform:'translateY(0)', opacity:0 }, { transform:'translateY(-40%)', opacity:1, offset:.25 }, { transform:'translateY(-220%) rotate(20deg)', opacity:0 }],
      { duration:2600, easing:'ease-out' }).onfinish = () => p.remove();
  };
  const c = {
    stage, wait, go, pose, morph, say, line, burst, floatProp,
    prop: actor,
    place(a, x, y){ a.pos = { x, y }; a.style.left = x + '%'; a.style.bottom = y + '%'; },
    boss(x, y, w = 20){ return actor(germSVG(curBoss.col, curBoss), w, x, y, 1); },
    flip(a, on){ a.style.transform = on ? 'scaleX(-1)' : ''; },
    brush(a, on){ const s = a.querySelector('svg.char'); if (s) s.classList.toggle('brushing', !!on); },
    snd(k, i){ if (TH_SND[k]) TH_SND[k](i); },
    shuffle(arr){ return arr.map(v => [Math.random(), v]).sort((p, q) => p[0] - q[0]).map(v => v[1]); },
    async opening(n, title){
      TH_SND.fanfare();
      Voice.play('theater', t('th.open', { n, title }));
      await wait(1800);
      stage.classList.add('open'); await wait(900);
      const tt = stage.querySelector('.th-title'); if (tt) tt.remove();
    },
    async ending(){
      const nm = kidName();
      say(null, nm ? 'th.endName' : 'th.end', { name:nm });
      TH_SND.fanfare();
      c.burst({ x:50, y:60 }, 9);
      await Promise.all([pose(c.hero, P_HOP, 450, 3), pose(c.pet, P_HOP, 450, 3)]);
      await wait(400);
      if (c.nextTitle) await line(null, 'th.next', { title:c.nextTitle });               // v0.35.0 다음 화 예고 ("내일 또 보고 싶게")
      stage.classList.remove('open'); await wait(900);
    }
  };
  return c;
}
/* 이야기 목록 v0.35.0: 한 편 약 20초 (막 열림 3초 + 이야기 13~15초 + 마무리 · 다음 화 예고 4초)
   모든 이야기는 "처음 → 문제 → 해 보기 → 해결 → 한 줄 교훈" 순서. 1화부터 차례로 (다 보면 처음부터)
   대사는 c.line(배우|null, 키) = 말풍선 + 읽는 시간만큼 기다림. {pet} 펫 이름 · {boss} 오늘의 대장 세균 이름 */
const TH_ART2 = {
  candy: stickerSvg('<svg viewBox="-30 -16 60 32" aria-hidden="true"><path d="M-12 0 L-28 -11 L-28 11Z" fill="#ff9ec0"/><path d="M12 0 L28 -11 L28 11Z" fill="#ff9ec0"/><circle r="13" fill="#ff5d8f"/><path d="M-7 -6 Q0 -11 7 -6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>', 2.4),
  chest: stickerSvg('<svg viewBox="-40 -34 80 60" aria-hidden="true"><rect x="-34" y="-8" width="68" height="32" rx="4" fill="#b8763a"/><path d="M-34 -8 Q-34 -30 0 -30 Q34 -30 34 -8Z" fill="#c98a4a"/><rect x="-34" y="-10" width="68" height="6" fill="#8a5a32"/><rect x="-36" y="-8" width="6" height="32" fill="#ffd54a"/><rect x="30" y="-8" width="6" height="32" fill="#ffd54a"/><rect x="-7" y="-14" width="14" height="17" rx="3" fill="#9aa6b2"/><circle cx="0" cy="-6" r="2.5" fill="#4a5664"/></svg>', 3),
  chestOpen: stickerSvg('<svg viewBox="-40 -60 80 86" aria-hidden="true"><path d="M-34 -14 Q-34 -50 0 -54 Q34 -50 34 -14Z" fill="#c98a4a"/><ellipse cx="0" cy="-8" rx="30" ry="9" fill="#ffe066"/><circle cx="-14" cy="-13" r="6" fill="#ffd54a"/><circle cx="9" cy="-15" r="7" fill="#fff3a0"/><circle cx="-1" cy="-10" r="5" fill="#ffd54a"/><rect x="-34" y="-8" width="68" height="32" rx="4" fill="#b8763a"/><rect x="-36" y="-8" width="6" height="32" fill="#ffd54a"/><rect x="30" y="-8" width="6" height="32" fill="#ffd54a"/></svg>', 3),
  crown: stickerSvg('<svg viewBox="-24 -18 48 30" aria-hidden="true"><path d="M-20 10 L-22 -10 L-10 0 L0 -14 L10 0 L22 -10 L20 10Z" fill="#ffd54a"/><circle cx="0" cy="-1" r="3.5" fill="#ff5d8f"/><circle cx="-13" cy="3" r="2.5" fill="#8fd3ff"/><circle cx="13" cy="3" r="2.5" fill="#8fd3ff"/></svg>', 2),
  cup: stickerSvg('<svg viewBox="-16 -22 32 40" aria-hidden="true"><path d="M-12 -16 L12 -16 L9 16 L-9 16Z" fill="#f2fbff"/><path d="M-10.5 -4 L10.5 -4 L8.6 14 L-8.6 14Z" fill="#8fd3ff"/></svg>', 2),
  trophy: stickerSvg('<svg viewBox="-24 -26 48 50" aria-hidden="true"><path d="M-14 -16 Q-25 -16 -20 -4 Q-17 2 -12 0 M14 -16 Q25 -16 20 -4 Q17 2 12 0" stroke="#e8b52a" stroke-width="4" fill="none"/><path d="M-14 -22 H14 V-6 Q14 8 0 8 Q-14 8 -14 -6Z" fill="#ffd54a"/><rect x="-4" y="8" width="8" height="8" fill="#e8b52a"/><rect x="-12" y="16" width="24" height="6" rx="2" fill="#c98a1f"/><path d="M0 -17 L2 -12 L7 -12 L3 -9 L4.5 -4 L0 -7 L-4.5 -4 L-3 -9 L-7 -12 L-2 -12Z" fill="#fff8d6"/></svg>', 2.2),
  moon: stickerSvg('<svg viewBox="-50 -50 100 100" aria-hidden="true"><circle r="44" fill="#fff3b0"/><circle cx="-16" cy="-10" r="7" fill="#f2e08a"/><circle cx="16" cy="16" r="9" fill="#f2e08a"/><circle cx="12" cy="-22" r="5" fill="#f2e08a"/><circle cx="-12" cy="6" r="3" fill="#24324a"/><circle cx="8" cy="0" r="3" fill="#24324a"/><path d="M-8 14 Q-2 20 4 14" stroke="#24324a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>', 3),
  flag: stickerSvg('<svg viewBox="-6 -40 30 44" aria-hidden="true"><rect x="-2" y="-38" width="4" height="42" fill="#8a5a32"/><path d="M2 -38 H24 L18 -30 L24 -22 H2Z" fill="#e8455f"/></svg>', 2),
  zzz: '<svg viewBox="-12 -14 24 24" aria-hidden="true"><text x="0" y="8" text-anchor="middle" font-size="22" font-weight="800" fill="#8fa8ff" stroke="#24324a" stroke-width="1.2" font-family="sans-serif">Z</text></svg>',
  brushMini: () => brushThumb(brush)
};
const P_TINY = [{ transform:'translateY(0)' }, { transform:'translateY(-14%)' }, { transform:'translateY(0)' }];
const P_LOOK = [{ transform:'scaleX(1)' }, { transform:'scaleX(-1)' }, { transform:'scaleX(-1)' }, { transform:'scaleX(1)' }];
const P_YAWN = [{ transform:'scale(1,1)' }, { transform:'scale(.96,1.08) rotate(-4deg)' }, { transform:'scale(1,1)' }];
const THEATER = [
  { id:'candy', bg:'room', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cd = c.prop(TH_ART2.candy, 13, 70, 5, 2, .53);
    await Promise.all([c.line(null, 'th.candy.1'), c.pose(cd, P_TINY, 500, 3)]);
    const b = c.boss(118, 5);
    await Promise.all([c.go(b, 78, 5, 1400), c.pose(b, P_WALK, 350, 4)]);
    cd.remove(); c.snd('pop'); c.burst(b, 5);
    await Promise.all([c.line(b, 'th.candy.2'), c.morph(b, 'scale(1.5)', 900)]);
    await Promise.all([c.line(c.hero, 'th.candy.3'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    c.say(c.pet, 'th.candy.4');
    await Promise.all([c.go(c.pet, -15, 5, 700), c.pose(c.pet, P_HOP, 350, 2)]);
    const br = c.prop(TH_ART2.brushMini(), 22, -15, 16, 4, .37);
    await Promise.all([c.go(c.pet, 40, 5, 900), c.go(br, 40, 16, 900), c.pose(c.pet, P_HOP, 300, 3)]);
    br.remove(); c.brush(c.hero, true);
    await Promise.all([c.go(c.hero, 56, 5, 600), c.pose(c.hero, P_WALK, 300, 2)]);
    c.say(c.hero, 'th.candy.5'); c.snd('swish');
    await c.pose(c.hero, P_SHAKE, 260, 4);
    c.snd('pop'); c.burst(b, 9); await c.morph(b, 'scale(.5)', 600);
    c.pose(b, P_SPIN, 400, 3).catch(() => {}); await c.go(b, 130, 70, 900, 'ease-in');
    c.brush(c.hero, false);
    await Promise.all([c.line(null, 'th.candy.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'lostbrush', bg:'bath', setup(c){ c.place(c.hero, 34, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    await Promise.all([c.line(c.hero, 'th.lostbrush.1'), c.pose(c.hero, P_LOOK, 1400)]);
    const g = c.prop(germSVG(2), 13, 118, 40, 4), br = c.prop(TH_ART2.brushMini(), 22, 124, 46, 3, .37);
    c.say(null, 'th.lostbrush.2');
    await Promise.all([c.go(g, 70, 30, 1300), c.go(br, 76, 36, 1300), c.pose(g, P_WIG, 330, 4)]);
    await c.wait(500);
    c.flip(c.hero, false); c.say(c.hero, 'th.lostbrush.3');
    await Promise.all([c.go(c.hero, 52, 5, 900), c.pose(c.hero, P_WALK, 300, 3), c.go(g, 86, 12, 900), c.go(br, 92, 18, 900)]);
    c.snd('whoosh');
    await Promise.all([c.go(c.pet, 94, 5, 800, 'ease-out'), c.pose(c.pet, P_BIG, 800)]);
    c.snd('thud'); c.burst(g, 6);
    await Promise.all([c.line(null, 'th.lostbrush.4'), c.go(br, 66, 5, 700, 'ease-in'), c.pose(g, P_SHAKE, 300, 3)]);
    await Promise.all([c.go(c.hero, 64, 5, 500), c.pose(c.hero, P_HOP, 400)]);
    br.remove(); c.brush(c.hero, true);
    await c.line(c.hero, 'th.lostbrush.5');
    c.snd('swish'); c.say(g, 'th.lostbrush.6');
    await c.pose(c.hero, P_SHAKE, 260, 4);
    c.snd('pop'); c.burst(g, 9); c.pose(g, P_SPIN, 400, 3).catch(() => {}); await c.go(g, 110, 95, 900, 'ease-in');
    c.brush(c.hero, false);
    await Promise.all([c.line(null, 'th.lostbrush.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'treasure', bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ch = c.prop(TH_ART2.chest, 30, 62, 5, 2, .75);
    c.snd('boing');
    await Promise.all([c.line(null, 'th.treasure.1'), c.pose(ch, P_GROW, 800)]);
    await Promise.all([c.go(c.hero, 40, 5, 700), c.pose(c.hero, P_WALK, 350, 2)]);
    await Promise.all([c.line(c.hero, 'th.treasure.2'), c.pose(c.hero, P_SHAKE, 280, 4), c.pose(ch, P_SHAKE, 280, 4)]);
    const b = c.boss(66, 0, 18);
    await c.go(b, 66, 24, 500, 'ease-out');
    await Promise.all([c.line(b, 'th.treasure.3'), c.pose(b, P_WIG, 500, 3)]);
    await Promise.all([c.line(c.pet, 'th.treasure.4'), c.pose(c.pet, P_HOP, 380, 3)]);
    c.brush(c.hero, true); c.snd('magic');
    await c.pose(c.hero, P_SHAKE, 260, 4);
    c.snd('pop'); c.burst(b, 8); c.pose(b, P_SPIN, 400, 3).catch(() => {}); c.go(b, 120, 90, 900, 'ease-in').catch(() => {});
    await c.wait(400);
    ch.firstChild.innerHTML = TH_ART2.chestOpen; c.snd('fanfare'); c.burst({ x:62, y:30 }, 10);
    c.brush(c.hero, false);
    for (let i = 0; i < 4; i++) c.floatProp(TH_ART.star, 8, 54 + i * 6, 24);
    await c.line(null, 'th.treasure.5');
    for (let i = 0; i < 3; i++) c.floatProp(TH_ART.heart, 7, 24 + i * 10, 34);
    await Promise.all([c.line(c.hero, 'th.treasure.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'sleepy', bg:'room', night:true, setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 70, 5); }, run: async (c) => {
    c.floatProp(TH_ART2.zzz, 6, 76, 28); c.floatProp(TH_ART2.zzz, 6, 80, 34);
    await Promise.all([c.line(c.pet, 'th.sleepy.1'), c.pose(c.pet, P_YAWN, 900, 2)]);
    await Promise.all([c.line(c.hero, 'th.sleepy.2'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    await c.go(c.pet, 70, 2, 400);
    const bub = c.prop(TH_ART.bubble, 46, 56, 34, 5);
    c.snd('blow'); await c.pose(bub, P_GROW, 800);
    const gs = [0, 1, 3].map((k, i) => c.prop(germSVG(k), 11, [44, 56, 68][i], [48, 58, 46][i], 6));
    c.snd('music');
    await Promise.all([c.line(null, 'th.sleepy.3'), ...gs.map(g => c.pose(g, P_HOP, 380, 4))]);
    c.say(gs[1], 'th.sleepy.4');
    await Promise.all(gs.map(g => c.pose(g, P_WIG, 360, 4)));
    c.snd('pop'); bub.remove(); gs.forEach(g => g.remove()); c.burst({ x:56, y:56 }, 8);
    await Promise.all([c.line(c.pet, 'th.sleepy.5'), c.go(c.pet, 70, 5, 300), c.pose(c.pet, P_BIG, 800)]);
    c.brush(c.hero, true); c.snd('swish');
    await Promise.all([c.line(c.hero, 'th.sleepy.6'), c.pose(c.hero, P_SHAKE, 280, 5), c.pose(c.pet, P_WIG, 400, 3)]);
    c.brush(c.hero, false);
    for (let i = 0; i < 3; i++) c.floatProp(TH_ART.heart, 7, 40 + i * 12, 34);
    await Promise.all([c.line(null, 'th.sleepy.7'), c.pose(c.pet, P_YAWN, 900)]);
  } },
  { id:'race', bg:'safari', setup(c){ c.place(c.hero, 12, 5); c.place(c.pet, 50, 5); }, run: async (c) => {
    const b = c.boss(28, 5, 18), fl = c.prop(TH_ART2.flag, 9, 92, 5, 1, 1.5);
    await Promise.all([c.line(b, 'th.race.1'), c.pose(b, P_HOP, 400, 3)]);
    c.say(null, 'th.race.2'); c.snd('beep'); await c.wait(600); c.snd('beep'); await c.wait(600); c.snd('fanfare');
    await Promise.all([c.go(b, 66, 5, 1300, 'ease-in'), c.pose(b, P_WALK, 260, 5), c.go(c.hero, 36, 5, 1300, 'linear'), c.pose(c.hero, P_WALK, 330, 4)]);
    await Promise.all([c.line(c.hero, 'th.race.3'), c.go(c.hero, 44, 5, 1400, 'linear'), c.pose(c.hero, P_WALK, 350, 4)]);
    const ban = c.prop(TH_ART.banana, 11, 78, 5, 2, .67);
    c.snd('boing');
    await Promise.all([c.line(c.pet, 'th.race.4'), c.pose(c.pet, P_HOP, 360, 3)]);
    await c.go(b, 78, 5, 500, 'linear');
    c.snd('slip'); ban.remove();
    await Promise.all([c.pose(b, P_FLIPJ, 900), c.go(b, 70, 5, 900)]);
    c.snd('thud');
    await Promise.all([c.go(c.hero, 90, 5, 1300, 'linear'), c.pose(c.hero, P_WALK, 320, 4)]);
    const tr = c.prop(TH_ART2.trophy, 12, 90, 5 + c.hero.h + 2, 6);
    c.snd('fanfare'); c.burst(c.hero, 9); c.pose(tr, P_GROW, 600).catch(() => {});
    await Promise.all([c.line(null, 'th.race.5'), c.pose(c.hero, P_HOP, 420, 2)]);
    c.flip(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.race.6'), c.pose(b, P_WIG, 500, 2)]);
    tr.remove(); c.flip(c.hero, false);
  } },
  { id:'hiccup', bg:'bug', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 62, 5); }, run: async (c) => {
    c.snd('boing');
    await Promise.all([c.line(c.pet, 'th.hiccup.1'), c.pose(c.pet, P_BIG, 600), c.wait(600).then(() => { c.snd('boing'); return c.pose(c.pet, P_BIG, 600); })]);
    await Promise.all([c.line(c.hero, 'th.hiccup.2'), c.pose(c.hero, P_BIG, 700)]);
    c.snd('boing'); await Promise.all([c.line(c.pet, 'th.hiccup.3'), c.pose(c.pet, P_BIG, 600)]);
    const cup = c.prop(TH_ART2.cup, 8, 50, 5, 4, 1.25);
    c.snd('pop'); await c.pose(cup, P_GROW, 500);
    await c.line(c.hero, 'th.hiccup.4');
    await c.go(cup, 62, 5 + c.pet.h - 4, 600); cup.remove();
    c.snd('boing'); await Promise.all([c.line(c.pet, 'th.hiccup.3'), c.pose(c.pet, P_BIG, 600)]);
    const b = c.boss(84, -30, 20);
    c.snd('whoosh'); await c.go(b, 84, 5, 400, 'ease-out');
    c.say(b, 'th.hiccup.5'); c.snd('thud');
    await Promise.all([c.pose(c.pet, P_FLIPJ, 800), c.pose(b, P_BIG, 600)]);
    await c.wait(400);
    await Promise.all([c.line(c.pet, 'th.hiccup.6'), c.pose(c.pet, P_HOP, 400, 2)]);
    c.brush(c.hero, true);
    await Promise.all([c.go(c.hero, 66, 5, 800), c.pose(c.hero, P_WALK, 300, 3)]);
    c.say(c.hero, 'th.hiccup.7'); c.snd('magic');
    await c.pose(c.hero, P_SHAKE, 280, 4);
    b.firstChild.innerHTML = germSVG('gold', true); c.burst(b, 9); c.brush(c.hero, false);
    for (let i = 0; i < 3; i++) c.floatProp(TH_ART.heart, 7, 56 + i * 12, 34);
    await Promise.all([c.line(null, 'th.hiccup.8'), c.pose(b, P_HOP, 400, 3), c.pose(c.pet, P_HOP, 400, 3)]);
  } },
  { id:'king', bg:'castle', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 66, 5); }, run: async (c) => {
    const cr = c.prop(TH_ART2.crown, 11, 66, 5 + c.pet.h - 3, 6, .62), tear = c.prop(TH_ART.tear, 3.5, 60, 5 + c.pet.h * .6, 6, 1.3);
    await Promise.all([c.line(null, 'th.king.1'), c.go(tear, 60, 6, 1800, 'ease-in')]);
    tear.remove();
    await Promise.all([c.line(c.pet, 'th.king.2'), c.pose(c.pet, P_WIG, 600, 2), c.pose(cr, P_WIG, 600, 2)]);
    await Promise.all([c.line(c.hero, 'th.king.3'), c.go(c.hero, 44, 5, 900), c.pose(c.hero, P_WALK, 300, 3)]);
    c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.king.4'), c.pose(c.hero, [{ transform:'translateY(0)' }, { transform:'translateY(-10%)' }, { transform:'translateY(0)' }], 500, 3)]);
    await Promise.all([c.line(c.hero, 'th.king.5'), c.pose(c.hero, P_SHAKE, 260, 5)]);
    c.brush(c.hero, false); c.snd('magic'); c.burst(c.pet, 9);
    await Promise.all([c.line(c.pet, 'th.king.6'), c.pose(c.pet, P_HOP, 400, 3), c.pose(cr, P_HOP, 400, 3)]);
    const md = c.prop(TH_ART.star, 10, 66, 30, 6);
    c.snd('ding', 5);
    await c.go(md, 44, 5 + c.hero.h - 6, 800, 'ease-in');
    c.burst(c.hero, 7);
    await Promise.all([c.line(null, 'th.king.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(md, P_SPIN, 800)]);
  } },
  { id:'swamp', bg:'swamp', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const spots = [[70, 30], [56, 14], [84, 16], [62, 46], [78, 44], [90, 30]];
    const gs = [c.prop(germSVG(1), 12, 70, 30, 4)];
    await Promise.all([c.line(null, 'th.swamp.1'), c.pose(gs[0], P_WIG, 500, 3)]);
    c.say(gs[0], 'th.swamp.2');
    for (let i = 1; i < spots.length; i++){ const g = c.prop(germSVG(i % 4), 12, spots[i][0], spots[i][1], 4); gs.push(g); c.snd('pop'); c.pose(g, P_GROW, 400).catch(() => {}); await c.wait(330); }
    await Promise.all(gs.map(g => c.pose(g, P_HOP, 380, 2)));
    await Promise.all([c.line(c.hero, 'th.swamp.3'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    await Promise.all([c.line(c.pet, 'th.swamp.4'), c.go(c.pet, 40, 5, 900), c.pose(c.pet, P_HOP, 300, 3)]);
    c.brush(c.hero, true); c.snd('blow');
    const bub = c.prop(TH_ART.bubble, 20, 72, 14, 5);
    await Promise.all([c.line(null, 'th.swamp.5'), c.pose(c.hero, P_SHAKE, 280, 5), c.pose(c.pet, P_WIG, 400, 3), c.morph(bub, 'scale(2.4)', 1800)]);
    c.snd('pop'); bub.remove(); c.burst({ x:72, y:34 }, 12); c.brush(c.hero, false);
    gs.forEach((g, i) => { c.pose(g, P_SPIN, 400, 3).catch(() => {}); c.go(g, g.pos.x + (i % 2 ? 40 : -20), 110, 900, 'ease-in').catch(() => {}); });
    await c.wait(900);
    await Promise.all([c.line(c.hero, 'th.swamp.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'song', bg:'bird', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 40, 5); }, run: async (c) => {
    const b = c.boss(76, 5, 20);
    const ns = [0, 1, 2].map(i => c.prop(TH_ART.note, 7, 70 + i * 7, 26 + (i % 2) * 6, 4));
    await Promise.all([c.line(null, 'th.song.1'), ...ns.map(n => c.pose(n, P_WIG, 500, 3))]);
    await Promise.all([c.line(b, 'th.song.2'), c.pose(b, P_HOP, 400, 3)]);
    await Promise.all([c.line(c.hero, 'th.song.3'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    await Promise.all([c.line(c.pet, 'th.song.4'), c.pose(c.pet, P_HOP, 380, 3)]);
    c.snd('music');
    for (let i = 0; i < 4; i++) c.floatProp(TH_ART.note, 7, 16 + i * 10, 34 + (i % 2) * 8);
    await Promise.all([c.line(c.hero, 'th.song.5'), c.pose(c.hero, P_WIG, 400, 4), c.pose(c.pet, P_HOP, 400, 4)]);
    c.snd('music');
    await Promise.all([c.line(b, 'th.song.6'), c.pose(b, P_WIG, 360, 5), ...ns.map((n, i) => c.go(n, 30 + i * 18, 110, 1800, 'ease-out'))]);
    ns.forEach(n => n.remove());
    for (let i = 0; i < 5; i++) c.floatProp(TH_ART.note, 7, 14 + i * 18, 40);
    await Promise.all([c.line(null, 'th.song.7'), c.pose(c.hero, P_SPIN, 800), c.pose(c.pet, P_SPIN, 800), c.pose(b, P_SPIN, 800)]);
  } },
  { id:'moon', bg:'castle', night:true, setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const mn = c.prop(TH_ART2.moon, 26, 74, 58, 2);
    const sp = [[66, 70], [80, 64], [74, 76]].map(([x, y], i) => c.prop(germSVG(i), 8, x, y, 3));
    await Promise.all([c.line(null, 'th.moon.1'), ...sp.map(g => c.pose(g, P_WIG, 500, 3))]);
    const rk = c.prop(TH_ART.rocket(), 22, 44, 5, 2, 1.25);
    c.snd('boing'); await c.pose(rk, P_GROW, 600);
    await Promise.all([c.line(c.hero, 'th.moon.2'), c.go(c.hero, 44, 22, 600, 'ease-out')]);
    c.say(c.pet, 'th.moon.3');
    for (let i = 0; i < 3; i++){ c.snd('beep'); await c.pose(rk, P_SHAKE, 200, 2); }
    c.snd('whoosh'); c.brush(c.hero, true);
    await Promise.all([c.go(rk, 52, 46, 1300, 'ease-in-out'), c.go(c.hero, 52, 63, 1300, 'ease-in-out'), c.pose(c.pet, P_HOP, 400, 3)]);
    c.snd('swish'); await c.pose(c.hero, P_SHAKE, 260, 4);
    sp.forEach((g, i) => { c.snd('pop'); c.burst(g, 5); c.pose(g, P_SPIN, 400, 3).catch(() => {}); c.go(g, g.pos.x + 30, 110, 900, 'ease-in').catch(() => {}); });
    c.brush(c.hero, false); c.snd('magic'); c.burst(mn, 12);
    await Promise.all([c.line(null, 'th.moon.4'), c.morph(mn, 'scale(1.18)', 800)]);
    await Promise.all([c.go(rk, 44, 5, 1200, 'ease-out'), c.go(c.hero, 44, 22, 1200, 'ease-out')]);
    c.snd('thud'); await c.go(c.hero, 30, 5, 500);
    await Promise.all([c.line(c.hero, 'th.moon.5'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } }
];
function playTheater(onDone, forceId, forceBg){                         // force…: 개발자 미리 보기용
  const st = store.get('theater', { n:0, g:[], b:[] });
  const k = (st.k || 0) % THEATER.length;                                     // v0.35.0 이야기는 1화부터 차례로 (bj_theater.k = 다음에 볼 이야기 번호)
  const gag = THEATER.find(x => x.id === forceId) || THEATER[k];
  const bg = THEATER_BGS.includes(forceBg) ? forceBg : (gag.bg || pickFresh(THEATER_BGS, st.b || []));
  if (!forceId){ st.k = k + 1; }
  st.n = (st.n || 0) + 1; st.g = [gag.id].concat(st.g || []).slice(0, 5); st.b = [bg].concat(st.b || []).slice(0, 3);
  store.set('theater', st);
  const nextGag = THEATER[(THEATER.indexOf(gag) + 1) % THEATER.length];
  const tok = ++thTok;
  let finished = false;
  const end = () => {
    if (finished) return; finished = true;
    thTok++; thEnd = null; Voice.stop();
    $('#thStage').innerHTML = ''; $('#thStage').className = 'th-stage';
    onDone();
  };
  thEnd = end;
  const stage = $('#thStage');
  stage.className = 'th-stage';
  const pal = companion();
  const look = Object.assign({}, effectiveLook());
  if (slotOf() === 'pm' && !look.head) look.head = 'head_nightcap';
  const title = t('th.' + gag.id + '.t');
  $('#thHead').innerHTML = `🎬 ${esc(t('th.name'))}<small>${esc(t('th.ep', { n:st.n }))} · ${esc(title)}</small>`;
  stage.innerHTML = thBgSvg(bg) + (slotOf() === 'pm' || gag.night ? '<div class="th-night"></div>' : '') +
    '<div class="th-cur l"></div><div class="th-cur r"></div>' +
    `<div class="th-title"><b>${esc(t('th.name'))}</b><span>${esc(t('th.ep', { n:st.n }))} · ${esc(title)}</span></div>`;
  const c = thCtx(stage, tok);
  c.hero = c.prop(Character.art(look), 32, 50, 5, 3, 250 / 220);
  c.pet = c.prop(pal ? petArt(pal) : eggArt(), 20, 78, 5, 3);
  c.P = { pet: pal ? petName(pal) : t('th.eggName'), boss: t('boss.' + curBoss.id) };
  c.nextTitle = t('th.' + nextGag.id + '.t');
  if (gag.setup) gag.setup(c);
  show('theater');
  (async () => {
    try{
      await c.opening(st.n, title);
      await gag.run(c);
      await c.ending();
    }catch(e){ if (e !== TH_STOP) console.error(e); }
    if (tok === thTok) end();
  })();
}
$('#thSkip').addEventListener('click', () => { sfx.tap(); if (thEnd) thEnd(); });
$('#theaterTest').addEventListener('click', () => { sfx.tap(); playTheater(() => { refreshHome(); show('home'); }); });
if (TEST_MODE) window.__bjTheater = (id, bg) => playTheater(() => { refreshHome(); show('home'); }, id, bg);   // 자동 테스트용
