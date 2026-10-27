'use strict';

/* =========================================================
   22. 구글 Play 결제 (v0.45.0)
      의도: 스토어 앱(TWA, 웹을 안드로이드 앱으로 감싼 것) 안에서는 진짜 결제. 웹 주소로 열면 지금처럼 흉내 (00-config Billing)
      방법: 크롬의 Digital Goods API (getDigitalGoodsService) + Payment Request API. 서버 없음
        · 앱을 열 때: 상품 가격(그 나라 돈) → bj_playPrice, 산 것 목록 → bj_sub ({ kind:'active'|'life'|'free', src:'play' })
        · 구독 · 체험 · 평생 이용권 → Play 결제 창. 무료 체험은 Play Console 의 연 · 월 구독 "체험 혜택"이 정함 (처음인 계정만)
        · 해지 · 바꾸기 → Play 구독 관리 화면
      주의: 상품 ID 는 CONFIG.play.skus 와 Play Console 이 같아야 됨. 포장 · 상품 만들기 순서는 apps/lets-brush/docs/스토어_앱_포장.md
            Play 는 결제를 3일 안에 "승인"하지 않으면 돈을 돌려줌 → 내부 테스트에서 라이선스 테스터로 꼭 확인 (같은 문서 4장)
   ========================================================= */
const PLAY_BILLING = 'https://play.google.com/billing';
const Play = { svc:null, ready:Promise.resolve(false) };
const playSku = (plan) => ((CONFIG.play || {}).skus || {})[plan];
const playPlanOf = (sku) => SUB_PLANS.find(p => playSku(p) === sku);
async function playSync(){                                                     // Play 가 알려 주는 "지금 가진 것" → bj_sub
  if (!Play.svc) return false;
  let list;
  try{ list = await Play.svc.listPurchases(); }catch(e){ return false; }
  const plans = (list || []).map(p => playPlanOf(p.itemId)).filter(Boolean);
  const before = JSON.stringify(store.get('sub', null)), s = store.get('sub', null);
  if (plans.includes('life')) store.set('sub', { kind:'life', src:'play' });
  else if (plans.length) store.set('sub', { kind:'active', plan:plans.includes('year') ? 'year' : 'month', src:'play' });
  else if (s && s.src === 'play' && s.kind !== 'free') store.set('sub', { kind:'free', src:'play' });   // 끝난 구독 (해지 · 결제 실패)
  else if (s && s.kind === 'trial') store.set('sub', { kind:'free' });           // 앱 밖(웹)에서 흉내로 시작한 체험은 앱 안에서 이어 주지 않음
  return JSON.stringify(store.get('sub', null)) !== before;
}
async function playBuy(plan){
  const sku = playSku(plan);
  if (!Play.svc || !sku) return false;
  try{
    const req = new PaymentRequest([{ supportedMethods:PLAY_BILLING, data:{ sku } }], { total:{ label:'Total', amount:{ currency:'USD', value:'0' } } });
    const res = await req.show();
    await res.complete('success');
  }catch(e){
    if (!e || e.name !== 'AbortError') toast(t('sub.payFail'), 3500);        // 부모님이 결제 창을 닫은 건 조용히
    return false;
  }
  await playSync();
  return ['active', 'life'].includes(subState().kind);
}
async function playInit(){
  if (!inTWA() || typeof window.getDigitalGoodsService !== 'function') return false;
  try{ Play.svc = await window.getDigitalGoodsService(PLAY_BILLING); }catch(e){ Play.svc = null; }
  if (!Play.svc) return false;
  try{
    const price = {};
    for (const d of await Play.svc.getDetails(SUB_PLANS.map(playSku).filter(Boolean))){
      const pl = playPlanOf(d.itemId);
      if (pl && d.price && d.price.currency) price[pl] = { cur:d.price.currency, v:+d.price.value };
    }
    if (Object.keys(price).length) store.set('playPrice', price);
  }catch(e){}
  if (await playSync()) afterSubChange();
  return true;
}
{
  const sim = Object.assign({}, Billing);                                    // 웹 · 결제가 안 될 때는 흉내 그대로
  // v0.47.0 스토어 앱 표시(?src=twa)만 흉내 내고 Play 결제가 없는 곳에서는 체험도 흉내 내지 않음 (테스트 모드만 흉내) → 무료 기능만
  const noPlay = () => inTWA() && !TEST_MODE ? (toast(t('sub.storeOnly'), 3500), false) : null;
  Object.assign(Billing, {
    async startTrial(plan = 'year'){ await Play.ready; return Play.svc ? playBuy(plan) : noPlay() ?? sim.startTrial(plan); },
    async subscribe(plan = 'year'){ await Play.ready; return Play.svc ? playBuy(plan) : sim.subscribe(plan); },
    async buyLifetime(){ await Play.ready; return Play.svc ? playBuy('life') : sim.buyLifetime(); },
    async restore(){ await Play.ready; if (!Play.svc) return sim.restore(); await playSync(); afterSubChange(); return ['active', 'life'].includes(subState().kind); },
    manage(){
      if (!Play.svc){ sim.manage(); return; }
      const s = store.get('sub', null), sku = s && s.kind === 'active' ? playSku(s.plan) : '';
      openLegal('https://play.google.com/store/account/subscriptions?package=' + encodeURIComponent((CONFIG.play || {}).pkg || '') + (sku ? '&sku=' + encodeURIComponent(sku) : ''));
    }
  });
  Play.ready = playInit().catch(() => false);
}
