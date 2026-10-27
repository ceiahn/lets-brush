'use strict';

/* =========================================================
   5. 아이템 (좌표: 캐릭터 viewBox -10 -36 220 250 / 오른손 166,124)
      event: 이벤트 기간에만 보이는 무료 아이템
      아이템 종류 (ITEMS 한 목록 안에 표시로 구분)
        · 보통: cost 별로 삼 (값은 일부러 낮게 유지 — 매일 작은 보상)
        · event: 이벤트 때만 보이는 무료 옷
        · hero: 변신 세트 (HERO_SETS × 다섯 부위). 별로 못 사고 모험 지도 성에서만 받음. 다 입으면 변신
        · weekly: 이번 주 물건 (WK_SHAPES × WK_COLORS 로 만들어짐). 월요일마다 weeklyIds()가 4개 고름
      새 변신 세트 추가 = HERO_SETS 에 {id, aura색} + HERO_ART 에 다섯 부위 그림 + ITEM_NAMES 이름 + 'hero.set.<id>' 문구
      그림 좌표: 머리 꼭대기 y≈20, 눈 (78,80)·(122,80), 목 y≈134, 오른손 (166,124), 등 x 20~180 (몸 뒤에 그려짐)
   ========================================================= */
/* ---------- 그림체 B "말랑 스티커": 자동 외곽선 (v0.20) ----------
   의도: 아이템 · 펫 · 세균 · 칫솔 장식을 하나하나 다시 그리지 않고, 그림 전체 둘레에 진한 테두리를 자동으로 둘러
         같은 그림체로 맞춤. 원리 = 같은 그림을 한 장 더 만들어 모두 진한 색 + 두꺼운 선으로 바꾼 뒤 뒤에 깔기
         → 바깥 둘레만 테두리로 보이고, 안쪽 선은 원래 그림이 덮음
   규칙: 흐린 것(불투명도 .5 미만, 그림자 · 빛 번짐)은 테두리에서 빠짐 / 반투명 색(안경알 등)은 속을 채우지 않고 선만
         이미지 파일(<image>)은 테두리를 못 그림 → 그림 파일에 직접 테두리를 넣을 것
         resources.js 에서 outline:false 를 주면 그 아이템 · 펫은 테두리를 안 붙임
   굵기: 반짝이 기준(220칸) 7, 펫(100칸) 4.5, 세균(76칸) 5 → 화면에서 비슷한 굵기로 보이게 */
var OUTLINE_INK = '#24324a', olCache = {};
function isFaintColor(c){
  c = String(c || '').trim().toLowerCase();
  if (c === 'transparent') return true;
  let m = c.match(/^#([0-9a-f]{4}|[0-9a-f]{8})$/);
  if (m){ const h = m[1], a = h.length === 4 ? parseInt(h[3] + h[3], 16) : parseInt(h.slice(6), 16); return a / 255 < .9; }
  m = c.match(/^rgba\([^)]*,\s*([\d.]+)\s*\)$/);
  return !!(m && +m[1] < .9);
}
function outlineOf(svg, w){
  if (!svg) return '';
  const key = w + '|' + svg;
  if (olCache[key] !== undefined) return olCache[key];
  let out = '';
  try{
    const doc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>', 'image/svg+xml');
    const root = doc.documentElement;
    if (root.getElementsByTagName('parsererror').length) throw new Error('bad svg');
    root.querySelectorAll('defs,image,text,title,desc,style,[data-noink]').forEach(el => el.remove());
    const own = (e, name) => {                                       // 속성 또는 style="fill:…; stroke:…" 안의 값
      const st = (e.getAttribute('style') || '').match(new RegExp('(?:^|;)\\s*' + name + '\\s*:\\s*([^;]+)'));
      return st ? st[1].trim() : e.getAttribute(name);
    };
    const inh = (el, name, def) => { for (let e = el; e && e !== root; e = e.parentNode){ if (e.getAttribute){ const v = own(e, name); if (v !== null) return v; } } return def; };
    const op = (el) => { let o = 1; for (let e = el; e && e !== root; e = e.parentNode){ if (e.getAttribute){ const v = e.getAttribute('opacity'); if (v !== null) o *= parseFloat(v); } } return o; };
    const plan = [];
    root.querySelectorAll('path,circle,ellipse,rect,polygon,polyline,line').forEach(el => {
      if (op(el) < .5){ plan.push([el, null]); return; }
      const fill = inh(el, 'fill', '#000'), stroke = inh(el, 'stroke', 'none');
      const sw = stroke === 'none' || isFaintColor(stroke) ? 0 : parseFloat(inh(el, 'stroke-width', '1')) || 0;
      const solid = fill !== 'none' && !isFaintColor(fill);
      if (!solid && !sw){ plan.push([el, null]); return; }
      plan.push([el, { fill: solid ? OUTLINE_INK : 'none', sw: sw + w }]);
    });
    plan.forEach(([el, v]) => {
      if (!v){ el.remove(); return; }
      el.removeAttribute('style'); el.removeAttribute('opacity'); el.removeAttribute('stroke-dasharray');
      el.setAttribute('fill', v.fill); el.setAttribute('stroke', OUTLINE_INK); el.setAttribute('stroke-width', v.sw.toFixed(1));
      el.setAttribute('stroke-linejoin', 'round'); el.setAttribute('stroke-linecap', 'round');
    });
    root.querySelectorAll('g').forEach(g => ['fill', 'stroke', 'stroke-width', 'opacity', 'style'].forEach(a => g.removeAttribute(a)));
    const ser = new XMLSerializer();
    out = '<g class="olb" aria-hidden="true">' + [...root.childNodes].map(n => n.nodeType === 1 ? ser.serializeToString(n) : '').join('').replace(/ xmlns="[^"]*"/g, '') + '</g>';
  }catch(e){ out = ''; }
  olCache[key] = out;
  return out;
}
const stickered = (svg, w, on = true) => (on ? outlineOf(svg, w) : '') + svg;
// '<svg …>속</svg>' 통째 문자열의 속 그림에 테두리 (아이콘 · 요정 · 선물 상자 그림용)
const stickerSvg = (str, w) => str.replace(/^(\s*<svg[^>]*>)([\s\S]*)(<\/svg>\s*)$/, (m, a, b, c) => a + stickered(b, w) + c);
/* 배경 장면용 (펫 방 벽 · 바닥, 동물 집 배경): 맨 위 단계의 그림마다 따로 테두리를 바로 뒤에 깔아
   언덕 · 나무 · 구름 · 물가 같은 물건 하나하나에 선이 생기게 함.
   빼는 것: 화면 전체를 덮는 바탕 사각형(x · y 가 0, 폭 390 이상), data-noink 가 붙은 것(벽지 무늬 · 하늘 띠 · 잔무늬) */
