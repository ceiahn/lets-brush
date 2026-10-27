'use strict';

/* =========================================================
   15. 첫 화면
      의도: 반짝이 + 알(왼쪽) + 데리고 다니는 펫(오른쪽). 별 옆 목표 막대, 오늘 몇 번 닦았는지, 메뉴 4개
   ========================================================= */
/* ---------- v0.32.0 반짝이 클럽: 부모님께 체험 안내 · 설정 칸 · 끝나기 전 알림 ---------- */
function subIntroOpen(){
  const c = subCfg(), d = c.trialDays, fp = Math.min(c.freePets, FREE_PET_ORDER.length);
  $('#subH').textContent = t('sub.introH', { d });
  $('#subList').innerHTML = [t('sub.p1', { pets:Object.keys(PETS).length, fp }), t('sub.p2', { isl:ISLANDS.length }), t('sub.p3'), t('sub.p4')].map(x => `<li>${esc(x)}</li>`).join('');
  $('#subFree').textContent = t('sub.free', { fp });
  $('#subConsent').textContent = t('sub.consent', { price:subPrice() });
  $('#subAgree').checked = false; $('#subStart').disabled = true; $('#subStart').textContent = t('sub.start', { d });
  $('#subLinks').innerHTML = legalHTML();
  $('#subIntro').classList.add('show');
}
const subIntroClose = () => { $('#subIntro').classList.remove('show'); store.set('subAsked', true); };
$('#subAgree').addEventListener('change', (e) => { $('#subStart').disabled = !e.target.checked; });
$('#subStart').addEventListener('click', () => {
  if (!$('#subAgree').checked){ toast(t('sub.needAgree')); return; }
  $('#subIntro').classList.remove('show');
  parentGate(async () => {                                                     // 결제 앞에는 늘 부모 확인 (아이 앱 규정)
    sfx.tap();
    if (await Billing.startTrial()){ store.set('subAsked', true); confetti(30); toast(t('sub.started', { d:subCfg().trialDays }), 3500); afterSubChange(); }
  });
});
$('#subLater').addEventListener('click', () => { sfx.tap(); subIntroClose(); });
function afterSubChange(){                                                     // 구독 상태가 바뀌면: 알 · 홈 · 설정 다시
  try{ if (!petState.egg) { petState.egg = newEgg(); store.set('pet', petState); renderPets(); } }catch(e){}
  if (current === 'settings') renderSettings();
  refreshHome();
}
// v0.33.0 약관 · 개인정보 링크: 앱 밖으로 나가는 링크라 부모 확인 뒤에 엶 (설정 안에서는 이미 확인함)
const legalHTML = () => { const c = subCfg(); const L = (u, k) => u ? `<a data-href="${esc(u + '#' + lang)}">${t(k)}</a>` : '';
  const mail = CONFIG.contact ? `<a data-href="mailto:${esc(CONFIG.contact)}">${t('sub.contact')}</a>` : '';
  return [L(c.privacy, 'sub.privacy'), L(c.terms, 'sub.terms'), mail].filter(Boolean).join(' · '); };
