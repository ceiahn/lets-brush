'use strict';

/* =========================================================
   개발자 메뉴 (설정 맨 아래, 테스트 모드에서만 보임) (v0.37.1 에 18-backup.js 에서 따로 나눔)
     별 100개 · 도감 다 열기 · 펫 다 받기 · 변신 세트 다 받기 · 처음부터 다시 · 지도 한 칸
     (펫 한 칸 · 특별한 알 · 극장 · 영상 미리 보기 단추는 각 기능 파일에 있음)
   ========================================================= */
$('#star100').addEventListener('click', () => { sfx.buy(); setStars(stars + 100); confetti(40); toast(t('toast.star100')); });
$('#bookAll').addEventListener('click', () => {                      // 도감 칸만 모두 열기 (펫을 주지는 않음)
  sfx.tap();
  BOSSES.forEach(b => { book.boss[b.id] = book.boss[b.id] || 1; });
  ['0', '1', '2', '3', 'gold'].forEach(c => { book.germ[c] = book.germ[c] || 1; });
  book.pet = book.pet || {}; Object.keys(PETS).forEach(sp => { book.pet[sp] = book.pet[sp] || 1; });
  store.set('book', book); confetti(40); toast(t('toast.bookAll'));
});
$('#petAll').addEventListener('click', () => {                       // 아직 없는 펫을 다 큰 모습으로 전부 (전설 포함)
  sfx.buy();
  const have = new Set(petState.pets.map(p => p.sp)); let n = 0;
  Object.keys(PETS).forEach(sp => { if (have.has(sp)) return; const np = { id:petUid(), sp, st:3, p:0, name:'', wear:{} }; petState.pets.push(np); bookPet(np); n++; });
  if (!petState.pets.some(p => p.id === petState.pal) && petState.pets.length) petState.pal = petState.pets[0].id;
  petState.egg = newEgg();                                            // 다 모았으면 알 없음
  checkTeams();                                                       // 팀은 조용히 완료 (별 · 연출 없음)
  store.set('pet', petState); renderPets(); confetti(60); toast(t('toast.petAll', { n }));
});
$('#heroAll').addEventListener('click', () => {                      // 변신 세트 세 가지 모두
  sfx.buy();
  HERO_SETS.forEach(hs => SLOT_IDS.forEach(sl => { const id = heroItem(hs.id, sl); if (!owned.includes(id)) owned = owned.concat(id); }));
  store.set('owned', owned); confetti(60); toast(t('toast.heroAll'));
});
$('#resetAll').addEventListener('click', () => {                     // 진행 기록만 지우고 설정은 남김
  sfx.tap();
  dialog({ text:t('reset.q'), ok:t('reset.ok'), cancel:t('reset.cancel'), onOk(){
    ['stars', 'testGift', 'owned', 'look', 'brush', 'brushes', 'evOverrides', 'evGift', 'log', 'log2', 'covered', 'shields', 'fairyDay',
     'pet', 'petOwned', 'book', 'map', 'roomOwned', 'roomOn', 'hab', 'goal', 'theater', 'special', 'quizDay', 'quizStamps'].forEach(k => store.del(k));   // v0.31.0 지금 아이 것만
    location.reload();
  } });
});
$('#mapTest').addEventListener('click', () => {
  sfx.tap(); const ev = mapAdvance(true);
  if (ev.type === 'castle'){
    setStars(stars + ev.stars); toast(ev.hero ? t('map.gotHero', { item:itemName(ev.hero) }) : ev.egg ? t('map.specialEgg') : ev.eggNext ? t('map.specialEggNext') : t('map.arrive', { isl:t('map.isl.' + ev.island) }));
    if (ev.heroSet) setTimeout(() => openPetShow({ kind:'hero', set:ev.heroSet, auto:true }), 900);
  }
  else toast(t('map.left', { n:mapLeft() }));
  refreshHome();
});
