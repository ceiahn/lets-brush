'use strict';

/* =========================================================
   14-2. 알 키우기 · 펫
     · 양치를 끝까지 하면 한 칸. 알은 PET_CFG.hatch번에 부화
     · 펫은 grow[0]번 → 쑥, grow[1]번 → 다 큼 → 친구 목록으로, 새 알
     · 하루 perDay번까지만 자람 (그 뒤엔 쿨쿨 → 내일을 기다리게)
     · 펫 추가: resources.js 의 pets: { id:{ svg 또는 img, egg:[바탕색, 무늬색], top:머리 위 y, names:{ko,en}, def:{ko,en} } }
     의도: "내일 또 닦고 싶게"의 핵심. 하루 perDay 번까지만 자라서 몰아서 끝낼 수 없고, 다음 날을 기다리게 함
     규칙 (사용자 요청으로 정한 것)
       · 펫은 모두 모아짐 (새로 태어나도 덮어쓰지 않음). 이미 있는 동물은 알 · 선물로 다시 안 나옴
       · 데리고 다니는 펫(pal)은 아이가 직접 고름 (처음 한 마리만 자동). 자라는 펫 = pal 이 덜 컸으면 pal, 아니면 먼저 태어난 덜 큰 펫
       · 특별한 알(약 15%, 무지개 성) → 전설 펫만. 하루 두 번 닦은 날엔 펫 선물(아기)
       · 다 크면(st 3) "변신!" 연출 + 영웅 모습(adultFX: 무리별 망토 · 깃털 · 물방울 · 반짝이)
       · 이달의 친구: 달마다 정해진 동물이 그달 첫 새 알 (ensureFeat). 팀: TEAMS (아래 [팀])
       · 간식(⭐1, 펫마다 하루 1번) → 하트 5개 → 재주. 하트는 줄지 않음 (죄책감 장치 금지)
   ========================================================= */
const PET_CFG = Object.assign({ hatch:4, grow:[5, 7], perDay:2, specialEggChance:.15 }, (RES.config || {}).pet || {});