const openLegal = (u) => { if (/^mailto:/.test(u)){ location.href = u; return; } try{ window.open(u, '_blank', 'noopener'); }catch(e){ location.href = u; } };
$('#legalLinks').addEventListener('click', (e) => { const a = e.target.closest('[data-href]'); if (a){ sfx.tap(); openLegal(a.dataset.href); } });
$('#subLinks').addEventListener('click', (e) => { const a = e.target.closest('[data-href]'); if (!a) return; const u = a.dataset.href; $('#subIntro').classList.remove('show'); parentGate(() => { openLegal(u); subIntroOpen(); }); });
function renderSub(){
  const c = subCfg(), card = $('#subCard'), st = subState();
  card.hidden = !c.on;
  if (TEST_MODE) $('#subSim').textContent = t('sub.devSim', { s:t(store.get('subSim', false) ? 'sub.on' : 'sub.off') });
  if (!c.on) return;
  $('#subSt').textContent = st.kind === 'trial' ? t('sub.stTrial', { d:st.left }) : st.kind === 'active' ? t('sub.stActive') : st.kind === 'free' ? t('sub.stFree') : t('sub.stNone');
  $('#subPerks').textContent = [t('sub.p1', { pets:Object.keys(PETS).length, fp:Math.min(c.freePets, FREE_PET_ORDER.length) }), t('sub.p2', { isl:ISLANDS.length }), t('sub.p3'), t('sub.p4')].join(' · ');
  const go = $('#subGo');
  go.hidden = st.kind === 'active' || st.kind === 'trial';
  go.textContent = st.kind === 'none' ? t('sub.goTrial', { d:c.trialDays }) : t('sub.goSub', { price:subPrice() });
}
$('#subGo').addEventListener('click', async () => {                            // 설정 안 = 이미 부모 확인을 지남
  sfx.tap();
  if (subState().kind === 'none') return subIntroOpen();
  if (await Billing.subscribe()){ confetti(30); toast(t('sub.stActive')); afterSubChange(); }
});
$('#subRestore').addEventListener('click', async () => { sfx.tap(); toast(t(await Billing.restore() ? 'sub.restoreOk' : 'sub.restoreNone')); renderSub(); });
$('#subManage').addEventListener('click', () => { sfx.tap(); Billing.manage(); });
$('#subSim').addEventListener('click', () => { sfx.tap(); store.set('subSim', !store.get('subSim', false)); renderSub(); refreshHome(); });
$('#subEnd').addEventListener('click', () => { sfx.tap(); const s = store.get('sub', null); if (s && s.kind === 'trial'){ s.end = dayNum(new Date()); store.set('sub', s); } renderSub(); refreshHome(); });
$('#subAct').addEventListener('click', () => { sfx.tap(); store.set('sub', { kind:'active' }); afterSubChange(); });
$('#subReset').addEventListener('click', () => { sfx.tap(); ['sub', 'subAsked', 'subReminded'].forEach(k => store.del(k)); renderSub(); refreshHome(); });
/* v0.33.0 홈 화면에 추가 안내 (부모님께 한 번)
   의도: 기록은 폰 브라우저 안에만 있음. 아이폰 사파리는 홈 화면에 추가하지 않은 사이트의 저장 값을 오래 안 쓰면 지울 수 있음
   때: 브라우저로 열었고(홈 화면 앱 아님) · 양치한 날이 2일 이상 · 아직 안 물었을 때. 스토어 앱으로 포장하면 CONFIG.homeTip:false */
let installEv = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEv = e; });   // 안드로이드 크롬: "앱 설치" 창을 우리가 띄움
const isStandalone = () => { try{ return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }catch(e){ return false; } };
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
function homeTipLaunch(){
  if (CONFIG.homeTip === false || isStandalone() || !/^https?:/.test(location.protocol) || store.get('homeTip', false)) return false;
  if (new Set(log).size < 2) return false;
  store.set('homeTip', true);
  setTimeout(() => dialog({ icon:'📲', text:t(isIOS() ? 'home.tipIOS' : 'home.tipAnd'), ok:t(installEv ? 'home.tipInstall' : 'sub.ok'), cancel:t('home.tipLater'),
    onOk(){ if (installEv){ try{ installEv.prompt(); }catch(e){} installEv = null; } } }), 800);
  return true;
}
function subLaunch(){                                                          // 앱을 열 때: 처음이면 체험 안내, 끝나기 2일 전이면 알림 (부모님께)
  const c = subCfg(), st = subState();
  if (!c.on) return false;
  if (st.kind === 'none' && !store.get('subAsked', false)){ setTimeout(subIntroOpen, 500); return true; }
  const s = store.get('sub', null);
  if (st.kind === 'trial' && st.left <= 2 && s && store.get('subReminded', null) !== s.start){
    store.set('subReminded', s.start);
    setTimeout(() => dialog({ icon:'👨‍👩‍👧', text:t('sub.remind', { d:st.left, price:subPrice() }), ok:t('sub.ok'), cancel:t('sub.manage'), onCancel(){ Billing.manage(); } }), 700);
    return true;
  }
  return false;
}

