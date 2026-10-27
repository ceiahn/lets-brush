'use strict';

/* =========================================================
   8. 공통 도우미
      의도: 화면 전환(show) · 대화창(dialog) · 알림(toast). 안드로이드 뒤로 가기는 history 기록으로 처리
   ========================================================= */
let current = 'home';
function show(id){
  const prev = current;
  current = id; $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  if (prev === 'done' && id !== 'done' && typeof clearGift === 'function') clearGift();   // 선물 연출 정리
  if (id === 'home' && petPend && petPend.length) setTimeout(petPendingShow, 400);                          // 못 본 부화·성장 축하
  // 안드로이드 뒤로 가기용: 첫 화면이 아닌 곳에 들어가면 기록을 하나 남김
  if (id !== 'home' && !(history.state && history.state.bj)){ try{ history.pushState({ bj:1 }, ''); }catch(e){} }
}

let dlgOk = null, dlgCancel = null;
function dialog({ text, ok, cancel, onOk, onCancel, icon = '' }){
  $('#dlgIcon').innerHTML = icon;
  $('#dlgText').textContent = text;
  $('#dlgOk').textContent = ok;
  $('#dlgCancel').textContent = cancel;
  dlgOk = onOk || null; dlgCancel = onCancel || null;
  $('#modal').classList.add('show');
}
const closeDialog = () => $('#modal').classList.remove('show');
// 뒤로 가기: 창이 열려 있으면 닫기 → 양치 중이면 그만할지 묻기 → 그 밖엔 첫 화면으로
window.addEventListener('popstate', () => {
  const keep = () => { try{ history.pushState({ bj:1 }, ''); }catch(e){} };
  if ($('#audioPop').classList.contains('show')){ $('#audioPop').classList.remove('show'); keep(); return; }
  if ($('#subIntro').classList.contains('show')){ subIntroClose(); keep(); return; }   // v0.32.0
  if ($('#kidPick').classList.contains('show')){ $('#kidPick').classList.remove('show'); try{ sessionStorage.setItem('bj_picked', '1'); }catch(e){} keep(); return; }   // v0.31.0
  if ($('#gate').classList.contains('show')){ gateClose(); if (current !== 'home') keep(); return; }
  if ($('#quiz').classList.contains('show')){ quizClose(); keep(); return; }
  if ($('#modal').classList.contains('show')){ $('#dlgCancel').click(); if (current !== 'home') keep(); return; }
  if ($('#petShow').classList.contains('show')){ if (!$('#psOk').hidden) $('#psOk').click(); keep(); return; }
  if (/^brush/.test(current)){ keep(); askStop(); return; }
  if (current === 'tongue'){ keep(); $('#tgSkip').click(); return; }
  if (current === 'theater'){ keep(); if (thEnd) thEnd(); return; }
  if (current === 'special'){ keep(); if (spEnd) spEnd(); return; }
  if (current !== 'home'){ Voice.stop(); refreshHome(); show('home'); }
});
$('#dlgOk').addEventListener('click', () => { closeDialog(); const f = dlgOk; dlgOk = dlgCancel = null; if (f) f(); });
$('#dlgCancel').addEventListener('click', () => { closeDialog(); const f = dlgCancel; dlgOk = dlgCancel = null; if (f) f(); });

let toastT = 0;
function toast(msg, ms){
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms || 2200);
}