var inkCache = {};
function inkScene(svg, w){
  if (!svg) return '';
  const key = w + '|' + svg;
  if (inkCache[key] !== undefined) return inkCache[key];
  let out = svg;
  try{
    const doc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>', 'image/svg+xml');
    if (doc.documentElement.getElementsByTagName('parsererror').length) throw new Error('bad svg');
    const ser = new XMLSerializer();
    out = [...doc.documentElement.childNodes].map(n => {
      if (n.nodeType !== 1) return '';
      const str = ser.serializeToString(n).replace(/ xmlns="[^"]*"/g, '');
      const backdrop = n.localName === 'rect' && !+(n.getAttribute('x') || 0) && !+(n.getAttribute('y') || 0) && +(n.getAttribute('width') || 0) >= 390;
      return backdrop || n.hasAttribute('data-noink') ? str : outlineOf(str, w) + str;
    }).join('');
  }catch(e){ out = svg; }
  inkCache[key] = out;
  return out;
}
function starPath(cx, cy, R, r){
  let d = '';
  for (let i = 0; i < 10; i++){
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' ';
  }
  return d + 'Z';
}
function petals(cx, cy){
  let s = '';
  for (let k = 0; k < 5; k++){
    const a = k * Math.PI * 2 / 5 - Math.PI / 2;
    s += `<circle cx="${(cx + 8 * Math.cos(a)).toFixed(1)}" cy="${(cy + 8 * Math.sin(a)).toFixed(1)}" r="6.5" fill="#ff9ec0"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="6" fill="#ffd54a"/>`;
}

const SLOT_IDS = ['head', 'eyes', 'neck', 'back', 'hand'];

/* ---------- 칫솔 (별로 사서 바꾸기) ----------
   색은 CSS 변수로: 고른 칫솔이 모든 화면의 칫솔에 한 번에 적용됨 */
const BRUSHES = {
  brush_basic:   { cost:0, v:{ bh:'#ff7aa8', bs:'#3ccf9c', bb:'#3ccf9c', bbd:'#2fb487', bk:'#fff',    bks:'#bfe3f7', dd:'#fff' } },
  brush_mint:    { cost:2, v:{ bh:'#3ccf9c', bs:'#fff',    bb:'#8fd3ff', bbd:'#5bb8ef', bk:'#fff',    bks:'#bfe3f7', dd:'#fff',    'd-dots':1 } },
  brush_ocean:   { cost:3, v:{ bh:'#4fa3ff', bs:'#ffd54a', bb:'#ffffff', bbd:'#bcd9ef', bk:'#e9f6ff', bks:'#9fd3ee', dd:'#bfe6ff', 'd-stripes':1 } },
  brush_star:    { cost:4, v:{ bh:'#ffd54a', bs:'#ff7aa8', bb:'#ff9ec0', bbd:'#ff7aa8', bk:'#fff',    bks:'#f3d27a', dd:'#fff',    'd-stars':1 } },
  brush_candy:   { cost:4, v:{ bh:'#ffffff', bs:'#ff6b6b', bb:'#ff9ec0', bbd:'#ff7aa8', bk:'#fff',    bks:'#ffb3c7', dd:'#ff6b6b', 'd-stripes':1 } },
  brush_galaxy:  { cost:5, v:{ bh:'#5b3fa8', bs:'#ffd54a', bb:'#b48cff', bbd:'#8b5cf6', bk:'#f3edff', bks:'#cdb8ff', dd:'#ffd54a', 'd-stars':1 } },
  brush_rainbow: { cost:6, v:{ bh:'#ffffff', bs:'#ffffff', bb:'#ff9ec0', bbd:'#ff7aa8', bk:'#fff',    bks:'#d6e6f2', dd:'#fff',    'd-rainbow':1 } },
  // ▼ 캐릭터 칫솔 (top = 손잡이 위 장식)
  brush_dino:     { cost:6, top:'dino',     v:{ bh:'#4fa3ff', bs:'#ffd54a', bb:'#9be37a', bbd:'#6cc04a', bk:'#fff', bks:'#9fd3ee', dd:'#2f7fd6', 'd-dots':1 } },
  brush_car:      { cost:6, top:'car',      v:{ bh:'#ff5a5a', bs:'#24324a', bb:'#ffffff', bbd:'#cfd8e3', bk:'#fff', bks:'#ffb3b3', dd:'#fff',    'd-stripes':1 } },
  brush_rocket:   { cost:7, top:'rocket',   v:{ bh:'#dfe7ef', bs:'#ff6b6b', bb:'#4fa3ff', bbd:'#2f7fd6', bk:'#fff', bks:'#b7c6d6', dd:'#4fa3ff', 'd-stars':1 } },
  brush_princess: { cost:7, top:'princess', v:{ bh:'#ffb3d9', bs:'#ffd54a', bb:'#ff9ec0', bbd:'#ff7aa8', bk:'#fff', bks:'#ffc1d9', dd:'#fff',    'd-stars':1 } },
  brush_bunny:    { cost:6, top:'bunny',    v:{ bh:'#ffd6e6', bs:'#ffffff', bb:'#ffffff', bbd:'#ffc1d9', bk:'#fff', bks:'#ffc1d9', dd:'#fff',    'd-dots':1 } },
  brush_cat:      { cost:6, top:'cat',      v:{ bh:'#ffb347', bs:'#ffffff', bb:'#ffffff', bbd:'#f0d2a8', bk:'#fff', bks:'#f3c98b', dd:'#e8892f', 'd-stripes':1 } },
  brush_bear:     { cost:6, top:'bear',     v:{ bh:'#b07a4f', bs:'#ffd54a', bb:'#ffe6c7', bbd:'#e8c49a', bk:'#fff', bks:'#d9b48c', dd:'#fff' } },
  brush_unicorn:  { cost:8, top:'unicorn',  v:{ bh:'#ffffff', bs:'#ffd54a', bb:'#b48cff', bbd:'#8b5cf6', bk:'#fff', bks:'#d6c6ff', dd:'#fff',    'd-rainbow':1 } }
};
const brushVars = (id) => {
  const v = Object.assign({ 'd-dots':0, 'd-stars':0, 'd-stripes':0, 'd-rainbow':0 }, (BRUSHES[id] || BRUSHES.brush_basic).v);
  return Object.entries(v).map(([k, x]) => `--${k}:${x}`).join(';');
};
const BF = (n) => `style="fill:var(--${n})"`;          // 칫솔 색 채우기
const BS = (n) => `style="stroke:var(--${n})"`;
// 손잡이 무늬 (x0~x1, 높이 ±h, 가운데 y=0)
function bDeco(x0, x1, h){
  const out = [], f = (n) => n.toFixed(1);
  let d = '', st = '', sp = '', rb = '';
  for (let x = x0 + h * 1.4; x < x1 - h; x += h * 2.6) d += `<circle cx="${f(x)}" cy="0" r="${f(h * .32)}" ${BF('dd')}/>`;
  for (let x = x0 + h * 2; x < x1 - h; x += h * 4){
    const R = h * .55, r = R * .45; let pth = '';
    for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; pth += (i ? 'L' : 'M') + f(x + rr * Math.cos(a)) + ' ' + f(rr * Math.sin(a)) + ' '; }
    st += `<path d="${pth}Z" ${BF('dd')}/>`;
  }
  for (let x = x0 + h * 1.5; x < x1 - h * 1.5; x += h * 2.4) sp += `<path d="M${f(x)} ${f(-h)} h${f(h * .8)} l${f(-h * .9)} ${f(h * 2)} h${f(-h * .8)}Z" ${BF('dd')}/>`;
  const C = ['#ff6b6b', '#ffb347', '#ffd54a', '#3ccf9c', '#4fa3ff', '#b48cff'], seg = (x1 - x0 - h * 2) / 6;
  C.forEach((c, i) => { rb += `<rect x="${f(x0 + h + i * seg)}" y="${f(-h)}" width="${f(seg + .5)}" height="${f(h * 2)}" fill="${c}"/>`; });
  return `<g data-noink="1"><g style="opacity:var(--d-rainbow)">${rb}</g><g style="opacity:var(--d-dots)">${d}</g><g style="opacity:var(--d-stars)">${st}</g><g style="opacity:var(--d-stripes)">${sp}</g></g>`;
}
/* 손잡이 위 캐릭터 장식. 기준 크기: 손잡이 굵기 34(반 17), 손잡이 윗면 y=-17 위에 앉음, 위쪽 = -y */
const TOPPERS = {
  dino: `
      <path d="M-26 -30 Q-46 -26 -54 -16 Q-40 -18 -24 -22Z" fill="#4fa3ff"/>
      ${[-20, -8, 4].map((x, i) => `<path d="M${x} ${-50 + i * 2} l7 -12 l7 12Z" fill="#ffd54a"/>`).join('')}
      <ellipse cx="0" cy="-34" rx="28" ry="21" fill="#4fa3ff"/>
      <ellipse cx="4" cy="-30" rx="14" ry="12" fill="#bfe6ff"/>
      <circle cx="22" cy="-56" r="17" fill="#4fa3ff"/>
      <ellipse cx="33" cy="-51" rx="11" ry="8" fill="#6db6ff"/>
      <circle cx="25" cy="-61" r="3.4" fill="#24324a"/><circle cx="26" cy="-62" r="1.2" fill="#fff"/>
      <ellipse cx="16" cy="-51" rx="4" ry="2.5" fill="#ffb3c7"/>
      <path d="M30 -48 Q35 -45 40 -49" stroke="#24324a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="-14" cy="-15" rx="8" ry="5" fill="#2f7fd6"/><ellipse cx="14" cy="-15" rx="8" ry="5" fill="#2f7fd6"/>`,
  car: `
      <path d="M-40 -18 H40 Q46 -18 46 -25 V-30 Q46 -36 40 -37 L26 -40 L16 -52 H-12 L-24 -40 L-36 -38 Q-44 -36 -44 -29 V-24 Q-44 -18 -40 -18Z" fill="#ff5a5a" stroke="#d63c3c" stroke-width="2"/>
      <path d="M-9 -48 H13 L21 -39 H-18Z" fill="#bfe6ff"/>
      <rect x="-36" y="-32" width="72" height="5" fill="#fff" opacity=".8"/>
      <circle cx="-22" cy="-17" r="10" fill="#24324a"/><circle cx="-22" cy="-17" r="4" fill="#cfd8e3"/>
      <circle cx="24" cy="-17" r="10" fill="#24324a"/><circle cx="24" cy="-17" r="4" fill="#cfd8e3"/>
      <circle cx="42" cy="-30" r="3" fill="#ffd54a"/>`,
  rocket: `
      <path d="M0 -92 Q20 -70 18 -34 H-18 Q-20 -70 0 -92Z" fill="#f4f7fb" stroke="#b7c6d6" stroke-width="2.5"/>
      <path d="M0 -92 Q10 -82 14 -70 H-14 Q-10 -82 0 -92Z" fill="#ff6b6b"/>
      <circle cx="0" cy="-56" r="8" fill="#4fa3ff" stroke="#b7c6d6" stroke-width="2.5"/><circle cx="-3" cy="-59" r="2.5" fill="#fff"/>
      <path d="M-18 -46 L-30 -24 L-16 -30Z M18 -46 L30 -24 L16 -30Z" fill="#ff6b6b"/>
      <path d="M-10 -34 Q0 -14 10 -34Z" fill="#ffb347"/>`,
  princess: `
      <path d="M-28 -18 L-32 -54 L-15 -36 L0 -62 L15 -36 L32 -54 L28 -18Z" fill="#ffd54a" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="-32" cy="-56" r="4" fill="#ff7aa8"/><circle cx="0" cy="-64" r="5" fill="#ff7aa8"/><circle cx="32" cy="-56" r="4" fill="#ff7aa8"/>
      <rect x="-28" y="-26" width="56" height="8" fill="#f0a500" opacity=".5"/>
      <path d="M0 -40 l5 6 l-5 6 l-5 -6Z" fill="#8fd3ff" stroke="#fff" stroke-width="1"/>
      <circle cx="-14" cy="-28" r="3.5" fill="#3ccf9c"/><circle cx="14" cy="-28" r="3.5" fill="#b48cff"/>`,
  bunny: `
      <g transform="rotate(-10 -9 -56)"><ellipse cx="-9" cy="-76" rx="8" ry="24" fill="#fff" stroke="#ffc1d9" stroke-width="2.5"/><ellipse cx="-9" cy="-75" rx="3.5" ry="16" fill="#ffb3c7"/></g>
      <g transform="rotate(10 9 -56)"><ellipse cx="9" cy="-76" rx="8" ry="24" fill="#fff" stroke="#ffc1d9" stroke-width="2.5"/><ellipse cx="9" cy="-75" rx="3.5" ry="16" fill="#ffb3c7"/></g>
      <circle cx="0" cy="-36" r="22" fill="#fff" stroke="#ffc1d9" stroke-width="2.5"/>
      <circle cx="-8" cy="-40" r="3.2" fill="#24324a"/><circle cx="8" cy="-40" r="3.2" fill="#24324a"/>
      <ellipse cx="0" cy="-32" rx="3.5" ry="2.5" fill="#ff7aa8"/>
      <path d="M-5 -27 Q0 -24 0 -29 Q0 -24 5 -27" stroke="#24324a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="-14" cy="-31" rx="5" ry="3" fill="#ffd0dc"/><ellipse cx="14" cy="-31" rx="5" ry="3" fill="#ffd0dc"/>`,
  cat: `
      <path d="M-20 -46 L-22 -68 L-6 -56Z M20 -46 L22 -68 L6 -56Z" fill="#ffb347" stroke="#e8892f" stroke-width="2"/>
      <path d="M-17 -52 L-18 -62 L-10 -56Z M17 -52 L18 -62 L10 -56Z" fill="#ffd0dc"/>
      <circle cx="0" cy="-36" r="22" fill="#ffb347" stroke="#e8892f" stroke-width="2"/>
      <path d="M-5 -56 L-3 -48 M0 -57 L0 -49 M5 -56 L3 -48" stroke="#e8892f" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="-8" cy="-38" r="3.2" fill="#24324a"/><circle cx="8" cy="-38" r="3.2" fill="#24324a"/>
      <path d="M-3 -31 H3 L0 -28Z" fill="#ff7aa8"/>
      <path d="M-26 -32 H-12 M-26 -27 L-12 -29 M26 -32 H12 M26 -27 L12 -29" stroke="#8a5a32" stroke-width="1.4" stroke-linecap="round"/>`,
  bear: `
      <circle cx="-17" cy="-54" r="9" fill="#b07a4f"/><circle cx="17" cy="-54" r="9" fill="#b07a4f"/>
      <circle cx="-17" cy="-54" r="4.5" fill="#e8c49a"/><circle cx="17" cy="-54" r="4.5" fill="#e8c49a"/>
      <circle cx="0" cy="-36" r="22" fill="#b07a4f"/>
      <ellipse cx="0" cy="-29" rx="11" ry="8" fill="#e8c49a"/>
      <circle cx="-8" cy="-41" r="3.2" fill="#24324a"/><circle cx="8" cy="-41" r="3.2" fill="#24324a"/>
      <ellipse cx="0" cy="-32" rx="4" ry="3" fill="#3a2f2a"/>
      <path d="M-4 -26 Q0 -23 4 -26" stroke="#3a2f2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  unicorn: `
      <path d="M-4 -56 L0 -84 L4 -56Z" fill="#ffd54a" stroke="#f0a500" stroke-width="1.5"/>
      <path d="M-20 -50 Q-30 -36 -24 -20" stroke="#ff7aa8" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M-14 -56 Q-26 -44 -22 -26" stroke="#b48cff" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M-6 -58 Q-18 -50 -16 -36" stroke="#8fd3ff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="2" cy="-36" r="21" fill="#fff" stroke="#d6c6ff" stroke-width="2.5"/>
      <path d="M12 -52 L16 -62 L20 -50Z" fill="#fff" stroke="#d6c6ff" stroke-width="2"/>
      <path d="M2 -40 Q6 -36 10 -40" stroke="#24324a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="14" cy="-31" rx="5" ry="3" fill="#ffd0dc"/>
      <circle cx="6" cy="-26" r="1.6" fill="#b48cff"/><circle cx="11" cy="-25" r="1.6" fill="#b48cff"/>`
};
// 외부 리소스 합치기 (칫솔 · 장식). 장식은 SVG 문자열 또는 { img:'파일', box:[x, y, 폭, 높이] }
const imgSvg = (img, box) => `<image href="${String(img).replace(/"/g, '&quot;')}" x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" preserveAspectRatio="xMidYMid meet"/>`;
Object.entries(RES.toppers || {}).forEach(([k, v]) => { TOPPERS[k] = typeof v === 'string' ? v : imgSvg(v.img, v.box || [-30, -70, 60, 60]); });
Object.assign(BRUSHES, RES.brushes || {});
const topperOf = (id) => { const tp = (BRUSHES[id] || {}).top; return tp ? stickered(TOPPERS[tp] || '', 5) : ''; };
// 상점·대화 창용 칫솔 그림 (옆모습)
function brushThumb(id){
  return `<svg class="bthumb" viewBox="-34 -92 300 110" style="${brushVars(id)}" aria-hidden="true">${stickered(`
      <rect x="28" y="-8" width="200" height="16" rx="8" ${BF('bh')}/>
      ${bDeco(28, 228, 8)}
      <rect x="92" y="-8" width="8" height="16" ${BF('bs')}/><rect x="106" y="-8" width="8" height="16" ${BF('bs')}/>
      <rect x="28" y="-8" width="200" height="16" rx="8" fill="none" stroke="#0001" stroke-width="1.5"/>
      ${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${-26 + k * 8.5}" y="-31" width="6.5" height="20" rx="2.5" ${BF('bb')}/>`).join('')}
      <rect x="-30" y="-13" width="62" height="26" rx="11" style="fill:var(--bk);stroke:var(--bks)" stroke-width="2.5"/>
      <g transform="translate(200 0) scale(1)">${topperOf(id)}</g>`, 5)}
    </svg>`;
}