/* ---------- v0.31.0 아이 여럿: 고르기 · 추가 · 지우기 ----------
   의도: 아이가 둘 이상이면 앱을 열 때 "누가 닦을까요?" 로 먼저 고름 (한 번 고르면 앱을 닫을 때까지 안 물음)
         추가 · 지우기는 설정 안 (부모 확인 뒤). 바꾸기는 아이도 할 수 있게 홈의 이름 단추로
   주의: 아이를 바꾸면 새로 읽음. 다시 읽은 뒤 할 일은 sessionStorage bj_after ('settings' = 설정 다시 열기, 'picked' = 이미 고름) */
const KID_AV = { 1:'🐻', 2:'🐰', 3:'🦊' };
const kidNameOf = (id) => store.getFor(id, 'kidName', '') || t('kids.n' + id);
const sess = { get(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }, set(k, v){ try{ sessionStorage.setItem(k, v); }catch(e){} } };
function kidSwitch(id, after){
  if (id === KID && !after) return;
  try{ localStorage.setItem('bj_kid', JSON.stringify(id)); }catch(e){}
  sess.set('bj_picked', '1'); sess.set('bj_toast', String(id));
  if (after) sess.set('bj_after', after);
  location.reload();
}
function kidPickOpen(){
  sfx.tap();
  $('#kidPickList').innerHTML = kidList().map(id =>
    `<button data-id="${id}" class="${id === KID ? 'on' : ''}"><span class="ka">${KID_AV[id]}</span><span>${esc(kidNameOf(id))}</span><span class="ks">⭐ ${store.getFor(id, 'stars', CONFIG.firstGiftStars)}</span></button>`).join('');
  $('#kidPick').classList.add('show');
}
$('#kidPickList').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  sfx.tap(); sess.set('bj_picked', '1'); $('#kidPick').classList.remove('show');
  kidSwitch(+b.dataset.id);
});
$('#kidChip').addEventListener('click', kidPickOpen);
function kidRefresh(){
  const many = kidList().length > 1, chip = $('#kidChip');
  chip.hidden = !many;
  if (many) chip.textContent = `${KID_AV[KID]} ${kidNameOf(KID)} ▾`;
}
function renderKids(){
  const list = kidList();
  $('#kidRows').innerHTML = list.map(id =>
    `<div class="kid-row ${id === KID ? 'on' : ''}" data-id="${id}"><span class="ka">${KID_AV[id]}</span><span class="kn">${esc(kidNameOf(id))}</span>` +
    (id === KID ? `<small>${t('kids.now')}</small>` : '') +
    (list.length > 1 ? `<button class="kd" data-del="${id}">${t('kids.del')}</button>` : '') + `</div>`).join('');
  $('#kidAdd').hidden = list.length >= KID_MAX;
}
$('#kidRows').addEventListener('click', (e) => {
  const del = e.target.closest('[data-del]');
  if (del){
    const id = +del.dataset.del; sfx.tap();
    dialog({ text:t('kids.delQ', { name:kidNameOf(id) }), ok:t('kids.delOk'), cancel:t('kids.cancel'), onOk(){
      const rest = kidList().filter(x => x !== id);
      KID_KEYS.forEach(k => { try{ localStorage.removeItem(kidKey(id, k)); }catch(e){} });
      try{ localStorage.setItem('bj_kids', JSON.stringify(rest)); }catch(e){}
      if (id === KID) kidSwitch(rest[0], 'settings'); else renderKids();
    } });
    return;
  }
  const row = e.target.closest('.kid-row'); if (!row) return;
  const id = +row.dataset.id; if (id === KID) return;
  sfx.tap(); kidSwitch(id, 'settings');
});
$('#kidAdd').addEventListener('click', () => {
  const list = kidList(); sfx.tap();
  if (list.length >= KID_MAX){ toast(t('kids.max')); return; }
  const id = [1, 2, 3].find(x => !list.includes(x));
  KID_KEYS.forEach(k => { try{ localStorage.removeItem(kidKey(id, k)); }catch(e){} });     // 혹시 남은 옛 값은 비우고 새로
  try{ localStorage.setItem('bj_kids', JSON.stringify(list.concat([id]).sort())); }catch(e){}
  sess.set('bj_added', '1');
  kidSwitch(id, 'settings');
});

