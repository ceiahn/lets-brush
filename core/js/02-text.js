'use strict';

/* =========================================================
   2-2. 번역 엔진 (v0.49.0 모듈화 2단계: 앱 02-lang.js 에서 나눔)
      t('키', {n, …}) · tList · lookup · 받침 조사 {이|가} · 복수형 키_one/_other · 받는 언어팩(installPack) · 글꼴(applyFont)
      앱과의 약속: 앱 02-lang.js 에 PACK_KO · PACK_EN · PACK_CATALOG. 공통 문구는 02-strings.js 의 CORE_TEXT
      v0.51.0 addText(): 뒤에 읽는 파일이 자기 글을 넣음 (극장 이야기 파일 16-th-s*.js)
      읽는 순서: 앱 02-lang.js → core 02-strings.js → 이 파일 (이름순 = 번호순)
   ========================================================= */
// 공통 문구(CORE_TEXT)를 앱 문구 밑에 깔아 줌 (같은 키는 앱 글이 이김)
const EXTRA_TEXT = [];                                                     // v0.51.0 addText 로 더한 글 (이야기 파일 등)
const withCore = (p) => {
  const c = typeof CORE_TEXT === 'object' && CORE_TEXT[p.meta.code]; if (c) p.strings = Object.assign({}, c, p.strings);
  EXTRA_TEXT.forEach(tx => { const x = tx[p.meta.code]; if (x) Object.keys(x).forEach(k => { if (p.strings[k] === undefined) p.strings[k] = x[k]; }); });
  return p;
};
/* v0.51.0 addText({ ko:{ 키:글 }, en:{…}, ja:{…} }): 뒤에 읽는 파일(극장 이야기 등)이 자기 글을 직접 넣음
   이미 있는 팩에 바로 넣고, 나중에 받는 팩(installPack)에도 넣음. 같은 키가 팩에 이미 있으면 팩 글이 이김 */
function addText(tx){
  EXTRA_TEXT.push(tx);
  Object.values(packs).forEach(p => { const x = tx[p.meta.code]; if (x) Object.keys(x).forEach(k => { if (p.strings[k] === undefined) p.strings[k] = x[k]; }); });
}
const packs = { ko:withCore(PACK_KO), en:withCore(PACK_EN) };
store.get('packs', []).forEach(code => {
  const p = store.get('pack_' + code, null);
  if (p && p.meta && p.strings) packs[code] = withCore(p);
});
// 받은 언어팩보다 새 버전이 있으면 갱신 (샘플은 바로 교체, 서버 팩은 아래 packUpdate 가 다시 받음)
PACK_CATALOG.forEach(e => {
  const p = packs[e.code];
  if (p && e.sample && !e.url && (p.meta.version || 1) < (e.sample.meta.version || 1)){
    packs[e.code] = withCore(JSON.parse(JSON.stringify(e.sample)));
    store.set('pack_' + e.code, packs[e.code]);
  }
});

const detectLang = () => {
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return packs[nav] ? nav : 'en';
};
let lang = store.get('lang', null);
if (!packs[lang]) lang = detectLang();

const EV_ALIAS = {};   // v0.39.0 같은 글을 쓰는 이벤트 (예: 나라마다 날짜가 다른 어린이날 kidsday_mx → childrensday). 3. 이벤트 엔진에서 채움
function lookup(key){
  for (const code of [lang, 'en', 'ko']){
    const p = packs[code];
    if (p && p.strings[key] !== undefined) return p.strings[key];
  }
  const m = /^event\.([^.]+)\.(.+)$/.exec(key);
  if (m && EV_ALIAS[m[1]]) return lookup('event.' + EV_ALIAS[m[1]] + '.' + m[2]);
  return null;
}
function hasBatchim(word){
  const s = String(word || ''), c = s.charCodeAt(s.length - 1) - 0xAC00;
  return c >= 0 && c <= 11171 && c % 28 !== 0;
}
function format(str, params){
  return String(str).replace(/\{(\w+)(?:\|([^}]*))?\}/g, (m, k, opt) => {
    if (opt){ const [a, b] = opt.split('/'); return hasBatchim(params[k]) ? a : b; }
    return params[k] !== undefined ? params[k] : m;
  });
}
// t('키', {n:3, item:'왕관'})
function t(key, params = {}){
  let v = null;
  if (typeof params.n === 'number'){
    try{ v = lookup(key + '_' + new Intl.PluralRules(lang).select(params.n)); }catch(e){}
    if (v === null) v = lookup(key + '_other');
  }
  if (v === null) v = lookup(key);
  if (v === null) return key;
  if (Array.isArray(v)) v = pick(v);
  return format(v, params);
}
const tList = (key) => { const v = lookup(key); return Array.isArray(v) ? v : (v ? [v] : []); };

async function installPack(entry){
  let pack;
  if (entry.url){
    const res = await fetch(entry.url);
    if (!res.ok) throw new Error('download failed');
    pack = await res.json();
  } else {
    await new Promise(r => setTimeout(r, 700));   // 샘플: 받는 흉내
    pack = JSON.parse(JSON.stringify(entry.sample));
  }
  if (!pack.meta || !pack.strings) throw new Error('bad pack');
  packs[pack.meta.code] = withCore(pack);
  store.set('pack_' + pack.meta.code, pack);
  const list = store.get('packs', []);
  if (!list.includes(pack.meta.code)) store.set('packs', list.concat(pack.meta.code));
  return pack;
}

/* v0.52.0 받는 언어팩 (lang/<code>.json) 저절로 챙기기: 앱을 연 뒤 한 번
   · 받아 둔 팩이 목록(PACK_CATALOG)의 version 보다 낮으면 새로 받음 (번역을 고치면 기기에도 반영)
   · 처음 여는 기기(언어를 고른 적 없음)인데 기기 언어 팩이 목록에 있으면 받아서 그 언어로 바꿈 (일본 폰 → 일본어)
   앱과의 약속: 바꾼 뒤 화면을 다시 그리는 setLang(code) */
async function packUpdate(){
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  for (const e of PACK_CATALOG){
    if (!e.url) continue;
    const p = packs[e.code], old = p && (p.meta.version || 1) < (e.version || 1), first = !p && e.code === nav && !store.get('lang', null);
    if (!old && !first) continue;
    try{
      await installPack(e);
      if (typeof setLang === 'function' && (first ? !store.get('lang', null) : lang === e.code)) setLang(e.code);
    }catch(err){}                                                          // 인터넷이 없으면 다음에
  }
}
setTimeout(packUpdate, 1200);

const loadedFonts = new Set();
function applyFont(){
  const f = packs[lang].meta.font;
  if (f && f.url && !loadedFonts.has(f.url)){
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = f.url;
    document.head.appendChild(l); loadedFonts.add(f.url);
  }
  document.documentElement.style.setProperty('--font', f ? f.family : "'Jua'");
}
