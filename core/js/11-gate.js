'use strict';

/* =========================================================
   11-1. 부모 확인 (v0.49.0 모듈화 2단계: 앱 11-settings.js 에서 나눔)
      parentGate(다음 일): 곱셈 문제를 맞히면 다음 일을 해요. 설정 · 결제 · 바깥 링크 · 공유 앞에 (아이 앱 규정)
      앱과의 약속: index.html 에 #gate (#gateQ · #gateAns · #gateNote · #gatePad · #gateBox · #gateCancel)
   ========================================================= */
// v0.28.5 부모 확인: 설정(초기화 · 백업 불러오기 · 음악 · 영상 넣기 등)은 곱셈 문제를 맞혀야 열림
//   문제: (3~9) × (6~9), 답 18~81. 틀리면 새 문제. CONFIG.parentGate:false 면 안 물음
let gateAnswer = 0, gateInput = '', gateNext = null;
function gateNew(){
  const a = 3 + Math.floor(Math.random() * 7), b = 6 + Math.floor(Math.random() * 4);
  gateAnswer = a * b; gateInput = '';
  $('#gateQ').textContent = t('gate.q', { a, b }); gateDraw();
}
const gateDraw = () => { $('#gateAns').textContent = gateInput || '?'; };
function parentGate(next){
  if (CONFIG.parentGate === false){ next(); return; }
  gateNext = next;
  const note = $('#gateNote'); note.textContent = t('gate.note'); note.classList.remove('bad');
  gateNew(); $('#gate').classList.add('show');
  if (!(history.state && history.state.bj)){ try{ history.pushState({ bj:1 }, ''); }catch(e){} }   // 뒤로 가기로 닫히게 (첫 화면에서 앱이 꺼지지 않게)
}
function gateClose(){ $('#gate').classList.remove('show'); gateNext = null; }
$('#gatePad').addEventListener('click', (e) => {
  const k = e.target.closest('[data-k]'); if (!k) return;
  sfx.tap(); const v = k.dataset.k;
  if (v === 'del'){ gateInput = gateInput.slice(0, -1); gateDraw(); return; }
  if (v !== 'ok'){ if (gateInput.length < 3) gateInput += v; gateDraw(); return; }
  if (gateInput && +gateInput === gateAnswer){ const f = gateNext; gateClose(); if (f) f(); return; }
  const box = $('#gateBox'), note = $('#gateNote');                                 // 틀림 → 흔들고 새 문제
  box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
  note.textContent = t('gate.wrong'); note.classList.add('bad'); gateNew();
});
$('#gateCancel').addEventListener('click', () => {
  sfx.tap(); gateClose();
  if (current === 'home' && history.state && history.state.bj){ try{ history.back(); }catch(e){} }   // 열 때 남긴 기록 정리
});
