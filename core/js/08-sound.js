'use strict';

/* =========================================================
   9. 소리 & 목소리
      의도: 글을 못 읽는 아이를 위해 중요한 말은 모두 목소리로 (Voice.play(키, 글)). 언어팩에 녹음 파일이 있으면 그걸 먼저
            효과음은 파일 없이 tone()으로 만들어 가볍게. 배경음악은 코드 곡 + 부모가 넣은 파일
   ========================================================= */
let actx = null;
function ac(){
  if (!actx){ const AC = window.AudioContext || window.webkitAudioContext; if (AC) actx = new AC(); }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, dur = .2, type = 'sine', vol = .15, delay = 0, ch = 'sfx'){
  if (ch === 'music' ? !musicOn : !soundOn) return;
  const a = ac(); if (!a) return;
  const tt = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, tt);
  g.gain.setValueAtTime(.0001, tt);
  g.gain.exponentialRampToValueAtTime(vol, tt + .02);
  g.gain.exponentialRampToValueAtTime(.0001, tt + dur);
  o.connect(g); g.connect(a.destination);
  o.start(tt); o.stop(tt + dur + .05);
}
const sfx = {
  start(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'triangle', .18, i * .1)); },
  zone(){ tone(880, .18, 'sine', .2); tone(660, .3, 'sine', .2, .18); },
  done(){ [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? .6 : .16, 'triangle', .2, i * .13)); },
  tap(){ tone(620, .06, 'sine', .12); },
  equip(){ tone(700, .08, 'sine', .15); tone(1050, .12, 'sine', .15, .07); },
  buy(){ [784, 988, 1175, 1568].forEach((f, i) => tone(f, .14, 'triangle', .18, i * .08)); },
  nope(){ tone(300, .12, 'square', .06); tone(240, .16, 'square', .06, .12); }
};
// 외부 리소스: 효과음을 파일로 바꾸기 (sfx:{ start:'start.mp3', done:'done.mp3', … })
Object.entries(RES.sfx || {}).forEach(([k, url]) => {
  sfx[k] = () => { if (!soundOn) return; try{ const a = new Audio(url); a.volume = .8; a.play().catch(() => {}); }catch(e){} };
});

/* ---------- 배경음악 ----------
   코드로 만든 곡 5개 (step: 한 박 길이 ms, mel: 0은 쉼표, bass: 4박마다) + 내 음악 파일 */
