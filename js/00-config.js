'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* =========================================================
   0. 설정값 · 외부 리소스
      RES = window.BJ_RESOURCES (resources.js에서 넣음, 없으면 빈 값)
      CONFIG = 아래 기본값 + RES.config로 덮어쓰기
      의도: 숫자 조절(보상 · 확률 · 속도)은 코드 대신 여기서만. 출시 땐 resources.js 의 config 로 덮어씀
            testMode 는 개발 중 편의(별 100개, 개발자 메뉴) → 출시 전 반드시 false
            v0.28.1 부터 주소로도 정할 수 있음: index.html?test=1 · ?test=0 · ?test=auto (4. 상태값 TEST_MODE 참고)
   ========================================================= */
const RES = (typeof window.BJ_RESOURCES === 'object' && window.BJ_RESOURCES) || {};
const CONFIG = Object.assign({
  testMode: false,                // v0.28.4 기본 꺼짐 (웹에 올려 다른 사람이 써도 안전하게). 내 폰에서 테스트는 주소 끝 ?test=1 (별 100개 선물, 개발자 메뉴)
  quiz: { star:1, stampsForPet:7 },
  // v0.32.0 반짝이 클럽 (구독). on:false 면 전부 열림 (지금 웹 버전). 스토어 앱으로 포장할 때 true + Billing 을 진짜 결제로
  //   v0.42.0 요금제 세 가지: month(월 구독) · year(연 구독, 기본으로 골라 둠) · life(평생 이용권, 한 번 결제). 정한 이유: docs/시장_언어_가격.md
  //   price 는 안내 글에만 씀 (실제 금액은 스토어가 정함 → 포장할 때 스토어 가격을 받아 와서 바꿈). cur = 통화, 숫자는 그 통화 금액
  subs: { on:false, trialDays:7, freePets:30, freeIslands:1, terms:'terms.html', privacy:'privacy.html',
    price:{ KR:{ cur:'KRW', month:3900, year:29000, life:59000 }, JP:{ cur:'JPY', month:550, year:3900, life:7800 },
            US:{ cur:'USD', month:3.99, year:29.99, life:59.99 }, GB:{ cur:'GBP', month:3.49, year:24.99, life:49.99 },
            CA:{ cur:'CAD', month:4.99, year:39.99, life:79.99 }, AU:{ cur:'AUD', month:5.99, year:44.99, life:89.99 },
            EU:{ cur:'EUR', month:3.99, year:29.99, life:59.99 }, other:{ cur:'USD', month:3.99, year:29.99, life:59.99 } } },
  contact: 'letsbrush.official@gmail.com',   // v0.33.1 문의 이메일 (설정 부모님 칸 · 약관 · 처리방침 · 스토어)  // v0.30.0 오늘의 퀴즈: 맞히면 별 · 도장 1개, 도장 stampsForPet 개면 펫 한 마리
  popularFirst: true,             // v0.29.0 새 알 · 선물 펫은 아이들이 잘 아는 동물부터 (false = 전부 무작위)
  parentGate: true,               // v0.28.5 설정을 열 때 곱셈 문제로 어른 확인 (false = 안 물음)
  testParam: false,               // v0.44.0 출시 잠금: 주소(?test=1) · 기억 값을 무시. 내 폰에서 다시 시험하려면 잠깐 true 로 (docs/출시_준비.md)
  testStars: 100,
  firstGiftStars: 3,
  surfSplit: [0, .27, .6, .73, .87, 1], // 구역 안 시간 비율: 바깥쪽 · 씹는 면 · 어금니 안쪽 · 보스 기습(씹는 면 한 번 더) · 앞니 안쪽
  raid: true,                     // v0.26 보스 기습: 구역 끝 무렵 대장 세균이 그 구역 어금니에 세균을 숨김 (false = 끔)
  reward: { base:1, noPause:1, streak3:1, streak7:2, twice:1, event:1, birthday:5, lucky:2, luckyChance:.2, raid:1 },
  giftAutoOpenMs: 3200,
  tongueMs: 6800,
  recMaxSec: 15,
  musicMaxMB: 30,
  pauseWhenHidden: true,
  goldChance: .35,                // 양치 한 번에 황금 세균이 나올 확률
  shieldCost: 5, shieldMax: 3,    // 지킴이 방석 값 / 최대 개수
  mapSteps: 7, mapPerDay: 3       // 섬 하나의 칸 수 / 하루에 나아가는 최대 칸
}, RES.config || {});
CONFIG.reward = Object.assign({ base:1, noPause:1, streak3:1, streak7:2, twice:1, event:1, birthday:5, lucky:2, luckyChance:.2,
  gold:2, fairy:2, stamp:1, castle:5, mile:{ 3:3, 7:5, 14:7, 30:10 } }, (RES.config || {}).reward || {});
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// 날짜 · 시간대 도우미
const dkey = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const slotOf = (d = new Date()) => d.getHours() < 15 ? 'am' : 'pm';            // 오후 3시 전 = 아침 양치
const isWeekend = (d = new Date()) => d.getDay() === 0 || d.getDay() === 6;
const dayNum = (d) => Math.round(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime() / 86400000);
/* ---------- v0.32.0 반짝이 클럽 (구독) ----------
   의도: 양치 · 퀴즈 · 별 · 기본 펫은 늘 무료. 구독(또는 무료 체험) 중에만 펫 전부 · 지도 섬 전부(영웅 변신) · 스페셜 영상
   방식: 미미자우르처럼 첫 실행 때 부모님께 "7일 무료 체험" 안내 → 동의 · 부모 확인 → 체험 → 끝나면 스토어가 자동 결제
   약속: ① 체험 · 구독 중에 받은 펫 · 옷은 끝나도 그대로 (뺏지 않음)  ② 아이 화면엔 "사세요" 를 띄우지 않음 (안내는 부모님께만)
         ③ 끝나기 전에 부모님께 미리 알림 (전자상거래법: 유료 전환 전 동의 · 해지 방법 안내)
   저장: bj_sub (아이 모두 같이) = { kind:'trial'|'active'|'free', start, end(날짜 번호), auto } · bj_subAsked · bj_subReminded
   v0.42.0 평생 이용권: bj_sub = { kind:'life' } → 늘 열림. 체험 · 구독에는 plan:'month'|'year'
   주의: 지금 Billing 은 흉내만 냄 (돈이 안 나감). 스토어 앱으로 포장할 때 Billing 함수들을 진짜 결제로 바꿀 것 */
