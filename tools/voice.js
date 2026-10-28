'use strict';
/* 극장 대사 AI 음성 만들기 (v0.52.5) — Azure 음성 (Speech 서비스, 무료 F0 로 충분)
   준비: 환경 비밀값 AZURE_SPEECH_KEY · AZURE_SPEECH_REGION (예: koreacentral), 네트워크 허용 <지역>.tts.speech.microsoft.com
   순서:
     SPEAKERS=1 node tests/theater-check.js     대사마다 누가 말하는지 모음 → tools/voice/speakers.json (이야기를 고치거나 더한 뒤)
     node tools/voice.js voices ko-KR           그 언어 Azure 목소리 목록 (이름 · 성별 · 종류)
     node tools/voice.js sample ko [역할…]      역할마다 후보 목소리(cast.json try)로 대사 3줄 → lang-work/voice-samples/ko/<역할>__<목소리>.mp3
     (듣고 tools/voice/cast.json 의 pick 에 고른 목소리)
     node tools/voice.js script ko              만들 대사 목록 · 글자 수 확인 (lang-work/voice/ko.tsv)
     node tools/voice.js build ko [--limit 50]  대사 파일 만들기 → apps/lets-brush/voice/ko/*.mp3 + voice/ko.json (이미 같은 것은 건너뜀)
   파일 이름 = 문구키(-세균id).내용표시8자.mp3 → 글 · 목소리 · 높낮이를 바꾸면 새 이름 (기기에 저장된 예전 파일과 안 섞임)
   이름 자리: {boss} → 대장 세균마다 따로 (키@세균id), {pet} → cast.json petWord (아이가 펫 이름을 바꿀 수 있어서 소리는 "친구"),
             {name} · {n} · {title} 이 든 대사와 여러 개 중 고르는 대사는 만들지 않음 (기기 목소리) */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), APP = path.join(ROOT, 'apps', 'lets-brush');
const CAST = JSON.parse(fs.readFileSync(path.join(__dirname, 'voice', 'cast.json'), 'utf8'));
const SPK_F = path.join(__dirname, 'voice', 'speakers.json');
const TTS_LOCALE = { ko:'ko-KR', en:'en-US', ja:'ja-JP' };
const DEFAULT_ROLE = { 'th.d.brush':'hero', 'th.d.foam':'hero', 'th.d.rinse':'hero', 'th.d.pet':'pet', 'th.d.song':'nar', 'th.d.bye':'boss', 'th.gagOpen':'nar', 'th.gagEnd':'nar' };
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

