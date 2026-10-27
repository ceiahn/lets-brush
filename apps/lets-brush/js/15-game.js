'use strict';

/* =========================================================
   14-3. 게임 요소: 도감 · 연속 기록 · 다음 대장 예고 · 이빨 요정 · 칭찬 도장 · 주간 기록 · 펫 방 · 모험 지도
     · 도감: 대장 세균 · 세균 · 펫 · 전설 펫 · 팀 (팀은 다 모으면 합체 다시 보기)
     · 연속 기록 불꽃 + 지킴이 방석(하루 빠져도 지켜줌 — 실패 압박을 줄이려고)
     · 칭찬 도장: 부모가 마무리 양치 후 꾹 눌러 주는 것 (부모 참여 유도)
     · 펫 화면: 친구들(이름 · 데리고 다니기 · 간식) / 펫 꾸미기 / 방 꾸미기(내 방 + 동물 집 6곳)
     · 동물 집 = 큰 저금 목표 (별 쓸 곳이 금방 없어진다는 문제 해결용). 첫 화면 목표 막대와 연결
     · 모험 지도: 양치 1번 = 1칸(하루 3칸), 섬 7칸. 섬 순서대로 변신 옷 머리 → 눈 → 목 → 등 → 손, 무지개 성 = 특별한 알
   ========================================================= */
// ---------- 도감 ----------
let book = store.get('book', { boss:{}, germ:{}, pet:{}, shiny:{} });
function bookAdd(kind, id){ book[kind] = book[kind] || {}; book[kind][id] = (book[kind][id] || 0) + 1; store.set('book', book); }
function bookPet(p, count = true){
  if (count) bookAdd('pet', p.sp); else { book.pet = book.pet || {}; book.pet[p.sp] = book.pet[p.sp] || 1; store.set('book', book); }
}
allPets().forEach(p => bookPet(p, false));
let bookTab = 'boss', bookList = [];
function bookEntries(tab){
  // art 는 그림을 만드는 함수 (v0.41.0: 숫자만 셀 때는 그림을 안 만듦)
  if (tab === 'boss') return BOSSES.map(b => ({ name:t('boss.' + b.id), n:book.boss[b.id], art:() => germSVG(b.col, b), tip:t('boss.' + b.id + '.tip') }));
  if (tab === 'germ') return ['0', '1', '2', '3', 'gold'].map(c => ({ name:t('germ.' + c), n:(book.germ || {})[c], art:() => germSVG(c === 'gold' ? 'gold' : +c), tip:t('germ.' + c + '.tip') }));
  if (tab === 'team') return TEAMS.map(tm => {
    const h = haveSp(), k = tm.m.filter(sp => h.has(sp)).length, dn = teamDone(tm);
    return { name:t('team.' + tm.id), n:dn ? 1 : 0, always:true, team:tm, art:() => teamArt(tm), tag:dn ? '🤝 ' + t('team.done') : `${k} / ${tm.m.length}` };
  });
  const fs = featSp();
  return Object.keys(PETS).filter(sp => !!PETS[sp].special === (tab === 'legend')).map(sp =>
    ({ name:t('pet.' + sp), n:(book.pet || {})[sp], art:() => petArt({ sp, st:3 }), shiny:!!PETS[sp].special, tip:PETS[sp].special ? t('book.special') : '', hint:sp === fs ? t('book.feat') : '',
       tag:(() => { const p = petState.pets.find(x => x.sp === sp); return p ? t('pet.stage' + p.st) : ' '; })() }));     // 펫은 한 번만 만나니 횟수 대신 자란 정도
}
function renderBook(){
  $('#bookTabs').innerHTML = ['boss', 'germ', 'pet', 'legend', 'team'].map(k => `<button class="tab ${k === bookTab ? 'active' : ''}" data-tab="${k}">${t('book.' + k)}</button>`).join('');
  bookList = bookEntries(bookTab);
  $('#bookGrid').classList.toggle('teams', bookTab === 'team');
  const L = lazyArt();
  $('#bookGrid').innerHTML = bookList.map((e, i) => { const open = e.n || e.always; return `
      <button class="item ${open ? '' : 'unseen'} ${e.shiny && e.n ? 'shinyc' : ''} ${e.team ? 'team-c' : ''} ${e.team && e.n ? 'done' : ''}" data-i="${i}">
        <div class="thumb">${L.ph(e.art)}</div>
        <span class="name">${open ? e.name : '???'}</span><span class="tag">${open ? (e.tag || t('book.count', { n:e.n })) : (e.hint || '')}</span>
      </button>`; }).join('');
  L.watch($('#bookGrid'));
  const all = ['boss', 'germ', 'pet', 'legend', 'team'].flatMap(k => bookEntries(k));
  $('#bookCount').textContent = `${all.filter(e => e.n).length} / ${all.length}`;
}
$('#bookTabs').addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (!b) return; bookTab = b.dataset.tab; sfx.tap(); $('#bookTip').textContent = ''; renderBook(); });
$('#bookGrid').addEventListener('click', (e) => {
  const c = e.target.closest('.item'); if (!c) return;
  const en = bookList[+c.dataset.i]; ac();
  if (en.team){                                                        // 팀: 다 모았으면 합체 다시 보기, 아니면 누구를 모으면 되는지
    if (en.n){ tone(880, .1, 'sine', .1); openPetShow({ kind:'team', team:en.team }); return; }
    const tx = en.name + '. ' + t('team.need', { names:en.team.m.map(sp => t('pet.' + sp)).join(', ') }) + ' (' + en.tag + ')';
    $('#bookTip').textContent = tx; Voice.play('book', tx); sfx.tap(); return;
  }
  const text = en.n ? en.name + (en.tip ? '. ' + en.tip : '') : t('book.notYet');
  $('#bookTip').textContent = text; Voice.play('book', text);
  if (en.n){ tone(880, .1, 'sine', .1); c.classList.remove('shake'); } else sfx.nope();
});
$('#bookBtn').addEventListener('click', () => { sfx.tap(); bookTab = 'boss'; $('#bookTip').textContent = ''; renderBook(); show('book'); });

// ---------- 연속 기록 불꽃 · 지킴이 방석 ----------
const SHIELD_SVG = stickerSvg('<svg viewBox="0 0 64 48" width="72" height="54"><rect x="4" y="12" width="56" height="30" rx="13" fill="#ff9ec0" stroke="#e86a98" stroke-width="3"/><path d="M14 27 H50" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/><circle cx="8" cy="14" r="5" fill="#ffd54a"/><circle cx="56" cy="14" r="5" fill="#ffd54a"/><circle cx="8" cy="40" r="5" fill="#ffd54a"/><circle cx="56" cy="40" r="5" fill="#ffd54a"/></svg>', 3);
$('#flameBtn').addEventListener('click', () => {
  ac(); sfx.tap();
  const n = streakDays(), sh = store.get('shields', 1), full = sh >= CONFIG.shieldMax, cost = CONFIG.shieldCost;
  const text = t('streak.info', { n, s:sh });
  Voice.play('streak', text);
  dialog({ icon:SHIELD_SVG, text, ok: full ? t('streak.close') : t('streak.buy', { cost }), cancel: full ? '' : t('streak.close'),
    onOk(){
      if (full) return;
      if (stars < cost){ sfx.nope(); toast(t('closet.needMore', { n:cost - stars })); return; }
      setStars(stars - cost); store.set('shields', sh + 1); sfx.buy(); toast(t('streak.bought'));
    } });
});
const shieldUsed = autoShield();
if (shieldUsed) setTimeout(() => { toast(t('streak.saved')); Voice.play('streak', t('streak.saved')); }, 1400);

// ---------- 다음 대장 예고 (그림자) ----------
function nextBossInfo(){
  const now = new Date();
  if (slotOf(now) === 'am') return { b:bossFor(now, 'pm'), s:'pm' };
  const d = new Date(now); d.setDate(d.getDate() + 1); return { b:bossFor(d, 'am'), s:'am' };
}
// 완료 화면 아래 카드가 버튼에 가리지 않게 보이는 곳까지 스르륵
function revealNext(){ const sc = $('#done'); setTimeout(() => sc.scrollTo({ top:sc.scrollHeight, behavior:'smooth' }), 60); }
function showBossNext(speak){
  if (current !== 'done') return;
  const { b, s } = nextBossInfo();
  $('#bnArt').innerHTML = germSVG(b.col, b); $('#bnText').textContent = t('next.' + s);
  $('#bossNext').hidden = false; $('#nextRow').hidden = false; revealNext();
  if (speak) giftTimers.push(setTimeout(() => Voice.play('next', t('next.say.' + s)), 3600));
}

