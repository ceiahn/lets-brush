'use strict';
/* 극장 대사 AI 음성 만들기 (v0.52.5 · v0.52.6 이름 자리) — Azure 음성 (Speech 서비스, 무료 F0 로 충분)
   준비: 환경 비밀값 AZURE_SPEECH_KEY · AZURE_SPEECH_REGION (예: koreacentral), 네트워크 허용 <지역>.tts.speech.microsoft.com
   순서:
     SPEAKERS=1 node tests/theater-check.js     대사마다 누가 말하는지 모음 → tools/voice/speakers.json (이야기를 고치거나 더한 뒤)
     node tools/voice.js voices ko-KR           그 언어 Azure 목소리 목록 (이름 · 성별 · 종류)
     node tools/voice.js sample ko [역할…]      역할마다 후보 목소리(cast.json try)로 대사 3줄 → lang-work/voice-samples/ko/<역할>__<목소리>.mp3
     (듣고 tools/voice/cast.json 의 pick 에 고른 목소리)
     node tools/voice.js script ko              만들 대사 목록 · 글자 수 · 요청 수 확인 (lang-work/voice/ko.tsv)
     node tools/voice.js build ko [--limit 50]  대사 파일 만들기 → apps/lets-brush/voice/ko/*.mp3 + voice/ko.json (이미 같은 것은 건너뜀)
   파일 이름 = 문구키.내용표시8자.mp3 → 글 · 목소리 · 높낮이를 바꾸면 새 이름 (기기에 저장된 예전 파일과 안 섞임)
   이름 자리:
     {boss}  대장 세균마다 대사 전체를 따로 (키@세균id)
     {pet} · {name}  대사를 "이름 앞 · 이름 · 이름 뒤"로 나눠 만들고 (키~0, 키~1), 이름은 따로:
        펫 기본 이름 (pn.역할.펫종류|뒷말) · 이름을 바꾼 펫 "친구" (pn.역할._|뒷말) · 알 (pn.역할.egg|뒷말)
        아이 이름: 앱이 부모님 녹음을 넣음. 녹음이 없을 때 쓸 "이름을 안 부르는 대사" 도 만듦 (키~x = 이름 뒤 글, 이름 앞 부르는 말 "우리" 등은 뺌)
        뒷말 = 이름 바로 뒤에 붙는 말 (한국어 조사 · 의 · 도 · 영어 's · 일본어 が の 등). 이름과 한 번에 읽어야 자연스러워서
        이름은 말하는 사람 목소리로 (해설이 부르는 이름은 해설 목소리). 아이 이름은 부모님 녹음이 있으면 그것 (앱)
        이름 조각은 많아서 여러 개를 한 번에 만든 뒤 쉬는 소리로 자름 (요청 수 절약). 개수가 안 맞으면 하나씩
     여러 개 중 고르는 말 (배열)  번호마다 (키#번호)
     {n} · {title} 이 든 대사 (제목 소개 · 다음 화 예고)  만들지 않음 → 기기 목소리 */
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), APP = path.join(ROOT, 'apps', 'lets-brush');
const CAST = JSON.parse(fs.readFileSync(path.join(__dirname, 'voice', 'cast.json'), 'utf8'));
const SPK_F = path.join(__dirname, 'voice', 'speakers.json');
const TTS_LOCALE = { ko:'ko-KR', en:'en-US', ja:'ja-JP' };
const DEFAULT_ROLE = { 'th.d.brush':'hero', 'th.d.foam':'hero', 'th.d.rinse':'hero', 'th.d.pet':'pet', 'th.d.song':'nar', 'th.d.bye':'boss', 'th.gagOpen':'nar', 'th.gagEnd':'nar', 'th.end':'nar', 'th.endName':'nar' };
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