const PETS = PetGen.build();
if (RES.pets) Object.entries(RES.pets).forEach(([id, v]) => {     // resources.js 로 펫 추가 (svg 문자열, 위치 값)
  const prev = PETS[id];                                          // 기존 동물 그림만 바꿀 때는 이름 · 무리 · 알 색을 그대로 둠
  PETS[id] = Object.assign({ egg:['#fff8e6', '#ffcf5a'], top:-26, eye:-6, ex:9, ecx:0, neck:15, group:v.special ? 'legend' : 'land' },
    prev ? { egg:prev.egg, group:prev.group, special:prev.special } : {}, v, { names:Object.assign({}, prev ? prev.names : {}, v.names || {}) });
  Object.entries(v.def || {}).forEach(([c, x]) => { if (packs[c]) packs[c].strings['pet.' + id + '.def'] = x; });
});
// 이름: 동물 이름 + 기본 별명 (고양이 → 고고, 사자 → 사사)
const defName = (c, nm) => { const w = String(nm).split(' ').pop(); return c === 'en' ? w : w.slice(0, 1) + w.slice(0, 1); };
function injectPetNames(){                                     // 언어팩을 새로 받았을 때도 다시 넣음
  Object.entries(PETS).forEach(([id, P]) => Object.entries(P.names || {}).forEach(([c, nm]) => {
    const pk = packs[c]; if (!pk || !nm) return;
    pk.strings['pet.' + id] = nm;
    if (pk.strings['pet.' + id + '.def'] === undefined) pk.strings['pet.' + id + '.def'] = defName(c, nm);
  }));
}
injectPetNames();
const regularIds = Object.keys(PETS).filter(id => !PETS[id].special), legendIds = Object.keys(PETS).filter(id => PETS[id].special);
// v0.32.0 구독 전 기본 펫: 아이들이 가장 잘 아는 동물 (앞에서부터 CONFIG.subs.freePets 마리). 구독 · 체험 중엔 전부
const FREE_PET_ORDER = 'cat shiba rabbit panda lion tiger elephant giraffe penguin dolphin retriever maltese corgi jindo hamster koala fox brownbear polarbear monkey chick duck owl turtle frog trex triceratops butterfly ladybug clownfish pig sheep horse whale'.split(' ').filter(id => PETS[id] && !PETS[id].special);
const regPool = () => pro() ? regularIds : FREE_PET_ORDER.slice(0, subCfg().freePets);
const legPool = () => pro() ? legendIds : [];
const freeWait = () => !pro() && !(petState && petState.egg) && freePool(regularIds).length > 0;   // v0.33.0 기본 펫을 다 모음 (전부는 아님) → "다 모았어요" 대신 기다림 + 별
// v0.29.0 인기 순서: 아이들이 잘 아는 동물(A)부터 새 알 · 선물로 옴 → A를 다 모으면 보통(B) → 마지막에 낯선 동물(C)
//   의도: 첫 펫으로 스컹크가 나와 아이가 실망한 일이 있었음. 순서는 같은 등급 안에서만 무작위
//   새 동물을 더하면 따로 안 적어도 B. 아는 동물이면 PET_TIER_A, 낯설거나 호불호가 큰 동물이면 PET_TIER_C 에 이름 더하기
//   CONFIG.popularFirst:false 면 예전처럼 전부 무작위
const PET_TIER_A = new Set('lion tiger whitetiger cheetah cat blackcat persian calico scottishfold shiba corgi retriever dalmatian poodle husky beagle maltese jindo samoyed pug dachshund fox fennec raccoon redpanda panda brownbear polarbear koala kangaroo quokka sloth rabbit loprabbit hamster guineapig chipmunk hedgehog otter seaotter capybara meerkat elephant giraffe zebra horse pony cow sheep alpaca deer reindeer hippo rhino pig monkey gorilla chick chicken duck owl macaw budgie flamingo swan peacock penguin emperorpenguin whale dolphin orca beluga seal harpseal clownfish goldfish pufferfish shark octopus jellyfish starfish crab seahorse turtle seaturtle frog crocodile chameleon trex triceratops stegosaurus brachiosaurus pteranodon ladybug bee butterfly beetle stagbeetle snail dragonfly'.split(' '));
const PET_TIER_C = new Set('skunk mole bat hyena opossum tasdevil jerboa pangolin anteater armadillo porcupine weasel badger coyote boar tapir mandrill okapi ibex bighorn yak bison buffalo moose crow pigeon seagull turkey quail stork heron dodo emu hornbill anglerfish tuna salmon urchin clam toad dartfrog salamander snake cobra komodo frilledlizard gecko iguana ant spider earthworm cicada mantis grasshopper caterpillar shrimp lobster hammerhead swordfish walrus manatee blackswan'.split(' '));
const petTier = (id) => PET_TIER_A.has(id) ? 0 : PET_TIER_C.has(id) ? 2 : 1;
function bestTier(pool){                                   // 남은 동물 중 가장 앞 등급만
  if (CONFIG.popularFirst === false || !pool.length) return pool;
  const m = Math.min(...pool.map(petTier));
  return pool.filter(id => petTier(id) === m);
}
// 펫 꾸미기 아이템: 펫마다 자리(top·eye·ex·neck)에 맞춰 그림. 한 번 사면 모든 펫에게
const HEART = '<path d="M0 3 C-5 -2 -2 -6 0 -3 C2 -6 5 -2 0 3Z" fill="#ff5d8f"/>';
const PET_ITEMS = {
  head_bow:    { slot:'head', cost:2, draw:(P) => `<g transform="translate(13 ${P.top + 7})"><path d="M0 0 L-10 -7 L-10 7Z M0 0 L10 -7 L10 7Z" fill="#ff7aa8" stroke="#e05d8f" stroke-width="1.5" stroke-linejoin="round"/><circle r="3.2" fill="#ff5d8f"/></g>` },
  head_flower: { slot:'head', cost:2, draw:(P) => `<g transform="translate(-13 ${P.top + 8})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 5).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 5).toFixed(1)}" r="4" fill="#fff3a0" stroke="#ffcf5a" stroke-width="1"/>`).join('')}<circle r="3" fill="#ff9a3d"/></g>` },
  head_party:  { slot:'head', cost:3, draw:(P) => `<g transform="translate(5 ${P.top + 5}) rotate(14)"><path d="M-9 0 L0 -24 L9 0Z" fill="#7fc8f2"/><path d="M-5 -9 H5 M-7 -3 H7" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cy="-25" r="3.5" fill="#ffd54a"/></g>` },
  head_crown:  { slot:'head', cost:4, draw:(P) => `<g transform="translate(0 ${P.top + 4})"><path d="M-11 0 L-12 -13 L-5.5 -6.5 L0 -15 L5.5 -6.5 L12 -13 L11 0Z" fill="#ffd54a" stroke="#e0a100" stroke-width="1.6" stroke-linejoin="round"/><circle cy="-3" r="2" fill="#ff7aa8"/></g>` },
  neck_bowtie: { slot:'neck', cost:2, draw:(P) => `<g transform="translate(0 ${P.neck})"><path d="M0 0 L-9 -6 L-9 6Z M0 0 L9 -6 L9 6Z" fill="#3a6fe0" stroke="#2a54b8" stroke-width="1.2" stroke-linejoin="round"/><circle r="2.6" fill="#2a54b8"/></g>` },
  neck_scarf:  { slot:'neck', cost:3, draw:(P) => `<g transform="translate(0 ${P.neck})"><path d="M-18 -3 Q0 5 18 -3 L18 3 Q0 11 -18 3Z" fill="#ff6b6b"/><path d="M8 4 L14 17 L5 15Z" fill="#e04848"/><path d="M-12 1 H-8 M-2 3 H2 M8 1 H12" stroke="#fff" stroke-width="1.5" opacity=".7"/></g>` },
  neck_bell:   { slot:'neck', cost:3, draw:(P) => `<g transform="translate(0 ${P.neck - 2})"><path d="M-16 -2 Q0 5 16 -2" stroke="#ff7aa8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cy="6" r="4.6" fill="#ffd54a" stroke="#e0a100" stroke-width="1.2"/><path d="M-2 7 H2" stroke="#a87a00" stroke-width="1.2"/></g>` },
  face_heart:  { slot:'face', cost:2, draw:(P) => { const x = P.ex + 7, c = P.ecx || 0; return `<g transform="translate(${c} ${P.eye + 9})"><g transform="translate(${-x} 0)">${HEART}</g><g transform="translate(${x} 0)">${HEART}</g></g>`; } },
  face_glasses:{ slot:'face', cost:3, draw:(P) => { const x = P.ex, c = P.ecx || 0; return `<g transform="translate(${c} ${P.eye})" fill="none" stroke="#24324a" stroke-width="2"><circle cx="${-x}" r="6.5"/><circle cx="${x}" r="6.5"/><path d="M${-x + 6.5} 0 H${x - 6.5}"/></g>`; } },
  face_sun:    { slot:'face', cost:4, draw:(P) => { const x = P.ex, c = P.ecx || 0; return `<g transform="translate(${c} ${P.eye})"><rect x="${-x - 7}" y="-5" width="14" height="10" rx="4" fill="#24324a"/><rect x="${x - 7}" y="-5" width="14" height="10" rx="4" fill="#24324a"/><path d="M${-x + 7} -1 H${x - 7}" stroke="#24324a" stroke-width="2"/><path d="M${-x - 4} -2 l3 -1.5 M${x - 4} -2 l3 -1.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>`; } }
};
let petOwned = store.get('petOwned', []);
const SHELL = 'M-16 3 L-11 -2 L-6 4 L-1 -2 L4 4 L9 -2 L14 3 L16 -4 Q14 -18 0 -19 Q-14 -18 -16 -4Z';
const SPARKS = '<g fill="#fff" stroke="#ffd54a" stroke-width=".8"><path d="M-37 -30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path d="M36 6 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z"/><path d="M-32 22 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4z"/></g>';
let gradSeq = 0;
const FEAT_STAR = '<path transform="translate(24 -30)" d="M0 -11 L3.2 -3.4 L11 -3.2 L5 2 L7 10 L0 5.4 L-7 10 L-5 2 L-11 -3.2 L-3.2 -3.4Z" fill="#ffd54a" stroke="#e0a100" stroke-width="1.8" stroke-linejoin="round"/>';
const isRare = (p) => !!(PETS[p.sp] || {}).special;            // 전설 펫
const petTitle = (p) => t('pet.' + p.sp);
// 다 큰 펫(어른)의 영웅 모습: 무리마다 다르게 (땅 동물·파충류·전설 = 망토, 새 = 금빛 깃털, 바다 = 물방울 고리, 곤충 = 반짝이)
function adultFX(P){
  const g = P.group || 'land', nk = P.neck === undefined ? 15 : P.neck;
  const aura = (c) => `<circle cy="6" r="45" fill="${c}" opacity=".14"/><circle cy="9" r="35" fill="${c}" opacity=".16"/>`;
  const cape = (c, d) => `<path d="M-13 ${nk - 3} Q0 ${nk + 3} 13 ${nk - 3} L31 43 Q16 38 0 43 Q-16 38 -31 43Z" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M-31 43 Q-16 38 0 43 Q16 38 31 43" stroke="#ffd54a" stroke-width="2.2" fill="none"/>`;
  const glint = (x, y, r) => `<path d="M${x} ${y - r} l${r * .3} ${r * .7} ${r * .7} ${r * .3} ${-r * .7} ${r * .3} ${-r * .3} ${r * .7} ${-r * .3} ${-r * .7} ${-r * .7} ${-r * .3} ${r * .7} ${-r * .3}z" fill="#fff" stroke="#ffd54a" stroke-width="1"/>`;
  if (g === 'bird'){
    const tp = (P.top === undefined ? -26 : P.top) + 3;
    const fe = (a) => `<path transform="translate(0 ${tp}) rotate(${a})" d="M0 0 Q-5 -12 0 -22 Q5 -12 0 0Z" fill="#ffd54a" stroke="#e0a100" stroke-width="1.3"/>`;
    return { back: aura('#ffd54a') + fe(-28) + fe(28) + fe(0), front:'' };
  }
  if (g === 'sea'){
    let b = '';
    [[-40, -18, 4.5], [-44, 8, 3], [-34, 30, 5], [40, -22, 3.5], [45, 2, 5], [36, 28, 3], [-20, -42, 3], [22, -42, 4]].forEach(([x, y, r]) =>
      { b += `<circle cx="${x}" cy="${y}" r="${r}" fill="#e6f7ff99" stroke="#8fd3ff" stroke-width="1.6"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .28}" fill="#fff"/>`; });
    return { back: aura('#8fd3ff') + b, front:'' };
  }
  if (g === 'bug') return { back: aura('#b6f07a'), front: glint(-36, -18, 6) + glint(38, -4, 5) + glint(-30, 28, 4) + glint(30, 32, 5) };
  const [c, d] = g === 'legend' ? ['#ffd54a', '#e0a100'] : g === 'reptile' ? ['#b48cff', '#8b5cf6'] : ['#ff6b8a', '#e04868'];
  return { back: aura(c) + cape(c, d), front:'' };
}
// 보이는 모습 (v0.25): 자란 단계(st)와 따로, 아이가 고른 모습(look). 자란 단계까지만 고를 수 있음
// 의도: "아기 때가 귀여워서 아기 모습으로 데리고 다니고 싶다" (아이 의견) → 성장 보상은 그대로, 모습만 고르기
const shownSt = (p) => (p.look >= 1 && p.look < p.st) ? p.look : p.st;
function petArt(p){
  const P = PETS[p.sp] || PETS.penguin, st = shownSt(p), sc = [1, .72, .86, 1][st] || 1;
  const body = typeof P.svg === 'function' ? P.svg(P.c || {}) : (P.svg || (P.img ? `<image href="${P.img}" x="-50" y="-50" width="100" height="100"/>` : ''));
  const w = p.wear || {};
  const wear = ['neck', 'face', 'head'].map(sl => w[sl] && PET_ITEMS[w[sl]] ? PET_ITEMS[w[sl]].draw(P) : '').join('');
  const fx = st >= 3 ? adultFX(P) : { back:'', front:'' };
  const extra = (st === 1 && !w.head ? `<path transform="translate(0 ${P.top + 7})" d="${SHELL}" fill="#fffaf0" stroke="#e3d5b5" stroke-width="2" stroke-linejoin="round"/>` : '') + wear + fx.front +
    (P.special ? SPARKS : '') +
    (p.st >= 3 ? '<path transform="translate(30 -32)" d="M0 -9 L2.6 -2.8 L9 -2.6 L4 1.6 L5.6 8 L0 4.4 L-5.6 8 L-4 1.6 L-9 -2.6 L-2.6 -2.8Z" fill="#ffd54a" stroke="#e0a100" stroke-width="1.5" stroke-linejoin="round"/>' : '');
  return `<svg class="${P.special ? 'rare' : ''}" viewBox="-50 -50 100 100" aria-hidden="true"><ellipse cx="0" cy="45" rx="${(24 * sc).toFixed(1)}" ry="4.5" fill="#0002"/>` +
    `<g transform="translate(0 ${(44 * (1 - sc)).toFixed(1)}) scale(${sc})">${stickered(fx.back + body + extra, 4.5, P.outline !== false)}</g></svg>`;
}
function eggSVG(sp, frac, special, feat){
  const [base, spot] = special ? ['url(#EG)', '#ffffff'] : (PETS[sp] || PETS.penguin).egg;
  const id = 'eg' + (++gradSeq);
  const ck = 'stroke="#8a7458" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"';
  const cracks = (frac >= .25 ? `<path d="M-31 6 L-23 1 L-17 8 L-10 2" ${ck}/>` : '') +
                 (frac >= .5 ? `<path d="M31 -2 L22 4 L18 -3 L10 3" ${ck}/>` : '') +
                 (frac >= .75 ? `<path d="M-6 -39 L-2 -30 L-8 -24 L-1 -17" ${ck}/>` : '');
  const defs = special ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3d1"/><stop offset=".3" stop-color="#ffe7a0"/><stop offset=".55" stop-color="#b8f0c8"/><stop offset=".8" stop-color="#b3dcff"/><stop offset="1" stop-color="#d8c2ff"/></linearGradient></defs>` : '';
  const shell = `<path d="M0 -40 C22 -40 32 -6 32 14 C32 34 18 44 0 44 C-18 44 -32 34 -32 14 C-32 -6 -22 -40 0 -40Z" fill="${special ? `url(#${id})` : base}" stroke="${special ? '#ffcf5a' : spot}" stroke-width="3"/>
      <g fill="${spot}" opacity=".8"><circle cx="-12" cy="-6" r="6"/><circle cx="13" cy="12" r="8"/><circle cx="-9" cy="27" r="5"/><circle cx="10" cy="-22" r="4"/></g>
      <ellipse cx="-15" cy="-17" rx="5" ry="9" fill="#fff" opacity=".6" transform="rotate(20 -15 -17)"/>${cracks}${special ? SPARKS : ''}${feat ? FEAT_STAR : ''}`;
  return `<svg class="${special ? 'rare' : ''}" viewBox="-50 -50 100 100" aria-hidden="true">${defs}<ellipse cx="0" cy="45" rx="22" ry="4.5" fill="#0002"/>${stickered(shell, 4.5)}</svg>`;
}
const dotsHTML = (on, all) => '<i class="on"></i>'.repeat(Math.max(0, on)) + '<i></i>'.repeat(Math.max(0, all - on));

/* 펫 상태 (v3): pets = 태어난 펫 모두, egg = 지금 품는 알 (늘 하나), pal = 데리고 다니는 펫
   양치 한 번에: 알 +1, 자라는 펫 +1 (데리고 다니는 펫이 덜 컸으면 그 펫) */
let petState = store.get('pet', null);
const petUid = () => 'p' + Date.now().toString(36) + Math.floor(Math.random() * 46656).toString(36);
const allPets = () => petState.pets;
// 아직 없는 동물만 (품고 있는 알과도 안 겹치게)
function freePool(pool, extra = []){
  const have = new Set(((petState && petState.pets) || []).map(p => p.sp).concat(extra));
  return pool.filter(id => !have.has(id));
}
/* ---------- 팀: 같은 팀 동물을 다 모으면 "합체!" (펫은 그대로 있음, 한 번 별 선물) ---------- */
/* 의도: 아이들이 좋아하는 "합체" 연출을 동물 모으기에 연결. 펫이 사라지는 합성은 하지 않기로 합의
   팀 추가 = 아래 목록에 { id, m:[동물 id…], col:빛 색, star?:별 } 한 줄 + 언어팩 'team.<id>'
   팀을 하나라도 시작했으면 새 알이 그 팀 동물일 확률 TEAM_BIAS (너무 운에만 맡기지 않게) */
const TEAMS = [
  { id:'jungle', m:['lion', 'tiger', 'leopard'], col:'#ffb347' },
  { id:'ice',    m:['polarbear', 'penguin', 'arcticfox', 'harpseal'], col:'#8fd3ff' },
  { id:'ocean',  m:['whale', 'dolphin', 'orca'], col:'#4fa3ff' },
  { id:'sky',    m:['eagle', 'hawk', 'owl'], col:'#b48cff' },
  { id:'farm',   m:['cow', 'pig', 'chicken', 'sheep'], col:'#9be37a' },
  { id:'safari', m:['elephant', 'giraffe', 'zebra', 'hippo'], col:'#f2cf7a' },
  { id:'dino',   m:['trex', 'triceratops', 'stegosaurus'], col:'#7fd36a' },
  { id:'bug',    m:['ladybug', 'bee', 'butterfly'], col:'#ff7a7a' },
  { id:'dog',    m:['shiba', 'corgi', 'jindo'], col:'#f0a050' },
  { id:'cat',    m:['cat', 'blackcat', 'persian'], col:'#ff9ec0' },
  { id:'forest', m:['rabbit', 'squirrel', 'hedgehog'], col:'#c89a6e' },
  { id:'legend', m:['dragon', 'phoenix', 'unicorn'], col:'#ffd54a', star:10 }
].filter(tm => tm.m.every(sp => PETS[sp]));
const TEAM_BIAS = .35;                                   // 새 알이 "팀을 채우는 동물"일 확률 (팀을 하나라도 시작했을 때)
const teamStar = (tm) => tm.star || 5;
const haveSp = () => new Set(((petState && petState.pets) || []).map(p => p.sp));
const teamDone = (tm) => !!(petState && (petState.teams || []).includes(tm.id));
function teamPool(){                                     // 시작한 팀의 아직 없는 동물들
  const h = haveSp();
  return [...new Set(TEAMS.filter(tm => !teamDone(tm) && tm.m.some(sp => h.has(sp))).flatMap(tm => tm.m.filter(sp => !h.has(sp))))];
}
function checkTeams(){                                   // 새로 다 모인 팀 (한 번만)
  petState.teams = petState.teams || [];
  const h = haveSp(), fresh = TEAMS.filter(tm => !petState.teams.includes(tm.id) && tm.m.every(sp => h.has(sp)));
  fresh.forEach(tm => petState.teams.push(tm.id));
  if (fresh.length) store.set('pet', petState);
  return fresh;
}

/* ---------- 이달의 친구: 달마다 정해진 동물 하나가 그달 첫 새 알로 옴 ---------- */
/* 의도: 달마다 "새것"이 오는 리듬. 누구에게나 같은 순서(달 이름으로 섞음)라 친구끼리 얘기할 거리도 됨.
   이미 가진 동물이면 다음 순서 동물로 */
const monthKey = (d = new Date()) => d.getFullYear() + '-' + (d.getMonth() + 1);
function ensureFeat(){
  const mk = monthKey();
  if (petState.feat && petState.feat.m === mk) return;
  const tierOf = (x) => CONFIG.popularFirst === false ? 0 : petTier(x);          // v0.29.0 이달의 친구도 인기 동물부터
  const h = haveSp(), order = regPool().slice().sort((a, b) => (tierOf(a) - tierOf(b)) || (hashStr(mk + a) - hashStr(mk + b)));
  const sp = order.find(x => !h.has(x)) || null;
  const given = !!(sp && petState.egg && petState.egg.sp === sp);
  petState.feat = { m:mk, sp, given };
  if (given) petState.egg.feat = true;
}
const featSp = () => (petState && petState.feat && petState.feat.sp) || null;
function newEgg(first){
  const want = !!(petState && petState.nextSpecial);                             // 무지개 성 선물: 다음 알은 특별한 알 (v0.24)
  let special = !first && (want || Math.random() < PET_CFG.specialEggChance);     // 가끔 특별한 알 → 전설 펫
  const got = (egg) => { if (want && egg && egg.special) delete petState.nextSpecial; return egg; };
  const f = petState && petState.feat;
  if (!special && f && f.sp && !f.given && freePool([f.sp]).length){ f.given = true; return { sp:f.sp, p:0, special:false, feat:true }; }   // 이달의 친구
  let pool = freePool(special ? legPool() : regPool());
  if (!pool.length && special){ special = false; pool = freePool(regPool()); }
  if (!pool.length){ pool = freePool(legPool()); special = pool.length > 0; }   // 보통 동물을 다 모으면 전설만
  if (!special) pool = bestTier(pool);                                           // v0.29.0 인기 동물부터
  if (pool.length && !special && Math.random() < TEAM_BIAS){ const tp = teamPool().filter(sp => pool.includes(sp)); if (tp.length) return { sp:pick(tp), p:0, special }; }   // 시작한 팀 채우기
  return got(pool.length ? { sp:pick(pool), p:0, special } : null);             // 전부 모으면 알 없음
}
// 양치 보상 펫: 하루에 두 번 닦은 날 한 번
const giftSkip = () => (petState.egg ? [petState.egg.sp] : []).concat(petState.feat && !petState.feat.given && petState.feat.sp ? [petState.feat.sp] : []);
function giftPet(){
  const pool = bestTier(freePool(regPool(), giftSkip()));                     // v0.29.0 인기 동물부터
  if (!pool.length) return null;
  const np = { id:petUid(), sp:pick(pool), st:1, p:0, name:'', wear:{} };
  petState.pets.push(np); bookPet(np);
  if (!companion()) petState.pal = np.id;
  petState.giftDay = todayKey(); store.set('pet', petState); renderPets();
  return np;
}
const giftReady = () => petState.giftDay !== todayKey() && freePool(regPool(), giftSkip()).length > 0;

/* ---------- v0.30.0 오늘의 퀴즈: 그날 첫 양치를 마치면 한 문제 (하루 한 번) ----------
   의도: 양치를 해야 열림 (양치보다 퀴즈가 먼저 되지 않게). 한 문제만 (자기 전이라 짧게)
   나이(만): 3살 이하 1~3개 세기 · 4살 1~5개 세기 · 5살 4~8개 세기나 그림 더하기(합 5까지) · 6살 10까지 더하기 · 빼기 · 7살 이상 20까지
   태어난 해를 모르면: 만 3세 미만 → 3살 문제, 그 밖 → 5살 문제
   틀려도 다시 고를 수 있음 (틀린 답은 흐리게). 맞히면 별 + 도장, 도장 CONFIG.quiz.stampsForPet 개면 펫 (인기 순서)
   부모 확인(곱셈)과 겹치지 않게 퀴즈는 더하기 · 빼기까지만 */
var quizCur = null, quizPetWon = null;
const QUIZ_ITEMS = { apple:'🍎', star:'⭐', fish:'🐟', strawberry:'🍓', balloon:'🎈', duck:'🐥' };
const quizCfg = () => Object.assign({ star:1, stampsForPet:7 }, CONFIG.quiz || {});
function quizAvail(){
  if (store.get('quizOn', true) === false) return false;
  const today = todayKey();
  return log.includes(today) && store.get('quizDay', '') !== today;
}
function quizRefresh(){
  const ok = quizAvail();
  ['#quizHome', '#quizDone'].forEach(id => { const b = $(id); if (b){ b.hidden = !ok; b.textContent = t('quiz.btn'); } });
}
function quizLevel(){
  const a = kidAge();
  if (a === null) return childAge === 'u3' ? 1 : 3;
  return a <= 3 ? 1 : a === 4 ? 2 : a === 5 ? 3 : a === 6 ? 4 : a === 7 ? 5 : a === 8 ? 6 : a === 9 ? 7 : 8;
}
const qr = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function quizMake(lv){
  const item = pick(Object.keys(QUIZ_ITEMS)), em = QUIZ_ITEMS[item];
  let q;
  if (lv <= 2 || (lv === 3 && Math.random() < .5)){
    const n = lv === 1 ? qr(1, 3) : lv === 2 ? qr(2, 5) : qr(4, 8);
    q = { kind:'count', item, ans:n, pic:{ groups:[n], em } };
  } else if (lv === 3){
    const a = qr(1, 3), b = qr(1, 5 - a);
    q = { kind:'add', a, b, ans:a + b, pic:{ groups:[a, b], em } };
  } else if (lv === 8){                                                    // 10살 이상: 구구단 (2~9단)
    const a = qr(2, 9), b = qr(2, 9);
    q = { kind:'mul', a, b, ans:a * b, num:true, near:[a, b] };
  } else if (lv >= 6){                                                     // 8살: 100 안 (받아올림 · 내림 없음) · 9살: 100 안 (받아올림 · 내림 있음)
    const add = Math.random() < .5, carry = lv === 7;
    let a, b, tries = 0;
    do {
      a = qr(11, 99); b = qr(11, 99); tries++;
      if (!add && a < b){ const x = a; a = b; b = x; }
      const oa = a % 10, ob = b % 10, ok = add ? (carry ? oa + ob >= 10 : oa + ob <= 9) : (carry ? oa < ob : oa >= ob);
      if (ok && (add ? a + b <= 100 : a > b)) break;
    } while (tries < 200);
    if (tries >= 200){ a = add ? 34 : 58; b = add ? 25 : 23; }
    q = { kind: add ? 'add' : 'sub', a, b, ans: add ? a + b : a - b, num:true };
  } else {
    const max = lv === 4 ? 10 : 20, add = Math.random() < .6;
    let a, b;
    if (add){ a = qr(1, max - 1); b = qr(1, max - a); } else { a = qr(2, max); b = qr(1, a - 1); }
    q = { kind: add ? 'add' : 'sub', a, b, ans: add ? a + b : a - b, num:true };
  }
  const opts = new Set(lv === 1 ? [1, 2, 3] : [q.ans]), lo = lv === 1 ? 1 : 0;     // 3살: 보기는 늘 1 · 2 · 3
  for (let k = 0; opts.size < 3 && k < 60; k++){ const v = q.ans + pick(q.near && k < 30 ? [-q.near[0], q.near[0], -q.near[1], q.near[1]] : lv >= 6 ? [-10, -1, 1, 10] : [-2, -1, 1, 2]); if (v >= lo && v !== q.ans) opts.add(v); }
  q.opts = [...opts].sort(() => Math.random() - .5);
  q.text = q.kind === 'count' ? t('quiz.count', { item:t('quiz.item.' + item) }) : t('quiz.' + q.kind, { a:q.a, b:q.b });
  return q;
}
function quizDrawStamps(){
  const need = quizCfg().stampsForPet, have = store.get('quizStamps', 0);
  $('#quizStamps').innerHTML = `<span>🐾</span>` + Array.from({ length:need }, (_, i) => `<i class="${i < have ? 'on' : ''}"></i>`).join('') + `<span>${have}/${need}</span>`;
}
function quizOpen(){
  if (!quizAvail()) return;
  sfx.tap(); quizPetWon = null;
  const q = quizCur = quizMake(quizLevel());
  const pic = $('#quizPic');
  if (q.num) pic.innerHTML = `<span class="qp-num">${q.a} ${q.kind === 'add' ? '+' : q.kind === 'mul' ? '×' : '−'} ${q.b} = ?</span>`;
  else pic.innerHTML = q.pic.groups.map(n => `<span>${q.pic.em.repeat(n)}</span>`).join('<span class="qp-plus">+</span>');
  $('#quizQ').textContent = q.text;
  $('#quizOpts').innerHTML = q.opts.map(v => `<button data-v="${v}">${v}</button>`).join('');
  const msg = $('#quizMsg'); msg.textContent = ''; msg.classList.remove('bad');
  $('#quizOk').hidden = true; $('#quizClose').hidden = false; quizDrawStamps();
  $('#quiz').classList.add('show');
  setTimeout(() => Voice.play('quiz.q', callName() + q.text), 250);
}
function quizClose(){
  $('#quiz').classList.remove('show'); Voice.stop(); quizCur = null; quizRefresh();
  if (quizPetWon){ const pet = quizPetWon; quizPetWon = null; petPend = (petPend || []).concat([{ kind:'gift', pet }]); petPendingShow(); }
}
function quizPet(){                                        // 도장을 다 모으면 펫 (하루 두 번 선물과 따로 셈)
  const pool = bestTier(freePool(regPool(), giftSkip()));
  if (!pool.length) return null;
  const np = { id:petUid(), sp:pick(pool), st:1, p:0, name:'', wear:{} };
  petState.pets.push(np); bookPet(np);
  if (!companion()) petState.pal = np.id;
  store.set('pet', petState); renderPets();
  return np;
}
$('#quizOpts').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-v]'); if (!b || !quizCur || b.classList.contains('no') || quizCur.done) return;
  const msg = $('#quizMsg');
  if (+b.dataset.v !== quizCur.ans){
    b.classList.add('no'); tone(220, .18, 'triangle', .12);
    msg.textContent = t('quiz.no'); msg.classList.add('bad'); Voice.play('quiz.no', t('quiz.no'));
    return;
  }
  quizCur.done = true; b.classList.add('yes'); sfx.buy(); confetti(40);
  const cfg = quizCfg(); let k = store.get('quizStamps', 0) + 1;
  store.set('quizDay', todayKey()); setStars(stars + cfg.star);
  let line = t('quiz.reward', { n:cfg.star });
  if (k >= cfg.stampsForPet){
    k = 0; quizPetWon = quizPet();
    if (quizPetWon) line = t('quiz.petWon');
    else { setStars(stars + 5); line = t('quiz.allPets'); }                    // 펫을 다 모았으면 별 5개 더
  }
  store.set('quizStamps', k); quizDrawStamps();
  msg.classList.remove('bad'); msg.textContent = t('quiz.ok') + ' ' + line;
  Voice.play('quiz.ok', t('quiz.ok') + ' ' + line);
  $('#quizOk').textContent = t('quiz.okBtn'); $('#quizOk').hidden = false; $('#quizClose').hidden = true;
});
$('#quizHear').addEventListener('click', () => { sfx.tap(); if (quizCur) Voice.play('quiz.q', quizCur.text); });
$('#quizOk').addEventListener('click', () => { sfx.tap(); quizClose(); });
$('#quizClose').addEventListener('click', () => { sfx.tap(); quizClose(); });
$('#quizHome').addEventListener('click', quizOpen);
$('#quizDone').addEventListener('click', quizOpen);
if (!petState || !petState.v) petState = { v:3, egg:null, pets:[], pal:null, day:'', dayN:0 };
if (!petState.pets){ petState.pets = (petState.friends || []).concat(petState.cur ? [petState.cur] : []); delete petState.friends; delete petState.cur; }
petState.v = 3;
petState.pets.forEach(p => { if (!p.id) p.id = petUid(); p.wear = p.wear || {}; if (!PETS[p.sp]) p.sp = 'penguin'; delete p.color; delete p.shiny; });
// v0.29.0 인기 순서 전에 정해 둔 것 다시 고르기: 이달의 친구 · 아직 안 깬 알이 더 앞 등급 동물이 남았는데 뒤 등급이면 (알은 따뜻해진 정도 그대로)
const topTierLeft = () => { const fp = freePool(regPool()); return fp.length ? Math.min(...fp.map(petTier)) : 9; };
if (CONFIG.popularFirst !== false){
  if (petState.feat && !petState.feat.given && petState.feat.sp && petTier(petState.feat.sp) > topTierLeft()) delete petState.feat;
  const e0 = petState.egg;
  if (e0 && !e0.special && !e0.feat && PETS[e0.sp] && petTier(e0.sp) > topTierLeft()){
    const ne = newEgg(); if (ne && !ne.special){ ne.p = Math.min(e0.p || 0, PET_CFG.hatch - 1); petState.egg = ne; }
  }
}
ensureFeat();
if (petState.egg && (!PETS[petState.egg.sp] || petState.pets.some(p => p.sp === petState.egg.sp))){     // 이미 있는 동물 알이면 바꿈 (따뜻해진 정도는 그대로)
  const ne = newEgg(); if (ne) ne.p = Math.min(petState.egg.p || 0, PET_CFG.hatch - 1); petState.egg = ne;
}
if (!petState.egg) petState.egg = newEgg(!petState.pets.length);
if (!petState.pets.some(p => p.id === petState.pal)) petState.pal = petState.pets.length ? petState.pets[petState.pets.length - 1].id : null;
store.set('pet', petState);
const companion = () => petState.pets.find(p => p.id === petState.pal) || petState.pets[petState.pets.length - 1] || null;
// 자라는 펫: 데리고 다니는 펫이 덜 컸으면 그 펫, 아니면 먼저 태어난 덜 큰 펫부터
const grower = () => { const c = companion(); if (c && c.st < 3) return c; return petState.pets.find(p => p.st < 3) || null; };
const petName = (p) => p.name || t('pet.' + p.sp + '.def');
const needOf = (p) => PET_CFG.grow[p.st - 1];
const petCapped = () => petState.day === todayKey() && petState.dayN >= PET_CFG.perDay;
const eggArt = (frac) => petState.egg ? eggSVG(petState.egg.sp, frac === undefined ? petState.egg.p / PET_CFG.hatch : frac, petState.egg.special, petState.egg.feat) : '';

function petAdvance(force){
  const s = petState, today = todayKey();
  if (s.day !== today){ s.day = today; s.dayN = 0; }
  if (!force && s.dayN >= PET_CFG.perDay) return { type:'rest' };
  if (!force) s.dayN++;
  const ev = { type:'step' };
  const g = grower();                                         // 1) 펫이 자람
  if (g){ g.p++; if (g.p >= needOf(g)){ g.st++; g.p = 0; ev.grew = g; ev.type = g.st >= 3 ? 'adult' : 'grow'; } }
  if (s.egg) s.egg.p++;                                       // 2) 알이 따뜻해짐
  if (s.egg && s.egg.p >= PET_CFG.hatch){
    const np = { id:petUid(), sp:s.egg.sp, st:1, p:0, name:'', wear:{} };
    ev.hatched = np; ev.special = !!s.egg.special; ev.feat = !!s.egg.feat; ev.type = 'hatch';
    const cp = companion();
    s.pets.push(np); bookPet(np);
    if (!cp) s.pal = np.id;                                   // 데리고 다니는 펫은 아이가 고름 (처음 한 마리만 자동)
    s.egg = newEgg(); ev.newSpecial = !!(s.egg && s.egg.special);   // 바로 다음 알 (다 모았으면 없음)
  }
  ev.capped = s.dayN >= PET_CFG.perDay;
  store.set('pet', s); renderPets();
  return ev;
}

function renderPets(){
  const s = petState, cap = petCapped(), pal = companion(), g = grower();
  const egg = $('#homeEgg'), palEl = $('#homePal');
  egg.hidden = !s.egg;
  if (s.egg) egg.innerHTML = eggArt() + `<div class="pdots">${dotsHTML(s.egg.p, PET_CFG.hatch)}</div>`;
  egg.classList.toggle('feat', !!(s.egg && s.egg.feat));
  $('#palChange').hidden = s.pets.length < 2;
  egg.classList.toggle('sleep', cap);
  palEl.hidden = !pal;
  if (pal) palEl.innerHTML = petArt(pal) + (pal === g ? `<div class="pdots">${dotsHTML(g.p, needOf(g))}</div>` : '');
  palEl.classList.toggle('sleep', cap && pal === g);
  $$('.pet-ride').forEach(r => { r.innerHTML = pal ? petArt(pal) : eggArt(); r.classList.toggle('egg', !pal); });
}
function petHop(){
  const r = view && view.querySelector('.pet-ride'); if (!r) return;
  r.classList.remove('hop'); void r.offsetWidth; r.classList.add('hop');
}
// 첫 화면: 알·펫을 누르면 말풍선
let bubT = 0;
function petSay(side, text){
  const b = $('#petBub');
  b.textContent = text; b.className = 'pet-bub show ' + side;
  clearTimeout(bubT); bubT = setTimeout(() => b.classList.remove('show'), 2800);
  Voice.play('pet.say', text);
}
function hopEl(el){ el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); setTimeout(() => el.classList.remove('hop'), 600); }
const eggLine = () => petState.egg ? t(petState.egg.special ? 'pet.eggSpecial' : petState.egg.feat ? 'pet.eggFeat' : 'pet.eggSay', { n:PET_CFG.hatch - petState.egg.p }) : t(freeWait() ? 'pet.waitNew' : 'pet.allDone');
$('#homeEgg').addEventListener('click', (e) => {
  ac(); hopEl(e.currentTarget); tone(660, .1, 'sine', .12); tone(990, .1, 'sine', .1, .08);
  if (!petState.egg) return;
  petSay('l', petCapped() ? t('pet.restEgg') : eggLine());
});
$('#palChange').addEventListener('click', () => { sfx.tap(); roomTab = 'friends'; selPet = null; renderRoom(); show('room'); });
$('#homePal').addEventListener('click', (e) => {
  ac();
  const pal = companion(), g = grower();
  if (loveOf(pal) >= LOVE_MAX && !(pal === g && petCapped())){ playTrick(e.currentTarget, pal); petSay('r', trickLine(pal)); return; }   // 재주
  hopEl(e.currentTarget); tone(784, .1, 'sine', .12); tone(1175, .12, 'sine', .1, .08);
  if (pal === g && petCapped()) petSay('r', t('pet.restPet', { name:petName(pal) }));
  else if (pal === g && Math.random() < .4) petSay('r', t('pet.growLeft', { name:petName(pal), n:needOf(pal) - pal.p }));
  else petSay('r', petName(pal) + '! ' + t('pet.says'));
});

// 완료 화면 진행 카드: 자라는 펫 + 알
function showPetCard(ev, speak){
  if (!ev || current !== 'done') return;
  const s = petState, g = grower();
  let art, text = '', dots = '';
  if (g){ art = petArt(g); dots = dotsHTML(g.p, needOf(g)); text = ev.type === 'rest' ? t('pet.restPet', { name:petName(g) }) : t('pet.growLeft', { name:petName(g), n:needOf(g) - g.p }); }
  else if (ev.grew){ art = petArt(ev.grew); text = t('pet.adult', { name:petName(ev.grew) }); }
  else if (s.egg){ art = eggArt(); dots = dotsHTML(s.egg.p, PET_CFG.hatch); }
  else { const c = companion(); art = c ? petArt(c) : ''; }
  const eggTxt = !s.egg ? t(freeWait() ? 'pet.waitNew' : 'pet.allDone') : ev.type === 'rest' ? (g ? '' : t('pet.restEgg')) : t(s.egg.special ? 'pet.eggSpecial' : 'pet.eggLeft', { n:PET_CFG.hatch - s.egg.p });
  const say = [text, ev.newSpecial ? t('pet.newSpecialEgg') : '', eggTxt, ev.capped && ev.type !== 'rest' ? t('pet.seeTomorrow') : ''].filter(Boolean).join(' ');
  $('#pcArt').innerHTML = art; $('#pcText').textContent = text || eggTxt;
  $('#pcDots').innerHTML = dots + ((g || ev.grew) && s.egg ? `<span class="egg-mini">${s.egg.special ? '🌈' : '🥚'} ${s.egg.p}/${PET_CFG.hatch}</span>` : '');
  $('#petCard').hidden = false; $('#nextRow').hidden = false; revealNext();
  tone(1046, .12, 'sine', .1); tone(1318, .14, 'sine', .1, .1);
  if (speak) giftTimers.push(setTimeout(() => Voice.play('pet.card', say), 1400));     // 글을 못 읽는 아이를 위해 읽어줌
}

const GIFT_ART = stickerSvg('<svg viewBox="-50 -50 100 100" aria-hidden="true"><ellipse cx="0" cy="45" rx="30" ry="4.5" fill="#0002"/><rect x="-30" y="-6" width="60" height="48" rx="7" fill="#ff7aa8" stroke="#e85d8f" stroke-width="3"/><rect x="-6" y="-6" width="12" height="48" fill="#ffd54a"/><rect x="-35" y="-20" width="70" height="17" rx="6" fill="#ff8fb4" stroke="#e85d8f" stroke-width="3"/><rect x="-6" y="-20" width="12" height="17" fill="#ffd54a"/><ellipse cx="-11" cy="-27" rx="11" ry="7" fill="#ffd54a" stroke="#f0a500" stroke-width="2"/><ellipse cx="11" cy="-27" rx="11" ry="7" fill="#ffd54a" stroke="#f0a500" stroke-width="2"/><circle cy="-25" r="5" fill="#ffc83d" stroke="#f0a500" stroke-width="2"/><circle cx="-18" cy="10" r="4" fill="#fff" opacity=".6"/><circle cx="18" cy="28" r="5" fill="#fff" opacity=".6"/></svg>', 3);
// 부화 · 성장 · 펫 선물 축하 (전체 화면). 여러 개면 차례로 → 다 보면 완료 카드
let psTimers = [];
const petShowsOf = (ev, gift) => {
  const q = [];
  if (ev && ev.hatched) q.push({ kind:'hatch', pet:ev.hatched, special:ev.special, feat:ev.feat });
  if (ev && ev.grew) q.push({ kind:ev.grew.st >= 3 ? 'adult' : 'grow', pet:ev.grew });
  if (gift) q.push({ kind:'gift', pet:gift });
  return q;
};
function petPendingShow(){ if (petPend && petPend.length && !$('#petShow').classList.contains('show')) openPetShow(petPend.shift()); }
function openPetShow(it){
  // 축하창 하나로 여러 연출: hatch(알 부화) · gift(선물 펫) · grow(쑥) · adult(어른 변신) · team(합체) · hero(반짝이 변신)
  // 여러 개가 한 번에 생기면 petPend 대기열로 차례로 → 다 보면 완료 화면 진행 카드
  psTimers.forEach(clearTimeout); psTimers = [];
  const box = $('#petShow'), stage = $('#psStage'), title = $('#psTitle');
  box.classList.add('show'); title.textContent = ''; $('#psNameRow').hidden = true; $('#psOk').hidden = true;
  box.dataset.type = it.kind; Voice.stop(); stage.style.removeProperty('--tc');
  const later = (ms, fn) => psTimers.push(setTimeout(fn, ms));
  const fanfare = () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .2, 'triangle', .18, i * .08)); confetti(70); buzz([80, 40, 160]);
    const r = stage.getBoundingClientRect(); firework(r.left + r.width / 2, r.top + r.height * .35); };
  const finale = (msg, say) => { title.textContent = msg; Voice.play('pet.show', say || msg); $('#psOk').hidden = false; };
  const charge = (n = 6) => { for (let i = 0; i < n; i++) later(i * 240, () => tone(330 + i * 90, .1, 'square', .05)); later(n * 240, () => tone(1568, .25, 'sine', .12)); };
  const p = it.pet, born = it.kind === 'hatch' || it.kind === 'gift';
  if (born){
    stage.className = 'ps-stage hatching';
    stage.innerHTML = `<div class="ps-egg">${it.kind === 'gift' ? GIFT_ART : eggSVG(p.sp, 1, it.special, it.feat)}</div><div class="ps-pet">${petArt(p)}</div>`;
    [300, 900, 1500, 2100].forEach((ms, i) => later(ms, () => { tone(320 + i * 60, .07, 'square', .05); tone(180, .06, 'triangle', .08, .03); buzz(30); }));
    later(2500, () => {
      stage.classList.add('burst'); fanfare();
      const legend = isRare(p);
      const msg = it.kind === 'gift' ? t('pet.giftTitle', { sp:petTitle(p) }) : it.feat ? t('pet.hatchedFeat', { sp:petTitle(p) }) : t(legend ? 'pet.hatchedShiny' : 'pet.hatched', { sp:petTitle(p) });
      if (legend){ [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, .14, 'sine', .12, .5 + i * .08)); setTimeout(() => confetti(80), 400); }
      title.textContent = msg; Voice.play('pet.hatched', msg + ' ' + t('pet.nameAsk'));
      $('#psName').value = petName(p); $('#psNameRow').hidden = false; $('#psOk').hidden = false;
    });
  } else if (it.kind === 'team'){
    // 합체: 한 마리씩 등장 → 가운데로 빙글빙글 모임 → 번쩍! → 다 같이 포즈
    const tm = it.team, mem = tm.m.map(sp => petState.pets.find(x => x.sp === sp) || { sp, st:3 }), n = mem.length, W = n > 3 ? 38 : 44;
    stage.className = 'ps-stage team'; stage.style.setProperty('--tc', tm.col);
    stage.innerHTML = '<div class="ps-rays"></div>' + mem.map((m, i) => {
      const L = n === 1 ? 50 - W / 2 : i * (100 - W) / (n - 1), back = i % 2 === 1;
      return `<div class="ps-mem" style="left:${L.toFixed(1)}%;width:${W}%;bottom:${back ? 30 : 4}%;z-index:${back ? 1 : 2};--d:${(i * .35).toFixed(2)}s;` +
        `--mx:${((50 - L - W / 2) / W * 100).toFixed(1)}%;--my:${((back ? 13 : -13) / W * 100).toFixed(1)}%">${petArt(m)}</div>`;
    }).join('') + '<div class="ps-flash"></div>';
    mem.forEach((m, i) => later(i * 350 + 200, () => { tone(523 + i * 131, .14, 'triangle', .12); buzz(25); }));
    const tm1 = n * 350 + 800;
    later(tm1, () => { stage.classList.add('merge'); charge(5); });
    later(tm1 + 1300, () => {
      stage.classList.remove('merge'); stage.classList.add('merged'); fanfare();
      const team = t('team.' + tm.id), names = tm.m.map(sp => t('pet.' + sp)).join(', ');
      finale(t('team.go', { team }), t('team.say', { team, names }) + (it.star ? ' ' + t('team.star', { n:it.star }) : ''));
    });
  } else if (it.kind === 'hero'){
    // 반짝이 변신: 빙글빙글 빛나다가 → 번쩍! → 변신한 모습
    const hs = it.set;
    if (it.auto) wearSet(hs.id, true);
    stage.className = 'ps-stage growing hero'; stage.style.setProperty('--tc', hs.aura);
    stage.innerHTML = `<div class="ps-rays"></div><div class="ps-pet before">${Character.art({})}</div><div class="ps-pet after">${Character.art(heroLook(hs.id))}</div><div class="ps-flash"></div>`;
    charge(6);
    later(1650, () => {
      stage.classList.add('grown'); fanfare();
      const msg = t('hero.go', { set:t('hero.set.' + hs.id) });
      finale(msg, callName() + msg);
    });
  } else {
    const before = Object.assign({}, p, { st:p.st - 1, look:0 }), adult = p.st >= 3;
    stage.className = 'ps-stage growing' + (adult ? ' hero' : '');
    stage.innerHTML = (adult ? '<div class="ps-rays"></div>' : '') + `<div class="ps-pet before">${petArt(before)}</div><div class="ps-pet after">${petArt(Object.assign({}, p, { look:0 }))}</div>` + (adult ? '<div class="ps-flash"></div>' : '');
    if (adult) charge(6); else [0, 500, 1000].forEach((ms, i) => later(ms + 200, () => tone(523 + i * 131, .14, 'sine', .12)));
    later(adult ? 1650 : 1700, () => {
      stage.classList.add('grown'); fanfare();
      finale(adult ? t('pet.heroAdult', { name:petName(p) }) : t('pet.grew', { name:petName(p) }));
    });
  }
  $('#psOk').onclick = () => {
    sfx.tap();
    if (born){ p.name = $('#psName').value.trim().slice(0, 10) || petName(p); store.set('pet', petState); }
    psTimers.forEach(clearTimeout); psTimers = [];
    box.classList.remove('show'); renderPets();
    if (current === 'closet') renderGrid();
    if (petPend && petPend.length) return setTimeout(petPendingShow, 250);
    showPetCard(petEv || { type:'step' });
  };
}
$('#petTest').addEventListener('click', () => {
  sfx.tap();
  const ev = petAdvance(true), fresh = checkTeams(), q = petShowsOf(ev).concat(fresh.map(tm => ({ kind:'team', team:tm, star:teamStar(tm) })));
  fresh.forEach(tm => setStars(stars + teamStar(tm)));
  if (q.length){ show('home'); petPend = q; petPendingShow(); }
  else { const g = grower(); toast(g ? t('pet.growLeft', { name:petName(g), n:needOf(g) - g.p }) : t('pet.eggLeft', { n:PET_CFG.hatch - petState.egg.p })); }
});
// 양치 화면 세 곳에 펫 자리
/* ---------- 간식 · 하트 · 재주 ----------
   의도: 별을 쓸 작은 곳 + 펫과 매일 놀 거리. 하루 1번으로 속도 조절, 재주는 동물마다 정해짐(trickOf)
   간식 한 번(⭐1, 펫마다 하루 한 번) = 하트 하나. 하트 5개면 재주를 배우고, 누를 때마다 보여줌. 하트는 줄지 않음 */