const TRACKS = {
  sunny:  { step:300, wave:'triangle', vol:.04,  bass:[131, 175, 196, 131],
            mel:[523,0,659,784, 659,0,523,587, 659,784,880,784, 659,587,523,0, 587,0,698,880, 784,698,659,587, 523,659,784,1047, 784,0,0,0] },
  march:  { step:230, wave:'square',   vol:.018, bass:[131, 196, 147, 196],
            mel:[523,523,659,784, 784,0,659,0, 698,698,587,698, 659,0,523,0, 523,523,659,784, 1047,0,880,0, 784,698,659,587, 523,0,0,0] },
  calm:   { step:420, wave:'sine',     vol:.05,  bass:[131, 110, 87, 98],
            mel:[392,0,523,0, 494,0,440,0, 392,0,330,0, 349,0,392,0, 440,0,523,0, 494,0,440,0, 392,0,0,0, 0,0,0,0] },
  bubbly: { step:190, wave:'triangle', vol:.035, bass:[131, 165, 196, 165],
            mel:[659,784,880,784, 659,0,587,0, 523,587,659,0, 784,0,0,0, 880,784,659,784, 880,0,1047,0, 880,784,659,587, 523,0,0,0] },
  birthday:{ step:270, wave:'triangle', vol:.045, hidden:true, bass:[131, 196, 196, 131, 131, 175, 196, 131, 175, 131, 98, 131],   // 생일 축하 노래 (퍼블릭 도메인 멜로디)
            mel:[392,392,440,0, 392,0,523,0, 494,0,0,0, 392,392,440,0, 392,0,587,0, 523,0,0,0, 392,392,784,0, 659,0,523,0, 494,0,440,0, 698,698,659,0, 523,0,587,0, 523,0,0,0] },
  space:  { step:260, wave:'sine',     vol:.045, bass:[110, 87, 131, 98],
            mel:[440,523,659,523, 440,523,659,880, 349,440,523,440, 349,440,523,698, 523,659,784,659, 523,659,784,1047, 392,494,587,494, 392,494,587,784] }
};
// 외부 리소스: 배경음악 추가 (코드 곡 { step, wave, vol, mel, bass } 또는 파일 { file:'music.mp3' }), 이름은 names
Object.entries(RES.tracks || {}).forEach(([k, v]) => {
  TRACKS[k] = v;
  Object.entries(v.names || {}).forEach(([code, txt]) => { if (packs[code]) packs[code].strings['bgm.' + k] = txt; });
});
const audioEl = new Audio(); audioEl.loop = true; audioEl.preload = 'auto';
let customUrl = null, customName = store.get('bgmName', '');
let musicTimer = null, duckTimer = null, beat = 0, previewT = 0;
const speaking = () => { try{ return (typeof recPlaying === 'function' && recPlaying()) || ('speechSynthesis' in window && speechSynthesis.speaking); }catch(e){ return false; } };
function musicStart(){
  musicStop();
  if (!musicOn) return;
  if (bgm === 'custom'){
    if (!customUrl) return;
    if (audioEl.src !== customUrl) audioEl.src = customUrl;
    try{ audioEl.currentTime = 0; }catch(e){}
    audioEl.volume = .6; audioEl.play().catch(() => {});
    duckTimer = setInterval(() => { audioEl.volume = speaking() ? .2 : .6; }, 200);   // 목소리 나올 땐 작게
    return;
  }
  const evn = activeEvent();
  const tr = (evn && evn.id === 'birthday') ? TRACKS.birthday : (TRACKS[bgm] || TRACKS.sunny); beat = 0;   // 생일엔 생일 축하 노래
  if (tr.file){                                    // 외부 리소스의 음악 파일 곡
    if (audioEl.src !== new URL(tr.file, location.href).href) audioEl.src = tr.file;
    try{ audioEl.currentTime = 0; }catch(e){}
    audioEl.volume = .6; audioEl.play().catch(() => {});
    duckTimer = setInterval(() => { audioEl.volume = speaking() ? .2 : .6; }, 200);
    return;
  }
  musicTimer = setInterval(() => {
    if (paused) return;
    const duck = speaking() ? .3 : 1, f = tr.mel[beat % tr.mel.length];
    if (f) tone(f, Math.min(.3, tr.step / 1000 * .85), tr.wave, tr.vol * duck, 0, 'music');
    if (beat % 4 === 0) tone(tr.bass[Math.floor(beat / 4) % tr.bass.length], tr.step * 1.3 / 1000, 'sine', .06 * duck, 0, 'music');
    beat++;
  }, tr.step);
}
function musicStop(){
  clearInterval(musicTimer); musicTimer = null; clearInterval(duckTimer); duckTimer = null;
  clearTimeout(previewT);
  try{ audioEl.pause(); }catch(e){}
}
function musicPause(p){
  if (!musicOn || !(bgm === 'custom' ? customUrl : (TRACKS[bgm] || {}).file)) return;
  try{ if (p) audioEl.pause(); else audioEl.play().catch(() => {}); }catch(e){}
}
function musicPreview(){
  ac();
  if (bgm === 'custom' && !customUrl){ toast(t('audio.noCustom')); return; }
  if (running) { musicStart(); return; }
  musicStart(); clearTimeout(previewT);
  previewT = setTimeout(() => { if (!running) musicStop(); }, 8000);
}