// ---------- 주말 이빨 요정 ----------
const FAIRY_SVG = stickerSvg('<svg viewBox="-40 -40 80 80" aria-hidden="true"><g opacity=".85"><ellipse cx="-14" cy="-10" rx="14" ry="9" fill="#d6f0ff" stroke="#9fd3ee" stroke-width="2" transform="rotate(-25 -14 -10)"/><ellipse cx="14" cy="-10" rx="14" ry="9" fill="#d6f0ff" stroke="#9fd3ee" stroke-width="2" transform="rotate(25 14 -10)"/></g>' +
  '<path d="M0 2 L-12 26 H12Z" fill="#ff9ec0"/><circle cy="-4" r="11" fill="#fff" stroke="#bfe3f7" stroke-width="2"/><circle cx="-4" cy="-5" r="1.8" fill="#24324a"/><circle cx="4" cy="-5" r="1.8" fill="#24324a"/>' +
  '<path d="M-3 0 Q0 3 3 0" stroke="#24324a" stroke-width="1.5" fill="none"/><ellipse cx="-7" cy="-1" rx="2.4" ry="1.4" fill="#ffb3c7"/><ellipse cx="7" cy="-1" rx="2.4" ry="1.4" fill="#ffb3c7"/>' +
  '<path d="M10 6 L24 -14" stroke="#e0a100" stroke-width="2.5"/><path d="M24 -22 l2.5 5.5 6 .5 -4.5 4 1.5 6 -5.5 -3 -5.5 3 1.5 -6 -4.5 -4 6 -.5z" fill="#ffd54a"/></svg>', 3);
function fairyFly(){
  const f = document.createElement('div'); f.className = 'fairy'; f.innerHTML = FAIRY_SVG; view.appendChild(f);
  setTimeout(() => f.remove(), 5800);
  [1568, 1760, 2093, 2637].forEach((fr, i) => tone(fr, .12, 'sine', .07, i * .12));
}