let SRC = null;
const src = () => SRC || (SRC = require('./lang.js').loadSources());
function texts(lang){
  if (lang === 'ko' || lang === 'en') return src().base[lang];
  return Object.assign({}, src().CORE[lang] || {}, JSON.parse(fs.readFileSync(path.join(APP, 'lang', lang + '.json'), 'utf8')).strings);
}
// 앱과 같게: format (한국어 받침 꼴 {x|이/가}) · 읽을 글 다듬기 (core/js/08-sound.js clean) · 펫 기본 이름 (core/js/14-eggs.js defName)
const hasBatchim = (w) => { const s = String(w || ''), c = s.charCodeAt(s.length - 1) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
const format = (str, p) => String(str).replace(/\{(\w+)(?:\|([^}]*))?\}/g, (m, k, o) => { if (o){ const [a, b] = o.split('/'); return hasBatchim(p[k]) ? a : b; } return p[k] !== undefined ? p[k] : m; });
const clean = (s) => String(s).replace(/\p{Extended_Pictographic}|️|…/gu, '').replace(/[~〜～()（）「」『』“”"♥♡★☆·]/g, ' ').replace(/(\p{L})\1{2,}/gu, '$1$1').replace(/\s+/g, ' ').trim();
const defName = (c, nm) => { const w = String(nm).split(' ').pop(); return ['ko', 'ja', 'zh'].includes(c) ? w.slice(0, 1) + w.slice(0, 1) : w; };
const xml = (s) => s.replace(/[<>&'"]/g, (c) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c]));
const SLOT = /\{(pet|name)\}((?:\{(?:pet|name)\|[^}]*\})?(?:'s|[^\s,.!?、。！？~…()]*))/g;

/* 만들 것 목록: items = [{ key, role, text }], parts = { 키: [...] }, slots = [{ type, role, suf }] */
function plan(lang){
  if (!fs.existsSync(SPK_F)){ console.error('tools/voice/speakers.json 이 없음 → SPEAKERS=1 node tests/theater-check.js 먼저'); process.exit(1); }
  const T = texts(lang), spk = Object.assign({}, DEFAULT_ROLE, JSON.parse(fs.readFileSync(SPK_F, 'utf8')));
  const bosses = Object.keys(T).filter(k => /^boss\.[a-z0-9]+$/.test(k)).map(k => k.slice(5));
  const items = [], parts = {}, slots = new Map(), skipped = [];
  const word = CAST.petWord[lang] || 'friend';
  for (const [key, role] of Object.entries(spk).sort()){
    const tpl = T[key];
    if (tpl === undefined) continue;
    if (Array.isArray(tpl)){ tpl.forEach((x, i) => { if (!/\{/.test(x)) items.push({ key:key + '#' + i, role, text:clean(x) }); }); continue; }
    if (/\{(n|title)\b/.test(tpl)){ skipped.push(key); continue; }
    if (/\{boss/.test(tpl)){ bosses.forEach(b => items.push({ key:key + '@' + b, role, text:clean(format(tpl, { pet:word, boss:T['boss.' + b] || b })) })); continue; }
    if (/\{(pet|name)\}/.test(tpl)){
      const list = []; let last = 0, seg = 0; SLOT.lastIndex = 0; let m;
      const pushSeg = (s) => { const tx = clean(format(s, { pet:word, name:word })).replace(/^[\s,、，.。]+/, ''); if (tx && /[\p{L}\p{N}]/u.test(tx)){ const k = key + '~' + seg; items.push({ key:k, role, text:tx }); list.push({ k }); } seg++; };
      while ((m = SLOT.exec(tpl))){
        pushSeg(tpl.slice(last, m.index));
        list.push({ slot:m[1], suf:m[2], role }); slots.set(m[1] + '|' + role + '|' + m[2], { type:m[1], role, suf:m[2] });
        last = m.index + m[0].length;
      }
      pushSeg(tpl.slice(last));
      if (/\{name\}/.test(tpl)){                                              // 녹음이 없을 때: 이름 없이 (이름 뒤 글, 없으면 앞 글)
        const after = clean(format(tpl.slice(last), { pet:word })).replace(/^[\s,、，.。]+/, ''), before = clean(format(tpl.slice(0, tpl.indexOf('{name}')), { pet:word }));
        const nx = after || before;
        items.push({ key:key + '~x', role, text:nx.charAt(0).toUpperCase() + nx.slice(1) });
      }
      parts[key] = list; continue;
    }
    items.push({ key, role, text:clean(tpl) });
  }
  // 이름 조각
  const names = [];
  const pets = src().PETS;
  for (const s of slots.values()){
    if (s.type === 'name') continue;                                           // 아이 이름은 부모님 녹음 (만들지 않음)
    const one = (k, nm) => names.push({ key:`pn.${s.role}.${k}|${s.suf}`, role:s.role, text:clean(format(`{${s.type}}${s.suf}`, { [s.type]:nm })) });
    one('_', word);
    if (s.type === 'pet'){
      one('egg', T['th.eggName'] || word);
      for (const [id, P] of Object.entries(pets)){ const nm = T['pet.' + id + '.def'] || (P.names && P.names[lang] && defName(lang, P.names[lang])); if (nm) one(id, nm); }
    }
  }
  return { items, parts, names, skipped };
}

function azure(pathPart, body, headers = {}){
  const key = process.env.AZURE_SPEECH_KEY, region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region){ console.error('AZURE_SPEECH_KEY · AZURE_SPEECH_REGION 환경 값이 없음 (apps/lets-brush/docs/극장_음성.md)'); process.exit(1); }
  const a = ['-sS', '--fail-with-body', '-H', 'Ocp-Apim-Subscription-Key: ' + key, '-H', 'User-Agent: tokkiyou-voice'];
  Object.entries(headers).forEach(([k, v]) => a.push('-H', `${k}: ${v}`));
  if (body !== undefined) a.push('-X', 'POST', '--data-binary', '@-');
  a.push(`https://${region}.tts.speech.microsoft.com${pathPart}`);
  return execFileSync('curl', a, { input:body, maxBuffer:64 << 20 });
}
const voiceOf = (lang, role) => { const c = (CAST[lang] || {})[role] || CAST[lang].prop; return { name:c.pick || c.try[0], pitch:c.pitch || '0%', rate:c.rate || '0%' }; };
const ssml = (lang, v, inner) => `<speak version="1.0" xml:lang="${TTS_LOCALE[lang]}"><voice name="${v.name}"><prosody pitch="${v.pitch}" rate="${v.rate}">${inner}</prosody></voice></speak>`;
let last = 0, reqs = 0;
async function synth(lang, v, inner){
  const gap = 60000 / +(process.env.VOICE_RPM || 18);                         // 무료(F0)는 1분에 요청 수 제한이 있어서 천천히
  for (let tryN = 0; tryN < 5; tryN++){
    const w = last + gap - Date.now(); if (w > 0) await new Promise(r => setTimeout(r, w));
    last = Date.now(); reqs++;
    try{ return azure('/cognitiveservices/v1', ssml(lang, v, inner), { 'Content-Type':'application/ssml+xml', 'X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3' }); }
    catch(e){ const m = String(e.stdout || e.message); if (tryN === 4 || !/429|Too Many|5\d\d/.test(m)) throw new Error(m.slice(0, 300)); await new Promise(r => setTimeout(r, 15000 * (tryN + 1))); }
  }
}
/* 짧은 조각 여러 개를 한 번에: 사이에 1.2초 쉼 → 쉬는 곳에서 자름. 개수가 안 맞으면 null */
function splitBySilence(mp3, n){
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-')), f = path.join(dir, 'all.mp3');
  fs.writeFileSync(f, mp3);
  let log = '';
  try{ execFileSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'silencedetect=noise=-42dB:d=0.7', '-f', 'null', '-'], { stdio:['ignore', 'ignore', 'pipe'] }); }
  catch(e){ log = String(e.stderr || ''); }
  if (!log) log = String(execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${f}" -af silencedetect=noise=-42dB:d=0.7 -f null - 2>&1`]));
  const st = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]), en = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  const dur = +((log.match(/Duration: (\d+):(\d+):([\d.]+)/) || []).slice(1).reduce((a, x, i) => a + x * [3600, 60, 1][i], 0));
  const cuts = []; let from = 0;
  for (let i = 0; i < st.length; i++){ if (st[i] - from > .15) cuts.push([from, st[i]]); from = en[i] !== undefined ? en[i] : dur; }
  if (dur - from > .15) cuts.push([from, dur]);
  if (cuts.length !== n){ fs.rmSync(dir, { recursive:true, force:true }); return null; }
  const out = cuts.map(([a, b], i) => { const o = path.join(dir, i + '.mp3');
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', f, '-ss', Math.max(0, a - .05).toFixed(3), '-to', (b + .08).toFixed(3), '-ac', '1', '-b:a', '40k', o]);
    return fs.readFileSync(o); });
  fs.rmSync(dir, { recursive:true, force:true });
  return out;
}
const fileFor = (key, h) => key.replace(/[^A-Za-z0-9._#@~-]/g, (c) => c === '|' ? '+' : '_') + '.' + crypto.createHash('sha1').update(key).digest('hex').slice(0, 4) + h + '.mp3';
const hashOf = (v, text) => crypto.createHash('sha1').update([v.name, v.pitch, v.rate, text].join('|')).digest('hex').slice(0, 8);

async function main(){
  const cmd = args[0], lang = args[1];
  if (cmd === 'voices'){
    const all = JSON.parse(azure('/cognitiveservices/voices/list').toString());
    all.filter(v => !lang || v.Locale === lang).forEach(v => console.log([v.ShortName, v.Gender, v.VoiceType, (v.StyleList || []).join('/'), (v.RolePlayList || []).join('/')].join('\t')));
    return;
  }
  if (cmd === 'split-test'){                                                   // 자르기 점검 (Azure 없이): 소리 · 쉼을 번갈아 만든 파일
    const n = 5, f = path.join(os.tmpdir(), 'split-test.mp3'), segs = [];
    for (let i = 0; i < n; i++){ segs.push(`sine=frequency=${300 + i * 80}:duration=${(.4 + i * .1).toFixed(1)}`); if (i < n - 1) segs.push('anullsrc=r=24000:cl=mono:d=1.2'); }
    const inputs = segs.flatMap(s => ['-f', 'lavfi', '-i', s]);
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', `${segs.map((_, i) => `[${i}:a]aresample=24000,aformat=channel_layouts=mono[a${i}]`).join(';')};${segs.map((_, i) => `[a${i}]`).join('')}concat=n=${segs.length}:v=0:a=1`, '-b:a', '48k', f]);
    const out = splitBySilence(fs.readFileSync(f), n);
    console.log(out ? `✓ ${out.length}개로 잘림 (${out.map(b => b.length).join(', ')} 바이트)` : '✗ 개수가 안 맞음');
    return;
  }
  if (!TTS_LOCALE[lang]){ console.error('언어: ko · en · ja'); process.exit(1); }
  const P = plan(lang);
  if (cmd === 'script'){
    const by = {}; P.items.forEach(l => { by[l.role] = by[l.role] || { n:0, c:0 }; by[l.role].n++; by[l.role].c += [...l.text].length; });
    fs.mkdirSync(path.join(ROOT, 'lang-work', 'voice'), { recursive:true });
    fs.writeFileSync(path.join(ROOT, 'lang-work', 'voice', lang + '.tsv'), P.items.concat(P.names).map(l => [l.key, l.role, voiceOf(lang, l.role).name, l.text].join('\t')).join('\n') + '\n');
    const groups = new Set(P.names.map(n => n.key.split('.')[0] + n.key.split('.')[1] + n.key.split('|')[1])).size;
    console.log(`${lang}: 대사 ${P.items.length}줄 · ${P.items.reduce((a, l) => a + [...l.text].length, 0)}자 · 이름 조각 ${P.names.length}개 (${groups}묶음) · 기기 목소리로 남는 것 ${P.skipped.length}줄`);
    console.log(`  요청 수 약 ${P.items.length + Math.ceil(P.names.length / 30)}번 → 1분에 ${process.env.VOICE_RPM || 18}번이면 약 ${Math.ceil((P.items.length + P.names.length / 30) / +(process.env.VOICE_RPM || 18))}분`);
    Object.entries(by).forEach(([r, x]) => console.log(`  ${r.padEnd(6)} ${String(x.n).padStart(4)}줄 ${String(x.c).padStart(6)}자  ${voiceOf(lang, r).name}`));
    return;
  }
  if (cmd === 'sample'){
    const roles = args.slice(2).length ? args.slice(2) : Object.keys(CAST[lang]);
    const dir = path.join(ROOT, 'lang-work', 'voice-samples', lang); fs.mkdirSync(dir, { recursive:true });
    for (const role of roles){
      const pool = P.items.filter(l => l.role === role && !/[@~#]/.test(l.key) && [...l.text].length >= 8).slice(0, 40);
      const three = [pool[0], pool[Math.floor(pool.length / 2)], pool[pool.length - 1]].filter(Boolean);
      if (!three.length) continue;
      for (const name of CAST[lang][role].try){
        const v = Object.assign(voiceOf(lang, role), { name });
        fs.writeFileSync(path.join(dir, `${role}__${name}.mp3`), await synth(lang, v, three.map(l => xml(l.text)).join('<break time="700ms"/>')));
        console.log(`  ${role} ${name} ✓`);
      }
    }
    console.log(`샘플 → ${path.relative(ROOT, dir)}`);
    return;
  }
  if (cmd === 'build'){
    const limit = +(opt('--limit') || 1e9);
    const dir = path.join(APP, 'voice', lang), manF = path.join(APP, 'voice', lang + '.json');
    fs.mkdirSync(dir, { recursive:true });
    const man = fs.existsSync(manF) ? JSON.parse(fs.readFileSync(manF, 'utf8')) : { dir:lang + '/', files:{} };
    let made = 0, kept = 0;
    const have = (key, file) => man.files[key] === file && fs.existsSync(path.join(dir, file));
    const save = () => fs.writeFileSync(manF, JSON.stringify(man, null, 1) + '\n');
    for (const l of P.items){                                                  // 대사 한 줄씩
      const v = voiceOf(lang, l.role), file = fileFor(l.key, hashOf(v, l.text));
      if (have(l.key, file)){ kept++; continue; }
      if (made >= limit) break;
      fs.writeFileSync(path.join(dir, file), await synth(lang, v, xml(l.text)));
      man.files[l.key] = file; made++;
      if (made % 20 === 0){ save(); console.log(`  ${made}줄 만듦…`); }
    }
    const todo = P.names.filter(n => !have(n.key, fileFor(n.key, hashOf(voiceOf(lang, n.role), n.text))));   // 이름 조각: 같은 목소리끼리 30개씩
    const byRole = {}; todo.forEach(n => (byRole[n.role] = byRole[n.role] || []).push(n));
    for (const [role, list] of Object.entries(byRole)){
      const v = voiceOf(lang, role);
      for (let i = 0; i < list.length && made < limit; i += 30){
        const chunk = list.slice(i, i + 30);
        let bufs = splitBySilence(await synth(lang, v, chunk.map(n => xml(n.text)).join('<break time="1200ms"/>')), chunk.length);
        if (!bufs){ bufs = []; for (const n of chunk) bufs.push(await synth(lang, v, xml(n.text))); }   // 자르기가 안 맞으면 하나씩
        chunk.forEach((n, j) => { const file = fileFor(n.key, hashOf(v, n.text)); fs.writeFileSync(path.join(dir, file), bufs[j]); man.files[n.key] = file; });
        made += chunk.length; save(); console.log(`  이름 조각 ${role} ${Math.min(i + 30, list.length)}/${list.length}`);
      }
    }
    const live = new Set(P.items.concat(P.names).map(l => l.key));
    Object.keys(man.files).forEach(k => { if (!live.has(k)) delete man.files[k]; });          // 없어진 대사
    const used = new Set(Object.values(man.files));
    fs.readdirSync(dir).forEach(f => { if (!used.has(f)) fs.unlinkSync(path.join(dir, f)); });   // 예전 파일
    man.parts = P.parts;
    man.voices = Object.fromEntries(Object.keys(CAST[lang]).filter(k => !['about'].includes(k)).map(r => [r, voiceOf(lang, r).name]));
    save();
    const size = fs.readdirSync(dir).reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
    console.log(`${lang}: 새로 ${made}개 · 그대로 ${kept}개 · 전체 ${Object.keys(man.files).length}/${live.size}개 · ${(size / 1048576).toFixed(1)}MB · Azure 요청 ${reqs}번`);
    return;
  }
  console.log('node tools/voice.js voices <locale> | sample <lang> [역할…] | script <lang> | build <lang> [--limit N] | split-test');
}
main().catch(e => { console.error(e.message || e); process.exit(1); });
