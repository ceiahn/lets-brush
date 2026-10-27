'use strict';

/* =========================================================
   10. 이벤트 화면 효과
      의도: 눈 · 박쥐 · 꽃잎 같은 배경 효과 (양치 중엔 멈춰서 집중 방해 안 함)
   ========================================================= */
let fxTimer = null, fxType = null;
function setEffect(type){
  if (type === fxType) return;
  fxType = type; clearInterval(fxTimer); fxTimer = null; $('#fx').innerHTML = '';
  if (!type) return;
  const every = type === 'snow' ? 220 : type === 'balloon' ? 900 : 520;
  fxTimer = setInterval(() => spawnFx(type), every);
  for (let i = 0; i < 6; i++) spawnFx(type, true);
}
function spawnFx(type, early){
  const fx = $('#fx'); if (fx.childElementCount > 60 || document.hidden || document.body.classList.contains('brushing')) return;
  const p = document.createElement('div');
  p.className = 'fxp';
  const s = type === 'snow' ? 5 + Math.random() * 8 : 14 + Math.random() * 12;
  if (type === 'snow'){ p.classList.add('fx-snow'); p.style.width = p.style.height = s + 'px'; p.style.opacity = .6 + Math.random() * .4; }
  else if (type === 'petal'){ p.classList.add('fx-petal'); p.style.width = s * .7 + 'px'; p.style.height = s + 'px'; }
  else if (type === 'star'){ p.classList.add('fx-star'); p.textContent = '✦'; p.style.fontSize = s + 'px'; }
  else if (type === 'bat'){ p.textContent = '🦇'; p.style.fontSize = s + 'px'; p.style.opacity = .8; }
  else if (type === 'balloon'){ p.classList.add('fx-balloon'); p.style.background = ['#ff7aa8', '#ffd54a', '#3ccf9c', '#8fd3ff', '#b48cff'][Math.floor(Math.random() * 5)]; p.style.opacity = .85; }
  p.style.left = Math.random() * 100 + 'vw';
  p.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
  p.style.setProperty('--rot', (type === 'snow' ? 0 : Math.random() * 540 - 270) + 'deg');
  const dur = (type === 'snow' ? 7 : 9) + Math.random() * 5;
  p.style.animationDuration = dur + 's';
  if (early) p.style.animationDelay = (-Math.random() * dur) + 's';
  p.addEventListener('animationend', () => p.remove());
  fx.appendChild(p);
}

function refreshEvent(){
  const ev = activeEvent();
  const hb = $('#homeEvent'), cb = $('#closetEvent');
  if (ev){
    const nm = store.get('kidName', '');
    hb.hidden = false; hb.textContent = `${ev.icon} ${ev.id === 'birthday' && nm ? t('event.birthday.greetName', { name:nm }) : t('event.' + ev.id + '.greet')}`;
    cb.hidden = !eventLookOn;
    cb.textContent = t('closet.eventBanner', { icon:ev.icon, event:t('event.' + ev.id + '.name') });
  } else { hb.hidden = true; cb.hidden = true; }
  setEffect(ev ? ev.effect : null);
  applyLook();
}

/* =========================================================
   11. 별
      의도: 별은 유일한 화폐 (두 번째 화폐 만들지 않기로 합의). 별이 바뀌면 첫 화면 목표 막대도 같이 갱신
   ========================================================= */
var HAB_READY = false;                                // 동물 집 코드가 준비되면 목표 막대도 같이 새로 그림
function refreshStars(){ $$('.starNum').forEach(el => { el.textContent = stars; }); if (HAB_READY) refreshGoal(); }
function setStars(n){ stars = Math.max(0, n); store.set('stars', stars); refreshStars(); }
const cheapestLocked = () => {
  const wk = weeklyIds();
  const c = Object.keys(ITEMS).filter(id => !ITEMS[id].event && !ITEMS[id].hero && (!ITEMS[id].weekly || wk.includes(id)) && !owned.includes(id)).map(id => ITEMS[id].cost);
  return c.length ? Math.min(...c) : Infinity;
};