// ---------- 칭찬 도장 (부모님이 꾹 누르기) ----------
const esc = (x) => String(x).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
function stampSVG(){
  const txt = t('stamp.text'), wide = /[^\x00-\x7f]/.test(txt);
  const fs = Math.min(20, wide ? 86 / txt.length : 150 / txt.length);
  return `<svg viewBox="-60 -60 120 120" aria-hidden="true"><circle r="54" fill="#ffffffaa" stroke="#e8455f" stroke-width="6"/><circle r="45" fill="none" stroke="#e8455f" stroke-width="2.5"/>
      <path d="M0 -40 l5 10 11 1.5 -8 7.5 2 11 -10 -5.5 -10 5.5 2 -11 -8 -7.5 11 -1.5z" fill="#e8455f"/>
      <text y="14" text-anchor="middle" font-size="${fs.toFixed(1)}" fill="#e8455f">${esc(txt)}</text><path d="M-28 26 H28" stroke="#e8455f" stroke-width="2.5"/></svg>`;
}
function giveStamp(){
  stampDone = true;
  const btn = $('#stampBtn'); btn.classList.add('done'); btn.style.setProperty('--p', 1);
  const m = $('#stampMark'); m.innerHTML = stampSVG(); m.classList.remove('show'); void m.offsetWidth; m.classList.add('show');
  setTimeout(() => { tone(120, .15, 'triangle', .25); tone(90, .2, 'sine', .2, .03); buzz(70); confetti(40); }, 380);
  const R = CONFIG.reward; setStars(stars + R.stamp);
  $('#doneCount').textContent = stars;
  const pl = $('#donePill'); pl.classList.remove('bump'); void pl.offsetWidth; pl.classList.add('bump');
  const ul = $('#rwList'), row = document.createElement('li'); row.className = 'show lucky';
  row.innerHTML = `<span>${t('rw.stamp')}</span><b>+${R.stamp} ⭐</b>`; ul.insertBefore(row, ul.querySelector('.total'));
  const tb = ul.querySelector('.total b'); if (tb) tb.textContent = '+' + ((parseInt(tb.textContent.replace(/\D/g, ''), 10) || 0) + R.stamp) + ' ⭐';
  Habit.stamp();                                                              // v0.49.0 습관 엔진에 칭찬 도장 기록
  setTimeout(() => Voice.play('stamp', t('stamp.say')), 600);
}
(function(){
  const btn = $('#stampBtn'), HOLD = 900;
  let t0 = 0, rq = 0;
  const end = () => { cancelAnimationFrame(rq); if (!stampDone) btn.style.setProperty('--p', 0); };
  const tick = () => {
    const pr = Math.min(1, (Date.now() - t0) / HOLD); btn.style.setProperty('--p', pr.toFixed(3));
    if (pr >= 1){ end(); giveStamp(); return; }
    rq = requestAnimationFrame(tick);
  };
  btn.addEventListener('pointerdown', (e) => {
    if (stampDone || !giftAllDone || current !== 'done') return;
    e.preventDefault(); ac(); t0 = Date.now(); tone(440, .08, 'sine', .06); tick();
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(k => btn.addEventListener(k, end));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
})();

// ---------- 주간 기록 (부모님 설정) ----------
function renderWeek(){
  const L = store.get('log2', []), days = tList('week.days');
  let head = '<i></i>', am = `<b>${t('week.am')}</b>`, pm = `<b>${t('week.pm')}</b>`, n = 0, m = 0;
  const cell = (arr) => `<i>${arr.length ? (arr.some(e => e.st) ? '👍' : '✓') : '·'}</i>`;
  for (let k = 6; k >= 0; k--){
    const d = new Date(); d.setDate(d.getDate() - k);
    const es = L.filter(e => e.d === dkey(d));
    n += es.length; m += es.filter(e => e.st).length;
    head += `<i class="${k === 0 ? 'today' : ''}">${days[d.getDay()] || ''}<small>${d.getDate()}</small></i>`;
    am += cell(es.filter(e => e.s === 'am')); pm += cell(es.filter(e => e.s === 'pm'));
  }
  $('#weekBox').innerHTML = `<div class="wk">${head}</div><div class="wk">${am}</div><div class="wk">${pm}</div><p class="set-note">${t('week.sum', { n, k:streakDays(), m })}</p>`;
}

// ---------- 펫 방 ----------
const STARS_BG = (() => { let x = ''; for (let i = 0; i < 24; i++) x += `<circle cx="${(i * 73) % 388 + 6}" cy="${(i * 47) % 160 + 8}" r="${i % 3 ? 1.8 : 2.8}" fill="#fff6c2"/>`; return x; })();
const HEARTS_BG = (() => { let x = ''; for (let i = 0; i < 14; i++) x += `<path transform="translate(${(i * 61) % 372 + 14} ${(i * 37) % 146 + 14}) scale(.7)" d="M0 6 C-10 -4 -4 -12 0 -6 C4 -12 10 -4 0 6Z" fill="#ffb3cf"/>`; return x; })();
const ROOM = {
  wall_sky:     { slot:'wall', cost:0, svg:'<rect width="400" height="176" fill="#dff1ff"/>' +
    '<g fill="#fff" transform="translate(178 52) scale(.9)"><ellipse rx="30" ry="11"/><circle cx="-12" cy="-6" r="11"/><circle cx="8" cy="-9" r="14"/></g>' +
    '<g fill="#fff" transform="translate(262 128) scale(.75)"><ellipse rx="30" ry="11"/><circle cx="-12" cy="-6" r="11"/><circle cx="8" cy="-9" r="14"/></g>' },
  wall_stars:   { slot:'wall', cost:5, svg:'<rect width="400" height="176" fill="#33427a"/><g data-noink="1">' + STARS_BG + '</g>' },
  wall_hearts:  { slot:'wall', cost:4, svg:'<rect width="400" height="176" fill="#ffe8f1"/><g data-noink="1">' + HEARTS_BG + '</g>' },
  wall_stripes: { slot:'wall', cost:4, svg:'<rect width="400" height="176" fill="#fff6d6"/><g data-noink="1">' + Array.from({ length:10 }, (_, i) => `<rect x="${i * 40 + 10}" width="18" height="176" fill="#ffe7a3"/>`).join('') + '</g>' },
  win_round:    { slot:'win', cost:3, box:'270 10 100 100', svg:'<circle cx="320" cy="60" r="38" fill="#fff"/><circle cx="320" cy="60" r="31" fill="#9fd8ff"/><circle cx="333" cy="47" r="8" fill="#ffe680"/><path d="M320 29 V91 M289 60 H351" stroke="#fff" stroke-width="5"/>' },
  poster:       { slot:'poster', cost:3, box:'30 14 90 72', svg:'<rect x="38" y="20" width="74" height="58" rx="6" fill="#fff" stroke="#e3d5b5" stroke-width="3"/><g fill="none" stroke-width="6"><path d="M50 68 A25 25 0 0 1 100 68" stroke="#ff7a7a"/><path d="M57 68 A18 18 0 0 1 93 68" stroke="#ffd54a"/><path d="M64 68 A11 11 0 0 1 86 68" stroke="#7fd6a0"/></g>' },
  lamp_star:    { slot:'lamp', cost:4, box:'166 0 68 78', svg:'<path d="M200 0 V30" stroke="#8a7a66" stroke-width="2.5"/><path d="M200 26 l7 14 15 2 -11 10 3 15 -14 -7 -14 7 3 -15 -11 -10 15 -2z" fill="#ffe066" stroke="#e0a100" stroke-width="2" stroke-linejoin="round"/>' },
  rug_round:    { slot:'rug', cost:4, box:'100 192 200 64', svg:'<ellipse cx="200" cy="224" rx="96" ry="24" fill="#ffb3c7"/><ellipse cx="200" cy="224" rx="72" ry="16" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="8 8"/>' },
  rug_rainbow:  { slot:'rug', cost:6, box:'100 192 200 64', svg:'<ellipse cx="200" cy="224" rx="98" ry="26" fill="#ff9e9e"/><ellipse cx="200" cy="224" rx="80" ry="20" fill="#ffd27a"/><ellipse cx="200" cy="224" rx="60" ry="14" fill="#a8e6a0"/><ellipse cx="200" cy="224" rx="40" ry="9" fill="#9fd3ff"/>' },
  bed_basket:   { slot:'bed', cost:5, box:'14 166 130 84', svg:'<ellipse cx="78" cy="214" rx="58" ry="20" fill="#c48a52"/><path d="M20 206 Q78 250 136 206 L132 222 Q78 256 24 222Z" fill="#a8703c"/><ellipse cx="78" cy="208" rx="48" ry="13" fill="#ffe1ea"/>' },
  bed_cloud:    { slot:'bed', cost:7, box:'14 160 130 84', svg:'<g fill="#fff" stroke="#cfe6f7" stroke-width="3"><ellipse cx="78" cy="216" rx="60" ry="18"/><circle cx="46" cy="202" r="18"/><circle cx="78" cy="194" r="24"/><circle cx="110" cy="202" r="18"/></g><ellipse cx="78" cy="214" rx="50" ry="10" fill="#dff1ff"/>' },
  toy_ball:     { slot:'toy', cost:3, box:'282 202 46 46', svg:'<circle cx="305" cy="226" r="16" fill="#ff7a7a"/><path d="M289 226 Q305 214 321 226" stroke="#fff" stroke-width="4" fill="none"/><path d="M291 233 Q305 244 319 233" stroke="#ffd54a" stroke-width="4" fill="none"/>' },
  toy_blocks:   { slot:'toy', cost:4, box:'276 186 70 62', svg:'<rect x="282" y="218" width="26" height="26" rx="4" fill="#7fc8f2"/><rect x="312" y="218" width="26" height="26" rx="4" fill="#ffd54a"/><rect x="297" y="192" width="26" height="26" rx="4" fill="#ff9ec0"/><g fill="#fff"><circle cx="295" cy="231" r="5"/><path d="M325 225 l-6 11 h12z"/><rect x="305" y="200" width="10" height="10" rx="2"/></g>' },
  toy_duck:     { slot:'toy', cost:4, box:'276 190 68 58', svg:'<ellipse cx="306" cy="232" rx="24" ry="13" fill="#ffd54a"/><circle cx="318" cy="208" r="12" fill="#ffd54a"/><path d="M329 208 L340 211 L329 214Z" fill="#ff9a3d"/><circle cx="321" cy="205" r="2.2" fill="#24324a"/><path d="M290 228 Q300 222 308 230" stroke="#e0b000" stroke-width="2.5" fill="none"/>' },
  plant_pot:    { slot:'plant', cost:3, box:'334 112 60 96', svg:'<path d="M348 170 H384 L380 204 H352Z" fill="#e8885a"/><rect x="345" y="164" width="42" height="9" rx="3" fill="#d06f40"/><path d="M366 164 Q362 140 350 132 M366 164 Q368 136 380 126" stroke="#4fae5a" stroke-width="4" fill="none"/><circle cx="350" cy="130" r="8" fill="#ff7aa8"/><circle cx="381" cy="124" r="8" fill="#ffd54a"/><circle cx="366" cy="140" r="7" fill="#b48cff"/>' },
  plant_cactus: { slot:'plant', cost:3, box:'334 112 60 96', svg:'<path d="M350 176 H382 L378 204 H354Z" fill="#e8885a"/><rect x="358" y="128" width="16" height="50" rx="8" fill="#5cc46a"/><path d="M360 158 H350 Q346 158 346 152 V142" stroke="#5cc46a" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M372 150 H382 Q386 150 386 144 V136" stroke="#5cc46a" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="366" cy="126" r="4" fill="#ff7aa8"/>' }
};
Object.entries(RES.roomItems || {}).forEach(([id, v]) => {     // resources.js 로 펫 방 물건 추가
  ROOM[id] = v;
  Object.entries(v.names || {}).forEach(([c, x]) => { if (packs[c]) packs[c].strings['room.' + id] = x; });
});
const ROOM_ORDER = ['wall', 'floor', 'win', 'poster', 'lamp', 'rug', 'bed', 'plant', 'toy'];
const FLOOR = '<rect y="172" width="400" height="88" fill="#f0d2a8"/><rect data-noink="1" y="172" width="400" height="7" fill="#e3bf92"/><g data-noink="1" stroke="#ddb88a" stroke-width="2">' +
  Array.from({ length:5 }, (_, i) => `<path d="M0 ${196 + i * 16} H400"/>`).join('') + '</g>';
let roomOwned = store.get('roomOwned', ['wall_sky']), roomOn = store.get('roomOn', { wall:'wall_sky' });
// 방 물건 그림 (v0.20.2: 그림체 B 테두리). 벽지는 장면처럼, 나머지 물건은 둘레 전체에 테두리
const roomArt = (id) => { const it = ROOM[id]; if (!it) return ''; return it.slot === 'wall' ? inkScene(it.svg, 3.5) : stickered(it.svg, 4, it.outline !== false); };
const roomThumb = (id) => `<svg viewBox="${ROOM[id].box || '0 0 400 176'}" aria-hidden="true">${roomArt(id)}</svg>`;
let roomTab = 'friends', selPet = null;
const selectedPet = () => allPets().find(p => p.id === selPet) || null;
const roomBG = () => ROOM_ORDER.map(sl => sl === 'floor' ? inkScene(FLOOR, 3.5) : (roomOn[sl] && ROOM[roomOn[sl]] ? roomArt(roomOn[sl]) : (sl === 'wall' ? roomArt('wall_sky') : ''))).join('');
const eggNow = () => eggArt();
// ---------- 동물 집 (별로 짓기): 무리마다 사는 곳 + 꾸미기 ----------
// 의도: 모은 펫을 "보러 가는" 곳 + 큰 저금 목표. 값은 HABS.cost (resources.js habitats 로 바꿀 수 있음)
//       장면은 400×260. 펫은 10마리씩 두 줄(뒤 줄 작게), 넘기기 단추. 꾸미기는 집마다 3개 (켜고 끌 수 있음)
const grass = (pts, c) => `<g stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none">` + pts.map(([x, y]) => `<path d="M${x - 5} ${y} l-3 -9 M${x} ${y} l1 -12 M${x + 5} ${y} l4 -8"/>`).join('') + '</g>';
const flower = (x, y, c, r = 9) => '<g>' + [0, 72, 144, 216, 288].map(a => `<circle cx="${(x + Math.cos(a * Math.PI / 180) * r).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * r).toFixed(1)}" r="${r * .8}" fill="${c}"/>`).join('') + `<circle cx="${x}" cy="${y}" r="${r * .7}" fill="#ffd54a"/></g>`;
const cloud = (x, y, s = 1) => `<g fill="#fff" opacity=".9" transform="translate(${x} ${y}) scale(${s})"><ellipse rx="30" ry="11"/><circle cx="-12" cy="-6" r="11"/><circle cx="8" cy="-9" r="14"/></g>`;
const HABS = [
  { id:'safari', group:'land',    cost:30,  icon:'🦁', rows:[30, 3] },
  { id:'bug',    group:'bug',     cost:30,  icon:'🐞', rows:[30, 3] },
  { id:'bird',   group:'bird',    cost:40,  icon:'🐦', rows:[30, 3] },
  { id:'sea',    group:'sea',     cost:50,  icon:'🐠', rows:[44, 12] },
  { id:'swamp',  group:'reptile', cost:50,  icon:'🐊', rows:[30, 3] },
  { id:'castle', group:'legend',  cost:150, icon:'🏰', rows:[30, 3] }
];
const HAB_BG = {
  safari: '<rect width="400" height="260" fill="#ffe7b0"/><circle cx="330" cy="54" r="44" fill="#ffd54a" opacity=".3"/><circle cx="330" cy="54" r="30" fill="#ffd54a"/>' + cloud(110, 40, .8) +
    '<path d="M0 150 Q60 128 130 146 Q210 120 290 142 Q350 128 400 140 V260 H0Z" fill="#e9c77a"/><rect data-noink="1" y="176" width="400" height="84" fill="#f2d48a"/>' +
    '<path d="M78 178 Q82 140 72 118 M80 148 Q94 130 108 122" stroke="#8a5a32" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="80" cy="112" rx="52" ry="14" fill="#86c25e"/><ellipse cx="94" cy="104" rx="34" ry="10" fill="#9ad06e"/>' +
    '<path d="M238 166 Q240 146 234 134" stroke="#8a5a32" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="236" cy="130" rx="30" ry="9" fill="#86c25e"/>' +
    grass([[30, 204], [140, 238], [262, 214], [360, 244], [200, 196]], '#c9a54a'),
  bug: '<rect width="400" height="260" fill="#eafbe0"/>' + cloud(300, 40, .9) + '<rect y="160" width="400" height="100" fill="#9fdc7e"/><path data-noink="1" d="M0 162 Q100 150 200 162 T400 160" fill="none" stroke="#86c866" stroke-width="4"/>' +
    [[30, 70, '#ff9ec0'], [150, 92, '#b48cff'], [250, 80, '#ff8a6a'], [384, 100, '#8fd3ff']].map(([x, y, c]) =>
      `<path d="M${x} 170 V${y}" stroke="#5cb04a" stroke-width="5"/><ellipse cx="${x + 10}" cy="${(y + 170) / 2}" rx="11" ry="5" fill="#6cc46a" transform="rotate(-30 ${x + 10} ${(y + 170) / 2})"/>` + flower(x, y, c, 11)).join('') +
    '<rect x="114" y="140" width="12" height="22" rx="5" fill="#fff4e0"/><path d="M104 144 Q120 118 136 144Z" fill="#ff6b6b"/><circle cx="114" cy="136" r="3" fill="#fff"/><circle cx="126" cy="139" r="2.4" fill="#fff"/>' +
    grass([[60, 210], [190, 240], [300, 220], [370, 200]], '#6cbf55'),
  bird: '<rect width="400" height="260" fill="#dff4ff"/>' + cloud(220, 36) + cloud(320, 70, .7) +
    '<ellipse cx="90" cy="196" rx="170" ry="60" fill="#c8ecb8"/><ellipse cx="330" cy="200" rx="170" ry="62" fill="#b8e4a4"/><rect data-noink="1" y="196" width="400" height="64" fill="#a8dc8a"/>' +
    '<rect x="26" y="40" width="30" height="160" rx="8" fill="#a8703c"/><path d="M52 112 Q110 104 166 112" stroke="#a8703c" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<g fill="#6cc46a"><circle cx="22" cy="40" r="34"/><circle cx="64" cy="26" r="30"/><circle cx="44" cy="62" r="26"/><circle cx="150" cy="104" r="14"/></g><g fill="#84d07a"><circle cx="40" cy="30" r="18"/><circle cx="160" cy="98" r="8"/></g>' +
    '<rect x="374" y="80" width="18" height="120" rx="6" fill="#a8703c"/><g fill="#6cc46a"><circle cx="384" cy="70" r="30"/><circle cx="360" cy="90" r="20"/></g>' +
    grass([[120, 236], [240, 214], [320, 244]], '#7cc066'),
  sea: '<rect width="400" height="260" fill="#7fc8f2"/><rect width="400" height="110" fill="#a8dcfa"/><rect data-noink="1" y="70" width="400" height="60" fill="#94d2f6" opacity=".7"/>' +
    '<g fill="#fff" opacity=".13"><path d="M60 0 L104 0 L64 210 L20 210Z"/><path d="M220 0 L250 0 L230 200 L196 200Z"/><path d="M330 0 L370 0 L350 180 L316 180Z"/></g>' +
    '<path d="M0 216 Q100 200 200 212 T400 208 V260 H0Z" fill="#f4dfa8"/><g data-noink="1" fill="#e8cf90"><circle cx="70" cy="236" r="3"/><circle cx="240" cy="230" r="2.5"/><circle cx="330" cy="246" r="3"/></g>' +
    [[30, '#4fae5a'], [370, '#3f9a4a'], [250, '#5cb86a']].map(([x, c]) => `<path d="M${x} 224 Q${x - 12} 194 ${x + 2} 172 Q${x + 14} 150 ${x} 122" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('') +
    '<g data-noink="1" fill="none" stroke="#fff" stroke-width="2" opacity=".8"><circle cx="120" cy="60" r="5"/><circle cx="128" cy="40" r="3"/><circle cx="300" cy="90" r="6"/><circle cx="292" cy="66" r="3.5"/><circle cx="190" cy="30" r="4"/></g>',
  swamp: '<rect width="400" height="260" fill="#e3f4e6"/><g fill="#9fcf9a"><circle cx="40" cy="120" r="50"/><circle cx="120" cy="110" r="40"/><circle cx="300" cy="116" r="46"/><circle cx="380" cy="106" r="40"/></g>' +
    '<path d="M0 148 Q200 136 400 148 V216 Q200 228 0 216Z" fill="#7cc2b0"/><path data-noink="1" d="M40 170 Q120 164 180 172 M230 190 Q300 184 370 192" stroke="#a8e0d0" stroke-width="3" fill="none"/>' +
    [[60, 182], [200, 160], [330, 176]].map(([x, y]) => `<path d="M${x} ${y} m-16 0 a16 7 0 1 0 32 0 a16 7 0 0 0 -14 -6 L${x} ${y}Z" fill="#5cb070"/>`).join('') +
    [[16, 150], [26, 140], [384, 152], [372, 142]].map(([x, y]) => `<path d="M${x} 214 V${y}" stroke="#6a9a4a" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="4" ry="9" fill="#8a5a32"/>`).join('') +
    '<path d="M0 210 Q200 200 400 210 V260 H0Z" fill="#b8a070"/>' + grass([[90, 236], [220, 246], [310, 230]], '#8aa860'),
  castle: '<rect width="400" height="260" fill="#8f7fe0"/><g data-noink="1"><rect y="60" width="400" height="200" fill="#a890ec"/><rect y="120" width="400" height="140" fill="#c8a4ee"/><rect y="170" width="400" height="90" fill="#e8b8ee"/></g>' +
    '<g data-noink="1" opacity=".9">' + STARS_BG + '</g>' +
    '<g fill="#ffffff55"><rect x="150" y="70" width="100" height="100"/><rect x="132" y="50" width="28" height="120"/><rect x="240" y="50" width="28" height="120"/><rect x="186" y="30" width="28" height="60"/>' +
    '<path d="M128 50 L146 22 L164 50Z M236 50 L254 22 L272 50Z M182 30 L200 0 L218 30Z"/></g>' +
    '<g fill="#fff"><ellipse cx="60" cy="236" rx="90" ry="34"/><ellipse cx="200" cy="246" rx="110" ry="30"/><ellipse cx="350" cy="234" rx="90" ry="36"/></g>' +
    '<g fill="#f6eaff"><ellipse cx="120" cy="222" rx="50" ry="16"/><ellipse cx="290" cy="224" rx="60" ry="16"/></g>'
};
const HAB_DECO = {
  safari: [
    { id:'hd_pond', cost:6, box:'84 194 152 40', svg:'<ellipse cx="160" cy="214" rx="72" ry="15" fill="#7fc8f2"/><ellipse cx="150" cy="210" rx="40" ry="6" fill="#bfe6ff" opacity=".8"/>' },
    { id:'hd_rock', cost:8, box:'262 104 132 78', svg:'<path d="M268 176 L282 132 Q300 112 334 118 L372 124 Q386 128 378 140 L350 146 L360 176Z" fill="#c8a070" stroke="#a8804e" stroke-width="3" stroke-linejoin="round"/><path d="M290 140 Q310 130 340 132" stroke="#e0bf90" stroke-width="4" fill="none" stroke-linecap="round"/>' },
    { id:'hd_balloon', cost:10, box:'168 14 72 104', svg:'<g transform="translate(108 -12)"><path d="M70 66 Q70 30 96 30 Q122 30 122 66 Q122 86 100 96 H92 Q70 86 70 66Z" fill="#ff7a7a"/><path d="M84 32 Q80 66 92 96 M108 32 Q112 66 100 96" stroke="#ffd54a" stroke-width="5" fill="none"/><path d="M92 96 L90 106 M100 96 L102 106" stroke="#8a5a32" stroke-width="2"/><rect x="86" y="106" width="20" height="13" rx="3" fill="#a8703c"/></g>' }
  ],
  bug: [
    { id:'hd_honey', cost:6, box:'50 112 60 62', svg:'<path d="M60 128 Q56 164 80 170 Q104 164 100 128Z" fill="#ffb347" stroke="#e0852e" stroke-width="3"/><rect x="57" y="120" width="46" height="10" rx="4" fill="#e0852e"/><path d="M64 130 Q68 144 72 132 Q77 148 83 131" fill="#ffd54a"/>' },
    { id:'hd_mushhouse', cost:10, box:'150 66 100 100', svg:'<rect x="182" y="116" width="36" height="46" rx="10" fill="#fff4e0" stroke="#e0c8a0" stroke-width="3"/><path d="M193 162 V142 Q200 134 207 142 V162Z" fill="#c48a52"/><circle cx="210" cy="128" r="5" fill="#8fd3ff" stroke="#e0c8a0" stroke-width="2"/>' +
      '<path d="M154 120 Q160 72 200 70 Q240 72 246 120Z" fill="#ff6b6b" stroke="#d94848" stroke-width="3" stroke-linejoin="round"/><g fill="#fff"><circle cx="176" cy="100" r="7"/><circle cx="204" cy="86" r="8"/><circle cx="228" cy="106" r="6"/></g>' },
    { id:'hd_sunflower', cost:8, box:'294 18 72 156', svg:'<path d="M330 172 V64" stroke="#5cb04a" stroke-width="6"/><ellipse cx="342" cy="120" rx="14" ry="6" fill="#6cc46a" transform="rotate(-30 342 120)"/>' +
      Array.from({ length:12 }, (_, k) => { const a = k * 30 * Math.PI / 180; return `<ellipse cx="${(330 + Math.cos(a) * 20).toFixed(1)}" cy="${(56 + Math.sin(a) * 20).toFixed(1)}" rx="9" ry="5" fill="#ffd54a" transform="rotate(${k * 30} ${(330 + Math.cos(a) * 20).toFixed(1)} ${(56 + Math.sin(a) * 20).toFixed(1)})"/>`; }).join('') +
      '<circle cx="330" cy="56" r="13" fill="#8a5a32"/>' }
  ],
  bird: [
    { id:'hd_birdhouse', cost:6, box:'270 68 60 112', svg:'<path d="M300 198 V118" stroke="#a8703c" stroke-width="6"/><rect x="282" y="92" width="36" height="32" rx="3" fill="#ff9e7a" stroke="#d9734f" stroke-width="2.5"/><path d="M275 97 L300 74 L325 97Z" fill="#d9734f"/><circle cx="300" cy="106" r="6" fill="#5a3a2a"/>' },
    { id:'hd_swing', cost:8, box:'94 108 56 62', svg:'<path d="M104 112 V160 M140 112 V160" stroke="#8a5a32" stroke-width="2.5"/><rect x="98" y="158" width="48" height="8" rx="3" fill="#ffcf5a" stroke="#e0a100" stroke-width="2"/>' },
    { id:'hd_rainbow', cost:12, box:'168 30 180 96', svg:'<g fill="none" stroke-width="9"><path d="M176 122 A80 80 0 0 1 336 122" stroke="#ff8a8a"/><path d="M185 122 A71 71 0 0 1 327 122" stroke="#ffd27a"/><path d="M194 122 A62 62 0 0 1 318 122" stroke="#a8e6a0"/><path d="M203 122 A53 53 0 0 1 309 122" stroke="#9fd3ff"/></g>' }
  ],
  sea: [
    { id:'hd_chest', cost:6, box:'298 174 64 56', svg:'<rect x="306" y="196" width="48" height="30" rx="4" fill="#a8703c" stroke="#7a4f28" stroke-width="3"/><path d="M306 200 Q330 176 354 200Z" fill="#c48a52" stroke="#7a4f28" stroke-width="3"/><rect x="326" y="200" width="8" height="10" rx="2" fill="#ffd54a"/><circle cx="316" cy="194" r="4" fill="#ffd54a"/><circle cx="342" cy="190" r="3" fill="#fff8b0"/>' },
    { id:'hd_coral', cost:8, box:'56 164 68 64', svg:'<path d="M90 222 Q86 196 70 186 M90 222 Q92 192 104 176 M90 208 Q100 200 114 198 M86 200 Q76 196 66 202" stroke="#ff7aa8" stroke-width="8" fill="none" stroke-linecap="round"/><g fill="#ffb3cf"><circle cx="70" cy="186" r="4"/><circle cx="104" cy="176" r="4"/><circle cx="114" cy="198" r="4"/></g>' },
    { id:'hd_sub', cost:12, box:'158 24 114 74', svg:'<path d="M220 40 V30 H232" stroke="#9aa8bd" stroke-width="3" fill="none"/><rect x="206" y="40" width="24" height="18" rx="5" fill="#ffd54a" stroke="#e0a100" stroke-width="3"/><ellipse cx="220" cy="72" rx="44" ry="20" fill="#ffd54a" stroke="#e0a100" stroke-width="3"/>' +
      '<g fill="#8fd3ff" stroke="#e0a100" stroke-width="2"><circle cx="204" cy="72" r="7"/><circle cx="222" cy="72" r="7"/><circle cx="240" cy="72" r="7"/></g><path d="M176 72 l-12 -11 v22z" fill="#9aa8bd"/>' }
  ],
  swamp: [
    { id:'hd_lotus', cost:6, box:'72 154 64 40', svg:'<ellipse cx="104" cy="182" rx="26" ry="8" fill="#4fa860"/>' + [-2, -1, 0, 1, 2].map(k => `<ellipse cx="${104 + k * 6}" cy="170" rx="5" ry="11" fill="#ff9ec0" stroke="#e86a98" stroke-width="1.2" transform="rotate(${k * 22} ${104 + k * 6} 178)"/>`).join('') + '<circle cx="104" cy="174" r="4" fill="#ffd54a"/>' },
    { id:'hd_log', cost:8, box:'224 156 128 38', svg:'<rect x="230" y="166" width="110" height="20" rx="10" fill="#a8703c" stroke="#7a4f28" stroke-width="3"/><ellipse cx="338" cy="176" rx="6" ry="10" fill="#d8a870" stroke="#7a4f28" stroke-width="2"/><path d="M250 172 H290 M270 180 H316" stroke="#8a5a32" stroke-width="2"/><path d="M262 166 q4 -10 10 -6" stroke="#5cb070" stroke-width="3" fill="none"/>' },
    { id:'hd_fireflies', cost:10, outline:false, box:'40 24 330 110', svg:'<g class="glow">' + [[60, 60], [110, 40], [160, 80], [220, 50], [270, 90], [320, 44], [350, 100], [190, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff6a0" opacity=".35"/><circle cx="${x}" cy="${y}" r="3.5" fill="#fff6a0"/>`).join('') + '</g>' }
  ],
  castle: [
    { id:'hd_moon', cost:10, box:'34 12 90 90', svg:'<path d="M80 18 A40 40 0 1 0 120 76 A31 31 0 1 1 80 18Z" fill="#fff3a0"/><circle cx="70" cy="58" r="3" fill="#e0c860"/><path d="M60 72 Q68 78 76 72" stroke="#e0c860" stroke-width="2.5" fill="none" stroke-linecap="round"/>' },
    { id:'hd_rbridge', cost:12, box:'0 120 160 110', svg:'<g fill="none" stroke-width="10" stroke-linecap="round"><path d="M10 226 Q70 120 150 210" stroke="#ff8a8a"/><path d="M20 228 Q72 134 142 214" stroke="#ffd27a"/><path d="M30 230 Q74 148 134 218" stroke="#a8e6a0"/><path d="M40 232 Q76 162 126 222" stroke="#9fd3ff"/></g>' },
    { id:'hd_treasure', cost:15, box:'292 178 104 60', svg:'<g fill="#ffd54a" stroke="#e0a100" stroke-width="2"><ellipse cx="344" cy="226" rx="46" ry="12"/><circle cx="320" cy="214" r="8"/><circle cx="338" cy="206" r="8"/><circle cx="356" cy="212" r="8"/><circle cx="372" cy="218" r="7"/><circle cx="346" cy="196" r="7"/></g>' +
      '<path d="M300 210 l8 -12 l8 12 l-8 10Z" fill="#ff7aa8" stroke="#fff" stroke-width="1.5"/><path d="M372 200 l6 -9 l6 9 l-6 8Z" fill="#8fd3ff" stroke="#fff" stroke-width="1.5"/>' }
  ]
};
Object.entries(RES.habitats || {}).forEach(([id, v]) => {           // resources.js 로 동물 집 바꾸기 (cost, bg, deco)
  const h = HABS.find(x => x.id === id);
  if (h && v.cost) h.cost = v.cost;
  if (v.bg) HAB_BG[id] = v.bg;
  if (v.deco){
    HAB_DECO[id] = v.deco;
    v.deco.forEach(d => Object.entries(d.names || {}).forEach(([c, x]) => { if (packs[c]) packs[c].strings['hab.d.' + d.id] = x; }));   // 꾸미기 이름
  }
});
const DECO = {}; Object.entries(HAB_DECO).forEach(([hid, list]) => list.forEach(d => { DECO[d.id] = Object.assign({ hab:hid }, d); }));
let hab = store.get('hab', { built:[], deco:[], off:[] });
const habBuilt = (id) => hab.built.includes(id);
const saveHab = () => store.set('hab', hab);
const habOf = (id) => HABS.find(h => h.id === id);
const habPets = (h) => allPets().filter(p => ((PETS[p.sp] || {}).group || 'land') === h.group);
let roomHouse = 'home', habPage = 0;
const HAB_PAGE = 10;
const decoArt = (d) => stickered(d.svg, 4, d.outline !== false);          // v0.20.2: 그림체 B 테두리
const habBG = (id) => inkScene(HAB_BG[id] || '', 3.5);
const decoThumb = (d) => { const [x, y, w, h] = d.box.split(' ').map(Number), m = Math.max(w, h);    // 정사각형 칸에 맞게
  return `<svg viewBox="${x - (m - w) / 2} ${y - (m - h) / 2} ${m} ${m}" aria-hidden="true">${decoArt(d)}</svg>`; };
