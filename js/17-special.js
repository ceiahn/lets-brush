'use strict';

/* =========================================================
   14-5. 스페셜 영상 (v0.22.0, 시리즈 에피소드 v0.28.0)
     AI 영상 도구로 만든 세로(9:16) 영상을 특별한 날 · 일주일에 한 번, 반짝이 극장 대신 보여 줌
     파일: index.html 옆 specials 폴더. 시리즈 에피소드 ep001.mp4 ~ ep999.mp4 (한 편 = 장면 A + B 를 사용자가 이어 붙인 20초 파일)
           + 지난 10초 단편 sp01.mp4 ~ sp10.mp4. 영상 만드는 기준은 Docs "Let's Brush 영상 바이블"
     고르기: 에피소드를 1화부터 차례로 (안 본 것 중 번호가 가장 작은 것). 다 보면 단편, 그다음 처음부터 다시
             이벤트 첫날은 그 날을 위한 편 (EP_EVENT: 생일 7화 · 설날 21화 · 어린이날 23화 · 추석 26화 · 핼러윈 27화 · 크리스마스 29화 · 새해 30화)
     제목: 1~100화는 EP_TITLES_KO (바이블 100편 계획). 101화부터와 다른 언어는 "스페셜 N화" (sp.epN)
     확인(spScan): 번호 순서로 살짝 열어 보고, 10편 연속 없으면 그 뒤는 확인 안 함 (999편을 다 두드리지 않게)
     (v0.27 의 여러 부 이어 틀기는 resources.js 의 parts:2 / files:[…] 로만 남아 있음)
     나오는 때 (하루에 한 번까지, specialDue):
       · 처음 한 번: 기능이 생긴 뒤 첫 양치 ("새 영상 도착")
       · 스페셜 데이: 생일 · 이벤트 기간(설날 · 핼러윈 · 크리스마스 …) · 연속 3 · 7 · 14 · 30일 달성 날
       · 일주일에 한 번: 지난 스페셜에서 7일이 지난 뒤 첫 양치
     고르는 법: 틀 수 있다고 확인된 영상(spScan) 중 아직 안 본 것 (다 보면 처음부터 다시)
     저장 bj_special {last:날 번호, day:'날짜', seen:[id], ev:'halloween-2026'(이벤트는 기간 첫날 한 번만)}
     휴대폰에 넣은 영상 (v0.23): 설정 "📥 스페셜 영상 넣기" → IndexedDB sp:<파일 키: sp01 · ep01_1 …> → SP_BLOB. specials 폴더보다 먼저 씀
     파일 이름: 대소문자가 달라도 찾음 (spVariants: Sp01.mp4 · SP01.MP4 · Specials/ …), 찾은 경로는 SP_OK 에 기억
               v0.36.0: 이름 후보를 한꺼번에 HEAD 로 물어보고 확실히 없는 것(404)은 영상으로 열어 보지 않음 (spExists)
     안전장치: 파일이 없거나 재생이 안 되면(8초 안에 시작 못 하면) 반짝이 극장으로 대신 (그 영상은 이번 차례에서 건너뜀)
             소리 있는 자동 재생이 막히면(아이폰 등) 소리 끄고 재생 + "🔊 소리 켜기" 단추
     부모님 설정 "스페셜 영상" (bj_specialOn, 기본 켜짐), 개발자 메뉴 "🎞 스페셜 영상 미리 보기"
   ========================================================= */
