'use strict';

/* =========================================================
   14. 양치 타이머 (양치 화면은 C 클로즈업 하나)
      의도: 2~3분을 지루하지 않게 → 구역 4곳을 차례로(위 왼쪽 → 위 오른쪽 → 아래 오른쪽 → 아래 왼쪽),
            구역 안에서도 바깥 · 씹는 면 · 안쪽을 surfSplit 비율로 안내, 세균이 팡팡 터지고 콤보 · 황금 세균,
            마지막 10초 오늘의 대장 세균(아침 · 저녁마다 바뀜 → 다음 대장 예고로 다음 양치를 기대하게)
      A·B 화면은 v0.20.1 에서 없앰 (C 하나만 다듬기로 함). 흐름은 맨 위 개발 안내 [7]
      끝까지 닦아야 보상 (중간에 그만두면 기록 · 별 없음). 화면을 벗어나면 자동 일시 정지
   ========================================================= */
const ZONES = ['ul', 'ur', 'lr', 'll'];
const SURF = ['outer', 'chew', 'inner', 'front'];
/* 구역 안 구간 (v0.26): 0 바깥쪽 · 1 씹는 면 · 2 어금니 안쪽 · 3 보스 기습(씹는 면 한 번 더) · 4 앞니 안쪽
   의도: 사용자 제안 "보스가 일찍 나와서 어금니를 더 닦게". 순서는 그대로 두고, 같은 구역 어금니로만 돌아감 (치과 권장: 늘 같은 순서)
   전에 쓰던 4구간 설정(resources.js surfSplit 5개 값)도 받아서 기습 구간을 끼워 넣음 */
const RAID_ON = CONFIG.raid !== false;
const SURF_CUT = (() => {
  const c = CONFIG.surfSplit || [];
  let cut = c.length === 6 ? c.slice() : c.length === 5 ? (() => { const r = .14, k = 1 - r; return [0, c[1] * k, c[2] * k, c[3] * k, c[3] * k + r, 1]; })() : [0, .27, .6, .73, .87, 1];
  if (!RAID_ON) cut = [0, cut[1] / (1 - (cut[4] - cut[3])), cut[2] / (1 - (cut[4] - cut[3])), cut[3] / (1 - (cut[4] - cut[3])), cut[3] / (1 - (cut[4] - cut[3])), 1];
  return cut;
})();
const SEG_SURF = [0, 1, 2, 1, 3];    // 구간 → 보이는 면 (기습 구간은 씹는 면 모습)
let surfIdx = 0, segIdx = 0;

let running = false, paused = false, startAt = 0, banked = 0;
let zoneIdx = -1, hurrySaid = false;
let raf = 0, pauseCount = 0;
let view = null, bchar = null, els = {};

const elapsed = () => banked + (running && !paused ? (performance.now() - startAt) / 1000 : 0);
const fmt = (s) => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

// 말풍선 + 목소리
function say(key, text, speak = true){
  const el = els.say; if (!el) return;
  const msg = text !== undefined ? text : t(key);
  el.textContent = msg; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  if (speak) Voice.play(key, msg);
}
function cheerLine(){
  const pool = tList('say.cheers').map(s => ['say.cheers', s]);
  const ev = activeEvent();
  if (ev){ const k = 'event.' + ev.id + '.cheer', s = lookup(k); if (s) pool.push([k, s], [k, s]); }
  const nm = store.get('kidName', '');
  if (nm) tList('say.cheersName').forEach(x => pool.push(['say.cheers', format(x, { name:nm })]));   // 이름 불러주기
  return pick(pool);
}

function setZone(i){
  zoneIdx = i;
  const z = ZONES[i];
  els.zoneName.textContent = t('zone.' + z);
  bchar.el.classList.remove('z-ul', 'z-ur', 'z-lr', 'z-ll');
  bchar.el.classList.add('z-' + z);
  view.dataset.gz = z;                         // 이 구역 세균만 꿈틀꿈틀
  surfIdx = 0; segIdx = 0; CScene.setZone(i); cLabel();
  say('say.' + z, i === 0 ? t(isWeekend() ? 'greet.we' : 'greet.' + slotOf()) + ' ' + callName() + t('say.' + z) : undefined);
  if (i > 0){ sfx.zone(); buzz([120, 80, 120]); }
}

/* ---------- 양치 화면 C: 클로즈업 장면 ----------
   좌표: 입 중심 (500,360), 입안 타원 390×210. 거울 기준(화면 왼쪽 = 아이 왼쪽)
   칫솔 자세는 오른쪽 기준 [x, y, 회전, 가로배율, 세로배율] → 왼쪽은 좌우 반전 */
