'use strict';

/* =========================================================
   6. 캐릭터 담당 코드 (Character 모듈)
      ★ 나중에 Spine으로 바꿀 때 이 부분만 교체
      mount(요소, 모습) / .setLook(모습) / .setState('idle'|'brushing'|'happy') / .setPaused(bool) / .cheer()
      .art(모습) = 그림 문자열만 (변신 축하창 · 꾸미기 변신 카드용)
      의도: 캐릭터 그리기는 이 모듈 밖에서 몰라도 되게. 변신 세트를 다 입으면 뒤에 빛(auraOf)이 자동으로 붙음
   ========================================================= */
const Character = (() => {
  /* 그림체 B "말랑 스티커" (v0.20): 진한 테두리(#24324a) + 바깥 흰 테두리 + 연한 그림자 한 줄
     옷 자리 좌표는 예전과 같음 (눈 78·122,80 / 목 y≈134 / 오른손 166,124) → 기존 아이템이 그대로 맞음 */
  const TOOTH_D = 'M34 70 C30 24 78 14 100 32 C122 14 170 24 166 70 C164 112 156 132 151 154 C145 186 128 194 120 174 C114 158 108 154 100 154 C92 154 86 158 80 174 C72 194 55 186 49 154 C44 132 36 112 34 70Z';
  const TOOTH = `
      <path d="${TOOTH_D}" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/>
      <path d="${TOOTH_D}" fill="#fff" stroke="${OUTLINE_INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M154 80 C154 108 146 128 141 148" stroke="#e8eef6" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M54 54 C58 42 70 36 82 37" stroke="#e8eef6" stroke-width="9" stroke-linecap="round" fill="none"/>`;
  const FACE = `
      <g class="eyes">
        <ellipse cx="78" cy="81" rx="11" ry="13.5" fill="${OUTLINE_INK}"/><circle cx="82" cy="75.5" r="4.6" fill="#fff"/><circle cx="75" cy="87.5" r="2.2" fill="#fff"/>
        <ellipse cx="122" cy="81" rx="11" ry="13.5" fill="${OUTLINE_INK}"/><circle cx="126" cy="75.5" r="4.6" fill="#fff"/><circle cx="119" cy="87.5" r="2.2" fill="#fff"/>
      </g>
      <ellipse cx="58" cy="105" rx="11" ry="7" fill="#ff9ec0"/>
      <ellipse cx="142" cy="105" rx="11" ry="7" fill="#ff9ec0"/>
      <path class="m-smile" d="M88 101 Q100 115 112 101" stroke="${OUTLINE_INK}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <g class="m-open">
        <ellipse cx="100" cy="107" rx="13" ry="11" fill="#8a2346" stroke="${OUTLINE_INK}" stroke-width="4"/>
        <ellipse cx="100" cy="113" rx="8" ry="4" fill="#ff8fa3"/>
        <circle cx="90" cy="99" r="5" fill="#fff"/><circle cx="110" cy="100" r="4.5" fill="#fff"/><circle cx="100" cy="97" r="4" fill="#fff"/>
      </g>`;
  const HANDS = `
      <g class="hands">
        <circle class="hand-l" cx="34" cy="124" r="9.5" fill="#fff" stroke="${OUTLINE_INK}" stroke-width="4.5"/>
        <circle class="hand-r" cx="166" cy="124" r="9.5" fill="#fff" stroke="${OUTLINE_INK}" stroke-width="4.5"/>
      </g>`;
  const TOOL = `
      <g class="tool" transform="translate(114 124) rotate(-10) scale(1.3)">
        <g class="brush">${stickered(`
          <rect x="0" y="-6" width="52" height="13" rx="6.5" ${BF('bh')}/>
          <g transform="translate(0 .5)">${bDeco(0, 52, 6.5)}</g>
          <rect x="21" y="-6" width="4" height="13" ${BF('bs')}/>
          <g class="btop" data-noink="1" transform="translate(50 0) scale(.7)"></g>
          <rect x="-20" y="-7" width="24" height="14" rx="5" style="fill:var(--bk);stroke:var(--bks)" stroke-width="2"/>
          <rect x="-18" y="-15" width="20" height="9" rx="2" ${BF('bb')}/>
          <circle cx="50" cy="1" r="9" fill="#fff" stroke="${OUTLINE_INK}" stroke-width="3.5"/>`, 3.5)}
        </g>
      </g>`;
  const SPARK = `<path class="spark" d="M178 18 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z" fill="#ffd54a"/>`;

  const itemSvg = (id) => stickered(ITEMS[id].svg, 7, ITEMS[id].outline !== false);
  const itemMarkup = (id) => (id && ITEMS[id]) ? `<g data-item="${id}">${itemSvg(id)}</g>` : '';
  const slot = (s, l) => `<g class="slot" data-slot="${s}">${itemMarkup(l[s])}</g>`;

  function markup(l){
    return `
      <svg class="char" viewBox="-10 -36 220 250" aria-hidden="true">
        <g class="aura">${auraOf(l)}</g>
        <ellipse cx="100" cy="202" rx="46" ry="7" fill="rgba(0,0,0,.12)"/>
        <g class="body">
          ${slot('back', l)}${TOOTH}${slot('neck', l)}${FACE}${slot('eyes', l)}${slot('head', l)}${slot('hand', l)}${HANDS}
        </g>
        ${TOOL}${SPARK}
      </svg>`;
  }
  function mount(container, l){
    container.innerHTML = markup(l);
    const svg = container.querySelector('svg');
    let cheerT = 0;
    return {
      el: svg,
      setLook(nl){ SLOT_IDS.forEach(s => { svg.querySelector(`[data-slot="${s}"]`).innerHTML = itemMarkup(nl[s]); }); svg.querySelector('.aura').innerHTML = auraOf(nl); },
      setState(st){ svg.classList.remove('brushing', 'happy'); if (st === 'brushing' || st === 'happy') svg.classList.add(st); },
      setPaused(p){ svg.classList.toggle('paused', !!p); },
      cheer(){
        svg.classList.remove('cheer'); void svg.getBoundingClientRect(); svg.classList.add('cheer');
        clearTimeout(cheerT); cheerT = setTimeout(() => svg.classList.remove('cheer'), 650);
      }
    };
  }
  const thumb = (id) => `<svg viewBox="${ITEMS[id].box}" aria-hidden="true">${itemSvg(id)}</svg>`;
  return { mount, thumb, art:markup };
})();