const LOVE_MAX = 5, TRICKS = ['spin', 'jump', 'dance', 'flip'];
const loveOf = (p) => Math.min(LOVE_MAX, (p && p.love) || 0);
const trickOf = (p) => TRICKS[hashStr(p.sp) % TRICKS.length];
const heartsHTML = (p) => `<span class="hearts" aria-label="♥ ${loveOf(p)}/${LOVE_MAX}">${'♥'.repeat(loveOf(p))}<s>${'♥'.repeat(LOVE_MAX - loveOf(p))}</s></span>`;
function playTrick(el, p){
  if (!el || !p) return;
  const k = 'tk-' + trickOf(p);
  TRICKS.forEach(x => el.classList.remove('tk-' + x)); el.classList.remove('hop'); void el.offsetWidth; el.classList.add(k);
  setTimeout(() => el.classList.remove(k), 1250);
  [659, 784, 988, 1319].forEach((f, i) => tone(f, .12, 'sine', .1, i * .1)); buzz([30, 40, 30]);
}
const trickLine = (p) => t('pet.trickShow', { name:petName(p), trick:t('trick.' + trickOf(p)) });
function heartsBurst(box, n = 5){
  if (!box) return;
  for (let i = 0; i < n; i++){
    const h = document.createElement('i'); h.className = 'heart-fly'; h.textContent = '♥';
    h.style.left = (38 + Math.random() * 24) + '%'; h.style.top = (30 + Math.random() * 20) + '%'; h.style.animationDelay = (i * .12) + 's';
    box.appendChild(h); setTimeout(() => h.remove(), 1600);
  }
}
// 팀 그림: 멤버를 나란히 (아직 없는 동물은 그림자)
function teamArt(tm){
  const h = haveSp(), n = tm.m.length, gap = n > 3 ? 70 : 86, fid = 'sil' + (++gradSeq), W = gap * (n - 1) + 100;
  return `<svg viewBox="0 0 ${W} 112" aria-hidden="true"><defs><filter id="${fid}"><feColorMatrix type="matrix" values="0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .7 0 0 0 .3 0"/></filter></defs>` +
    tm.m.map((sp, i) => { const own = h.has(sp), p = own ? petState.pets.find(x => x.sp === sp) : { sp, st:3 };
      const inner = petArt(Object.assign({}, p, { wear:{} })).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');   // 겹친 svg 대신 그룹으로 (크기 규칙에 안 걸리게)
      const g = `<g transform="translate(${i * gap + 50} ${(i % 2 ? 0 : 12) + 50})">${inner}</g>`;
      return own ? g : `<g filter="url(#${fid})">${g}</g>`; }).join('') + '</svg>';
}
['#brushC .c-rider'].forEach(sel => { const d = document.createElement('div'); d.className = 'pet-ride'; $(sel).appendChild(d); });
renderPets();
