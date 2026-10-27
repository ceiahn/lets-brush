'use strict';

/* =========================================================
   4. 상태값
      의도: 앱 전체에서 쓰는 값(별 · 옷 · 설정)을 한곳에 모아 둠. 화면을 다시 그리는 함수는 각 구역에
   ========================================================= */
// ★ 테스트 모드: 아이가 모든 아이템을 사 볼 수 있게 별을 넉넉히 줌. 출시 전에 false로 바꾸기
// v0.28.1 주소로 정하기: ?test=1 켜기 · ?test=0 끄기 · ?test=auto 기억 지우기 (?testMode=true/false 도 됨)
//   정한 값은 bj_testMode 에 기억 → 매개변수 없이 열어도(홈 화면 아이콘) 그대로. 순서: 주소 > 기억 > CONFIG.testMode
function readTestParam(){
  let q = null; try{ q = new URLSearchParams(location.search); }catch(e){ return null; }
  const key = q.has('test') ? 'test' : q.has('testMode') ? 'testMode' : null;
  if (!key) return null;
  const v = String(q.get(key) || '').trim().toLowerCase();
  if (['', '1', 'true', 'on', 'yes', 'y'].includes(v)) return true;
  if (['0', 'false', 'off', 'no', 'n'].includes(v)) return false;
  if (['auto', 'reset', 'default'].includes(v)) return 'auto';
  return null;                                          // 모르는 값은 무시
}
function decideTestMode(){
  if (CONFIG.testParam === false) return !!CONFIG.testMode;   // 출시 잠금
  const p = readTestParam();
  if (p === 'auto'){ try{ localStorage.removeItem('bj_testMode'); }catch(e){} return !!CONFIG.testMode; }
  if (p === true || p === false){ store.set('testMode', p); return p; }
  const kept = store.get('testMode', null);
  return (kept === true || kept === false) ? kept : !!CONFIG.testMode;
}
const TEST_MODE = decideTestMode();
if (TEST_MODE) document.documentElement.classList.add('test-mode');
const TEST_STARS = CONFIG.testStars;
const firstRun = store.get('stars', null) === null;
let stars       = store.get('stars', CONFIG.firstGiftStars);
let log         = store.get('log', []);
let soundOn     = store.get('sound', true);      // 효과음
let musicOn     = store.get('music', true);      // 배경음악
let bgm         = store.get('bgm', 'sunny');
let voiceOn     = store.get('voice', true);
let eventLookOn = store.get('eventLook', true);
const TECHS = ['short', 'circle', 'roll'];
let technique   = store.get('technique', 'short');
let hand        = store.get('hand', 'right') === 'left' ? 'left' : 'right';
let childAge    = store.get('age', '3p') === 'u3' ? 'u3' : '3p';
// v0.30.0 만 나이: 태어난 해가 있으면 계산 (월 · 일이 없으면 올해 생일이 지난 것으로 침). 없으면 null
function kidAge(){
  const y = store.get('birthY', null); if (!y) return null;
  const now = new Date(), b = store.get('bday', null);
  let a = now.getFullYear() - y;
  if (b && b.m && b.d && (now.getMonth() + 1 < b.m || (now.getMonth() + 1 === b.m && now.getDate() < b.d))) a--;
  return Math.max(0, a);
}
function applyAge(){ const a = kidAge(); if (a !== null){ childAge = a < 3 ? 'u3' : '3p'; store.set('age', childAge); } }
applyAge();
let prepOn      = store.get('prep', true);
let tongueOn    = store.get('tongue', true);
let myBrushes   = store.get('brushes', ['brush_basic']);
let brush       = store.get('brush', 'brush_basic');
function applyBrush(){
  if (!BRUSHES[brush]) brush = 'brush_basic';
  const v = Object.assign({ 'd-dots':0, 'd-stars':0, 'd-stripes':0, 'd-rainbow':0 }, BRUSHES[brush].v);
  Object.entries(v).forEach(([k, x]) => document.documentElement.style.setProperty('--' + k, x));
  const tp = topperOf(brush);
  document.querySelectorAll('.btop').forEach(g => { g.innerHTML = `<g class="upr">${tp}</g>`; });   // 손잡이 위 장식 (upr: 똑바로 세우는 자리)
}
let voiceName   = store.get('voiceName', '');
let voiceTone   = store.get('voiceTone', 'kind');
const TONES = { kind:{ pitch:1.18, rate:.95 }, normal:{ pitch:1, rate:1 }, bright:{ pitch:1.32, rate:1.05 } };
const handDir   = () => hand === 'left' ? -1 : 1;    // 거울 기준: 오른손 = 화면 오른쪽
if (!TECHS.includes(technique)) technique = 'short';
function applyTech(){ TECHS.forEach(k => document.body.classList.toggle('tech-' + k, k === technique)); }
const DURS = [60, 120, 180];                       // v0.29.0 양치 시간은 부모님 설정에서 고름 (1 · 2 · 3분)
// v0.29.1 나라별 권장 시간: 한국 3분(333), 그 밖은 2분 (미국 ADA · 영국 NHS · 중국 질병통제센터 · 독일 등 "하루 두 번 2분")
//   부모님이 설정에서 직접 고르기 전(bj_durSet 없음)에는 나라 권장 시간을 따름 → 나라를 바꾸면 같이 바뀜
//   나라 추가 · 바꾸기: CONFIG.durByCountry = { JP:180, … } (resources.js 의 config 에서도 됨)
const recDur = () => { const v = Object.assign({ KR:180 }, CONFIG.durByCountry || {})[country]; return DURS.includes(v) ? v : 120; };
let totalSec    = store.get('durSet', false) && DURS.includes(store.get('dur', 0)) ? store.get('dur', 120) : recDur();
let owned       = store.get('owned', ['head_cap', 'neck_bowtie']);
let look        = store.get('look', { back:null, neck:'neck_bowtie', eyes:null, head:null, hand:null });
let evOverrides = store.get('evOverrides', {});    // { 이벤트id: { 슬롯: 아이템|null } } 이벤트 중 아이가 직접 바꾼 것
if (firstRun) store.set('stars', stars);
let testGift = false;
if (TEST_MODE && !store.get('testGift', false)){
  stars = Math.max(stars, TEST_STARS); store.set('stars', stars); store.set('testGift', true); testGift = true;
}