// v0.41.0 양치 장면(입 · 이 · 세균 그림)은 앱을 열 때가 아니라 처음 양치할 때 만듦 (느린 폰에서 시작이 빨라지게)
function makeCScene(){
  const svg = $('#cScene');
  const CX = 500, CY = 360, IRX = 390, IRY = 170;
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // 입 모양: 모서리가 둥근 넓은 상자 (어금니 쪽도 높이가 유지되게)
  const RCX = 130, RCY = 110;
  const half = (x) => {
    const dx = Math.abs(x - CX) - (IRX - RCX);
    if (dx <= 0) return IRY;
    return (IRY - RCY) + RCY * Math.sqrt(Math.max(0, 1 - (dx / RCX) ** 2));
  };
  const box = (pad, rxa, rya, attrs) => `<rect x="${CX - IRX - pad}" y="${CY - IRY - pad}" width="${(IRX + pad) * 2}" height="${(IRY + pad) * 2}" rx="${RCX + rxa}" ry="${RCY + rya}" ${attrs}/>`;

  /* 유치 기준 (위아래 각 10개). 한쪽: 가운데 앞니 → 옆 앞니 → 송곳니 → 첫째 어금니 → 둘째 어금니
     type: i 앞니, c 송곳니, m 어금니 / hu·hl: 위·아래 이빨이 보이는 길이 */
  const SPEC = [
    { type:'i', w:62, hu:104, hl:82 }, { type:'i', w:54, hu:98, hl:78 }, { type:'c', w:58, hu:108, hl:86 },
    { type:'m', w:84, hu:88, hl:76 }, { type:'m', w:80, hu:82, hl:72 }
  ];
  const TEETH = [];
  { let xr = CX + 2;
    SPEC.forEach((sp, k) => {
      TEETH.push(Object.assign({ k, side:'r', x:xr, cx:xr + sp.w / 2 }, sp));
      const xl = 2 * CX - xr - sp.w;
      TEETH.push(Object.assign({ k, side:'l', x:xl, cx:xl + sp.w / 2 }, sp));
      xr += sp.w + 4;
    });
    TEETH.sort((a, b) => a.x - b.x);
  }
  const f1 = (n) => n.toFixed(1);
  const teeth = { ul:'', ur:'', ll:'', lr:'' };
  const toothPts = [];
  // 귀여운 얼굴: 울상(m-sad, 땀방울) ↔ 웃는 얼굴(m-happy). 그 이빨의 더러움이 다 사라지면 .happy
  function face(cx, cy, w){
    const ex = Math.min(w * .2, 13), s = w < 60 ? .85 : 1;
    return `<g class="fc">
        <g class="m-sad">
          <circle class="eye" cx="${f1(cx - ex)}" cy="${f1(cy - 2)}" r="${f1(3.6 * s)}"/><circle class="eye" cx="${f1(cx + ex)}" cy="${f1(cy - 2)}" r="${f1(3.6 * s)}"/>
          <path class="lid" d="M${f1(cx - ex - 5 * s)} ${f1(cy - 7)} L${f1(cx - ex + 4 * s)} ${f1(cy - 10.5)} M${f1(cx + ex + 5 * s)} ${f1(cy - 7)} L${f1(cx + ex - 4 * s)} ${f1(cy - 10.5)}"/>
          <path class="mouth" d="M${f1(cx - 5 * s)} ${f1(cy + 8)} Q${f1(cx)} ${f1(cy + 3)} ${f1(cx + 5 * s)} ${f1(cy + 8)}"/>
          <path class="sweat" d="M${f1(cx + ex + 9 * s)} ${f1(cy - 10)} q3 5 0 7 q-3 -2 0 -7Z"/>
        </g>
        <g class="m-happy">
          <path class="lid" d="M${f1(cx - ex - 4 * s)} ${f1(cy - 1)} Q${f1(cx - ex)} ${f1(cy - 7)} ${f1(cx - ex + 4 * s)} ${f1(cy - 1)} M${f1(cx + ex - 4 * s)} ${f1(cy - 1)} Q${f1(cx + ex)} ${f1(cy - 7)} ${f1(cx + ex + 4 * s)} ${f1(cy - 1)}"/>
          <path class="mouth" d="M${f1(cx - 6 * s)} ${f1(cy + 4)} Q${f1(cx)} ${f1(cy + 12)} ${f1(cx + 6 * s)} ${f1(cy + 4)}"/>
        </g>
        <ellipse class="cheek" cx="${f1(cx - ex - 3)}" cy="${f1(cy + 6)}" rx="${f1(4.5 * s)}" ry="${f1(2.8 * s)}"/><ellipse class="cheek" cx="${f1(cx + ex + 3)}" cy="${f1(cy + 6)}" rx="${f1(4.5 * s)}" ry="${f1(2.8 * s)}"/>
      </g>`;
  }
  TEETH.forEach(tt => {
    const { x, w, cx, type } = tt, top = CY - half(cx), bot = CY + half(cx);
    teeth['u' + tt.side] += `<g class="tooth" data-t="u${tt.side}${tt.k}">`;
    teeth['l' + tt.side] += `<g class="tooth" data-t="l${tt.side}${tt.k}">`;
    // 위 이빨
    const yU = top - 30, hU = tt.hu + 30, eU = yU + hU;
    if (type === 'c') teeth['u' + tt.side] += `<path class="tf" d="M${f1(x)} ${f1(yU)} H${f1(x + w)} V${f1(eU - 18)} Q${f1(x + w)} ${f1(eU - 6)} ${f1(cx)} ${f1(eU + 4)} Q${f1(x)} ${f1(eU - 6)} ${f1(x)} ${f1(eU - 18)}Z"/>`;
    else teeth['u' + tt.side] += `<rect class="tf" x="${f1(x)}" y="${f1(yU)}" width="${w}" height="${hU}" rx="${type === 'm' ? 24 : 26}"/>`;
    if (type === 'm'){
      const oy = eU - 8;
      teeth['u' + tt.side] += `<ellipse class="oc" cx="${f1(cx)}" cy="${f1(oy)}" rx="${f1(w / 2 - 6)}" ry="9"/>` +
        `<path class="groove" d="M${f1(cx - w * .28)} ${f1(oy)} Q${f1(cx - w * .12)} ${f1(oy + 5)} ${f1(cx)} ${f1(oy)} Q${f1(cx + w * .12)} ${f1(oy + 5)} ${f1(cx + w * .28)} ${f1(oy)}"/>`;
    }
    { const v0 = top + 30, v1 = type === 'm' ? eU - 17 : eU, fy = (v0 + v1) / 2 + 2;   // 잇몸 아래 ~ 이 끝 사이 가운데
      teeth['u' + tt.side] += `<path class="gloss" d="M${f1(x + 9)} ${f1(fy - 4)} Q${f1(x + 9)} ${f1(fy - 14)} ${f1(x + 16)} ${f1(fy - 17)}"/>` + face(cx, fy, w) + '</g>'; }
    // 아래 이빨
    const yL = bot - tt.hl, hL = tt.hl + 30;
    if (type === 'c') teeth['l' + tt.side] += `<path class="tf" d="M${f1(x)} ${f1(yL + hL)} H${f1(x + w)} V${f1(yL + 18)} Q${f1(x + w)} ${f1(yL + 6)} ${f1(cx)} ${f1(yL - 4)} Q${f1(x)} ${f1(yL + 6)} ${f1(x)} ${f1(yL + 18)}Z"/>`;
    else teeth['l' + tt.side] += `<rect class="tf" x="${f1(x)}" y="${f1(yL)}" width="${w}" height="${hL}" rx="${type === 'm' ? 24 : 26}"/>`;
    if (type === 'm'){
      const oy = yL + 9;
      teeth['l' + tt.side] += `<ellipse class="oc" cx="${f1(cx)}" cy="${f1(oy)}" rx="${f1(w / 2 - 6)}" ry="10"/>` +
        `<path class="groove" d="M${f1(cx - w * .28)} ${f1(oy)} Q${f1(cx - w * .12)} ${f1(oy - 5)} ${f1(cx)} ${f1(oy)} Q${f1(cx + w * .12)} ${f1(oy - 5)} ${f1(cx + w * .28)} ${f1(oy)}"/>`;
    }
    { const v0 = type === 'm' ? yL + 19 : yL, v1 = bot - 30, fy = (v0 + v1) / 2;
      teeth['l' + tt.side] += `<path class="gloss" d="M${f1(x + 9)} ${f1(fy + 2)} Q${f1(x + 9)} ${f1(fy - 8)} ${f1(x + 16)} ${f1(fy - 11)}"/>` + face(cx, fy, w) + '</g>'; }
    toothPts.push([cx, top + 30], [cx, bot - 24]);
  });
  const zoneG = (cls) => Object.entries(teeth).map(([k, v]) => `<g class="${cls}" data-z="${k}">${v}</g>`).join('');

  let foam = '', foamThr = [], foamZone = [];
  function bub(x, y, r, thr, zi = -1){
    foamThr.push(thr); foamZone.push(zi);
    // 거품은 HTML 원 (따로 된 층이라 생기고 사라질 때 입 그림을 다시 그리지 않음). 1em = 그림 1단위
    foam += `<i class="fb" style="left:${(x - r + 60).toFixed(1)}em;top:${(y - r - 40).toFixed(1)}em;width:${(r * 2).toFixed(1)}em;height:${(r * 2).toFixed(1)}em"></i>`;
  }
  for (let k = 0; k < 46; k++){
    const a = k / 46 * Math.PI * 2, j = 1 + (rand() - .5) * .1;
    bub(CX + 440 * Math.cos(a) * j, CY + 256 * Math.sin(a) * j, 18 + rand() * 22, rand() * .92);
  }
  ['ul', 'ur', 'lr', 'll'].forEach((z, zi) => {
    for (let k = 0; k < 16; k++){
      const x = z[1] === 'l' ? 190 + rand() * 290 : 520 + rand() * 290;
      const y = z[0] === 'u' ? 150 + rand() * 150 : 430 + rand() * 140;
      bub(x, y, 10 + rand() * 18, (zi + .1 + rand() * .85) / 4, zi);
    }
  });
  const sparkles = toothPts.map(([x, y], i) =>
    `<path d="M${x} ${y - 22} L${x + 6} ${y - 6} L${x + 22} ${y} L${x + 6} ${y + 6} L${x} ${y + 22} L${x - 6} ${y + 6} L${x - 22} ${y} L${x - 6} ${y - 6}Z" fill="#fff" stroke="#ffd54a" stroke-width="3" style="animation-delay:${(i * .13 % 1).toFixed(2)}s"/>`).join('');

  /* 잇몸 + 더러움 — 아이 충치가 잘 생기는 곳 위주
     어금니 씹는 면 홈(fis): 씹는 면 / 어금니 사이·어금니~송곳니 사이 음식물(bit): 바깥쪽·안쪽 반반
     잇몸선 치석(plq): 모든 이빨, 어금니는 크게 / 이 사이 음식물: 모든 틈, 어금니 쪽은 크게 */
  const ZORD = ['ul', 'ur', 'lr', 'll'];
  const SURF_CUM = SURF_CUT;
  const gU = (x) => CY - half(x) + 8, gL = (x) => CY + half(x) - 8;
  function gumPath(row){
    const g = row === 'u' ? gU : gL, sg = row === 'u' ? 1 : -1, far = row === 'u' ? CY - 400 : CY + 400;
    const first = TEETH[0].x - 2;
    let d = `M100 ${far} L100 ${f1(g(first) + sg * 22)} L${f1(first)} ${f1(g(first) + sg * 22)}`;
    TEETH.forEach((tt, i) => {
      const xb = i < TEETH.length - 1 ? tt.x + tt.w + 2 : tt.x + tt.w + 2;
      d += ` Q${f1(tt.cx)} ${f1(g(tt.cx) - sg * 14)} ${f1(xb)} ${f1(g(xb) + sg * 22)}`;
    });
    return `<path d="${d} L900 ${f1(g(TEETH[TEETH.length - 1].x + TEETH[TEETH.length - 1].w) + sg * 22)} L900 ${far} Z" fill="#ff9db8" stroke="${OUTLINE_INK}" stroke-width="3"/>`;
  }
  const GUMS = gumPath('u') + gumPath('l');

  let dirt = '', dirtThr = [], dk = 0;
  const win = (z, sf) => {
    const zi = ZORD.indexOf(z), a = (zi + SURF_CUM[sf]) / 4, b = (zi + SURF_CUM[sf + 1]) / 4;
    return a + (b - a) * (.12 + rand() * .7);
  };
  // 바깥쪽은 칫솔이 어금니(SWEEP_FROM) → 앞니(SWEEP_TO)로 지나가는 순서대로 사라짐
  const SWEEP_FROM = 800, SWEEP_TO = 570;
  const sweepAt = (x) => Math.max(0, Math.min(1, (SWEEP_FROM - (x >= CX ? x : 1000 - x)) / (SWEEP_FROM - SWEEP_TO)));
  const winOuter = (z, x) => {
    const zi = ZORD.indexOf(z), a = (zi + SURF_CUM[0]) / 4, b = (zi + SURF_CUM[1]) / 4;
    return a + (b - a) * (.06 + .86 * sweepAt(x));
  };
  const FRONT_X = 130;     // 가운데에서 이 거리 안쪽 = 앞니·송곳니
  const popStar = (x, y, r) => `<path class="pop" d="M${f1(x)} ${f1(y - r)} L${f1(x + r * .3)} ${f1(y - r * .3)} L${f1(x + r)} ${f1(y)} L${f1(x + r * .3)} ${f1(y + r * .3)} L${f1(x)} ${f1(y + r)} L${f1(x - r * .3)} ${f1(y + r * .3)} L${f1(x - r)} ${f1(y)} L${f1(x - r * .3)} ${f1(y - r * .3)}Z" fill="#fff" stroke="#ffd54a" stroke-width="3"/>`;
  const dirtPos = [];
  const fisPos = { ul:[], ur:[], lr:[], ll:[] };     // 어금니 씹는 면 홈 자리 (보스 기습 세균 자리)
  let curTooth = '';
  const dirtTooth = [];
  function addDirt(inner, x, y, thr){ dirtThr.push(thr); dirtPos.push([x, y]); dirtTooth.push(curTooth); dirt += `<g class="dw" data-d="${dk++}"><g class="dirt">${inner}</g></g>`; }
  const BIT_COLORS = ['#6cc46a', '#b07a4f', '#ff7b7b'];
  let bitN = 0;
  ['u', 'l'].forEach(row => {
    const up = row === 'u';
    TEETH.forEach((tt, i) => {
      const { cx, w, type } = tt, z = row + tt.side;
      curTooth = row + tt.side + tt.k;
      // 잇몸선 치석
      const py = up ? gU(cx) + 12 : gL(cx) - 12, e = up ? -3 : 3;
      if (type === 'm'){
        addDirt(`<g class="plq"><circle cx="${f1(cx - 15)}" cy="${f1(py)}" r="11"/><circle cx="${f1(cx)}" cy="${f1(py + e)}" r="13.5"/><circle cx="${f1(cx + 15)}" cy="${f1(py)}" r="10.5"/>` +
                `<circle class="eye" cx="${f1(cx - 4)}" cy="${f1(py + e - 2)}" r="2.4"/><circle class="eye" cx="${f1(cx + 4)}" cy="${f1(py + e - 2)}" r="2.4"/></g>`, cx, py, winOuter(z, cx));
      } else {
        addDirt(`<g class="plq"><circle cx="${f1(cx - 6)}" cy="${f1(py)}" r="8"/><circle cx="${f1(cx + 7)}" cy="${f1(py + e)}" r="9"/></g>`, cx, py, winOuter(z, cx));
      }
      // 어금니 씹는 면 홈 속 찌꺼기 (2군데)
      if (type === 'm'){
        const top = CY - half(cx), bot = CY + half(cx);
        const oy = up ? top + tt.hu - 8 : bot - tt.hl + 9;
        [-1, 1].forEach(sd => {
          const fx = cx + sd * w * .16;
          fisPos[z].push([fx, oy]);
          addDirt(`<g class="fis"><circle cx="${f1(fx - 5)}" cy="${f1(oy)}" r="5.5"/><circle cx="${f1(fx + 4)}" cy="${f1(oy + (up ? 2 : -2))}" r="4.5"/><circle cx="${f1(fx + 1)}" cy="${f1(oy + (up ? -4 : 4))}" r="3.5"/></g>`, fx, oy, win(z, 1));
        });
      }
      // 이 사이 음식물: 모든 틈 (각 이빨의 가운데 쪽 틈. 가운데 앞니 사이는 한 번만)
      const nb = TEETH[tt.side === 'r' ? i - 1 : i + 1];
      const big = type === 'm';
      if (nb && !(tt.k === 0 && tt.side === 'l')){
        const xb = tt.side === 'r' ? tt.x - 2 : tt.x + w + 2;
        const by = up ? CY - half(xb) + 50 : CY + half(xb) - 40;
        const col = BIT_COLORS[bitN % 3], rot = (rand() * 30 - 15).toFixed(0);
        addDirt(`<g class="bit"><ellipse cx="${f1(xb)}" cy="${f1(by)}" rx="${big ? 8 : 6}" ry="${big ? 15 : 11}" fill="${col}" stroke="${OUTLINE_INK}" stroke-width="2.5" transform="rotate(${rot} ${f1(xb)} ${f1(by)})"/>` +
                `<ellipse cx="${f1(xb - 2)}" cy="${f1(by - 5)}" rx="2" ry="4" fill="#fff" opacity=".55"/></g>`, xb, by, Math.abs(xb - CX) < FRONT_X ? win(z, 4) : win(z, 2));
        bitN++;
      }
    });
  });

  const BRUSH = `
      <rect x="30" y="-16" width="247" height="32" rx="16" ${BF('bh')}/>
      ${bDeco(30, 277, 16)}
      <rect x="134" y="-16" width="14" height="32" ${BF('bs')}/><rect x="156" y="-16" width="14" height="32" ${BF('bs')}/>
      <rect x="30" y="-16" width="247" height="32" rx="16" fill="none" stroke="#0001" stroke-width="2"/>
      <rect x="36" y="-10" width="210" height="6" rx="3" fill="#fff" opacity=".35"/>
      <g class="btop" data-noink="1" transform="translate(262 0) scale(1.05)"></g>
      <g transform="scale(.72)">
      <g class="b-side">
        ${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${-80 + k * 17}" y="-62" width="13" height="40" rx="5" ${BF('bb')}/>`).join('')}
        <path d="M-70 -24 H30 Q46 -24 50 -14 L62 -10 V10 L50 14 Q46 24 30 24 H-70 Q-86 24 -86 10 V-10 Q-86 -24 -70 -24Z" style="fill:var(--bk);stroke:var(--bks)" stroke-width="4"/>
      </g>
      <g class="b-face">
        <path d="M-70 -26 H30 Q46 -26 50 -15 L62 -10 V10 L50 15 Q46 26 30 26 H-70 Q-88 26 -88 10 V-10 Q-88 -26 -70 -26Z" style="fill:var(--bk);stroke:var(--bks)" stroke-width="4"/>
        ${[-14, 0, 14].map(y => [-72, -57, -42, -27, -12, 3, 18].map(x => `<circle cx="${x}" cy="${y}" r="6" style="fill:var(--bb);stroke:var(--bbd)" stroke-width="1.5"/>`).join('')).join('')}
      </g>
      </g>`;

  svg.innerHTML = `
      <defs>
        <clipPath id="cClip">${box(0, 0, 0, '')}</clipPath>
        <radialGradient id="cIn" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#3f0c25"/><stop offset="1" stop-color="#8a2346"/></radialGradient>
      </defs>
      ${box(66, 60, 50, `fill="#ff8fab" stroke="${OUTLINE_INK}" stroke-width="7"`)}
      ${box(48, 44, 36, 'fill="none" stroke="#ffc4d3" stroke-width="10" opacity=".7"')}
      ${box(8, 6, 6, `fill="#e86a8f" stroke="${OUTLINE_INK}" stroke-width="5"`)}
      ${box(0, 0, 0, 'fill="url(#cIn)"')}
      <g clip-path="url(#cClip)">
        <ellipse cx="${CX}" cy="${CY + 130}" rx="230" ry="72" fill="#ff8fa3"/>
        <path d="M${CX} ${CY + 70} Q${CX + 6} ${CY + 110} ${CX} ${CY + 160}" stroke="#e86a8f" stroke-width="6" fill="none"/>
        ${zoneG('czone')}
        ${GUMS}
        <g class="c-dirt">${dirt}</g>
      </g>
      <g class="c-sparkles">${sparkles}</g>`;
  // 층 분리: 칫솔 / 안쪽 닦기용 앞쪽 이빨 / 거품
  const cam = $('#cCam');
  cam.querySelector('.c-bsvg').innerHTML = stickered(BRUSH, 7);
  $('#cOver').innerHTML = `<g clip-path="url(#cClip)">${zoneG('czone-ov')}${GUMS}<g class="c-dirt">${dirt}</g></g>`;
  cam.querySelector('.c-foam').innerHTML = foam;

  const brushG = cam.querySelector('.c-bpose');
  const foamBox = cam.querySelector('.c-foam');
  const foamEls = [...foamBox.querySelectorAll('.fb')];
  const dirtEls = dirtThr.map((_, k) => [...cam.querySelectorAll(`[data-d="${k}"]`)]);
  let dirtGone = dirtThr.map(() => false);
  const popBox = cam.querySelector('.c-pops');
  const setGone = (k, on, pop) => {
    dirtGone[k] = on; dirtEls[k].forEach(el => el.classList.toggle('gone', on));
    // 그 이빨의 더러움이 다 사라지면 웃는 얼굴
    const tk = dirtTooth[k], happy = dirtTooth.every((x, j) => x !== tk || dirtGone[j]);
    cam.querySelectorAll(`[data-t="${tk}"]`).forEach(el => el.classList.toggle('happy', happy));
    if (on && pop){
      const [x, y] = dirtPos[k], el = document.createElement('i');
      el.className = 'dpop'; el.style.left = (x - VB.x) + 'em'; el.style.top = (y - VB.y) + 'em';
      el.addEventListener('animationend', () => el.remove());
      popBox.appendChild(el);
    }
  };
  const POSES = {
    u: { outer:[715, 236, 0, 1, 1],   chew:[775, 320, 24, 1, 1],   inner:[740, 280, 26, .92, .92],   front:[560, 236, 78, .92, .92] },
    l: { outer:[715, 492, 0, 1, -1],  chew:[775, 410, -24, 1, -1], inner:[740, 452, -26, .92, -.92], front:[560, 506, -78, .92, -.92] }
  };
  /* 카메라: 그림은 고정된 크기로 한 번 그리고, CSS transform으로 옮김 (폰에서 매 프레임 다시 그리지 않게) */
  const VB = { x:-60, y:40, w:1120, h:640 };
  // 세균: 구역마다 4마리를 그 구역 더러움 자리에 (더러움이 사라질 때 같이 뿅)
  const germEls = {};
  { let html = '';
    ZORD.forEach((z, zi) => {
      const ks = dirtThr.map((thr, k) => [thr, k]).filter(([, k]) => dirtTooth[k].slice(0, 2) === z).sort((a, b) => a[0] - b[0]);
      const used = new Set();
      for (let j = 0; j < 4; j++){
        const k = ks[Math.min(ks.length - 1, Math.floor((j + .5) / 4 * ks.length))][1];
        if (used.has(k)) continue; used.add(k);
        const [x, y] = dirtPos[k];
        html += `<i class="germ" data-z="${z}" data-k="${k}" data-c="${(zi * 2 + j) % 4}" style="left:${(x - VB.x - 31).toFixed(1)}em;top:${(y - VB.y - 31).toFixed(1)}em">${germSVG(zi * 2 + j)}</i>`;
      }
    });
    cam.querySelector('.c-germs').innerHTML = html;
    cam.querySelectorAll('.c-germs .germ').forEach(g => { germEls[g.dataset.k] = g; });
  }
  let camMode = 'zone', K = 1, scr = { w:390, h:780 };
  function layout(){
    const r = $('#brushC').getBoundingClientRect();
    scr = { w:r.width || window.innerWidth, h:r.height || window.innerHeight };
    const asp = scr.w / scr.h;
    K = asp >= 1 ? scr.w / Math.max(1050, 680 * asp) : scr.w / 540;   // 화면 1px당 그림 단위
    cam.style.fontSize = K.toFixed(4) + 'px';      // 1em = 그림 1단위
  }
  function applyCam(instant){
    const tg = camTarget();
    const tx = scr.w / 2 - (tg.x - VB.x) * K, ty = scr.h / 2 - (tg.y - VB.y) * K;
    if (instant) cam.style.transition = 'none';
    cam.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)`;
    if (instant){ void cam.getBoundingClientRect(); cam.style.transition = ''; }
  }
  window.addEventListener('resize', () => { if (current === 'brushC'){ layout(); applyCam(true); } });

  let poseZ = 'ul', poseS = 'outer', lastSweepX = null, lastSx = null;
  // 손잡이 끝 장식은 칫솔에 붙어 있으므로 따로 보정하지 않음 (칫솔이 기울고 뒤집히는 대로 같이)
  function uprightTopper(){}
  function setPose(z, surf, sweepX){
    poseZ = z; poseS = surf;
    let [x, y, r, sx, sy] = POSES[z[0]][surf];
    if (surf === 'outer' && sweepX != null) x = sweepX;     // 바깥쪽: 어금니 → 앞니로 이동
    if (surf === 'front'){                                   // 앞니 안쪽: 칫솔을 세움, 손잡이는 손 쪽으로 살짝 기울게
      if (z[1] === 'l') x = 1000 - x;
      const hd = handDir();
      r = (z[0] === 'u' ? 90 : -90) - 12 * hd * (z[0] === 'u' ? 1 : -1);
      const flipF = lastSx !== null && Math.sign(sx) !== Math.sign(lastSx);
      lastSx = sx;
      if (flipF) brushG.style.transition = 'none';
      brushG.style.transform = `translate(${x - VB.x}em,${y - VB.y}em) rotate(${r}deg) scale(${sx},${sy})`;
      uprightTopper(r, sx, sy);
      if (flipF){ void brushG.getBoundingClientRect(); brushG.style.transition = ''; }
      $('#brushC').classList.add('inner-mode');
      $('#brushC').classList.toggle('front-u', z[0] === 'u');
      $('#brushC').classList.toggle('front-l', z[0] === 'l');
      SURF.forEach(k => $('#brushC').classList.toggle('surf-' + k, k === surf));
      return;
    }
    if (z[1] === 'l') x = 1000 - x;             // 칫솔 머리는 닦는 쪽으로
    // 안쪽: 칫솔 머리는 이빨 뒤(같은 줄 이빨이 앞에 겹쳐 그려져 가려짐), 손잡이만 이빨 사이 틈으로 비스듬히
    // 손잡이 방향
    //  · 바깥쪽: 칫솔이 볼 안쪽에 있어 닦는 쪽 입꼬리로 나옴 → 손 쪽으로
    //  · 씹는 면·안쪽: 앞쪽 입 벌린 곳으로 나와야 됨 → 입을 가로질러 반대쪽으로 (오른쪽 어금니면 왼쪽으로)
    const dir = surf === 'outer' ? handDir() : (z[1] === 'r' ? -1 : 1);
    if (surf === 'outer' && (z[1] === 'l') === (hand === 'right')) r = z[0] === 'u' ? 22 : -22;   // 반대쪽 바깥: 손잡이를 비스듬히 입 밖으로
    r *= dir; sx *= dir;
    // 손잡이 방향이 바뀌면(좌우 뒤집힘) 납작해지는 중간 모습 없이 바로 바꿈
    const flip = lastSx !== null && Math.sign(sx) !== Math.sign(lastSx);
    lastSx = sx;
    if (flip){ brushG.style.transition = 'none'; }
    brushG.style.transform = `translate(${x - VB.x}em,${y - VB.y}em) rotate(${r}deg) scale(${sx},${sy})`;
    uprightTopper(r, sx, sy);
    if (flip){ void brushG.getBoundingClientRect(); brushG.style.transition = ''; }
    $('#brushC').classList.toggle('inner-mode', surf === 'inner');
    $('#brushC').classList.remove('front-u', 'front-l');
    SURF.forEach(k => $('#brushC').classList.toggle('surf-' + k, k === surf));
  }
  function camTarget(){
    const land = scr.w >= scr.h;
    if (camMode === 'intro' || camMode === 'outro') return { x:CX, y:370 };
    const z = ZONES[Math.max(0, zoneIdx)], right = z[1] === 'r', upper = z[0] === 'u';
    const chew = SURF[surfIdx] === 'chew', front = SURF[surfIdx] === 'front';
    if (front) return { x: right ? 560 : 440, y: upper ? 320 : 420 };
    if (land){
      if (chew) return { x: right ? 620 : 380, y: upper ? 330 : 400 };
      return { x:CX + (right ? 60 : -60), y:345 + (upper ? -20 : 20) };
    }
    if (chew) return { x: right ? 700 : 300, y: upper ? 330 : 410 };
    return { x: right ? 670 : 330, y:370 + (upper ? -20 : 20) };
  }
  return {
    germTotal: Object.keys(germEls).length,
    reset(){
      cam.querySelectorAll('.czone,.czone-ov').forEach(g => { g.classList.remove('active', 'clean'); });
      foamEls.forEach(f => f.classList.remove('on'));
      dirtThr.forEach((_, k) => setGone(k, false));
      Object.values(germEls).forEach(g => g.classList.remove('pop'));
      cam.querySelectorAll('.c-germs .raid').forEach(g => g.remove());
      foamBox.classList.remove('off');
      svg.querySelector('.c-sparkles').classList.remove('show');
      $('#brushC').classList.remove('inner-mode', 'front-u', 'front-l');
      layout();
      brushG.style.transition = 'none';
      brushG.style.transform = `translate(${handDir() > 0 ? 1760 : -640}em,260em) rotate(0deg) scale(${handDir()},1)`;
      $('#brushC .c-rider').classList.toggle('right', hand === 'left');
      void brushG.getBoundingClientRect(); brushG.style.transition = '';
      layout(); camMode = 'intro'; applyCam(true);
      cam.style.opacity = '0';
      setTimeout(() => { cam.style.opacity = '1'; if (camMode === 'intro'){ camMode = 'zone'; applyCam(); } }, 60);
    },
    setZone(i){
      const z = ZONES[i];
      cam.querySelectorAll('.czone,.czone-ov').forEach(g => {
        const k = ZONES.indexOf(g.dataset.z);
        g.classList.toggle('active', k === i);
        g.classList.toggle('clean', k < i);
        g.classList.toggle('row', g.dataset.z[0] === z[0]);
      });
      lastSweepX = null; brushG.style.transition = ''; setPose(z, 'outer', SWEEP_FROM);
      if (camMode !== 'intro') applyCam();
    },
    setSurface(i, s){ lastSweepX = null; brushG.style.transition = ''; setPose(ZONES[i], SURF[s], SURF[s] === 'outer' ? SWEEP_FROM : null); applyCam(); },
    // 바깥쪽 진행도(0~1)에 맞춰 칫솔 머리를 어금니 → 앞니로
    sweep(p){
      if (poseS !== 'outer') return;
      const x = Math.round(SWEEP_FROM + (SWEEP_TO - SWEEP_FROM) * Math.max(0, Math.min(1, p)));
      if (lastSweepX !== null && Math.abs(x - lastSweepX) < 3) return;
      lastSweepX = x;
      brushG.style.transition = 'transform .25s linear';      // 훑고 지나갈 땐 일정한 속도로 (자세 바꿀 땐 원래 부드러운 전환)
      setPose(poseZ, 'outer', x);
    },
    // 입술 둘레 거품은 계속 쌓이고, 이빨 위 거품은 그 구역을 닦는 동안만 (다 닦은 이빨은 깨끗하게 보이게)
    foamTo(frac){
      const curZone = Math.min(3, Math.floor(frac * 4));
      foamEls.forEach((f, k) => {
        const z = foamZone[k];
        f.classList.toggle('on', frac >= foamThr[k] && (z < 0 || z === curZone));
      });
    },
    // 보스 기습: 그 구역 어금니 씹는 면에 세균 n마리 (뿅 나타남). 기습 구간 동안 하나씩 잡힘
    raidSpawn(z, n, col, a, b){
      const box = cam.querySelector('.c-germs'), spots = fisPos[z].slice().sort(() => Math.random() - .5).slice(0, n);
      return spots.map(([x, y], j) => {
        const g = document.createElement('i');
        g.className = 'germ raid'; g.dataset.c = String(col);
        g.style.left = (x - VB.x - 31).toFixed(1) + 'em'; g.style.top = (y - VB.y - 31).toFixed(1) + 'em';
        g.style.animationDelay = (j * .18).toFixed(2) + 's';
        g.innerHTML = germSVG(col); box.appendChild(g);
        return { el:g, thr:a + (b - a) * (j + 1) / (spots.length + 1), hit:false };
      });
    },
    raidClear(){ cam.querySelectorAll('.c-germs .raid').forEach(g => g.remove()); },
    raidMax(z){ return fisPos[z].length; },
    // 닦는 시간에 맞춰 더러움이 하나씩 반짝 하고 사라짐
    cleanTo(frac){
      dirtThr.forEach((thr, k) => {
        if (!dirtGone[k] && frac >= thr){ setGone(k, true, true); tone(1300 + Math.random() * 500, .06, 'sine', .07); if (germEls[k]) germHit(germEls[k], 'pop'); }
      });
    },
    outro(){
      camMode = 'outro'; applyCam();
      dirtThr.forEach((_, k) => { if (!dirtGone[k]) setGone(k, true); });
      Object.values(germEls).forEach(g => g.classList.add('pop'));
      cam.querySelectorAll('.c-germs .raid').forEach(g => g.classList.add('pop'));
      cam.querySelectorAll('.czone,.czone-ov').forEach(g => { g.classList.remove('active'); g.classList.add('clean'); });
      $('#brushC').classList.remove('inner-mode', 'front-u', 'front-l');
      brushG.style.transition = '';
      brushG.style.transform = `translate(${handDir() > 0 ? 1760 : -640}em,160em) rotate(0deg) scale(${handDir()},1)`;
      foamBox.classList.add('off');
      setTimeout(() => svg.querySelector('.c-sparkles').classList.add('show'), 500);
    }
  };
}
let cscene = null;
const CScene = new Proxy({}, { get(_, k){ if (!cscene) cscene = makeCScene(); return cscene[k]; } });
setTimeout(() => (window.requestIdleCallback || ((f) => f()))(() => { if (!cscene && !running) cscene = makeCScene(); }), 2500);   // 앱이 한가할 때 미리 만들어 둠 (첫 양치 시작이 바로 되게)
function techHint(){
  const sf = SURF[surfIdx], z = ZONES[Math.max(0, zoneIdx)];
  if (sf === 'chew') return t('hint.chew');
  if (sf === 'front') return t('hint.front');
  if (technique === 'circle') return t('hint.circle');
  if (technique === 'roll') return t('hint.roll.' + z[0]);
  return t(sf === 'outer' ? 'hint.short.outer' : 'hint.short.inner');
}
function cLabel(){
  els.zoneName.textContent = `${t('zone.' + ZONES[Math.max(0, zoneIdx)])} · ${t('surface.' + SURF[surfIdx])}`;
  $('#brushC .js-tech').textContent = techHint();
}

