'use strict';

/* =========================================================
   3. 나라 & 이벤트 엔진
      when.type: 'fixed' (양력 MM-DD ~ MM-DD, 해 넘김 가능)
                 'lunar' (음력 월/일, 앞뒤 며칠) — 브라우저 음력 달력으로 매년 자동 계산
      look: 이벤트 기간 기본 옷 / effect: 화면 효과
      의도: 사는 나라에 맞는 명절 · 기념일에 깜짝 옷 · 화면 효과 · 보너스 별 → "오늘은 뭔가 다르다" 느낌
            아이가 꾸미기에서 바꾼 옷이 이벤트 옷보다 우선 (evOverrides)
   ========================================================= */
const COUNTRIES = ['KR','US','JP','GB','CA','AU','NZ','IE','DE','FR','ES','IT','MX','BR','CN','TW','VN','TH','ID','IN','SG','PH'];
const HALLOWEEN_COUNTRIES = ['US','CA','GB','IE','AU','NZ','KR','JP','DE','FR','MX'];

// 생일: 부모님 설정의 월/일. 목록 맨 앞이라 다른 이벤트보다 우선
const EVENTS = [
  { id:'birthday',     icon:'🎂', countries:'*', when:{ type:'birthday' }, look:{ head:'head_party', hand:'hand_cake' }, effect:'balloon', bonus:5 },
  { id:'seollal',      icon:'🪁', countries:['KR'], when:{ type:'lunar', month:1, day:1, before:2, after:2 }, look:{ hand:'hand_bok' }, effect:'star' },
  { id:'chuseok',      icon:'🌕', countries:['KR'], when:{ type:'lunar', month:8, day:15, before:2, after:2 }, look:{ head:'head_bunny' }, effect:'star' },
  { id:'childrensday', icon:'🎈', countries:['KR','JP'], when:{ type:'fixed', from:'05-05', to:'05-05' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'halloween',    icon:'🎃', countries:HALLOWEEN_COUNTRIES, when:{ type:'fixed', from:'10-24', to:'10-31' }, look:{ head:'head_witch', hand:'hand_pumpkin' }, effect:'bat' },
  { id:'xmas',         icon:'🎄', countries:'*', when:{ type:'fixed', from:'12-18', to:'12-26' }, look:{ head:'head_santa', hand:'hand_present' }, effect:'snow' },
  { id:'newyear',      icon:'🎉', countries:'*', when:{ type:'fixed', from:'12-31', to:'01-02' }, look:{ head:'head_party' }, effect:'star' }
];
// 외부 리소스: 이벤트 추가·교체 (같은 id면 바꿈). texts:{ ko:{ name, greet, cheer } }
(RES.events || []).forEach(e => {
  if (!e || !e.id || !e.when) return;
  const i = EVENTS.findIndex(x => x.id === e.id);
  const ev = Object.assign({ icon:'⭐', countries:'*', look:{}, effect:'star' }, e);
  if (i >= 0) EVENTS[i] = ev; else EVENTS.push(ev);
  Object.entries(e.texts || {}).forEach(([code, tx]) => {
    if (!packs[code]) return;
    Object.entries(tx).forEach(([k, v]) => { packs[code].strings[`event.${e.id}.${k}`] = v; });
  });
});

const detectCountry = () => {
  const m = (navigator.language || '').match(/-([A-Z]{2})/i);
  const c = m ? m[1].toUpperCase() : (lang === 'ko' ? 'KR' : 'US');
  return COUNTRIES.includes(c) ? c : (lang === 'ko' ? 'KR' : 'US');
};
let country = store.get('country', null) || detectCountry();

let lunarFmt = null;
try{ lunarFmt = new Intl.DateTimeFormat('en-u-ca-chinese', { month:'numeric', day:'numeric' }); }catch(e){}
// v0.28.4 음력 달력을 모르는 브라우저는 말없이 양력으로 계산함 → 1월 1일을 설날로 착각하지 않게 그땐 음력 행사를 끔
try{ if (lunarFmt && lunarFmt.resolvedOptions().calendar !== 'chinese') lunarFmt = null; }catch(e){ lunarFmt = null; }
function lunarMD(d){
  if (!lunarFmt) return null;
  const parts = lunarFmt.formatToParts(d);
  const m = (parts.find(p => p.type === 'month') || {}).value, dd = (parts.find(p => p.type === 'day') || {}).value;
  if (!/^\d+$/.test(m || '') || !/^\d+$/.test(dd || '')) return null;   // 윤달 제외
  return [+m, +dd];
}
const mmdd = (d) => (d.getMonth() + 1) * 100 + d.getDate();
function inFixed(d, from, to){
  const a = +from.replace('-', ''), b = +to.replace('-', ''), x = mmdd(d);
  return a <= b ? (x >= a && x <= b) : (x >= a || x <= b);
}
function inLunar(d, w){
  for (let j = -(w.after || 0); j <= (w.before || 0); j++){
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + j, 12);
    const l = lunarMD(x);
    if (l && l[0] === w.month && l[1] === w.day) return true;
  }
  return false;
}
const eventInCountry = (ev, c) => ev.countries === '*' || ev.countries.includes(c);
function eventApplies(ev, d, c){
  if (!eventInCountry(ev, c)) return false;
  if (ev.when.type === 'fixed') return inFixed(d, ev.when.from, ev.when.to);
  if (ev.when.type === 'lunar') return inLunar(d, ev.when);
  if (ev.when.type === 'birthday'){
    const b = store.get('bday', null); if (!b || !b.m || !b.d) return false;
    const leap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const day = (b.m === 2 && b.d === 29 && !leap(d.getFullYear())) ? 28 : b.d;   // 2월 29일생은 평년엔 28일
    return d.getMonth() + 1 === b.m && d.getDate() === day;
  }
  return false;
}
let evPreview = 'auto';   // 개발자 테스트용 (저장 안 함)
function activeEvent(){
  if (evPreview !== 'auto') return EVENTS.find(e => e.id === evPreview) || null;
  const d = new Date();
  return EVENTS.find(e => eventApplies(e, d, country)) || null;
}