/* 내 음악 파일: IndexedDB에 저장 (안 되면 이번 실행에서만) */
const BgmStore = {
  // v0.37.1 연결은 한 번만 열어 두고 같이 씀 (예전엔 부를 때마다 새로 열어서 앱을 열 때 연결이 수십 개 쌓였음)
  open(){
    if (!this._db) this._db = new Promise((res, rej) => { try{ const r = indexedDB.open('bj_db', 1); r.onupgradeneeded = () => r.result.createObjectStore('files');
      r.onsuccess = () => { const db = r.result; db.onclose = db.onversionchange = () => { try{ db.close(); }catch(e){} this._db = null; }; res(db); }; r.onerror = () => rej(r.error); }catch(e){ rej(e); } });
    return this._db.catch((e) => { this._db = null; throw e; });
  },
  async put(blob){ const db = await this.open(); return new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, 'bgm'); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); },
  async get(){ const db = await this.open(); return new Promise((res, rej) => { const q = db.transaction('files').objectStore('files').get('bgm'); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); }); }
};
(async () => { try{ const b = await BgmStore.get(); if (b){ customUrl = URL.createObjectURL(b); syncAudioUI(); } }catch(e){} })();

/* ---------- 내 목소리 녹음 ----------
   문장마다 가장 최근 녹음 하나만 (키: rec:언어:문장키, 다시 녹음하면 덮어씀) */