function setProgress(e){
  const tt = fmt(totalSec - e);
  if (els.time.textContent !== tt) els.time.textContent = tt;   // 바뀔 때만 (매 프레임 다시 그리지 않게)
  if (els.track){
    const pct = e / totalSec * 100;
    els.fill.style.transform = `scaleX(${(pct / 100).toFixed(4)})`;
    els.pill.style.left = Math.round(pct * 2) / 2 + '%';   // 0.5% 단위로만 움직여 매 프레임 다시 그리지 않게
    els.marks.forEach((m, k) => m.classList.toggle('done', e >= (k + 1) * totalSec / 4 - .01));
  }
}
function setHurry(on){ if (view) view.classList.toggle('hurry', on); }
function setPauseIcon(){ $$('.js-pause').forEach(b => { b.innerHTML = paused ? ICON.play : ICON.pause; }); }

function start(){
  if (running) return;                            // 빠르게 두 번 눌러도 한 번만
  ac(); Voice.stop();
  document.body.classList.add('brushing');      // 양치 중엔 배경 구름·효과 멈춤
  view = $('#brushC'); bchar = chars.brushC;
  els = {
    time: view.querySelector('.js-time'), zoneName: view.querySelector('.js-zoneName'), say: view.querySelector('.js-say'),
    track: view.querySelector('.c-track'), fill: view.querySelector('.c-fill'),
    pill: view.querySelector('.c-pill'), marks: [...view.querySelectorAll('.c-mark')]
  };
  surfIdx = 0;
  view.classList.remove('running', 'is-paused');
  zoneIdx = -1; hurrySaid = false; paused = false; banked = 0; pauseCount = 0;
  setHurry(false); setProgress(0);
  els.say.textContent = ''; els.zoneName.textContent = t('zone.ul');
  // 세균 수 표시
  let hud = view.querySelector('.germ-hud');
  if (!hud){ hud = document.createElement('div'); hud.className = 'germ-hud'; hud.innerHTML = germSVG(0) + '<b>0</b><span></span>'; view.appendChild(hud); }
  els.germHud = hud; els.germN = hud.querySelector('b');
  germCount = 0; els.germN.textContent = '0';
  bossOut(); delete view.dataset.gz;
  combo = 0; goldHit = false; curBoss = bossFor(new Date(), slotOf());
  // 보스 기습 계획: 첫 세 구역마다 2~3마리 (마지막 구역은 대장 세균과 대결). 짧은 양치(80초 미만)는 기습 없음
  raidPlan = ZONES.map((z, i) => RAID_ON && totalSec >= 80 && i < 3 ? Math.min(CScene.raidMax(z), 2 + (Math.random() < .5 ? 1 : 0)) : 0);
  raidGerms = []; raidCaught = 0; teaseDone = !(RAID_ON && totalSec >= 90);
  hud.querySelector('span').textContent = '/' + (CScene.germTotal + raidPlan.reduce((a, n) => a + n, 0) + 1);   // +1 = 대장 세균
  view.querySelectorAll('.gold').forEach(g => setGermLook(g, +g.dataset.c || 0));
  if (Math.random() < CONFIG.goldChance){                       // 가끔 황금 세균 한 마리
    const all = [...view.querySelectorAll('.c-germs .germ')];
    if (all.length > 2) setGermLook(all[1 + Math.floor(Math.random() * (all.length - 2))], 'gold');
  }
  bchar.setState('brushing'); bchar.setPaused(false);
  setPauseIcon();
  show(view.id);
  CScene.reset();
  begin();
}
function begin(){
  sfx.start(); buzz(80);
  running = true; paused = false; banked = 0; startAt = performance.now();
  view.classList.add('running');
  bchar.setPaused(false);
  const pm = slotOf() === 'pm';
  document.body.classList.toggle('eve', pm);                       // 저녁: 밤하늘 + 잠옷 모자
  if (pm && !effectiveLook().head) bchar.setLook(Object.assign({}, effectiveLook(), { head:'head_nightcap' }));
  if (isWeekend()) setTimeout(() => { if (running) fairyFly(); }, 1800);    // 주말: 이빨 요정
  musicStart();
  keepAwake();
  setZone(0);
  cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function loop(){
  if (!running) return;
  const e = Math.min(elapsed(), totalSec);
  const left = totalSec - e;
  const zl = totalSec / 4;
  const z = Math.min(3, Math.floor(e / zl));
  if (z !== zoneIdx) setZone(z);
  setProgress(e);
  {
    const fz = (e - z * zl) / zl;
    let seg = 0; while (seg < SURF_CUT.length - 2 && fz >= SURF_CUT[seg + 1]) seg++;
    const sf = SEG_SURF[seg];
    if (seg === 0) CScene.sweep(fz / SURF_CUT[1]);
    if (seg !== segIdx){
      segIdx = seg;
      if (sf !== surfIdx){ surfIdx = sf; CScene.setSurface(z, sf); cLabel(); tone(990, .1, 'sine', .12); }
      if (!hurrySaid && left <= 10.5){ hurrySaid = true; setHurry(true); bossIn(); }
      else if (seg === 3) raidStart(z);
      else if (!boss) say(['', 'say.chew', 'say.inner', 'say.front'][sf]);
    }
    if (!teaseDone && e >= zl * .45){ teaseDone = true; bossTease(); }
    CScene.foamTo(e / totalSec);
    CScene.cleanTo(e / totalSec);
    raidTick(e / totalSec);
  }
  if (!hurrySaid && left <= 10){ hurrySaid = true; setHurry(true); bossIn(); }
  if (boss) bossTick(left);
  if (e >= totalSec){ finish(); return; }
  raf = requestAnimationFrame(loop);
}

/* ---------- 세균 물리치기 ---------- */
let germCount = 0, boss = null, bossHp = 0, combo = 0, goldHit = false, curBoss = BOSSES[BOSSES.length - 1];
const BOSS_HP = 5;
const kidName = () => store.get('kidName', '');
const callName = () => kidName() ? t('say.call', { name:kidName() }) + ' ' : '';
function germBump(){
  if (!els.germN) return;
  els.germN.textContent = germCount;
  const h = els.germHud; h.classList.remove('bump'); void h.offsetWidth; h.classList.add('bump');
}
function comboPop(){
  let c = view.querySelector('.combo');
  if (!c){ c = document.createElement('div'); c.className = 'combo'; view.appendChild(c); }
  c.textContent = t('combo', { n:combo }); c.classList.remove('go'); void c.offsetWidth; c.classList.add('go');
}
function setGermLook(g, k){
  g.classList.toggle('gold', k === 'gold');
  if (g.classList.contains('mgerm')) g.querySelector('.gp > g').innerHTML = germInner(k);
  else g.innerHTML = germSVG(k);
}
function germHit(el, cls){
  el.classList.add(cls);
  germCount++; combo++; germBump();
  const gold = el.classList.contains('gold');
  bookAdd('germ', gold ? 'gold' : (el.dataset.c || '0'));
  const up = Math.pow(2, Math.min(combo - 1, 12) / 12);            // 연속으로 잡을수록 음이 올라감
  tone(520 * up, .05, 'square', .04); tone(1180 * up, .09, 'sine', .12, .04);
  if (combo >= 2) comboPop();
  if (gold){
    goldHit = true;
    [1319, 1568, 2093, 2637].forEach((f, i) => tone(f, .12, 'sine', .12, .08 + i * .07));
    const r = el.getBoundingClientRect(); firework(r.left + r.width / 2, r.top + r.height / 2);
  }
  buzz(25);
  if (bchar) bchar.cheer();
  petHop();
}
/* ---------- 보스 기습 (v0.26) ----------
   · 첫 구역 중간쯤: 대장 세균이 휙 지나가며 예고 ("어금니에 세균을 숨긴대요!")
   · 구역마다 3번 구간(기습): 대장 세균이 휙 지나가며 지금 구역 어금니 씹는 면에 세균 2~3마리 → 그 구간 동안 하나씩 잡힘
   · 깨끗해진 이는 그대로 (다시 더러워지지 않음 → 억울하지 않게). 잡은 수는 완료 화면 "숨은 세균 찾기" */
let raidPlan = [0, 0, 0, 0], raidGerms = [], raidCaught = 0, teaseDone = true;
function bossFly(){                                                          // 화면 위쪽을 휙 지나가는 대장 세균
  const B = curBoss, f = document.createElement('div');
  f.className = 'boss-fly' + (Math.random() < .5 ? ' rtl' : '');
  f.innerHTML = germSVG(B.col, B);
  view.appendChild(f); f.addEventListener('animationend', () => f.remove());
  [330, 262].forEach((fr, i) => tone(fr, .12, 'square', .04, i * .12));
}
function bossTease(){
  if (!running || boss) return;
  bossFly();
  say('say.bossTease', t('say.bossTease', { boss:t('boss.' + curBoss.id) }));
}
function raidStart(z){
  const zi = ZONES.indexOf(ZONES[z]), n = raidPlan[zi] || 0;
  if (!n || boss) return;                                                     // 기습 없는 구역(마지막 · 짧은 양치): 씹는 면 그대로 조용히
  const zl = totalSec / 4, a = (zi * zl + SURF_CUT[3] * zl) / totalSec, b = (zi * zl + SURF_CUT[4] * zl) / totalSec;
  bossFly();
  setTimeout(() => { if (running && zoneIdx === zi) raidGerms = raidGerms.concat(CScene.raidSpawn(ZONES[zi], n, curBoss.col, a, b)); }, 450);
  say('say.raid', t('say.raid', { boss:t('boss.' + curBoss.id) }));
}
function raidTick(frac){
  raidGerms.forEach(r => { if (!r.hit && frac >= r.thr){ r.hit = true; raidCaught++; germHit(r.el, 'pop'); } });
}
// 마지막 10초: 오늘의 대장 세균. 체력은 남은 시간에 맞춰 줄고, 끝나는 순간 물리침
function bossIn(){
  bossOut();
  const B = curBoss;
  boss = document.createElement('div'); boss.className = 'boss';
  boss.innerHTML = `<div class="bimg">${germSVG(B.col, B)}</div><div class="hp">${'<i></i>'.repeat(BOSS_HP)}</div>`;
  view.appendChild(boss); bossHp = BOSS_HP;
  [196, 247, 196, 147].forEach((f, i) => tone(f, .15, 'square', .05, i * .13));
  buzz([60, 40, 60]);
  say('say.boss', callName() + t('say.boss', { boss:t('boss.' + B.id) }));
}
function bossTick(left){
  const hp = Math.max(1, Math.ceil(left / 10 * BOSS_HP));      // 마지막 한 칸은 끝날 때
  if (hp >= bossHp) return;
  bossHp = hp;
  boss.querySelectorAll('.hp i').forEach((h, i) => h.classList.toggle('off', i >= hp));
  boss.classList.remove('hit'); void boss.offsetWidth; boss.classList.add('hit');
  view.classList.remove('shake'); void view.offsetWidth; view.classList.add('shake');     // 화면 흔들
  tone(260, .07, 'square', .05); tone(880, .1, 'sine', .1, .05); buzz(30);
  if (bchar) bchar.cheer();
  petHop();
}
function bossDown(){
  if (!boss) return false;
  const b = boss; boss = null;
  b.querySelectorAll('.hp i').forEach(h => h.classList.add('off'));
  b.classList.remove('hit'); b.classList.add('down');
  const fl = document.createElement('div'); fl.className = 'flash'; view.appendChild(fl); setTimeout(() => fl.remove(), 900);   // 마지막 한 방 번쩍
  const r = b.getBoundingClientRect(); firework(r.left + r.width / 2, r.top + r.width / 2);
  setTimeout(() => firework(r.left + r.width * .2, r.top + r.width * .3), 250);
  germCount++; germBump(); bookAdd('boss', curBoss.id);
  [523, 659, 784, 1047].forEach((f, i) => tone(f, .16, 'triangle', .14, i * .09));
  buzz([80, 40, 160]);
  setTimeout(() => b.remove(), 1500);
  return true;
}
const bossDownLine = () => callName() + t('say.bossDown', { boss:t('boss.' + curBoss.id) });
function bossOut(){ if (boss){ boss.remove(); boss = null; } }

function togglePause(silent){
  if (!running) return;
  if (!paused){
    banked = elapsed(); paused = true; pauseCount++; combo = 0;
    bchar.setPaused(true); view.classList.add('is-paused'); say('say.pause', undefined, !silent); releaseAwake(); musicPause(true);
  } else {
    startAt = performance.now(); paused = false;
    bchar.setPaused(false); view.classList.remove('is-paused'); say('say.resume'); keepAwake(); musicPause(false);
  }
  setPauseIcon(); sfx.tap();
}

function halt(){
  running = false; paused = false;
  document.body.classList.remove('brushing');
  cancelAnimationFrame(raf); musicStop(); releaseAwake();
  if (bchar){
    bchar.setState('idle'); bchar.setPaused(false);
    bchar.el.classList.remove('z-ul', 'z-ur', 'z-lr', 'z-ll');
  }
  if (view) view.classList.remove('running', 'is-paused', 'hurry', 'inner-mode', 'front-u', 'front-l');
  bossOut();
  if (document.body.classList.contains('eve')){ document.body.classList.remove('eve'); applyLook(); }
  if (view) view.querySelectorAll('.fairy').forEach(f => f.remove());
}

const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

function finish(){
  setProgress(totalSec);
  raidTick(1);
  const bd = bossDown();
  halt(); CScene.outro(); if (bd) say('say.bossDown', bossDownLine()); else say('say.sparkle');
  [1568, 1319, 1568, 2093].forEach((f, i) => tone(f, .18, 'sine', .12, .3 + i * .12));
  setTimeout(afterBrush, 2200);
}
const afterBrush = () => { if (tongueOn) openTongue(finishDone); else finishDone(); };

/* ---------- 보너스: 혀 닦기 (약 7초) ----------
   혀를 내민 입 + 혀 위의 하얀 세균막. 칫솔이 안쪽 → 혀끝으로 3번 쓸고, 한 번마다 1/3씩 사라짐 */
let tgTimers = [];
function tongueSVG(){
  let coat = '', k = 0;
  for (let row = 0; row < 4; row++){
    for (let c = 0; c < 4; c++){
      const x = 116 + c * 22 + (row % 2) * 6 + (k * 7 % 7) - 3, y = 142 + row * 28 + (k * 5 % 7);   // 혀 안쪽에만
      coat += `<ellipse data-noink="1" class="coat g${k % 3}" cx="${x}" cy="${y}" rx="${7 + k % 3 * 1.5}" ry="4.5" fill="#fbf3e4" stroke="#ead9bd" stroke-width="1"/>`;
      k++;
    }
  }
  const mouth = `
      <rect x="34" y="40" width="232" height="160" rx="76" fill="#ff8fab"/>
      <rect x="52" y="56" width="196" height="124" rx="60" fill="#5e1532"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${78 + i * 25}" y="56" width="22" height="${i === 0 || i === 5 ? 18 : 26}" rx="7" fill="#fff" stroke="#d3eaf7" stroke-width="2"/>`).join('')}
      <path d="M92 118 Q150 96 208 118 L208 228 Q208 292 150 292 Q92 292 92 228 Z" fill="#ff7b93" stroke="#e85d7f" stroke-width="4"/>
      <path d="M150 126 Q154 190 150 262" stroke="#e85d7f" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${coat}`;
  const tbrush = `
      <rect x="-11" y="34" width="22" height="195" rx="11" ${BF('bh')}/>
      <g transform="rotate(90)">${bDeco(34, 229, 11)}</g>
      <rect x="-11" y="107" width="22" height="10" ${BF('bs')}/><rect x="-11" y="128" width="22" height="10" ${BF('bs')}/>
      <g transform="translate(0 255) scale(.8)">${topperOf(brush)}</g>
      <path d="M-22 -30 Q-22 -40 -12 -40 H12 Q22 -40 22 -30 V30 Q22 40 12 40 H-12 Q-22 40 -22 30Z" style="fill:var(--bk);stroke:var(--bks)" stroke-width="3"/>
      ${[-24, -8, 8, 24].map(y => [-10, 0, 10].map(x => `<circle cx="${x}" cy="${y}" r="4.5" style="fill:var(--bb);stroke:var(--bbd)" stroke-width="1"/>`).join('')).join('')}`;
  return `<svg viewBox="0 0 300 300" aria-hidden="true">${inkScene(mouth, 4)}</svg>
    <div class="tg-brush"><svg viewBox="-26 -40 52 330" aria-hidden="true">${stickered(tbrush, 3.5)}</svg></div>`;
}
function openTongue(done){
  tgTimers.forEach(clearTimeout); tgTimers = [];
  const stage = $('#tgStage');
  stage.innerHTML = tongueSVG();
  stage.classList.remove('go', 'end');
  $$('#tgCount i').forEach(i => i.classList.remove('on'));
  $('#tgSay').textContent = t('tongue.say');
  show('tongue');
  stage.style.fontSize = (stage.getBoundingClientRect().width / 300).toFixed(4) + 'px';   // 1em = 그림 1단위
  void stage.offsetWidth; stage.classList.add('go');
  Voice.play('tongue.say', t('tongue.say'));
  let finished = false;
  const end = () => { if (finished) return; finished = true; tgTimers.forEach(clearTimeout); tgTimers = []; done(); };
  for (let n = 0; n < 3; n++){
    tgTimers.push(setTimeout(() => {               // 한 번 쓸 때마다 1/3씩 깨끗하게
      stage.querySelectorAll('.coat.g' + n).forEach(el => el.classList.add('gone'));
      $$('#tgCount i')[n].classList.add('on');
      tone(900 + n * 200, .12, 'sine', .14);
    }, 1100 + n * 1600));
  }
  tgTimers.push(setTimeout(() => { stage.classList.add('end'); $('#tgSay').textContent = t('tongue.done'); Voice.play('tongue.done', t('tongue.done')); }, 5000));
  tgTimers.push(setTimeout(end, CONFIG.tongueMs));
  $('#tgSkip').onclick = () => { sfx.tap(); Voice.stop(); end(); };
}
/* ---------- 보상 계산 ---------- */
// 연속 기록: 오늘 아직 안 닦았으면 어제부터 셈. 지킴이 방석으로 메운 날도 이어진 걸로
function streakDays(){
  const set = new Set(log.concat(store.get('covered', [])));
  const d = new Date(); if (!set.has(dkey(d))) d.setDate(d.getDate() - 1);
  let n = 0; while (set.has(dkey(d))){ n++; d.setDate(d.getDate() - 1); }
  return n;
}
// 어제(까지) 빠진 날이 있으면 방석으로 자동으로 메움 (최대 3일, 방석 수만큼)
function autoShield(){
  const sh = store.get('shields', 1); if (sh <= 0) return 0;
  const cov = store.get('covered', []), set = new Set(log.concat(cov));
  const d = new Date(); d.setDate(d.getDate() - 1);
  const miss = [];
  while (!set.has(dkey(d)) && miss.length < 3){ miss.push(dkey(d)); d.setDate(d.getDate() - 1); }
  if (!miss.length || miss.length > sh || !set.has(dkey(d))) return 0;
  store.set('covered', cov.concat(miss).slice(-60)); store.set('shields', sh - miss.length);
  return miss.length;
}
function computeRewards(){
  const R = CONFIG.reward;
  const list = [['rw.base', {}, R.base]];
  if (pauseCount === 0) list.push(['rw.noPause', {}, R.noPause]);
  const st = streakDays();
  if (st >= 7) list.push(['rw.streak', { n:st }, R.streak7]); else if (st >= 3) list.push(['rw.streak', { n:st }, R.streak3]);
  if (log.filter(k => k === todayKey()).length === 2) list.push(['rw.twice', {}, R.twice]);
  if (typeof freeWait === 'function' && freeWait()) list.push(['rw.petWait', {}, 2]);   // v0.33.0 기본 펫을 다 모은 아이: 알 대신 별 2개
  const ev = activeEvent(), gift = store.get('evGift', {});
  if (ev && gift[ev.id] !== todayKey()){
    if (ev.id === 'birthday') list.push(['rw.bday', {}, ev.bonus || R.birthday]);
    else list.push(['rw.event', { event:t('event.' + ev.id + '.name') }, ev.bonus || R.event]);
    store.set('evGift', Object.assign({}, gift, { [ev.id]: todayKey() }));
  }
  const MILE = R.mile || {};
  if (log.filter(k => k === todayKey()).length === 1 && MILE[st]){          // 3·7·14·30일 달성 (그날 첫 양치 때 한 번)
    const sh = [7, 14, 30].includes(st);
    if (sh) store.set('shields', Math.min(CONFIG.shieldMax, store.get('shields', 1) + 1));
    list.push([sh ? 'rw.mileShield' : 'rw.mile', { n:st }, MILE[st], 'lucky']);
  }
  if (goldHit) list.push(['rw.gold', {}, R.gold, 'lucky']);
  if (raidCaught) list.push(['rw.raid', { n:raidCaught, boss:t('boss.' + curBoss.id) }, R.raid == null ? 1 : R.raid]);   // 보스가 숨긴 세균 찾기 (v0.26)
  if (isWeekend() && store.get('fairyDay', '') !== todayKey()){ store.set('fairyDay', todayKey()); list.push(['rw.fairy', {}, R.fairy]); }
  if (mapEv && mapEv.type === 'castle') list.push(['rw.castle', { isl:t('map.isl.' + mapEv.island) }, mapEv.stars || R.castle, 'lucky']);
  if (Math.random() < R.luckyChance) list.push(['rw.lucky', {}, R.lucky, 'lucky']);
  return list.filter(x => x[2] > 0);
}

/* ---------- 보상 연출: 선물 상자 → 별이 날아가 쌓임 → 불꽃놀이 ---------- */
const STAR_SVG = '<svg viewBox="0 0 24 24" width="34" height="34"><path fill="#ffd54a" stroke="#f0a500" stroke-width="1.2" stroke-linejoin="round" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
let giftTimers = [], giftOpened = true, rewardQueue = null;
function clearGift(){ giftTimers.forEach(clearTimeout); giftTimers = []; giftOpened = true; }
var petEv = null, petPend = null, petGift = null, mapEv = null, giftAllDone = false, stampDone = false, extraShows = [];      // 이번 양치의 알·펫 결과 / 아직 못 보여준 축하
const rectC = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function firework(x, y){
  const colors = ['#ff7aa8', '#ffd54a', '#3ccf9c', '#8fd3ff', '#b48cff', '#ffb347'];
  for (let i = 0; i < 16; i++){
    const p = document.createElement('i'); p.className = 'fwp';
    p.style.background = colors[(i + Math.floor(x)) % colors.length];
    document.body.appendChild(p);
    const a = i / 16 * Math.PI * 2, r = 60 + Math.random() * 40;
    const an = p.animate([
      { transform:`translate(${x}px,${y}px) scale(1)`, opacity:1 },
      { transform:`translate(${x + Math.cos(a) * r}px,${y + Math.sin(a) * r + 30}px) scale(.3)`, opacity:0 }
    ], { duration:900 + Math.random() * 300, easing:'cubic-bezier(.1,.7,.3,1)' });
    an.onfinish = () => p.remove();
  }
  tone(200 + Math.random() * 100, .25, 'triangle', .08); tone(1600 + Math.random() * 600, .2, 'sine', .04, .1);
}
function flyStar(from, to, delay, done){
  const el = document.createElement('div'); el.className = 'flystar'; el.innerHTML = STAR_SVG;
  el.style.transform = `translate(${from[0]}px,${from[1]}px) scale(0)`;
  document.body.appendChild(el);
  const mx = (from[0] + to[0]) / 2 + (Math.random() * 120 - 60), my = Math.min(from[1], to[1]) - 60 - Math.random() * 40;
  const an = el.animate([
    { transform:`translate(${from[0]}px,${from[1]}px) scale(.3) rotate(0deg)`, opacity:0 },
    { transform:`translate(${mx}px,${my}px) scale(1.4) rotate(160deg)`, opacity:1, offset:.45 },
    { transform:`translate(${to[0]}px,${to[1]}px) scale(.6) rotate(360deg)`, opacity:1 }
  ], { duration:850, delay, easing:'cubic-bezier(.4,0,.3,1)', fill:'backwards' });
  an.onfinish = () => { el.remove(); done(); };
}
function openGift(){
  if (giftOpened || !rewardQueue) return;
  giftOpened = true; giftTimers.forEach(clearTimeout); giftTimers = [];
  const { list, from } = rewardQueue;
  $('#giftHint').hidden = true;
  $('#giftStage').classList.add('open');
  [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .22, 'triangle', .2, i * .07));
  buzz([80, 40, 120]);
  const box = rectC($('#giftStage')), pill = rectC($('#donePill'));
  let shown = from, k = 0, delay = 350;
  const ul = $('#rwList');
  list.forEach(([key, prm, n, cls], li) => {
    const row = document.createElement('li'); if (cls) row.className = cls;
    row.innerHTML = `<span>${t(key, prm)}</span><b>${n ? `+${n} ⭐` : '🐾'}</b>`;
    ul.appendChild(row);
    giftTimers.push(setTimeout(() => { row.classList.add('show'); if (cls === 'lucky'){ firework(box[0], box[1] - 40); tone(1568, .3, 'sine', .15); } }, delay));
    for (let j = 0; j < n; j++, k++){
      const idx = k;
      flyStar(box, pill, delay + j * 170, () => {
        shown++; $('#doneCount').textContent = shown;
        const pl = $('#donePill'); pl.classList.remove('bump'); void pl.offsetWidth; pl.classList.add('bump');
        tone(880 * Math.pow(2, Math.min(idx, 14) / 12), .12, 'sine', .14);     // 별이 쌓일수록 음이 올라감
      });
    }
    delay += Math.max(n, 1) * 170 + 260;
  });
  const total = list.reduce((a, x) => a + x[2], 0);
  giftTimers.push(setTimeout(() => {
    const row = document.createElement('li'); row.className = 'total show';
    row.innerHTML = `<span>${t('rw.total')}</span><b>+${total} ⭐</b>`; ul.appendChild(row);
    const goal = goalHab();
    if (goal){ const gr = document.createElement('li'); gr.className = 'goal show'; gr.innerHTML = `<span>${goalText(goal)}</span>`; ul.appendChild(gr); }
    sfx.done(); confetti(90);
    const W = window.innerWidth, H = window.innerHeight;
    [[.25, .22], [.75, .18], [.5, .12], [.2, .4], [.8, .38]].forEach(([fx, fy], i) => giftTimers.push(setTimeout(() => firework(W * fx, H * fy), i * 260)));
    $('#doneMsg').textContent = stars >= cheapestLocked() ? t('done.canBuy') : t('done.msgs');
    Voice.play('gift.got', t('gift.got', { n:total }));
    // 알·펫: 부화·성장이면 축하 화면 먼저, 아니면 바로 진행 카드
    giftAllDone = true; $('#stampBtn').classList.add('ready');
    const q = petShowsOf(petEv, petGift).concat(extraShows), special = q.length > 0;
    if (special){ petPend = q; giftTimers.push(setTimeout(petPendingShow, 1800)); }
    else giftTimers.push(setTimeout(() => showPetCard(petEv, true), 900));
    giftTimers.push(setTimeout(() => showBossNext(!special), 1300));
    if (mapEv && mapEv.hero) giftTimers.push(setTimeout(() => toast(t('map.gotHero', { item:itemName(mapEv.hero) })), 2400));
    if (mapEv && mapEv.gift) giftTimers.push(setTimeout(() => toast(t('map.giftRoom', { item:t('room.' + mapEv.gift) })), 2400));
    if (mapEv && (mapEv.egg || mapEv.eggNext)) giftTimers.push(setTimeout(() => toast(t(mapEv.egg ? 'map.specialEgg' : 'map.specialEggNext'), 4000), mapEv.gift ? 5200 : 2400));
  }, delay + 600));
}
$('#giftBox').addEventListener('click', openGift);

function finishDone(){
  sfx.done(); buzz([200, 100, 200, 100, 400]);
  log.push(todayKey()); if (log.length > 400) log = log.slice(-400); store.set('log', log);
  const L2 = store.get('log2', []); L2.push({ d:todayKey(), s:slotOf(), st:0 }); store.set('log2', L2.slice(-240));   // 주간 기록용
  mapEv = mapAdvance(); autoShield();
  petEv = petAdvance();
  petGift = log.filter(k => k === todayKey()).length >= 2 && giftReady() ? giftPet() : null;     // 하루 두 번 닦으면 펫 선물
  const newTeams = checkTeams();                               // 이번에 다 모인 팀 → 합체 연출 + 별
  extraShows = newTeams.map(tm => ({ kind:'team', team:tm, star:teamStar(tm) }));
  if (mapEv && mapEv.heroSet) extraShows.push({ kind:'hero', set:mapEv.heroSet, auto:true });   // 변신 세트 완성 → 바로 변신
  const list = computeRewards();
  newTeams.forEach(tm => list.push(['rw.team', { team:t('team.' + tm.id) }, teamStar(tm), 'lucky']));
  const total = list.reduce((a, x) => a + x[2], 0), before = stars;
  setStars(stars + total);                                   // 저장은 바로 (연출 중에 나가도 별은 그대로)
  if (petGift) list.push(['pet.giftRow', {}, 0, 'lucky']);
  rewardQueue = { list, from:before }; giftOpened = false;
  giftTimers.forEach(clearTimeout); giftTimers = [];
  $('#doneCount').textContent = before;
  $('#rwList').innerHTML = '';
  const gb = $('#doneGerms'); gb.hidden = !germCount;
  gb.innerHTML = `${germSVG(2, false, 'gi')}<b>×${germCount}</b>`; gb.title = t('done.germs', { n:germCount });
  $('#doneMsg').textContent = '';
  $('#petCard').hidden = true;
  $('#nextRow').hidden = true; $('#bossNext').hidden = true;
  giftAllDone = false; stampDone = false;
  const sb = $('#stampBtn'); sb.classList.remove('ready', 'done'); sb.style.setProperty('--p', 0); $('#stampMark').classList.remove('show');
  $('#giftStage').classList.remove('open'); $('#giftHint').hidden = false;
  // 여기까지 기록 · 별 저장 끝 → (켜져 있으면) 반짝이 극장 → 완료 화면
  const reveal = () => {
  show('done'); confetti(40); refreshHome();
  giftTimers.push(setTimeout(openGift, CONFIG.giftAutoOpenMs));               // 안 눌러도 3초 뒤 자동으로 열림
  quizRefresh();                                                              // v0.30.0 오늘의 퀴즈 단추
  if (typeof shareDoneRefresh === 'function') shareDoneRefresh();             // v0.45.0 연속 기록 3 · 7 · 14 · 30일 … 자랑하기
  $('#doneSpit').innerHTML = `${stickerSvg('<svg viewBox="0 0 44 44"><circle cx="16" cy="22" r="13" fill="#fff" stroke="#bfe3f7" stroke-width="2"/><circle cx="12" cy="19" r="1.8" fill="#24324a"/><circle cx="19" cy="19" r="1.8" fill="#24324a"/><ellipse cx="22" cy="27" rx="3" ry="2.5" fill="#8a2346"/><circle cx="31" cy="27" r="3" fill="#e9f8ff" stroke="#9fd3ee" stroke-width="1.5"/><circle cx="37" cy="25" r="2.2" fill="#e9f8ff" stroke="#9fd3ee" stroke-width="1.5"/></svg>', 2.2)}<span>${t('done.spit')}</span>`;
  setTimeout(() => Voice.play('done', callName() + t('done.title') + ' ' + t('done.spit') + ' ' + t('gift.say')), 600);
  };
  // 특별한 날 · 일주일에 한 번은 스페셜 영상 (v0.25: 틀 수 있는 영상이 확인된 것 중에서만 → 없으면 바로 극장)
  specialPick().then(sp => { if (sp) playSpecial(sp, reveal); else if (theaterOn) playTheater(reveal); else reveal(); });
}

function confetti(n){
  const box = $('#confetti');
  const colors = ['#ff7aa8', '#ffd54a', '#3ccf9c', '#8fd3ff', '#b48cff'];
  for (let i = 0; i < n; i++){
    const d = document.createElement('div');
    d.className = 'cf';
    d.style.left = Math.random() * 100 + 'vw';
    d.style.background = colors[i % colors.length];
    d.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    d.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    d.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
    d.style.animationDelay = (Math.random() * .6) + 's';
    d.addEventListener('animationend', () => d.remove());
    box.appendChild(d);
  }
}

function goHome(){ halt(); Voice.stop(); refreshHome(); show('home'); }
function askStop(){
  if (!running) return;
  const pausedByDialog = !paused;
  if (!paused) togglePause(true);
  dialog({
    text: t('stop.q'), ok: t('stop.keep'), cancel: t('stop.quit'),
    onOk(){ if (pausedByDialog && paused) togglePause(); },
    onCancel: goHome
  });
}
