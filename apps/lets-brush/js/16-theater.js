'use strict';

/* =========================================================
   14-4. 반짝이 극장 (v0.21.0)
     양치가 끝나면 약 20초짜리 짧은 이야기 (v0.35.0: 줄거리 있는 10편으로 새로 씀, 예전 개그 12편은 뺌. v0.39.1: 20편). 아이 의견: "미미자우르처럼 끝나고 영상이 나왔으면, 매번 다르게"
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
     v0.50.0 극장 2.0 도구 (아래 TH_FACE 앞 설명): c.cam · c.face · c.talk · c.iris · c.scene · c.quake. 시험판 21화 'dream'
     v0.51.0 6개월치: 이야기는 ep 번호 차례 (1 ~ 120화). 새 이야기는 16-th-s*.js 파일 (window.TH_EPS + addText 로 대사), 그림은 16-th-art.js
       c.cast(출연진) · c.defeat(세균, 방법?) 조합 장치 · c.enter · c.restyle · c.shower · c.many. 명절 편 season · 아침 한 컷 16-th-gags.js (TH_GAGS)
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
  const raw = id === 'bath' ? inkScene(BATH_BG, 3.5) : id === 'room' ? roomBG() : (thBgExtra(id) || habBG(id));   // v0.51.0 정원 · 구름 나라 · 밤하늘 · 동굴 · 이 마을 · 치과
  return `<svg class="th-bg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${raw}</svg>`;
}
/* v0.50.0 극장 2.0 도구 (시험판 '꿈속 세균 성' 에서 처음 씀, 예전 이야기도 그대로 동작)
     c.cam(x, y, 배율, ms)   카메라: 무대의 (x, y) 를 가운데로 당겨 확대 (배율 1 = 전체). 가장자리 밖은 안 보이게 자동으로 맞춤
     c.face(배우, 표정)      반짝이 표정: 'happy' · 'sad' · 'surprised' · 'determined'('angry') · 'sleep' · 'wink' · 'shy' · null(보통)
                             눈 · 눈썹 · 입 · 볼 · 몸을 다 씀 (영상 바이블 FACE LOCK 은 AI 영상용 제한이라 극장엔 안 씀)
     c.talk(배우, 켜기)      말하기: 반짝이는 입이 뻐끔뻐끔, 펫 · 세균은 통통. c.line · c.say 가 말하는 동안 저절로 켬
     c.iris(닫기) · c.scene(배경, 밤)   동그랗게 닫혔다 열리는 장면 전환 · 배경 바꾸기
     c.quake(ms)             화면 흔들기
   무대 구조: .th-stage > .th-world(배경 · 배우 · 효과, 카메라가 움직이는 층) + 말풍선 · 막 · 제목(카메라와 상관없이 고정) */