const subCfg = () => {
  const c = Object.assign({ on:false, trialDays:7, freePets:30, freeIslands:1, price:{ other:{ cur:'USD', month:3.99, year:29.99, life:59.99 } } }, CONFIG.subs || {});
  if (TEST_MODE && store.get('subSim', false)) c.on = true;                     // 개발자 메뉴: 구독 흉내
  return c;
};
function subState(){
  if (!subCfg().on) return { kind:'off' };
  const s = store.get('sub', null);
  if (!s) return { kind:'none' };
  if (s.kind === 'life') return { kind:'life' };                                 // v0.42.0 평생 이용권
  if (s.kind === 'active') return { kind:'active', plan:s.plan || 'month' };
  if (s.kind === 'trial'){
    const left = s.end - dayNum(new Date());
    if (left > 0) return { kind:'trial', left, plan:s.plan || 'month' };
    return { kind:'free', ended:true };                                         // ★ 진짜 결제에선 스토어가 알려 줌 (해지 안 했으면 active)
  }
  return { kind:'free' };
}
const pro = () => ['off', 'trial', 'active', 'life'].includes(subState().kind);
const SUB_EU = ['DE', 'FR', 'ES', 'IT', 'IE'];
const SUB_PLANS = ['year', 'month', 'life'];                                     // 보여 주는 순서 (연 구독을 맨 위에 골라 둠)
const subPriceOf = () => { const pr = subCfg().price || {}; return pr[country] || (SUB_EU.includes(country) && pr.EU) || pr.other || {}; };
const money = (cur, n) => { try{ return new Intl.NumberFormat(lang, { style:'currency', currency:cur, maximumFractionDigits:cur === 'KRW' || cur === 'JPY' ? 0 : 2 }).format(n); }catch(e){ return cur + ' ' + n; } };
function subPrice(plan = 'month'){                                              // 화면에 보일 가격 글자 (예: ₩29,000)
  const p = subPriceOf();
  if (typeof p === 'string') return plan === 'month' ? p : '';                  // 예전 설정(한 가지 가격 글자)도 받음
  return p[plan] != null ? money(p.cur || 'USD', p[plan]) : '';
}
const subPerMonth = () => { const p = subPriceOf(); return typeof p === 'object' && p.year ? money(p.cur || 'USD', p.year / 12) : ''; };
const subSave = () => { const p = subPriceOf(); return typeof p === 'object' && p.year && p.month ? Math.round((1 - p.year / (p.month * 12)) * 100) : 0; };
const Billing = {
  // ★ 스토어 앱으로 포장할 때 아래 세 가지를 구글 Play 결제 · 애플 인앱 결제로 바꿈 (예: RevenueCat)
  async startTrial(plan = 'year'){ const dn = dayNum(new Date()); store.set('sub', { kind:'trial', plan, start:dn, end:dn + subCfg().trialDays, auto:true }); return true; },
  async subscribe(plan = 'year'){ if (TEST_MODE){ store.set('sub', { kind:'active', plan }); return true; } toast(t('sub.storeOnly'), 3500); return false; },
  async buyLifetime(){ if (TEST_MODE){ store.set('sub', { kind:'life' }); return true; } toast(t('sub.storeOnly'), 3500); return false; },   // v0.42.0 한 번 결제 (스토어에서는 "소모되지 않는 상품")
  async restore(){ return subState().kind === 'active'; },
  manage(){ toast(t('sub.manageHow'), 4500); }
};
