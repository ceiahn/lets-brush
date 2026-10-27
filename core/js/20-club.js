'use strict';

/* =========================================================
   20-1. 반짝이 클럽 화면 (v0.49.0 모듈화 2단계: 앱 21-home.js 에서 나눔)
      부모님께 체험 · 요금제 안내(#subIntro) · 설정의 클럽 칸(#subCard) · 약관 링크 · 끝나기 전 알림 · 홈 화면 추가 안내
      앱과의 약속: index.html 에 #subIntro · #subCard 조각, 앱 함수 refreshHome() · renderSettings() · (있으면) newEgg · renderPets
   ========================================================= */
/* ---------- v0.32.0 반짝이 클럽: 부모님께 체험 안내 · 설정 칸 · 끝나기 전 알림 ---------- */
/* v0.42.0 요금제 고르기: 연 구독(기본) · 월 구독 · 평생 이용권
   체험은 구독(월 · 연)에만. 평생 이용권은 바로 결제. 이미 체험을 끝낸 집은 체험 없이 구독 */
let subPlan = 'year';
const subPer = (plan) => t('sub.per.' + plan, { price:subPrice(plan) });                // "매달 ₩3,900" · "매년 ₩29,000"
function subPlansDraw(){
  const c = subCfg(), d = c.trialDays, trialOk = subState().kind === 'none', sv = subSave();
  $('#subPlans').innerHTML = SUB_PLANS.map(pl => {
    const note = pl === 'life' ? t('sub.planNote.life') : pl === 'year' ? t(trialOk ? 'sub.planNote.year' : 'sub.planNote.yearNoTrial', { d, pm:subPerMonth() }) : t(trialOk ? 'sub.planNote.month' : 'sub.planNote.monthNoTrial', { d });
    return `<button class="sub-plan ${pl === subPlan ? 'on' : ''}" data-plan="${pl}" role="radio" aria-checked="${pl === subPlan}">
      <span class="sp-name">${esc(t('sub.plan.' + pl))}${pl === 'year' && sv > 0 ? ` <i class="sp-best">${esc(t('sub.best', { p:sv }))}</i>` : ''}</span>
      <b class="sp-price">${esc(subPrice(pl))}</b><small>${esc(note)}</small></button>`;
  }).join('');
  const life = subPlan === 'life';
  $('#subConsent').textContent = life ? t('sub.consentLife', { price:subPrice('life') }) : trialOk ? t('sub.consent', { per:subPer(subPlan) }) : t('sub.consentNoTrial', { per:subPer(subPlan) });
  $('#subStart').textContent = life ? t('sub.buyLife', { price:subPrice('life') }) : trialOk ? t('sub.start', { d }) : t('sub.subNow', { per:subPer(subPlan) });
  $('#subAgree').checked = false; $('#subStart').disabled = true;
}
$('#subPlans').addEventListener('click', (e) => { const b = e.target.closest('[data-plan]'); if (!b) return; sfx.tap(); subPlan = b.dataset.plan; subPlansDraw(); });
function subIntroOpen(plan){
  const c = subCfg(), d = c.trialDays, fp = Math.min(c.freePets, FREE_PET_ORDER.length);
  subPlan = SUB_PLANS.includes(plan) ? plan : 'year';
  $('#subH').textContent = subState().kind === 'none' ? t('sub.introH', { d }) : t('sub.title');
  $('#subList').innerHTML = [t('sub.p1', { pets:Object.keys(PETS).length, fp }), t('sub.p2', { isl:ISLANDS.length }), t('sub.p3'), t('sub.p4')].map(x => `<li>${esc(x)}</li>`).join('');
  $('#subFree').textContent = t('sub.free', { fp });
  subPlansDraw();
  $('#subLinks').innerHTML = legalHTML();
  $('#subIntro').classList.add('show');
}
const subIntroClose = () => { $('#subIntro').classList.remove('show'); store.set('subAsked', true); };
$('#subAgree').addEventListener('change', (e) => { $('#subStart').disabled = !e.target.checked; });
$('#subStart').addEventListener('click', () => {
  if (!$('#subAgree').checked){ toast(t('sub.needAgree')); return; }
  $('#subIntro').classList.remove('show');
  const plan = subPlan;
  parentGate(async () => {                                                     // 결제 앞에는 늘 부모 확인 (아이 앱 규정)
    sfx.tap();
    if (plan === 'life'){ if (await Billing.buyLifetime()){ store.set('subAsked', true); confetti(40); toast(t('sub.lifeDone'), 3500); afterSubChange(); } return; }
    if (subState().kind === 'none'){ if (await Billing.startTrial(plan)){ store.set('subAsked', true); confetti(30); toast(Play.svc ? t('sub.stActive') : t('sub.started', { d:subCfg().trialDays }), 3500); afterSubChange(); } return; }
    if (await Billing.subscribe(plan)){ confetti(30); toast(t('sub.stActive'), 3500); afterSubChange(); }
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
  $('#subSt').textContent = st.kind === 'life' ? t('sub.stLife') : st.kind === 'trial' ? t('sub.stTrial', { d:st.left }) : st.kind === 'active' ? t('sub.stActive') : st.kind === 'free' ? t('sub.stFree') : t('sub.stNone');
  $('#subPerks').textContent = [t('sub.p1', { pets:Object.keys(PETS).length, fp:Math.min(c.freePets, FREE_PET_ORDER.length) }), t('sub.p2', { isl:ISLANDS.length }), t('sub.p3'), t('sub.p4')].join(' · ');
  const go = $('#subGo');
  go.hidden = st.kind === 'life';
  go.textContent = st.kind === 'none' ? t('sub.goTrial', { d:c.trialDays }) : st.kind === 'free' ? t('sub.goPlans') : t('sub.goLife');   // 체험 · 구독 중엔 평생 이용권 안내
  $('#subLifeNote').hidden = !(st.kind === 'active' || st.kind === 'trial');
}
$('#subGo').addEventListener('click', () => {                                  // 설정 안 = 이미 부모 확인을 지남
  sfx.tap();
  const k = subState().kind;
  subIntroOpen(k === 'active' || k === 'trial' ? 'life' : 'year');
});
$('#subRestore').addEventListener('click', async () => { sfx.tap(); toast(t(await Billing.restore() ? 'sub.restoreOk' : 'sub.restoreNone')); renderSub(); });
$('#subManage').addEventListener('click', () => { sfx.tap(); Billing.manage(); });
$('#subSim').addEventListener('click', () => { sfx.tap(); store.set('subSim', !store.get('subSim', false)); renderSub(); refreshHome(); });
$('#subEnd').addEventListener('click', () => { sfx.tap(); const s = store.get('sub', null); if (s && s.kind === 'trial'){ s.end = dayNum(new Date()); store.set('sub', s); } renderSub(); refreshHome(); });
$('#subAct').addEventListener('click', () => { sfx.tap(); store.set('sub', { kind:'active' }); afterSubChange(); });
$('#subReset').addEventListener('click', () => { sfx.tap(); ['sub', 'subAsked', 'subReminded'].forEach(k => store.del(k)); renderSub(); refreshHome(); });
/* v0.33.0 홈 화면에 추가 안내 (부모님께 한 번)
   의도: 기록은 폰 브라우저 안에만 있음. 아이폰 사파리는 홈 화면에 추가하지 않은 사이트의 저장 값을 오래 안 쓰면 지울 수 있음
   때: 브라우저로 열었고(홈 화면 앱 아님) · 양치한 날이 2일 이상 · 아직 안 물었을 때. 스토어 앱(TWA) 안에서는 안 물음 (v0.45.0) */
let installEv = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEv = e; });   // 안드로이드 크롬: "앱 설치" 창을 우리가 띄움
const isStandalone = () => { try{ return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }catch(e){ return false; } };
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
function homeTipLaunch(){
  if (CONFIG.homeTip === false || isStandalone() || inTWA() || !/^https?:/.test(location.protocol) || store.get('homeTip', false)) return false;
  if (new Set(log).size < 2) return false;
  store.set('homeTip', true);
  setTimeout(() => dialog({ icon:'📲', text:t(isIOS() ? 'home.tipIOS' : 'home.tipAnd'), ok:t(installEv ? 'home.tipInstall' : 'sub.ok'), cancel:t('home.tipLater'),
    onOk(){ if (installEv){ try{ installEv.prompt(); }catch(e){} installEv = null; } } }), 800);
  return true;
}
function subLaunch(){                                                          // 앱을 열 때: 처음이면 체험 안내, 끝나기 2일 전이면 알림 (부모님께)
  const c = subCfg(), st = subState();
  if (!c.on) return false;
  // v0.45.0 subs.askAfter: 양치한 날이 이만큼 된 뒤에 처음 안내 (0 = 처음 열 때). 아이가 재미를 느낀 뒤 부모님께 보여 주려면 2~3
  if (st.kind === 'none' && !store.get('subAsked', false) && new Set(log).size >= (c.askAfter || 0)){ setTimeout(subIntroOpen, 500); return true; }
  const s = store.get('sub', null);
  if (st.kind === 'trial' && st.left <= 2 && s && store.get('subReminded', null) !== s.start){
    store.set('subReminded', s.start);
    setTimeout(() => dialog({ icon:'👨‍👩‍👧', text:t('sub.remind', { d:st.left, per:subPer(st.plan || 'month') }), ok:t('sub.ok'), cancel:t('sub.manage'), onCancel(){ Billing.manage(); } }), 700);
    return true;
  }
  return false;
}