/* 지금 실제로 보여줄 모습 = 아이가 고른 옷 + 이벤트 옷 + 이벤트 중 아이가 바꾼 것 */
function effectiveLook(){
  const ev = activeEvent();
  const l = {};
  SLOT_IDS.forEach(s => {
    let id = look[s];
    if (id && (!ITEMS[id] || (ITEMS[id].event && (!ev || ITEMS[id].event !== ev.id)))) id = null;
    l[s] = id;
  });
  if (ev && eventLookOn) Object.assign(l, ev.look, evOverrides[ev.id] || {});
  return l;
}

const startLook = effectiveLook();
const chars = {
  home:   Character.mount($('#homeChar'), startLook),
  closet: Character.mount($('#closetChar'), startLook),
  brushC: Character.mount($('#brushCharC'), startLook),
  done:   Character.mount($('#doneChar'), startLook)
};
chars.done.setState('happy');
function applyLook(){ const l = effectiveLook(); Object.values(chars).forEach(c => c.setLook(l)); }

/* =========================================================
   7. (v0.20.1 에서 A·B 양치 화면의 작은 입 그림을 없앰. 양치 화면은 아래 14번 CScene 하나)
   ========================================================= */

const ICON = {
  pause: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>',
  play:  '<svg viewBox="0 0 24 24"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',
  stop:  '<svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>'
};
$$('.js-stop').forEach(b => { b.innerHTML = ICON.stop; });