// v0.51.0 표정: 눈 · 눈썹 · 입 · 볼 · 몸을 다 씀 (영상 바이블의 FACE LOCK 은 AI 영상이 흔들려서 만든 제한이라 SVG 극장에는 안 씀)
const TH_EYES_HAPPY = '<path d="M66 86 Q78 70 90 86 M110 86 Q122 70 134 86" fill="none" stroke="#24324a" stroke-width="6" stroke-linecap="round"/>';
const TH_BLUSH = '<g fill="#ff7aa8" opacity=".55"><ellipse cx="58" cy="105" rx="12" ry="8"/><ellipse cx="142" cy="105" rx="12" ry="8"/></g>';
const TH_FACE = {
  happy: TH_EYES_HAPPY + '<path class="mo" d="M86 100 Q100 126 114 100Z" fill="#8a2346" stroke="#24324a" stroke-width="4" stroke-linejoin="round"/><ellipse class="mo" cx="100" cy="113" rx="7" ry="3.5" fill="#ff8fa3"/>' + TH_BLUSH,
  sad:'<path d="M62 66 L88 58 M112 58 L138 66" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="5"/><path class="mo" d="M89 111 Q100 101 111 111" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="5.5"/>',
  surprised:'<path d="M64 60 Q77 50 90 58 M110 58 Q123 50 136 60" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="5"/><ellipse class="mo" cx="100" cy="108" rx="6.5" ry="8" fill="#8a2346" stroke="#24324a" stroke-width="4"/>',
  determined:'<path d="M62 58 L88 67 M112 67 L138 58" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="5.5"/><path class="mo" d="M89 106 L111 106" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="5.5"/>' + TH_BLUSH,
  sleep:'<path d="M66 80 Q78 90 90 80 M110 80 Q122 90 134 80" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="5.5"/><path class="mo" d="M93 105 Q100 109 107 105" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="4.5"/>',
  wink:'<path d="M110 84 Q122 76 134 84" fill="none" stroke="#24324a" stroke-linecap="round" stroke-width="6"/>' + TH_BLUSH,
  shy: TH_BLUSH + TH_BLUSH
};
TH_FACE.angry = TH_FACE.determined;                                         // 예전 이름
function thCtx(stage, tok){
  const chk = () => { if (tok !== thTok) throw TH_STOP; };
  const world = stage.querySelector('.th-world') || stage;
  let cam = { x:50, y:50, z:1 };
  const camFix = (v, z) => Math.max(50 / z, Math.min(100 - 50 / z, v));
  const onScreen = (x, y) => ({ x:50 + (x - cam.x) * cam.z, y:50 + (y - cam.y) * cam.z });   // 무대 % → 화면 % (말풍선 자리)
  const wait = async (ms) => { await new Promise(r => setTimeout(r, ms)); chk(); };
  const actor = (svg, w, x, y, z = 2, ratio = 1) => {
    const a = document.createElement('div'); a.className = 'th-a';
    a.style.cssText = `width:${w}%;margin-left:${-w / 2}%;left:${x}%;bottom:${y}%;z-index:${z}`;
    a.innerHTML = `<div class="th-in">${svg}</div>`;
    a.pos = { x, y }; a.w = w; a.h = w * ratio;
    if (svg.indexOf('viewBox="-38 -42 76 76"') >= 0) a.role = 'boss';      // v0.52.5 세균 그림이면 세균 목소리
    world.appendChild(a); return a;
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
  let bubT = 0, lastBub = null;
  /* v0.52.4 말하는 사람마다 목소리 높낮이 · 빠르기 (목소리 톤 설정에 곱함). 해설은 차분하게, 세균은 낮게, 펫 · 친구들은 높게 */
  const TH_VOICE = { nar:{ pitch:.92, rate:.97 }, hero:{ pitch:1.06, rate:1 }, pet:{ pitch:1.28, rate:1.04 }, boss:{ pitch:.62, rate:1.06 },
    pipi:{ pitch:1.36, rate:1.04 }, mongi:{ pitch:1.16, rate:.97 }, coco:{ pitch:1.42, rate:1.06 }, duri:{ pitch:.9, rate:.95 }, prop:{ pitch:.84, rate:.95 } };
  const roleOf = (a) => !a ? 'nar' : a === c.hero ? 'hero' : a === c.pet ? 'pet' : TH_VOICE[a.role] ? a.role : 'prop';
  const voiceOf = (a) => TH_VOICE[roleOf(a)];
  const say = (a, key, prm = {}, dur = 2600) => {
    prm = Object.assign({}, c.P || {}, prm);
    const txt = t(key, prm);
    stage.querySelectorAll('.th-bub').forEach(b => b.remove());
    const b = document.createElement('div'); b.className = 'th-bub' + (a ? '' : ' nar'); b.textContent = txt;
    if (a){
      const top = onScreen(a.pos.x, a.pos.y + a.h), x = Math.max(24, Math.min(76, top.x)), y = Math.min(80, Math.max(8, top.y + 3));   // 카메라를 따라 머리 위
      b.style.left = x + '%'; b.style.bottom = y + '%';
    }
    stage.appendChild(b);
    if (a){                                                          // 무대 밖으로 나가지 않게 가운데 위치를 당김
      const sw = stage.clientWidth, bw = b.offsetWidth, cx = parseFloat(b.style.left) / 100 * sw;
      b.style.left = Math.max(bw / 2 + 6, Math.min(sw - bw / 2 - 6, cx)) + 'px';
    }
    clearTimeout(bubT); bubT = setTimeout(() => { b.remove(); }, dur); lastBub = b;
    if (a && !a.classList.contains('talk')){ talk(a, true); setTimeout(() => talk(a, false), Math.min(dur, lineMs(txt))); }
    /* v0.52.5 대사마다 AI 음성 파일(voice/<언어>.json)이 있으면 그 파일 (없으면 기기 목소리). 대장 세균 이름이 든 대사는 세균마다 파일이 따로: 키@세균id
       자동 점검 · tools/voice.js 가 "누가 말하는지"를 모으려고 window.__thSay 에 [키, 역할] 을 남김 */
    const vkey = /\{boss/.test(lookup(key) || '') ? key + '@' + curBoss.id : key;
    if (window.__thSay) window.__thSay.push([key, roleOf(a)]);
    Voice.play(vkey, txt, voiceOf(a));
    return txt;
  };
  const lineMs = (txt) => Math.max(1700, 700 + [...txt].length * (lang === 'en' ? 55 : 95));   // 읽는 시간 (한 · 일은 글자당 더 길게)
  const talk = (a, on) => { if (a && a.classList) a.classList.toggle('talk', !!on); };
  /* v0.52.4 대사: 앞 말(제목 소개 · 물리칠 때 외침)이 끝난 뒤 시작하고, 목소리가 다 끝날 때까지 기다림 (읽는 시간보다 짧게 끝내지 않음)
     목소리를 꺼 두면 읽는 시간만큼. 말이 끝나면 말풍선도 곧 내림 */
  const line = async (a, key, prm = {}) => {
    await Voice.wait(7000); chk();
    const txt = t(key, Object.assign({}, c.P || {}, prm)), ms = lineMs(txt);
    say(a, key, prm, 60000); talk(a, true);
    const b = lastBub;
    try{ await Promise.all([wait(ms), Voice.wait(4000 + [...txt].length * 450)]); chk(); await wait(250); }
    finally { talk(a, false); }
    setTimeout(() => { if (b && b.isConnected && b === lastBub) b.remove(); }, 500);
  };
  const burst = (a, n = 7) => {
    const cx = a.pos ? a.pos.x : a.x, cy = a.pos ? a.pos.y + a.h / 2 : a.y;
    for (let i = 0; i < n; i++){
      const f = document.createElement('div'); f.className = 'th-fx'; f.innerHTML = TH_ART.star;
      f.style.left = cx + '%'; f.style.bottom = cy + '%'; world.appendChild(f);
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
    stage, world, wait, go, pose, morph, say, line, burst, floatProp, talk,
    async cam(x, y, z = 1, ms = 800){
      z = Math.max(1, z); const to = { x:camFix(x, z), y:camFix(y, z), z };
      const tf = (k) => `translate(${50 - k.z * k.x}%, ${50 - k.z * (100 - k.y)}%) scale(${k.z})`;
      const an = world.animate([{ transform:tf(cam) }, { transform:tf(to) }], { duration:Math.max(1, ms), easing:'cubic-bezier(.45,0,.25,1)', fill:'forwards' });
      cam = to;
      try{ await an.finished; }catch(e){}
      chk();
    },
    face(a, kind){
      const sv = a && a.querySelector('svg.char'); if (!sv) return;
      Object.keys(TH_FACE).forEach(k => sv.classList.remove('face-' + k));
      const old = sv.querySelector('.th-face'); if (old) old.remove();
      a.classList.toggle('sleeping', kind === 'sleep');
      if (!kind || !TH_FACE[kind]) return;
      sv.classList.add('face-' + kind);
      const host = sv.querySelector('.eyes') ? sv.querySelector('.eyes').parentNode : sv;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'th-face'); g.innerHTML = TH_FACE[kind];
      host.appendChild(g);
    },
    async iris(close, ms = 700){
      const a = 'circle(75% at 50% 50%)', b = 'circle(0% at 50% 50%)';
      const an = world.animate([{ clipPath:close ? a : b }, { clipPath:close ? b : a }], { duration:ms, easing:'ease-in-out', fill:'forwards' });
      try{ await an.finished; }catch(e){}
      chk();
    },
    scene(bg, night){
      const old = world.querySelector('.th-bg'); if (old) old.outerHTML = thBgSvg(bg);
      let n = world.querySelector('.th-night');
      if (night && !n){ n = document.createElement('div'); n.className = 'th-night'; world.insertBefore(n, world.querySelector('.th-bg').nextSibling); }
      if (!night && n && slotOf() !== 'pm') n.remove();
    },
    async quake(ms = 500){
      const an = stage.animate([{ transform:'translate(0,0)' }, { transform:'translate(-1.5%,1%)' }, { transform:'translate(1.5%,-1%)' }, { transform:'translate(-1%,0)' }, { transform:'translate(0,0)' }],
        { duration:ms, iterations:1 });
      try{ await an.finished; }catch(e){}
      chk();
    },
    prop: actor,
    place(a, x, y){ a.getAnimations().forEach(an => an.cancel()); a.pos = { x, y }; a.style.left = x + '%'; a.style.bottom = y + '%'; },   // v0.50.0 앞서 움직인(go) 자리를 지우고 옮김
    boss(x, y, w = 20){ const b = actor(germSVG(curBoss.col, curBoss), w, x, y, 1); b.role = 'boss'; return b; },
    flip(a, on){ a.style.transform = on ? 'scaleX(-1)' : ''; },
    brush(a, on){ const s = a.querySelector('svg.char'); if (s) s.classList.toggle('brushing', !!on); },
    snd(k, i){ if (TH_SND[k]) TH_SND[k](i); },
    shuffle(arr){ return arr.map(v => [Math.random(), v]).sort((p, q) => p[0] - q[0]).map(v => v[1]); },
    async enter(a, x, ms = 900){ await Promise.all([go(a, x, a.pos.y, ms), pose(a, P_WALK, 300, Math.max(1, Math.round(ms / 300)))]); },   // v0.51.0 걸어서 들어오기
    restyle(a, svg){ a.firstChild.innerHTML = svg; },                         // v0.51.0 그림 바꾸기 (변신 · 소품 바뀜)
    async shower(svg, n = 10, ms = 2200, w = 5){                              // v0.51.0 위에서 쏟아짐 (비 · 눈 · 별사탕 · 거품)
      for (let i = 0; i < n; i++){
        const f = actor(svg, w, 6 + Math.random() * 88, 105, 7);
        f.animate([{ bottom:'105%' }, { bottom:'-15%' }], { duration:ms * (.55 + Math.random() * .45), delay:i * ms / n * .7, easing:'ease-in', fill:'forwards' }).onfinish = () => f.remove();
      }
      await wait(ms);
    },
    many(svg, n, y, w, z = 2){ return Array.from({ length:n }, (_, i) => actor(svg, w, 15 + i * 70 / Math.max(1, n - 1), y, z)); },
    cast(name, x, y, w = 24, z = 3){ const a = actor(CAST_ART[name] || '', w, x, y, z); a.classList.add('cast'); a.role = name; return a; },   // v0.51.0 피피 · 몽이 · 코코 · 두리
    /* v0.51.0 조합 장치: 세균 물리치기 (이야기마다 how 를 안 정하면 매번 다섯 가지 중 하나 → 같은 편도 볼 때마다 다르게)
       'brush' 칫솔 돌진 · 'foam' 거품 폭탄 · 'pet' 펫 몸통 박치기 · 'song' 양치 노래에 춤추다 떠남 · 'rinse' 헹굼 물결 */
    async defeat(b, how){
      const WAYS = ['brush', 'foam', 'pet', 'song', 'rinse'];
      how = WAYS.includes(how) ? how : pick(WAYS);
      const H = c.hero, P = c.pet, bx = b.pos.x, by = b.pos.y;
      if (how === 'brush'){
        c.face(H, 'determined'); c.brush(H, true); TH_SND.swish();
        await Promise.all([go(H, Math.max(10, bx - 24), H.pos.y, 650), pose(H, P_WALK, 300, 2)]);
        say(H, 'th.d.brush');
        await Promise.all([pose(H, P_SHAKE, 230, 5), pose(b, P_SHAKE, 230, 5)]);
        c.brush(H, false);
      } else if (how === 'foam'){
        c.face(H, 'determined'); say(H, 'th.d.foam'); TH_SND.blow();
        const bs = [0, 1, 2].map(i => actor(TH_ART.bubble, 9, H.pos.x + 8, H.pos.y + 18 + i * 6, 6));
        await Promise.all(bs.map((q, i) => go(q, bx + (i - 1) * 6, by + 6 + i * 8, 600 + i * 150)));
        bs.forEach(q => q.remove());
        const big = actor(TH_ART.bubble, Math.min(48, (b.w || 20) * 1.6), bx, by - 4, 6);
        TH_SND.pop();
        await Promise.all([go(b, bx, 110, 1300, 'ease-in'), go(big, bx, 106, 1300, 'ease-in'), pose(b, P_WIG, 320, 4)]);
        big.remove(); c.face(H, 'happy'); return how;
      } else if (how === 'pet'){
        say(P, 'th.d.pet'); TH_SND.whoosh();
        const px = P.pos.x;
        await Promise.all([go(P, bx - 8, P.pos.y, 600, 'ease-in'), pose(P, P_BIG, 600)]);
        TH_SND.thud(); c.quake(350).catch(() => {});
        c.pose(b, P_SPIN, 380, 3).catch(() => {});
        await Promise.all([go(b, 125, 85, 900, 'ease-in'), go(P, px, P.pos.y, 900)]);
        c.face(H, 'happy'); return how;
      } else if (how === 'song'){
        say(null, 'th.d.song'); TH_SND.music();
        [0, 1, 2, 3].forEach(i => setTimeout(() => { if (tok === thTok) floatProp(TH_ART.note, 6, 20 + i * 18, 30 + (i % 2) * 10); }, i * 350));
        await Promise.all([pose(b, P_WIG, 330, 6), pose(H, P_HOP, 400, 3), pose(P, P_HOP, 400, 3)]);
        say(b, 'th.d.bye');
        await Promise.all([go(b, 125, by + 10, 1300), pose(b, P_WALK, 320, 4)]);
        c.face(H, 'happy'); return how;
      } else {
        c.face(H, 'determined'); say(H, 'th.d.rinse'); TH_SND.whoosh();
        const wv = actor(TH_P.wave, 60, -40, 0, 7, .5);
        await go(wv, bx, 0, 700, 'ease-out');
        c.pose(b, P_SPIN, 380, 3).catch(() => {});
        await Promise.all([go(wv, 150, 0, 900, 'ease-in'), go(b, 140, by + 20, 900, 'ease-in')]);
        wv.remove(); c.face(H, 'happy'); return how;
      }
      TH_SND.pop(); burst(b, 9); c.quake(350).catch(() => {});
      await morph(b, 'scale(.4)', 500);
      c.pose(b, P_SPIN, 380, 3).catch(() => {});
      await go(b, 125, 85, 900, 'ease-in');
      c.face(H, 'happy'); return how;
    },
    async opening(n, title){
      TH_SND.fanfare();
      Voice.play(c.quick ? 'th.gagOpen' : 'th.open', c.quick ? t('th.gagOpen') : c.fav ? t('th.favOpen', { title }) : t('th.open', { n, title }), { pitch:.95, rate:1 });
      await wait(c.quick ? 900 : 1800);
      stage.classList.add('open'); await wait(c.quick ? 600 : 900);
      const tt = stage.querySelector('.th-title'); if (tt) tt.remove();
    },
    async ending(){
      if (c.quick){                                                              // v0.51.0 아침 짧은 극장: 짧게 인사만
        say(null, 'th.gagEnd'); TH_SND.ding(4);
        await Promise.all([pose(c.hero, P_HOP, 420, 2), pose(c.pet, P_HOP, 420, 2)]);
        await wait(1100);                                                         // v0.52.0 ♡ 누를 틈
        stage.classList.remove('open'); await wait(700); return;
      }
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
// v0.39.1 이야기 11~20 소품
const TH_ART3 = {
  tooth: stickerSvg('<svg viewBox="-20 -25 40 50" aria-hidden="true"><path d="M-16 -14 Q-17 -24 -6 -22 Q0 -18 6 -22 Q17 -24 16 -14 Q15 2 11 14 Q8 23 5 16 Q2 8 0 8 Q-2 8 -5 16 Q-8 23 -11 14 Q-15 2 -16 -14Z" fill="#ffffff"/><path d="M-11 -14 Q-9 -19 -3 -18" stroke="#e8eef6" stroke-width="3" fill="none" stroke-linecap="round"/></svg>', 2.4),
  apple: stickerSvg('<svg viewBox="-14 -16 28 30" aria-hidden="true"><path d="M0 -8 Q-12 -14 -12 -2 Q-12 12 0 12 Q12 12 12 -2 Q12 -14 0 -8Z" fill="#ff5d5d"/><path d="M0 -8 Q1 -13 3 -15" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M2 -12 Q8 -16 10 -11 Q5 -9 2 -12Z" fill="#6cc46a"/><ellipse cx="-6" cy="-3" rx="2.4" ry="4" fill="#fff" opacity=".45"/></svg>', 1.6),
  sun: stickerSvg('<svg viewBox="-26 -26 52 52" aria-hidden="true"><circle r="15" fill="#ffd54a"/>' + Array.from({ length:8 }, (_, i) => `<path transform="rotate(${i * 45})" d="M0 -18 L3 -24 L-3 -24Z" fill="#ffb347"/>`).join('') + '</svg>', 2),
  cloudGray: stickerSvg('<svg viewBox="-50 -30 100 60" aria-hidden="true"><g fill="#a8b0c0"><ellipse cx="0" cy="8" rx="44" ry="16"/><circle cx="-18" cy="-2" r="16"/><circle cx="8" cy="-10" r="20"/><circle cx="28" cy="2" r="13"/></g><circle cx="-6" cy="2" r="3" fill="#24324a"/><circle cx="10" cy="2" r="3" fill="#24324a"/><path d="M-6 12 Q2 8 10 12" stroke="#24324a" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>', 3),
  cloudWhite: '<svg viewBox="-50 -30 100 60" aria-hidden="true"><g fill="#ffffff" stroke="#24324a" stroke-width="3"><ellipse cx="0" cy="8" rx="44" ry="16"/><circle cx="-18" cy="-2" r="16"/><circle cx="8" cy="-10" r="20"/><circle cx="28" cy="2" r="13"/></g><g fill="#ffffff"><ellipse cx="0" cy="8" rx="42" ry="14"/><circle cx="-18" cy="-2" r="14"/><circle cx="8" cy="-10" r="18"/><circle cx="28" cy="2" r="11"/></g><circle cx="-6" cy="2" r="3" fill="#24324a"/><circle cx="10" cy="2" r="3" fill="#24324a"/><path d="M-6 9 Q2 15 10 9" stroke="#24324a" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="-16" cy="8" rx="4" ry="2.4" fill="#ffb3c7"/><ellipse cx="20" cy="8" rx="4" ry="2.4" fill="#ffb3c7"/></svg>',
  rainbow: '<svg viewBox="-60 -40 120 60" aria-hidden="true"><g fill="none" stroke-width="8" stroke-linecap="round">' + [['#ff8a8a', 50], ['#ffd27a', 42], ['#a8e6a0', 34], ['#8fc8ff', 26], ['#c9a8ff', 18]].map(([cl, r]) => `<path d="M${-r} 16 A${r} ${r} 0 0 1 ${r} 16" stroke="${cl}"/>`).join('') + '</g></svg>',
  mirror: stickerSvg('<svg viewBox="-10 -20 20 32" aria-hidden="true"><rect x="-1.6" y="-4" width="3.2" height="16" rx="1.6" fill="#9aa8bd"/><circle cy="-11" r="8" fill="#cfefff"/><ellipse cx="-3" cy="-14" rx="2" ry="3" fill="#fff"/></svg>', 1.6),
  mirrorBig: stickerSvg('<svg viewBox="-40 -50 80 100" aria-hidden="true"><ellipse rx="34" ry="44" fill="#ffd27a"/><ellipse rx="28" ry="38" fill="#e6f7ff"/><path d="M-18 -24 Q-12 -32 -4 -32" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>', 3),
  cake: stickerSvg('<svg viewBox="-24 -30 48 44" aria-hidden="true"><rect x="-20" y="-6" width="40" height="18" rx="4" fill="#ffd6e6"/><path d="M-20 -2 Q-14 4 -8 -2 Q-2 4 4 -2 Q10 4 16 -2 Q18 0 20 -2 V-6 H-20Z" fill="#ffffff"/><rect x="-22" y="10" width="44" height="4" rx="2" fill="#ffd54a"/>' + [-10, 0, 10].map(x => `<rect x="${x - 1.6}" y="-18" width="3.2" height="12" rx="1" fill="#8fc8ff"/><path class="flame" d="M${x} -26 Q${x + 3} -21 ${x} -18 Q${x - 3} -21 ${x} -26Z" fill="#ffb347"/>`).join('') + '</svg>', 2),
  cakeOut: stickerSvg('<svg viewBox="-24 -30 48 44" aria-hidden="true"><rect x="-20" y="-6" width="40" height="18" rx="4" fill="#ffd6e6"/><path d="M-20 -2 Q-14 4 -8 -2 Q-2 4 4 -2 Q10 4 16 -2 Q18 0 20 -2 V-6 H-20Z" fill="#ffffff"/><rect x="-22" y="10" width="44" height="4" rx="2" fill="#ffd54a"/>' + [-10, 0, 10].map(x => `<rect x="${x - 1.6}" y="-18" width="3.2" height="12" rx="1" fill="#8fc8ff"/><path d="M${x} -20 q2 -3 0 -6" stroke="#c8ccd8" stroke-width="1.4" fill="none" opacity=".45"/>`).join('') + '</svg>', 2)
};
// v0.51.0 소품 한곳에서 (16-th-art.js 의 TH_P 에 예전 소품도 이어 붙임) + 헹굼 물결
Object.assign(TH_P, { star:TH_ART.star, heart:TH_ART.heart, note:TH_ART.note, bubble:TH_ART.bubble, banana:TH_ART.banana, bush:TH_ART.bush, tear:TH_ART.tear,
  candy:TH_ART2.candy, crown:TH_ART2.crown, cup:TH_ART2.cup, trophy:TH_ART2.trophy, zzz:TH_ART2.zzz,
  tooth:TH_ART3.tooth, apple:TH_ART3.apple, sun:TH_ART3.sun, cloudGray:TH_ART3.cloudGray, cloudWhite:TH_ART3.cloudWhite, rainbow:TH_ART3.rainbow, mirror:TH_ART3.mirror, mirrorBig:TH_ART3.mirrorBig, cake:TH_ART3.cake,
  wave: stickerSvg('<svg viewBox="-60 -30 120 60" aria-hidden="true"><path d="M-60 30 V2 Q-45 -22 -30 2 Q-15 -22 0 2 Q15 -22 30 2 Q45 -22 60 2 V30Z" fill="#8fd3ff"/><path d="M-50 6 Q-40 -6 -32 4 M-10 6 Q0 -6 8 4 M30 6 Q40 -6 48 4" stroke="#ffffff" stroke-width="3" fill="none"/></svg>', 3) });
const P_TINY = [{ transform:'translateY(0)' }, { transform:'translateY(-14%)' }, { transform:'translateY(0)' }];
const P_LOOK = [{ transform:'scaleX(1)' }, { transform:'scaleX(-1)' }, { transform:'scaleX(-1)' }, { transform:'scaleX(1)' }];
const P_YAWN = [{ transform:'scale(1,1)' }, { transform:'scale(.96,1.08) rotate(-4deg)' }, { transform:'scale(1,1)' }];
const THEATER = [
  { id:'candy', ep:31, bg:'room', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cd = c.prop(TH_ART2.candy, 13, 70, 5, 2, .53);
    await Promise.all([c.line(null, 'th.candy.1'), c.pose(cd, P_TINY, 500, 3)]);
    const b = c.boss(118, 5);
    await Promise.all([c.go(b, 78, 5, 1400), c.pose(b, P_WALK, 350, 4)]);
    cd.remove(); c.snd('pop'); c.burst(b, 5);
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.candy.2'), c.morph(b, 'scale(1.5)', 900)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.candy.3'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    c.face(c.hero, null);
    c.say(c.pet, 'th.candy.4');
    await Promise.all([c.go(c.pet, -15, 5, 700), c.pose(c.pet, P_HOP, 350, 2)]);
    const br = c.prop(TH_ART2.brushMini(), 22, -15, 16, 4, .37);
    await Promise.all([c.go(c.pet, 40, 5, 900), c.go(br, 40, 16, 900), c.pose(c.pet, P_HOP, 300, 3)]);
    c.face(c.hero, 'determined'); br.remove(); c.brush(c.hero, true);
    await Promise.all([c.go(c.hero, 56, 5, 600), c.pose(c.hero, P_WALK, 300, 2)]);
    c.say(c.hero, 'th.candy.5'); c.snd('swish');
    await c.pose(c.hero, P_SHAKE, 260, 4);
    c.snd('pop'); c.burst(b, 9); await c.morph(b, 'scale(.5)', 600);
    c.pose(b, P_SPIN, 400, 3).catch(() => {}); await c.go(b, 130, 70, 900, 'ease-in');
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.candy.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'lostbrush', ep:1, bg:'bath', setup(c){ c.place(c.hero, 34, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.lostbrush.1'), c.pose(c.hero, P_LOOK, 1400)]);
    await c.cam(50, 50, 1, 500);
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
    c.face(c.hero, 'determined'); br.remove(); c.brush(c.hero, true);
    c.face(c.hero, 'surprised');
    await c.line(c.hero, 'th.lostbrush.5');
    c.face(c.hero, null);
    c.snd('swish'); c.say(g, 'th.lostbrush.6');
    await c.pose(c.hero, P_SHAKE, 260, 4);
    c.snd('pop'); c.burst(g, 9); c.pose(g, P_SPIN, 400, 3).catch(() => {}); await c.go(g, 110, 95, 900, 'ease-in');
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.lostbrush.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'treasure', ep:51.5, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ch = c.prop(TH_ART2.chest, 30, 62, 5, 2, .75);
    c.snd('boing');
    await Promise.all([c.line(null, 'th.treasure.1'), c.pose(ch, P_GROW, 800)]);
    await Promise.all([c.go(c.hero, 40, 5, 700), c.pose(c.hero, P_WALK, 350, 2)]);
    await Promise.all([c.line(c.hero, 'th.treasure.2'), c.pose(c.hero, P_SHAKE, 280, 4), c.pose(ch, P_SHAKE, 280, 4)]);
    const b = c.boss(66, 0, 18);
    await c.go(b, 66, 24, 500, 'ease-out');
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.treasure.3'), c.pose(b, P_WIG, 500, 3)]);
    await c.cam(50, 50, 1, 500);
    await Promise.all([c.line(c.pet, 'th.treasure.4'), c.pose(c.pet, P_HOP, 380, 3)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.snd('magic');
    await c.pose(c.hero, P_SHAKE, 260, 4);
    c.snd('pop'); c.burst(b, 8); c.pose(b, P_SPIN, 400, 3).catch(() => {}); c.go(b, 120, 90, 900, 'ease-in').catch(() => {});
    await c.wait(400);
    ch.firstChild.innerHTML = TH_ART2.chestOpen; c.snd('fanfare'); c.burst({ x:62, y:30 }, 10);
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    for (let i = 0; i < 4; i++) c.floatProp(TH_ART.star, 8, 54 + i * 6, 24);
    c.face(c.hero, 'happy');
    await c.line(null, 'th.treasure.5');
    for (let i = 0; i < 3; i++) c.floatProp(TH_ART.heart, 7, 24 + i * 10, 34);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.treasure.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
    c.face(c.hero, null);
  } },
  { id:'sleepy', ep:8, bg:'room', night:true, setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 70, 5); }, run: async (c) => {
    c.floatProp(TH_ART2.zzz, 6, 76, 28); c.floatProp(TH_ART2.zzz, 6, 80, 34);
    await Promise.all([c.line(c.pet, 'th.sleepy.1'), c.pose(c.pet, P_YAWN, 900, 2)]);
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.sleepy.2'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    await c.cam(50, 50, 1, 500);
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
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.snd('swish');
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.sleepy.6'), c.pose(c.hero, P_SHAKE, 280, 5), c.pose(c.pet, P_WIG, 400, 3)]);
    c.face(c.hero, null);
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    for (let i = 0; i < 3; i++) c.floatProp(TH_ART.heart, 7, 40 + i * 12, 34);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.sleepy.7'), c.pose(c.pet, P_YAWN, 900)]);
  } },
  { id:'race', ep:22.5, bg:'safari', setup(c){ c.place(c.hero, 12, 5); c.place(c.pet, 50, 5); }, run: async (c) => {
    const b = c.boss(28, 5, 18), fl = c.prop(TH_ART2.flag, 9, 92, 5, 1, 1.5);
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.race.1'), c.pose(b, P_HOP, 400, 3)]);
    await c.cam(50, 50, 1, 500);
    c.say(null, 'th.race.2'); c.snd('beep'); await c.wait(600); c.snd('beep'); await c.wait(600); c.snd('fanfare');
    await Promise.all([c.go(b, 66, 5, 1300, 'ease-in'), c.pose(b, P_WALK, 260, 5), c.go(c.hero, 36, 5, 1300, 'linear'), c.pose(c.hero, P_WALK, 330, 4)]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.race.3'), c.go(c.hero, 44, 5, 1400, 'linear'), c.pose(c.hero, P_WALK, 350, 4)]);
    c.face(c.hero, null);
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
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.race.5'), c.pose(c.hero, P_HOP, 420, 2)]);
    c.flip(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.race.6'), c.pose(b, P_WIG, 500, 2)]);
    tr.remove(); c.flip(c.hero, false);
  } },
  { id:'hiccup', ep:37.5, bg:'bug', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 62, 5); }, run: async (c) => {
    c.snd('boing');
    await Promise.all([c.line(c.pet, 'th.hiccup.1'), c.pose(c.pet, P_BIG, 600), c.wait(600).then(() => { c.snd('boing'); return c.pose(c.pet, P_BIG, 600); })]);
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.hiccup.2'), c.pose(c.hero, P_BIG, 700)]);
    await c.cam(50, 50, 1, 500);
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
    c.face(c.hero, 'determined'); c.brush(c.hero, true);
    await Promise.all([c.go(c.hero, 66, 5, 800), c.pose(c.hero, P_WALK, 300, 3)]);
    c.say(c.hero, 'th.hiccup.7'); c.snd('magic');
    await c.pose(c.hero, P_SHAKE, 280, 4);
    b.firstChild.innerHTML = germSVG('gold', true); c.burst(b, 9); c.brush(c.hero, false); c.face(c.hero, 'happy');
    for (let i = 0; i < 3; i++) c.floatProp(TH_ART.heart, 7, 56 + i * 12, 34);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.hiccup.8'), c.pose(b, P_HOP, 400, 3), c.pose(c.pet, P_HOP, 400, 3)]);
  } },
  { id:'king', ep:90.5, bg:'castle', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 66, 5); }, run: async (c) => {
    const cr = c.prop(TH_ART2.crown, 11, 66, 5 + c.pet.h - 3, 6, .62), tear = c.prop(TH_ART.tear, 3.5, 60, 5 + c.pet.h * .6, 6, 1.3);
    await Promise.all([c.line(null, 'th.king.1'), c.go(tear, 60, 6, 1800, 'ease-in')]);
    tear.remove();
    await Promise.all([c.line(c.pet, 'th.king.2'), c.pose(c.pet, P_WIG, 600, 2), c.pose(cr, P_WIG, 600, 2)]);
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.king.3'), c.go(c.hero, 44, 5, 900), c.pose(c.hero, P_WALK, 300, 3)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined'); c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.king.4'), c.pose(c.hero, [{ transform:'translateY(0)' }, { transform:'translateY(-10%)' }, { transform:'translateY(0)' }], 500, 3)]);
    await Promise.all([c.line(c.hero, 'th.king.5'), c.pose(c.hero, P_SHAKE, 260, 5)]);
    c.brush(c.hero, false); c.face(c.hero, 'happy'); c.snd('magic'); c.burst(c.pet, 9);
    await Promise.all([c.line(c.pet, 'th.king.6'), c.pose(c.pet, P_HOP, 400, 3), c.pose(cr, P_HOP, 400, 3)]);
    const md = c.prop(TH_ART.star, 10, 66, 30, 6);
    c.snd('ding', 5);
    await c.go(md, 44, 5 + c.hero.h - 6, 800, 'ease-in');
    c.burst(c.hero, 7);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.king.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(md, P_SPIN, 800)]);
  } },
  { id:'swamp', ep:92.5, bg:'swamp', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const spots = [[70, 30], [56, 14], [84, 16], [62, 46], [78, 44], [90, 30]];
    const gs = [c.prop(germSVG(1), 12, 70, 30, 4)];
    await Promise.all([c.line(null, 'th.swamp.1'), c.pose(gs[0], P_WIG, 500, 3)]);
    c.say(gs[0], 'th.swamp.2');
    for (let i = 1; i < spots.length; i++){ const g = c.prop(germSVG(i % 4), 12, spots[i][0], spots[i][1], 4); gs.push(g); c.snd('pop'); c.pose(g, P_GROW, 400).catch(() => {}); await c.wait(330); }
    await Promise.all(gs.map(g => c.pose(g, P_HOP, 380, 2)));
    c.face(c.hero, 'surprised');
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.swamp.3'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, null);
    await Promise.all([c.line(c.pet, 'th.swamp.4'), c.go(c.pet, 40, 5, 900), c.pose(c.pet, P_HOP, 300, 3)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.snd('blow');
    const bub = c.prop(TH_ART.bubble, 20, 72, 14, 5);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.swamp.5'), c.pose(c.hero, P_SHAKE, 280, 5), c.pose(c.pet, P_WIG, 400, 3), c.morph(bub, 'scale(2.4)', 1800)]);
    c.snd('pop'); bub.remove(); c.burst({ x:72, y:34 }, 12); c.brush(c.hero, false); c.face(c.hero, 'happy');
    gs.forEach((g, i) => { c.pose(g, P_SPIN, 400, 3).catch(() => {}); c.go(g, g.pos.x + (i % 2 ? 40 : -20), 110, 900, 'ease-in').catch(() => {}); });
    await c.wait(900);
    await Promise.all([c.line(c.hero, 'th.swamp.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'song', ep:9, bg:'bird', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 40, 5); }, run: async (c) => {
    const b = c.boss(76, 5, 20);
    const ns = [0, 1, 2].map(i => c.prop(TH_ART.note, 7, 70 + i * 7, 26 + (i % 2) * 6, 4));
    await Promise.all([c.line(null, 'th.song.1'), ...ns.map(n => c.pose(n, P_WIG, 500, 3))]);
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.song.2'), c.pose(b, P_HOP, 400, 3)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.song.3'), c.pose(c.hero, P_SHAKE, 300, 3)]);
    c.face(c.hero, null);
    await Promise.all([c.line(c.pet, 'th.song.4'), c.pose(c.pet, P_HOP, 380, 3)]);
    c.snd('music');
    for (let i = 0; i < 4; i++) c.floatProp(TH_ART.note, 7, 16 + i * 10, 34 + (i % 2) * 8);
    await Promise.all([c.line(c.hero, 'th.song.5'), c.pose(c.hero, P_WIG, 400, 4), c.pose(c.pet, P_HOP, 400, 4)]);
    c.snd('music');
    await Promise.all([c.line(b, 'th.song.6'), c.pose(b, P_WIG, 360, 5), ...ns.map((n, i) => c.go(n, 30 + i * 18, 110, 1800, 'ease-out'))]);
    ns.forEach(n => n.remove());
    for (let i = 0; i < 5; i++) c.floatProp(TH_ART.note, 7, 14 + i * 18, 40);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.song.7'), c.pose(c.hero, P_SPIN, 800), c.pose(c.pet, P_SPIN, 800), c.pose(b, P_SPIN, 800)]);
  } },
  { id:'moon', ep:6, bg:'castle', night:true, setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const mn = c.prop(TH_ART2.moon, 26, 74, 58, 2);
    const sp = [[66, 70], [80, 64], [74, 76]].map(([x, y], i) => c.prop(germSVG(i), 8, x, y, 3));
    await Promise.all([c.line(null, 'th.moon.1'), ...sp.map(g => c.pose(g, P_WIG, 500, 3))]);
    const rk = c.prop(TH_ART.rocket(), 22, 44, 5, 2, 1.25);
    c.snd('boing'); await c.pose(rk, P_GROW, 600);
    c.face(c.hero, 'surprised');
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.moon.2'), c.go(c.hero, 44, 22, 600, 'ease-out')]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, null);
    c.say(c.pet, 'th.moon.3');
    for (let i = 0; i < 3; i++){ c.snd('beep'); await c.pose(rk, P_SHAKE, 200, 2); }
    c.face(c.hero, 'determined'); c.snd('whoosh'); c.brush(c.hero, true);
    await Promise.all([c.go(rk, 52, 46, 1300, 'ease-in-out'), c.go(c.hero, 52, 63, 1300, 'ease-in-out'), c.pose(c.pet, P_HOP, 400, 3)]);
    c.snd('swish'); await c.pose(c.hero, P_SHAKE, 260, 4);
    sp.forEach((g, i) => { c.snd('pop'); c.burst(g, 5); c.pose(g, P_SPIN, 400, 3).catch(() => {}); c.go(g, g.pos.x + 30, 110, 900, 'ease-in').catch(() => {}); });
    c.brush(c.hero, false); c.face(c.hero, 'happy'); c.snd('magic'); c.burst(mn, 12);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.moon.4'), c.morph(mn, 'scale(1.18)', 800)]);
    await Promise.all([c.go(rk, 44, 5, 1200, 'ease-out'), c.go(c.hero, 44, 22, 1200, 'ease-out')]);
    c.snd('thud'); await c.go(c.hero, 30, 5, 500);
    await Promise.all([c.line(c.hero, 'th.moon.5'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  /* ---------- v0.39.1 이야기 11~20 (양치 습관 한 가지씩: 이 사이 · 간식 · 거품 · 치과 · 자기 전 · 어금니 안쪽 · 마무리는 어른과 · 같은 순서 · 먹고 나서 · 거울 확인) ---------- */
  { id:'gap', ep:13, bg:'bath', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const t1 = c.prop(TH_ART3.tooth, 16, 60, 5, 2, 1.25), t2 = c.prop(TH_ART3.tooth, 16, 77, 5, 2, 1.25);
    const g = c.prop(germSVG(2), 9, 68.5, 12, 1);
    c.snd('boing');
    await Promise.all([c.line(null, 'th.gap.1'), c.pose(t1, P_GROW, 700), c.pose(t2, P_GROW, 700)]);
    await c.cam(g.pos.x, g.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(g, 'th.gap.2'), c.pose(g, P_WIG, 380, 4)]);
    await c.cam(50, 50, 1, 500);
    await Promise.all([c.go(c.hero, 44, 5, 800), c.pose(c.hero, P_WALK, 330, 3)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.snd('swish');
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.gap.3'), c.pose(c.hero, P_SHAKE, 280, 4)]);
    c.face(c.hero, null);
    await Promise.all([c.line(c.pet, 'th.gap.4'), c.pose(c.pet, P_HOP, 380, 3)]);
    c.say(c.hero, 'th.gap.5'); c.snd('swish');
    await Promise.all([c.morph(c.hero, 'rotate(-14deg)', 400), c.pose(t1, P_WIG, 300, 3), c.pose(t2, P_WIG, 300, 3)]);
    c.snd('pop'); c.burst(g, 8); c.say(g, 'th.gap.6');
    c.pose(g, P_SPIN, 400, 3).catch(() => {}); await c.go(g, 100, 80, 900, 'ease-in');
    c.brush(c.hero, false); c.face(c.hero, 'happy'); await c.morph(c.hero, 'none', 300);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.gap.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'apple', ep:32, bg:'safari', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 46, 5); }, run: async (c) => {
    await Promise.all([c.line(c.pet, 'th.apple.1'), c.pose(c.pet, P_YAWN, 700, 2)]);
    const b = c.boss(118, 5), cd = c.prop(TH_ART2.candy, 12, 118, 26, 3, .53);
    await Promise.all([c.go(b, 76, 5, 1200), c.go(cd, 70, 24, 1200), c.pose(b, P_WALK, 330, 4)]);
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.apple.2'), c.pose(cd, P_TINY, 400, 4)]);
    await c.cam(50, 50, 1, 500);
    const ap = c.prop(TH_ART3.apple, 11, 24, 30, 4);
    c.snd('magic'); await c.pose(ap, P_GROW, 600);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.apple.3'), c.go(ap, 46, 22, 900)]);
    c.face(c.hero, null);
    ap.remove(); c.snd('pop'); c.burst(c.pet, 6);
    await Promise.all([c.line(c.pet, 'th.apple.4'), c.pose(c.pet, P_HOP, 360, 3)]);
    await Promise.all([c.line(b, 'th.apple.5'), c.morph(b, 'scale(.6)', 900), c.go(cd, 118, 40, 900)]);
    c.pose(b, P_SPIN, 400, 2).catch(() => {}); await c.go(b, 120, 5, 900, 'ease-in');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.apple.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'cloud', ep:63, bg:'bird', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    const sun = c.prop(TH_ART3.sun, 14, 74, 66, 1), cl = c.prop(TH_ART3.cloudGray, 34, 70, 60, 3, .6);
    await Promise.all([c.line(null, 'th.cloud.1'), c.go(cl, 72, 60, 1200)]);
    await c.cam(cl.pos.x, cl.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(cl, 'th.cloud.2'), c.pose(cl, P_WIG, 420, 3)]);
    await c.cam(50, 50, 1, 500);
    for (let i = 0; i < 4; i++) c.floatProp(TH_ART.tear, 4, 60 + i * 6, 40);
    await Promise.all([c.line(c.pet, 'th.cloud.3'), c.pose(c.pet, P_SHAKE, 300, 3)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.cloud.4'), c.go(c.hero, 54, 22, 900, 'ease-out')]);
    const bub = c.prop(TH_ART.bubble, 44, 72, 50, 5); c.snd('blow');
    await Promise.all([c.line(null, 'th.cloud.5'), c.pose(bub, P_GROW, 900), c.pose(c.hero, P_SHAKE, 260, 4)]);
    c.snd('pop'); bub.remove(); cl.firstChild.innerHTML = TH_ART3.cloudWhite; c.burst(cl, 10);
    const rb = c.prop(TH_ART3.rainbow, 60, 50, 30, 0, .5); c.snd('fanfare');
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.cloud.6'), c.pose(rb, P_GROW, 900), c.go(c.hero, 34, 5, 700)]);
    await Promise.all([c.line(c.hero, 'th.cloud.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2), c.pose(sun, P_SPIN, 1200)]);
  } },
  { id:'dentist', ep:20, bg:'room', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 66, 5); }, run: async (c) => {
    c.floatProp(TH_ART.tear, 4, 70, 30);
    await Promise.all([c.line(c.pet, 'th.dentist.1'), c.pose(c.pet, P_SHAKE, 260, 5)]);
    await Promise.all([c.line(c.hero, 'th.dentist.2'), c.pose(c.hero, P_HOP, 380, 2)]);
    const mr = c.prop(TH_ART3.mirror, 10, 40, 22, 5, 1.6);
    await Promise.all([c.go(c.hero, 48, 5, 700), c.go(mr, 58, 22, 700)]);
    for (let i = 0; i < 3; i++){ c.snd('ding', i); await c.pose(mr, P_TINY, 300); }
    c.say(c.hero, 'th.dentist.3'); await c.wait(1600);
    const g = c.prop(germSVG(1), 9, 68, 18, 6); c.snd('boing');
    await c.cam(g.pos.x, g.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(g, 'th.dentist.4'), c.pose(g, P_WIG, 330, 4)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.snd('swish');
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.dentist.5'), c.pose(c.hero, P_SHAKE, 260, 4)]);
    c.face(c.hero, null);
    c.snd('pop'); c.burst(g, 8); mr.remove(); c.pose(g, P_SPIN, 400, 3).catch(() => {}); c.go(g, 110, 90, 900, 'ease-in').catch(() => {});
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    await Promise.all([c.line(c.pet, 'th.dentist.6'), c.pose(c.pet, P_BIG, 800)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.dentist.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'night', ep:8.5, bg:'room', night:true, setup(c){ c.place(c.hero, 28, 5); c.place(c.pet, 72, 5); }, run: async (c) => {
    c.floatProp(TH_ART2.zzz, 6, 32, 34); c.floatProp(TH_ART2.zzz, 6, 76, 30);
    await Promise.all([c.line(null, 'th.night.1'), c.pose(c.hero, P_YAWN, 900, 2)]);
    const b = c.boss(50, 70, 16);
    c.snd('music'); await c.go(b, 50, 30, 900, 'ease-out');
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.night.2'), c.pose(b, P_HOP, 380, 4)]);
    await c.cam(50, 50, 1, 500);
    c.snd('boing');
    await Promise.all([c.line(c.pet, 'th.night.3'), c.pose(c.pet, P_BIG, 800)]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.night.4'), c.pose(c.hero, P_HOP, 380, 2)]);
    c.face(c.hero, null);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.snd('swish');
    await Promise.all([c.go(c.hero, 42, 5, 500), c.pose(c.hero, P_SHAKE, 260, 4)]);
    c.snd('pop'); c.burst(b, 8);
    await Promise.all([c.line(b, 'th.night.5'), c.morph(b, 'scale(.5)', 900)]);
    c.go(b, 50, 110, 900, 'ease-in').catch(() => {}); c.brush(c.hero, false); c.face(c.hero, 'happy');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.night.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'hide', ep:12, bg:'bug', setup(c){ c.place(c.hero, 18, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const bs = [44, 64, 84].map(x => c.prop(TH_ART.bush, 22, x, 3, 4, .5));
    const gs = [0, 1, 3].map((k, i) => c.prop(germSVG(k), 9, 40 + i * 20, 30, 3));
    await Promise.all([c.line(null, 'th.hide.1'), ...gs.map(g => c.pose(g, P_HOP, 360, 3))]);
    c.say(gs[2], 'th.hide.2');
    await Promise.all(gs.map((g, i) => c.go(g, 44 + i * 20, 8, 900)));
    c.face(c.hero, 'surprised');
    await c.cam(c.hero.pos.x, c.hero.pos.y + 20, 1.6, 600);
    await Promise.all([c.line(c.hero, 'th.hide.3'), c.pose(c.hero, P_LOOK, 1400)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, null);
    await Promise.all([c.go(c.pet, 72, 5, 1000), c.pose(c.pet, P_WALK, 330, 3)]);
    await Promise.all([c.line(c.pet, 'th.hide.4'), c.pose(c.pet, P_TINY, 300, 4)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true);
    for (let i = 0; i < 3; i++){
      await c.go(c.hero, 38 + i * 20, 5, 450); c.snd('swish');
      if (i === 0) c.say(c.hero, 'th.hide.5');
      await c.pose(bs[i], P_SHAKE, 220, 3);
      c.snd('pop'); c.burst(gs[i], 6); c.go(gs[i], gs[i].pos.x + 20, 100, 900, 'ease-in').catch(() => {});
    }
    c.brush(c.hero, false); c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.hide.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
    c.face(c.hero, 'happy');
    await c.line(null, 'th.hide.7');
  } },
  { id:'croc', ep:19, bg:'swamp', setup(c){ c.place(c.hero, 16, 5); c.place(c.pet, 4, 5); }, run: async (c) => {
    const cr = c.prop(petArt({ sp:'crocodile', st:2, wear:{} }), 34, 66, 3, 2);
    c.snd('boing');
    await Promise.all([c.line(null, 'th.croc.1'), c.pose(cr, P_SQ, 600, 2)]);
    await c.cam(cr.pos.x, cr.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(cr, 'th.croc.2'), c.pose(cr, P_WIG, 450, 3)]);
    await c.cam(50, 50, 1, 500);
    const bd = c.prop(petArt({ sp:'sparrow', st:2, wear:{} }), 12, 110, 60, 4);
    await c.go(bd, 66, 34, 1000, 'ease-out');
    await Promise.all([c.line(bd, 'th.croc.3'), c.pose(bd, P_TINY, 200, 6)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true);
    await Promise.all([c.go(c.hero, 44, 5, 800), c.pose(c.hero, P_WALK, 330, 3)]);
    c.say(c.hero, 'th.croc.4'); c.snd('swish');
    await Promise.all([c.pose(c.hero, P_SHAKE, 260, 4), c.pose(bd, P_TINY, 200, 6)]);
    c.snd('magic'); c.burst(cr, 10); c.brush(c.hero, false); c.face(c.hero, 'happy');
    await Promise.all([c.line(cr, 'th.croc.5'), c.pose(cr, P_HOP, 420, 2), c.go(bd, 70, 56, 600)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.croc.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'shark', ep:11, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const sh = c.prop(petArt({ sp:'shark', st:2, wear:{} }), 30, 68, 24, 2);
    c.floatProp(TH_ART.tear, 4, 60, 40);
    await Promise.all([c.line(null, 'th.shark.1'), c.pose(sh, P_WIG, 450, 3)]);
    await c.cam(sh.pos.x, sh.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(sh, 'th.shark.2'), c.pose(sh, P_SHAKE, 300, 3)]);
    await c.cam(50, 50, 1, 500);
    await Promise.all([c.line(c.hero, 'th.shark.3'), c.go(c.hero, 42, 5, 700), c.pose(c.hero, P_WALK, 330, 2)]);
    for (let i = 0; i < 3; i++){ c.snd('ding', i); await c.pose(c.pet, P_TINY, 280); }
    await Promise.all([c.line(c.pet, 'th.shark.4'), c.pose(c.pet, P_HOP, 360, 2)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.say(null, 'th.shark.5');
    for (const [x, y] of [[48, 30], [56, 30], [56, 18], [48, 18]]){ c.snd('swish'); await Promise.all([c.go(c.hero, x, y - 18 > 5 ? y - 18 : 5, 420), c.pose(c.hero, P_SHAKE, 200, 2)]); }
    c.snd('magic'); c.burst(sh, 10); c.brush(c.hero, false); c.face(c.hero, 'happy');
    await Promise.all([c.line(sh, 'th.shark.6'), c.pose(sh, P_HOP, 420, 2), c.go(c.hero, 40, 5, 500)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.shark.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'party', ep:7, season:'birthday', bg:'room', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 60, 5); }, run: async (c) => {
    const ck = c.prop(TH_ART3.cake, 16, 44, 5, 4, .9);
    c.snd('music');
    await Promise.all([c.line(null, 'th.party.1'), c.pose(ck, P_GROW, 700)]);
    c.snd('blow');
    await Promise.all([c.line(c.pet, 'th.party.2'), c.pose(c.pet, P_TINY, 300, 3)]);
    ck.firstChild.innerHTML = TH_ART3.cakeOut;
    const b = c.boss(118, 5, 16), gs = [0, 2].map((k, i) => c.prop(germSVG(k), 9, 120 + i * 8, 30 + i * 10, 3));
    await Promise.all([c.go(b, 80, 5, 1000), ...gs.map((g, i) => c.go(g, 74 + i * 12, 28 + i * 6, 1000)), c.pose(b, P_WALK, 330, 3)]);
    await c.cam(b.pos.x, b.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(b, 'th.party.3'), ...gs.map(g => c.pose(g, P_HOP, 340, 3))]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.party.4'), c.pose(c.hero, P_HOP, 380, 2)]);
    c.face(c.hero, null);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.brush(c.pet, true); c.snd('music');
    for (let i = 0; i < 4; i++) c.floatProp(TH_ART.note, 5, 20 + i * 14, 30);
    await Promise.all([c.line(null, 'th.party.5'), c.pose(c.hero, P_WIG, 360, 4), c.pose(c.pet, P_WIG, 360, 4)]);
    await Promise.all([c.line(b, 'th.party.6'), c.pose(b, P_SPIN, 500, 2)]);
    c.snd('pop'); c.burst(b, 9); [b, ...gs].forEach(x => c.go(x, 120, 90, 900, 'ease-in').catch(() => {}));
    c.brush(c.hero, false); c.face(c.hero, 'happy'); await c.wait(300);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.party.7'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'mirror', ep:18.5, bg:'bath', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const mr = c.prop(TH_ART3.mirrorBig, 28, 66, 16, 1, 1.25);
    const me = c.prop(Character.art(Object.assign({}, effectiveLook())), 18, 66, 22, 2, 250 / 220); c.flip(me, true);
    await Promise.all([c.line(null, 'th.mirror.1'), c.go(c.hero, 44, 5, 800), c.pose(c.hero, P_WALK, 330, 3)]);
    await Promise.all([c.line(c.hero, 'th.mirror.2'), c.pose(me, P_TINY, 400, 2), c.pose(c.hero, P_TINY, 400, 2)]);
    const g = c.prop(germSVG(3), 6, 69, 40, 3); c.snd('boing');
    await c.cam(g.pos.x, g.pos.y + 10, 1.6, 600);
    await Promise.all([c.line(g, 'th.mirror.3'), c.pose(g, P_WIG, 330, 4)]);
    await c.cam(50, 50, 1, 500);
    await Promise.all([c.line(c.pet, 'th.mirror.4'), c.pose(c.pet, P_HOP, 360, 3)]);
    c.face(c.hero, 'determined'); c.brush(c.hero, true); c.say(c.hero, 'th.mirror.5'); c.snd('swish');
    await Promise.all([c.pose(c.hero, P_SHAKE, 260, 4), c.pose(me, P_SHAKE, 260, 4)]);
    c.snd('pop'); c.burst(g, 7); g.remove(); c.brush(c.hero, false); c.face(c.hero, 'happy'); c.snd('magic'); c.burst(mr, 10);
    await Promise.all([c.line(null, 'th.mirror.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(me, P_HOP, 420, 2)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.mirror.7'), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  /* v0.50.0 극장 2.0 시험판: 카메라 확대 · 이동, 말할 때 입, 표정, 장면 전환(동그라미), 화면 흔들기를 모두 씀 (약 30초) */
  { id:'dream', ep:45.5, bg:'room', night:true, v2:true, setup(c){ c.place(c.hero, 40, 5); c.place(c.pet, 16, 5); }, run: async (c) => {
    c.face(c.hero, 'sad');
    await Promise.all([c.line(null, 'th.dream.1'), c.pose(c.hero, P_YAWN, 900, 2)]);
    await c.cam(40, 24, 1.9, 1000);                                               // 반짝이 얼굴로 가까이
    await Promise.all([c.line(c.hero, 'th.dream.2'), c.pose(c.hero, P_SHAKE, 300, 2)]);
    const b = c.boss(112, 5, 18);
    await Promise.all([c.cam(80, 22, 1.8, 900), c.go(b, 84, 5, 900), c.pose(b, P_WALK, 300, 3)]);   // 카메라가 세균 쪽으로
    await Promise.all([c.line(b, 'th.dream.3'), c.pose(b, P_WIG, 330, 4)]);
    await c.cam(40, 24, 1.9, 450); c.face(c.hero, 'surprised'); c.snd('boing');   // 휙! 다시 반짝이
    await Promise.all([c.line(c.hero, 'th.dream.4'), c.pose(c.hero, P_BIG, 500)]);
    c.snd('whoosh');
    await Promise.all([c.cam(50, 50, 1, 700), c.go(b, 125, 30, 900, 'ease-in'), c.pose(b, P_SPIN, 450, 2)]);
    c.face(c.hero, 'angry');
    await Promise.all([c.line(null, 'th.dream.5'), c.pose(c.hero, P_HOP, 380, 2), c.pose(c.pet, P_HOP, 380, 2)]);
    c.snd('magic'); await c.iris(true, 650);                                      // 동그랗게 닫히며 꿈나라로
    c.scene('castle', true); c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); c.place(b, 74, 5);
    c.morph(b, 'scale(1.7)', 10).catch(() => {});
    await c.iris(false, 750);
    c.snd('thud');
    await Promise.all([c.line(b, 'th.dream.6'), c.quake(600), c.pose(b, P_SQ, 400, 2)]);
    await c.cam(22, 24, 1.7, 700);
    await Promise.all([c.line(c.hero, 'th.dream.7'), c.pose(c.pet, P_HOP, 350, 2)]);
    c.brush(c.hero, true); c.snd('swish');
    await Promise.all([c.cam(62, 34, 1.3, 1100), c.go(c.hero, 56, 5, 1100), c.go(c.pet, 40, 5, 1100), c.pose(c.hero, P_WALK, 280, 4)]);   // 카메라가 따라감
    c.snd('swish');
    await Promise.all([c.pose(c.hero, P_SHAKE, 240, 5), c.pose(b, P_SHAKE, 240, 5)]);
    c.snd('pop'); c.burst(b, 10); c.quake(400);
    await c.morph(b, 'scale(.4)', 600);
    c.pose(b, P_SPIN, 380, 3).catch(() => {});
    await Promise.all([c.go(b, 120, 85, 900, 'ease-in'), c.cam(50, 50, 1, 900)]);
    c.brush(c.hero, false); c.face(c.hero, 'happy'); c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.dream.8'), c.pose(c.hero, P_HOP, 400, 2), c.pose(c.pet, P_HOP, 400, 2)]);
    await c.iris(true, 600);                                                      // 다시 방으로
    c.scene('room', true); c.place(c.hero, 40, 5); c.place(c.pet, 16, 5); c.face(c.hero, 'sleep');
    await c.iris(false, 700);
    c.floatProp(TH_ART2.zzz, 7, 48, 32); c.floatProp(TH_ART2.zzz, 6, 20, 20);
    await c.line(null, 'th.dream.9');
    c.face(c.hero, 'happy');
  } }
];
/* v0.51.0 이야기 차례 · 명절 편 · 아침 짧은 극장
   · 이야기는 ep(번호) 순서로 (영상 바이블 100편 계획 번호. 예전 편도 그 자리에). 이야기 파일 16-th-s*.js 가 TH_EPS 에 넣음
   · season:'xmas' 처럼 명절 편: 평소 차례에서 빠지고, 그 명절 기간 첫 양치에 한 번 (해마다 다시). 기록 bj_theater.sw
   · 아침(오후 3시 전) 양치에는 짧은 극장(TH_GAGS, 10초 안팎). CONFIG.theaterAmGag:false 면 아침에도 이야기 */
const TH_ALL = () => THEATER.concat(window.TH_EPS || []);
const TH_REG = () => TH_ALL().filter(e => !e.season).sort((a, b) => (a.ep || 999) - (b.ep || 999));
/* v0.52.0 좋아요 · 고르기
   · 끝날 때 ♡ 단추 (#thLike). 누르면 그 아이의 bj_thLikes[id] +1 (아이마다 따로)
   · 저녁 이야기: 4번에 1번은 좋아요 한 이야기 다시 보기 (최근 5편 · 다음 차례 편은 빼고, 좋아요가 많을수록 잘 뽑힘). 다시 보기는 화 번호 · 차례를 안 넘김
   · 아침 한 컷: 최근 20개는 안 고름, 남은 것 중에서 좋아요 한 것일수록 잘 뽑힘 (한 번 누르면 3배, 최대 7배) */
const TH_FAV_EVERY = 4, TH_GAG_RECENT = 20;
const thPickW = (arr, w) => { const tot = arr.reduce((a, x) => a + w(x), 0); let r = Math.random() * tot; for (const x of arr){ r -= w(x); if (r <= 0) return x; } return arr[arr.length - 1]; };
function thPickStory(st, likes, REG = TH_REG()){
  const k = (st.k || 0) % REG.length;
  st.rc = (st.rc || 0) + 1;
  const favs = REG.filter(e => likes[e.id] && !(st.g || []).includes(e.id) && e !== REG[k]);
  if (st.rc % TH_FAV_EVERY === 0 && favs.length) return { ep:thPickW(favs, e => likes[e.id]), fav:true };
  st.k = k + 1;
  return { ep:REG[k], fav:false };
}
function thPickGag(st, likes, GAGS = window.TH_GAGS || []){
  const rec = st.gr || [];
  let pool = GAGS.filter(g => !rec.includes(g.id)); if (!pool.length) pool = GAGS;
  const g = thPickW(pool, x => 1 + 2 * Math.min(3, likes[x.id] || 0));
  st.gr = [g.id].concat(rec).slice(0, Math.min(TH_GAG_RECENT, Math.max(0, GAGS.length - 1)));
  return g;
}
function playTheater(onDone, forceId, forceBg){                         // force…: 개발자 미리 보기용
  const st = store.get('theater', { n:0, g:[], b:[] }), likes = store.get('thLikes', {});
  const REG = TH_REG(), GAGS = window.TH_GAGS || [];
  let gag = forceId ? (TH_ALL().concat(GAGS).find(x => x.id === forceId) || null) : null, quick = !!(gag && GAGS.includes(gag)), fav = false;
  if (!gag){
    const ev = activeEvent(), evk = ev ? spEvKey() : '';
    const se = ev && TH_ALL().find(e => e.season && (e.season === ev.id || e.season === ev.text) && !(st.sw || []).includes(e.id + '@' + evk));
    if (se){ gag = se; st.sw = (st.sw || []).concat(se.id + '@' + evk).slice(-30); }
    else if (slotOf() === 'am' && CONFIG.theaterAmGag !== false && GAGS.length){ gag = thPickGag(st, likes, GAGS); quick = true; }
    else { const r = thPickStory(st, likes, REG); gag = r.ep; fav = r.fav; }
  }
  const bg = (THEATER_BGS.includes(forceBg) || TH_BG_EXTRA[forceBg]) ? forceBg : (gag.bg || pickFresh(THEATER_BGS, st.b || []));
  if (!quick && !fav) st.n = (st.n || 0) + 1;
  st.g = [gag.id].concat(st.g || []).slice(0, 5); st.b = [bg].concat(st.b || []).slice(0, 3);
  store.set('theater', st);
  const nextGag = quick || gag.season ? null : REG[(st.k || 0) % REG.length];
  const tok = ++thTok, kind = quick ? 'thg' : 'th';
  let finished = false, natural = false;
  Stats.add(kind, gag.id, 'view');                                       // v0.52.0 익명 숫자 (부모님이 켠 경우만)
  const end = () => {
    if (finished) return; finished = true;
    Stats.add(kind, gag.id, natural ? 'done' : 'skip');
    thLikeHide(); setTimeout(() => Stats.flush(), 3000);
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
  const title = t((quick ? 'thg.' : 'th.') + gag.id + '.t');
  const epLabel = quick ? t('th.gagName') : fav ? t('th.fav') : t('th.ep', { n:st.n });
  $('#thHead').innerHTML = `🎬 ${esc(t('th.name'))}<small>${esc(epLabel)} · ${esc(title)}</small>`;
  stage.innerHTML = '<div class="th-world">' + thBgSvg(bg) + (slotOf() === 'pm' || gag.night ? '<div class="th-night"></div>' : '') + '</div>' +   // v0.50.0 카메라 층
    '<div class="th-cur l"></div><div class="th-cur r"></div>' +
    `<div class="th-title"><b>${esc(t('th.name'))}</b><span>${esc(epLabel)} · ${esc(title)}</span></div>`;
  const c = thCtx(stage, tok);
  c.hero = c.prop(Character.art(look), 32, 50, 5, 3, 250 / 220);
  c.pet = c.prop(pal ? petArt(pal) : eggArt(), 20, 78, 5, 3);
  c.P = { pet: pal ? petName(pal) : t('th.eggName'), boss: t('boss.' + curBoss.id) };
  c.nextTitle = nextGag ? t('th.' + nextGag.id + '.t') : null; c.quick = quick; c.fav = fav;
  if (gag.setup) gag.setup(c);
  show('theater');
  (async () => {
    try{
      await c.opening(st.n, title);
      await gag.run(c);
      thLikeShow(gag.id, kind, c);
      await c.ending();
      natural = true;
    }catch(e){ if (e !== TH_STOP) console.error(e); }
    if (tok === thTok) end();
  })();
}
/* v0.52.0 ♡ 좋아요 단추: 이야기 끝날 때 나타남. 한 번 볼 때 한 번 */
function thLikeShow(id, kind, c){
  const b = $('#thLike'); b.hidden = false; b.classList.remove('on'); b.textContent = '♡'; b.setAttribute('aria-label', t('th.like'));
  b.onclick = () => {
    if (b.classList.contains('on')) return;
    const L = store.get('thLikes', {}); L[id] = (L[id] || 0) + 1; store.set('thLikes', L);
    b.classList.add('on'); b.textContent = '♥'; TH_SND.magic();
    Stats.add(kind, id, 'like');
    try{ [0, 1, 2].forEach(i => c.floatProp(TH_P.heart, 6, 14 + i * 7, 8)); }catch(e){}
  };
}
function thLikeHide(){ const b = $('#thLike'); b.hidden = true; b.onclick = null; }
$('#thSkip').addEventListener('click', () => { sfx.tap(); if (thEnd) thEnd(); });
$('#theaterTest').addEventListener('click', () => { sfx.tap(); playTheater(() => { refreshHome(); show('home'); }); });
if (TEST_MODE) window.__bjTheater = (id, bg) => playTheater(() => { refreshHome(); show('home'); }, id, bg);   // 자동 테스트용