function refreshHome(){
  if (typeof quizRefresh === 'function') quizRefresh();
  kidRefresh();
  refreshStars(); refreshGoal();
  const st = streakDays(), fb = $('#flameBtn');
  $('#flameN').textContent = st;
  fb.className = 'pill flame ' + (st === 0 ? 'off' : st >= 14 ? 'l3' : st >= 7 ? 'l2' : st >= 3 ? 'l1' : '');
  $('#mapBadge').textContent = mapLeft();
  const n = log.filter(k => k === todayKey()).length;
  $('#todayText').textContent = n === 1 && giftReady() ? t('home.twiceHint') : n ? t('home.todayCount', { n }) : t('home.todayNone');
}

/* ---------- 양치 전 준비: 치약 짜기 ---------- */
function prepSVG(kind){
  /* 실제 비율: 칫솔모 길이(약 2cm) = 91단위 → 1cm ≈ 45단위
     완두콩 지름 약 0.6cm ≈ 27단위 / 쌀알 약 0.5×0.2cm ≈ 22×9단위 (얇게 펴서) */
  const BX = 143, TOP = 40;      // 치약 놓는 곳 (칫솔모 가운데, 칫솔모 윗면)
  const paste = kind === 'rice'
    ? `<g class="paste"><ellipse cx="${BX}" cy="${TOP - 3}" rx="12" ry="4" fill="#f4fbff" stroke="#6cb8e0" stroke-width="2"/></g>`
    : `<g class="paste"><circle cx="${BX}" cy="${TOP - 12.5}" r="13.5" fill="#f4fbff" stroke="#6cb8e0" stroke-width="2"/>
           <ellipse cx="${BX - 5}" cy="${TOP - 18}" rx="4" ry="2.5" fill="#fff"/></g>`;
  // 같은 비율의 비교 그림 (칫솔 왼쪽 위)
  const ref = kind === 'rice'
    ? `<ellipse cx="96" cy="8" rx="11" ry="4.5" transform="rotate(-20 96 8)" fill="#fff" stroke="#c9b98f" stroke-width="2"/>`
    : `<circle cx="96" cy="6" r="13.5" fill="#7cc95a" stroke="#4f9a35" stroke-width="2"/><ellipse cx="91" cy="0" rx="4" ry="2.5" fill="#c8f0b0"/>`;
  return `
    <svg viewBox="74 -46 296 132" aria-hidden="true">${inkScene(`
      <rect x="196" y="56" width="143" height="24" rx="12" ${BF('bh')}/>
      <g transform="translate(0 68)">${bDeco(196, 339, 12)}</g>
      <rect x="251" y="56" width="9" height="24" ${BF('bs')}/><rect x="269" y="56" width="9" height="24" ${BF('bs')}/>
      <g transform="translate(326 56) scale(.75)">${topperOf(brush)}</g>
      <path d="M100 54 H196 V82 H100 Q84 82 84 68 Q84 54 100 54Z" style="fill:var(--bk);stroke:var(--bks)" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(k => `<rect x="${98 + k * 13}" y="40" width="10" height="16" rx="3" ${BF('bb')}/>`).join('')}
      ${paste}
      ${ref}
      <path data-noink="1" d="M112 12 Q124 22 ${BX - 16} ${TOP - 18}" stroke="#f0a500" stroke-width="2.5" fill="none" stroke-dasharray="4 4" stroke-linecap="round"/>
      <g transform="translate(-2 -26) rotate(-22 230 -10) scale(.85)"><g class="tube">
        <path d="M176 -10 L192 -18 L286 -24 Q300 -24 300 -10 V2 Q300 16 286 16 L192 10 L176 2Z" fill="#fff" stroke="#9fd3ee" stroke-width="3"/>
        <rect x="164" y="-11" width="14" height="14" rx="3" fill="#4fa3ff"/>
        <rect x="216" y="-12" width="56" height="17" rx="5" fill="#ff7aa8"/>
        <path d="M300 -24 V16" stroke="#9fd3ee" stroke-width="7"/>
      </g></g>`, 3)}
    </svg>`;
}
// 아래 표시 아이콘: 장면과 같은 단위(30×30)로 그리고, 실제 화면 크기도 장면 배율에 맞춤
function compareSVG(kind){
  return stickerSvg(kind === 'rice'
    ? `<svg viewBox="0 0 30 30"><ellipse cx="15" cy="15" rx="11" ry="4.5" transform="rotate(-20 15 15)" fill="#fff" stroke="#c9b98f" stroke-width="2"/></svg>`
    : `<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13.5" fill="#7cc95a" stroke="#4f9a35" stroke-width="2"/><ellipse cx="10" cy="9" rx="4" ry="2.5" fill="#c8f0b0"/></svg>`, 2);
}
function fitCompare(){
  const sv = $('#prepScene svg'), ic = $('#prepCompare svg');
  if (!sv || !ic) return;
  const px = sv.getBoundingClientRect().width / 296 * 30;   // 장면 viewBox 폭 296 기준, 30단위
  ic.style.width = ic.style.height = px.toFixed(1) + 'px';
}
window.addEventListener('resize', () => { if (current === 'prep') fitCompare(); });
function openPrep(){
  ac();
  const kind = childAge === 'u3' ? 'rice' : 'pea';
  $('#prepTitle').innerHTML = t('prep.title.' + kind).split('\n').map(x => x.replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]))).join('<br>');
  $('#prepScene').innerHTML = prepSVG(kind);
  $('#prepCompare').innerHTML = compareSVG(kind) + `<span>${t('prep.cmp.' + kind)}</span>`;
  requestAnimationFrame(fitCompare);
  $('#prepNote').textContent = t('prep.note');
  show('prep'); sfx.tap();
  setTimeout(() => { tone(420, .18, 'sine', .12); tone(300, .25, 'sine', .1, .15); }, 600);   // 치약 짜는 소리
  $('#prepTips').innerHTML = [
    ['paste', kind === 'rice'
      ? `<svg viewBox="0 0 44 44"><rect x="4" y="26" width="30" height="10" rx="5" fill="#fff" stroke="#bfe3f7" stroke-width="2"/>${[0,1,2,3].map(k => `<rect x="${8 + k * 6}" y="19" width="4" height="8" rx="1.5" fill="#3ccf9c"/>`).join('')}<ellipse cx="17" cy="18" rx="5" ry="2" fill="#f4fbff" stroke="#6cb8e0" stroke-width="1.5"/></svg>`
      : `<svg viewBox="0 0 44 44"><rect x="4" y="26" width="30" height="10" rx="5" fill="#fff" stroke="#bfe3f7" stroke-width="2"/>${[0,1,2,3].map(k => `<rect x="${8 + k * 6}" y="19" width="4" height="8" rx="1.5" fill="#3ccf9c"/>`).join('')}<circle cx="17" cy="14" r="5.5" fill="#f4fbff" stroke="#6cb8e0" stroke-width="1.5"/></svg>`],
    ['water', `<svg viewBox="0 0 44 44"><path d="M22 6 Q32 20 32 27 A10 10 0 0 1 12 27 Q12 20 22 6Z" fill="#8fd3ff" stroke="#4fa3ff" stroke-width="2"/><circle cx="22" cy="24" r="17" fill="none" stroke="#ff6b6b" stroke-width="3.5"/><path d="M10 36 L34 12" stroke="#ff6b6b" stroke-width="3.5" stroke-linecap="round"/></svg>`],
    ['spit', `<svg viewBox="0 0 44 44"><circle cx="16" cy="22" r="13" fill="#fff" stroke="#bfe3f7" stroke-width="2"/><circle cx="12" cy="19" r="1.8" fill="#24324a"/><circle cx="19" cy="19" r="1.8" fill="#24324a"/><ellipse cx="22" cy="27" rx="3" ry="2.5" fill="#8a2346"/><circle cx="31" cy="27" r="3" fill="#e9f8ff" stroke="#9fd3ee" stroke-width="1.5"/><circle cx="37" cy="25" r="2.2" fill="#e9f8ff" stroke="#9fd3ee" stroke-width="1.5"/><circle cx="35" cy="31" r="1.8" fill="#e9f8ff" stroke="#9fd3ee" stroke-width="1.5"/></svg>`]
  ].map(([k, ic]) => `<div class="prep-tip" data-tip="${k}">${stickerSvg(ic, 2.2)}<span>${t('prep.tip.' + k)}</span></div>`).join('');
  prepSpeak(kind);
}
// 치약 양 → 물 → 뱉기 순서로 이어서 읽고, 읽는 동안 해당 그림 카드를 강조
let prepTimers = [];
function prepSpeak(kind){
  prepTimers.forEach(clearTimeout); prepTimers = [];
  const lines = [['paste', 'prep.say.' + kind], ['water', 'prep.sayWater'], ['spit', 'prep.saySpit']];
  const end = (x) => /[.!?。！？]$/.test(x.trim()) ? x.trim() : x.trim() + '.';   // 문장마다 쉬어 읽게
  Voice.play('prep.all.' + kind, lines.map(([, k]) => end(t(k))).join(' '));
  const hi = (k) => $$('#prepTips .prep-tip').forEach(el => el.classList.toggle('on', el.dataset.tip === k));
  // 글자 수로 대략 읽는 시간을 나눠서 카드 강조 (목소리가 꺼져 있어도 순서대로 보여줌)
  let at = 0;
  lines.forEach(([k, key]) => {
    prepTimers.push(setTimeout(() => hi(k), at));
    at += Math.max(1400, t(key).length * 110);
  });
  prepTimers.push(setTimeout(() => hi(null), at + 400));
}
$('#prepListen').addEventListener('click', () => { sfx.tap(); prepSpeak(childAge === 'u3' ? 'rice' : 'pea'); });
$('#startBtn').addEventListener('click', () => { if (prepOn) openPrep(); else start(); });
$('#prepGo').addEventListener('click', () => { prepTimers.forEach(clearTimeout); start(); });
$('#prepBack').addEventListener('click', () => { Voice.stop(); sfx.tap(); show('home'); });
$$('.js-pause').forEach(b => b.addEventListener('click', () => togglePause()));
$$('.js-stop').forEach(b => b.addEventListener('click', askStop));
$('#homeBtn').addEventListener('click', () => { sfx.tap(); Voice.stop(); show('home'); });
$$('.soundBtn').forEach(b => b.addEventListener('click', toggleSound));