const REC_KEYS = ['kidName', 'prep', 'say.ul', 'say.ur', 'say.lr', 'say.ll', 'say.chew', 'say.inner', 'say.front', 'say.cheers', 'say.bossTease', 'say.raid', 'say.boss', 'say.bossDown', 'say.sparkle', 'tongue.say', 'done'];
const recKeyOf = (k) => /^prep\./.test(k) ? 'prep' : (/^event\..*\.cheer$/.test(k) ? 'say.cheers' : k);
const RecStore = {
  async put(key, blob){ const db = await BgmStore.open(); return new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
  async get(key){ const db = await BgmStore.open(); return new Promise((res, rej) => { const q = db.transaction('files').objectStore('files').get(key); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); }); },
  async del(key){ const db = await BgmStore.open(); return new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').delete(key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
};
const recs = {};           // 문장키 → 재생 주소 (지금 언어)
async function loadRecs(){
  Object.keys(recs).forEach(k => { URL.revokeObjectURL(recs[k]); delete recs[k]; });
  for (const k of REC_KEYS){ try{ const b = await RecStore.get(`rec:${lang}:${k}`); if (b) recs[k] = URL.createObjectURL(b); }catch(e){} }
  if (current === 'settings') renderRecs();
}
loadRecs();
const recAudio = new Audio();
const recPlaying = () => !recAudio.paused && !recAudio.ended;
async function loadBgmFile(file){
  if (!file) return;
  if (!/^audio\//.test(file.type) && !/\.(mp3|m4a|aac|wav|ogg)$/i.test(file.name)){ toast(t('audio.notAudio')); return; }
  if (file.size > CONFIG.musicMaxMB * 1024 * 1024){ toast(t('audio.tooBig')); return; }
  if (customUrl) URL.revokeObjectURL(customUrl);
  customUrl = URL.createObjectURL(file);
  customName = file.name; store.set('bgmName', customName);
  bgm = 'custom'; store.set('bgm', bgm); musicOn = true; store.set('music', true);
  syncAudioUI();
  try{ await BgmStore.put(file); toast(t('audio.loadOk')); }catch(e){ toast(t('audio.loadTemp')); }
  musicPreview();
}

/* 목소리 응원: 언어팩에 녹음 파일이 있으면 재생, 없으면 기기 음성 합성 */
const Voice = (() => {
  const can = 'speechSynthesis' in window;
  let voices = [];
  const load = () => { try{ voices = speechSynthesis.getVoices() || []; }catch(e){} };
  if (can){ load(); try{ speechSynthesis.addEventListener('voiceschanged', load); }catch(e){} }
  // 읽어 줄 글 다듬기: 그림 글자 · 말줄임 · 물결 · 괄호 · 따옴표 · 하트는 소리 내지 않음, 같은 글자 3번 넘게(하아아아암) → 2번 (v0.52.4)
  const clean = (s) => String(s).replace(/\p{Extended_Pictographic}|️|…/gu, '').replace(/[~〜～()（）「」『』“”"♥♡★☆·]/g, ' ')
    .replace(/(\p{L})\1{2,}/gu, '$1$1').replace(/\s+/g, ' ').trim();
  /* v0.52.5 미리 만든 음성 파일: 앱 폴더 voice/<언어>.json = { dir:'ko/', files:{ 문구키: 파일 이름 } } (tools/voice.js 가 만듦)
     언어마다 처음 쓸 때 목록만 한 번 받음 (파일은 틀 때 받아서 sw 가 저장). 목록이 없거나 파일을 못 받으면 기기 목소리로 */
  const VF = {};
  function loadFiles(code){
    if (code in VF) return; VF[code] = null;
    const base = (typeof CONFIG === 'object' && CONFIG.voiceBase) || 'voice/';
    fetch(base + code + '.json', { cache:'no-cache' }).then(r => r.ok ? r.json() : null)
      .then(j => { if (j && j.files) VF[code] = { base:base + (j.dir || code + '/'), files:j.files, parts:j.parts || {} }; }).catch(() => {});
  }
  function audioUrl(key){
    const a = packs[lang].audio;
    if (a && a.files && a.files[key]) return (a.base || '') + a.files[key];
    if (!(lang in VF)) loadFiles(lang);
    const f = VF[lang];
    return f && f.files[key] ? f.base + f.files[key] : null;
  }
  setTimeout(() => loadFiles(lang), 800);
  /* v0.52.6 이름이 든 대사: 목록의 parts[키] = [{k:'키~0'}, {slot:'pet', suf:'의', role:'nar'}, {k:'키~1'}] (이름 앞 · 이름 · 이름 뒤)
     앱이 이름 자리를 채워서 차례로 틂 (playParts). 하나라도 파일이 없으면 기기 목소리로 글 전체 */
  const partsOf = (key) => { const f = VF[lang]; return f && f.parts[key] || null; };
  function playParts(list, text, opt = {}){
    if (!voiceOn) return track(Promise.resolve());
    const urls = list.map(x => x.url || audioUrl(x.key));
    if (urls.some(u => !u)) return play('', text, opt);
    try{ if (can) speechSynthesis.cancel(); }catch(e){}
    try{ if (fileAudio) fileAudio.pause(); }catch(e){}
    const me = {};
    seqTok = me;
    return track((async () => {
      for (let i = 0; i < urls.length; i++){
        if (seqTok !== me) return;
        const a = fileAudio = new Audio(urls[i]);
        const ok = await new Promise(res => {
          let done = false; const fin = (v) => { if (!done){ done = true; res(v); } };
          a.addEventListener('ended', () => fin(true), { once:true }); a.addEventListener('pause', () => fin(true), { once:true });
          a.addEventListener('error', () => fin(false), { once:true }); a.play().catch(() => fin(false)); setTimeout(() => fin(true), 12000);
        });
        if (!ok){ if (seqTok === me) await tts('', text, opt); return; }
      }
    })());
  }
  let seqTok = null;
  // 덜 중요한 말: 다른 말을 하는 중이면 끊지 않고 건너뜀
  const LOW = (k) => k === 'say.cheers' || k === 'say.resume' || /^event\./.test(k);
  // 같은 언어 목소리 중 자연스러운 것 우선
  const QUALITY = /natural|neural|enhanced|premium|google|siri|samantha|yuna|kyoko/i;
  /* v0.52.4 play 는 말이 끝나면 풀리는 약속(Promise)을 돌려줌. Voice.wait(최대 ms) = 지금 하는 말이 끝날 때까지
     (극장: 앞 대사가 다 끝난 뒤 다음 대사). 음성이 시작조차 안 하거나(목소리 없음) 끝 신호가 안 오는 폰도 있어서 시간 제한을 둠
     opt: { pitch, rate } = 목소리 톤에 곱하는 값 (극장에서 말하는 사람마다 다르게) */
  let pending = Promise.resolve();
  const track = (p) => (pending = p);
  const ended = (el) => new Promise(res => { const f = () => res(); el.addEventListener('ended', f, { once:true }); el.addEventListener('error', f, { once:true }); el.addEventListener('pause', f, { once:true }); setTimeout(f, 20000); });
  function wait(max = 8000){ return Promise.race([pending, new Promise(r => setTimeout(r, max))]); }
  function play(key, text, opt = {}){
    seqTok = null;
    if (!voiceOn) return track(Promise.resolve());
    const mine = recs[recKeyOf(key)];
    if (mine){                                          // 내가 녹음한 목소리가 있으면 그걸로
      if (recPlaying() && LOW(key)) return pending;
      try{ if (can) speechSynthesis.cancel(); }catch(e){}
      try{ if (fileAudio) fileAudio.pause(); }catch(e){}
      try{ recAudio.pause(); recAudio.src = mine; recAudio.currentTime = 0; recAudio.play().catch(() => {}); return track(ended(recAudio)); }catch(e){}
      return track(Promise.resolve());
    }
    const url = audioUrl(key);
    if (url){                                           // v0.52.5 음성 파일. 못 틀면(인터넷 없음 등) 기기 목소리로 이어서
      try{ if (can) speechSynthesis.cancel(); }catch(e){}
      try{ if (fileAudio) fileAudio.pause(); }catch(e){}
      const a = fileAudio = new Audio(url);
      return track(new Promise(res => {
        let done = false;
        const fin = () => { if (!done){ done = true; res(); } };
        const fail = () => { if (done) return; done = true; tts(key, text, opt).then(res); };
        a.addEventListener('ended', fin, { once:true }); a.addEventListener('pause', fin, { once:true }); a.addEventListener('error', fail, { once:true });
        a.play().catch(fail);
        setTimeout(fin, 20000);
      }));
    }
    return track(tts(key, text, opt));
  }
  let fileAudio = null;
  function tts(key, text, opt){
    if (!can) return Promise.resolve();
    const code = packs[lang].meta.tts || lang;
    const norm = (v) => (v.lang || '').toLowerCase().replace('_', '-');
    const same = voices.filter(x => norm(x) === code.toLowerCase());
    const cands = same.length ? same : list();
    const picked = voiceName && list().find(x => (x.voiceURI || x.name) === voiceName);   // 지금 언어 목소리 중에서만
    const v = picked || cands.find(x => QUALITY.test(x.name)) || cands.find(x => x.localService) || cands[0];
    if (voices.length && !v) return Promise.resolve();     // 이 언어 목소리가 기기에 없음
    try{
      if (speechSynthesis.speaking){
        if (LOW(key)) return pending;
        speechSynthesis.cancel();
      }
      const say = clean(text);
      const u = new SpeechSynthesisUtterance(say);
      const tn = TONES[voiceTone] || TONES.kind;
      u.lang = code; if (v) u.voice = v;
      u.rate = Math.min(2, tn.rate * (opt.rate || 1)); u.pitch = Math.max(.1, Math.min(2, tn.pitch * (opt.pitch || 1)));
      const done = new Promise(res => {
        let started = false;
        const fin = () => res();
        u.onstart = () => { started = true; setTimeout(fin, 2500 + [...say].length * 330 / u.rate); };   // 끝 신호가 안 와도 이만큼 뒤엔 풂
        u.onend = fin; u.onerror = fin;
        setTimeout(() => { if (!started) fin(); }, 1500);                                                 // 시작을 안 함 (목소리 없음 등)
      });
      speechSynthesis.speak(u);
      return done;
    }catch(e){ return Promise.resolve(); }
  }
  const stop = () => { seqTok = null; try{ if (can) speechSynthesis.cancel(); }catch(e){} try{ recAudio.pause(); }catch(e){} try{ if (fileAudio) fileAudio.pause(); }catch(e){} track(Promise.resolve()); };
  // 지금 언어로 말할 수 있는 목소리 목록 (설정 화면용)
  // 언어 코드 앞부분이 정확히 같은 것만 (ko ≠ kok 코카니어)
  const primary = (l) => String(l || '').toLowerCase().split(/[-_]/)[0];
  const list = () => { const code = primary(packs[lang].meta.tts || lang); return voices.filter(x => primary(x.lang) === code); };
  return { play, stop, list, wait, partsOf, playParts, rec:(k) => recs[k] || null };
})();

function refreshSoundIcons(){
  const any = soundOn || musicOn || voiceOn;
  $$('.soundBtn').forEach(b => { b.textContent = any ? '🔊' : '🔇'; });
}
// 소리 설정 창 · 설정 화면의 소리 관련 칸을 한꺼번에 맞춤
function syncAudioUI(){
  $$('.ap-voice').forEach(x => { x.checked = voiceOn; });
  $$('.ap-music').forEach(x => { x.checked = musicOn; });
  $$('.ap-sfx').forEach(x => { x.checked = soundOn; });
  const opts = Object.keys(TRACKS).filter(k => !TRACKS[k].hidden).concat(customUrl || customName ? ['custom'] : []);
  $$('.ap-bgm').forEach(sel => {
    sel.innerHTML = opts.map(k => `<option value="${k}" ${bgm === k ? 'selected' : ''}>${t('bgm.' + k)}</option>`).join('');
    sel.value = bgm;
  });
  const nm = $('#bgmName'); if (nm) nm.textContent = customName ? t('audio.loaded', { name:customName }) : '';
  const vt = $('#voiceTgl'); if (vt) vt.checked = voiceOn;
  refreshSoundIcons();
}
function toggleSound(){ ac(); syncAudioUI(); $('#audioPop').classList.add('show'); }   // 🔊 → 소리 설정 창
$('#apClose').addEventListener('click', () => $('#audioPop').classList.remove('show'));
$('#audioPop').addEventListener('click', (e) => { if (e.target.id === 'audioPop') $('#audioPop').classList.remove('show'); });
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.classList.contains('ap-voice')){ voiceOn = el.checked; store.set('voice', voiceOn); if (!voiceOn) Voice.stop(); else Voice.play('say.sample', t('say.ul')); }
  else if (el.classList.contains('ap-music')){ musicOn = el.checked; store.set('music', musicOn); if (!musicOn) musicStop(); else if (running) musicStart(); }
  else if (el.classList.contains('ap-sfx')){ soundOn = el.checked; store.set('sound', soundOn); if (soundOn) sfx.tap(); }
  else if (el.classList.contains('ap-bgm')){
    bgm = el.value; store.set('bgm', bgm);
    if (!musicOn){ musicOn = true; store.set('music', true); }
    musicPreview();
  }
  else return;
  syncAudioUI();
});
$('#bgmTry').addEventListener('click', () => musicPreview());
$('#bgmLoad').addEventListener('click', () => $('#bgmFile').click());
$('#bgmFile').addEventListener('change', (e) => { loadBgmFile(e.target.files && e.target.files[0]); e.target.value = ''; });
function buzz(p){ try{ if (navigator.vibrate) navigator.vibrate(p); }catch(e){} }

let wakeLock = null;
async function keepAwake(){ try{ if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); }catch(e){} }
function releaseAwake(){ try{ if (wakeLock) wakeLock.release(); }catch(e){} wakeLock = null; }
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible'){ if (running && !paused) keepAwake(); return; }
  // 다른 앱으로 가거나 화면이 꺼지면: 양치 중이면 자동 일시정지 (돌아와서 ▶ 누르면 이어서)
  if (CONFIG.pauseWhenHidden && running && !paused) togglePause(true);
  Voice.stop();
});