// 목록 (v0.28): 시리즈 에피소드 ep001 ~ ep999 (한 편 = 장면 A + B 를 이어 붙인 파일 하나) + 지난 10초 단편 sp01 ~ sp10
// 의도: 사용자가 100편 이상 계속 만들 예정 → 목록을 손으로 늘리지 않아도 specials/ep011.mp4 를 넣기만 하면 나오게
// 제목: 1~100화는 영상 바이블(Docs "Let's Brush 영상 바이블")의 100편 계획 제목. 그 뒤는 "스페셜 N화"
const EP_TITLES_KO = [
  '사라진 칫솔',
  '피피의 꽃 정원',
  '몽이의 진주',
  '코코와 무지개 다리',
  '두리가 태어났어요',
  '달님의 별 청소',
  '거품 생일 파티',
  '잘 자요, 대장 세균',
  '노래하는 이빨',
  '반짝이 대변신',
  '순서대로 쓱쓱',
  '어금니 동굴 탐험',
  '앞니 뒤를 세워서',
  '완두콩만큼 치약',
  '두 바퀴 모래시계',
  '퉤! 하고 뱉어요',
  '혀도 살살',
  '칫솔이 지쳤어요',
  '서로서로 마무리',
  '치과는 무섭지 않아',
  '설날 떡국 한 그릇',
  '봄 소풍 도시락',
  '어린이날 선물',
  '여름 바다 물놀이',
  '한여름 밤 반딧불',
  '추석 보름달',
  '핼러윈 사탕 바구니',
  '첫눈이 왔어요',
  '크리스마스 양치',
  '반짝반짝 새해',
  '끈적끈적 캐러멜',
  '아삭아삭 사과',
  '우유 한 잔',
  '물이 최고',
  '과자 부스러기 숨바꼭질',
  '채소 친구들',
  '간식 시간 지키기',
  '치즈 한 조각',
  '탄산 거품 소동',
  '두리의 요리사 모자',
  '꿈나라 칫솔 기차',
  '구름 베개',
  '별을 세다 잠들어요',
  '달님의 자장가',
  '꿈속 바닷속',
  '양 대신 칫솔 세기',
  '잠옷 파티',
  '꿈 비누방울',
  '조용조용 밤 산책',
  '내일 또 만나',
  '산호 마을 대청소',
  '거북이 할아버지의 이',
  '물방울 경주',
  '해초 숲 미로',
  '조개 합창단',
  '문어의 여덟 칫솔',
  '고래의 큰 하품',
  '반짝 해파리 등불',
  '잃어버린 조개 왕관',
  '바닷속 불꽃놀이',
  '구름 솜사탕 가게',
  '무지개 미끄럼틀',
  '비구름이 울적해요',
  '별사탕 비',
  '구름 성의 종소리',
  '바람 친구와 연날리기',
  '코코의 뿔이 반짝',
  '구름 양 목장',
  '해님 아침 인사',
  '구름 왕국 퍼레이드',
  '꿀벌의 꿀단지',
  '나비 날개 그림',
  '씨앗을 심어요',
  '달팽이의 느린 양치',
  '빗방울 샤워',
  '무당벌레 점 세기',
  '민들레 홀씨 여행',
  '거미줄 이슬 목걸이',
  '꽃잎 차 마시기',
  '정원 음악회',
  '사탕 섬에 도착',
  '사탕 섬의 끈적 다리',
  '초코 숲 오솔길',
  '초코 숲의 부엉이',
  '거품 바다 항해',
  '거품 바다 등대',
  '별빛 섬의 밤',
  '별빛 섬 천문대',
  '무지개 성의 문',
  '무지개 성 축제',
  '대장 세균의 사과',
  '대장 세균의 첫 칫솔',
  '친구 소개 앨범',
  '두리의 키가 컸어요',
  '몽이의 비밀 노래',
  '코코의 소원',
  '반짝이의 일기',
  '거품 퍼레이드 준비',
  '이 마을 대축제',
  '100번째 반짝'
];
const EP_MAX = 999;
const EP_EVENT = { birthday:7, seollal:21, childrensday:23, chuseok:26, halloween:27, xmas:29, newyear:30 };   // 이벤트 날 보여 줄 편 (바이블 시즌 3 등)
const pad3 = (n) => String(n).padStart(3, '0');
const SP_SHORTS = [
  { id:'sp01', names:{ ko:'거품 서핑', en:'Foam Surfing', ja:'あわの サーフィン' } },
  { id:'sp02', names:{ ko:'세균 대장 숨바꼭질', en:'Peekaboo Germ', ja:'ばいきんと かくれんぼ' } },
  { id:'sp03', names:{ ko:'칫솔 로켓', en:'Toothbrush Rocket', ja:'はぶらし ロケット' } },
  { id:'sp04', names:{ ko:'무지개 치약 미끄럼틀', en:'Rainbow Toothpaste Slide', ja:'にじいろ すべりだい' } },
  { id:'sp05', names:{ ko:'반짝 댄스 파티', en:'Sparkle Dance Party', ja:'キラキラ ダンス' } },
  { id:'sp06', names:{ ko:'이빨 요정의 선물', en:"The Tooth Fairy's Gift", ja:'はの ようせいの プレゼント' } },
  { id:'sp07', names:{ ko:'둥실 거품 여행', en:'Bubble Ride', ja:'ふわふわ あわの たび' } },
  { id:'sp08', names:{ ko:'치약 기차', en:'Toothpaste Train', ja:'はみがきこ きしゃ' } },
  { id:'sp09', names:{ ko:'바닷속 보물찾기', en:'Undersea Treasure', ja:'うみの たからさがし' } },
  { id:'sp10', names:{ ko:'세균과 친구', en:'The Germ Friend', ja:'ばいきんと ともだち' } }
];
const SP_DEFAULT = Array.from({ length:EP_MAX }, (_, i) => ({ id:'ep' + pad3(i + 1), ep:i + 1, names: i < EP_TITLES_KO.length ? { ko:EP_TITLES_KO[i] } : null })).concat(SP_SHORTS);
const SPECIALS = (Array.isArray(RES.specials) && RES.specials.length ? RES.specials : SP_DEFAULT).map(v => {
  const files = Array.isArray(v.files) && v.files.length ? v.files.slice()
    : v.parts > 1 ? Array.from({ length:v.parts }, (_, k) => 'specials/' + v.id + '_' + (k + 1) + '.mp4')
    : [v.file || 'specials/' + v.id + '.mp4'];
  return Object.assign({}, v, { files });
});
// 제목: 그 언어 이름이 있으면 그것, 없으면 에피소드는 "스페셜 N화" (한국어 제목만 있는 편을 다른 언어에서 보여 줄 때)
const spTitle = (v) => (v.names && v.names[lang]) || (v.ep ? t('sp.epN', { n:v.ep }) : t('special.' + v.id));
injectNames('special.', Object.fromEntries(SPECIALS.filter(v => v.names).map(v => [v.id, v])));
const spKey = (f) => f.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase();   // 'specials/ep01_1.mp4' → 'ep01_1' (휴대폰 저장 키 sp:<이것>)
const SP_KEYS = [...new Set(SPECIALS.flatMap(v => v.files.map(spKey)))];
var specialOn = store.get('specialOn', true);
let spEnd = null;
// 영상 확인 (v0.25): 앱을 열고 조금 뒤 영상을 한 번 살짝 열어 봄 (머리 부분만). 한 부라도 못 틀면 그 편은 SP_BAD
// 의도: 파일이 없을 때 양치마다 "오늘은 스페셜!"이 잠깐 떴다가 극장으로 넘어가던 것 막기 / 2부작은 1부만 나오고 끊기지 않게
const SP_BAD = {}, SP_URLS = {};
let spScanP = null;
/* v0.34.0 화 제목을 코드 없이: specials/titles.txt (있으면). 한 줄에 한 화
     12 반짝이의 겨울잠          ← 한국어 제목
     12 en Sparkle's Winter Nap  ← 영어 (ja 도 같은 방식)
   # 로 시작하는 줄은 메모. 여기 적은 제목이 코드 안 제목(EP_TITLES_KO)보다 먼저. 없는 화는 "스페셜 N화"
   v0.35.0 번호 뒤에 "먼저"(en: first, ja: さき)를 붙이면 그 화를 이미 쓰던 아이에게 다음 양치 때 바로 보여 줌
     13 먼저 크리스마스 특집     ← 바로 보여 줌
     14 반짝이의 겨울잠          ← 안 붙이면 차례대로 (지금 보던 화 다음으로, 맨 뒤에 붙음)
   "먼저" 화 목록은 bj_spFirst 에 저장 (폴더를 확인하지 않는 날에도 씀) */
