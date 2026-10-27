'use strict';

/* =========================================================
   13. 설정 화면
      의도: 부모용 (아이 이름 · 생일 · 나이(치약 양) · 손잡이 손 · 양치법 · 소리 · 언어 · 나라 · 주간 기록)
            개발자 메뉴(.set-card.dev)는 testMode 일 때만 보임 — 테스트 버튼은 출시 때 숨겨짐
   ========================================================= */
const flag = (cc) => String.fromCodePoint(...[...cc].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
function countryName(cc){
  try{ return new Intl.DisplayNames([lang], { type:'region' }).of(cc); }catch(e){ return cc; }
}
function renderSettings(){
  renderKids();                                                                          // v0.31.0 아이 목록
  renderSub();                                                                           // v0.32.0 반짝이 클럽
  $('#legalLinks').innerHTML = legalHTML();                                              // v0.33.0
  try{ spInfo(); bkInfo(); }catch(e){}                                                   // 스페셜 영상 넣은 수 (구역 14-5 준비 전이면 건너뜀)
  $('#langSel').innerHTML = Object.values(packs).map(p =>
    `<option value="${p.meta.code}" ${p.meta.code === lang ? 'selected' : ''}>${p.meta.name}</option>`).join('');
  $('#packList').innerHTML = PACK_CATALOG.map(e => {
    const has = !!packs[e.code];
    const size = e.sample ? Math.ceil(JSON.stringify(e.sample).length / 1024) + 'KB' : '';
    return `<div class="pack"><span>${e.name}<small>${size}</small></span>${
        has ? `<span class="ok">✓ ${t('settings.installed')}</span>` : `<button data-pack="${e.code}">${t('settings.get')}</button>`}</div>`;
  }).join('');
  const list = COUNTRIES.map(cc => ({ cc, name:countryName(cc) })).sort((a, b) => a.name.localeCompare(b.name, lang));
  $('#countrySel').innerHTML = list.map(c =>
    `<option value="${c.cc}" ${c.cc === country ? 'selected' : ''}>${flag(c.cc)} ${c.name}</option>`).join('');
  const evs = EVENTS.filter(e => eventInCountry(e, country) && (e.id !== 'birthday' || store.get('bday', null))).map(e => `${e.icon} ${t('event.' + e.id + '.name')}`);
  $('#eventNote').textContent = evs.length ? t('settings.eventsHere', { list:evs.join(', ') }) : t('settings.eventsNone');
  $('#voiceTgl').checked = voiceOn;
  syncAudioUI();
  renderRecs();
  const vl = Voice.list();
  $('#voiceSel').innerHTML = `<option value="">${t('settings.voiceAuto')}</option>` +
    vl.map((v, i) => {
      const id = v.voiceURI || v.name, dup = vl.filter(x => x.name === v.name).length > 1;
      const label = v.name.replace(/[<&]/g, '') + (dup ? ' ' + (vl.filter((x, j) => x.name === v.name && j <= i).length) : '');
      return `<option value="${id.replace(/"/g, '&quot;')}" ${id === voiceName ? 'selected' : ''}>${label}</option>`;
    }).join('');
  if (!vl.some(v => (v.voiceURI || v.name) === voiceName)) $('#voiceSel').value = '';
  $('#toneSel').innerHTML = ['kind', 'normal', 'bright'].map(k => `<option value="${k}" ${voiceTone === k ? 'selected' : ''}>${t('tone.' + k)}</option>`).join('');
  $('#eventTgl').checked = eventLookOn;
  $('#evSel').innerHTML = `<option value="auto">${t('settings.auto')}</option>` +
    EVENTS.map(e => `<option value="${e.id}" ${evPreview === e.id ? 'selected' : ''}>${e.icon} ${t('event.' + e.id + '.name')}</option>`).join('');
  $('#evSel').value = evPreview;
  const bd = store.get('bday', null) || {};
  $('#nameIn').value = store.get('kidName', ''); $('#nameIn').placeholder = t('settings.kidNamePh');
  renderWeek();
  const yNow = new Date().getFullYear(), by = store.get('birthY', null);
  $('#bdayY').innerHTML = `<option value="">${t('settings.bdayYear')}</option>` + Array.from({ length:13 }, (_, i) => yNow - i).map(y => `<option value="${y}" ${by === y ? 'selected' : ''}>${t('settings.year', { n:y })}</option>`).join('');
  const ka = kidAge();
  $('#ageRow').hidden = ka !== null;                                           // 태어난 해를 넣으면 나이 칸 대신 계산한 나이
  $('#ageNote').textContent = ka !== null ? t('settings.ageIs', { n:ka }) : t('settings.ageHint');
  $('#bdayM').innerHTML = `<option value="">${t('settings.bdayNone')}</option>` + Array.from({ length:12 }, (_, i) => `<option value="${i + 1}" ${bd.m === i + 1 ? 'selected' : ''}>${t('settings.month', { n:i + 1 })}</option>`).join('');
  $('#bdayD').innerHTML = `<option value="">-</option>` + Array.from({ length:31 }, (_, i) => `<option value="${i + 1}" ${bd.d === i + 1 ? 'selected' : ''}>${t('settings.day', { n:i + 1 })}</option>`).join('');
  $('#ageSel').innerHTML = ['u3', '3p'].map(k => `<option value="${k}" ${childAge === k ? 'selected' : ''}>${t('age.' + k)}</option>`).join('');
  $('#prepTgl').checked = prepOn;
  $('#tongueTgl').checked = tongueOn;
  $('#theaterTgl').checked = theaterOn;
  Stats.syncUI();                                                                        // v0.52.0 익명 숫자 (statsUrl 이 있을 때만 보임)
  $('#quizTgl').checked = store.get('quizOn', true);
  $('#specialTgl').checked = specialOn;
  spScan().then(() => { $('#specialRow').hidden = !spAny(); }).catch(() => {});      // v0.52.2 스페셜 영상이 하나라도 있을 때만 부모님 칸에 보임
  $('#handSel').innerHTML = ['right', 'left'].map(k => `<option value="${k}" ${hand === k ? 'selected' : ''}>${t('hand.' + k)}</option>`).join('');
  $('#durSel').innerHTML = DURS.map(sec => `<option value="${sec}" ${totalSec === sec ? 'selected' : ''}>${sec === recDur() ? t('dur.rec', { t:t('dur.' + sec) }) : t('dur.' + sec)}</option>`).join('');   // v0.29.0 양치 시간 (첫 화면에서 옮김)
  $('#techSel').innerHTML = TECHS.map(k => `<option value="${k}" ${technique === k ? 'selected' : ''}>${t('tech.' + k)}</option>`).join('');
  $('#techNote').textContent = t('tech.' + technique + 'Note');
}
$('#settingsBtn').addEventListener('click', () => { sfx.tap(); parentGate(() => { renderSettings(); show('settings'); }); });
$('#langSel').addEventListener('change', (e) => setLang(e.target.value));
$('#countrySel').addEventListener('change', (e) => {
  country = e.target.value; store.set('country', country);
  if (!store.get('durSet', false)) totalSec = recDur();                       // v0.29.1 직접 고른 적 없으면 새 나라 권장 시간으로
  renderSettings(); refreshEvent();
});
const voiceSample = () => Voice.play('say.sample', t('say.ul'));

/* ---------- 녹음 화면 ---------- */
let recorder = null, recChunks = [], recFor = null, recStopT = 0, recStream = null, recStarting = false;
function recLabel(k){
  if (k === 'prep') return t('rec.l.prep');
  if (k === 'say.cheers') return t('rec.l.say.cheers');
  if (k === 'done') return t('rec.l.done');
  return t(k, { boss:t('rec.bossAny') });                             // 대장 세균 문장: 이름 자리에 "대장 세균" (v0.25)
}
function renderRecs(){
  const box = $('#recList'); if (!box) return;
  box.innerHTML = REC_KEYS.map(k => {
    const mine = !!recs[k], on = recFor === k;
    return `<div class="rec-row" data-k="${k}">
        <div class="rt ${mine ? 'mine' : ''}">${recLabel(k).replace(/[<&]/g, '')}<small>${mine ? '● ' + t('rec.mine') : t('rec.device')}</small></div>
        <button class="rec ${on ? 'on' : ''}" data-a="rec" aria-label="record">${on ? '■' : '●'}</button>
        <button data-a="play" aria-label="play" ${mine ? '' : 'disabled'}>▶</button>
        <button data-a="del" aria-label="delete" ${mine ? '' : 'disabled'}>✕</button>
      </div>`;
  }).join('');
}
function stopRecording(){
  clearTimeout(recStopT);
  try{ if (recorder && recorder.state !== 'inactive') recorder.stop(); }catch(e){}
}
async function startRecording(k){
  if (recorder && recorder.state === 'recording'){ stopRecording(); return; }
  if (recStarting) return;                                            // v0.37.1 마이크 허락을 기다리는 동안 또 누르면 무시 (녹음기가 둘 생기지 않게)
  recStarting = true;
  try{
    recStream = await navigator.mediaDevices.getUserMedia({ audio:true });
  }catch(e){ toast(t('rec.noMic')); return; }
  finally{ recStarting = false; }
  musicStop(); Voice.stop();
  recChunks = []; recFor = k;
  try{ recorder = new MediaRecorder(recStream); }catch(e){ toast(t('rec.noMic')); recStream.getTracks().forEach(x => x.stop()); recFor = null; return; }
  recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) recChunks.push(ev.data); };
  recorder.onstop = async () => {
    recStream.getTracks().forEach(x => x.stop());
    const key = recFor; recFor = null;
    if (recChunks.length){
      const blob = new Blob(recChunks, { type: recorder.mimeType || 'audio/webm' });
      if (recs[key]) URL.revokeObjectURL(recs[key]);
      recs[key] = URL.createObjectURL(blob);                       // 가장 최근 녹음 하나만
      try{ await RecStore.put(`rec:${lang}:${key}`, blob); }catch(e){}
      toast(t('rec.saved'));
      recAudio.src = recs[key]; recAudio.play().catch(() => {});
    }
    renderRecs();
  };
  recorder.start();
  tone(880, .08, 'sine', .12);
  recStopT = setTimeout(stopRecording, CONFIG.recMaxSec * 1000);
  renderRecs();
}
$('#recList').addEventListener('click', async (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const k = b.closest('.rec-row').dataset.k, a = b.dataset.a;
  if (a === 'rec'){ if (recFor === k) stopRecording(); else if (!recFor) startRecording(k); }
  else if (a === 'play' && recs[k]){ Voice.stop(); recAudio.src = recs[k]; recAudio.play().catch(() => {}); }
  else if (a === 'del' && recs[k]){
    URL.revokeObjectURL(recs[k]); delete recs[k];
    try{ await RecStore.del(`rec:${lang}:${k}`); }catch(e){}
    toast(t('rec.cleared')); renderRecs();
  }
});
$('#voiceSel').addEventListener('change', (e) => { voiceName = e.target.value; store.set('voiceName', voiceName); voiceSample(); });
$('#toneSel').addEventListener('change', (e) => { voiceTone = TONES[e.target.value] ? e.target.value : 'kind'; store.set('voiceTone', voiceTone); voiceSample(); });
$('#voiceTry').addEventListener('click', () => { sfx.tap(); voiceSample(); });
$('#voiceTgl').addEventListener('change', (e) => {
  voiceOn = e.target.checked; store.set('voice', voiceOn); refreshSoundIcons();
  if (voiceOn) Voice.play('say.cheers', tList('say.cheers')[0]); else Voice.stop();
});
$('#eventTgl').addEventListener('change', (e) => { eventLookOn = e.target.checked; store.set('eventLook', eventLookOn); refreshEvent(); });
$('#evSel').addEventListener('change', (e) => { evPreview = e.target.value; refreshEvent(); refreshHome(); });
$('#nameIn').addEventListener('change', (e) => { store.set('kidName', e.target.value.trim().slice(0, 12)); refreshEvent(); renderKids(); });
// v0.28.3 고침: 예전엔 월만 고르면(일은 아직) 저장할 게 없어서 화면을 다시 그리며 고른 월이 지워졌음 → 생일을 고를 수 없었음
//   이제 한쪽만 고른 동안은 화면을 다시 그리지 않고 기다림. 둘 다 고르면 저장
const BDAY_MAX = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];   // 달마다 마지막 날 (2월은 29일까지 허용)
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
// v0.30.0 태어난 해(bj_birthY)를 따로 저장: 월 · 일(bj_bday)은 생일 이벤트, 해까지 있으면 나이 계산 (퀴즈 · 치약 양)
const saveBday = (e) => {
  const ySel = $('#bdayY'), mSel = $('#bdayM'), dSel = $('#bdayD');
  let y = +ySel.value, m = +mSel.value, d = +dSel.value;
  sfx.tap();
  if (e && e.target === ySel){ store.set('birthY', y || null); applyAge(); renderSettings(); return; }
  if (e && e.target === mSel && !m){ dSel.value = ''; d = 0; }                         // 월을 "없음"으로 → 생일 지우기
  const max = m ? (m === 2 && y && !isLeap(y) ? 28 : BDAY_MAX[m - 1]) : 31;
  if (m && d > max){ d = max; dSel.value = String(d); }                                // 2월 31일 같은 날은 그 달 마지막 날로
  if (m && d){ store.set('bday', { m, d }); applyAge(); renderSettings(); refreshEvent(); return; }
  store.set('bday', null); refreshEvent();                                            // 한쪽만 골랐으면 아직 생일 없음 (화면은 그대로 두고 나머지를 기다림)
  if (!m && !d){ applyAge(); renderSettings(); }
};
$('#bdayY').addEventListener('change', saveBday);
$('#bdayM').addEventListener('change', saveBday);
$('#bdayD').addEventListener('change', saveBday);
$('#ageSel').addEventListener('change', (e) => { childAge = e.target.value === 'u3' ? 'u3' : '3p'; store.set('age', childAge); sfx.tap(); });
$('#prepTgl').addEventListener('change', (e) => { prepOn = e.target.checked; store.set('prep', prepOn); });
$('#tongueTgl').addEventListener('change', (e) => { tongueOn = e.target.checked; store.set('tongue', tongueOn); });
$('#theaterTgl').addEventListener('change', (e) => { theaterOn = e.target.checked; store.set('theaterOn', theaterOn); });
$('#quizTgl').addEventListener('change', (e) => { store.set('quizOn', e.target.checked); quizRefresh(); });
$('#specialTgl').addEventListener('change', (e) => { specialOn = e.target.checked; store.set('specialOn', specialOn); });
$('#handSel').addEventListener('change', (e) => { hand = e.target.value === 'left' ? 'left' : 'right'; store.set('hand', hand); sfx.tap(); });
$('#durSel').addEventListener('change', (e) => { const v = +e.target.value; if (DURS.includes(v)){ totalSec = v; store.set('dur', v); store.set('durSet', true); } sfx.tap(); });
$('#techSel').addEventListener('change', (e) => {
  technique = TECHS.includes(e.target.value) ? e.target.value : 'short';
  store.set('technique', technique); applyTech(); renderSettings(); sfx.tap();
});
$('#packList').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-pack]'); if (!b) return;
  const entry = PACK_CATALOG.find(x => x.code === b.dataset.pack);
  b.disabled = true; b.textContent = t('settings.getting');
  try{
    const p = await installPack(entry);
    setLang(p.meta.code);
    toast(t('toast.packInstalled', { lang:p.meta.name }));
  }catch(err){
    toast(t('toast.packFail')); renderSettings();
  }
});

function setLang(code){
  if (!packs[code]) return;
  lang = code; store.set('lang', lang);
  if (typeof loadRecs === 'function') loadRecs();
  injectPetNames();
  applyLang();
}
function applyLang(){
  const meta = packs[lang].meta;
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir || 'ltr';
  document.title = t('app.title');
  applyFont();
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml).split('\n').map(s => s.replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]))).join('<br>');
  });
  refreshHome(); refreshEvent();
  if (current === 'settings') renderSettings();
  if (current === 'closet'){ renderTabs(); renderGrid(); }
  if (current === 'book') renderBook();
  if (current === 'room') renderRoom();
  if (current === 'map') renderMap();
}
