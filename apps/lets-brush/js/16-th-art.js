'use strict';

/* =========================================================
   14-4a. 반짝이 극장 그림 (v0.51.0): 출연진 · 배경 · 소품
     출연진: 영상 바이블과 같은 친구들 (apps/lets-brush/docs/video 의 pipi · mongi · coco · duri 참고 그림을 그림체 B 로)
       피피 (꽃 요정) · 몽이 (물방울 인어) · 코코 (아기 유니콘) · 두리 (아기 공룡). 크기는 반짝이의 3/4
       극장에서 c.cast('pipi', x, y) 로 세움. 말할 때 통통 (c.talk)
     배경: TH_BG_EXTRA (정원 · 구름 나라 · 밤하늘 · 어금니 동굴 · 이 마을 · 치과). 기존 bath · room · safari · bug · bird · sea · swamp · castle 와 같이 씀
     소품: TH_P (이야기에 쓰는 물건). 그림은 viewBox 가운데가 (0,0), stickerSvg 로 테두리. 16-theater.js 의 TH_ART · TH_ART2 · TH_ART3 소품도 TH_P 로 이어 붙임
   ========================================================= */
const TH_INK = '#24324a';
const thEye = (x, y, s = 1) => `<ellipse cx="${x}" cy="${y}" rx="${3.6 * s}" ry="${4.6 * s}" fill="${TH_INK}"/><circle cx="${x + 1.4 * s}" cy="${y - 1.8 * s}" r="${1.5 * s}" fill="#fff"/><circle cx="${x - 1.2 * s}" cy="${y + 2 * s}" r="${.7 * s}" fill="#fff"/>`;
const thSmile = (y, w = 4) => `<path d="M${-w} ${y} Q0 ${y + w} ${w} ${y}" fill="none" stroke="${TH_INK}" stroke-width="2.2" stroke-linecap="round"/>`;
const thCheeks = (y, dx, c = '#ff9ec0') => `<ellipse cx="${-dx}" cy="${y}" rx="4" ry="2.4" fill="${c}"/><ellipse cx="${dx}" cy="${y}" rx="4" ry="2.4" fill="${c}"/>`;
const thFace = (y, dx = 8, ck = '#ff9ec0') => thEye(-dx, y) + thEye(dx, y) + thSmile(y + 8) + thCheeks(y + 7, dx + 7, ck);
const thSvg = (vb, inner, w = 3.2) => stickerSvg(`<svg viewBox="${vb}" aria-hidden="true">${inner}</svg>`, w);
const CAST_ART = {
  pipi: thSvg('-50 -50 100 100',
    '<ellipse cx="-22" cy="0" rx="12" ry="17" fill="#dcc2ff" transform="rotate(-28 -22 0)"/><ellipse cx="22" cy="0" rx="12" ry="17" fill="#dcc2ff" transform="rotate(28 22 0)"/>' +
    '<path d="M0 -24 V-34" stroke="#24324a" stroke-width="2.5"/>' +
    '<g fill="#ff8fb4"><circle cx="0" cy="-41" r="5"/><circle cx="5.2" cy="-37.2" r="5"/><circle cx="3.2" cy="-31" r="5"/><circle cx="-3.2" cy="-31" r="5"/><circle cx="-5.2" cy="-37.2" r="5"/></g><circle cx="0" cy="-35.5" r="3.6" fill="#ffe066"/>' +
    '<ellipse cx="-8" cy="34" rx="6" ry="3.4" fill="#7fd36a"/><ellipse cx="8" cy="34" rx="6" ry="3.4" fill="#7fd36a"/>' +
    '<path d="M0 -24 C16 -24 24 -8 24 8 C24 24 13 33 0 33 C-13 33 -24 24 -24 8 C-24 -8 -16 -24 0 -24Z" fill="#ffc8de"/><ellipse cx="-11" cy="-11" rx="5" ry="3" fill="#fff" opacity=".7"/>' + thFace(4, 8, '#ff7aa8')),
  mongi: thSvg('-50 -50 100 100',
    '<path d="M14 26 Q34 30 38 10 Q38 4 34 4 Q30 18 16 18Z" fill="#4fd1c5"/><path d="M35 6 Q30 -8 38 -7 Q41 -2 40 1 Q45 -8 49 -3 Q47 6 40 9Z" fill="#8ff0e4"/>' +
    '<path d="M0 -36 C11 -20 26 -6 26 12 C26 29 14 38 0 38 C-14 38 -26 29 -26 12 C-26 -6 -11 -20 0 -36Z" fill="#bff0ec"/>' +
    '<path d="M10 -13 Q15 -27 25 -17 Q20 -12 10 -13Z" fill="#ffb3c7"/><path d="M13 -15 L17 -22 M16 -14 L22 -19" stroke="#ff7aa8" stroke-width="1.4"/>' +
    '<circle cx="-27" cy="-24" r="3" fill="#e6f7ff" stroke="#24324a" stroke-width="1.5"/><circle cx="-33" cy="-15" r="2" fill="#e6f7ff" stroke="#24324a" stroke-width="1.3"/>' +
    '<ellipse cx="-11" cy="0" rx="4" ry="6" fill="#fff" opacity=".6"/>' + thFace(14, 8)),
  coco: thSvg('-50 -50 100 100',
    '<path d="M22 12 Q40 6 36 22 Q32 32 42 34" fill="none" stroke="#ffb3d9" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="-17" y="24" width="10" height="12" rx="5" fill="#f7f0ff"/><rect x="7" y="24" width="10" height="12" rx="5" fill="#f7f0ff"/>' +
    '<path d="M-21 -10 L-17 -29 L-7 -18Z" fill="#f7f0ff"/><path d="M21 -10 L17 -29 L7 -18Z" fill="#f7f0ff"/><path d="M-17 -14 L-15.5 -24 L-10 -18Z" fill="#ffb3c7"/><path d="M17 -14 L15.5 -24 L10 -18Z" fill="#ffb3c7"/>' +
    '<circle cx="0" cy="6" r="26" fill="#f7f0ff"/>' +
    '<path d="M-5 -18 L0 -42 L5 -18Z" fill="#ffe066"/><path d="M-3.6 -24 L3 -27 M-2.4 -30 L2.2 -32.5 M-1.4 -35.5 L1.4 -37" stroke="#e0a100" stroke-width="1.8"/>' +
    '<circle cx="-22" cy="-8" r="6.5" fill="#ff9ec0"/><circle cx="-26" cy="3" r="6" fill="#c9a8ff"/><circle cx="-25" cy="13" r="5.5" fill="#8fe3c0"/>' + thFace(6, 9)),
  duri: thSvg('-50 -50 100 100',
    '<path d="M-20 16 L-42 26 L-18 30Z" fill="#8fdc7a"/>' +
    '<path d="M-14 -21 L-9 -32 L-4 -22Z M-5 -24 L0 -38 L5 -24Z M4 -22 L9 -32 L14 -21Z" fill="#ffd54a"/>' +
    '<ellipse cx="-11" cy="34" rx="8" ry="5" fill="#8fdc7a"/><ellipse cx="11" cy="34" rx="8" ry="5" fill="#8fdc7a"/>' +
    '<path d="M0 -24 C16 -24 25 -8 25 8 C25 25 14 34 0 34 C-14 34 -25 25 -25 8 C-25 -8 -16 -24 0 -24Z" fill="#8fdc7a"/><ellipse cx="0" cy="17" rx="15" ry="12" fill="#e9f8d8"/>' +
    thEye(-8, -3) + thEye(8, -3) + '<path d="M-6 5 Q0 13 6 5Z" fill="#8a2346" stroke="#24324a" stroke-width="2" stroke-linejoin="round"/><path d="M1 5.4 h3 v2.6 h-3Z" fill="#fff"/>' + thCheeks(3, 15))
};
CAST_ART.duriEgg = thSvg('-50 -50 100 100', '<path d="M0 -36 C18 -36 28 -4 28 14 C28 32 15 40 0 40 C-15 40 -28 32 -28 14 C-28 -4 -18 -36 0 -36Z" fill="#fff8e6"/><g fill="#9fe08a"><circle cx="-10" cy="-6" r="6"/><circle cx="12" cy="10" r="7"/><circle cx="-8" cy="24" r="5"/><circle cx="8" cy="-22" r="4"/></g>');
CAST_ART.duriEggCrack = thSvg('-50 -50 100 100', '<path d="M0 -36 C18 -36 28 -4 28 14 C28 32 15 40 0 40 C-15 40 -28 32 -28 14 C-28 -4 -18 -36 0 -36Z" fill="#fff8e6"/><g fill="#9fe08a"><circle cx="-10" cy="-6" r="6"/><circle cx="12" cy="10" r="7"/><circle cx="-8" cy="24" r="5"/></g><path d="M-26 6 L-16 0 L-8 8 L0 0 L8 8 L16 0 L26 6" fill="none" stroke="#8a7458" stroke-width="2.6" stroke-linejoin="round"/>');