async function spTitles(){
  let txt = ''; const first = [];
  if (/^https?:/.test(location.protocol)) try{ const r = await fetch('specials/titles.txt', { cache:'no-store' }); if (r.ok) txt = await r.text(); }catch(e){}   // 파일로 바로 열면 못 읽음 (앱 안 제목 사용)
  txt.split(/\r?\n/).forEach(line => {
    const m = line.trim().match(/^(\d{1,3})(?:[\s.|:)\-]+(먼저|first|さき)(?=\s|$))?(?:[\s.|:)\-]+(?:(ko|en|ja)[\s:]+)?(.+))?$/i);
    if (!m || line.trim().startsWith('#')) return;
    const v = SPECIALS.find(x => x.ep === +m[1]); if (!v) return;
    if (m[2]) first.push(v.id);
    if (m[4]) v.names = Object.assign({}, v.names || {}, { [(m[3] || 'ko').toLowerCase()]:m[4].trim().slice(0, 40) });
  });
  if (txt || /^https?:/.test(location.protocol)) store.set('spFirst', [...new Set(first)]);
}
function spScan(){                                                          // 에피소드는 번호 순서로, 10편 연속 없으면 그 뒤는 확인 안 함
  if (!spScanP) spScanP = (async () => {
    await spTitles();
    let miss = 0;
    for (const v of SPECIALS){
      if (v.ep && miss >= 10 && !v.files.some(f => SP_BLOB[spKey(f)])){ SP_BAD[v.id] = 1; continue; }
      const r = await spFind(v);
      if (r){ delete SP_BAD[v.id]; SP_URLS[v.id] = r; if (v.ep) miss = 0; }
      else { SP_BAD[v.id] = 1; if (v.ep) miss++; }
    }
  })();
  return spScanP;
}
/* v0.34.0 → v0.35.0 새 화를 올릴 때: 그냥 다음 번호로 올리면 차례대로 (맨 뒤). titles.txt 에 "13 먼저" 라고 적은 화만
   이미 쓰던 아이가 다음 양치 때 바로 봄 (하루 한 편 · 반짝이 클럽 규칙은 그대로). 처음 쓰는 아이는 늘 1화부터
   하루 한 번(bj_spCheck) 폴더와 titles.txt 를 다시 확인. 주의: 번호는 이어서 올릴 것 (10개 넘게 비면 그 뒤는 못 찾음) */