function habScene(h){
  const built = habBuilt(h.id);
  let s = `<svg viewBox="0 0 400 260" class="${built ? '' : 'hab-off'}" aria-hidden="true">${habBG(h.id)}` +
    (built ? (HAB_DECO[h.id] || []).filter(d => hab.deco.includes(d.id) && !hab.off.includes(d.id)).map(decoArt).join('') : '') + '</svg>';
  if (!built){
    return s + `<div class="hab-lock"><b>${h.icon} ${t('hab.' + h.id)}</b><span>${t('hab.who.' + h.id)}</span>
        <button class="hab-build">⭐ ${t('hab.build', { cost:h.cost })}</button>
        <button class="hab-goal ${goalHab() === h ? 'on' : ''}">${goalHab() === h ? t('hab.goalOn') : t('hab.goalBtn')}</button></div>`;
  }
  const ps = habPets(h), pages = Math.max(1, Math.ceil(ps.length / HAB_PAGE));
  habPage = Math.min(habPage, pages - 1);
  const pg = ps.slice(habPage * HAB_PAGE, habPage * HAB_PAGE + HAB_PAGE);
  const back = pg.slice(0, Math.ceil(pg.length / 2)), front = pg.slice(Math.ceil(pg.length / 2));
  const row = (list, bottom, w, z) => list.map((p, i) => {
    const left = (100 - list.length * w) / 2 + i * w;
    return `<button class="room-pet hab-p" data-pid="${p.id}" style="left:${left.toFixed(1)}%;bottom:${bottom}%;width:${w}%;z-index:${z};--bd:${(i * .23 % 1).toFixed(2)}s">${petArt(p)}</button>`;
  }).join('');
  s += row(back, h.rows[0], 16, 1) + row(front, h.rows[1], 18.5, 2);
  if (!ps.length) s += `<div class="room-empty">${t('hab.noPets')}</div>`;
  s += `<div class="hab-tag">${h.icon} ${t('hab.' + h.id)} · ${t('hab.count', { n:ps.length })}</div>`;
  if (pages > 1) s += `<button class="hab-nav prev" data-d="-1" aria-label="prev">‹</button><button class="hab-nav next" data-d="1" aria-label="next">›</button><div class="hab-pg">${habPage + 1} / ${pages}</div>`;
  return s;
}
function houseChips(){
  const g = goalHab();
  return `<div class="house-chips">` + [`<button class="h-chip ${roomHouse === 'home' ? 'on' : ''}" data-house="home">🏠 ${t('hab.home')}</button>`].concat(HABS.map(h =>
    `<button class="h-chip ${roomHouse === h.id ? 'on' : ''} ${habBuilt(h.id) ? '' : 'lock'}" data-house="${h.id}">${h.icon} ${t('hab.' + h.id)}${habBuilt(h.id) ? '' : ` <small>${g === h ? '🎯' : '⭐'}${h.cost}</small>`}</button>`)).join('') + '</div>';
}
function buildHab(h){
  if (habBuilt(h.id)) return;
  if (stars < h.cost){ sfx.nope(); const m = t('goal.left', { name:t('hab.' + h.id), n:h.cost - stars }); toast(m); Voice.play('goal', m); return; }
  dialog({ icon:`<div style="width:150px;height:98px;margin:auto;border-radius:14px;overflow:hidden"><svg viewBox="0 0 400 260" style="width:100%;height:100%">${habBG(h.id)}</svg></div>`,
    text:t('closet.buyQ', { cost:h.cost, item:t('hab.' + h.id) }), ok:t('hab.buildOk'), cancel:t('closet.buyCancel'),
    onOk(){
      if (habBuilt(h.id) || stars < h.cost) return;                    // v0.37.1 창이 떠 있는 동안 바뀌었으면
      setStars(stars - h.cost); hab.built.push(h.id); saveHab();
      if (store.get('goal', null) === h.id) store.set('goal', null);
      sfx.buy(); buzz([60, 40, 120]); confetti(80); habPage = 0; renderRoom(); refreshGoal();
      const r = $('#roomScene').getBoundingClientRect(); firework(r.left + r.width / 2, r.top + r.height * .4);
      const m = t('hab.built', { name:t('hab.' + h.id) }); toast(m); Voice.play('hab', m);
      $$('#roomScene .hab-p').forEach((b, i) => setTimeout(() => hopEl(b), 300 + i * 90));
    } });
}

