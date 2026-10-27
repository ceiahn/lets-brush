'use strict';

/* =========================================================
   12. 꾸미기 화면
      탭: 🆕 이번 주 · 모자 · 안경 · 목 · 등 · 손 · 칫솔 · 🦸 변신
      의도: 이번 주 탭 = "다음 주엔 뭐가 나올까" 기대 (산 건 계속 내 것 — 놓쳤다는 압박은 주지 않음)
            변신 탭 = 지도에서 모은 세트 진행도. 다 모은 세트는 눌러서 한 번에 입고 변신
            옷은 equip(id, 부위)로 입힘 → 변신 세트가 완성되는 순간 heroShow() 축하
   ========================================================= */
let curTab = 'head';
const itemName = (id) => { const w = ITEMS[id] && ITEMS[id].wk; return w ? t('wk.name', { color:t('wk.c.' + w[1]), shape:t('wk.s.' + w[0]) }) : t('item.' + id); };
const CLOSET_TABS = () => ['weekly'].concat(SLOT_IDS, 'brush', 'hero');
function renderTabs(){
  const wkNew = weeklyIds().some(id => !owned.includes(id));
  $('#tabs').innerHTML = CLOSET_TABS().map(s =>
    `<button class="tab ${s === curTab ? 'active' : ''} ${s === 'weekly' && wkNew ? 'has-new' : ''}" data-tab="${s}">${t('slot.' + s)}</button>`).join('');
  chars.closet.setState(curTab === 'brush' ? 'brushing' : 'idle');     // 칫솔 탭에선 반짝이가 칫솔을 들고 미리 보여줌
}
function renderBrushGrid(){
  const ids = Object.keys(BRUSHES).sort((a, b) => BRUSHES[a].cost - BRUSHES[b].cost);
  $('#grid').innerHTML = ids.map(id => {
    const has = myBrushes.includes(id), on = brush === id;
    const tag = on ? t('closet.using') : has ? t('closet.owned') : `⭐ ${BRUSHES[id].cost}`;
    return `
      <button class="item ${on ? 'equipped' : ''} ${has ? '' : 'locked'}" data-id="${id}">
        <div class="thumb">${brushThumb(id)}</div>
        <span class="name">${itemName(id)}</span><span class="tag">${tag}</span>
      </button>`;
  }).join('');
}
function itemCard(id, eff, ev){
  const it = ITEMS[id], isEv = !!it.event, has = isEv || owned.includes(id), on = eff[it.slot] === id;
  const tag = on ? t('closet.wearing') : isEv ? t('closet.eventTag', { icon:ev.icon }) : has ? t('closet.owned') : it.hero ? t('closet.mapTag') : `⭐ ${it.cost}`;
  return `
      <button class="item ${on ? 'equipped' : ''} ${has ? '' : 'locked'} ${isEv ? 'event' : ''} ${it.hero ? 'hero-i' : ''}" data-id="${id}">
        <div class="thumb">${Character.thumb(id)}</div>
        <span class="name">${itemName(id)}</span><span class="tag">${tag}</span>
      </button>`;
}
// 변신 탭: 세트마다 큰 카드 (다 모으면 눌러서 한 번에 입고 변신)
function renderHeroGrid(){
  const cur = heroSetOf(effectiveLook());
  $('#grid').innerHTML = HERO_SETS.map(hs => {
    const n = heroHave(hs.id), done = n >= SLOT_IDS.length, on = cur === hs;
    const parts = SLOT_IDS.map(sl => { const id = heroItem(hs.id, sl); return `<i class="${owned.includes(id) ? 'on' : ''}">${Character.thumb(id)}</i>`; }).join('');
    return `
      <button class="item hero-card ${on ? 'equipped' : ''} ${done ? '' : 'locked'}" data-set="${hs.id}" style="--ha:${hs.aura}">
        <div class="thumb">${Character.art(heroLook(hs.id))}</div>
        <div class="hc-txt"><span class="name">${t('hero.set.' + hs.id)}</span><span class="hc-parts">${parts}</span>
          <span class="tag">${on ? t('hero.wearing') : done ? t('hero.wear') : t('hero.need', { n:SLOT_IDS.length - n })}</span></div>
      </button>`;
  }).join('') + `<p class="grid-note">${t('hero.how')}</p>`;
}
function renderGrid(){
  if (curTab === 'brush') return renderBrushGrid();
  if (curTab === 'hero') return renderHeroGrid();
  const ev = activeEvent(), eff = effectiveLook();
  if (curTab === 'weekly'){
    $('#grid').innerHTML = `<p class="grid-note wk-note">${t('closet.weekLeft', { n:weekDaysLeft() })}</p>` + weeklyIds().map(id => itemCard(id, eff, ev)).join('');
    return;
  }
  const ids = Object.keys(ITEMS)
    .filter(id => { const it = ITEMS[id]; if (it.slot !== curTab) return false; if (it.event) return !!(ev && it.event === ev.id); if (it.weekly) return owned.includes(id); return true; })
    .sort((a, b) => (ITEMS[b].event ? 1 : 0) - (ITEMS[a].event ? 1 : 0) || (ITEMS[a].hero ? 1 : 0) - (ITEMS[b].hero ? 1 : 0) || ITEMS[a].cost - ITEMS[b].cost);
  const noneOn = !eff[curTab];
  let html = `
      <button class="item ${noneOn ? 'equipped' : ''}" data-id="">
        <div class="thumb"><span class="none-icon">✕</span></div>
        <span class="name">${t('closet.none')}</span><span class="tag">${noneOn ? t('closet.selected') : ''}</span>
      </button>`;
  html += ids.map(id => itemCard(id, eff, ev)).join('');
  $('#grid').innerHTML = html;
}
function equipBrush(id){
  brush = id; store.set('brush', brush); applyBrush(); renderGrid(); chars.closet.cheer(); sfx.equip();
}
function tryBuyBrush(id, card){
  const cost = BRUSHES[id].cost, name = itemName(id);
  if (stars < cost){
    sfx.nope(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    toast(t('closet.needMore', { n:cost - stars }));
    return;
  }
  dialog({
    icon: brushThumb(id),
    text: t('closet.buyQ', { cost, item:name }),
    ok: t('closet.buyOk'), cancel: t('closet.buyCancel'),
    onOk(){
      setStars(stars - cost);
      myBrushes = myBrushes.concat(id); store.set('brushes', myBrushes);
      sfx.buy(); buzz(60); confetti(30);
      equipBrush(id);
      toast(t('closet.got', { item:name }));
    }
  });
}
function openCloset(){
  chars.closet.setState('idle');
  renderTabs(); renderGrid(); refreshStars(); refreshEvent();
  show('closet'); sfx.tap();
}
// 한 부위 바꾸기 (이벤트 중이면 이벤트 모습에도 반영)
function setSlot(slot, id){
  const ev = activeEvent();
  if (ev && eventLookOn){
    evOverrides = Object.assign({}, evOverrides, { [ev.id]: Object.assign({}, evOverrides[ev.id], { [slot]: id || null }) });
    store.set('evOverrides', evOverrides);
    if (id && !ITEMS[id].event) look = Object.assign({}, look, { [slot]: id });
  } else {
    look = Object.assign({}, look, { [slot]: id || null });
  }
}
function equip(id, slot){
  slot = slot || (id && ITEMS[id] ? ITEMS[id].slot : curTab);
  const before = heroSetOf(effectiveLook());
  setSlot(slot, id); store.set('look', look);
  applyLook(); renderGrid(); chars.closet.cheer(); sfx.equip();
  const after = heroSetOf(effectiveLook());
  if (after && after !== before) setTimeout(() => heroShow(after), 350);       // 다섯 부분이 다 모이면 변신!
}
// 세트 한 번에 입기
function wearSet(setId, quiet){
  SLOT_IDS.forEach(sl => setSlot(sl, heroItem(setId, sl)));
  store.set('look', look); applyLook();
  if (!quiet && current === 'closet'){ renderGrid(); chars.closet.cheer(); }
}
const heroShow = (hs) => openPetShow({ kind:'hero', set:hs });
function heroCardTap(setId, card){
  const hs = HERO_SETS.find(h => h.id === setId); if (!hs) return;
  const n = heroHave(setId);
  if (n < SLOT_IDS.length){
    sfx.nope(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    const m = t('hero.need', { n:SLOT_IDS.length - n }) + ' ' + t('closet.mapSay');
    toast(m); Voice.play('hero.need', m); return;
  }
  if (heroSetOf(effectiveLook()) !== hs) wearSet(setId);
  heroShow(hs);
}
function tryBuy(id, card){
  const it = ITEMS[id], name = itemName(id);
  if (stars < it.cost){
    sfx.nope(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    toast(t('closet.needMore', { n:it.cost - stars }));
    return;
  }
  dialog({
    icon: Character.thumb(id),
    text: t('closet.buyQ', { cost:it.cost, item:name }),
    ok: t('closet.buyOk'), cancel: t('closet.buyCancel'),
    onOk(){
      setStars(stars - it.cost);
      owned = owned.concat(id); store.set('owned', owned);
      sfx.buy(); buzz(60); confetti(30);
      equip(id);
      toast(t('closet.got', { item:name }));
    }
  });
}
$('#tabs').addEventListener('click', (ev) => {
  const b = ev.target.closest('.tab'); if (!b) return;
  curTab = b.dataset.tab; sfx.tap(); renderTabs(); renderGrid(); $('#grid').scrollTop = 0;
});
$('#grid').addEventListener('click', (ev) => {
  const card = ev.target.closest('.item'); if (!card) return;
  if (curTab === 'hero'){ heroCardTap(card.dataset.set, card); return; }
  const id = card.dataset.id;
  if (curTab === 'brush'){ if (myBrushes.includes(id)) equipBrush(id); else tryBuyBrush(id, card); return; }
  if (!id){ equip(null, curTab); return; }
  const it = ITEMS[id], has = it.event || owned.includes(id);
  if (has) equip(effectiveLook()[it.slot] === id ? null : id, it.slot);
  else if (it.hero){                                                   // 변신 옷은 지도에서만
    sfx.nope(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    toast(t('closet.mapSay')); Voice.play('closet.map', t('closet.mapSay'));
  }
  else tryBuy(id, card);
});
$$('.closetBtn').forEach(b => b.addEventListener('click', openCloset));
$('#homeStage').addEventListener('click', openCloset);
$$('.backBtn').forEach(b => b.addEventListener('click', () => { sfx.tap(); refreshHome(); show('home'); }));