const spDone = (s) => [].concat((s && s.newDone) || []);
const spNewFor = () => { const s = store.get('special', null); if (!s) return null;
  return (store.get('spFirst', []) || []).find(id => !spDone(s).includes(id) && !(s.seen || []).includes(id)) || null; };
async function specialPick(){
  if (!pro() || !specialOn) return null;
  const check = store.get('spCheck', '') !== todayKey();                     // 하루 한 번은 새 화가 올라왔는지 확인
  if (!specialDue(SPECIALS) && !check && !spNewFor()) return null;            // 오늘은 스페셜 날이 아님 (확인할 필요도 없음)
  try{ await spScan(); }catch(e){ return null; }
  if (check) store.set('spCheck', todayKey());
  const sp = specialDue(SPECIALS.filter(v => !SP_BAD[v.id]));
  if (sp) sp.urls = SP_URLS[sp.v.id];
  return sp;
}
function specialDue(list){
  list = list || SPECIALS;
  if (!pro()) return null;                                                    // v0.32.0 스페셜 영상은 반짝이 클럽
  if (!specialOn || !list.length) return null;
  const s = store.get('special', null), today = todayKey(), dn = dayNum(new Date());
  if (s && s.day === today) return null;                                      // 하루에 한 번까지
  let why = null;
  if (!s) why = 'new';
  else if (spEvKey() && s.ev !== spEvKey()) why = 'event';                  // 이벤트 기간엔 첫날 한 번만 (v0.25: 기간 내내 매일 나오던 것)
  else if (log.filter(k => k === today).length === 1 && [3, 7, 14, 30].includes(streakDays())) why = 'streak';
  else if (dn - (s.last || 0) >= 7) why = 'week';
  const nw = spNewFor(), nv = nw && list.find(v => v.id === nw);
  if (nv) return { v:nv, why:'fresh' };                                       // v0.35.0 "먼저" 표시한 화
  if (!why) return null;
  const seen = (s && s.seen) || [], last = seen[seen.length - 1];
  const ev = why === 'event' ? activeEvent() : null, evEp = ev && EP_EVENT[ev.text || ev.id] ? list.find(v => v.ep === EP_EVENT[ev.text || ev.id]) : null;
  if (evEp) return { v:evEp, why };                                         // 이벤트 날: 그 날을 위한 편 (봤어도 다시)
  let fresh = list.filter(v => !seen.includes(v.id));
  if (!fresh.length) fresh = list.length > 1 ? list.filter(v => v.id !== last) : list;   // 다 봤으면 다시 (방금 본 것만 빼고)
  const eps = fresh.filter(v => v.ep).sort((a, b) => a.ep - b.ep);           // 에피소드는 1화부터 차례로 (v0.28)
  return { v: eps.length ? eps[0] : pick(fresh), why };
}
const spEvKey = () => {                                                       // 이번 이벤트 (해마다 새로)
  const e = activeEvent(); if (!e) return null;
  const d = new Date(), w = e.when || {};                                     // v0.37.1 12-31 ~ 01-02 처럼 해를 넘기는 이벤트는 시작한 해로 (예전엔 1월 1일에 한 번 더 나왔음)
  const wrap = w.type === 'fixed' && +w.from.replace('-', '') > +w.to.replace('-', '') && mmdd(d) <= +w.to.replace('-', '');
  return e.id + '-' + (d.getFullYear() - (wrap ? 1 : 0));
};
function markSpecial(id, played){                                          // played=false: 재생 실패 → 본 것으로만 쳐서 다음엔 다른 영상
  const s = store.get('special', null) || { seen:[] };
  let seen = (s.seen || []).filter(x => SPECIALS.some(v => v.id === x) && x !== id);
  seen.push(id);
  const ok = SPECIALS.filter(v => !SP_BAD[v.id]);                           // 틀 수 있는 것을 다 봤으면 처음부터 (방금 본 것만 남김)
  if (ok.length && ok.every(v => seen.includes(v.id))) seen = [id];
  const newDone = [...new Set(spDone(s).concat((store.get('spFirst', []) || []).includes(id) ? [id] : []))];   // "먼저" 화를 봤으면 다시 안 띄움
  store.set('special', played ? { last:dayNum(new Date()), day:todayKey(), seen, ev:spEvKey() || s.ev || null, newDone } : Object.assign({}, s, { seen, last:s.last || 0, newDone }));
}
// 파일 이름 대소문자가 달라도 찾기 (sp01.mp4 · Sp01.mp4 · SP01.mp4 · sp01.MP4 …, 폴더 specials · Specials)
// 의도: 휴대폰 · 웹 서버는 대문자 · 소문자를 다른 이름으로 봄 → 이름을 바꾸다 첫 글자가 대문자가 되는 일이 흔함 (v0.22.1)
const SP_OK = {};                                                            // 찾은 경로 기억 {파일 키: 경로}
// 휴대폰에 넣은 영상 (v0.23): 설정 "스페셜 영상 넣기"로 고른 파일을 이 기기(IndexedDB, 키 sp:<파일 키>)에 저장
// 의도: 파일 앱에서 index.html 을 바로 열면 크롬이 옆 specials 폴더를 못 읽음 → 폴더 대신 앱 안에 넣어 두기
const SP_BLOB = {};                                                          // {파일 키: blob 주소}
async function spStoredKeys(){                                             // 저장된 sp:<키> 목록을 한 번에 (999편을 하나씩 열지 않게)
  try{
    const db = await BgmStore.open();
    return await new Promise((res) => { const q = db.transaction('files').objectStore('files').getAllKeys(); q.onsuccess = () => res((q.result || []).filter(k => typeof k === 'string' && k.indexOf('sp:') === 0).map(k => k.slice(3))); q.onerror = () => res([]); });
  }catch(e){ return []; }
}
async function spLoadBlobs(){
  const keys = await spStoredKeys();
  for (const k of keys){ if (!SP_KEYS.includes(k)) continue; try{ const b = await RecStore.get('sp:' + k); if (b){ if (SP_BLOB[k]) URL.revokeObjectURL(SP_BLOB[k]); SP_BLOB[k] = URL.createObjectURL(b); } }catch(e){} }
  spInfo();
}
const spStoredAll = (v) => v.files.every(f => SP_BLOB[spKey(f)]);
function spInfo(){
  const n = SPECIALS.filter(spStoredAll).length;
  $('#spInfo').textContent = n ? t('sp.stored', { n }) : t('sp.storedNone');
  $('#spClear').hidden = !SP_KEYS.some(k => SP_BLOB[k]);
}
async function spImport(files){
  files = [...(files || [])].filter(f => /^video\//.test(f.type) || /\.(mp4|webm|mov|m4v)$/i.test(f.name));
  if (!files.length){ toast(t('sp.notVideo')); return; }
  files.sort((a, b) => a.name.localeCompare(b.name));
  const plan = {}, rest = [];
  files.forEach(f => {                                                       // 이름의 번호로 자리 찾기: ep01_1 · Ep1-2 · sp01 · Sp1 …
    const m = f.name.match(/(ep|sp)[\s_-]*0*(\d{1,3})(?:[\s_-]*(?:part|p|부)?[\s_-]*0*([1-9]))?/i);
    let k = null;
    if (m){ const ep = m[1].toLowerCase() === 'ep', base = m[1].toLowerCase() + (ep ? pad3(+m[2]) : String(+m[2]).padStart(2, '0')); k = SP_KEYS.includes(base + '_' + m[3]) ? base + '_' + m[3] : SP_KEYS.includes(base) ? base : null; }
    if (k && !plan[k]) plan[k] = f; else rest.push(f);
  });
  SPECIALS.filter(v => v.files.length === 1).forEach(v => { const k = spKey(v.files[0]); if (!plan[k] && !SP_BLOB[k] && rest.length) plan[k] = rest.shift(); });   // 번호 없는 파일은 빈 단편 자리에 차례로
  if (!Object.keys(plan).length){ toast(t('sp.notVideo')); return; }
  toast(t('sp.saving'), 30000);
  try{ if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); }catch(e){}
  let ok = 0, fail = 0;
  for (const [k, f] of Object.entries(plan)){
    if (f.size > 60 * 1024 * 1024){ fail++; continue; }
    try{ await RecStore.put('sp:' + k, f); ok++; }
    catch(e){ fail++; if (SP_BLOB[k]) URL.revokeObjectURL(SP_BLOB[k]); SP_BLOB[k] = URL.createObjectURL(f); }   // 저장 실패 → 이번 실행에서만
    delete SP_OK[k];
  }
  await spLoadBlobs(); spScanP = null;
  toast(fail ? t('sp.savedSome', { ok, fail }) : t('sp.saved', { n:ok }), 5000);
}
async function spClearAll(){
  for (const k of await spStoredKeys()){ try{ await RecStore.del('sp:' + k); }catch(e){} }
  Object.keys(SP_BLOB).forEach(k => { URL.revokeObjectURL(SP_BLOB[k]); delete SP_BLOB[k]; });
  Object.keys(SP_OK).forEach(k => delete SP_OK[k]);
  spScanP = null; spInfo(); toast(t('sp.cleared'));
}
function spVariants(f){
  const i = f.lastIndexOf('/') + 1, d = f.slice(0, i), b = f.slice(i), dot = b.lastIndexOf('.');
  const n = dot > 0 ? b.slice(0, dot) : b, e = dot > 0 ? b.slice(dot) : '';
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const m = n.match(/^ep(\d+)$/i), nums = m ? [n, 'ep' + String(+m[1]).padStart(2, '0')] : [n];   // ep007 · ep07 (v0.28)
  const dirs = [d, cap(d)], names = [...new Set(nums.flatMap(x => [x, cap(x), x.toUpperCase()]))], exts = [e, e.toUpperCase()];
  const out = [];
  dirs.forEach(dd => names.forEach(nn => exts.forEach(ee => out.push(dd + nn + ee))));
  return [...new Set(out)];
}
function spProbe(path){                                                       // 영상 머리 부분만 읽어 보고 틀 수 있는지 확인
  return new Promise((res) => {
    const el = document.createElement('video'); el.preload = 'metadata'; el.muted = true;
    const done = (ok) => { clearTimeout(to); el.onloadedmetadata = el.onerror = null; el.removeAttribute('src'); try{ el.load(); }catch(e){} res(ok); };
    const to = setTimeout(() => done(false), 6000);
    el.onloadedmetadata = () => done(el.videoWidth > 0);
    el.onerror = () => done(false);
    el.src = path;
  });
}
// v0.36.0 없는 파일은 머리(HEAD)만 물어보고 바로 넘김. 의도: 앱을 열 때마다 없는 이름 수백 개를 영상 칸으로 하나씩 열어 보던 것을 줄임
// 결과: false = 확실히 없음(404) · null = 모름 (파일로 바로 연 때 · 인터넷 없음 · HEAD 를 안 받는 서버) → 예전처럼 영상으로 확인
async function spExists(path){
  if (location.protocol === 'file:') return null;                            // 파일로 바로 연 때는 물어볼 수 없음 (콘솔 오류만 남음)
  try{ const r = await fetch(path, { method:'HEAD', cache:'no-store' }); return r.status === 404 || r.status === 410 ? false : null; }
  catch(e){ return null; }
}
async function spFindPart(f){
  const k = spKey(f);
  if (SP_BLOB[k]) return SP_BLOB[k];
  if (SP_OK[k]) return SP_OK[k];
  const cands = spVariants(f), has = await Promise.all(cands.map(spExists));   // 이름 후보를 한꺼번에 물어봄 (순서는 그대로 지킴)
  for (let i = 0; i < cands.length; i++){ if (has[i] !== false && await spProbe(cands[i])){ SP_OK[k] = cands[i]; return cands[i]; } }
  return null;
}
async function spFind(v){                                                    // 모든 부를 찾아야 그 편을 씀 → 주소 목록
  const urls = [];
  for (const f of v.files){ const u = await spFindPart(f); if (!u) return null; urls.push(u); }
  return urls;
}
function playSpecial(sp, onDone, preview){
  const v = sp.v, title = spTitle(v);
  const box = $('#spStage'), vid = $('#spVideo'), badge = $('#spPart');
  // 부마다 시도할 주소: 확인된 주소가 있으면 그것, 없으면 휴대폰에 넣은 것 → 대소문자 바꾼 이름들
  const parts = v.files.map((f, i) => sp.urls && sp.urls[i] ? [sp.urls[i]] : SP_BLOB[spKey(f)] ? [SP_BLOB[spKey(f)]] : SP_OK[spKey(f)] ? [SP_OK[spKey(f)]] : spVariants(f));
  let finished = false, started = false, pi = 0, ci = 0, wantPlay = false;
  const cleanup = () => { vid.onerror = vid.onplaying = vid.onended = null; try{ vid.pause(); }catch(e){} vid.removeAttribute('src'); try{ vid.load(); }catch(e){} box.className = 'sp-stage'; badge.className = 'sp-part'; $('#spSound').hidden = true; spEnd = null; };
  const end = () => {
    if (finished) return; finished = true;
    if (!started && !preview){                                                // 시작 전에 건너뜀 → 오늘 스페셜은 끝 (영상은 안 본 것으로 남김)
      const s0 = store.get('special', null) || { seen:[] };
      store.set('special', Object.assign({}, s0, { last:dayNum(new Date()), day:todayKey(), seen:s0.seen || [], ev:spEvKey() || s0.ev || null }));
    }
    cleanup(); Voice.stop(); onDone();
  };
  const closeEnd = () => { if (finished) return; box.classList.remove('open'); setTimeout(end, 900); };   // 막 닫고 끝
  const fallback = () => {                                                    // 1부부터 안 됨 → 반짝이 극장
    if (finished) return; finished = true; cleanup();
    if (preview){ Voice.stop(); toast(t('sp.fail', { file:v.files[0] }), 6000); onDone(); return; }   // 미리 보기: 무엇이 안 됐는지 알려 줌
    markSpecial(v.id, false);
    if (theaterOn) playTheater(onDone); else onDone();
  };
  const tryPlay = () => {
    const p = vid.play();
    if (p && p.catch) p.catch((err) => {
      if (finished) return;
      if (err && err.name === 'NotAllowedError'){                            // 소리 있는 자동 재생이 막힘 → 소리 끄고 재생
        vid.muted = true; $('#spSound').hidden = false;
        vid.play().catch(() => {});
      }                                                                       // 다른 실패는 onerror(다음 이름) · 시간 제한이 처리
    });
  };
  spEnd = end;
  $('#spTitle').innerHTML = `<b>${esc(t('sp.today'))}</b><span>${esc(title)}</span>`;
  $('#spHead').textContent = '🎞 ' + t(sp.why === 'new' || sp.why === 'fresh' ? 'sp.new' : 'sp.today');
  badge.textContent = t('sp.part2'); badge.className = 'sp-part';
  box.className = 'sp-stage';
  vid.muted = false;
  vid.onended = () => {
    if (finished) return;
    if (pi < parts.length - 1){                                               // 다음 부로 바로 이어서 (v0.27 2부작)
      pi++; ci = 0; vid.src = parts[pi][0]; tryPlay();
      badge.classList.remove('show'); void badge.offsetWidth; badge.classList.add('show');
      tone(784, .12, 'sine', .1); tone(1047, .16, 'sine', .1, .1);
      return;
    }
    setTimeout(closeEnd, 300);
  };
  vid.onerror = () => {                                                       // 이 이름으로 못 찾음 → 대소문자 바꾼 다음 이름
    if (finished) return;
    ci++;
    if (ci < parts[pi].length){ vid.src = parts[pi][ci]; if (wantPlay) tryPlay(); return; }
    if (pi === 0 && !started) fallback(); else closeEnd();                    // 2부가 안 되면 조용히 끝
  };
  vid.onplaying = () => {                                                     // 진짜로 나오기 시작하면 막을 엶 (그 전엔 제목)
    if (finished) return;
    const k = spKey(v.files[pi]); if (!SP_BLOB[k]) SP_OK[k] = parts[pi][ci];
    if (started) return;
    started = true; box.classList.add('open');
    if (!preview) markSpecial(v.id, true);
  };
  vid.src = parts[0][0];
  show('special');
  TH_SND.fanfare();
  Voice.play('special', t('sp.say', { title }));
  setTimeout(() => {
    if (finished) return;
    wantPlay = true; tryPlay();
    setTimeout(() => { if (!started && !finished) fallback(); }, 8000);       // 8초 안에 시작 못 하면 극장으로 (느린 인터넷 고려)
  }, 1900);
}
$('#spLoad').addEventListener('click', () => { sfx.tap(); $('#spFile').click(); });
$('#spFile').addEventListener('change', (e) => { spImport(e.target.files); e.target.value = ''; });
$('#spClear').addEventListener('click', () => { sfx.tap(); spClearAll(); });
spLoadBlobs().then(() => setTimeout(() => { if (specialOn) spScan(); }, 2500));   // 앱이 다 뜬 뒤 영상 확인
$('#spSkip').addEventListener('click', () => { sfx.tap(); if (spEnd) spEnd(); });
$('#spSound').addEventListener('click', () => { const vid = $('#spVideo'); vid.muted = false; vid.play().catch(() => {}); $('#spSound').hidden = true; });
// 미리 보기 단추: 먼저 영상 파일을 모두 확인해서 몇 편이 되는지 알려 주고, 되는 것 하나를 틀어 줌
$('#specialTest').addEventListener('click', async () => {
  sfx.tap();
  toast(t('sp.check'), 20000);
  spScanP = null;
  await spScan();
  const okList = SPECIALS.filter(v => !SP_BAD[v.id]);
  const epOk = SPECIALS.filter(v => v.ep && !SP_BAD[v.id]).length, shOk = SPECIALS.filter(v => !v.ep && !SP_BAD[v.id]).length;
  if (!okList.length){ toast(t('sp.checkNone'), 8000); return; }
  toast(t('sp.checkSum', { ep:epOk, sh:shOk }), 5000);
  const sp = specialDue(okList) || { v:okList.filter(v => v.ep).sort((a, b) => a.ep - b.ep)[0] || pick(okList) };
  playSpecial({ v:sp.v, why:'week', urls:SP_URLS[sp.v.id] }, () => { refreshHome(); show('home'); }, true);
});
document.addEventListener('visibilitychange', () => {                       // 다른 앱으로 가면 잠깐 멈춤
  if (current !== 'special') return;
  const vid = $('#spVideo');
  if (document.hidden) vid.pause(); else if (vid.src) vid.play().catch(() => {});
});
if (TEST_MODE) window.__bjSpecial = (i) => playSpecial({ v:SPECIALS[i || 0], why:'week' }, () => { refreshHome(); show('home'); }, true);