// ---------- 저금 목표: 아직 안 지은 동물 집 (직접 고르거나, 가장 싼 집) ----------
// 의도: "목표까지 ⭐ 23/60" 처럼 모으는 재미. 다 지으면 막대가 사라짐 (다음 큰 목표를 추가할 자리)
function goalHab(){
  const left = HABS.filter(h => !habBuilt(h.id)); if (!left.length) return null;
  const g = store.get('goal', null);
  return left.find(h => h.id === g) || left.slice().sort((a, b) => a.cost - b.cost)[0];
}
const goalText = (g) => stars >= g.cost ? t('goal.ready', { name:t('hab.' + g.id) }) : t('goal.left', { name:t('hab.' + g.id), n:g.cost - stars });
HAB_READY = true;
function refreshGoal(){
  if (!HAB_READY) return;
  const g = goalHab(), bar = $('#goalBar'), pill = $('#goalPill');
  bar.hidden = !g; pill.classList.toggle('ready', !!g && stars >= g.cost);
  if (!g) return;
  $('#goalFill').style.width = Math.min(100, stars / g.cost * 100).toFixed(1) + '%';
  $('#goalIc').textContent = g.icon;
}
$('#goalPill').addEventListener('click', () => {
  ac(); const g = goalHab();
  if (!g){ sfx.tap(); return; }
  const m = goalText(g); toast(m); Voice.play('goal', m); tone(880, .1, 'sine', .1);
  if (stars >= g.cost){ roomTab = 'room'; roomHouse = g.id; selPet = null; renderRoom(); show('room'); }
});
const eggName = () => t(petState.egg.special ? 'pet.specialEgg' : petState.egg.feat ? 'pet.featEgg' : 'pet.eggCard');
function renderRoom(){
  const pets = allPets(), pal = companion(), L = lazyArt();
  if ((selPet !== 'egg' && !selectedPet()) || (selPet === 'egg' && !petState.egg)) selPet = pal ? pal.id : (petState.egg ? 'egg' : null);
  if (roomHouse !== 'home' && !habOf(roomHouse)) roomHouse = 'home';
  $('#roomTabs').innerHTML = ['friends', 'dress', 'room'].map(k => `<button class="tab ${k === roomTab ? 'active' : ''}" data-tab="${k}">${t('ptab.' + k)}</button>`).join('');
  const sp = selectedPet(), house = roomTab === 'room' && roomHouse !== 'home' ? habOf(roomHouse) : null;
  // 위쪽 장면: 방 꾸미기 = 방 전체(또는 동물 집)와 펫들 / 나머지 = 고른 펫을 크게
  let scene = `<svg viewBox="0 0 400 260" aria-hidden="true">${roomBG()}</svg>`;
  if (house){
    scene = habScene(house);
  } else if (roomTab === 'room'){
    const show = (pal ? [pal] : []).concat(pets.filter(p => p !== pal).reverse()).slice(0, 6);     // 데리고 다니는 펫 + 최근 친구들 (최대 6)
    const spots = show.map((p, i) => `<button class="room-pet" data-pid="${p.id}">${petArt(p)}</button>`);
    if (petState.egg) spots.push(`<button class="room-pet" data-pid="egg">${eggNow()}</button>`);
    const w = Math.min(22, 96 / Math.max(1, spots.length)), x0 = 50 - spots.length * w / 2;
    scene += spots.map((h, i) => h.replace('class="room-pet"', `class="room-pet" style="left:${(x0 + i * w).toFixed(1)}%;width:${w.toFixed(1)}%"`)).join('');
  } else if (roomTab === 'dress' && !sp){
    scene += `<div class="room-empty">${t('pet.noPet')}</div>`;
  } else {
    const art = sp ? petArt(sp) : (selPet === 'egg' ? eggNow() : '');
    if (art) scene += `<button class="room-pet big" data-pid="${sp ? sp.id : 'egg'}">${art}</button>`;
    if (sp) scene += `<div class="stage-name">${esc(petName(sp))} <small>${esc(petTitle(sp))} · ${t('pet.stage' + sp.st)}</small></div>`;
    else if (selPet === 'egg') scene += `<div class="stage-name">${eggName()} <small>🥚 ${petState.egg.p}/${PET_CFG.hatch}</small></div>`;
  }
  if (!pets.length && roomTab !== 'friends' && !house) scene += `<div class="room-empty">${t('room.empty')}</div>`;
  $('#roomScene').innerHTML = scene;
  $('#roomScene').classList.toggle('hab', !!house);
  // 도구 줄
  let tools = '';
  if (roomTab === 'friends' && sp){
    const on = pal && pal.id === sp.id, lv = loveOf(sp), fed = sp.fed === todayKey();
    tools = `<input id="petNameIn" maxlength="10" value="${esc(sp.name || '')}" placeholder="${esc(petName(sp))}" aria-label="${esc(t('pet.namePh'))}">` +
            `<button class="pal-btn ${on ? 'on' : ''}" id="palBtn">${on ? '✓ ' + t('pet.palNow') : '🐾 ' + t('pet.palBtn')}</button>` +
            `<div class="treat-row">${heartsHTML(sp)}` +
            (lv >= LOVE_MAX ? `<button class="treat-btn trick" id="treatBtn">✨ ${t('pet.trickBtn')}</button>`
              : fed ? `<span class="treat-wait">${t('pet.fedToday')}</span>` : `<button class="treat-btn" id="treatBtn">${t('pet.treat')}</button>`) +
            `<small>${lv >= LOVE_MAX ? t('trick.' + trickOf(sp)) : t('pet.loveHint')}</small></div>` +
            (sp.st >= 2 ? `<div class="look-row"><span>${t('pet.look')}</span>${[1, 2, 3].map(n => n <= sp.st
                  ? `<button class="look-btn ${shownSt(sp) === n ? 'on' : ''}" data-look="${n}">${petArt(Object.assign({}, sp, { look:n, st:n === 3 ? sp.st : Math.max(n, 1), wear:{} }))}<b>${t('look.' + n)}</b></button>`
                  : `<span class="look-btn lock">🔒<b>${t('look.' + n)}</b></span>`).join('')}</div>` : '');
  } else if (roomTab === 'friends' && selPet === 'egg'){
    tools = `<p>${eggLine()}</p>`;
  } else if (roomTab === 'dress' && pets.length > 1){
    tools = `<div class="pet-strip">${pets.map(p => `<button class="${sp && sp.id === p.id ? 'on' : ''}" data-pid="${p.id}">${L.ph(() => petArt(p))}</button>`).join('')}</div>`;
  } else if (roomTab === 'room'){
    tools = houseChips();
  }
  $('#petTools').innerHTML = tools; $('#petTools').hidden = !tools; L.watch($('#petTools'));
  // 아래 목록
  let grid = '';
  if (roomTab === 'friends'){
    grid = pets.map(p => {
      const on = pal && pal.id === p.id, lv = loveOf(p);
      return `<button class="item ${sp && sp.id === p.id ? 'equipped' : ''} ${isRare(p) ? 'shinyc' : ''}" data-pid="${p.id}">
          ${lv ? `<i class="lv">${lv >= LOVE_MAX ? '✨' : '♥' + lv}</i>` : ''}
          <div class="thumb">${L.ph(() => petArt(p))}</div><span class="name">${esc(petName(p))}</span><span class="tag">${on ? '🐾 ' + t('pet.palNow') : t('pet.stage' + p.st)}</span></button>`;
    }).join('');
    if (petState.egg) grid += `<button class="item egg-card ${selPet === 'egg' ? 'equipped' : ''}" data-pid="egg"><div class="thumb">${eggNow()}</div>
          <span class="name">${eggName()}</span><span class="tag">🥚 ${petState.egg.p}/${PET_CFG.hatch}</span></button>`;
  } else if (roomTab === 'dress'){
    if (sp) grid = Object.keys(PET_ITEMS).map(id => {
      const it = PET_ITEMS[id], has = petOwned.includes(id), on = (sp.wear || {})[it.slot] === id;
      return `<button class="item ${on ? 'equipped' : ''} ${has ? '' : 'locked'}" data-id="${id}">
          <div class="thumb">${petArt(Object.assign({}, sp, { st:3, wear:{ [it.slot]:id } }))}</div>
          <span class="name">${t('pitem.' + id)}</span><span class="tag">${on ? t('closet.wearing') : has ? t('closet.owned') : '⭐ ' + it.cost}</span></button>`;
    }).join('');
  } else if (house){
    const built = habBuilt(house.id);
    grid = (HAB_DECO[house.id] || []).map(d => {
      const has = hab.deco.includes(d.id), on = has && !hab.off.includes(d.id);
      return `<button class="item ${on ? 'equipped' : ''} ${has ? '' : 'locked'}" data-deco="${d.id}">
          <div class="thumb">${decoThumb(d)}</div>
          <span class="name">${t('hab.d.' + d.id)}</span><span class="tag">${on ? t('room.placed') : has ? t('closet.owned') : built ? '⭐ ' + d.cost : '🔒'}</span></button>`;
    }).join('');
  } else {
    const ids = Object.keys(ROOM).sort((a, b) => ROOM_ORDER.indexOf(ROOM[a].slot) - ROOM_ORDER.indexOf(ROOM[b].slot) || ROOM[a].cost - ROOM[b].cost);
    grid = ids.map(id => {
      const has = roomOwned.includes(id), on = roomOn[ROOM[id].slot] === id;
      return `<button class="item ${on ? 'equipped' : ''} ${has ? '' : 'locked'}" data-id="${id}">
          <div class="thumb">${roomThumb(id)}</div>
          <span class="name">${t('room.' + id)}</span><span class="tag">${on ? t('room.placed') : has ? t('closet.owned') : '⭐ ' + ROOM[id].cost}</span></button>`;
    }).join('');
  }
  $('#roomGrid').innerHTML = grid; L.watch($('#roomGrid'));
}
function roomPlace(id, on){
  const sl = ROOM[id].slot;
  if (on) roomOn[sl] = id; else if (sl !== 'wall') delete roomOn[sl];
  store.set('roomOn', roomOn); sfx.equip(); renderRoom();
}
const savePets = () => { store.set('pet', petState); renderPets(); };
function buyThing(card, cost, name, iconSVG, done){
  if (stars < cost){ sfx.nope(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); toast(t('closet.needMore', { n:cost - stars })); return; }
  dialog({ icon:`<div style="width:110px;height:84px;margin:auto">${iconSVG.replace('<svg ', '<svg style="width:100%;height:100%" ')}</div>`,
    text:t('closet.buyQ', { cost, item:name }), ok:t('closet.buyOk'), cancel:t('closet.buyCancel'),
    onOk(){ if (stars < cost){ sfx.nope(); toast(t('closet.needMore', { n:cost - stars })); return; } setStars(stars - cost); sfx.buy(); confetti(30); done(); } });
}
function pickPet(pid){
  selPet = pid; ac(); tone(784, .08, 'sine', .1);
  const p = selectedPet();
  if (p) Voice.play('pet.say', petName(p));
  renderRoom();
}
$('#roomTabs').addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (!b) return; roomTab = b.dataset.tab; sfx.tap(); renderRoom(); });
function feedPet(){
  const p = selectedPet(); if (!p) return;
  const stg = () => $('#roomScene .room-pet.big');
  if (loveOf(p) >= LOVE_MAX){ playTrick(stg(), p); const m = trickLine(p); toast(m); Voice.play('pet.say', m); return; }
  if (p.fed === todayKey()) return;
  if (stars < 1){ sfx.nope(); toast(t('closet.needMore', { n:1 })); return; }
  setStars(stars - 1); p.love = loveOf(p) + 1; p.fed = todayKey(); savePets();
  [523, 659, 784].forEach((f, i) => tone(f, .09, 'sine', .1, i * .1));                       // 냠냠
  renderRoom(); heartsBurst($('#roomScene'), 4);
  if (p.love >= LOVE_MAX){
    setTimeout(() => { playTrick(stg(), p); confetti(40); const m = t('pet.trickLearn', { name:petName(p), trick:t('trick.' + trickOf(p)) }); toast(m); Voice.play('pet.say', m); }, 450);
  } else { hopEl(stg()); const m = t('pet.yum') + ' ' + t('pet.loveUp', { name:petName(p), h:p.love }); toast(m); Voice.play('pet.say', m); }
}
function decoTap(id, card){
  const d = DECO[id]; if (!d) return;
  if (!habBuilt(d.hab)){ sfx.nope(); toast(t('hab.buildFirst')); Voice.play('hab', t('hab.buildFirst')); return; }
  if (!hab.deco.includes(id)) return buyThing(card, d.cost, t('hab.d.' + id), decoThumb(d), () => { hab.deco.push(id); saveHab(); renderRoom(); });
  hab.off = hab.off.includes(id) ? hab.off.filter(x => x !== id) : hab.off.concat(id); saveHab(); sfx.equip(); renderRoom();
}
$('#petTools').addEventListener('click', (e) => {
  const hc = e.target.closest('[data-house]');
  if (hc){                                                             // 집 고르기
    roomHouse = hc.dataset.house; habPage = 0; sfx.tap(); renderRoom();
    const h = habOf(roomHouse);
    Voice.play('hab', h ? t('hab.' + h.id) + '. ' + (habBuilt(h.id) ? t('hab.count', { n:habPets(h).length }) : t('hab.who.' + h.id)) : t('hab.home'));
    const on = $('#petTools .h-chip.on'); if (on) on.scrollIntoView({ inline:'center', block:'nearest' });
    return;
  }
  if (e.target.closest('#treatBtn')){ feedPet(); return; }
  const lb = e.target.closest('[data-look]');
  if (lb){                                                             // 모습 고르기 (자란 단계는 그대로)
    const p = selectedPet(), n = +lb.dataset.look; if (!p || n > p.st) return;
    if (n === p.st) delete p.look; else p.look = n;                    // 지금 단계 = 따로 기억 안 함 → 자라면 새 모습을 따라감
    savePets(); sfx.equip(); renderRoom(); renderPets();
    const msg = t('pet.lookSet', { name:petName(p), look:t('look.' + n) }); toast(msg); Voice.play('pet.say', msg);
    return;
  }
  const sb = e.target.closest('[data-pid]'); if (sb){ pickPet(sb.dataset.pid); return; }
  if (e.target.closest('#palBtn')){
    const p = selectedPet(); if (!p || petState.pal === p.id) return;
    petState.pal = p.id; savePets(); sfx.equip(); confetti(20);
    const msg = t('pet.palSet', { name:petName(p) }); toast(msg); Voice.play('pet.say', msg); renderRoom();
  }
});
$('#petTools').addEventListener('change', (e) => {
  if (e.target.id !== 'petNameIn') return;
  const p = selectedPet(); if (!p) return;
  p.name = e.target.value.trim().slice(0, 10); savePets(); renderRoom();
});
$('#roomGrid').addEventListener('click', (e) => {
  const card = e.target.closest('.item'); if (!card) return;
  if (roomTab === 'friends'){ pickPet(card.dataset.pid); return; }
  if (card.dataset.deco){ decoTap(card.dataset.deco, card); return; }
  const id = card.dataset.id;
  if (roomTab === 'dress'){
    const p = selectedPet(), it = PET_ITEMS[id]; if (!p || !it) return;
    const wearIt = () => { p.wear = Object.assign({}, p.wear, { [it.slot]:id }); savePets(); renderRoom(); };
    if (!petOwned.includes(id)) return buyThing(card, it.cost, t('pitem.' + id), petArt(Object.assign({}, p, { st:3, wear:{ [it.slot]:id } })),
      () => { petOwned.push(id); store.set('petOwned', petOwned); wearIt(); });
    p.wear = Object.assign({}, p.wear, { [it.slot]:p.wear && p.wear[it.slot] === id ? null : id });
    savePets(); sfx.equip(); renderRoom();
    return;
  }
  const it = ROOM[id]; if (!it) return;
  if (!roomOwned.includes(id)) return buyThing(card, it.cost, t('room.' + id), roomThumb(id), () => { roomOwned.push(id); store.set('roomOwned', roomOwned); roomPlace(id, true); });
  roomPlace(id, roomOn[it.slot] !== id);
});
$('#roomScene').addEventListener('click', (e) => {
  const h = habOf(roomHouse);
  if (e.target.closest('.hab-build') && h){ buildHab(h); return; }
  if (e.target.closest('.hab-goal') && h){ store.set('goal', h.id); sfx.equip(); refreshGoal(); renderRoom(); const m = t('goal.set', { name:t('hab.' + h.id) }) + ' ' + goalText(h); toast(m); Voice.play('goal', m); return; }
  const nv = e.target.closest('.hab-nav');
  if (nv && h){ const pages = Math.max(1, Math.ceil(habPets(h).length / HAB_PAGE)); habPage = (habPage + +nv.dataset.d + pages) % pages; sfx.tap(); renderRoom(); return; }
  const b = e.target.closest('.room-pet'); if (!b) return;
  const p = allPets().find(x => x.id === b.dataset.pid);
  if (p && loveOf(p) >= LOVE_MAX){ ac(); playTrick(b, p); const m = trickLine(p); toast(m); Voice.play('pet.say', m); return; }   // 재주
  ac(); hopEl(b); tone(784, .1, 'sine', .12); tone(1175, .12, 'sine', .1, .08);
  const text = p ? petName(p) + '! ' + t('pet.says') : eggLine();
  if (text){ toast(text); Voice.play('pet.say', text); }
});
$('#eggTest').addEventListener('click', () => {
  sfx.tap();
  const eg = newEgg(); eg.special = true; eg.sp = pick(legendIds); eg.p = PET_CFG.hatch - 1;     // 테스트: 다음 한 번에 태어나는 특별한 알
  petState.egg = eg; savePets(); toast(t('pet.eggSpecial', { n:1 }));
});
$('#roomBtn').addEventListener('click', () => { sfx.tap(); roomTab = 'friends'; roomHouse = 'home'; selPet = null; renderRoom(); show('room'); });