const ITEMS = {
  head_cap: { slot:'head', cost:0, box:'48 -6 136 60', svg:`
      <path d="M56 42 Q56 2 100 2 Q144 2 144 42 Q100 32 56 42Z" fill="#ff6b6b"/>
      <path d="M100 4 L100 34" stroke="#e04848" stroke-width="2" opacity=".6"/>
      <path d="M124 37 Q160 30 178 42 Q160 51 128 47Z" fill="#e04848"/>
      <circle cx="100" cy="4" r="5" fill="#e04848"/>` },
  head_party: { slot:'head', cost:2, box:'66 -40 68 78', svg:`
      <path d="M78 30 L100 -24 L122 30 Q100 24 78 30Z" fill="#b48cff"/>
      <path d="M88 6 L112 6 M83 18 L117 18" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>
      <circle cx="100" cy="-26" r="7" fill="#ffd54a"/>` },
  head_crown: { slot:'head', cost:3, box:'54 -14 92 58', svg:`
      <path d="M62 36 L64 2 L82 20 L100 -6 L118 20 L136 2 L138 36 Q100 28 62 36Z" fill="#ffd54a" stroke="#f0a500" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="100" cy="24" r="5" fill="#ff7aa8"/><circle cx="78" cy="28" r="3.5" fill="#3ccf9c"/><circle cx="122" cy="28" r="3.5" fill="#3ccf9c"/>` },
  head_pirate: { slot:'head', cost:4, box:'36 -10 128 58', svg:`
      <path d="M44 40 Q52 -4 100 4 Q148 -4 156 40 Q100 26 44 40Z" fill="#2d3748"/>
      <path d="M50 36 Q100 24 150 36" stroke="#ffd54a" stroke-width="4" fill="none"/>
      <path d="${starPath(100, 18, 9, 4)}" fill="#fff"/>` },
  head_bunny: { slot:'head', cost:5, box:'46 -42 108 80', svg:`
      <g transform="rotate(-14 76 24)"><ellipse cx="76" cy="-4" rx="12" ry="30" fill="#fff" stroke="#bfe3f7" stroke-width="4"/><ellipse cx="76" cy="-2" rx="5.5" ry="20" fill="#ffb3c7"/></g>
      <g transform="rotate(14 124 24)"><ellipse cx="124" cy="-4" rx="12" ry="30" fill="#fff" stroke="#bfe3f7" stroke-width="4"/><ellipse cx="124" cy="-2" rx="5.5" ry="20" fill="#ffb3c7"/></g>
      <path d="M58 30 Q100 12 142 30" stroke="#ff7aa8" stroke-width="7" fill="none" stroke-linecap="round"/>` },

  eyes_round: { slot:'eyes', cost:2, box:'46 58 108 44', svg:`
      <circle cx="78" cy="80" r="15" fill="#ffffff40" stroke="#24324a" stroke-width="4"/>
      <circle cx="122" cy="80" r="15" fill="#ffffff40" stroke="#24324a" stroke-width="4"/>
      <path d="M93 78 Q100 72 107 78" stroke="#24324a" stroke-width="4" fill="none"/>
      <path d="M63 76 L52 72 M137 76 L148 72" stroke="#24324a" stroke-width="4" stroke-linecap="round"/>` },
  eyes_sun: { slot:'eyes', cost:3, box:'56 60 88 40', svg:`
      <rect x="61" y="70" width="34" height="22" rx="10" fill="#24324a"/>
      <rect x="105" y="70" width="34" height="22" rx="10" fill="#24324a"/>
      <path d="M95 76 L105 76" stroke="#24324a" stroke-width="4"/>
      <path d="M68 76 L76 76 M112 76 L120 76" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` },
  eyes_star: { slot:'eyes', cost:4, box:'54 56 92 48', svg:`
      <path d="${starPath(78, 80, 19, 9)}" fill="#ffd54a77" stroke="#f0a500" stroke-width="3" stroke-linejoin="round"/>
      <path d="${starPath(122, 80, 19, 9)}" fill="#ffd54a77" stroke="#f0a500" stroke-width="3" stroke-linejoin="round"/>
      <path d="M95 78 Q100 74 105 78" stroke="#f0a500" stroke-width="3" fill="none"/>` },

  neck_bowtie: { slot:'neck', cost:0, box:'70 110 60 48', svg:`
      <path d="M100 134 L80 122 Q76 134 80 146 Z" fill="#ff7aa8"/>
      <path d="M100 134 L120 122 Q124 134 120 146 Z" fill="#ff7aa8"/>
      <circle cx="100" cy="134" r="6" fill="#e85d8f"/>` },
  neck_scarf: { slot:'neck', cost:2, box:'44 110 112 74', svg:`
      <path d="M50 120 Q100 138 150 120 L150 134 Q100 152 50 134 Z" fill="#4fa3ff"/>
      <path d="M118 140 L130 176 L116 178 L108 144 Z" fill="#3b8de0"/>
      <path d="M60 128 Q100 144 140 128" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="6 6" opacity=".7"/>` },
  neck_medal: { slot:'neck', cost:5, box:'74 110 52 58', svg:`
      <path d="M84 118 L100 140 L116 118" stroke="#4fa3ff" stroke-width="7" fill="none" stroke-linejoin="round"/>
      <circle cx="100" cy="148" r="12" fill="#ffd54a" stroke="#f0a500" stroke-width="3"/>
      <path d="${starPath(100, 148, 6, 2.6)}" fill="#fff"/>` },

  back_cape: { slot:'back', cost:3, box:'20 54 160 130', svg:`
      <path d="M50 62 Q100 76 150 62 L172 176 Q154 168 138 178 Q120 168 100 178 Q80 168 62 178 Q46 168 28 176 Z" fill="#e53e5e"/>
      <path d="M150 62 L172 176 Q160 171 150 174 Z" fill="#c42d4b"/>` },
  back_jetpack: { slot:'back', cost:4, box:'18 62 164 104', svg:`
      <rect x="26" y="70" width="22" height="64" rx="10" fill="#9aa8bd"/>
      <rect x="152" y="70" width="22" height="64" rx="10" fill="#9aa8bd"/>
      <rect x="26" y="84" width="22" height="8" fill="#ff7aa8"/><rect x="152" y="84" width="22" height="8" fill="#ff7aa8"/>
      <path class="flame" d="M30 134 Q37 162 44 134 Z" fill="#ffb347"/>
      <path class="flame" d="M156 134 Q163 162 170 134 Z" fill="#ffb347"/>` },
  back_wings: { slot:'back', cost:6, box:'-6 46 212 80', svg:`
      <g class="wing-l"><path d="M48 84 Q14 50 4 82 Q-2 108 18 112 Q30 120 48 108 Z" fill="#fff" stroke="#cfe3f2" stroke-width="3" stroke-linejoin="round"/>
        <path d="M14 90 Q28 92 40 100 M18 102 Q30 104 42 106" stroke="#cfe3f2" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g class="wing-r"><path d="M152 84 Q186 50 196 82 Q202 108 182 112 Q170 120 152 108 Z" fill="#fff" stroke="#cfe3f2" stroke-width="3" stroke-linejoin="round"/>
        <path d="M186 90 Q172 92 160 100 M182 102 Q170 104 158 106" stroke="#cfe3f2" stroke-width="3" fill="none" stroke-linecap="round"/></g>` },

  hand_flower: { slot:'hand', cost:1, box:'150 58 44 74', svg:`
      <path d="M166 122 Q172 104 172 86" stroke="#3ccf9c" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M170 106 Q180 98 186 102 Q178 112 170 108Z" fill="#3ccf9c"/>
      ${petals(172, 78)}` },
  hand_flag: { slot:'hand', cost:1, box:'154 62 50 76', svg:`
      <path d="M168 132 L168 74" stroke="#a0714f" stroke-width="4" stroke-linecap="round"/>
      <path d="M168 76 Q184 72 198 82 Q184 90 168 92Z" fill="#3ccf9c"/>
      <circle cx="168" cy="72" r="4" fill="#ffd54a"/>` },
  hand_balloon: { slot:'hand', cost:2, box:'150 20 56 112', svg:`
      <path d="M166 120 Q186 100 182 68" stroke="#7a8aa3" stroke-width="2" fill="none"/>
      <path d="M182 66 C160 50 164 28 176 28 C180 28 182 32 182 34 C182 32 184 28 188 28 C200 28 204 50 182 66Z" fill="#ff7aa8"/>
      <ellipse cx="173" cy="36" rx="3.5" ry="6" fill="#fff" opacity=".6"/>` },
  hand_wand: { slot:'hand', cost:4, box:'150 70 56 66', svg:`
      <path d="M162 130 L188 92" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round"/>
      <path d="${starPath(190, 88, 13, 5.5)}" fill="#ffd54a" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/>` },

  /* ---- 이벤트 전용 ---- */
  head_santa: { slot:'head', event:'xmas', cost:0, box:'46 -12 128 62', svg:`
      <path d="M60 32 Q64 -6 104 -6 Q142 -6 160 24 L148 30 Q134 14 124 18 L138 32 Z" fill="#e53e3e"/>
      <rect x="54" y="26" width="92" height="16" rx="8" fill="#fff"/>
      <circle cx="160" cy="26" r="9" fill="#fff"/>` },
  hand_present: { slot:'hand', event:'xmas', cost:0, box:'150 102 42 44', svg:`
      <rect x="156" y="116" width="30" height="24" rx="4" fill="#3ccf9c"/>
      <rect x="168" y="116" width="6" height="24" fill="#ff7aa8"/>
      <rect x="156" y="125" width="30" height="5" fill="#ff7aa8"/>
      <ellipse cx="165" cy="112" rx="6" ry="4" fill="#ff7aa8"/><ellipse cx="177" cy="112" rx="6" ry="4" fill="#ff7aa8"/>` },
  head_witch: { slot:'head', event:'halloween', cost:0, box:'38 -36 124 78', svg:`
      <ellipse cx="100" cy="34" rx="58" ry="9" fill="#5b3a8c"/>
      <path d="M70 32 L106 -30 Q112 -18 132 32 Z" fill="#6b46a3"/>
      <rect x="73" y="22" width="56" height="8" rx="2" fill="#ff9f43"/>
      <rect x="96" y="20" width="10" height="12" rx="2" fill="none" stroke="#ffd54a" stroke-width="2.5"/>` },
  hand_pumpkin: { slot:'hand', event:'halloween', cost:0, box:'148 106 46 54', svg:`
      <path d="M156 130 Q170 110 184 130" stroke="#6b4f2a" stroke-width="3" fill="none"/>
      <ellipse cx="170" cy="143" rx="17" ry="13" fill="#ff8c1a"/>
      <path d="M163 131 Q160 143 163 155 M177 131 Q180 143 177 155" stroke="#e67300" stroke-width="2" fill="none"/>
      <rect x="168" y="127" width="4" height="5" rx="1" fill="#5a8f29"/>
      <path class="glow" d="M162 140 l3 -4 l3 4z M172 140 l3 -4 l3 4z M162 147 Q170 153 178 147" fill="#ffe08a" stroke="#ffe08a" stroke-width="1.5"/>` },
  hand_pinwheel: { slot:'hand', event:'childrensday', cost:0, box:'146 56 48 82', svg:`
      <path d="M166 130 L170 84" stroke="#a0714f" stroke-width="4" stroke-linecap="round"/>
      <g class="spin">
        <path d="M170 80 L170 60 L183 69 Z" fill="#ffd54a"/>
        <path d="M170 80 L190 80 L181 93 Z" fill="#ff7aa8"/>
        <path d="M170 80 L170 100 L157 91 Z" fill="#3ccf9c"/>
        <path d="M170 80 L150 80 L159 67 Z" fill="#4fa3ff"/>
        <circle cx="170" cy="80" r="3" fill="#fff"/>
      </g>` },
  hand_cake: { slot:'hand', event:'birthday', cost:0, box:'144 78 50 66', svg:`
      <rect x="150" y="112" width="38" height="24" rx="5" fill="#ff9ec0" stroke="#e85d8f" stroke-width="2"/>
      <path d="M150 116 Q154 122 158 116 Q162 122 166 116 Q170 122 174 116 Q178 122 182 116 Q186 122 188 116 V112 H150Z" fill="#fff"/>
      <circle cx="158" cy="128" r="2" fill="#ffd54a"/><circle cx="169" cy="130" r="2" fill="#3ccf9c"/><circle cx="180" cy="127" r="2" fill="#4fa3ff"/>
      <rect x="166" y="94" width="5" height="18" rx="2" fill="#8fd3ff"/><path d="M166 98 L171 96 M166 104 L171 102" stroke="#fff" stroke-width="1.5"/>
      <path class="glow" d="M168.5 82 Q174 89 168.5 94 Q163 89 168.5 82Z" fill="#ffb347"/>` },
  hand_bok: { slot:'hand', event:'seollal', cost:0, box:'146 106 48 54', svg:`
      <path d="M164 126 Q158 116 166 114 M176 126 Q182 116 174 114" stroke="#ffd54a" stroke-width="2.5" fill="none"/>
      <path d="M156 132 Q148 154 170 157 Q192 154 184 132 Q178 126 170 128 Q162 126 156 132Z" fill="#e53e5e"/>
      <ellipse cx="170" cy="129" rx="11" ry="4" fill="#c42d4b"/>
      <circle cx="170" cy="144" r="7" fill="none" stroke="#ffd54a" stroke-width="2.5"/>
      <circle cx="170" cy="144" r="2.5" fill="#ffd54a"/>` }
};
// 외부 리소스: 아이템 추가·교체. svg 대신 img + imgBox:[x, y, 폭, 높이] (캐릭터 좌표 -10 -36 220 250 기준)도 가능
Object.entries(RES.items || {}).forEach(([k, v]) => {
  const it = Object.assign({ cost:0, box:'-10 -36 220 250' }, v);
  if (!it.svg && it.img) it.svg = imgSvg(it.img, it.imgBox || [-10, -36, 220, 250]);
  if (it.svg) ITEMS[k] = it;
});
// 외부 리소스 이름 → 언어팩에 넣기 (names:{ ko:'…', en:'…' })
function injectNames(prefix, src){
  Object.entries(src || {}).forEach(([id, v]) => {
    Object.entries((v && v.names) || {}).forEach(([code, txt]) => { if (packs[code]) packs[code].strings[prefix + id] = txt; });
  });
}
injectNames('item.', RES.items); injectNames('item.', RES.brushes);