/* ---------- 배경 (400 × 260, 땅은 아래쪽 200 근처) ---------- */
const thSky = (top, bot) => `<defs><linearGradient id="thsk${top.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect width="400" height="260" fill="url(#thsk${top.slice(1)})"/>`;
const thStars = (n, seed = 3) => Array.from({ length:n }, (_, i) => { const x = (i * 97 + seed * 31) % 390 + 5, y = (i * 53 + seed * 17) % 150 + 6, r = 1.4 + (i % 3) * .7; return `<circle data-noink="1" cx="${x}" cy="${y}" r="${r}" fill="#fff8c8"/>`; }).join('');
const TH_BG_EXTRA = {
  garden: '<rect width="400" height="260" fill="#dff4ff"/>' + cloud(90, 50, .8) + cloud(300, 36, .6) +
    '<rect x="20" y="16" width="360" height="170" rx="10" fill="none" stroke="#ffffff" stroke-width="10"/><path data-noink="1" d="M200 16 V186 M20 100 H380" stroke="#ffffff" stroke-width="6"/>' +
    '<rect y="186" width="400" height="74" fill="#f2e2c8"/><rect y="186" width="400" height="14" fill="#e6cfa8"/>' +
    '<path d="M140 200 L150 150 H250 L260 200Z" fill="#e8875a"/><rect x="144" y="142" width="112" height="14" rx="5" fill="#f29a6a"/>' +
    [[160, 96, '#ff8fb4'], [200, 80, '#ffe066'], [240, 100, '#c9a8ff'], [180, 112, '#ff9ec0'], [222, 118, '#8fd3ff']].map(([x, y, c]) =>
      `<path d="M${x} 146 Q${x - 4} ${(y + 146) / 2} ${x} ${y}" stroke="#5cb04a" stroke-width="4" fill="none"/><ellipse cx="${x + 9}" cy="${(y + 146) / 2 + 6}" rx="9" ry="4" fill="#6cc46a"/><circle cx="${x}" cy="${y}" r="11" fill="${c}"/><circle cx="${x}" cy="${y}" r="4.5" fill="#fff6c0"/>`).join('') +
    '<g fill="#ffd27a"><path d="M330 90 q-8 -10 -14 0 q6 8 14 0Z"/><path d="M330 90 q8 -10 14 0 q-6 8 -14 0Z"/></g><g fill="#ff9ec0"><path d="M70 120 q-7 -9 -12 0 q5 7 12 0Z"/><path d="M70 120 q7 -9 12 0 q-5 7 -12 0Z"/></g>',
  sky: thSky('#ffd6ec', '#d4ecff') +
    '<path d="M40 150 Q120 40 200 150" fill="none" stroke="#ff8a8a" stroke-width="8" opacity=".75"/><path d="M48 150 Q120 52 192 150" fill="none" stroke="#ffd27a" stroke-width="8" opacity=".75"/><path d="M56 150 Q120 64 184 150" fill="none" stroke="#a8e08a" stroke-width="8" opacity=".75"/><path d="M64 150 Q120 76 176 150" fill="none" stroke="#8fc8ff" stroke-width="8" opacity=".75"/>' +
    '<g fill="#fff"><rect x="282" y="66" width="56" height="40" rx="6"/><rect x="276" y="50" width="16" height="30" rx="4"/><rect x="328" y="50" width="16" height="30" rx="4"/><path d="M276 50 L284 36 L292 50Z M328 50 L336 36 L344 50Z"/><rect x="302" y="84" width="16" height="22" rx="8" fill="#ffd6ec"/></g>' +
    '<g fill="#ffffff"><ellipse cx="80" cy="214" rx="120" ry="36"/><ellipse cx="250" cy="222" rx="140" ry="38"/><ellipse cx="380" cy="208" rx="80" ry="34"/><circle cx="40" cy="190" r="34"/><circle cx="150" cy="196" r="30"/><circle cx="300" cy="196" r="34"/></g>' +
    '<rect y="226" width="400" height="34" fill="#ffffff"/>' + cloud(60, 60, .7) + cloud(210, 30, .6),
  nightsky: '<rect width="400" height="260" fill="#2c3a86"/><rect data-noink="1" y="130" width="400" height="130" fill="#3a4a9c"/>' + thStars(26) +
    '<circle cx="300" cy="70" r="40" fill="#fff3b0"/><path d="M286 66 Q290 72 294 66 M306 66 Q310 72 314 66" fill="none" stroke="#c9a845" stroke-width="2.4" stroke-linecap="round"/><path d="M294 82 Q300 87 306 82" fill="none" stroke="#c9a845" stroke-width="2.4" stroke-linecap="round"/>' +
    '<g fill="#8f7fd8" opacity=".8"><ellipse cx="90" cy="120" rx="50" ry="14"/><ellipse cx="200" cy="96" rx="40" ry="11"/></g>' +
    '<g fill="#c8b8ff"><ellipse cx="100" cy="226" rx="140" ry="40"/><ellipse cx="320" cy="232" rx="140" ry="36"/></g><rect y="236" width="400" height="24" fill="#c8b8ff"/>',
  cave: '<rect width="400" height="260" fill="#ffe3ea"/>' +
    '<g fill="#ffffff"><path d="M0 0 H70 Q70 70 40 90 Q20 70 0 80Z"/><path d="M70 0 H170 Q150 60 120 60 Q90 60 70 0Z"/><path d="M170 0 H260 Q245 70 215 70 Q185 70 170 0Z"/><path d="M260 0 H350 Q335 60 305 60 Q275 60 260 0Z"/><path d="M350 0 H400 V84 Q380 70 360 90 Q340 70 350 0Z"/></g>' +
    '<g fill="#ffffff"><path d="M0 200 Q10 150 40 150 Q70 150 74 200Z"/><path d="M326 200 Q330 146 362 146 Q392 146 400 200Z"/></g>' +
    '<path d="M0 196 Q200 180 400 196 V260 H0Z" fill="#ff9eb5"/><path data-noink="1" d="M40 222 Q120 214 200 222 T360 220" stroke="#ff7a9a" stroke-width="3" fill="none"/>' +
    '<g data-noink="1" fill="#fff" opacity=".7"><circle cx="120" cy="110" r="3"/><circle cx="260" cy="120" r="2.4"/><circle cx="200" cy="140" r="2"/></g>',
  town: '<rect width="400" height="260" fill="#d8f0ff"/>' + cloud(80, 40, .8) + cloud(310, 30, .7) +
    [[50, 120], [140, 100], [250, 112], [345, 124]].map(([x, y], i) =>
      `<path d="M${x - 30} 196 V${y + 20} Q${x - 30} ${y} ${x - 14} ${y} Q${x} ${y + 8} ${x + 14} ${y} Q${x + 30} ${y} ${x + 30} ${y + 20} V196Z" fill="#ffffff"/><path d="M${x - 36} ${y + 12} L${x} ${y - 22} L${x + 36} ${y + 12}Z" fill="${['#ff9ec0', '#ffb3c7', '#ff8fb4', '#ffa8c8'][i]}"/><rect x="${x - 8}" y="${178}" width="16" height="18" rx="8" fill="#ffd27a"/><circle cx="${x - 14}" cy="${y + 34}" r="6" fill="#bfe3f7"/><circle cx="${x + 14}" cy="${y + 34}" r="6" fill="#bfe3f7"/>`).join('') +
    '<rect y="196" width="400" height="64" fill="#fbe9f2"/><path data-noink="1" d="M0 222 H400" stroke="#ffffff" stroke-width="6" stroke-dasharray="20 14"/>' +
    '<rect x="186" y="150" width="6" height="48" rx="3" fill="#8fd3ff"/><rect x="176" y="142" width="26" height="12" rx="6" fill="#ffffff"/>',
  clinic: '<rect width="400" height="260" fill="#e9fbf6"/><rect data-noink="1" y="0" width="400" height="20" fill="#d4f4ec"/>' +
    '<path d="M40 40 Q40 20 70 20 Q100 20 100 40 Q100 50 92 70 Q86 86 82 70 Q78 60 70 60 Q62 60 58 70 Q54 86 48 70 Q40 50 40 40Z" fill="#ffffff"/><rect x="50" y="30" width="40" height="26" rx="6" fill="#bfe3f7"/>' +
    '<circle cx="300" cy="50" r="26" fill="#ffe680"/><path d="M290 48 Q294 53 298 48 M302 48 Q306 53 310 48" fill="none" stroke="#c9a845" stroke-width="2.4" stroke-linecap="round"/><path d="M292 60 Q300 66 308 60" fill="none" stroke="#c9a845" stroke-width="2.4" stroke-linecap="round"/><rect x="298" y="74" width="4" height="40" fill="#9aa8bd"/>' +
    '<path d="M250 190 Q240 150 270 146 Q300 120 330 140 Q370 134 366 170 Q376 190 360 196 H262Z" fill="#9fe6d2"/>' +
    '<rect x="120" y="120" width="80" height="60" rx="8" fill="#ffffff"/><path data-noink="1" d="M130 140 H190 M130 156 H176" stroke="#cfe3f0" stroke-width="5" stroke-linecap="round"/>' +
    '<rect y="196" width="400" height="64" fill="#cdefe4"/>'
};
const thBgExtra = (id) => TH_BG_EXTRA[id] ? inkScene(TH_BG_EXTRA[id], 3.5) : null;

