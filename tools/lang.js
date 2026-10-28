'use strict';
/* 언어팩 도구 (v0.52.0): 받는 언어(apps/<앱>/lang/<code>.json) 점검 · 번역 틀 만들기 · 합치기
     node tools/lang.js                       점검: 언어마다 빠진 글 수 · {pet} 같은 자리표시가 틀린 곳 · 목록 version 과 파일 version
     node tools/lang.js todo es               번역할 것만 모은 틀 → lang-work/es.todo.json (영어 원문 + 한국어 참고, "tr" 칸만 채우면 됨)
     node tools/lang.js todo es --name Español --tts es-ES     (처음 만드는 언어면 이름 · 목소리도)
     node tools/lang.js merge es              채운 틀을 apps/<앱>/lang/es.json 에 합치고 version 올림 + 02-lang.js 의 PACK_CATALOG 도 맞춤
   기준 글 = 영어 (앱 문구 PACK_EN + 공통 CORE_TEXT.en + 극장 이야기 addText + 펫 이름). 빠진 글은 앱에서 영어로 나옴 (깨지지 않음)
   복수형: 영어 _one/_other 는 그 언어 규칙(Intl.PluralRules)에 있는 꼴만 요구 (일본어는 _other 만, 러시아어는 _one/_few/_many/_other)
   한국어 받침 꼴 {boss|이/가} 는 한국어 전용 → 다른 언어는 {boss} 로 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const APP = opt('--app') || 'lets-brush', DIR = path.join(ROOT, 'apps', APP), LANG_DIR = path.join(DIR, 'lang'), WORK = path.join(ROOT, 'lang-work');

function loadSources(){
  const ctx = { console, window:{}, document:{ createElement:() => ({}), querySelector:() => null }, navigator:{ language:'en' }, EXTRA:[] };
  ctx.addText = (tx) => ctx.EXTRA.push(tx);
  vm.createContext(ctx);
  const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename:f });
  run(path.join(DIR, 'js', '02-lang.js'));
  run(path.join(ROOT, 'core', 'js', '02-strings.js'));
  run(path.join(ROOT, 'core', 'js', '13-pet-art.js'));
  for (const f of fs.readdirSync(path.join(DIR, 'js')).sort()) if (/^1\d-th-/.test(f) && f !== '16-th-art.js') run(path.join(DIR, 'js', f));
  const g = (n) => vm.runInContext(n, ctx);
  const PETS = g('PetGen.build()'), CORE = g('CORE_TEXT'), EN = g('PACK_EN').strings, KO = g('PACK_KO').strings, CAT = g('PACK_CATALOG');
  const base = { en:Object.assign({}, CORE.en, EN), ko:Object.assign({}, CORE.ko, KO) };
  const group = {};
  Object.keys(CORE.en).forEach(k => group[k] = '공통');
  Object.keys(EN).forEach(k => group[k] = /^item\./.test(k) ? '아이템' : '앱');
  ctx.EXTRA.forEach(tx => ['en', 'ko'].forEach(c => Object.entries(tx[c] || {}).forEach(([k, v]) => { if (base[c][k] === undefined) base[c][k] = v; if (c === 'en') group[k] = group[k] || '극장'; })));
  Object.entries(PETS).forEach(([id, P]) => { ['en', 'ko'].forEach(c => { if (P.names && P.names[c]) base[c]['pet.' + id] = P.names[c]; }); group['pet.' + id] = '펫 이름'; });
  const petLangs = new Set(Object.values(PETS).flatMap(P => Object.keys(P.names || {})));
  return { base, group, CORE, CAT, petLangs, PETS };
}

const PLURAL = /_(zero|one|two|few|many|other)$/;
const marks = (v) => [...new Set([...String(Array.isArray(v) ? v.join(' ') : v).matchAll(/\{(\w+)(?:\|[^}]*)?\}/g)].map(m => m[1]))].sort().join(',');
function needed(src, code){                                   // 이 언어에 있어야 될 키 목록
  let cats; try{ cats = new Intl.PluralRules(code).resolvedOptions().pluralCategories; }catch(e){ cats = ['one', 'other']; }
  const out = new Set();
  for (const k of Object.keys(src.base.en)){
    const m = PLURAL.exec(k);
    if (!m){ out.add(k); continue; }
    const stem = k.slice(0, -m[0].length);
    cats.forEach(cat => out.add(stem + '_' + cat));
  }
  return [...out];
}
const enOf = (src, k) => { const m = PLURAL.exec(k); return src.base.en[k] !== undefined ? src.base.en[k] : m ? src.base.en[k.slice(0, -m[0].length) + '_other'] : undefined; };
const koOf = (src, k) => { const m = PLURAL.exec(k); return src.base.ko[k] !== undefined ? src.base.ko[k] : m ? src.base.ko[k.slice(0, -m[0].length) + '_other'] : undefined; };
const readPack = (code) => { const f = path.join(LANG_DIR, code + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };

function check(src){
  const errors = [], report = [];
  const files = fs.existsSync(LANG_DIR) ? fs.readdirSync(LANG_DIR).filter(f => f.endsWith('.json')) : [];
  for (const f of files){
    const code = f.replace(/\.json$/, '');
    let pack;
    try{ pack = JSON.parse(fs.readFileSync(path.join(LANG_DIR, f), 'utf8')); }catch(e){ errors.push(`lang/${f}: JSON 이 깨짐 (${e.message})`); continue; }
    if (!pack.meta || pack.meta.code !== code || !pack.strings) { errors.push(`lang/${f}: meta.code 가 "${code}" 가 아니거나 strings 가 없음`); continue; }
    const cat = src.CAT.find(e => e.code === code);
    if (!cat) errors.push(`lang/${f}: 02-lang.js PACK_CATALOG 에 없음`);
    else if ((cat.version || 1) !== (pack.meta.version || 1)) errors.push(`lang/${f}: version ${pack.meta.version} 인데 PACK_CATALOG 는 ${cat.version} (같게 맞춰야 기기에서 새로 받음)`);
    const S = Object.assign({}, src.CORE[code] || {}, pack.strings);
    const miss = {};
    for (const k of needed(src, code)){
      if (src.group[k] === '펫 이름' && src.petLangs.has(code)) continue;     // 펫 이름이 코드에 있는 언어 (한 · 영 · 일)
      if (S[k] === undefined){ const g = src.group[k] || src.group[k.replace(PLURAL, '_other')] || '앱'; miss[g] = (miss[g] || 0) + 1; continue; }
      const e = enOf(src, k);
      if (e !== undefined && marks(e) !== marks(S[k])) errors.push(`lang/${f} "${k}": 자리표시가 영어와 다름 (영어 {${marks(e)}} · 이 언어 {${marks(S[k])}})`);
    }
    const total = Object.values(miss).reduce((a, b) => a + b, 0);
    report.push(`${code} (${pack.meta.name}, v${pack.meta.version}): ${total ? '빠진 글 ' + total + '개 (' + Object.entries(miss).map(([g, n]) => g + ' ' + n).join(' · ') + ') → 앱에서는 영어로' : '빠진 글 없음'}`);
  }
  for (const e of src.CAT) if (e.url && !files.includes(e.code + '.json')) errors.push(`PACK_CATALOG 의 ${e.code} 파일(lang/${e.code}.json)이 없음`);
  return { errors, report };
}

function todo(src, code){
  const pack = readPack(code), S = Object.assign({}, src.CORE[code] || {}, pack ? pack.strings : {});
  const items = {};
  for (const k of needed(src, code)){
    if (src.group[k] === '펫 이름' && src.petLangs.has(code)) continue;
    if (S[k] !== undefined) continue;
    items[k] = { group:src.group[k] || src.group[k.replace(PLURAL, '_other')] || '앱', en:enOf(src, k), ko:koOf(src, k), tr:'' };
  }
  const meta = pack ? pack.meta : { code, name:opt('--name') || code, dir:'ltr', tts:opt('--tts') || code, version:0 };
  fs.mkdirSync(WORK, { recursive:true });
  const out = path.join(WORK, code + '.todo.json');
  fs.writeFileSync(out, JSON.stringify({ how:'각 항목의 tr 칸에 번역을 넣으세요. {pet} {boss} {n} 같은 자리표시는 그대로 두고, 배열이면 배열로. 반짝이 = Sparkle 의 그 언어 이름 (일본어는 キラリ). 다 넣은 뒤 node tools/lang.js merge ' + code,
    meta, items }, null, 1) + '\n');
  console.log(`${path.relative(ROOT, out)}: 번역할 글 ${Object.keys(items).length}개`);
}

function merge(code){
  const f = path.join(WORK, code + '.todo.json');
  if (!fs.existsSync(f)){ console.error('틀이 없음: ' + path.relative(ROOT, f)); process.exit(1); }
  const w = JSON.parse(fs.readFileSync(f, 'utf8'));
  const pack = readPack(code) || { meta:w.meta, strings:{} };
  let n = 0;
  for (const [k, it] of Object.entries(w.items)) if (it.tr !== '' && it.tr !== null && it.tr !== undefined){ pack.strings[k] = it.tr; n++; }
  pack.meta.version = (pack.meta.version || 0) + 1;
  fs.mkdirSync(LANG_DIR, { recursive:true });
  fs.writeFileSync(path.join(LANG_DIR, code + '.json'), JSON.stringify(pack, null, 1) + '\n');
  const lp = path.join(DIR, 'js', '02-lang.js');
  let ls = fs.readFileSync(lp, 'utf8');
  const re = new RegExp(`\\{ code:'${code}', name:'[^']*', url:'lang/${code}\\.json', version:\\d+ \\}`);
  const entry = `{ code:'${code}', name:'${pack.meta.name.replace(/'/g, "\\'")}', url:'lang/${code}.json', version:${pack.meta.version} }`;
  if (re.test(ls)) ls = ls.replace(re, entry);
  else ls = ls.replace(/(const PACK_CATALOG = \[[^\n]*\n(?:  \{[^\n]*\}\n?)*?)(  \{[^\n]*\})\n\];/, (m, a, last) => `${a}${last},\n  ${entry}\n];`);
  fs.writeFileSync(lp, ls);
  console.log(`lang/${code}.json: ${n}개 넣음 · version ${pack.meta.version}. 02-lang.js PACK_CATALOG 맞춤. 다음: node tools/sync-files.js (sw 목록)`);
}

if (require.main === module){
  const src = loadSources(), cmd = args[0] || 'check';
  if (cmd === 'todo') todo(src, args[1]);
  else if (cmd === 'merge') merge(args[1]);
  else {
    const r = check(src);
    r.report.forEach(x => console.log('· ' + x));
    r.errors.forEach(x => console.log('✗ ' + x));
    process.exit(r.errors.length ? 1 : 0);
  }
}
module.exports = { loadSources, check };