// 저녁 양치 때 머리에 아무것도 안 썼으면 잠옷 모자 (꾸미기 목록엔 안 나옴)
ITEMS.head_nightcap = { slot:'head', cost:0, event:'__night', box:'40 -14 150 70', svg:`
      <path d="M58 40 Q58 4 104 6 Q138 8 150 30 Q100 22 58 40Z" fill="#7c93ff"/>
      <path d="M138 12 Q168 6 172 38" stroke="#7c93ff" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="173" cy="44" r="8" fill="#fff"/>
      <path d="M56 40 Q102 22 154 34" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
      <g fill="#fff6b0"><circle cx="90" cy="20" r="2.5"/><circle cx="118" cy="16" r="2"/><circle cx="104" cy="28" r="1.8"/></g>` };
/* ---------- 변신 세트: 모험 지도 성에 도착할 때마다 한 부분씩 (섬 순서 = 머리 · 눈 · 목 · 등 · 손) ----------
   다섯 부분을 다 입으면 반짝이가 변신 (빛나는 테두리). 한 바퀴마다 다음 세트 */
// v0.26: 꽃 요정 · 인어 탐험대 · 무지개 유니콘 추가 (사용자 의견: "공룡 · 우주 · 로봇 등 남아 위주 컨셉만 있다")
// 받는 순서는 번갈아 (이미 받은 부분은 그대로, 다음 부분부터 이 순서로)
const HERO_SETS = [
  { id:'space',   aura:'#8fd3ff' },
  { id:'fairy',   aura:'#ffb3e6' },
  { id:'knight',  aura:'#ffd54a' },
  { id:'mermaid', aura:'#7fe0d8' },
  { id:'dino',    aura:'#9be37a' },
  { id:'unicorn', aura:'#c9b3ff' }
];
// 꽃 한 송이 (꽃잎 5장): 요정 세트용
const fl5 = (x, y, r, c, cc = '#fff3a0') => {
  let o = '';
  for (let k = 0; k < 5; k++){ const a = k * Math.PI * 2 / 5 - Math.PI / 2; o += `<circle cx="${(x + r * Math.cos(a)).toFixed(1)}" cy="${(y + r * Math.sin(a)).toFixed(1)}" r="${(r * .78).toFixed(1)}" fill="${c}"/>`; }
  return `<g>${o}<circle cx="${x}" cy="${y}" r="${(r * .62).toFixed(1)}" fill="${cc}"/></g>`;
};
// 곡선 위의 점 (2차 곡선 P0→P1→P2, 0~1)
const qpt = (p0, p1, p2, u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
const HERO_ART = {
  space: {
    head:['38 -40 124 92', `
        <circle cx="54" cy="40" r="10" fill="#4fa3ff" stroke="#2f7fd6" stroke-width="3"/><circle cx="146" cy="40" r="10" fill="#4fa3ff" stroke="#2f7fd6" stroke-width="3"/>
        <path d="M56 46 Q52 -4 100 -6 Q148 -4 144 46 Q100 34 56 46Z" fill="#f4f8ff" stroke="#9fb8d8" stroke-width="3"/>
        <path d="M58 40 Q100 28 142 40" stroke="#4fa3ff" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M74 8 Q86 0 98 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M100 -6 V-24" stroke="#9fb8d8" stroke-width="3"/><circle class="glow" cx="100" cy="-29" r="6" fill="#ff6b6b"/>`],
    eyes:['50 58 100 44', `
        <rect x="56" y="64" width="88" height="32" rx="16" fill="#8fe3ff77" stroke="#4fa3ff" stroke-width="4"/>
        <path d="M66 73 Q74 68 84 70" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`],
    neck:['56 114 88 42', `
        <path d="M62 122 Q100 140 138 122 L136 133 Q100 150 64 133Z" fill="#e8f0ff" stroke="#9fb8d8" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="100" cy="141" r="11" fill="#4fa3ff" stroke="#fff" stroke-width="2.5"/>
        <path d="${starPath(100, 141, 6.5, 2.8)}" fill="#ffd54a"/>`],
    back:['6 40 188 130', `
        <g id="rk"><rect x="22" y="68" width="26" height="68" rx="13" fill="#f4f8ff" stroke="#9fb8d8" stroke-width="3"/>
        <path d="M22 82 Q35 46 48 82Z" fill="#ff6b6b"/><path d="M22 120 L10 138 L24 132Z M48 120 L52 136 L46 132Z" fill="#ff6b6b"/>
        <circle cx="35" cy="98" r="5.5" fill="#4fa3ff" stroke="#9fb8d8" stroke-width="2"/>
        <path class="flame" d="M27 136 Q35 166 43 136Z" fill="#ffb347"/></g>
        <g transform="translate(200 0) scale(-1 1)"><rect x="22" y="68" width="26" height="68" rx="13" fill="#f4f8ff" stroke="#9fb8d8" stroke-width="3"/>
        <path d="M22 82 Q35 46 48 82Z" fill="#ff6b6b"/><path d="M22 120 L10 138 L24 132Z M48 120 L52 136 L46 132Z" fill="#ff6b6b"/>
        <circle cx="35" cy="98" r="5.5" fill="#4fa3ff" stroke="#9fb8d8" stroke-width="2"/>
        <path class="flame" d="M27 136 Q35 166 43 136Z" fill="#ffb347"/></g>`],
    hand:['150 60 54 76', `
        <path d="M166 124 L176 92" stroke="#9fb8d8" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="178" cy="77" rx="10" ry="9" fill="#bff0ff" stroke="#4fa3ff" stroke-width="2.5"/>
        <ellipse cx="178" cy="85" rx="22" ry="7.5" fill="#b48cff" stroke="#8b5cf6" stroke-width="2.5"/>
        <g class="glow" fill="#ffd54a"><circle cx="165" cy="86" r="2.3"/><circle cx="178" cy="88.5" r="2.3"/><circle cx="191" cy="86" r="2.3"/></g>`]
  },
  knight: {
    head:['46 -44 108 94', `
        <path d="M100 -2 Q94 -32 122 -40 Q112 -22 130 -26 Q112 -6 100 -2Z" fill="#ff5d6e" stroke="#d63c4e" stroke-width="2" stroke-linejoin="round"/>
        <path d="M56 44 Q54 0 100 -2 Q146 0 144 44 Q100 32 56 44Z" fill="#dfe6ef" stroke="#8a9ab3" stroke-width="3"/>
        <path d="M100 -2 V35" stroke="#8a9ab3" stroke-width="3"/>
        <path d="M70 10 Q80 3 90 2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="70" cy="35" r="2.8" fill="#8a9ab3"/><circle cx="130" cy="35" r="2.8" fill="#8a9ab3"/>`],
    eyes:['40 60 120 42', `
        <path d="M56 78 Q60 64 78 66 Q92 66 100 74 Q108 66 122 66 Q140 64 144 78 Q142 95 122 95 Q108 95 100 87 Q92 95 78 95 Q58 95 56 78Z
                 M66 80 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0Z M110 80 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0Z" fill="#3a6fe0" fill-rule="evenodd"/>
        <path d="M57 76 L44 70 M57 82 L44 88" stroke="#3a6fe0" stroke-width="4" stroke-linecap="round"/>`],
    neck:['72 112 56 54', `
        <path d="M80 118 Q100 138 120 118" stroke="#ffd54a" stroke-width="4" fill="none"/>
        <path d="M88 132 H112 V142 Q112 154 100 160 Q88 154 88 142Z" fill="#3a6fe0" stroke="#ffd54a" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M100 136 V155 M92 143 H108" stroke="#ffd54a" stroke-width="2.6" stroke-linecap="round"/>`],
    back:['20 54 160 130', `
        <path d="M50 62 Q100 76 150 62 L172 176 Q154 168 138 178 Q120 168 100 178 Q80 168 62 178 Q46 168 28 176 Z" fill="#3a5fd0"/>
        <path d="M150 62 L172 176 Q160 171 150 174 Z" fill="#2a48a8"/>
        <path d="M28 176 Q46 168 62 178 Q80 168 100 178 Q120 168 138 178 Q154 168 172 176" stroke="#ffd54a" stroke-width="4" fill="none"/>
        <path d="${starPath(36, 140, 7, 3)}" fill="#ffd54a"/><path d="${starPath(164, 140, 7, 3)}" fill="#ffd54a"/>`],
    hand:['150 92 52 52', `
        <circle cx="177" cy="118" r="21" fill="#dfe6ef" stroke="#8a9ab3" stroke-width="3"/>
        <circle cx="177" cy="118" r="14" fill="#ff6b6b"/>
        <path d="${starPath(177, 118, 9, 3.8)}" fill="#ffd54a"/>`]
  },
  dino: {
    head:['44 -24 112 74', `
        <path d="M56 46 Q52 0 100 -2 Q148 0 144 46 Q100 34 56 46Z" fill="#7fd36a" stroke="#4fa83a" stroke-width="3"/>
        <path d="M66 10 L74 -14 L86 4Z M90 0 L100 -22 L110 0Z M114 4 L126 -14 L134 10Z" fill="#ffd54a" stroke="#e0a100" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="80" cy="18" r="5" fill="#fff"/><circle cx="81" cy="19" r="2.6" fill="#24324a"/>
        <circle cx="120" cy="18" r="5" fill="#fff"/><circle cx="121" cy="19" r="2.6" fill="#24324a"/>
        <path d="M62 41 L66 34 L71 40Z M76 37 L80 30 L85 36Z M115 36 L120 30 L124 37Z M129 40 L134 34 L138 41Z" fill="#fff"/>`],
    eyes:['48 52 104 48', `
        <g fill="#e0852e"><circle cx="66" cy="66" r="4.2"/><circle cx="78" cy="62" r="4.2"/><circle cx="90" cy="66" r="4.2"/>
          <circle cx="110" cy="66" r="4.2"/><circle cx="122" cy="62" r="4.2"/><circle cx="134" cy="66" r="4.2"/></g>
        <ellipse cx="78" cy="83" rx="15" ry="12" fill="#ffd54a55" stroke="#e0852e" stroke-width="3.5"/>
        <ellipse cx="122" cy="83" rx="15" ry="12" fill="#ffd54a55" stroke="#e0852e" stroke-width="3.5"/>
        <path d="M93 81 Q100 76 107 81" stroke="#e0852e" stroke-width="3.5" fill="none"/>`],
    neck:['58 114 84 46', `
        <path d="M64 122 Q100 148 136 122" stroke="#8a5a32" stroke-width="2.5" fill="none"/>
        <g fill="#5cc46a" stroke="#3a9a48" stroke-width="1.5">
          <ellipse cx="74" cy="132" rx="7" ry="4" transform="rotate(35 74 132)"/><ellipse cx="87" cy="139" rx="7" ry="4" transform="rotate(18 87 139)"/>
          <ellipse cx="113" cy="139" rx="7" ry="4" transform="rotate(-18 113 139)"/><ellipse cx="126" cy="132" rx="7" ry="4" transform="rotate(-35 126 132)"/></g>
        <path d="M95 139 L100 156 L105 139Z" fill="#fff" stroke="#d8c4a0" stroke-width="2" stroke-linejoin="round"/>`],
    back:['0 50 200 152', `
        <path d="M62 156 Q20 168 4 198 Q32 188 66 176Z" fill="#7fd36a" stroke="#4fa83a" stroke-width="3" stroke-linejoin="round"/>
        <g fill="#ffd54a" stroke="#e0a100" stroke-width="2" stroke-linejoin="round">
          <path d="M46 60 L28 66 L44 78Z"/><path d="M42 88 L24 96 L42 106Z"/><path d="M44 116 L28 126 L48 132Z"/>
          <path d="M154 60 L172 66 L156 78Z"/><path d="M158 88 L176 96 L158 106Z"/><path d="M156 116 L172 126 L152 132Z"/></g>`],
    hand:['154 86 42 46', `
        <ellipse cx="176" cy="110" rx="14" ry="17" fill="#fff8e6" stroke="#e0c890" stroke-width="2.5"/>
        <g fill="#7fd36a"><circle cx="171" cy="103" r="3.5"/><circle cx="182" cy="114" r="4"/><circle cx="169" cy="118" r="2.5"/></g>
        <path d="M163 108 L169 104 L174 110 L180 104 L189 108" stroke="#c8a870" stroke-width="2" fill="none" stroke-linejoin="round"/>`]
  },
  fairy: {
    head:['48 6 104 46', `
        <path d="M58 42 Q100 22 142 42" stroke="#5cc46a" stroke-width="6" fill="none" stroke-linecap="round"/>
        <g fill="#7fd36a"><ellipse cx="70" cy="34" rx="6" ry="3.2" transform="rotate(-30 70 34)"/><ellipse cx="130" cy="34" rx="6" ry="3.2" transform="rotate(30 130 34)"/>
          <ellipse cx="90" cy="27" rx="5.5" ry="3" transform="rotate(-12 90 27)"/><ellipse cx="110" cy="27" rx="5.5" ry="3" transform="rotate(12 110 27)"/></g>
        ${fl5(62, 40, 6.5, '#ff9ec0')}${fl5(81, 31, 7, '#c9a8ff')}${fl5(100, 26, 8.5, '#ff7aa8', '#ffe066')}${fl5(119, 31, 7, '#ffd54a', '#fff')}${fl5(138, 40, 6.5, '#8fd3ff')}`],
    eyes:['46 56 108 46', `
        <path d="M100 74 C92 60 72 56 59 62 C48 68 50 88 61 95 C72 100 91 95 100 86 C109 95 128 100 139 95 C150 88 152 68 141 62 C128 56 108 60 100 74Z
                 M66 80 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0Z M110 80 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0Z" fill="#c9a8ff" fill-rule="evenodd"/>
        <g fill="#ff9ec0"><circle cx="58" cy="72" r="3.6"/><circle cx="62" cy="88" r="2.8"/><circle cx="142" cy="72" r="3.6"/><circle cx="138" cy="88" r="2.8"/></g>
        <g fill="#fff"><circle cx="100" cy="80" r="2.6"/></g>`],
    neck:['54 112 92 50', `
        ${[0, .17, .34, .5, .66, .83, 1].map((u, i) => { const [x, y] = qpt([64, 121], [100, 147], [136, 121], u); return `<ellipse cx="${x.toFixed(1)}" cy="${(y + 3).toFixed(1)}" rx="8" ry="10.5" fill="${i % 2 ? '#fff' : '#ffb3d1'}"/>`; }).join('')}
        <path d="M100 141 C96 135 88 138 90 145 C92 150 100 155 100 155 C100 155 108 150 110 145 C112 138 104 135 100 141Z" fill="#ff5d8f"/>`],
    back:['-14 40 228 124', `
        <g class="wing-l"><path d="M52 92 C28 36 -14 40 -4 82 C2 108 32 112 52 100 Z" fill="#e2a8ff"/>
          <path d="M14 78 Q30 82 46 94 M18 94 Q32 96 46 99" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M54 110 C28 106 8 128 18 146 C28 160 50 142 56 122 Z" fill="#a8dcff"/>
          <circle cx="20" cy="70" r="3" fill="#fff"/></g>
        <g class="wing-r"><path d="M148 92 C172 36 214 40 204 82 C198 108 168 112 148 100 Z" fill="#e2a8ff"/>
          <path d="M186 78 Q170 82 154 94 M182 94 Q168 96 154 99" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M146 110 C172 106 192 128 182 146 C172 160 150 142 144 122 Z" fill="#a8dcff"/>
          <circle cx="180" cy="70" r="3" fill="#fff"/></g>`],
    hand:['150 60 60 72', `
        <path d="M164 128 L186 94" stroke="#ff7aa8" stroke-width="5" stroke-linecap="round"/>
        ${fl5(189, 84, 10, '#ff9ec0', '#ffe066')}
        <path d="${starPath(172, 70, 5, 2)}" fill="#ffd54a"/><path d="${starPath(204, 98, 4, 1.6)}" fill="#ffd54a"/>`]
  },
  mermaid: {
    head:['54 0 92 48', `
        <path d="M60 41 Q100 24 140 41" stroke="#bff0ec" stroke-width="5" fill="none" stroke-linecap="round"/>
        <g fill="#fff">${[.06, .2, .34, .66, .8, .94].map(u => { const [x, y] = qpt([60, 41], [100, 24], [140, 41], u); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`; }).join('')}</g>
        <path d="M100 38 L82 22 Q84 4 100 2 Q116 4 118 22 Z" fill="#ffb3c7"/>
        <path d="M100 36 L90 10 M100 36 L100 4 M100 36 L110 10 M100 36 L84 20 M100 36 L116 20" stroke="#ff8fb4" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M92 38 Q100 44 108 38 Z" fill="#ff8fb4"/>`],
    eyes:['50 54 100 54', `
        <path d="${starPath(78, 80, 20, 11)} M67 80 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0Z" fill="#ffa06b" fill-rule="evenodd"/>
        <path d="${starPath(122, 80, 20, 11)} M111 80 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0Z" fill="#ffa06b" fill-rule="evenodd"/>
        <g fill="#fff3a0"><circle cx="78" cy="62" r="1.8"/><circle cx="122" cy="62" r="1.8"/><circle cx="60" cy="74" r="1.6"/><circle cx="140" cy="74" r="1.6"/></g>`],
    neck:['58 112 84 54', `
        <path d="M64 120 Q100 146 136 120" stroke="#fff" stroke-width="2.6" fill="none"/>
        <g fill="#fff">${[.1, .25, .4, .6, .75, .9].map(u => { const [x, y] = qpt([64, 120], [100, 146], [136, 120], u); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6"/>`; }).join('')}</g>
        <path d="M100 160 L88 146 Q90 134 100 133 Q110 134 112 146 Z" fill="#8fe3d6"/>
        <path d="M100 158 L94 140 M100 158 L100 135 M100 158 L106 140" stroke="#4fc4b4" stroke-width="2" stroke-linecap="round"/>`],
    back:['-12 92 94 88', `<g transform="translate(200 0) scale(-1 1)">
        <path d="M126 150 Q168 178 184 138 L172 132 Q162 156 132 136 Z" fill="#4fd1c5"/>
        <path d="M144 150 q6 4 12 0 M158 150 q6 2 10 -4 M150 158 q6 4 12 -1" stroke="#2fb0a4" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M178 136 Q206 124 204 98 Q190 112 180 124 Q178 104 162 98 Q164 122 174 134 Z" fill="#8ff0e4"/>
        <path d="M182 128 Q192 114 200 104 M176 126 Q172 112 166 104" stroke="#4fd1c5" stroke-width="2" fill="none" stroke-linecap="round"/></g>`],
    hand:['152 70 58 64', `
        <path d="M158 112 Q160 98 181 96 Q202 98 204 112 Q202 128 181 130 Q160 128 158 112 Z" fill="#ffc4d6"/>
        <path d="M168 126 L176 110 M181 130 L181 110 M194 126 L186 110" stroke="#ff8fb4" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M160 108 Q156 84 176 76 Q200 70 204 92 Q182 86 160 108 Z" fill="#ffd8e4"/>
        <path d="M170 92 L180 80 M182 90 L188 76 M194 90 L198 80" stroke="#ff8fb4" stroke-width="2" stroke-linecap="round"/>
        <circle cx="181" cy="104" r="8" fill="#fff"/><circle cx="178" cy="101" r="2.6" fill="#e8f4ff"/>`]
  },
  unicorn: {
    head:['40 -26 112 84', `
        <path d="M72 34 L68 12 L84 26 Z M128 34 L132 12 L116 26 Z" fill="#fff"/><path d="M72 30 L70 18 L79 26 Z M128 30 L130 18 L121 26 Z" fill="#ffb3c7"/>
        <path d="M91 26 L100 -22 L109 26 Z" fill="#ffe066"/>
        <path d="M92 18 L106 12 M94 8 L105 3 M96 -2 L103 -6" stroke="#e0a100" stroke-width="2.6" stroke-linecap="round"/>
        <circle cx="66" cy="28" r="9" fill="#ff9ec0"/><circle cx="54" cy="40" r="8" fill="#c9a8ff"/><circle cx="49" cy="53" r="6.5" fill="#8fe3c0"/>
        <circle cx="64" cy="26" r="3" fill="#fff" opacity=".7"/>`],
    eyes:['46 58 108 44', `
        <circle cx="78" cy="80" r="15" fill="#ffffff40" stroke="#ff8fb4" stroke-width="4"/><circle cx="78" cy="80" r="11" fill="none" stroke="#ffd54a" stroke-width="3"/>
        <circle cx="122" cy="80" r="15" fill="#ffffff40" stroke="#8fc8ff" stroke-width="4"/><circle cx="122" cy="80" r="11" fill="none" stroke="#8fe3c0" stroke-width="3"/>
        <path d="M93 78 Q100 72 107 78" stroke="#c9a8ff" stroke-width="4" fill="none"/>
        <path d="M63 76 L52 72 M137 76 L148 72" stroke="#c9a8ff" stroke-width="4" stroke-linecap="round"/>`],
    neck:['54 112 92 42', `
        <g fill="#fff"><circle cx="66" cy="126" r="10"/><circle cx="82" cy="134" r="11"/><circle cx="100" cy="138" r="12"/><circle cx="118" cy="134" r="11"/><circle cx="134" cy="126" r="10"/></g>
        <path d="M70 134 Q100 150 130 134" stroke="#e3dcff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="${starPath(100, 140, 7, 3)}" fill="#ffd54a"/>`],
    back:['20 54 160 130', `
        ${[['#ff8fb4', 1], ['#ffd54a', .76], ['#8fe3c0', .52], ['#8fc8ff', .28]].map(([c, k]) => `<path transform="translate(100 0) scale(${k} 1) translate(-100 0)" d="M50 62 Q100 76 150 62 L172 176 Q154 168 138 178 Q120 168 100 178 Q80 168 62 178 Q46 168 28 176 Z" fill="${c}"/>`).join('')}
        <path d="${starPath(40, 150, 6, 2.6)}" fill="#fff"/><path d="${starPath(160, 150, 6, 2.6)}" fill="#fff"/>`],
    hand:['152 54 54 80', `
        <path d="M164 130 L180 96" stroke="#f1d9a8" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="178" cy="84" r="13" fill="#ffc4dc"/><circle cx="191" cy="78" r="11" fill="#d9c8ff"/><circle cx="183" cy="67" r="10" fill="#c8f0e4"/><circle cx="170" cy="72" r="8" fill="#fff0f6"/>
        <circle cx="176" cy="70" r="2.5" fill="#fff"/>`]
  }
};
const heroItem = (set, sl) => 'hero_' + set + '_' + sl;
HERO_SETS.forEach(hs => SLOT_IDS.forEach(sl => {
  const [box, svg] = HERO_ART[hs.id][sl];
  ITEMS[heroItem(hs.id, sl)] = { slot:sl, cost:0, hero:hs.id, box, svg:svg.replace(' id="rk"', '') };
}));
const heroSetOf = (l) => HERO_SETS.find(hs => SLOT_IDS.every(sl => l[sl] === heroItem(hs.id, sl))) || null;   // 지금 모습이 세트 다섯 부분이면 그 세트
const heroHave = (set) => SLOT_IDS.filter(sl => owned.includes(heroItem(set, sl))).length;
const heroLook = (set) => Object.fromEntries(SLOT_IDS.map(sl => [sl, heroItem(set, sl)]));
// 다음에 받을 변신 부분: 섬 순서(i)의 부위를 아직 안 가진 첫 세트 → 한 바퀴 돌 때마다 다음 세트
function heroPartFor(i){
  const sl = SLOT_IDS[i % SLOT_IDS.length], lack = HERO_SETS.filter(h => !owned.includes(heroItem(h.id, sl)));
  const hs = lack.find(h => heroHave(h.id) > 0) || lack[0];          // 모으던 세트부터 마저 (v0.26: 세트 순서를 바꿔도 하던 것이 끊기지 않게)
  return hs ? heroItem(hs.id, sl) : null;
}
// 변신 중일 때 반짝이 뒤 빛
function auraOf(l){
  const hs = heroSetOf(l); if (!hs) return '';
  const c = hs.aura;
  let sp = '';
  for (let k = 0; k < 8; k++){
    const a = k / 8 * Math.PI * 2, x = 100 + Math.cos(a) * 104, y = 92 + Math.sin(a) * 104, r = k % 2 ? 5 : 8;
    sp += `<path d="M${(x).toFixed(1)} ${(y - r).toFixed(1)} l${(r * .3).toFixed(1)} ${(r * .7).toFixed(1)} ${(r * .7).toFixed(1)} ${(r * .3).toFixed(1)} ${(-r * .7).toFixed(1)} ${(r * .3).toFixed(1)} ${(-r * .3).toFixed(1)} ${(r * .7).toFixed(1)} ${(-r * .3).toFixed(1)} ${(-r * .7).toFixed(1)} ${(-r * .7).toFixed(1)} ${(-r * .3).toFixed(1)} ${(r * .7).toFixed(1)} ${(-r * .3).toFixed(1)}z" fill="#fff" stroke="${c}" stroke-width="1.5"/>`;
  }
  return `<g class="aura-glow"><circle cx="100" cy="92" r="108" fill="${c}" opacity=".18"/><circle cx="100" cy="92" r="88" fill="${c}" opacity=".22"/></g><g class="aura-spin">${sp}</g>`;
}

