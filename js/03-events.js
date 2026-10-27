'use strict';

/* =========================================================
   3. 나라 & 이벤트 엔진
      when.type: 'fixed' (양력 MM-DD ~ MM-DD, 해 넘김 가능)
                 'lunar' (음력 월/일, 앞뒤 며칠) — 브라우저 음력 달력으로 매년 자동 계산
                 'nth' (v0.39.0, 몇째 무슨 요일: month 1~12, weekday 0 일 ~ 6 토, n 1~5 · -1 마지막, 앞뒤 며칠) — 추수감사절 등
                 'easter' (v0.39.0, 부활절 날짜를 해마다 계산, before · after 며칠)
      text: 다른 이벤트의 글을 같이 씀 (나라마다 날짜만 다른 어린이날 등). 나라별 기념일 정리: docs/시장_언어_가격.md
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
  // v0.39.0 나라별 기념일 (영어를 써도 미국 · 영국 · 호주는 기념일이 다름 → 언어가 아니라 "사는 나라"로 고름)
  { id:'lunarny',      icon:'🧧', countries:['CN','TW','VN','SG'], when:{ type:'lunar', month:1, day:1, before:1, after:2 }, look:{ hand:'hand_bok' }, effect:'star' },
  { id:'easter',       icon:'🐣', countries:['US','GB','CA','AU','NZ','IE','DE','FR','ES','IT','BR','MX','PH'], when:{ type:'easter', before:2, after:1 }, look:{ head:'head_bunny', hand:'hand_flower' }, effect:'petal' },
  { id:'thanksgiving', icon:'🦃', countries:['US'], when:{ type:'nth', month:11, weekday:4, n:4, after:1 }, look:{ head:'head_party' }, effect:'petal' },
  { id:'thanksgivingca', text:'thanksgiving', icon:'🦃', countries:['CA'], when:{ type:'nth', month:10, weekday:1, n:2, before:2 }, look:{ head:'head_party' }, effect:'petal' },
  { id:'july4',        icon:'🎆', countries:['US'], when:{ type:'fixed', from:'07-04', to:'07-04' }, look:{ head:'head_party' }, effect:'star' },
  { id:'bonfire',      icon:'🎆', countries:['GB'], when:{ type:'fixed', from:'11-05', to:'11-05' }, look:{}, effect:'star' },
  { id:'setsubun',     icon:'👹', countries:['JP'], when:{ type:'fixed', from:'02-03', to:'02-03' }, look:{}, effect:'star' },
  { id:'hinamatsuri',  icon:'🎎', countries:['JP'], when:{ type:'fixed', from:'03-03', to:'03-03' }, look:{ hand:'hand_flower' }, effect:'petal' },
  { id:'tanabata',     icon:'🎋', countries:['JP'], when:{ type:'fixed', from:'07-07', to:'07-07' }, look:{}, effect:'star' },
  { id:'shichigosan',  icon:'👘', countries:['JP'], when:{ type:'fixed', from:'11-15', to:'11-15' }, look:{ head:'head_crown' }, effect:'star' },
  // 어린이날: 나라마다 날짜만 다름 (글은 childrensday 를 같이 씀)
  { id:'kidsday_mx', text:'childrensday', icon:'🎈', countries:['MX'], when:{ type:'fixed', from:'04-30', to:'04-30' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'kidsday_tw', text:'childrensday', icon:'🎈', countries:['TW'], when:{ type:'fixed', from:'04-04', to:'04-04' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'kidsday_cn', text:'childrensday', icon:'🎈', countries:['CN','VN'], when:{ type:'fixed', from:'06-01', to:'06-01' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'kidsday_id', text:'childrensday', icon:'🎈', countries:['ID'], when:{ type:'fixed', from:'07-23', to:'07-23' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'kidsday_br', text:'childrensday', icon:'🎈', countries:['BR'], when:{ type:'fixed', from:'10-12', to:'10-12' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'kidsday_in', text:'childrensday', icon:'🎈', countries:['IN'], when:{ type:'fixed', from:'11-14', to:'11-14' }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'kidsday_th', text:'childrensday', icon:'🎈', countries:['TH'], when:{ type:'nth', month:1, weekday:6, n:2 }, look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  { id:'newyear',      icon:'🎉', countries:'*', when:{ type:'fixed', from:'12-31', to:'01-02' }, look:{ head:'head_party' }, effect:'star' }
];
EVENTS.forEach(e => { if (e.text) EV_ALIAS[e.id] = e.text; });
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

let lunarFmt;   // v0.41.0 처음 쓸 때 만듦 (음력 행사가 없는 나라는 안 만듦)
function lunarMD(d){
  if (lunarFmt === undefined){
    lunarFmt = null;
    try{ lunarFmt = new Intl.DateTimeFormat('en-u-ca-chinese', { month:'numeric', day:'numeric' }); }catch(e){}
    // v0.28.4 음력 달력을 모르는 브라우저는 말없이 양력으로 계산함 → 1월 1일을 설날로 착각하지 않게 그땐 음력 행사를 끔
    try{ if (lunarFmt && lunarFmt.resolvedOptions().calendar !== 'chinese') lunarFmt = null; }catch(e){ lunarFmt = null; }
  }
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
// 그달 n째 무슨 요일 (n = -1 이면 마지막)
function nthDay(y, month, weekday, n){
  if (n > 0){ const first = new Date(y, month - 1, 1).getDay(); return 1 + (weekday - first + 7) % 7 + (n - 1) * 7; }
  const last = new Date(y, month, 0), ld = last.getDate(); return ld - (last.getDay() - weekday + 7) % 7;
}
// 부활절 (그레고리력, 익명 계산법) → [월, 일]
function easterMD(y){
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return [Math.floor((h + l - 7 * m + 114) / 31), ((h + l - 7 * m + 114) % 31) + 1];
}
function nearDay(d, y, mo, day, w){                                 // d 가 그날의 before 일 전 ~ after 일 뒤 안인지
  const t0 = new Date(y, mo - 1, day, 12).getTime(), x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime(), diff = Math.round((x - t0) / 86400000);
  return diff >= -(w.before || 0) && diff <= (w.after || 0);
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
  if (ev.when.type === 'nth'){ const w = ev.when, y = d.getFullYear(); return nearDay(d, y, w.month, nthDay(y, w.month, w.weekday, w.n), w); }
  if (ev.when.type === 'easter'){ const y = d.getFullYear(), [mo, day] = easterMD(y); return nearDay(d, y, mo, day, ev.when); }
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
