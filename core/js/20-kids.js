'use strict';

/* =========================================================
   20-2. 아이 여럿 (v0.49.0 모듈화 2단계: 앱 21-home.js 에서 나눔)
      고르기(#kidPick) · 바꾸기(#kidChip) · 설정의 아이 목록(#kidRows · #kidAdd). 저장은 01-store.js 의 KID_KEYS
   ========================================================= */
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