/* ---------- 이번 주 물건: 모양 × 색을 섞어서 만들고, 월요일마다 4개씩 바뀜 (산 물건은 계속 내 거) ---------- */
/* 의도: 손으로 112개를 그리지 않고 모양 16 × 색 7 조합. 같은 주엔 누구에게나 같은 4개(날짜로 정해짐).
   모양 추가 = WK_SHAPES 에 한 줄(draw(주색, 진한색)) + 언어팩 'wk.s.<모양>' */
const WK_COLORS = { red:['#ff6b6b', '#d94848'], orange:['#ffa04a', '#e07a20'], yellow:['#ffd54a', '#e0a100'], green:['#5cc46a', '#3a9a48'],
                    blue:['#4fa3ff', '#2f7fd6'], purple:['#b48cff', '#8b5cf6'], pink:['#ff8fb4', '#e85d8f'] };
const pearlPts = () => { let s = ''; for (let i = 0; i <= 8; i++){ const u = i / 8, x = (1 - u) * (1 - u) * 66 + 2 * (1 - u) * u * 100 + u * u * 134, y = (1 - u) * (1 - u) * 122 + 2 * (1 - u) * u * 156 + u * u * 122; s += `${x.toFixed(1)},${y.toFixed(1)};`; } return s.slice(0, -1).split(';').map(p => p.split(',').map(Number)); };
const WK_SHAPES = {
  beanie:   { slot:'head', cost:3, box:'48 -20 104 70', draw:(c, d) => `
      <path d="M58 42 Q56 2 100 0 Q144 2 142 42 Q100 32 58 42Z" fill="${c}"/>
      <path d="M76 8 Q73 24 73 36 M88 3 V34 M100 1 V33 M112 3 V34 M124 8 Q127 24 127 36" stroke="${d}" stroke-width="2.5" opacity=".45" fill="none"/>
      <path d="M55 34 Q100 22 145 34 L146 46 Q100 34 54 46Z" fill="${d}"/>
      <circle cx="100" cy="-5" r="10" fill="#fff" stroke="${d}" stroke-width="2"/>` },
  beret:    { slot:'head', cost:3, box:'42 -6 112 54', draw:(c, d) => `
      <ellipse cx="96" cy="24" rx="50" ry="17" fill="${c}" transform="rotate(-8 96 24)"/>
      <path d="M57 37 Q100 26 141 34" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M97 9 L100 -1" stroke="${d}" stroke-width="4" stroke-linecap="round"/>` },
  tophat:   { slot:'head', cost:5, box:'46 -30 108 78', draw:(c, d) => `
      <ellipse cx="100" cy="37" rx="50" ry="9" fill="${d}"/>
      <path d="M70 37 L72 -20 Q100 -26 128 -20 L130 37 Q100 43 70 37Z" fill="${c}"/>
      <path d="M71 21 Q100 27 129 21 L129.5 30 Q100 36 70.5 30Z" fill="#fff" opacity=".9"/>
      <path d="M80 -12 Q82 4 81 16" stroke="#fff" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/>` },
  catband:  { slot:'head', cost:4, box:'52 -10 96 56', draw:(c, d) => `
      <path d="M64 28 L66 -5 L90 15Z M136 28 L134 -5 L110 15Z" fill="${c}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M70 21 L71 6 L83 15Z M130 21 L129 6 L117 15Z" fill="#ffd0dc"/>
      <path d="M58 40 Q100 4 142 40" stroke="${d}" stroke-width="6" fill="none" stroke-linecap="round"/>` },
  bearband: { slot:'head', cost:4, box:'48 -6 104 52', draw:(c, d) => `
      <circle cx="70" cy="13" r="15" fill="${c}" stroke="${d}" stroke-width="2.5"/><circle cx="70" cy="13" r="7" fill="#ffe0c8"/>
      <circle cx="130" cy="13" r="15" fill="${c}" stroke="${d}" stroke-width="2.5"/><circle cx="130" cy="13" r="7" fill="#ffe0c8"/>
      <path d="M58 40 Q100 4 142 40" stroke="${d}" stroke-width="6" fill="none" stroke-linecap="round"/>` },
  hearteyes:{ slot:'eyes', cost:3, box:'46 58 108 44', draw:(c, d) => `
      <path d="M78 95 C56 82 62 62 78 71 C94 62 100 82 78 95Z" fill="${c}66" stroke="${d}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M122 95 C100 82 106 62 122 71 C138 62 144 82 122 95Z" fill="${c}66" stroke="${d}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M95 76 Q100 72 105 76 M62 76 L51 72 M138 76 L149 72" stroke="${d}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` },
  squareeyes:{ slot:'eyes', cost:3, box:'48 60 104 40', draw:(c, d) => `
      <rect x="60" y="68" width="34" height="26" rx="5" fill="${c}33" stroke="${d}" stroke-width="4"/>
      <rect x="106" y="68" width="34" height="26" rx="5" fill="${c}33" stroke="${d}" stroke-width="4"/>
      <path d="M94 78 H106 M60 76 L50 72 M140 76 L150 72" stroke="${d}" stroke-width="4" stroke-linecap="round"/>` },
  goggles:  { slot:'eyes', cost:4, box:'44 60 112 42', draw:(c, d) => `
      <path d="M48 80 Q100 70 152 80" stroke="${d}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="78" cy="80" r="15" fill="#bff0ff99" stroke="${c}" stroke-width="5"/><circle cx="122" cy="80" r="15" fill="#bff0ff99" stroke="${c}" stroke-width="5"/>
      <path d="M70 74 Q74 70 79 70 M114 74 Q118 70 123 70" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  stripescarf:{ slot:'neck', cost:3, box:'44 110 112 74', draw:(c, d) => `
      <path d="M50 120 Q100 138 150 120 L150 134 Q100 152 50 134 Z" fill="${c}"/>
      <path d="M118 140 L130 176 L116 178 L108 144 Z" fill="${d}"/>
      <path d="M64 125 L66 139 M80 130 L81 144 M96 132 V146 M112 131 L111 145 M128 127 L126 141 M113 155 L123 152 M116 166 L127 163" stroke="#fff" stroke-width="4" opacity=".8"/>` },
  tie:      { slot:'neck', cost:3, box:'82 118 36 62', draw:(c, d) => `
      <path d="M93 125 H107 L104 136 H96Z" fill="${d}"/>
      <path d="M96 136 H104 L110 166 L100 177 L90 166Z" fill="${c}"/>
      <path d="M93 151 L107 145 M92 162 L108 155" stroke="#fff" stroke-width="2.5" opacity=".7"/>` },
  pearls:   { slot:'neck', cost:4, box:'56 112 88 44', draw:(c, d) => pearlPts().map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="${i === 4 ? 7 : 5.5}" fill="${i === 4 ? '#fff' : c}" stroke="${d}" stroke-width="2"/>`).join('') },
  starcape: { slot:'back', cost:4, box:'20 54 160 130', draw:(c, d) => `
      <path d="M50 62 Q100 76 150 62 L172 176 Q154 168 138 178 Q120 168 100 178 Q80 168 62 178 Q46 168 28 176 Z" fill="${c}"/>
      <path d="M150 62 L172 176 Q160 171 150 174 Z" fill="${d}"/>
      <g fill="#fff" opacity=".9"><path d="${starPath(34, 150, 6, 2.6)}"/><path d="${starPath(166, 150, 6, 2.6)}"/><path d="${starPath(50, 168, 4, 1.8)}"/><path d="${starPath(150, 168, 4, 1.8)}"/></g>` },
  bflywings:{ slot:'back', cost:6, box:'-6 44 212 124', draw:(c, d) => {
    const w = `<path d="M54 96 Q10 42 4 84 Q2 112 54 106Z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M54 112 Q16 118 20 146 Q32 162 56 124Z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="24" cy="84" r="7" fill="#fff" opacity=".8"/><circle cx="34" cy="136" r="5" fill="#fff" opacity=".8"/><circle cx="40" cy="98" r="3.5" fill="${d}"/>`;
    return `<g class="wing-l">${w}</g><g class="wing-r"><g transform="translate(200 0) scale(-1 1)">${w}</g></g>`; } },
  lolli:    { slot:'hand', cost:2, box:'150 50 48 84', draw:(c, d) => `
      <path d="M167 128 L174 88" stroke="#e8dccb" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="176" cy="72" r="16" fill="${c}" stroke="${d}" stroke-width="2.5"/>
      <path d="M166 72 a10 10 0 1 1 10 10 a6.5 6.5 0 1 1 -6.5 -6.5 a3 3 0 1 1 3 3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  icecream: { slot:'hand', cost:3, box:'154 78 44 66', draw:(c, d) => `
      <path d="M164 112 L176 142 L188 112Z" fill="#f0b86a" stroke="#c88a3a" stroke-width="2" stroke-linejoin="round"/>
      <path d="M168 118 L182 130 M184 118 L172 132" stroke="#c88a3a" stroke-width="1.5"/>
      <circle cx="176" cy="102" r="14" fill="${c}"/>
      <path d="M162 108 Q165 117 169 110 Q173 119 177 110 Q181 117 190 107" fill="${c}" stroke="${c}" stroke-width="2"/>
      <circle cx="171" cy="97" r="3" fill="#fff" opacity=".6"/><circle cx="178" cy="86" r="4.2" fill="#ff4d6a"/>` },
  starballoon:{ slot:'hand', cost:3, box:'150 26 58 100', draw:(c, d) => `
      <path d="M166 120 Q184 100 180 74" stroke="#7a8aa3" stroke-width="2" fill="none"/>
      <path d="${starPath(181, 52, 21, 9.5)}" fill="${c}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="174" cy="45" rx="3.5" ry="6" fill="#fff" opacity=".6" transform="rotate(-20 174 45)"/>` }
};
Object.entries(WK_SHAPES).forEach(([sh, S]) => Object.entries(WK_COLORS).forEach(([cn, [c, d]]) => {
  ITEMS['wk_' + sh + '_' + cn] = { slot:S.slot, cost:S.cost, weekly:true, wk:[sh, cn], box:S.box, svg:S.draw(c, d) };
}));
// 날짜로 정해지는 섞기 (같은 주에는 누구나 같은 물건)
const mix = (x) => { x = Math.imul(x ^ (x >>> 16), 0x45d9f3b); x = Math.imul(x ^ (x >>> 16), 0x45d9f3b); return (x ^ (x >>> 16)) >>> 0; };
const hashStr = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = Math.imul(h, 31) + s.charCodeAt(i) | 0; return mix(h); };
const weekNo = (d = new Date()) => Math.floor((dayNum(d) - 4) / 7);                 // 월요일에 바뀜
const weekDaysLeft = (d = new Date()) => 7 - (((dayNum(d) - 4) % 7) + 7) % 7;
function weeklyIds(w = weekNo()){
  const shapes = Object.keys(WK_SHAPES), cols = Object.keys(WK_COLORS), out = [];
  for (let k = 0; k < 4; k++){                                                        // 주마다 다른 부위 4곳
    const sl = SLOT_IDS[(w + k) % SLOT_IDS.length], list = shapes.filter(s => WK_SHAPES[s].slot === sl);
    out.push('wk_' + list[mix(w * 31 + k * 7 + 3) % list.length] + '_' + cols[mix(w * 17 + k * 11 + 5) % cols.length]);
  }
  return out;
}
/* ---------- 세균 그림 (양치 화면 공용) ---------- */
const GERM_COL = [['#8ee06a', '#4fa83a'], ['#c79bff', '#8f5fd8'], ['#ffb86b', '#e0852e'], ['#6fd3e6', '#2f9fb8']];
const CROWN = '<path d="M-14 -21 L-15 -35 L-7 -27 L0 -38 L7 -27 L15 -35 L14 -21Z" fill="#ffd54a" stroke="#e0a100" stroke-width="2" stroke-linejoin="round"/><circle cx="0" cy="-38" r="2.6" fill="#ff7aa8"/>';
const GOLD_FX = '<g fill="#fff"><path d="M25 -27 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path d="M-28 16 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"/></g>';
// k: 색 번호 | 'gold' | [몸색, 테두리색] / boss: true(왕관만) 또는 대장 정의 { behind, below, above }
function germInner(k, boss){
  return stickered(germBody(k, boss), 5);
}
function germBody(k, boss){
  const B = boss && typeof boss === 'object' ? boss : {};
  const [f, s] = k === 'gold' ? ['#ffd54a', '#e0a100'] : Array.isArray(k) ? k : GERM_COL[(+k || 0) % GERM_COL.length];
  let b = '';
  for (let i = 0; i < 9; i++){ const a = i / 9 * Math.PI * 2 - Math.PI / 2; b += `<circle cx="${(Math.cos(a) * 19).toFixed(1)}" cy="${(Math.sin(a) * 19).toFixed(1)}" r="7" fill="${f}" stroke="${s}" stroke-width="2.5"/>`; }
  return (B.behind || '') + b + `<circle r="20.5" fill="${f}"/>` + (B.below || '') + '<ellipse cx="-8" cy="-11" rx="5" ry="3" fill="#fff" opacity=".45"/>' +
    '<circle cx="-7" cy="-1" r="5.4" fill="#fff"/><circle cx="7" cy="-1" r="5.4" fill="#fff"/><circle cx="-6" cy="0" r="2.8" fill="#24324a"/><circle cx="8" cy="0" r="2.8" fill="#24324a"/>' +
    '<path d="M-12.5 -9.5 L-3 -6.5 M12.5 -9.5 L3 -6.5" stroke="#24324a" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M-7 8 Q0 15 7 8Z" fill="#8a2346" stroke="#24324a" stroke-width="2.2" stroke-linejoin="round"/><path d="M-3 9 L-1.6 12 L-.2 9.4Z" fill="#fff"/>' +
    (boss ? CROWN : '') + (B.above || '') + (k === 'gold' ? GOLD_FX : '');
}
const germSVG = (k, boss, cls = '') => `<svg class="${cls}" viewBox="-38 -42 76 76" aria-hidden="true">${germInner(k, boss)}</svg>`;