function texts(lang){
  const L = require('./lang.js'), src = L.loadSources();
  if (lang === 'ko' || lang === 'en') return src.base[lang];
  const f = path.join(APP, 'lang', lang + '.json');
  return Object.assign({}, src.CORE[lang] || {}, JSON.parse(fs.readFileSync(f, 'utf8')).strings);
}
// 앱의 format (한국어 받침 꼴 {x|이/가} 포함) · 읽을 글 다듬기 (core/js/08-sound.js 의 clean 과 같게)
const hasBatchim = (w) => { const s = String(w || ''), c = s.charCodeAt(s.length - 1) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
const format = (str, p) => String(str).replace(/\{(\w+)(?:\|([^}]*))?\}/g, (m, k, o) => { if (o){ const [a, b] = o.split('/'); return hasBatchim(p[k]) ? a : b; } return p[k] !== undefined ? p[k] : m; });
const clean = (s) => String(s).replace(/\p{Extended_Pictographic}|️|…/gu, '').replace(/[~〜～()（）「」『』“”"♥♡★☆·]/g, ' ').replace(/(\p{L})\1{2,}/gu, '$1$1').replace(/\s+/g, ' ').trim();
const xml = (s) => s.replace(/[<>&'"]/g, (c) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c]));

function lines(lang){
  if (!fs.existsSync(SPK_F)){ console.error('tools/voice/speakers.json 이 없음 → SPEAKERS=1 node tests/theater-check.js 먼저'); process.exit(1); }
  const T = texts(lang), spk = Object.assign({}, DEFAULT_ROLE, JSON.parse(fs.readFileSync(SPK_F, 'utf8')));
  const bosses = Object.keys(T).filter(k => /^boss\.[a-z0-9]+$/.test(k)).map(k => k.slice(5));
  const out = [], skipped = [];
  for (const [key, role] of Object.entries(spk).sort()){
    const tpl = T[key];
    if (tpl === undefined) continue;
    if (Array.isArray(tpl) || /\{(name|n|title)\b/.test(tpl)){ skipped.push(key); continue; }
    const base = { pet:CAST.petWord[lang] || 'friend' };
    if (/\{boss/.test(tpl)) bosses.forEach(b => out.push({ key:key + '@' + b, role, text:clean(format(tpl, Object.assign({}, base, { boss:T['boss.' + b] || b }))) }));
    else out.push({ key, role, text:clean(format(tpl, base)) });
  }
  return { out, skipped };
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
let last = 0;
async function synth(lang, v, inner){
  const gap = 60000 / +(process.env.VOICE_RPM || 18);                         // 무료(F0)는 1분에 요청 수 제한이 있어서 천천히
  for (let tryN = 0; tryN < 5; tryN++){
    const w = last + gap - Date.now(); if (w > 0) await new Promise(r => setTimeout(r, w));
    last = Date.now();
    try{ return azure('/cognitiveservices/v1', ssml(lang, v, inner), { 'Content-Type':'application/ssml+xml', 'X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3' }); }
    catch(e){ const m = String(e.stdout || e.message); if (tryN === 4 || !/429|Too Many|5\d\d/.test(m)) throw new Error(m.slice(0, 300)); await new Promise(r => setTimeout(r, 15000 * (tryN + 1))); }
  }
}

async function main(){
  const cmd = args[0], lang = args[1];
  if (cmd === 'voices'){
    const all = JSON.parse(azure('/cognitiveservices/voices/list').toString());
    all.filter(v => !lang || v.Locale === lang).forEach(v => console.log([v.ShortName, v.Gender, v.VoiceType, (v.StyleList || []).join('/'), (v.RolePlayList || []).join('/')].join('\t')));
    return;
  }
  if (!TTS_LOCALE[lang]){ console.error('언어: ko · en · ja'); process.exit(1); }
  const { out, skipped } = lines(lang);
  if (cmd === 'script'){
    const by = {}; out.forEach(l => { by[l.role] = by[l.role] || { n:0, c:0 }; by[l.role].n++; by[l.role].c += [...l.text].length; });
    fs.mkdirSync(path.join(ROOT, 'lang-work', 'voice'), { recursive:true });
    fs.writeFileSync(path.join(ROOT, 'lang-work', 'voice', lang + '.tsv'), out.map(l => [l.key, l.role, voiceOf(lang, l.role).name, l.text].join('\t')).join('\n') + '\n');
    console.log(`${lang}: 만들 대사 ${out.length}줄 · ${out.reduce((a, l) => a + [...l.text].length, 0)}자 (기기 목소리로 남는 것 ${skipped.length}줄)`);
    Object.entries(by).forEach(([r, x]) => console.log(`  ${r.padEnd(6)} ${String(x.n).padStart(4)}줄 ${String(x.c).padStart(6)}자  ${voiceOf(lang, r).name}`));
    return;
  }
  if (cmd === 'sample'){
    const roles = args.slice(2).length ? args.slice(2) : Object.keys(CAST[lang]);
    const dir = path.join(ROOT, 'lang-work', 'voice-samples', lang); fs.mkdirSync(dir, { recursive:true });
    for (const role of roles){
      const pool = out.filter(l => l.role === role && !l.key.includes('@') && [...l.text].length >= 8).slice(0, 40);
      const three = [pool[0], pool[Math.floor(pool.length / 2)], pool[pool.length - 1]].filter(Boolean);
      if (!three.length) continue;
      for (const name of CAST[lang][role].try){
        const v = Object.assign(voiceOf(lang, role), { name });
        const mp3 = await synth(lang, v, three.map(l => xml(l.text)).join('<break time="700ms"/>'));
        fs.writeFileSync(path.join(dir, `${role}__${name}.mp3`), mp3);
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
    for (const l of out){
      const v = voiceOf(lang, l.role);
      const h = crypto.createHash('sha1').update([v.name, v.pitch, v.rate, l.text].join('|')).digest('hex').slice(0, 8);
      const file = l.key.replace('@', '-') + '.' + h + '.mp3';
      if (man.files[l.key] === file && fs.existsSync(path.join(dir, file))){ kept++; continue; }
      if (made >= limit) break;
      fs.writeFileSync(path.join(dir, file), await synth(lang, v, xml(l.text)));
      man.files[l.key] = file; made++;
      if (made % 20 === 0){ fs.writeFileSync(manF, JSON.stringify(man, null, 1) + '\n'); console.log(`  ${made}줄 만듦…`); }
    }
    const live = new Set(out.map(l => l.key));
    Object.keys(man.files).forEach(k => { if (!live.has(k)) delete man.files[k]; });          // 없어진 대사
    const used = new Set(Object.values(man.files));
    fs.readdirSync(dir).forEach(f => { if (!used.has(f)) fs.unlinkSync(path.join(dir, f)); });   // 예전 파일
    man.voices = Object.fromEntries(Object.keys(CAST[lang]).map(r => [r, voiceOf(lang, r).name]));
    fs.writeFileSync(manF, JSON.stringify(man, null, 1) + '\n');
    const size = fs.readdirSync(dir).reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
    console.log(`${lang}: 새로 ${made}줄 · 그대로 ${kept}줄 · 전체 ${Object.keys(man.files).length}/${out.length}줄 · ${(size / 1048576).toFixed(1)}MB`);
    return;
  }
  console.log('node tools/voice.js voices <locale> | sample <lang> [역할…] | script <lang> | build <lang> [--limit N]');
}
main().catch(e => { console.error(e.message || e); process.exit(1); });