// 테스트용: 버전 글자 5번 연속 누르면 별 +10 (출시 전 삭제)
let verTaps = 0, verT = 0;
$('#ver').addEventListener('click', () => {
  verTaps++; clearTimeout(verT); verT = setTimeout(() => { verTaps = 0; }, 1500);
  if (TEST_MODE && verTaps >= 5){ verTaps = 0; setStars(stars + 10); toast(t('toast.testStars')); }
});

const devCard = $('.set-card.dev'); if (devCard) devCard.hidden = !TEST_MODE;   // 출시 모드에선 개발자 메뉴 숨김
refreshSoundIcons();
applyTech();
applyBrush();
applyLang();
kidRefresh();
const kidAddedNow = sess.get('bj_added');
{                                                                             // v0.31.0 아이 바꾼 뒤 · 앱을 처음 열 때
  const after = sess.get('bj_after'), tid = sess.get('bj_toast'), added = kidAddedNow;
  try{ sessionStorage.removeItem('bj_after'); sessionStorage.removeItem('bj_toast'); sessionStorage.removeItem('bj_added'); }catch(e){}
  if (after === 'settings'){ renderSettings(); show('settings'); }
  if (added) setTimeout(() => toast(t('kids.added')), 400);
  else if (tid) setTimeout(() => toast(t('kids.switched', { name:kidNameOf(KID) })), 400);
  else {                                                                      // 앱을 열 때 창은 하나만: 구독 안내 · 알림 → 누가 닦을까요? → 홈 화면 추가 안내
    const busy = subLaunch(), needPick = kidList().length > 1 && !sess.get('bj_picked');
    if (needPick && !busy) setTimeout(kidPickOpen, 300);
    else if (!busy) homeTipLaunch();
  }
}
if (testGift) setTimeout(() => toast(t('toast.testGift', { n:TEST_STARS })), 600);
else if (firstRun && !kidAddedNow) setTimeout(() => toast(t('toast.firstGift')), 600);