/* ---------- 소품 ---------- */
const thFlower = (c, droop) => thSvg('-14 -30 28 44', `<path d="M0 14 Q${droop ? 6 : -2} -2 ${droop ? 8 : 0} -14" stroke="#5cb04a" stroke-width="3" fill="none"/>` +
  (droop ? `<ellipse cx="10" cy="-12" rx="7" ry="5" fill="${c}" transform="rotate(50 10 -12)"/>` : `<g fill="${c}">${[0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.sin(a * Math.PI / 180) * 6).toFixed(1)}" cy="${(-14 - Math.cos(a * Math.PI / 180) * 6).toFixed(1)}" r="5"/>`).join('')}</g><circle cy="-14" r="3.4" fill="#ffe680"/>`));
const TH_P = {
  flower: thFlower('#ff8fb4'), flowerY: thFlower('#ffe066'), flowerL: thFlower('#c9a8ff'), flowerDroop: thFlower('#d6a3b8', true),
  can: thSvg('-26 -18 52 34', '<path d="M-14 -10 H10 V12 H-14Z" fill="#8fd3ff"/><path d="M10 -6 L24 -14" stroke="#8fd3ff" stroke-width="5" stroke-linecap="round"/><path d="M-14 -8 Q-24 -6 -20 4" stroke="#6ab4e0" stroke-width="3" fill="none"/>'),
  drop: thSvg('-8 -10 16 20', '<path d="M0 -8 Q7 2 0 8 Q-7 2 0 -8Z" fill="#8fd3ff"/>', 2),
  pearl: thSvg('-12 -12 24 24', '<circle r="9" fill="#fffaf0"/><circle cx="-3" cy="-3" r="3" fill="#ffffff"/><circle cx="3" cy="3" r="2" fill="#f2e6ff"/>'),
  pearlDull: thSvg('-12 -12 24 24', '<circle r="9" fill="#c8c0b4"/><circle cx="-3" cy="2" r="2" fill="#a89e90"/><circle cx="3" cy="-3" r="1.6" fill="#a89e90"/>'),
  shell: thSvg('-20 -16 40 30', '<path d="M-16 10 Q-18 -14 0 -14 Q18 -14 16 10Z" fill="#ffb3c7"/><path d="M-8 8 L-6 -10 M0 8 V-12 M8 8 L6 -10" stroke="#ff7aa8" stroke-width="1.6"/>'),
  bridge: '<svg viewBox="-60 -40 120 60" aria-hidden="true"><g fill="none" stroke-width="9" stroke-linecap="round">' + [['#ff8a8a', 50], ['#ffd27a', 41], ['#a8e08a', 32], ['#8fc8ff', 23]].map(([c, r]) => `<path d="M${-r} 14 A${r} ${r} 0 0 1 ${r} 14" stroke="${c}"/>`).join('') + '</g></svg>',
  bridgeGray: '<svg viewBox="-60 -40 120 60" aria-hidden="true"><g fill="none" stroke-width="9" stroke-linecap="round">' + [['#b8b8c8', 50], ['#c8c8d4', 41], ['#d4d4de', 32], ['#e0e0e8', 23]].map(([c, r]) => `<path d="M${-r} 14 A${r} ${r} 0 0 1 ${r} 14" stroke="${c}"/>`).join('') + '</g></svg>',
  hourglass: thSvg('-14 -20 28 40', '<rect x="-12" y="-18" width="24" height="4" rx="2" fill="#c98a4a"/><rect x="-12" y="14" width="24" height="4" rx="2" fill="#c98a4a"/><path d="M-9 -14 H9 Q9 -4 1 0 Q9 4 9 14 H-9 Q-9 4 -1 0 Q-9 -4 -9 -14Z" fill="#e6f7ff"/><path d="M-6 -10 H6 Q4 -4 0 -1 Q-4 -4 -6 -10Z" fill="#ffd27a"/><path d="M-6 12 Q0 6 6 12Z" fill="#ffd27a"/>'),
  pea: thSvg('-12 -10 24 18', '<path d="M-8 4 Q-10 -6 -2 -6 Q2 -10 6 -5 Q11 -3 8 4Z" fill="#ffffff"/><path d="M-6 2 Q0 -2 6 2" stroke="#8fd3ff" stroke-width="1.6" fill="none"/>'),
  blob: thSvg('-26 -14 52 26', '<path d="M-22 8 Q-26 -6 -12 -6 Q-8 -14 2 -8 Q12 -14 18 -4 Q28 -2 22 8Z" fill="#ffffff"/><path d="M-16 2 Q0 -6 16 2" stroke="#8fd3ff" stroke-width="2.4" fill="none"/>'),
  tube: thSvg('-26 -10 52 20', '<path d="M-22 -7 H12 L18 -3 V3 L12 7 H-22 Q-24 0 -22 -7Z" fill="#ffffff"/><rect x="-14" y="-7" width="8" height="14" fill="#8fd3ff"/><rect x="-2" y="-7" width="8" height="14" fill="#ff9ec0"/><rect x="18" y="-4" width="6" height="8" rx="2" fill="#ff7aa8"/>'),
  splash: thSvg('-20 -16 40 30', '<path d="M-14 10 Q-18 -2 -8 -4 Q-6 -14 4 -10 Q14 -14 14 -2 Q20 4 12 10Z" fill="#bfe8ff"/><circle cx="-16" cy="-10" r="3" fill="#bfe8ff"/><circle cx="18" cy="-8" r="2.4" fill="#bfe8ff"/>'),
  tongue: thSvg('-16 -10 32 22', '<path d="M-12 -6 H12 Q14 12 0 12 Q-14 12 -12 -6Z" fill="#ff8fa3"/><path d="M0 -4 V6" stroke="#e06a80" stroke-width="2"/>'),
  brushTired: thSvg('-30 -14 60 26', '<rect x="-28" y="-2" width="40" height="8" rx="4" fill="#8fd3ff"/><g stroke="#e8e0d0" stroke-width="3" stroke-linecap="round"><path d="M14 -2 L10 -12"/><path d="M18 -2 L22 -12"/><path d="M22 -1 L28 -8"/><path d="M26 0 L30 -2"/></g>'),
  brushNew: thSvg('-30 -14 60 26', '<rect x="-28" y="-2" width="40" height="8" rx="4" fill="#ff9ec0"/><g stroke="#ffffff" stroke-width="3" stroke-linecap="round"><path d="M14 -2 V-12"/><path d="M18 -2 V-12"/><path d="M22 -2 V-12"/><path d="M26 -2 V-12"/></g><rect x="13" y="-13" width="14" height="4" rx="2" fill="#8fd3ff"/>'),
  train: thSvg('-60 -26 120 44', '<rect x="-56" y="-10" width="34" height="24" rx="6" fill="#ff9ec0"/><rect x="-16" y="-10" width="34" height="24" rx="6" fill="#ffd27a"/><rect x="24" y="-20" width="32" height="34" rx="6" fill="#8fd3ff"/><rect x="30" y="-14" width="14" height="10" rx="3" fill="#ffffff"/><rect x="48" y="-28" width="6" height="10" rx="2" fill="#24324a"/>' +
    [-46, -32, -6, 8, 32, 48].map(x => `<circle cx="${x}" cy="15" r="6" fill="#24324a"/><circle cx="${x}" cy="15" r="2.4" fill="#ffffff"/>`).join('')),
  pillow: thSvg('-40 -20 80 36', '<path d="M-34 4 Q-40 -14 -22 -14 Q-12 -22 2 -16 Q16 -22 26 -12 Q40 -10 34 6 Q28 16 0 14 Q-28 16 -34 4Z" fill="#ffffff"/><ellipse cx="-10" cy="-6" rx="8" ry="3" fill="#eef6ff"/>'),
  sheep: thSvg('-26 -22 52 40', '<g fill="#ffffff"><circle cx="-10" cy="-4" r="10"/><circle cx="6" cy="-8" r="11"/><circle cx="14" cy="4" r="9"/><circle cx="-4" cy="6" r="10"/></g><rect x="-10" y="12" width="5" height="8" rx="2" fill="#24324a"/><rect x="6" y="12" width="5" height="8" rx="2" fill="#24324a"/><ellipse cx="-20" cy="0" rx="7" ry="8" fill="#5a5470"/><circle cx="-22" cy="-2" r="1.4" fill="#fff"/>'),
  coral: thSvg('-26 -34 52 50', '<path d="M0 14 V-6 M0 -2 L-12 -16 M0 -6 L10 -22 M-12 -16 L-18 -28 M-12 -16 L-6 -30 M10 -22 L18 -30" stroke="#ff8a8a" stroke-width="7" stroke-linecap="round" fill="none"/>'),
  seaweed: thSvg('-12 -40 24 56', '<path d="M0 14 Q-10 2 0 -10 Q10 -22 0 -36" stroke="#4fae5a" stroke-width="8" stroke-linecap="round" fill="none"/>'),
  turtle: thSvg('-40 -26 80 44', '<ellipse cx="0" cy="0" rx="28" ry="18" fill="#7cc06a"/><path d="M-14 -8 L0 -14 L14 -8 L14 6 L0 12 L-14 6Z" fill="#a8d88a"/><ellipse cx="34" cy="2" rx="9" ry="8" fill="#b8e0a0"/><circle cx="37" cy="0" r="1.8" fill="#24324a"/><path d="M33 6 Q37 8 40 6" stroke="#24324a" stroke-width="1.4" fill="none"/><path d="M-6 -24 Q0 -20 6 -24" stroke="#ffffff" stroke-width="2" fill="none"/><g fill="#7cc06a"><ellipse cx="-22" cy="16" rx="8" ry="4"/><ellipse cx="20" cy="16" rx="8" ry="4"/></g>'),
  octopus: thSvg('-34 -30 68 56', '<g fill="#ff9ec0">' + [-24, -14, -4, 6, 16, 26].map((x, i) => `<path d="M${x} 6 Q${x + (i % 2 ? 6 : -6)} 18 ${x + (i % 2 ? -2 : 2)} 24" stroke="#ff9ec0" stroke-width="6" stroke-linecap="round" fill="none"/>`).join('') + '<ellipse cx="0" cy="-6" rx="24" ry="20"/></g>' + thEye(-8, -6) + thEye(8, -6) + thSmile(3)),
  whale: thSvg('-60 -30 120 54', '<path d="M-50 4 Q-50 -24 -10 -24 Q30 -24 40 0 Q46 -10 56 -14 Q52 2 56 18 Q44 12 38 8 Q20 22 -20 20 Q-50 18 -50 4Z" fill="#7fb8f0"/><path d="M-44 8 Q-10 20 30 8" fill="#d4ecff"/>' + thEye(-26, -6, 1.2) + '<path d="M-36 4 Q-30 8 -24 4" stroke="#24324a" stroke-width="2" fill="none"/>'),
  jelly: thSvg('-20 -24 40 44', '<path d="M-16 0 Q-16 -20 0 -20 Q16 -20 16 0Z" fill="#e6c8ff"/>' + [-10, -3, 4, 11].map(x => `<path d="M${x} 0 Q${x - 4} 8 ${x} 16" stroke="#e6c8ff" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + thEye(-5, -8, .7) + thEye(5, -8, .7)),
  jellyGlow: '<svg viewBox="-30 -34 60 64" aria-hidden="true"><circle cx="0" cy="-8" r="26" fill="#fff6a0" opacity=".45"/></svg>',
  candyCotton: thSvg('-18 -30 36 46', '<path d="M0 14 V-4" stroke="#c98a4a" stroke-width="3"/><g fill="#ffc8de"><circle cx="-6" cy="-14" r="10"/><circle cx="6" cy="-16" r="10"/><circle cx="0" cy="-24" r="8"/><circle cx="0" cy="-8" r="8"/></g>'),
  rain: '<svg viewBox="-30 -10 60 30" aria-hidden="true"><g stroke="#8fc8ff" stroke-width="2.6" stroke-linecap="round">' + [-20, -8, 4, 16].map((x, i) => `<path d="M${x} ${i % 2 * 4} l-3 9"/>`).join('') + '</g></svg>',
  candyStar: thSvg('-12 -12 24 24', '<path d="M0 -10 L3 -3 L10 -3 L4.5 2 L6.5 9.5 L0 5 L-6.5 9.5 L-4.5 2 L-10 -3 L-3 -3Z" fill="#ffb3d9"/>'),
  bell: thSvg('-16 -20 32 34', '<path d="M-12 8 Q-12 -14 0 -14 Q12 -14 12 8Z" fill="#ffd54a"/><rect x="-14" y="6" width="28" height="5" rx="2.5" fill="#e0a100"/><circle cy="13" r="3" fill="#e0a100"/>'),
  kite: thSvg('-20 -24 40 60', '<path d="M0 -22 L16 -2 L0 18 L-16 -2Z" fill="#ff8a8a"/><path d="M0 -22 V18 M-16 -2 H16" stroke="#ffffff" stroke-width="2"/><path d="M0 18 Q6 24 0 30 Q-6 34 0 38" stroke="#24324a" stroke-width="1.6" fill="none"/>'),
  windFace: thSvg('-30 -18 60 36', '<path d="M-24 4 Q-28 -12 -12 -12 Q-4 -18 8 -12 Q22 -14 22 0 Q28 8 16 12 H-18 Q-28 12 -24 4Z" fill="#e6f7ff"/>' + thEye(-6, -2, .8) + thEye(6, -2, .8) + '<circle cx="16" cy="4" r="3" fill="#8a2346"/>'),
  bee: thSvg('-18 -16 36 30', '<ellipse cx="-4" cy="-10" rx="7" ry="5" fill="#e6f7ff"/><ellipse cx="6" cy="-10" rx="7" ry="5" fill="#e6f7ff"/><ellipse cx="0" cy="2" rx="13" ry="10" fill="#ffd54a"/><path d="M-4 -7 V11 M4 -7 V11" stroke="#24324a" stroke-width="3"/>' + thEye(8, 0, .6)),
  honey: thSvg('-18 -20 36 36', '<path d="M-12 -8 Q-14 14 0 14 Q14 14 12 -8Z" fill="#ffb347"/><rect x="-13" y="-14" width="26" height="7" rx="3" fill="#e08a2a"/><path d="M-8 -7 Q-6 2 -4 -7" fill="#ffd27a"/>'),
  seed: thSvg('-8 -8 16 16', '<ellipse rx="5" ry="6.5" fill="#c98a4a"/>', 2),
  sprout: thSvg('-14 -24 28 34', '<path d="M0 10 V-8" stroke="#5cb04a" stroke-width="3"/><ellipse cx="-6" cy="-12" rx="7" ry="4" fill="#7fd36a" transform="rotate(-30 -6 -12)"/><ellipse cx="6" cy="-14" rx="7" ry="4" fill="#7fd36a" transform="rotate(30 6 -14)"/>'),
  snail: thSvg('-26 -22 52 36', '<path d="M-24 10 H18 Q24 10 22 4 L16 -4 Q12 -8 8 -4 V4 H-24Z" fill="#ffe0b0"/><circle cx="-4" cy="-4" r="12" fill="#c98a4a"/><path d="M-4 -4 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M14 -6 L12 -16 M18 -6 L20 -16" stroke="#24324a" stroke-width="1.6"/>'),
  ladybug: thSvg('-16 -14 32 26', '<circle cx="12" cy="0" r="6" fill="#24324a"/><ellipse cx="0" cy="0" rx="12" ry="10" fill="#ff5d5d"/><path d="M0 -10 V10" stroke="#24324a" stroke-width="1.6"/><g fill="#24324a"><circle cx="-6" cy="-4" r="2"/><circle cx="5" cy="4" r="2"/><circle cx="-4" cy="5" r="1.6"/></g>'),
  dandelion: thSvg('-16 -34 32 48', '<path d="M0 14 V-12" stroke="#5cb04a" stroke-width="2.6"/><circle cy="-20" r="12" fill="#ffffff"/><g stroke="#e0e8f0" stroke-width="1">' + Array.from({ length:8 }, (_, i) => `<path d="M0 -20 l${(Math.cos(i * .785) * 11).toFixed(1)} ${(Math.sin(i * .785) * 11).toFixed(1)}"/>`).join('') + '</g>'),
  web: '<svg viewBox="-30 -30 60 60" aria-hidden="true"><g stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".9">' + [0, 45, 90, 135].map(a => `<path transform="rotate(${a})" d="M-26 0 H26"/>`).join('') + '<circle r="8"/><circle r="16"/><circle r="24"/></g><g fill="#bfe8ff"><circle cx="16" cy="0" r="2.4"/><circle cx="-8" cy="14" r="2"/><circle cx="0" cy="-24" r="2.4"/></g></svg>',
  teacup: thSvg('-18 -14 36 26', '<path d="M-12 -6 H12 Q12 10 0 10 Q-12 10 -12 -6Z" fill="#ffffff"/><path d="M12 -2 Q20 -2 18 4 Q16 8 11 6" stroke="#24324a" stroke-width="2" fill="none"/><ellipse cy="-6" rx="12" ry="3" fill="#ffb3c7"/><ellipse cy="12" rx="16" ry="3" fill="#ffd6e6"/>'),
  firefly: '<svg viewBox="-14 -14 28 28" aria-hidden="true"><circle r="12" fill="#fff6a0" opacity=".45"/><circle r="4" fill="#fff6a0" stroke="#24324a" stroke-width="1.4"/></svg>',
  gift: thSvg('-18 -20 36 36', '<rect x="-14" y="-6" width="28" height="20" rx="3" fill="#ff7aa8"/><rect x="-16" y="-12" width="32" height="8" rx="3" fill="#ff9ec0"/><rect x="-3" y="-12" width="6" height="26" fill="#ffd54a"/><path d="M0 -12 Q-10 -22 -10 -14 Q-8 -10 0 -12 Q10 -22 10 -14 Q8 -10 0 -12" fill="#ffd54a"/>'),
  soup: thSvg('-24 -18 48 32', '<path d="M-20 -4 H20 Q18 14 0 14 Q-18 14 -20 -4Z" fill="#f2fbff"/><ellipse cy="-4" rx="20" ry="6" fill="#fff3d6"/><g fill="#ffffff"><ellipse cx="-8" cy="-5" rx="5" ry="2.4"/><ellipse cx="4" cy="-4" rx="5" ry="2.4"/></g><path d="M-6 -14 Q-4 -10 -6 -8 M4 -16 Q6 -12 4 -10" stroke="#cfe3f0" stroke-width="2" fill="none"/>'),
  lunchbox: thSvg('-26 -16 52 30', '<rect x="-22" y="-10" width="44" height="22" rx="5" fill="#8fd3ff"/><rect x="-18" y="-6" width="16" height="14" rx="3" fill="#ffffff"/><circle cx="6" cy="0" r="5" fill="#ff5d5d"/><circle cx="16" cy="2" r="4" fill="#7fd36a"/><ellipse cx="-10" cy="1" rx="5" ry="4" fill="#ffe680"/>'),
  pumpkin: thSvg('-20 -20 40 36', '<path d="M0 -12 V-18" stroke="#5cb04a" stroke-width="3"/><g fill="#ffa040"><ellipse cx="-8" cy="2" rx="9" ry="12"/><ellipse cx="8" cy="2" rx="9" ry="12"/><ellipse cx="0" cy="2" rx="9" ry="13"/></g><path d="M-7 -1 L-3 2 L-7 4Z M7 -1 L3 2 L7 4Z" fill="#24324a"/><path d="M-6 8 Q0 12 6 8" stroke="#24324a" stroke-width="2" fill="none"/>'),
  snowflake: '<svg viewBox="-10 -10 20 20" aria-hidden="true"><g stroke="#9cc8ea" stroke-width="4" stroke-linecap="round">' + [0, 60, 120].map(a => `<path transform="rotate(${a})" d="M0 -8 V8"/>`).join('') + '</g><g stroke="#ffffff" stroke-width="2" stroke-linecap="round">' + [0, 60, 120].map(a => `<path transform="rotate(${a})" d="M0 -8 V8"/>`).join('') + '</g></svg>',
  snowman: thSvg('-20 -32 40 52', '<circle cy="8" r="13" fill="#ffffff"/><circle cy="-14" r="9" fill="#ffffff"/><circle cx="-3" cy="-16" r="1.4" fill="#24324a"/><circle cx="3" cy="-16" r="1.4" fill="#24324a"/><path d="M0 -13 L7 -11 L0 -11Z" fill="#ffa040"/><path d="M-9 -6 Q0 -2 9 -6" stroke="#ff5d5d" stroke-width="3" fill="none"/>'),
  tree: thSvg('-26 -44 52 62', '<rect x="-4" y="6" width="8" height="10" fill="#a8703c"/><path d="M0 -40 L18 -14 H10 L22 6 H-22 L-10 -14 H-18Z" fill="#5cb86a"/><path d="M0 -46 L2 -41 L7 -41 L3 -38 L4.6 -33 L0 -36 L-4.6 -33 L-3 -38 L-7 -41 L-2 -41Z" fill="#ffd54a"/><g fill="#ff7aa8"><circle cx="-6" cy="-14" r="2.4"/><circle cx="8" cy="-4" r="2.4"/><circle cx="-10" cy="0" r="2.4"/></g>'),
  firework: '<svg viewBox="-30 -30 60 60" aria-hidden="true"><g stroke-width="3" stroke-linecap="round">' + Array.from({ length:12 }, (_, i) => `<path transform="rotate(${i * 30})" d="M0 -8 V-24" stroke="${['#ffd54a', '#ff7aa8', '#8fd3ff'][i % 3]}"/>`).join('') + '</g></svg>',
  caramel: thSvg('-14 -12 28 22', '<rect x="-10" y="-8" width="20" height="16" rx="4" fill="#d9924a"/><path d="M-10 0 Q-14 8 -10 12 M8 8 Q10 14 6 16" stroke="#d9924a" stroke-width="3" fill="none" stroke-linecap="round"/>'),
  milk: thSvg('-14 -24 28 40', '<path d="M-10 -10 L-6 -20 H6 L10 -10 V14 H-10Z" fill="#ffffff"/><rect x="-10" y="-4" width="20" height="10" fill="#8fd3ff"/><path d="M-4 -2 Q0 -6 4 -2 Q0 4 -4 -2Z" fill="#ffffff"/>'),
  water: thSvg('-12 -26 24 42', '<rect x="-4" y="-24" width="8" height="5" rx="2" fill="#4fae5a"/><path d="M-8 -18 H8 V12 Q8 15 4 15 H-4 Q-8 15 -8 12Z" fill="#cdeefc"/><rect x="-8" y="-6" width="16" height="10" fill="#8fd3ff"/>'),
  cookie: thSvg('-14 -14 28 28', '<circle r="11" fill="#e0b070"/><g fill="#8a5a32"><circle cx="-4" cy="-3" r="2"/><circle cx="4" cy="2" r="2"/><circle cx="-2" cy="5" r="1.6"/><circle cx="5" cy="-5" r="1.4"/></g>'),
  crumb: thSvg('-6 -6 12 12', '<path d="M-4 2 L-2 -4 L4 -3 L3 3Z" fill="#e0b070"/>', 2),
  carrot: thSvg('-12 -24 24 40', '<path d="M-6 -12 Q0 22 0 14 Q0 22 6 -12Z" fill="#ffa040"/><path d="M0 -12 L-6 -22 M0 -12 L0 -24 M0 -12 L6 -22" stroke="#5cb04a" stroke-width="3" stroke-linecap="round"/>'),
  broccoli: thSvg('-16 -22 32 38', '<rect x="-4" y="0" width="8" height="14" rx="3" fill="#a8d88a"/><g fill="#5cb86a"><circle cx="-8" cy="-6" r="8"/><circle cx="8" cy="-6" r="8"/><circle cx="0" cy="-12" r="9"/></g>'),
  clock: thSvg('-18 -20 36 38', '<circle cx="-10" cy="-14" r="5" fill="#ffd54a"/><circle cx="10" cy="-14" r="5" fill="#ffd54a"/><circle r="15" fill="#ffffff"/><path d="M0 0 V-9 M0 0 L7 3" stroke="#24324a" stroke-width="2.4" stroke-linecap="round"/>'),
  cheese: thSvg('-18 -14 36 26', '<path d="M-16 10 V-2 L14 -10 L16 10Z" fill="#ffd54a"/><g fill="#f0b830"><circle cx="-6" cy="3" r="2.6"/><circle cx="6" cy="-1" r="2"/><circle cx="8" cy="6" r="1.6"/></g>'),
  soda: thSvg('-12 -22 24 38', '<rect x="-9" y="-18" width="18" height="32" rx="4" fill="#ff8a8a"/><rect x="-9" y="-6" width="18" height="10" fill="#ffffff"/><rect x="-6" y="-21" width="12" height="4" rx="2" fill="#c8c8d4"/>'),
  fizz: '<svg viewBox="-20 -30 40 40" aria-hidden="true"><g fill="#ffffff" stroke="#8fd3ff" stroke-width="1.4">' + [[-8, -6, 3], [4, -14, 4], [-2, -24, 2.4], [10, -4, 2.6], [-12, -18, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + '</g></svg>',
  chefHat: thSvg('-18 -22 36 32', '<rect x="-12" y="0" width="24" height="8" rx="2" fill="#ffffff"/><g fill="#ffffff"><circle cx="-8" cy="-8" r="8"/><circle cx="8" cy="-8" r="8"/><circle cx="0" cy="-14" r="9"/></g>'),
  book: thSvg('-24 -18 48 32', '<path d="M0 -12 Q-12 -16 -22 -12 V12 Q-12 8 0 12Z" fill="#ffd6e6"/><path d="M0 -12 Q12 -16 22 -12 V12 Q12 8 0 12Z" fill="#d4ecff"/><path d="M0 -12 V12" stroke="#24324a" stroke-width="1.6"/>'),
  pencil: thSvg('-24 -8 48 16', '<rect x="-20" y="-4" width="32" height="8" fill="#ffd54a"/><path d="M12 -4 L20 0 L12 4Z" fill="#f2d8b0"/><rect x="-24" y="-4" width="5" height="8" rx="1" fill="#ff9ec0"/>'),
  lantern: thSvg('-14 -22 28 38', '<rect x="-2" y="-20" width="4" height="6" fill="#24324a"/><rect x="-10" y="-14" width="20" height="26" rx="8" fill="#ffd27a"/><circle cy="0" r="5" fill="#fff6c0"/>'),
  balloon: thSvg('-12 -22 24 44', '<ellipse cy="-8" rx="10" ry="12" fill="#ff7aa8"/><path d="M0 4 Q4 12 0 20" stroke="#9aa8bd" stroke-width="1.4" fill="none"/>'),
  flagParade: thSvg('-14 -30 28 44', '<rect x="-12" y="-28" width="3" height="40" fill="#a8703c"/><path d="M-9 -28 H12 L6 -20 L12 -12 H-9Z" fill="#8fd3ff"/>'),
  seesaw: thSvg('-50 -14 100 26', '<path d="M-4 10 L0 -2 L4 10Z" fill="#a8703c"/><rect x="-46" y="-6" width="92" height="6" rx="3" fill="#ffd27a" transform="rotate(-8)"/>'),
  slide: thSvg('-40 -40 80 56', '<path d="M-30 14 V-30 H-18 V14" fill="none" stroke="#9aa8bd" stroke-width="4"/><path d="M-18 -28 Q10 -26 34 14" stroke="#ff9ec0" stroke-width="9" fill="none" stroke-linecap="round"/>'),
  photo: thSvg('-22 -18 44 34', '<rect x="-20" y="-16" width="40" height="30" rx="3" fill="#ffffff"/><rect x="-16" y="-12" width="32" height="18" fill="#bfe3f7"/><circle cx="-6" cy="-4" r="4" fill="#ffe680"/>'),
  album: thSvg('-26 -20 52 36', '<rect x="-24" y="-18" width="48" height="34" rx="4" fill="#ff9ec0"/><rect x="-18" y="-12" width="16" height="12" fill="#ffffff"/><rect x="2" y="-12" width="16" height="12" fill="#ffffff"/><path d="M0 -18 V16" stroke="#e06a90" stroke-width="2"/>'),
  medal: thSvg('-14 -24 28 40', '<path d="M-8 -22 L0 -6 L8 -22" stroke="#8fd3ff" stroke-width="5" fill="none"/><circle cy="4" r="10" fill="#ffd54a"/><path d="M0 -2 L2 2 L6 2.4 L3 5 L4 9 L0 7 L-4 9 L-3 5 L-6 2.4 L-2 2Z" fill="#ffffff"/>'),
  rabbit: thSvg('-20 -30 40 50', '<ellipse cx="-6" cy="-18" rx="4" ry="11" fill="#ffffff"/><ellipse cx="6" cy="-18" rx="4" ry="11" fill="#ffffff"/><ellipse cx="-6" cy="-18" rx="2" ry="7" fill="#ffc8de"/><ellipse cx="6" cy="-18" rx="2" ry="7" fill="#ffc8de"/><ellipse cy="6" rx="15" ry="13" fill="#ffffff"/>' + thEye(-5, 3, .7) + thEye(5, 3, .7) + '<path d="M-2 9 Q0 11 2 9" stroke="#24324a" stroke-width="1.6" fill="none"/>' + thCheeks(8, 10)),
  songpyeon: thSvg('-22 -12 44 22', '<path d="M-20 6 Q-20 -8 -8 -8 Q-2 -8 -2 6Z" fill="#c8f0c0"/><path d="M0 6 Q0 -8 10 -8 Q20 -8 20 6Z" fill="#ffd6e6"/><ellipse cx="0" cy="8" rx="20" ry="2" fill="#e0e8f0"/>'),
  icecream: thSvg('-14 -26 28 42', '<path d="M-9 -2 L0 16 L9 -2Z" fill="#e8b878"/><path d="M-6 2 L4 2 M-4 7 L3 7" stroke="#c98a4a" stroke-width="1.4"/><circle cx="0" cy="-10" r="10" fill="#ffc8de"/><circle cx="-4" cy="-14" r="2" fill="#ffffff"/>'),
  sock: thSvg('-16 -22 32 40', '<path d="M-8 -18 H8 V6 Q14 6 14 12 Q14 16 6 16 H-4 Q-10 16 -8 8Z" fill="#ff5d5d"/><rect x="-8" y="-20" width="16" height="7" rx="2" fill="#ffffff"/>'),
  butterfly: thSvg('-22 -18 44 34', '<ellipse cx="-10" cy="-6" rx="10" ry="9" fill="#ffd27a"/><ellipse cx="10" cy="-6" rx="10" ry="9" fill="#ffd27a"/><ellipse cx="-8" cy="8" rx="7" ry="6" fill="#ffb3c7"/><ellipse cx="8" cy="8" rx="7" ry="6" fill="#ffb3c7"/><rect x="-2" y="-12" width="4" height="24" rx="2" fill="#24324a"/><path d="M-1 -12 L-5 -18 M1 -12 L5 -18" stroke="#24324a" stroke-width="1.4"/>'),
  butterflyPlain: thSvg('-22 -18 44 34', '<ellipse cx="-10" cy="-6" rx="10" ry="9" fill="#ffffff"/><ellipse cx="10" cy="-6" rx="10" ry="9" fill="#ffffff"/><ellipse cx="-8" cy="8" rx="7" ry="6" fill="#ffffff"/><ellipse cx="8" cy="8" rx="7" ry="6" fill="#ffffff"/><rect x="-2" y="-12" width="4" height="24" rx="2" fill="#24324a"/>'),
  brushPaint: thSvg('-6 -22 12 40', '<rect x="-2" y="-6" width="4" height="22" rx="2" fill="#c98a4a"/><path d="M-3 -6 Q0 -22 3 -6Z" fill="#ff8fb4"/>')
};
