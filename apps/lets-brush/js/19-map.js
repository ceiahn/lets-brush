'use strict';

/* =========================================================
   14-7. 모험 지도 (v0.37.1 에 18-backup.js 에서 따로 나눔)
     양치 1번 = 1칸 (하루 CONFIG.mapPerDay 칸까지), 섬 하나 = CONFIG.mapSteps 칸
     섬 순서대로 변신 옷 머리 → 눈 → 목 → 등 → 손 (heroPartFor), 마지막 무지개 성 = 특별한 알
     구독 전(subs.on 일 때)은 첫 섬까지 (mapLocked)
     저장 bj_map { i:섬 번호 누적, step, day, dayN }
   ========================================================= */
const ISLANDS = [
  { id:'candy',   sea:'#bfe8ff', land:'#ffd3e6', edge:'#ff9ec0', deco:'#ff7aa8', star:5, gift:'toy_ball' },
  { id:'choco',   sea:'#bfe8ff', land:'#ecd3b6', edge:'#c89a6e', deco:'#8a5a32', star:5, gift:'plant_pot' },
  { id:'bubble',  sea:'#9fd6ff', land:'#e0f6ff', edge:'#7fc8f2', deco:'#ffffff', star:5, gift:'rug_round' },
  { id:'star',    sea:'#34407a', land:'#dcd3ff', edge:'#9d8cf0', deco:'#ffe066', star:5, gift:'lamp_star' },
  { id:'rainbow', sea:'#bfe8ff', land:'#fff3c8', edge:'#ffcf5a', deco:'#7fd6a0', star:10, egg:true }      // 마지막 섬: 특별한 알
];
let mapS = store.get('map', { i:0, step:0, day:'', dayN:0 });
const curIsl = () => ISLANDS[mapS.i % ISLANDS.length];
const mapLeft = () => CONFIG.mapSteps - mapS.step;
const mapLocked = () => !pro() && mapS.i >= subCfg().freeIslands;               // v0.32.0 구독 전엔 첫 섬까지
function mapAdvance(force){
  if (mapLocked()) return { type:'lock' };
  const today = todayKey();
  if (mapS.day !== today){ mapS.day = today; mapS.dayN = 0; }
  if (!force && mapS.dayN >= CONFIG.mapPerDay) return { type:'rest' };
  if (!force) mapS.dayN++;
  mapS.step++;
  let ev = { type:'step' };
  if (mapS.step >= CONFIG.mapSteps){
    const isl = curIsl(); ev = { type:'castle', island:isl.id, stars:isl.star || CONFIG.reward.castle };
    const hp = heroPartFor(mapS.i % ISLANDS.length);                    // 변신 옷 한 부분 (세 세트 다 모으면 펫 방 물건 · 별)
    if (hp){
      owned = owned.concat(hp); store.set('owned', owned); ev.hero = hp;
      const hs = HERO_SETS.find(x => x.id === ITEMS[hp].hero); if (heroHave(hs.id) >= SLOT_IDS.length) ev.heroSet = hs;
    } else if (isl.gift && ROOM[isl.gift] && !roomOwned.includes(isl.gift)){ roomOwned.push(isl.gift); store.set('roomOwned', roomOwned); ev.gift = isl.gift; }
    else if (!isl.egg) ev.stars += 3;
    if (isl.egg){                                                   // 무지개 성: 특별한 알 선물 (v0.24: 품던 알은 빼앗지 않음)
      const pool = freePool(legendIds), e = petState.egg;
      if (!pool.length || (e && e.special) || petState.nextSpecial) ev.stars += 5;          // 전설을 다 모았거나 이미 특별한 알이면 별
      else if (!e || (!(e.p > 0) && !e.feat)){ petState.egg = { sp:pick(pool), p:0, special:true }; store.set('pet', petState); renderPets(); ev.egg = true; }   // 막 받은 알은 바로 바꿔도 잃는 게 없음
      else { petState.nextSpecial = true; store.set('pet', petState); ev.eggNext = true; }  // 품던 알은 그대로 → 다음 알이 특별한 알
    }
    mapS.i++; mapS.step = 0;
  }
  store.set('map', mapS);
  return ev;
}
function mapSVG(isl = curIsl(), st = mapS.step){
  const N = CONFIG.mapSteps, P = [];
  for (let k = 0; k <= N; k++) P.push([k === 0 || k === N ? 150 : (k % 2 ? 214 : 86), 468 - k * 392 / N]);
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let k = 1; k <= N; k++) d += ` C${P[k - 1][0]} ${P[k - 1][1] - 28} ${P[k][0]} ${P[k][1] + 28} ${P[k][0]} ${P[k][1]}`;
  let deco = '';
  for (let i = 0; i < 9; i++) deco += `<circle data-noink="1" cx="${40 + (i * 89) % 220}" cy="${70 + (i * 131) % 400}" r="${4 + i % 3 * 2}" fill="${isl.deco}" opacity=".55"/>`;
  const STAR = (x, y) => `<path transform="translate(${x} ${y})" d="M0 -10 l3 6.2 6.8 .9 -5 4.7 1.3 6.7 -6.1 -3.3 -6.1 3.3 1.3 -6.7 -5 -4.7 6.8 -.9z" fill="#fff"/>`;
  const nodes = P.slice(0, N).map(([x, y], k) => {
    const done = k < st;
    return `<circle cx="${x}" cy="${y}" r="17" fill="${done ? '#ffd54a' : '#fff'}" stroke="${done ? '#e0a100' : isl.edge}" stroke-width="4"/>` +
      (done ? STAR(x, y) : `<text x="${x}" y="${y + 5.5}" text-anchor="middle" font-size="15" fill="#8a9ab3">${k + 1}</text>`);
  }).join('');
  const [cx, cy] = P[N];
  const castle = `<g transform="translate(${cx} ${cy})"><rect x="-32" y="-26" width="64" height="38" rx="3" fill="#fff" stroke="${isl.edge}" stroke-width="4"/>
      <rect x="-46" y="-44" width="20" height="56" rx="3" fill="#fff" stroke="${isl.edge}" stroke-width="4"/><rect x="26" y="-44" width="20" height="56" rx="3" fill="#fff" stroke="${isl.edge}" stroke-width="4"/>
      <path d="M-49 -44 L-36 -64 L-23 -44Z M23 -44 L36 -64 L49 -44Z" fill="#ff7aa8"/><path d="M0 -26 V-58" stroke="#8a7a66" stroke-width="3"/><path d="M0 -58 L20 -52 L0 -46Z" fill="#ffd54a"/>
      <path d="M-10 12 V-4 Q0 -14 10 -4 V12Z" fill="${isl.edge}"/>${st >= N ? '<circle cy="-8" r="13" fill="#3ccf9c"/><path d="M-6 -8 L-1.5 -3.5 L7 -12" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : ''}</g>`;
  const me = st < N ? `<g transform="translate(${P[st][0]} ${P[st][1] - 30})"><g class="map-me"><g transform="scale(1.35)">
      <path d="M-14 -8 C-14 -22 -2 -22 0 -16 C2 -22 14 -22 14 -8 C14 4 10 8 9 16 C8 22 4 22 3 16 C2 12 1 10 0 10 C-1 10 -2 12 -3 16 C-4 22 -8 22 -9 16 C-10 8 -14 4 -14 -8Z" fill="#fff" stroke="#bfe3f7" stroke-width="2.5"/>
      <circle cx="-5" cy="-6" r="2.2" fill="#24324a"/><circle cx="5" cy="-6" r="2.2" fill="#24324a"/><path d="M-4 0 Q0 4 4 0" stroke="#24324a" stroke-width="1.8" fill="none"/></g></g></g>` : '';
  return `<svg viewBox="0 0 300 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${inkScene(`
      <rect data-noink="1" width="300" height="520" rx="24" fill="${isl.sea}"/>
      <path d="M150 20 C252 20 288 120 278 250 C270 380 292 500 150 506 C8 500 30 380 22 250 C12 120 48 20 150 20Z" fill="${isl.land}" stroke="${isl.edge}" stroke-width="6"/>
      ${deco}<path data-noink="1" d="${d}" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="2 14"/>${castle}${nodes}${me}`, 4)}</svg>`;
}
let mapView = null;                                   // 보고 있는 섬 (null = 지금 섬)
const islState = (i) => { const cur = mapS.i % ISLANDS.length; return i === cur ? 'cur' : (i < cur || mapS.i >= ISLANDS.length) ? 'done' : 'lock'; };
// 섬에서 받는 (받은) 변신 옷: 지난 섬은 그 바퀴의 세트
function islandPart(i, st){
  if (st !== 'done') return heroPartFor(i);
  const lap = Math.floor(mapS.i / ISLANDS.length), cur = mapS.i % ISLANDS.length, hs = HERO_SETS[i < cur ? lap : lap - 1];
  return hs ? heroItem(hs.id, SLOT_IDS[i % SLOT_IDS.length]) : null;
}
function mapPrize(isl, done, i){
  const parts = [`⭐ ${isl.star || CONFIG.reward.castle}`];
  let icon = '';
  const hp = islandPart(i, done ? 'done' : 'cur');
  if (hp){ icon = Character.thumb(hp); parts.push(itemName(hp)); }
  if (isl.egg){ icon = icon || eggSVG('penguin', 0, true); parts.push(t('map.eggGift')); }
  else if (hp){}
  else if (isl.gift && ROOM[isl.gift] && (done || !roomOwned.includes(isl.gift))){ icon = roomThumb(isl.gift); parts.push(t('room.' + isl.gift)); }   // 이미 받은 물건은 다음 바퀴엔 빼고
  return { icon, text:parts.join(' + ') };
}
function renderMap(){
  const cur = mapS.i % ISLANDS.length, v = mapView === null ? cur : mapView, isl = ISLANDS[v], stt = islState(v), lap = Math.floor(mapS.i / ISLANDS.length);
  $('#mapChips').innerHTML = ISLANDS.map((x, i) => { const st = islState(i);
    return `<button class="map-chip ${st === 'cur' ? 'cur' : st === 'lock' ? 'lock' : ''} ${i === v ? 'view' : ''}" data-i="${i}">${st === 'cur' ? '📍 ' : st === 'done' ? '✓ ' : '🔒 '}${t('map.isl.' + x.id)}</button>`; }).join('');
  $('#mapScene').innerHTML = mapSVG(isl, stt === 'cur' ? mapS.step : CONFIG.mapSteps);
  const rest = mapS.day === todayKey() && mapS.dayN >= CONFIG.mapPerDay;
  $('#mapLeft').textContent = (lap > 0 && stt === 'cur' ? t('map.lap', { n:lap + 1 }) + ' · ' : '') +
    (stt === 'done' ? t('map.cleared') : stt === 'cur' && mapLocked() ? t('sub.mapLock') : rest ? t('map.rest') : t('map.left', { n:mapLeft() }));
  const pz = mapPrize(isl, stt === 'done', v);
  $('#mapReward').innerHTML = `${pz.icon}<span>🏰 ${stt === 'done' ? t('map.got') : t('map.reward')}: <b>${pz.text}</b></span>`;
  $('#mapHow').textContent = t('map.how');
  const vc = $('#mapChips .view'), box = $('#mapChips');                    // 보고 있는 섬 단추가 보이게
  if (vc) box.scrollLeft = vc.offsetLeft - (box.clientWidth - vc.offsetWidth) / 2;
}
$('#mapChips').addEventListener('click', (e) => {
  const b = e.target.closest('.map-chip'); if (!b) return;
  const i = +b.dataset.i;
  if (islState(i) === 'lock'){ sfx.nope(); toast(t('map.lockedSay')); Voice.play('map', t('map.lockedSay')); return; }
  sfx.tap(); mapView = i; renderMap();
  Voice.play('map', t('map.isl.' + ISLANDS[i].id) + '. ' + $('#mapLeft').textContent);
});
$('#mapBtn').addEventListener('click', () => {
  sfx.tap(); mapView = null; renderMap(); show('map');
  Voice.play('map', t('map.isl.' + curIsl().id) + '. ' + $('#mapLeft').textContent);
});
