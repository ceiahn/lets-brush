'use strict';

/* =========================================================
   0-2. 반짝이 클럽 엔진 (v0.49.0 모듈화 2단계: 앱 00-config.js 에서 나눔)
      구독 상태(subState · pro) · 가격 글자(subPrice) · 결제 흉내(Billing) · 스토어 앱 안인지(inTWA)
      앱과의 약속: CONFIG.subs (on · trialDays · freePets · freeIslands · askAfter · price …) · CONFIG.play
      진짜 결제는 22-play.js 가 Billing 을 바꿔 끼움. 안내 화면 · 설정 칸은 20-club.js
   ========================================================= */
/* ---------- v0.32.0 반짝이 클럽 (구독) ----------
   의도: 양치 · 퀴즈 · 별 · 기본 펫은 늘 무료. 구독(또는 무료 체험) 중에만 펫 전부 · 지도 섬 전부(영웅 변신) · 스페셜 영상
   방식: 미미자우르처럼 첫 실행 때 부모님께 "7일 무료 체험" 안내 → 동의 · 부모 확인 → 체험 → 끝나면 스토어가 자동 결제
   약속: ① 체험 · 구독 중에 받은 펫 · 옷은 끝나도 그대로 (뺏지 않음)  ② 아이 화면엔 "사세요" 를 띄우지 않음 (안내는 부모님께만)
         ③ 끝나기 전에 부모님께 미리 알림 (전자상거래법: 유료 전환 전 동의 · 해지 방법 안내)
   저장: bj_sub (아이 모두 같이) = { kind:'trial'|'active'|'free', start, end(날짜 번호), auto } · bj_subAsked · bj_subReminded
   v0.42.0 평생 이용권: bj_sub = { kind:'life' } → 늘 열림. 체험 · 구독에는 plan:'month'|'year'
   v0.45.0 스토어 앱(TWA) 안에서 구글 Play 결제가 되면 js/22-play.js 가 아래 Billing 을 진짜 결제로 바꿈. 웹 · 결제가 안 되는 곳에서는 흉내 그대로 */
/* v0.45.0 스토어 앱(TWA) 안인지: 처음 열 때 주소 ?src=twa (포장 설정의 시작 주소) 또는 안드로이드 앱에서 열림 → 이 탭 동안 기억
   subs.on: true = 늘 켬 · false = 늘 끔(모두 열림) · 'play' = 스토어 앱 안에서만 켬 (웹 주소로 연 사람은 지금처럼 모두 열림) */
const inTWA = (() => {
  let v = false;
  try{ v = /[?&]src=twa\b/.test(location.search) || /^android-app:/.test(document.referrer) || sessionStorage.getItem('bj_twa') === '1'; if (v) sessionStorage.setItem('bj_twa', '1'); }catch(e){}
  return () => v;
})();
const subCfg = () => {
  const c = Object.assign({ on:false, trialDays:7, freePets:30, freeIslands:1, price:{ other:{ cur:'USD', month:3.99, year:29.99, life:59.99 } } }, CONFIG.subs || {});
  if (c.on === 'play') c.on = inTWA();
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
// v0.45.0 스토어 앱 안에서는 Play 가 알려 준 가격(그 나라 돈)을 먼저 씀 → bj_playPrice = { month:{cur,v}, year:…, life:… }
const subPriceOf = () => {
  const pp = subCfg().on && store.get('playPrice', null);
  if (pp && pp.year && pp.month && pp.year.cur === pp.month.cur) return { cur:pp.year.cur, month:pp.month.v, year:pp.year.v, life:pp.life && pp.life.cur === pp.year.cur ? pp.life.v : null };
  const pr = subCfg().price || {}; return pr[country] || (SUB_EU.includes(country) && pr.EU) || pr.other || {}; };
const money = (cur, n) => { try{ return new Intl.NumberFormat(lang, { style:'currency', currency:cur, maximumFractionDigits:cur === 'KRW' || cur === 'JPY' ? 0 : 2 }).format(n); }catch(e){ return cur + ' ' + n; } };
function subPrice(plan = 'month'){                                              // 화면에 보일 가격 글자 (예: ₩29,000)
  const p = subPriceOf();
  if (typeof p === 'string') return plan === 'month' ? p : '';                  // 예전 설정(한 가지 가격 글자)도 받음
  return p[plan] != null ? money(p.cur || 'USD', p[plan]) : '';
}
const subPerMonth = () => { const p = subPriceOf(); return typeof p === 'object' && p.year ? money(p.cur || 'USD', p.year / 12) : ''; };
const subSave = () => { const p = subPriceOf(); return typeof p === 'object' && p.year && p.month ? Math.round((1 - p.year / (p.month * 12)) * 100) : 0; };
const Billing = {
  // 흉내 (돈이 안 나감). 진짜 결제는 js/22-play.js
  async startTrial(plan = 'year'){ const dn = dayNum(new Date()); store.set('sub', { kind:'trial', plan, start:dn, end:dn + subCfg().trialDays, auto:true }); return true; },
  async subscribe(plan = 'year'){ if (TEST_MODE){ store.set('sub', { kind:'active', plan }); return true; } toast(t('sub.storeOnly'), 3500); return false; },
  async buyLifetime(){ if (TEST_MODE){ store.set('sub', { kind:'life' }); return true; } toast(t('sub.storeOnly'), 3500); return false; },   // v0.42.0 한 번 결제 (스토어에서는 "소모되지 않는 상품")
  async restore(){ return subState().kind === 'active'; },
  manage(){ toast(t('sub.manageHow'), 4500); }
};
