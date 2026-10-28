'use strict';

/* =========================================================
   15. 첫 화면
      의도: 반짝이 + 알(왼쪽) + 데리고 다니는 펫(오른쪽). 별 옆 목표 막대, 오늘 몇 번 닦았는지, 메뉴 4개
      v0.49.0 모듈화: 반짝이 클럽 안내 · 설정 칸은 core/js/20-club.js, 아이 여럿은 20-kids.js, 웹 막기는 20-webgate.js
   ========================================================= */
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
$('#prepBack').addEventListener('click', () => { prepTimers.forEach(clearTimeout); prepTimers = []; Voice.stop(); sfx.tap(); show('home'); });
$$('.js-pause').forEach(b => b.addEventListener('click', () => togglePause()));
$$('.js-stop').forEach(b => b.addEventListener('click', askStop));
$('#homeBtn').addEventListener('click', () => { sfx.tap(); Voice.stop(); show('home'); });
$$('.soundBtn').forEach(b => b.addEventListener('click', toggleSound));

// 테스트 모드에서만: 버전 글자 5번 연속 누르면 별 +10 (출시 모드에선 아무 일 없음)
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
if (webBlocked()) webGateShow();
else {                                                                        // v0.31.0 아이 바꾼 뒤 · 앱을 처음 열 때
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
