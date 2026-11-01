'use strict';

/* =========================================================
   14-2. 알 · 펫 화면 (Let's Brush) — 첫 화면 알 · 펫 말풍선, 오늘의 퀴즈, 완료 화면 진행 카드, 부화 · 성장 · 변신 축하
      엔진(펫 상태 · 알 · 부화 · 팀 · 선물)은 core/js/14-eggs.js (v0.49.0 모듈화 3단계)
   ========================================================= */
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
['#brushC .c-rider'].forEach(sel => { const d = document.createElement('div'); d.className = 'pet-ride'; $(sel).appendChild(d); });
renderPets();