/* 오늘의 대장 세균: 날짜 + 아침/저녁마다 차례로 바뀜 (resources.js 의 bosses 로 추가·교체 가능) */
const BOSSES = [
  { id:'candy', col:['#ff9cc8', '#e0609a'], above:'<path d="M18 -4 L30 -24" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="-28" r="9" fill="#ff5d8f" stroke="#fff" stroke-width="2.5"/><path d="M28 -28 a4 4 0 1 1 4 4" stroke="#fff" stroke-width="2" fill="none"/>' },
  { id:'choco', col:['#a8764e', '#6e4526'], below:'<path d="M-19 -9 Q-19 -21 0 -21 Q19 -21 19 -9 Q16 -2 14 -8 Q11 0 8 -8 Q4 1 0 -8 Q-4 1 -8 -8 Q-11 0 -14 -8 Q-16 -2 -19 -9Z" fill="#5a3520"/>' },
  { id:'soda', col:['#c85a50', '#8e2f2a'], above:'<g fill="none" stroke="#fff" stroke-width="2"><circle cx="-26" cy="-22" r="4"/><circle cx="-31" cy="-32" r="2.6"/><circle cx="27" cy="-20" r="3.4"/><circle cx="31" cy="-30" r="2.2"/></g>' },
  { id:'jelly', col:['#7fe0a0', '#3fb070'], behind:'<circle cx="-15" cy="-22" r="8" fill="#7fe0a0" stroke="#3fb070" stroke-width="2.5"/><circle cx="15" cy="-22" r="8" fill="#7fe0a0" stroke="#3fb070" stroke-width="2.5"/>', below:'<ellipse cx="9" cy="-12" rx="6" ry="3" fill="#fff" opacity=".6"/>' },
  { id:'cookie', col:['#e8b878', '#b98546'], below:'<g fill="#6b4226"><circle cx="-12" cy="12" r="2.6"/><circle cx="13" cy="13" r="2.2"/><circle cx="14" cy="-12" r="2.4"/><circle cx="-15" cy="-10" r="2"/></g>' },
  { id:'juice', col:['#ffac4a', '#e07a10'], above:'<path d="M15 -14 L22 -40 L32 -40" stroke="#ff5d8f" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
  { id:'king', col:['#c79bff', '#8f5fd8'] }
];
(RES.bosses || []).forEach(b => {
  const i = BOSSES.findIndex(x => x.id === b.id);
  if (i >= 0) BOSSES[i] = Object.assign({}, BOSSES[i], b); else BOSSES.push(Object.assign({ col:['#c79bff', '#8f5fd8'] }, b));
});
const bossFor = (d, slot) => BOSSES[((dayNum(d) * 2 + (slot === 'pm' ? 1 : 0)) % BOSSES.length + BOSSES.length) % BOSSES.length];
