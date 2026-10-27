'use strict';

/* =========================================================
   펫 그림 생성기
     동물마다 손으로 다 그리지 않고, 몸 틀(포유류 · 새 · 바다 · 파충류 · 곤충 등)에
     귀 · 입 · 꼬리 · 무늬 · 뿔 같은 부품을 골라 끼워서 그림
     → 새 동물은 아래 SPECIES 목록에 한 줄 추가하면 됨
     좌표: 가운데 (0,0), 바닥 y≈44, 크기 100×100
     의도: 252종 + 전설 11종을 한 사람이 다 그릴 수 없어서 부품 조립식. 나중에 진짜 그림이 생기면 resources.js pets 로 교체
     무리(group): land · bird · sea · reptile · bug · legend → 동물 집 · 영웅 모습 · 팀 분류에 씀
     아래 SPECIES 한 줄 = [id, 한국어, 영어, 일본어, 몸 틀(q 네발 · b 새 · p 펭귄 · f 물고기 · r 파충류 · x 곤충/특수), 부품]
     v0.38.0 다시 그리기 (252종 모두에 적용): 눈은 그림체 B 규칙(진한 타원 + 반사 두 개), 머리 광택 줄, 몸 아래 그늘
       네발 동물: 인형처럼 앉은 모습 (엉덩이 + 앞발 두 개 + 다리 선), 통통한 볼 (cheekbulge:false 로 끔), 앞발이 없는 몸: legs:false
       새: 발가락 세 개 · 날개 깃털 줄 / 물고기: 비늘 · 꼬리 지느러미 줄 / 코끼리 코 · 기린 목 · 낙타 혹 다시
       sc: 키 큰 동물은 바닥 기준으로 작게 (예: 기린 .84). 꾸미기 자리(top · eye · neck)도 같이 맞춰짐
   ========================================================= */
const PetGen = (() => {
  const f1 = (n) => String(Math.round(n * 10) / 10);
  const shade = (hex, a) => {
    let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const n = parseInt(c, 16), ch = [n >> 16, (n >> 8) & 255, n & 255];
    return '#' + ch.map(v => Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a))).toString(16).padStart(2, '0')).join('');
  };
  const E = (x, y, rx, ry, fill, ex = '') => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}"${ex ? ' ' + ex : ''}/>`;
  const C = (x, y, r, fill, ex = '') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${fill}"${ex ? ' ' + ex : ''}/>`;
  const P = (d, fill, ex = '') => `<path d="${d}" fill="${fill}"${ex ? ' ' + ex : ''}/>`;
  const S = (d, c, w, ex = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${ex ? ' ' + ex : ''}/>`;
  const M = (svg) => svg + `<g transform="scale(-1 1)">${svg}</g>`;          // 왼쪽만 그리고 좌우 대칭
  const R = (a, x, y) => `transform="rotate(${a} ${f1(x)} ${f1(y)})"`;
  const INK = '#24324a';
  const lum = (hex) => { if (!/^#/.test(hex)) return 0; let c = hex.slice(1); if (c.length === 3) c = c.split('').map(x => x + x).join(''); const n = parseInt(c, 16); return ((n >> 16) * .299 + ((n >> 8) & 255) * .587 + (n & 255) * .114) / 255; };
  const ol = (c) => lum(c) > .84 ? `stroke="${shade(c, -.17)}" stroke-width="2"` : '';     // 하얀 동물은 테두리
  /* v0.38.0 눈: 그림체 B 규칙대로 진한 타원(세로로 조금 김) + 흰 반사 두 개 (큰 것 위 오른쪽, 작은 것 아래 왼쪽) */
  const glint2 = (x, y, r) => C(x + r * .34, y - r * .4, r * .36, '#fff') + C(x - r * .3, y + r * .42, r * .16, '#fff');
  const eyes = (y, x = 10, r = 4.4, cx = 0) => `<g transform="translate(${cx} 0)">` + M(E(-x, y, r * .92, r * 1.12, INK) + glint2(-x, y, r)) + '</g>';
  const irisEyes = (y, x, col, r = 4.6) => M(E(-x, y, r * .95, r * 1.1, col) + E(-x, y, r * .55, r * .66, INK) + glint2(-x, y, r * .95));
  const whiteEyes = (y, x = 10) => M(C(-x, y, 5.8, '#fff')) + eyes(y, x, 3.5);
  const blush = (y, x = 17, cx = 0) => `<g transform="translate(${cx} 0)">` + M(E(-x, y, 4, 2.4, '#ffb3c7', 'opacity=".9"')) + '</g>';
  const smile = (y, w = 4, c = INK) => S(`M${-w} ${y} Q0 ${y + w * .9} ${w} ${y}`, c, 2);
  const star = (x, y, r, fill) => P(`M${f1(x)} ${f1(y - r)} L${f1(x + r * .3)} ${f1(y - r * .3)} L${f1(x + r)} ${f1(y)} L${f1(x + r * .3)} ${f1(y + r * .3)} L${f1(x)} ${f1(y + r)} L${f1(x - r * .3)} ${f1(y + r * .3)} L${f1(x - r)} ${f1(y)} L${f1(x - r * .3)} ${f1(y - r * .3)}Z`, fill);

  /* ---------- 네발 동물 · 포유류 (앉은 모습) ---------- */
  function earQ(t, hc, m, ie, o){
    const ec = o.ec || m, L = ol(ec);
    switch (t){
      case 'tri':   return M(P(`M-24 ${hc - 6} L-21 ${hc - 36} L-5 ${hc - 19}Z`, ec, L) + P(`M-19 ${hc - 13} L-18 ${hc - 29} L-10 ${hc - 18}Z`, ie));
      case 'cat':   return M(P(`M-23 ${hc - 8} L-20 ${hc - 31} L-7 ${hc - 18}Z`, ec, L) + P(`M-19 ${hc - 13} L-18 ${hc - 25} L-11 ${hc - 17}Z`, ie));
      case 'tuft':  return earQ('cat', hc, m, ie, o) + M(S(`M-20 ${hc - 31} L-21 ${hc - 40}`, INK, 2.2));
      case 'round': return M(C(-19, hc - 17, 9, ec, L) + C(-19, hc - 17, 5, ie));
      case 'small': return M(C(-17, hc - 18, 6, ec, L) + C(-17, hc - 18, 3.2, ie));
      case 'big':   return M(C(-22, hc - 15, 13, ec, L) + C(-22, hc - 15, 8, ie));
      case 'long':  return M(`<g ${R(-8, -9, hc - 20)}>${E(-9, hc - 34, 6.5, 17, ec, L) + E(-9, hc - 33, 3.5, 12, ie)}</g>`);
      case 'kanga': return M(`<g ${R(-14, -12, hc - 20)}>${P(`M-17 ${hc - 16} Q-16 ${hc - 46} -10 ${hc - 46} Q-5 ${hc - 40} -6 ${hc - 18}Z`, ec)}</g>`);
      case 'horse': return M(P(`M-17 ${hc - 13} Q-21 ${hc - 33} -10 ${hc - 28} Q-9 ${hc - 20} -10 ${hc - 15}Z`, ec, L) + P(`M-15 ${hc - 16} Q-17 ${hc - 28} -12 ${hc - 25}Z`, ie));
      case 'side':  return M(E(-27, hc - 9, 10, 5, ec, R(-22, -27, hc - 9) + ' ' + L) + E(-27, hc - 9, 6, 2.6, ie, R(-22, -27, hc - 9)));
      case 'pig':   return M(P(`M-22 ${hc - 8} L-25 ${hc - 29} L-8 ${hc - 18}Z`, ec) + P(`M-20 ${hc - 12} L-22 ${hc - 24} L-12 ${hc - 17}Z`, ie));
      case 'pointy':return M(P(`M-21 ${hc - 4} L-29 ${hc - 40} L-6 ${hc - 19}Z`, ec, L) + P(`M-19 ${hc - 10} L-25 ${hc - 32} L-11 ${hc - 18}Z`, ie));
      case 'tiny':  return M(C(-15, hc - 18, 4.5, ec));
      case 'mon':   return M(C(-25, hc, 7, ec, L) + C(-25, hc, 4, ie));
      case 'fold':  return M(P(`M-22 ${hc - 10} Q-25 ${hc - 25} -12 ${hc - 20} Q-14 ${hc - 12} -22 ${hc - 6}Z`, o.ec || shade(m, -.25)));
      case 'huge':  return '';      // 사막여우 큰 귀는 머리 뒤 (아래 qBack)
      default: return '';
    }
  }
  function muzQ(t, hc, o, m, s){
    const y = hc + 9, n = o.n || INK;
    switch (t){
      case 'cat':   return P(`M-3.2 ${y - 1} H3.2 L0 ${y + 2}Z`, o.n || '#ff8fa8') + S(`M-5 ${y + 4} Q-2.5 ${y + 6.5} 0 ${y + 3} Q2.5 ${y + 6.5} 5 ${y + 4}`, INK, 1.8);
      case 'dog':   return E(0, y + 2, 11, 8, s) + E(0, y - 1, 4.6, 3.3, n) + S(`M0 ${y + 2} V${y + 5} M-4 ${y + 6} Q0 ${y + 9} 4 ${y + 6}`, INK, 1.8);
      case 'bear':  return E(0, y + 2, 10, 7.5, s) + E(0, y - 1, 4, 3, n) + S(`M-3.5 ${y + 5} Q0 ${y + 8} 3.5 ${y + 5}`, INK, 1.8);
      case 'long':  return E(0, y + 4, 14, 9.5, s) + M(E(-5, y + 3, 1.7, 2.3, shade(s, -.5))) + S(`M-5 ${y + 9} Q0 ${y + 11} 5 ${y + 9}`, INK, 1.8);
      case 'pig':   return E(0, y + 2, 8.5, 6.5, o.sn || shade(m, -.12)) + M(E(-3, y + 2, 1.5, 2.3, shade(m, -.5))) + smile(y + 10, 3);
      case 'trunk': return P(`M-8.5 ${y - 9} Q-10.5 ${y + 10} -6.5 ${y + 21} Q-2 ${y + 30} 8 ${y + 27} Q14 ${y + 25} 12.5 ${y + 19} Q6.5 ${y + 21} 5 ${y + 14} Q5.6 ${y + 2} 8.5 ${y - 9}Z`, m, `stroke="${shade(m, -.24)}" stroke-width="1.5" stroke-linejoin="round"`) +   // v0.38.0 통통한 코 (끝이 위로 말림)
        S(`M-7.6 ${y + 5} Q-1 ${y + 7} 5 ${y + 5} M-7 ${y + 11} Q-1 ${y + 13} 5 ${y + 11} M-6 ${y + 17} Q-.5 ${y + 19} 5.6 ${y + 17}`, shade(m, -.2), 1.3) + E(11, y + 23.4, 2.6, 1.8, shade(m, -.4), R(-30, 11, y + 23.4));
      case 'koala': return E(0, y - 1, 6, 7.5, INK) + C(-1.8, y - 3.5, 1.4, '#fff') + smile(y + 8, 3);
      case 'bill':  return E(0, y + 4, 13, 7, o.bc || '#3a3a4a') + M(C(-3, y + 1, 1.2, '#7a7a8a'));
      case 'beak':  return P(`M-8 ${y - 4} Q0 ${y - 8} 8 ${y - 4} Q7 ${y + 6} 0 ${y + 10} Q2 ${y + 1} -8 ${y - 4}Z`, o.bc || '#ffcf3a');
      case 'snout': return S(`M0 ${y - 2} Q2 ${y + 10} 0 ${y + 16}`, m, 7) + C(0, y + 16, 3.4, INK);
      case 'hippo': return E(0, y + 4, 19, 11, s) + M(E(-6, y + 1, 2.4, 3, shade(s, -.4))) + S(`M-8 ${y + 10} Q0 ${y + 13} 8 ${y + 10}`, INK, 1.8);
      case 'capy':  return E(0, y + 3, 12, 8, shade(m, -.12)) + E(0, y, 5, 3, INK) + smile(y + 7, 3);
      case 'pug':   return E(0, y + 1, 12, 9, o.d || INK) + E(0, y - 1, 4.5, 3.2, INK) + S(`M-4 ${y + 5} Q0 ${y + 8} 4 ${y + 5}`, '#fff', 1.6);
      case 'tapir': return S(`M0 ${y - 2} Q2 ${y + 10} 7 ${y + 12}`, shade(m, -.08), 8) + smile(y + 4, 3);
      case 'mole':  return C(0, y, 5, '#ff9ec0') + smile(y + 6, 3);
      case 'dino':  return S(`M-12 ${y + 3} Q0 ${y + 10} 12 ${y + 3}`, INK, 2) + M(P(`M-7 ${y + 4.6} L-5 ${y + 8.5} L-3 ${y + 6}Z`, '#fff')) + M(C(-4, y - 4, 1.2, INK));
      case 'mandrill': return E(0, y, 6, 9, '#e8455f') + M(E(-10, y, 5, 8, '#5aa0e0')) + smile(y + 10, 4);
      default:      return E(0, y - 1, 3.6, 2.6, n) + smile(y + 3, 3.5);
    }
  }
  function patHead(t, hc, d, s, m){
    switch (t){
      case 'tiger': case 'zebra': return S(`M-6 ${hc - 20} L-3 ${hc - 12} M0 ${hc - 21} V${hc - 13} M6 ${hc - 20} L3 ${hc - 12}`, d, 2.4) + M(S(`M-25 ${hc - 2} L-17 ${hc} M-24 ${hc + 5} L-17 ${hc + 5}`, d, 2.4));
      case 'spots':  return [[-13, hc - 12, 2.4], [13, hc - 13, 2], [4, hc - 17, 1.8], [-5, hc - 18, 1.6]].map(([x, y, r]) => C(x, y, r, d)).join('');
      case 'rosette':return [[-13, hc - 12], [12, hc - 14], [1, hc - 18]].map(([x, y]) => C(x, y, 2.8, 'none', `stroke="${d}" stroke-width="1.5"`)).join('');
      case 'patch':  return E(12, hc - 9, 8.5, 7.5, d);
      case 'calico': return E(-12, hc - 12, 9, 7, '#ff9a3d') + E(13, hc - 10, 7, 6, INK);
      case 'mask':   return E(0, hc - 2, 22, 7.5, d);
      case 'panda':  return M(E(-10, hc - 1, 7, 8.5, d, R(-25, -10, hc - 1)));
      case 'cheek':  return P(`M-25 ${hc + 3} Q-14 ${hc + 24} 0 ${hc + 17} Q14 ${hc + 24} 25 ${hc + 3} Q19 ${hc + 21} 0 ${hc + 22} Q-19 ${hc + 21} -25 ${hc + 3}Z`, s);
      case 'face':   return E(0, hc + 4, 17, 14, s) + M(C(-7, hc - 3, 8, s));
      case 'husky':  return P(`M0 ${hc - 14} Q-10 ${hc - 6} -16 ${hc - 6} Q-22 ${hc + 4} -12 ${hc + 18} L12 ${hc + 18} Q22 ${hc + 4} 16 ${hc - 6} Q10 ${hc - 6} 0 ${hc - 14}Z`, s);
      case 'blaze':  return P(`M-3 ${hc - 20} L-4 ${hc + 6} L4 ${hc + 6} L3 ${hc - 20}Z`, s);
      case 'badger': return M(P(`M-7 ${hc - 20} Q-13 ${hc - 6} -9 ${hc + 8} L-17 ${hc + 6} Q-22 ${hc - 6} -15 ${hc - 16}Z`, d));
      case 'skunk':  return P(`M-5 ${hc - 21} Q0 ${hc - 8} 5 ${hc - 21}Z`, '#fff');
      case 'redpanda': return E(0, hc + 9, 12, 8, '#fff') + M(E(-10, hc - 9, 3.2, 2.2, '#fff') + P(`M-24 ${hc + 1} Q-17 ${hc + 2} -15 ${hc + 13} Q-22 ${hc + 10} -24 ${hc + 1}Z`, '#fff'));
      case 'lemur':  return E(0, hc + 4, 17, 13, '#fff') + M(E(-9, hc - 2, 6.2, 6.6, d));
      case 'meerkat':return M(E(-10, hc - 2, 6, 7, d, R(-15, -10, hc - 2)));
      case 'sloth':  return E(0, hc + 2, 18, 14, s) + M(P(`M-18 ${hc - 5} Q-10 ${hc - 6} -4 ${hc + 1} Q-10 ${hc + 3} -18 ${hc}Z`, d));
      case 'point':  return E(0, hc + 9, 11, 7.5, d, 'opacity=".55"');
      case 'giraffe':return [[-11, hc - 11], [10, hc - 14], [0, hc - 18]].map(([x, y]) => P(`M${x - 4} ${y - 3} h8 l1 6 l-6 2 l-4 -2Z`, d)).join('');
      case 'chipmunk': return S(`M0 ${hc - 21} V${hc - 11}`, d, 3) + M(S(`M-20 ${hc - 4} L-12 ${hc - 3}`, d, 2));
      case 'gibbon': return E(0, hc + 3, 18, 15, '#fff') + E(0, hc + 3, 14, 11, d === '#fff' ? s : m);
      case 'devil':  return '';
      default: return '';
    }
  }
  function patBody(t, d){
    switch (t){
      case 'tiger':  return M(S('M-20 20 Q-13 22 -15 28 M-18 33 Q-12 33 -12 38', d, 2.4));
      case 'zebra':  return M(S('M-20 18 Q-12 20 -14 27 M-19 28 Q-11 30 -12 36 M-15 38 Q-10 38 -9 41', d, 2.6));
      case 'spots':  return [[-12, 22, 2.6], [10, 19, 2.2], [-6, 35, 2], [14, 30, 2.6], [3, 25, 1.8], [-16, 30, 2]].map(([x, y, r]) => C(x, y, r, d)).join('');
      case 'rosette':return [[-12, 22], [11, 20], [14, 31], [-15, 32]].map(([x, y]) => C(x, y, 3, 'none', `stroke="${d}" stroke-width="1.5"`) + C(x, y, .9, d)).join('');
      case 'patch':  return E(-12, 22, 7, 5.5, d) + E(13, 31, 6, 4.5, d);
      case 'calico': return E(-12, 24, 7, 6, '#ff9a3d') + E(12, 32, 6, 5, INK);
      case 'giraffe':return [[-12, 22], [8, 19], [14, 31], [-6, 33]].map(([x, y]) => P(`M${x - 5} ${y - 3} h9 l1 6 l-7 2 l-4 -3Z`, d)).join('');
      case 'chipmunk': return M(S('M-8 14 Q-12 26 -10 36', d, 2.5));
      case 'okapi':  return M(S('M-19 32 H-9 M-19 36 H-9 M-18 40 H-8', d, 2));
      case 'skunk':  return P('M-4 11 Q0 30 4 11Z', '#fff');
      case 'anteater': return P('M-21 18 L6 13 L9 18 L-19 25Z', INK) + P('M-20 24 L8 18 L9 20 L-19 27Z', '#fff');
      case 'tapir':  return E(0, 20, 18, 5.5, '#fff');
      case 'devil':  return P('M-12 15 Q0 20 12 15 Q0 23 -12 15Z', '#fff');
      default: return '';
    }
  }
  function tailQ(t, o, m, s, d){
    const tc = o.tc || m, L = ol(tc);
    switch (t){
      case 'thin':   return (L ? S('M18 32 Q34 34 36 20 Q37 12 32 10', shade(tc, -.17), 7) : '') + S('M18 32 Q34 34 36 20 Q37 12 32 10', tc, 5);
      case 'tuft':   return S('M18 32 Q34 36 38 22', tc, 4) + E(39, 18, 4.2, 6.5, o.tuc || d);
      case 'fluffy': return P('M16 32 Q46 34 41 2 Q35 18 16 20Z', tc, L) + P('M41 2 Q44 12 38 18 Q36 10 41 2Z', o.tip || s);
      case 'squirrel': return P('M12 34 Q46 40 43 8 Q40 -10 26 -6 Q36 6 31 16 Q26 24 12 24Z', tc) + S('M38 8 Q38 22 24 28', shade(tc, .3), 3);
      case 'stub':   return C(19, 35, 5.5, o.tip || s, ol(o.tip || s));
      case 'curly':  return S('M18 30 q9 -1 8 -8 q-1 -5 -5 -3 q-3 3 2 5', tc, 2.6);
      case 'ring':   return P('M16 32 Q46 34 41 2 Q35 18 16 20Z', tc) + S('M24 27 Q30 24 29 18 M32 25 Q38 20 37 13 M38 15 Q42 10 41 5', o.rc || d, 3.4);
      case 'lemur':  return S('M18 34 Q44 40 42 14 Q40 -2 32 -2', '#fff', 6) + S('M26 37 L28 33 M36 33 L33 31 M41 24 L37 24 M41 13 L37 14 M38 3 L35 5', INK, 6, 'stroke-linecap="butt"');
      case 'flat':   return E(27, 38, 12, 6.5, o.tc || d, R(-20, 27, 38)) + S('M20 36 L34 41 M22 41 L32 34', shade(o.tc || d, -.3), 1.2);
      case 'long':   return S('M18 32 Q42 36 40 12 Q38 0 29 4 Q24 8 30 12', tc, 4.5);
      case 'horse':  return P('M16 24 Q36 22 38 40 Q32 40 30 34 Q28 41 23 38 Q24 31 16 30Z', o.tc || d, ol(o.tc || d));
      case 'thick':  return P('M14 28 Q36 30 46 18 Q42 38 16 38Z', tc);
      case 'spade':  return P('M14 28 Q36 30 44 16 Q42 36 16 38Z', tc) + P('M42 8 L50 14 L46 22 L40 15Z', o.tuc || d);
      case 'spike':  return P('M14 28 Q36 30 46 18 Q42 38 16 38Z', tc) + P('M38 22 L42 12 L44 22Z M43 18 L49 10 L48 21Z', o.tuc || '#fff6d8');
      case 'club':   return P('M14 28 Q36 30 44 22 Q42 36 16 38Z', tc) + C(45, 23, 6, o.tuc || d);
      case 'curlup': return P('M14 24 Q32 26 31 10 Q29 2 21 6 Q27 10 23 16 Q19 20 14 20Z', tc, L) + C(23, 8, 3.5, o.tip || s);
      case 'serpent':return S('M14 32 Q30 42 36 30 Q42 18 34 10 Q28 4 38 -2', tc, 9) + S('M14 32 Q30 42 36 30 Q42 18 34 10 Q28 4 38 -2', o.tip || s, 3, 'stroke-dasharray="1 6"');
      case 'nine': { let r = ''; for (let i = 0; i < 9; i++){ const a = -64 + i * 16; r += `<g ${R(a, 6, 34)}>${P('M4 32 Q8 -2 -2 -14 Q16 -6 12 32Z', tc)}${P('M-2 -14 Q6 -12 8 -2 Q2 -6 -2 -14Z', o.tip || s)}</g>`; } return r; }
      default: return '';
    }
  }
  function Q(o){
    const m = o.m, s = o.s || shade(m, .72), d = o.d || shade(m, -.35), ie = o.ie || '#ffc9d6';
    const hm = o.hm || m;                                  // 머리 색 (그리핀처럼 몸과 다를 때)
    const hy = o.hy || 0, hc = -6 + hy, hw = o.hw || 25, hh = o.hh || 21;
    const X = (k) => (o.x || []).includes(k);
    let B = '';
    B += tailQ(o.tail || 'stub', o, m, s, d);
    if (X('batwing')) B += M(P('M-16 16 Q-36 -4 -46 6 Q-40 10 -40 16 Q-34 14 -32 22 Q-26 18 -22 26Z', o.wc || d));
    if (X('wing'))    B += M(P('M-15 14 Q-30 -12 -47 -10 Q-42 -4 -46 0 Q-40 4 -44 8 Q-36 12 -40 18 Q-30 18 -30 24 Q-22 20 -15 24Z', o.wc || '#ffffff', `stroke="${o.wd || '#cfe0ee'}" stroke-width="2" stroke-linejoin="round"`));
    if (X('dwing'))   B += M(P('M-14 12 Q-24 -18 -44 -16 L-38 -8 L-47 -3 L-38 3 L-45 11 L-34 13 L-37 21 L-16 22Z', o.wc || d));
    if (X('glide'))   B += M(P('M-18 18 L-30 20 Q-30 34 -16 36Z', shade(m, -.12)));
    if (o.mane){ let mn = ''; for (let i = 0; i < 14; i++){ const a = i / 14 * Math.PI * 2; mn += C(Math.cos(a) * 26, hc + Math.sin(a) * 23, 9.5, o.mane); } B += mn + E(0, hc, 28, 25, o.mane); }
    if (X('shag'))   B += E(0, hc - 1, 31, 26, shade(m, -.15));
    if (X('frill'))  B += P(`M-34 ${hc + 4} Q-36 ${hc - 34} 0 ${hc - 38} Q36 ${hc - 34} 34 ${hc + 4} Q0 ${hc - 6} -34 ${hc + 4}Z`, o.fc || d) + [-24, -12, 0, 12, 24].map(x => C(x, hc - 26 - (x === 0 ? 6 : Math.abs(x) < 15 ? 4 : 0), 2.4, shade(o.fc || d, .4))).join('');
    const LM = ol(m), LH = ol(hm);
    if (o.ear === 'elephant') B += M(C(-27, hc + 3, 17, o.ec || shade(m, -.06)) + C(-28, hc + 3, 11, ie));
    if (o.ear === 'koala')    B += M(C(-24, hc - 12, 12, m) + C(-24, hc - 12, 7.5, '#f4f4f4'));
    if (o.ear === 'huge')     B += M(P(`M-12 ${hc - 14} L-34 ${hc - 46} L-25 ${hc - 4}Z`, m) + P(`M-15 ${hc - 16} L-30 ${hc - 38} L-24 ${hc - 9}Z`, ie));
    if (hy < -3) B += P(`M-9 ${hc + 12} Q-11 6 -12 18 L12 18 Q11 6 9 ${hc + 12}Z`, m) + (o.pat === 'giraffe' ? P(`M-8 ${hc + 18} h6 l1 5 l-6 2Z M3 ${hc + 24} h6 l0 5 l-6 1Z`, d) : '');
    if (X('plates')) B += [-15, -3, 9].map((x, i) => P(`M${x - 6} 14 L${x} ${1 - (i % 2) * 4} L${x + 6} 14Z`, o.pc || d)).join('');
    if (X('spine'))  B += [-12, -2, 8].map(x => P(`M${x - 4} 13 L${x} 5 L${x + 4} 13Z`, o.pc || d)).join('');
    if (X('hump'))   B += E(15, 9, 12, 11, m) + E(15, 9, 12, 11, 'none', `stroke="${shade(m, -.2)}" stroke-width="1.2"`);   // v0.38.0 등 혹이 뒤로 보이게
    if (X('quills')) { let q = ''; for (let i = 0; i < 11; i++){ const a = Math.PI * (1.05 + i * .09); q += P(`M${f1(Math.cos(a) * 18)} ${f1(hc + 6 + Math.sin(a) * 16)} L${f1(Math.cos(a) * 36)} ${f1(hc + 6 + Math.sin(a) * 33)} L${f1(Math.cos(a + .12) * 18)} ${f1(hc + 6 + Math.sin(a + .12) * 16)}Z`, o.qc || shade(m, -.45)); } B += q + E(0, 20, 27, 22, o.qc || shade(m, -.45)); }
    if (X('fireball')) B += M(C(-38, -24, 4.5, '#8fd0ff') + C(-38, -24, 2.5, '#fff'));
    // 몸
    let body = '';
    const bw = X('longbody') ? 26 : 21;
    // v0.38.0 앉은 모습: 뒷다리(엉덩이) → 몸 → 아래쪽 그늘 → 배 → 앞발 두 개 (예전엔 동그란 몸에 발 두 개만)
    const legs = o.legs !== false && !X('tinyarms') && !X('arms') && !X('shellhold') && !X('wool');
    const fc = o.f || m;
    if (legs) body += M(E(-bw + 4, 36, 9.5, 7.5, m, LM) + E(-bw + 1, 42.4, 7.5, 3.4, o.f || shade(m, -.15)));
    body += E(0, 26, bw, 16, m, LM);
    { const k = .9, x = bw * k, y = 26 + 16 * Math.sqrt(1 - k * k);
      body += P(`M${f1(-x)} ${f1(y)} A${bw} 16 0 0 0 ${f1(x)} ${f1(y)} Q0 ${f1(y + 4)} ${f1(-x)} ${f1(y)}Z`, shade(m, -.14), 'opacity=".45"'); }
    if (X('wool')) body += [-14, -5, 5, 14].map((x, i) => C(x, 18 + (i % 2) * 3, 9, o.wo || '#ffffff', ol(o.wo || '#fff'))).join('') + E(0, 28, 21, 13, o.wo || '#ffffff', ol(o.wo || '#fff')) + [-14, -5, 5, 14].map((x, i) => C(x, 18 + (i % 2) * 3, 7.6, o.wo || '#ffffff')).join('');
    if (X('shag2')) body += M(P('M-21 22 L-24 30 L-18 28 L-20 36 L-14 32Z', shade(m, -.12)));
    if (o.belly !== false) body += legs ? E(0, 27, 11.5, 10, s) : E(0, 30, 12, 10, s);
    body += patBody(o.pat, o.pd || d);
    if (X('pouch')) body += S('M-8 30 Q0 37 8 30', shade(m, -.25), 2);
    if (X('moon'))  body += P('M-10 16 Q0 25 10 16 Q0 21 -10 16Z', '#fff');
    if (X('shell')) body += [17, 23, 29, 35].map(y => S(`M-18 ${y} Q0 ${y + 4} 18 ${y}`, shade(m, -.3), 1.6)).join('');
    if (X('scales')) body += [18, 25, 32].map(y => [-12, -4, 4, 12].map(x => S(`M${x - 4} ${y} Q${x} ${y + 5} ${x + 4} ${y}`, shade(m, -.3), 1.5)).join('')).join('');
    if (X('bell'))  body += S('M-12 13 Q0 18 12 13', '#e8455f', 3) + C(0, 18, 4, '#ffd54a') + S('M-2 19 H2', '#a87a00', 1.2);
    if (X('bolt'))  body += P('M2 16 L-5 27 L0 27 L-3 37 L6 24 L1 24 L4 16Z', '#ffe066');
    if (legs){                                                             // 앞발: 다리 선 한 줄 + 동그란 앞발 (인형처럼 앉은 모습)
      const ff = o.f || m;
      body += M(S('M-12.6 27 Q-13.4 34 -11.8 38.6', shade(m, -.26), 1.5) + E(-7.6, 40.6, 6.4, 4.6, ff, ol(ff) || `stroke="${shade(ff, -.24)}" stroke-width="1.2"`) +
        S('M-9.4 38.4 V40.4 M-6 38.4 V40.4', shade(ff, -.34), 1.1));
    } else body += M(E(-11, 41, 8, 4.5, o.f || shade(m, -.15)));
    if (X('tinyarms')) body += M(E(-13, 20, 3.6, 6, m, R(35, -13, 20)));
    if (X('arms'))  body += M(E(-17, 25, 5, 8.5, o.f || shade(m, -.12), R(20, -17, 25)));
    if (X('shellhold')) body += P('M-8 22 Q0 14 8 22 Q0 26 -8 22Z', '#ffcf9a') + M(E(-9, 23, 4, 5, m));
    // 머리
    let head = '';
    head += earQ(o.ear, hc, hm, ie, o);
    head += E(0, hc, hw, hh, hm, LH);
    if (o.cheekbulge !== false) head += M(E(-hw * .6, hc + hh * .36, hw * .48, hh * .52, hm));   // v0.38.0 통통한 볼 (얼굴 아래쪽을 넓게)
    head += patHead(o.pat, hc, o.pd || d, s, hm);
    head += S(`M${f1(-hw * .62)} ${f1(hc - hh * .38)} Q${f1(-hw * .32)} ${f1(hc - hh * .86)} ${f1(hw * .12)} ${f1(hc - hh * .84)}`, '#ffffff', 2.6, 'opacity=".38"');   // 광택 줄
    if (X('wool'))   head += M(C(-12, hc - 17, 8, o.wo || '#fff', ol(o.wo || '#fff'))) + C(0, hc - 21, 9, o.wo || '#fff', ol(o.wo || '#fff'));
    if (X('poodle')) head += M(C(-12, hc - 18, 8.5, hm, LH) + C(-26, hc + 2, 8, hm, LH) + C(-25, hc + 12, 7, hm, LH)) + C(0, hc - 22, 9.5, hm, LH);
    if (X('fluff'))  head += M(C(-23, hc + 6, 7, hm, LH) + C(-20, hc + 13, 6, hm, LH));
    if (X('cheeks')) head += M(C(-17, hc + 7, 8, s));
    if (X('shaghead')) head += P(`M-22 ${hc - 8} Q-10 ${hc - 26} 0 ${hc - 22} Q10 ${hc - 26} 22 ${hc - 8} Q10 ${hc - 14} 0 ${hc - 12} Q-10 ${hc - 14} -22 ${hc - 8}Z`, shade(m, -.15));
    // 눈
    const ey = hc - 2 + (o.ey || 0), ex = o.ex || 10;
    if (o.eye === 'sleepy') head += M(S(`M${-ex - 4} ${ey} Q${-ex} ${ey + 3} ${-ex + 4} ${ey}`, INK, 2.2));
    else if (o.eye === 'small') head += M(C(-ex, ey, 2.4, INK));
    else if (o.eye === 'white') head += whiteEyes(ey, ex);
    else if (o.iris) head += irisEyes(ey, ex, o.iris);
    else head += eyes(ey, ex);
    if (X('brows'))  head += M(E(-10, ey - 7, 6, 2.6, o.bw || shade(m, .5), R(-10, -10, ey - 7)));
    head += muzQ(o.muz || 'small', hc, o, hm, s);
    head += blush(hc + 6, 17);
    if (o.ear === 'flop' || o.ear === 'lop') head += M(E(-25, hc + 6, 7.5, 14, o.ec || shade(m, -.18), R(18, -25, hc + 6) + ' ' + ol(o.ec || shade(m, -.18))));
    // 뿔 · 장식
    const hcol = o.hc || '#f2e6c8';
    if (X('antler'))  head += M(S(`M-11 ${hc - 18} Q-15 ${hc - 30} -24 ${hc - 37} M-15 ${hc - 27} L-25 ${hc - 26} M-19 ${hc - 33} L-17 ${hc - 42}`, o.hc || '#a8784a', 3.4));
    if (X('moose'))   head += M(P(`M-11 ${hc - 17} Q-20 ${hc - 22} -26 ${hc - 33} L-33 ${hc - 40} L-33 ${hc - 31} L-42 ${hc - 33} L-40 ${hc - 25} Q-30 ${hc - 15} -15 ${hc - 13}Z`, o.hc || '#d9b88a'));
    if (X('horns'))   head += M(S(`M-15 ${hc - 16} Q-26 ${hc - 20} -26 ${hc - 32}`, hcol, 4.5));
    if (X('buff'))    head += M(S(`M-12 ${hc - 18} Q-34 ${hc - 24} -34 ${hc - 6} Q-34 ${hc + 2} -28 ${hc + 2}`, o.hc || '#5a5a62', 6));
    if (X('ram'))     head += M(S(`M-13 ${hc - 16} Q-32 ${hc - 27} -33 ${hc - 6} Q-33 ${hc + 7} -22 ${hc + 4} Q-16 ${hc} -22 ${hc - 6}`, o.hc || '#d8c4a0', 5.5));
    if (X('goat'))    head += M(S(`M-8 ${hc - 19} Q-12 ${hc - 34} -22 ${hc - 38}`, o.hc || '#c8b898', 4));
    if (X('gazelle')) head += M(S(`M-6 ${hc - 19} Q-8 ${hc - 36} -15 ${hc - 47}`, o.hc || '#4a3a2a', 3) + S(`M-8 ${hc - 26} l3 1 M-9 ${hc - 32} l3 1`, '#fff', 1));
    if (X('ossicone'))head += M(S(`M-7 ${hc - 19} L-9 ${hc - 30}`, o.hc || shade(m, -.2), 4) + C(-9, hc - 31, 3.4, o.hk || '#8a5a2a'));
    if (X('rhino'))   head += P(`M-6 ${hc + 5} L0 ${hc - 13} L6 ${hc + 5}Z`, o.hc || '#e8e0d0');
    if (X('unihorn')) head += P(`M-5 ${hc - 18} L0 ${hc - 43} L5 ${hc - 18}Z`, '#ffd54a', 'stroke="#e0a100" stroke-width="1.5" stroke-linejoin="round"') + S(`M-3 ${hc - 25} L3 ${hc - 28} M-2 ${hc - 32} L2 ${hc - 34}`, '#e0a100', 1.3);
    if (X('hornsingle')) head += P(`M-3.5 ${hc - 19} L0 ${hc - 32} L3.5 ${hc - 19}Z`, '#ffd54a', 'stroke="#e0a100" stroke-width="1.2"');
    if (X('dhorns'))  head += M(P(`M-12 ${hc - 16} Q-17 ${hc - 31} -8 ${hc - 36} Q-11 ${hc - 26} -6 ${hc - 19}Z`, o.hc || '#ffe9a8'));
    if (X('trihorn')) head += M(S(`M-9 ${hc - 15} L-14 ${hc - 33}`, '#fff6d8', 4)) + P(`M-3 ${hc + 5} L0 ${hc - 4} L3 ${hc + 5}Z`, '#fff6d8');
    if (X('tusk'))    head += M(P(`M-7 ${hc + 13} Q-10 ${hc + 22} -4 ${hc + 26} Q-6 ${hc + 18} -4 ${hc + 13}Z`, '#fffaf0'));
    if (X('bigtusk')) head += M(S(`M-7 ${hc + 13} Q-20 ${hc + 32} -4 ${hc + 36}`, '#fffaf0', 4.5));
    if (X('whisker')) head += M(S(`M-12 ${hc + 9} L-26 ${hc + 6} M-12 ${hc + 12} L-26 ${hc + 13}`, '#6a7a92', 1.1));
    if (X('teeth'))   head += P(`M-3.2 ${hc + 13} H3.2 V${hc + 18.5} H-3.2Z`, '#fff', `stroke="${INK}" stroke-width=".8"`);
    if (X('fang'))    head += M(P(`M-4 ${hc + 13} L-2.6 ${hc + 17.5} L-1.2 ${hc + 13}Z`, '#fff'));
    if (X('mohawk'))  head += P(`M-6 ${hc - 20} L-3 ${hc - 29} L0 ${hc - 21} L3 ${hc - 30} L6 ${hc - 20}Z`, d);
    if (X('mane2'))   head += P(`M-2 ${hc - 22} Q-20 ${hc - 26} -27 ${hc - 8} Q-29 ${hc + 6} -22 ${hc + 15} Q-21 ${hc} -15 ${hc - 9} Q-8 ${hc - 16} 7 ${hc - 19} Q4 ${hc - 23} -2 ${hc - 22}Z`, o.mc || d);
    if (X('beard'))   head += P(`M-6 ${hc + 17} Q0 ${hc + 31} 6 ${hc + 17}Z`, o.bc2 || '#e8e8e8');
    if (X('schnauzer')) head += E(0, hc + 14, 13, 8, '#e8e8ec') + M(E(-9, hc - 8, 6, 2.4, '#e8e8ec'));
    if (X('jowl'))    head += M(E(-9, hc + 13, 7, 5.5, o.s || '#fff'));
    if (X('eastdragon')) head += M(S(`M-8 ${hc + 8} Q-24 ${hc + 8} -36 ${hc - 6}`, '#ffd54a', 1.8));
    if (X('yuzu'))    head += C(0, hc - 23, 6, '#ffcf3a') + P(`M0 ${hc - 29} q4 -4 7 -1 q-4 2 -7 1Z`, '#5cc46a');
    if (X('tear'))    head += M(S(`M-11 ${ey + 4} Q-12 ${hc + 9} -7 ${hc + 13}`, INK, 1.8));
    if (X('flamehead')) head += P(`M-8 ${hc - 18} Q-10 ${hc - 30} -2 ${hc - 34} Q-2 ${hc - 26} 2 ${hc - 24} Q4 ${hc - 34} 10 ${hc - 34} Q8 ${hc - 26} 8 ${hc - 18}Z`, '#ff7a3d');
    return { svg: B + body + head, top: hc - hh, eye: ey, ex, neck: hy < -3 ? hc + 19 : 12 };
  }

  /* ---------- 새 ---------- */
  function crestB(t, o, top, fy, m){
    const cc = o.cc || shade(m, -.2);
    switch (t){
      case 'comb':  return P(`M-7 ${top + 4} Q-8 ${top - 6} -2 ${top - 3} Q0 ${top - 11} 3 ${top - 3} Q9 ${top - 7} 8 ${top + 4}Z`, o.cc || '#ff5d5d');
      case 'tuft':  return M(P(`M-19 ${top + 7} L-24 ${top - 8} L-9 ${top + 2}Z`, cc));
      case 'cockatoo': return [-12, -4, 4].map(dx => P(`M0 ${top + 4} Q${dx - 6} ${top - 14} ${dx} ${top - 22} Q${dx + 3} ${top - 8} 5 ${top + 4}Z`, cc)).join('');
      case 'point': return P(`M-8 ${top + 6} Q2 ${top - 16} 14 ${top - 12} Q6 ${top - 4} 8 ${top + 6}Z`, o.cc || m);
      case 'plume': return S(`M0 ${top + 2} Q2 ${top - 10} 9 ${top - 11}`, cc, 3) + C(9.5, top - 11, 3, cc);
      case 'crown': return [-6, 0, 6].map(x => S(`M${x * .5} ${top + 2} L${x} ${top - 9}`, cc, 1.4) + C(x, top - 10, 2.4, cc)).join('');
      case 'red':   return E(0, top + 4, 7, 3.4, '#e8455f');
      case 'flame': return P(`M-10 ${top + 7} Q-16 ${top - 10} -5 ${top - 19} Q-6 ${top - 8} 0 ${top - 5} Q2 ${top - 22} 11 ${top - 24} Q6 ${top - 10} 11 ${top + 7}Z`, '#ff7a3d') + P(`M-5 ${top + 6} Q-6 ${top - 4} 0 ${top - 6} Q2 ${top - 14} 6 ${top - 14} Q4 ${top - 4} 6 ${top + 6}Z`, '#ffe066');
      case 'rock':  return M(S(`M-6 ${fy - 5} Q-14 ${fy - 9} -21 ${fy - 17}`, '#ffd54a', 2.6));
      case 'emperor': return M(E(-17, fy + 6, 5, 7.5, '#ffcf5a'));
      case 'heron': return S(`M2 ${top + 2} Q14 ${top - 4} 26 ${top + 4}`, INK, 2);
      case 'ptera': return P(`M-4 ${top + 6} L22 ${top - 14} L6 ${top + 8}Z`, o.cc || shade(m, -.2));
      case 'mandarin': return P(`M-10 ${top + 6} Q4 ${top - 12} 26 ${top + 10} Q8 ${top + 4} 6 ${top + 10}Z`, o.cc || '#ff8a3d') + M(S(`M-6 ${fy - 6} Q-14 ${fy - 4} -20 ${fy + 2}`, '#fff', 3));
      default: return '';
    }
  }
  function beakB(t, fy, bk){
    switch (t){
      case 'duck':   return E(0, fy + 9, 9.5, 4.6, bk) + S(`M-7 ${fy + 9} H7`, shade(bk, -.3), 1);
      case 'hook':   return P(`M-5.5 ${fy + 5} Q0 ${fy + 2} 5.5 ${fy + 5} Q6 ${fy + 13} 1 ${fy + 16} Q2.5 ${fy + 10} -5.5 ${fy + 5}Z`, bk);
      case 'bighook':return P(`M-8 ${fy + 4} Q0 ${fy} 8 ${fy + 4} Q9 ${fy + 16} 2 ${fy + 21} Q3.5 ${fy + 12} -8 ${fy + 4}Z`, bk) + P(`M-5 ${fy + 9} Q0 ${fy + 15} 3 ${fy + 12} Q0 ${fy + 9} -5 ${fy + 9}Z`, shade(bk, -.35));
      case 'long':   return P(`M-2.6 ${fy + 6} L2.6 ${fy + 6} L1 ${fy + 28} Q0 ${fy + 29} -1 ${fy + 28}Z`, bk);
      case 'side':   return P(`M-3 ${fy + 4} L3 ${fy + 4} L19 ${fy + 22} Q17 ${fy + 23} 15 ${fy + 22}Z`, bk);
      case 'needle': return S(`M2 ${fy + 6} L26 ${fy + 12}`, bk, 2.2);
      case 'toucan': return '<g transform="translate(3 8)">' + P(`M-6 ${fy + 2} Q18 ${fy - 4} 31 ${fy + 8} Q27 ${fy + 16} 6 ${fy + 12} Q-4 ${fy + 12} -6 ${fy + 2}Z`, bk) + P(`M26 ${fy + 3} Q31 ${fy + 6} 31 ${fy + 8} Q29 ${fy + 12} 26 ${fy + 13}Z`, INK) + S(`M-2 ${fy + 7} Q12 ${fy + 4} 22 ${fy + 9}`, '#ffe066', 2) + '</g>';
      case 'hornbill': return '<g transform="translate(3 8)">' + P(`M-6 ${fy + 2} Q18 ${fy - 2} 28 ${fy + 10} Q24 ${fy + 15} 6 ${fy + 12} Q-4 ${fy + 12} -6 ${fy + 2}Z`, bk) + P(`M-5 ${fy - 1} Q10 ${fy - 12} 22 ${fy + 2} L20 ${fy + 4} Q10 ${fy - 4} -5 ${fy + 3}Z`, shade(bk, -.15)) + '</g>';
      case 'pelican':return E(0, fy + 20, 6.5, 9, '#ffd9a8') + P(`M-4.5 ${fy + 4} H4.5 L3 ${fy + 29} Q0 ${fy + 32} -3 ${fy + 29}Z`, bk);
      case 'flamingo': return P(`M-4 ${fy + 4} Q8 ${fy + 2} 8 ${fy + 12} L3 ${fy + 21} Q1 ${fy + 13} -4 ${fy + 9}Z`, '#fff6f8') + P(`M5.6 ${fy + 15} L3 ${fy + 21} Q2 ${fy + 17} 3.4 ${fy + 14}Z`, INK);
      case 'puffin': return P(`M-6.5 ${fy + 4} H6.5 L0 ${fy + 17}Z`, '#ff7a3d') + S(`M-3.4 ${fy + 9} H3.4`, '#ffd54a', 1.8) + P(`M-6.5 ${fy + 4} H6.5 L5 ${fy + 6.5} H-5Z`, '#9aa0aa');
      case 'dodo':   return P(`M-7 ${fy + 3} Q4 ${fy - 2} 12 ${fy + 6} Q14 ${fy + 16} 6 ${fy + 18} Q8 ${fy + 10} -4 ${fy + 12} Q-8 ${fy + 8} -7 ${fy + 3}Z`, bk);
      case 'gull':   return P(`M-4.5 ${fy + 6} H4.5 L0 ${fy + 14}Z`, bk) + C(1.5, fy + 10, 1.4, '#e8455f');
      default:       return P(`M-4.5 ${fy + 6} H4.5 L0 ${fy + 12}Z`, bk);
    }
  }
  function tailB(t, o, by, w, m){
    const tc = o.tc || w;
    switch (t){
      case 'fan': { let r = ''; for (let i = -3; i <= 3; i++){ const a = i * 23; r += `<g ${R(a, 0, by + 8)}>${E(0, by - 26, 8, 22, tc)}${o.eyespot ? C(0, by - 36, 4.6, '#3a8ae0', `stroke="#ffd54a" stroke-width="2"`) : ''}</g>`; } return r; }
      case 'long':  return P(`M12 ${by + 12} Q40 ${by + 16} 48 ${by + 38} Q34 ${by + 30} 14 ${by + 24}Z`, tc) + P(`M14 ${by + 16} Q34 ${by + 26} 38 ${by + 44} Q26 ${by + 34} 12 ${by + 26}Z`, shade(tc, .2));
      case 'phoenix': return [0, 1, 2].map(i => P(`M12 ${by + 10 + i * 3} Q${36 + i * 4} ${by + 8 + i * 6} ${46 - i * 2} ${by + 30 + i * 6} Q${34 - i * 2} ${by + 26 + i * 4} 12 ${by + 20 + i * 3}Z`, ['#ff5d3d', '#ff9a3d', '#ffd54a'][i])).join('');
      case 'fork':  return P(`M12 ${by + 14} L42 ${by + 26} L30 ${by + 24} L40 ${by + 40} L16 ${by + 26}Z`, tc);
      case 'up':    return P(`M16 ${by + 14} L33 ${by - 4} L29 ${by + 22}Z`, tc);
      default:      return '';
    }
  }
  function Bd(o){
    const m = o.m, s = o.s || shade(m, .7), w = o.w || shade(m, -.15), bk = o.bk || '#ffb03a', lc = o.lc || '#ff9a3d';
    const X = (k) => (o.x || []).includes(k);
    const neck = X('neck'), longleg = o.leg === 'long';
    let by = longleg ? 2 : 10, rx = 27, ry = longleg ? 25 : 31, fy = by - 16;
    if (neck){ by = longleg ? 16 : 26; rx = 26; ry = 15; fy = -22; }
    let back = tailB(o.tail, o, neck ? by - 4 : by, w, m), out = '';
    if (X('fanback')) back = tailB('fan', o, by, w, m) + back;
    if (longleg) out += M(S(`M-7 ${by + ry - 4} V42`, lc, 3) + E(-9, 43, 5, 2.2, lc));
    else if (o.leg !== 'none') out += M(P('M-10 37 V41 M-10 41 L-14.6 44.2 M-10 41 L-10 44.8 M-10 41 L-5.4 44.2', 'none', `stroke="${lc}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"`));   // v0.38.0 발가락 세 개
    out += E(0, by, rx, ry, m, ol(m));
    { const k = .88, x = rx * k, y = by + ry * Math.sqrt(1 - k * k);         // v0.38.0 몸 아래 그늘
      out += P(`M${f1(-x)} ${f1(y)} A${rx} ${ry} 0 0 0 ${f1(x)} ${f1(y)} Q0 ${f1(y + ry * .22)} ${f1(-x)} ${f1(y)}Z`, shade(m, -.14), 'opacity=".45"'); }
    if (o.belly !== false) out += neck ? E(0, by + 4, rx * .6, ry * .6, s) : E(0, by + 10, 17, 18, s);
    if (o.pat === 'spots') out += [[-12, by - 6], [10, by - 10], [-6, by + 18], [12, by + 12], [2, by - 18]].map(([x, y]) => C(x, y, 2, o.pd || INK)).join('');
    if (o.pat === 'bars')  out += [0, 6, 12].map(y => S(`M-8 ${by + 6 + y} Q0 ${by + 8 + y} 8 ${by + 6 + y}`, o.pd || shade(m, -.3), 1.8)).join('');
    if (o.pat === 'necklace') out += S(`M-16 ${fy + 16} Q0 ${fy + 24} 16 ${fy + 16}`, INK, 3);
    if (o.pat === 'band')  out += S(`M-15 ${fy + 17} Q0 ${fy + 23} 15 ${fy + 17}`, o.pd || '#7ad0a0', 4);
    if (X('bolt')) out += P(`M3 ${by} L-5 ${by + 12} L0 ${by + 12} L-4 ${by + 24} L7 ${by + 8} L1 ${by + 8} L5 ${by}Z`, '#ffe066');
    if (neck) out += M(E(-11, by - 2, 14, 7, w, R(-12, -11, by - 2) + ' ' + ol(w)));
    else if (o.leg !== 'none' || X('wings')){                             // 날개 + 깃털 끝 줄 두 개 (v0.38.0)
      const wx = -rx + 3, wy = by + 4, wr = ry * .5;
      out += M(`<g ${R(16, wx, wy)}>` + E(wx, wy, 8, wr, w, ol(w)) + S(`M${f1(wx - 4)} ${f1(wy + wr * .35)} q2 ${f1(wr * .4)} 4 ${f1(wr * .5)} M${f1(wx)} ${f1(wy + wr * .3)} q2 ${f1(wr * .45)} 4.4 ${f1(wr * .55)}`, shade(w, -.28), 1.3) + '</g>');
    }
    if (X('blurwing')) out += M(E(-30, by - 12, 12, 6, '#e6f6ff', `opacity=".8" ${R(-30, -30, by - 12)}`));
    let top;
    if (neck){
      if (ol(o.nk || m)) out += S(`M7 ${by - 6} Q14 ${by - 22} 2 ${fy + 10}`, shade(o.nk || m, -.17), 14.5);
      out += S(`M7 ${by - 6} Q14 ${by - 22} 2 ${fy + 10}`, o.nk || m, 11);
      out += C(0, fy, 14, o.hd || m, ol(o.hd || m));
      top = fy - 14;
    } else top = by - ry;
    if (o.hood && !neck) out += P(`M${-rx + 1} ${fy + 8} Q${-rx} ${top} 0 ${top} Q${rx} ${top} ${rx - 1} ${fy + 8} Q0 ${fy + 15} ${-rx + 1} ${fy + 8}Z`, o.hood);
    if (o.face) out += neck ? C(0, fy + 1, 10, o.face) : E(0, fy + 4, 19, 15, o.face);
    if (o.pat === 'budgie') out += [0, 4, 8].map(y => S(`M-10 ${top + 6 + y} Q-5 ${top + 9 + y} 0 ${top + 6 + y} Q5 ${top + 9 + y} 10 ${top + 6 + y}`, INK, 1.2)).join('');
    if (o.cheek) out += M(C(-12, fy + 8, 3.6, o.cheek));
    out += crestB(o.cr, o, top, fy, m);
    out += neck ? S(`M-8 ${f1(fy - 6)} Q-4 ${f1(fy - 12)} 3 ${f1(fy - 12)}`, '#ffffff', 2.4, 'opacity=".38"')   // 광택 줄
                : S(`M${f1(-rx * .6)} ${f1(top + 9)} Q${f1(-rx * .3)} ${f1(top + 2)} ${f1(rx * .14)} ${f1(top + 2.4)}`, '#ffffff', 2.6, 'opacity=".38"');
    const ex = neck ? 6 : 9;
    if (o.eye === 'owl') out += M(C(-10, fy, 8.6, '#fff') + C(-10, fy, 5.4, o.iris || '#ffcf3a') + C(-10, fy, 3.2, INK) + glint2(-10, fy, 3.6));
    else if (o.mask) out += M(E(-ex, fy, 7, 5, o.mask)) + eyes(fy, ex, 3.6);
    else out += eyes(fy, ex, neck ? 3.4 : 4.2);
    out += beakB(o.beak || 'short', fy, bk);
    if (o.beak !== 'toucan' && o.beak !== 'hornbill') out += blush(fy + 7, neck ? 9 : 15);
    if (X('wattle')) out += E(0, fy + 15, 3, 4.5, '#ff5d5d');
    if (X('throat')) out += E(0, fy + 15, 6, 4, o.tc2 || '#e8455f');
    return { svg: back + out, top, eye: fy, ex, neck: neck ? fy + 14 : fy + 17 };
  }

  /* ---------- 바다 동물 ---------- */
  function Fs(o){
    const m = o.m, s = o.s || shade(m, .65), fin = o.fin || shade(m, -.18), k = o.kind || 'fish';
    let out = '';
    if (k === 'whale' || k === 'dolphin'){
      out += P('M28 8 Q44 6 47 -10 Q40 -5 37 -6 Q43 -14 40 -23 Q31 -12 28 -2Z', fin);
      if (k === 'dolphin') out += P('M-4 -18 Q8 -34 12 -17Z', fin);
      out += P('M-36 14 Q-36 -22 0 -22 Q34 -22 34 10 Q34 40 0 40 Q-36 40 -36 14Z', m, ol(m));
      if (k === 'dolphin') out += E(-36, 14, 9, 5.5, m);
      out += P('M-29 23 Q0 41 29 23 Q25 36 0 37 Q-25 36 -29 23Z', s);
      if (o.orca) out += M(E(-14, -6, 6.5, 3.5, '#fff', R(-15, -14, -6)));
      if (o.spots) out += [[-20, -8], [12, -12], [22, 6], [-8, -14], [4, 2]].map(([x, y]) => C(x, y, 2, '#fff', 'opacity=".75"')).join('');
      if (o.tusk) out += S('M-6 -20 L-24 -46', '#fffaf0', 3.4) + S('M-9 -26 l3 1 M-13 -32 l3 1 M-17 -38 l3 1', '#d8cfb8', 1);
      if (o.melon) out += E(0, -18, 18, 8, m);
      if (o.spout) out += S('M-3 -23 Q-5 -33 -13 -35 M-3 -23 Q-1 -35 7 -37', '#8fd3ff', 4) + C(-14, -36, 3.6, '#8fd3ff') + C(8, -38, 3.6, '#8fd3ff');
      out += S('M-24 -8 Q-16 -18 -2 -18', '#ffffff', 3, 'opacity=".4"');   // v0.38.0 광택 줄
      out += eyes(4, 12, 4.4, -1) + S('M-5 12 Q-1 16 3 12', INK, 2.6) + blush(11, 20, -1);
      return { svg: out, top: -22, eye: 4, ex: 12, ecx: -1, neck: 24 };
    }
    if (k === 'seal'){
      out += M(E(-24, 32, 6, 11, shade(m, -.15), R(35, -24, 32)));
      out += P('M-24 42 Q-30 8 -18 -10 Q0 -28 18 -10 Q30 8 24 42Z', m, ol(m));
      out += E(0, 30, 14, 11, s);
      if (o.ears) out += M(E(-15, -12, 3, 4.5, shade(m, -.2)));
      if (o.spots) out += [[-14, 14], [12, 8], [16, 24], [-10, 30], [4, -12]].map(([x, y]) => C(x, y, 2.2, shade(m, -.25))).join('');
      out += S('M-14 -12 Q-8 -20 2 -20', '#ffffff', 2.6, 'opacity=".4"') + eyes(-6, 10, 4.8);
      out += E(0, 6, 11, 7.5, o.muzz || shade(m, .35)) + E(0, 2.5, 4, 3, INK) + M(C(-5, 7, .9, INK) + C(-7, 9.5, .9, INK));
      if (o.tusk) out += M(P('M-5 11 Q-7 26 -2 30 Q-3 20 -2 11Z', '#fffaf0'));
      if (o.mustache) out += M(E(-5, 9, 6, 4.5, shade(m, .2)));
      out += blush(5, 17);
      return { svg: out, top: -24, eye: -6, ex: 10, neck: 14 };
    }
    if (k === 'ray'){
      out += S('M0 30 Q4 42 12 46', shade(m, -.2), 2.4);
      out += P('M0 -16 Q30 -18 48 8 Q20 12 8 32 L0 28 L-8 32 Q-20 12 -48 8 Q-30 -18 0 -16Z', m);
      out += M(P('M-10 -15 Q-14 -24 -8 -26 Q-6 -20 -4 -15Z', m));
      out += E(0, 12, 14, 10, s);
      out += eyes(-4, 9) + smile(6, 4) + blush(2, 16);
      return { svg: out, top: -24, eye: -4, ex: 9, neck: 16 };
    }
    // 물고기 (왼쪽을 봄)
    const pf = o.puffer;
    const tail = (o.betta ? P('M18 4 Q48 -26 46 4 Q50 34 18 10Z', fin) : o.gold ? P('M22 6 Q48 -18 42 4 Q48 26 22 8Z', fin) + P('M22 6 Q40 -2 46 10 Q36 20 22 8Z', shade(fin, .2)) : P('M24 6 L44 -12 Q39 6 44 24Z', o.tf || fin)) +
      S('M28 6 L40 -4 M28 7 L41 7 M28 8 L40 18', shade(o.tf || fin, -.22), 1.1, 'opacity=".7"');   // v0.38.0 꼬리 지느러미 줄
    out += tail;
    if (o.betta) out += P('M-14 -12 Q0 -40 18 -10Z', fin) + P('M-10 22 Q2 46 18 16Z', fin);
    else if (!pf) out += P(o.shark ? 'M-10 -14 Q2 -40 12 -16Z' : 'M-14 -13 Q0 -30 14 -13Z', fin) + E(4, 18, 7, 4, fin, R(-20, 4, 18));
    if (o.angel) out += P('M-10 -12 Q4 -44 16 -10Z', fin) + P('M-10 22 Q4 54 16 18Z', fin);
    if (o.lure) out += S('M-12 -14 Q-20 -34 -34 -30', shade(m, -.2), 2.5) + C(-34, -28, 5.5, '#ffe066') + C(-34, -28, 9, '#ffe066', 'opacity=".25"');
    if (o.sword) out += P('M-28 2 L-49 -2 L-28 8Z', shade(m, -.1));
    if (pf){ let sp = ''; for (let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2; sp += P(`M${f1(Math.cos(a) * 25)} ${f1(6 + Math.sin(a) * 25)} L${f1(Math.cos(a + .1) * 33)} ${f1(6 + Math.sin(a + .1) * 33)} L${f1(Math.cos(a + .2) * 25)} ${f1(6 + Math.sin(a + .2) * 25)}Z`, shade(m, -.2)); } out += sp + C(0, 6, 27, m) + E(0, 16, 18, 12, s); }
    else {
      const brx = o.angel ? 22 : 30, bry = o.angel ? 26 : 22;
      out += E(-2, 6, brx, bry, m, ol(m)) + (o.belly === false ? '' : E(-4, 14, 20, 9, s));
      if (!o.shark && !o.angel && o.scales !== false) out += [[4, -4], [12, 2], [4, 8], [16, -6], [20, 6]].map(([x, y]) => S(`M${x} ${y - 3} q3 3 0 6`, shade(m, -.2), 1.2, 'opacity=".75"')).join('');   // v0.38.0 비늘 몇 개
      out += S(`M${f1(-2 - brx * .62)} ${f1(6 - bry * .4)} Q${f1(-2 - brx * .3)} ${f1(6 - bry * .86)} ${f1(-2 + brx * .14)} ${f1(6 - bry * .86)}`, '#ffffff', 2.6, 'opacity=".4"');   // 광택 줄
    }
    if (o.hammer) out += E(-28, 4, 7, 20, m);
    if (o.pat === 'clown') out += [-14, 6].map(x => P(`M${x - 3} -14 Q${x + 4} 6 ${x - 3} 26 L${x + 3} 26 Q${x + 10} 6 ${x + 3} -14Z`, '#fff', `stroke="${INK}" stroke-width="1.6"`)).join('');
    if (o.pat === 'stripes') out += [-12, 0, 12].map(x => S(`M${x} -12 Q${x + 3} 6 ${x} 24`, o.pd || INK, 3.4)).join('');
    if (o.pat === 'spots') out += [[-16, -6], [-4, -10], [8, -4], [14, 10], [-8, 4], [2, 16]].map(([x, y]) => C(x, y, 2.2, o.pd || '#fff')).join('');
    if (o.pat === 'koi') out += E(-8, -6, 10, 7, '#e8455f') + E(12, 8, 8, 6, '#e8455f');
    if (o.pat === 'tang') out += P('M-20 -6 Q0 -16 20 -2 Q8 8 -6 4 Q-14 0 -20 -6Z', INK);
    if (o.pat === 'back') out += P('M-30 2 Q-26 -16 -2 -16 Q22 -16 28 0 Q0 -6 -30 2Z', o.pd || shade(m, -.4));
    if (o.shark) out += S('M-26 12 Q-18 18 -10 12', INK, 2) + M(P('M-24 13 l1.5 3 1.5 -2.4Z', '#fff'), '');
    if (o.whiskers) out += M(S('M-24 10 Q-30 14 -32 20', shade(m, -.3), 1.4));
    const fx = o.hammer ? -28 : pf ? 0 : -11;
    out += o.hammer ? (C(-28, -12, 3.4, INK) + C(-28, 20, 3.4, INK)) : eyes(0, 6, 4.2, fx);
    out += o.lure ? S('M-26 10 L-22 6 L-18 10 L-14 6 L-10 10', '#fff', 1.6) : o.shark ? '' : S(`M${fx - 6} 10 Q${fx} 14 ${fx + 6} 10`, INK, 2);
    out += blush(7, 11, fx);
    return { svg: out, top: -16, eye: 0, ex: 6, ecx: fx, neck: 16 };
  }

  /* ---------- 양서류 · 파충류 ---------- */
  function Rp(o){
    const m = o.m, s = o.s || shade(m, .6), k = o.kind;
    let out = '';
    if (k === 'frog'){
      out += M(P('M-22 38 L-32 44 L-24 44 L-22 40 L-16 44 L-12 38Z', shade(m, -.1)));
      out += E(0, 30, 24, 13, m) + E(0, 33, 15, 8, s) + E(0, 8, 30, 19, m);
      out += M(C(-14, -8, 10, m) + C(-14, -8, 7, '#fff') + E(-14, -8, 3.8, 4.4, o.iris || INK) + glint2(-14, -8, 4.2));
      if (o.spots) out += [[-20, 8], [16, 4], [-6, 20], [10, 28], [-14, 30], [22, 22]].map(([x, y]) => C(x, y, o.bumps ? 2.4 : 3, o.pd || INK)).join('');
      out += S('M-16 14 Q0 24 16 14', INK, 2) + blush(10, 22);
      return { svg: out, top: -18, eye: -8, ex: 14, neck: 24 };
    }
    if (k === 'turtle'){
      const sh = o.sh || '#7a9a4a';
      if (o.sea) out += M(E(-30, 24, 15, 6, m, R(-25, -30, 24)));
      else out += M(E(-19, 40, 7, 5, m));
      out += P('M-31 32 Q-33 -10 0 -12 Q33 -10 31 32Z', sh) + E(0, 32, 32, 6, shade(sh, -.25));
      out += P('M-10 -2 L10 -2 L14 10 L0 18 L-14 10Z', 'none', `stroke="${shade(sh, -.3)}" stroke-width="2"`) + M(S('M-14 10 L-26 14 M-10 -2 L-18 -8', shade(sh, -.3), 2));
      out += C(0, 20, 13, m) + eyes(18, 5.5, 3.4) + smile(24, 3) + blush(23, 9);
      return { svg: out, top: 7, eye: 18, ex: 5.5, neck: 32 };
    }
    if (k === 'croc'){
      out += P('M14 30 Q38 30 46 18 Q42 38 16 38Z', m);
      out += E(0, 31, 21, 13, m) + E(0, 34, 12, 8, s) + M(E(-11, 42, 8, 4, shade(m, -.15)));
      out += E(0, -2, 24, 17, m) + M(C(-11, -15, 7.5, m)) + whiteEyes(-15, 11);
      out += E(0, 14, 20, 11, shade(m, .08)) + M(C(-4, 6, 1.4, INK));
      out += S('M-17 18 Q0 25 17 18', INK, 2) + M(P('M-13 19.5 l2 3 2 -2.2Z M-6 21.5 l2 3 2 -2.4Z', '#fff'));
      out += [-10, 0, 10].map(x => C(x, 12 + 0 * x, 0, m)).join('') + blush(10, 17);
      return { svg: out, top: -22, eye: -15, ex: 11, neck: 26 };
    }
    if (k === 'snake'){
      out += E(0, 37, 27, 8, m) + E(0, 29, 21, 7, shade(m, -.06)) + E(0, 22, 15, 6, m);
      if (o.pd) out += [[-16, 37], [0, 39], [16, 37], [-10, 29], [10, 29]].map(([x, y]) => C(x, y, 2.4, o.pd)).join('');
      if (o.hood) out += E(0, 0, 22, 18, shade(m, -.12)) + M(E(-12, 2, 4, 6, o.hp || '#fff6d8'));
      out += S('M6 20 Q12 13 2 9', m, 9) + E(0, 2, 15, 12.5, m);
      out += eyes(0, 6) + S('M0 9 V15 M0 15 L-2.5 18 M0 15 L2.5 18', '#e8455f', 1.4) + blush(5, 10);
      return { svg: out, top: -11, eye: 0, ex: 6, neck: 13 };
    }
    if (k === 'axolotl'){
      out += S('M12 34 Q30 40 40 28', m, 7) + E(0, 30, 16, 12, m) + E(0, 32, 9, 7, s) + M(E(-9, 41, 6, 3.5, m));
      out += M([0, 1, 2].map(i => S(`M-22 ${-6 + i * 7} L-34 ${-14 + i * 9}`, o.gc || '#ff6f9a', 3.4) + C(-34, -14 + i * 9, 3, o.gc || '#ff6f9a')).join(''));
      out += E(0, 2, 27, 18, m) + eyes(-2, 13, 3.4) + S('M-12 8 Q0 15 12 8', INK, 2) + blush(6, 18);
      return { svg: out, top: -16, eye: -2, ex: 13, neck: 20 };
    }
    return { svg: '', top: -20, eye: -4, ex: 10, neck: 14 };
  }

  /* ---------- 곤충 · 바다 무척추동물 (하나씩 그림) ---------- */
  const legs6 = (y, c) => M(S(`M-14 ${y} L-24 ${y - 4} M-15 ${y + 7} L-26 ${y + 8} M-13 ${y + 14} L-22 ${y + 20}`, c, 2));
  const ant2 = (x, y, c) => M(S(`M${-x} ${y} Q${-x - 4} ${y - 12} ${-x - 10} ${y - 15}`, c, 1.8) + C(-x - 10, y - 15, 2.4, c));
  const BUGS = {
    ladybug: () => ({ svg: legs6(18, INK) + C(0, 20, 24, '#e8455f') + S('M0 0 V44', INK, 2) + [[-12, 12, 4], [12, 14, 4.4], [-10, 30, 3.6], [11, 31, 3.4]].map(([x, y, r]) => C(x, y, r, INK)).join('') + ant2(5, -12, INK) + E(0, -2, 15, 12, INK) + whiteEyes(-3, 6) + smile(4, 3, '#fff'), top: -14, eye: -3, ex: 6, neck: 10 }),
    bee: () => ({ svg: M(E(-16, -12, 10, 7, '#e6f6ff', `opacity=".9" ${R(-30, -16, -12)}`)) + S('M18 30 L24 34', INK, 2) + C(0, 14, 26, '#ffd54a') + E(0, 22, 25, 4.5, INK) + E(0, 33, 20, 4, INK) + ant2(6, -10, INK) + eyes(4, 9) + smile(11, 4) + blush(10, 16), top: -12, eye: 4, ex: 9, neck: 16 }),
    butterfly: () => ({ svg: M(P('M-2 6 Q-24 -30 -42 -14 Q-46 6 -4 14Z', '#8fc8ff') + P('M-2 14 Q-36 18 -30 38 Q-18 44 -2 22Z', '#ffb3d1') + C(-26, -10, 5, '#fff', 'opacity=".8"') + C(-20, 28, 3.5, '#fff', 'opacity=".8"')) + E(0, 20, 5.5, 18, '#5a4a6a') + ant2(3, -6, '#5a4a6a') + C(0, -2, 10, '#5a4a6a') + whiteEyes(-3, 4.5), top: -12, eye: -3, ex: 4.5, neck: 8 }),
    ant: () => ({ svg: legs6(16, '#8a2a1a') + E(0, 34, 14, 10, '#c8432a') + C(0, 18, 8, '#c8432a') + ant2(6, -12, '#8a2a1a') + C(0, -2, 15, '#c8432a') + eyes(-3, 6) + smile(4, 3), top: -17, eye: -3, ex: 6, neck: 12 }),
    snail: () => ({ svg: P('M-34 42 Q-36 30 -24 28 L20 30 Q34 32 36 42Z', '#f2d6b0') + S('M-28 30 L-32 10 M-22 30 L-22 8', '#f2d6b0', 4) + C(-32, 9, 3, INK) + C(-22, 7, 3, INK) + C(8, 14, 21, '#e8a868') + S('M8 14 m-14 0 a14 14 0 1 1 14 14 a9 9 0 1 1 -9 -9 a4 4 0 1 1 4 4', '#b8743a', 2.6) + smile(36, 3) + C(-26, 36, 1.6, INK) + blush(38, 6, -26), top: -8, eye: 9, ex: 5, ecx: -27, neck: 30 }),
    caterpillar: () => ({ svg: [30, 18, 6].map((x, i) => C(x, 34 - i * 2, 11, i % 2 ? '#8fe07a' : '#6fcf5a')).join('') + M(S('M-6 -22 L-10 -32', INK, 2) + C(-10, -33, 2.6, '#ffd54a')) + C(-10, 14, 22, '#6fcf5a') + eyes(10, 7, 4, -10) + smile(18, 4) + blush(16, 13, -10), top: -10, eye: 10, ex: 7, ecx: -10, neck: 30 }),
    beetle: () => ({ svg: legs6(20, '#3a2418') + E(0, 26, 22, 18, '#6a3a22') + S('M0 10 V44', '#3a2418', 1.6) + E(-8, 20, 4, 8, '#fff', 'opacity=".25"') + E(0, -2, 15, 12, '#4a2a1a') + P('M-3 -12 Q-4 -34 -16 -40 Q-6 -30 3 -12Z', '#4a2a1a') + whiteEyes(-2, 6) + smile(5, 3, '#fff'), top: -14, eye: -2, ex: 6, neck: 10 }),
    stagbeetle: () => ({ svg: legs6(20, '#2a1a10') + E(0, 26, 21, 18, '#4a2a1a') + S('M0 10 V44', '#2a1a10', 1.6) + M(P('M-8 -10 Q-22 -22 -14 -36 Q-12 -26 -4 -14Z', '#6a3a22')) + E(0, -2, 15, 12, '#3a2216') + whiteEyes(-2, 6) + smile(5, 3, '#fff'), top: -14, eye: -2, ex: 6, neck: 10 }),
    dragonfly: () => ({ svg: M(E(-22, 4, 20, 6, '#d8f0ff', `opacity=".9" ${R(-12, -22, 4)}`) + E(-20, 14, 17, 5, '#d8f0ff', `opacity=".9" ${R(14, -20, 14)}`)) + E(0, 26, 4.5, 18, '#3aa8e0') + C(0, 0, 12, '#3aa8e0') + M(C(-7, -5, 6, '#7a5ae0') + C(-6, -6, 2, '#fff')) + smile(5, 3), top: -12, eye: -5, ex: 7, neck: 12 }),
    firefly: () => ({ svg: C(0, 34, 16, '#fff6a0', 'opacity=".5"') + C(0, 32, 11, '#ffe066') + M(E(-14, 4, 9, 6, '#e6f6ff', 'opacity=".9"')) + E(0, 14, 16, 15, '#3a3a48') + ant2(5, -8, '#3a3a48') + C(0, -2, 11, '#ff8a5a') + eyes(-2, 5, 3.4) + smile(3, 2.5), top: -13, eye: -2, ex: 5, neck: 8 }),
    spider: () => ({ svg: S('M0 -48 V-14', '#c8ccd8', 1) + M(S('M-14 10 Q-28 0 -36 14 M-16 18 Q-32 14 -38 28 M-15 26 Q-30 30 -34 42 M-12 32 Q-22 40 -24 46', '#5a4a6a', 2.6)) + C(0, 18, 22, '#6a5a7a') + C(0, 0, 14, '#6a5a7a') + M(C(-4, -8, 2, INK)) + eyes(2, 6) + smile(8, 3) + blush(6, 11), top: -14, eye: 2, ex: 6, neck: 14 }),
    grasshopper: () => ({ svg: M(P('M-14 30 L-30 4 L-34 8 L-20 36Z', '#7fd66a')) + M(S('M-10 40 L-14 44', '#4fae3a', 2.4)) + E(0, 30, 18, 13, '#8fe07a') + M(S('M-6 -16 Q-10 -36 -20 -42', '#4fae3a', 1.8)) + E(0, 2, 18, 18, '#8fe07a') + M(C(-10, -4, 6, '#fff') + C(-10, -4, 3.4, INK)) + smile(8, 4) + blush(6, 14), top: -16, eye: -4, ex: 10, neck: 18 }),
    mantis: () => ({ svg: E(0, 32, 12, 13, '#7fd66a') + M(S('M-6 16 L-18 6 L-12 -4', '#5cc46a', 4) + S('M-12 -4 L-6 2', '#5cc46a', 3)) + M(S('M-8 -16 Q-14 -30 -22 -36', '#4fae3a', 1.6)) + P('M-20 -14 Q0 -24 20 -14 L0 14Z', '#8fe07a') + M(C(-13, -12, 6, '#d8ff7a') + C(-13, -12, 2.4, INK)) + smile(4, 3), top: -20, eye: -12, ex: 13, neck: 16 }),
    cicada: () => ({ svg: M(P('M-6 6 Q-30 10 -24 44 Q-12 40 -4 16Z', '#e6f6ff', 'opacity=".85" stroke="#9fc0d8" stroke-width="1.5"')) + E(0, 22, 13, 20, '#6a5a3a') + E(0, 0, 20, 12, '#5a7a4a') + M(C(-17, -2, 5.5, '#3a3a2a') + C(-16, -3, 1.6, '#fff')) + smile(5, 3), top: -12, eye: -2, ex: 17, neck: 12 }),
    worm: () => ({ svg: S('M30 40 Q12 46 4 36 Q-4 26 8 18 Q20 10 6 2', '#ff9ab0', 13) + [[18, 40], [6, 30], [12, 14]].map(([x, y]) => C(x, y, 1, '#e86a8a')).join('') + C(2, -2, 12, '#ff9ab0') + eyes(-3, 5, 3.4, 2) + smile(3, 3) + blush(2, 9, 2), top: -14, eye: -3, ex: 5, ecx: 2, neck: 10 }),
    octopus: (c = '#ff8a8a', big = false) => ({ svg: [-24, -14, -4, 6, 16, 26].map((x, i) => S(`M${x * .7} 20 Q${x} 34 ${x + (i < 3 ? -6 : 6)} 40 q${i < 3 ? -4 : 4} 2 ${i < 3 ? -2 : 2} -4`, c, 8)).join('') + P(`M-24 22 Q-28 -${big ? 34 : 28} 0 -${big ? 34 : 28} Q28 -${big ? 34 : 28} 24 22Z`, c) + C(-12, -14, 4, '#fff', 'opacity=".4"') + eyes(4, 9) + smile(11, 4) + blush(10, 15) + (big ? M(C(-14, 28, 2, shade(c, .5)) + C(-6, 32, 2, shade(c, .5))) : ''), top: big ? -34 : -28, eye: 4, ex: 9, neck: 18 }),
    squid: () => ({ svg: [-12, -4, 4, 12].map(x => S(`M${x} 18 Q${x * 1.4} 34 ${x * 1.2} 42`, '#f2b8c4', 5)).join('') + M(S('M-6 20 Q-20 36 -26 44', '#f2b8c4', 3)) + P('M0 -40 Q22 -6 16 22 L-16 22 Q-22 -6 0 -40Z', '#f7cdd6') + M(P('M-12 -22 L-24 -14 L-14 -8Z', '#f2b8c4')) + eyes(6, 7) + smile(13, 3) + blush(12, 11), top: -40, eye: 6, ex: 7, neck: 20 }),
    jellyfish: () => ({ svg: [-14, -6, 2, 10].map(x => S(`M${x} 16 Q${x - 6} 28 ${x} 34 Q${x + 6} 40 ${x} 46`, '#d8c4ff', 3)).join('') + P('M-26 18 Q-28 -24 0 -24 Q28 -24 26 18 Q20 13 13 18 Q6 13 0 18 Q-6 13 -13 18 Q-20 13 -26 18Z', '#c8b0ff', 'opacity=".95"') + E(-10, -12, 6, 4, '#fff', 'opacity=".5"') + eyes(0, 8) + smile(7, 3) + blush(6, 14), top: -24, eye: 0, ex: 8, neck: 16 }),
    starfish: () => ({ svg: P('M0 -34 L10 -8 L38 -6 L16 12 L24 40 L0 24 L-24 40 L-16 12 L-38 -6 L-10 -8Z', '#ff9a5a', 'stroke="#e8743a" stroke-width="3" stroke-linejoin="round"') + [[0, -22], [24, -4], [14, 26], [-14, 26], [-24, -4]].map(([x, y]) => C(x, y, 1.8, '#ffd0b0')).join('') + eyes(4, 7) + smile(11, 3.5) + blush(10, 13), top: -34, eye: 4, ex: 7, neck: 18 }),
    crab: () => ({ svg: M(S('M-18 26 L-32 34 M-18 32 L-30 42 M-14 36 L-22 46', '#d8432a', 3)) + M(S('M-20 14 L-30 2', '#e8553a', 4) + P('M-30 2 Q-42 -6 -36 -16 L-30 -8 L-26 -16 Q-22 -4 -30 2Z', '#e8553a')) + E(0, 24, 24, 16, '#ff6a4a') + M(S('M-8 10 L-10 -4', '#ff6a4a', 3) + C(-10, -6, 5, '#fff') + C(-10, -6, 2.8, INK)) + smile(26, 5) + blush(22, 14), top: -12, eye: -6, ex: 10, neck: 14 }),
    lobster: () => ({ svg: M(S('M-6 -16 Q-16 -36 -30 -40', '#c8432a', 1.6)) + M(S('M-14 14 L-24 0', '#d8432a', 4) + P('M-24 0 Q-38 -12 -28 -22 L-24 -12 L-18 -20 Q-14 -6 -24 0Z', '#e8553a')) + P('M-8 40 L0 34 L8 40 L0 46Z', '#c8432a') + [30, 22].map(y => E(0, y, 12 - (30 - y) * .1, 5, '#e8553a')).join('') + E(0, 4, 17, 16, '#ff6a4a') + eyes(0, 7) + smile(7, 3) + blush(6, 12), top: -12, eye: 0, ex: 7, neck: 16 }),
    shrimp: () => ({ svg: M(S('M-4 -18 Q-14 -34 -24 -36', '#ff9a7a', 1.4)) + S('M14 40 Q30 36 26 20 Q22 4 6 0', '#ffb39a', 14) + [[24, 34], [27, 22], [20, 10]].map(([x, y]) => S(`M${x - 6} ${y} L${x + 6} ${y + 1}`, '#ff8a6a', 1.6)).join('') + P('M10 42 L2 48 L18 46Z', '#ff8a6a') + C(0, -4, 14, '#ffb39a') + eyes(-6, 6) + smile(1, 3) + blush(0, 10), top: -18, eye: -6, ex: 6, neck: 10 }),
    hermitcrab: () => ({ svg: C(10, 18, 20, '#f2d8b8') + S('M10 18 m-12 0 a12 12 0 1 1 12 12 a7 7 0 1 1 -7 -7', '#c8a07a', 2.4) + M(S('M-14 36 L-24 42', '#e8553a', 3)) + P('M-28 22 Q-36 14 -30 6 L-24 14Z', '#e8553a') + C(-14, 28, 12, '#ff7a5a') + M(S('M-4 18 L-6 8', '#ff7a5a', 2.4) + C(-6, 6, 3.6, '#fff') + C(-6, 6, 2, INK), '') + smile(32, 3, INK), top: -2, eye: 6, ex: 6, ecx: -14, neck: 24 }),
    seahorse: () => ({ svg: S('M2 20 Q14 28 10 38 Q4 46 -2 40 Q-6 34 2 34', '#ffb03a', 7) + P('M8 -4 Q20 6 14 20 L8 18Z', '#ffd27a') + E(0, 12, 12, 16, '#ffb03a') + E(-2, 14, 6, 10, '#ffd27a') + P('M-8 -16 L-30 -12 L-28 -6 L-10 -6Z', '#ffb03a') + C(-2, -14, 13, '#ffb03a') + M(P('M-4 -26 l2 -6 3 5Z', '#ff8a3d'), '') + eyes(-16, 5, 3.6, -2) + blush(-10, 9, -2), top: -28, eye: -16, ex: 5, ecx: -2, neck: 0 }),
    urchin: () => { let sp = ''; for (let i = 0; i < 20; i++){ const a = i / 20 * Math.PI * 2; sp += S(`M${f1(Math.cos(a) * 18)} ${f1(14 + Math.sin(a) * 18)} L${f1(Math.cos(a) * 32)} ${f1(14 + Math.sin(a) * 32)}`, '#5a3a8a', 3); } return { svg: sp + C(0, 14, 22, '#7a5ab0') + eyes(10, 8) + smile(17, 4, '#fff') + blush(16, 14), top: -10, eye: 10, ex: 8, neck: 30 }; },
    clam: () => ({ svg: P('M-30 24 Q-32 -8 0 -12 Q32 -8 30 24Z', '#ffc8d8') + [-18, -9, 0, 9, 18].map(x => S(`M${x * .4} 22 L${x} -8`, '#f09ab4', 1.6)).join('') + C(0, 28, 7, '#fff', 'stroke="#e8e0f0" stroke-width="1.5"') + P('M-30 26 Q0 46 30 26 Q0 38 -30 26Z', '#ffb0c8') + eyes(6, 9) + smile(12, 4) + blush(11, 16), top: -12, eye: 6, ex: 9, neck: 22 })
  };

  /* ---------- 펭귄 (원래 그림) ---------- */
  const PENG = (o) => {
    const b = o.m, l = '#ffffff', a = o.a || '#ffa53d';
    return { svg: M(E(-14, 40, 9, 5, a)) + M(S('M-26 4 Q-38 16 -31 27', b, 10)) + E(0, 8, 30, 34, b) + E(0, 18, 21, 23, o.s || l) +
      P('M-21 -13 Q0 -5 21 -13 Q20 9 0 10 Q-20 9 -21 -13Z', l) + (o.cr ? crestB(o.cr, o, -26, -5, b) : '') + (o.throat ? E(0, 14, 10, 5, o.throat) : '') +
      S('M-18 -14 Q-12 -22 -2 -23', '#ffffff', 2.6, 'opacity=".38"') + eyes(-5, 9) + P('M-5 2 Q0 -1 5 2 Q0 8 -5 2Z', a) + blush(3, 15), top: -26, eye: -5, ex: 9, neck: 12 };
  };

  /* =========================================================
     동물 목록: id | 한국어 | English | 日本語 | 몸 틀 | 부품
     q = 네발 동물, b = 새, f = 바다, r = 파충류·양서류, x = 곤충·무척추, p = 펭귄
     ========================================================= */
  const SPECIES = [
    /* 고양잇과 */
    ['lion','사자','Lion','ライオン','q',{ m:'#f5b942', s:'#fff0cc', d:'#c98a1f', ear:'round', muz:'cat', tail:'tuft', mane:'#d8892a' }],
    ['tiger','호랑이','Tiger','トラ','q',{ m:'#ff9a3d', s:'#fff6ea', d:'#3a2a20', ear:'round', ie:'#fff', muz:'cat', tail:'thin', pat:'tiger', x:['whisker'] }],
    ['whitetiger','백호','White Tiger','ホワイトタイガー','q',{ m:'#f7f6f2', s:'#ffffff', d:'#3a3a4a', ear:'round', muz:'cat', tail:'thin', pat:'tiger', iris:'#5ab0f0' }],
    ['leopard','표범','Leopard','ヒョウ','q',{ m:'#f2c45a', s:'#fff6e0', d:'#5a3a1a', ear:'round', muz:'cat', tail:'thin', pat:'rosette' }],
    ['cheetah','치타','Cheetah','チーター','q',{ m:'#f0c868', s:'#fff6e0', d:'#3a2a1a', ear:'small', muz:'cat', tail:'thin', pat:'spots', x:['tear'] }],
    ['jaguar','재규어','Jaguar','ジャガー','q',{ m:'#e8a840', s:'#fff3dc', d:'#3a2414', ear:'round', muz:'cat', tail:'thin', pat:'rosette', hw:27 }],
    ['snowleopard','눈표범','Snow Leopard','ユキヒョウ','q',{ m:'#ececea', s:'#ffffff', d:'#6a6a78', ear:'small', muz:'cat', tail:'fluffy', tip:'#ececea', pat:'rosette', iris:'#8ac8b0' }],
    ['panther','흑표범','Black Panther','クロヒョウ','q',{ m:'#3a3a4a', s:'#4a4a5a', ear:'round', ie:'#5a5a6a', muz:'cat', n:'#8a8a9a', tail:'thin', iris:'#ffd54a' }],
    ['lynx','스라소니','Lynx','オオヤマネコ','q',{ m:'#d9b58a', s:'#fff3e0', d:'#7a5a3a', ear:'tuft', muz:'cat', tail:'stub', tip:'#3a2a20', pat:'spots', x:['fluff'] }],
    ['puma','퓨마','Puma','ピューマ','q',{ m:'#d8a66a', s:'#fff3e0', ear:'round', muz:'cat', tail:'thin' }],
    ['cat','고양이','Cat','ネコ','q',{ m:'#ffb35c', s:'#fff6ea', d:'#e8862a', ear:'cat', muz:'cat', tail:'thin', pat:'tiger', x:['whisker'] }],
    ['blackcat','검은 고양이','Black Cat','クロネコ','q',{ m:'#3a3a4a', s:'#4a4a5a', ear:'cat', ie:'#ff9ec0', muz:'cat', tail:'thin', iris:'#ffd54a', x:['whisker'] }],
    ['siamese','샴고양이','Siamese Cat','シャムネコ','q',{ m:'#f3e6d0', s:'#fff8ee', d:'#6a4a3a', ear:'cat', ec:'#6a4a3a', muz:'cat', tail:'thin', tc:'#6a4a3a', pat:'point', iris:'#6ab0f0' }],
    ['persian','페르시안 고양이','Persian Cat','ペルシャネコ','q',{ m:'#f7f2ea', s:'#ffffff', ear:'cat', muz:'cat', tail:'fluffy', tip:'#f7f2ea', x:['fluff'], iris:'#ffb03a' }],
    ['calico','삼색 고양이','Calico Cat','ミケネコ','q',{ m:'#ffffff', s:'#ffffff', ear:'cat', muz:'cat', tail:'thin', tc:'#ff9a3d', pat:'calico' }],
    ['scottishfold','스코티시폴드','Scottish Fold','スコティッシュフォールド','q',{ m:'#c8ccd8', s:'#f4f4f8', d:'#8a90a0', ear:'fold', muz:'cat', tail:'thin', pat:'tiger', iris:'#f0b030' }],
    /* 개 */
    ['shiba','시바견','Shiba Inu','しばいぬ','q',{ m:'#f0a050', s:'#fff5e8', ear:'cat', ie:'#fff5e8', muz:'dog', tail:'curlup', pat:'cheek' }],
    ['corgi','웰시코기','Corgi','コーギー','q',{ m:'#f0a050', s:'#ffffff', ear:'tri', ie:'#ffd9c0', muz:'dog', tail:'stub', pat:'cheek', x:['longbody'] }],
    ['retriever','골든 리트리버','Golden Retriever','ゴールデンレトリバー','q',{ m:'#f2c070', s:'#fbe4b8', ear:'flop', ec:'#e0a850', muz:'dog', tail:'fluffy', tip:'#f2c070' }],
    ['dalmatian','달마시안','Dalmatian','ダルメシアン','q',{ m:'#ffffff', s:'#ffffff', d:'#24324a', ear:'flop', ec:'#24324a', muz:'dog', tail:'thin', pat:'spots' }],
    ['poodle','푸들','Poodle','プードル','q',{ m:'#f0d0b8', s:'#fbe8dc', ear:'none', muz:'dog', n:'#5a3a2a', tail:'stub', tip:'#f0d0b8', x:['poodle'] }],
    ['husky','허스키','Husky','ハスキー','q',{ m:'#7a8aa3', s:'#ffffff', ear:'tri', ie:'#ffffff', muz:'dog', tail:'fluffy', tip:'#ffffff', pat:'husky', iris:'#5ab0f0' }],
    ['beagle','비글','Beagle','ビーグル','q',{ m:'#c98a4a', s:'#ffffff', ear:'flop', ec:'#8a5a2a', muz:'dog', tail:'thin', tc:'#ffffff', pat:'blaze' }],
    ['chihuahua','치와와','Chihuahua','チワワ','q',{ m:'#e8c08a', s:'#fff3e0', ear:'pointy', muz:'small', tail:'thin', hw:24 }],
    ['pug','퍼그','Pug','パグ','q',{ m:'#e8d0a8', s:'#e8d0a8', d:'#3a3a48', ear:'fold', ec:'#3a3a48', muz:'pug', tail:'curly', x:['brows'], bw:'#3a3a48' }],
    ['dachshund','닥스훈트','Dachshund','ダックスフント','q',{ m:'#a85a2a', s:'#d8945a', ear:'flop', ec:'#7a3a1a', muz:'dog', tail:'thin', x:['longbody'] }],
    ['jindo','진돗개','Jindo Dog','チンドッケ','q',{ m:'#fff8ee', s:'#ffffff', ear:'cat', ie:'#ffd9c0', muz:'dog', tail:'curlup' }],
    ['maltese','말티즈','Maltese','マルチーズ','q',{ m:'#ffffff', s:'#ffffff', ear:'flop', ec:'#f4f0ea', muz:'small', tail:'fluffy', tip:'#fff', x:['fluff'] }],
    ['bulldog','불도그','Bulldog','ブルドッグ','q',{ m:'#e8c8a0', s:'#ffffff', ear:'fold', muz:'dog', tail:'stub', hw:27, x:['jowl'] }],
    ['schnauzer','슈나우저','Schnauzer','シュナウザー','q',{ m:'#9aa0aa', s:'#e8e8ec', ear:'fold', muz:'small', tail:'stub', x:['schnauzer'] }],
    ['samoyed','사모예드','Samoyed','サモエド','q',{ m:'#ffffff', s:'#ffffff', ear:'cat', ie:'#ffe0e6', muz:'small', tail:'curlup', x:['fluff'] }],
    /* 갯과 · 너구리 등 */
    ['wolf','늑대','Wolf','オオカミ','q',{ m:'#8a94a8', s:'#e8ecf2', ear:'tri', ie:'#e8ecf2', muz:'dog', tail:'fluffy', tip:'#5a6478', pat:'cheek', iris:'#ffcf3a' }],
    ['fox','여우','Fox','キツネ','q',{ m:'#ff9a3d', s:'#fff4e6', ear:'tri', ie:'#ffd8b0', muz:'small', tail:'fluffy', pat:'cheek', f:'#7a3a1a' }],
    ['arcticfox','북극여우','Arctic Fox','ホッキョクギツネ','q',{ m:'#f4f6fa', s:'#ffffff', ear:'cat', ie:'#e6eaf2', muz:'small', tail:'fluffy', tip:'#e6eaf2' }],
    ['fennec','사막여우','Fennec Fox','フェネック','q',{ m:'#f2d29a', s:'#fff8ea', ear:'huge', ie:'#ffd8c8', muz:'small', tail:'fluffy', tip:'#8a5a3a' }],
    ['coyote','코요테','Coyote','コヨーテ','q',{ m:'#c09a70', s:'#f2e2cc', ear:'tri', ie:'#f2e2cc', muz:'dog', tail:'fluffy', tip:'#4a3a2a' }],
    ['hyena','하이에나','Hyena','ハイエナ','q',{ m:'#c8a878', s:'#ece0c8', d:'#5a4a3a', ear:'round', muz:'dog', tail:'stub', tip:'#3a2a1a', pat:'spots', x:['mohawk'] }],
    ['raccoon','라쿤','Raccoon','アライグマ','q',{ m:'#9aa0aa', s:'#e8eaee', d:'#3a3a48', ear:'small', ie:'#e8eaee', muz:'small', tail:'ring', pat:'mask', eye:'white' }],
    ['tanuki','너구리','Raccoon Dog','タヌキ','q',{ m:'#a8865a', s:'#e8d8bc', d:'#4a3a2a', ear:'small', muz:'small', tail:'fluffy', tip:'#4a3a2a', pat:'mask', eye:'white', f:'#4a3a2a' }],
    ['redpanda','레서판다','Red Panda','レッサーパンダ','q',{ m:'#d8582a', s:'#3a2a20', d:'#8a3a1a', ear:'round', ec:'#d8582a', ie:'#fff', muz:'small', tail:'ring', rc:'#8a3a1a', pat:'redpanda', f:'#3a2a20' }],
    ['panda','판다','Panda','パンダ','q',{ m:'#ffffff', s:'#ffffff', d:'#3a3f4b', ear:'round', ec:'#3a3f4b', ie:'#3a3f4b', muz:'bear', n:'#3a3f4b', tail:'stub', pat:'panda', eye:'white', f:'#3a3f4b', x:['arms'] }],
    /* 곰 */
    ['brownbear','불곰','Brown Bear','ヒグマ','q',{ m:'#a8703c', s:'#e8c9a0', ear:'round', ie:'#e8c9a0', muz:'bear', tail:'stub' }],
    ['polarbear','북극곰','Polar Bear','ホッキョクグマ','q',{ m:'#f7f7f2', s:'#ffffff', ear:'round', ie:'#e6e6de', muz:'bear', tail:'stub' }],
    ['moonbear','반달가슴곰','Asian Black Bear','ツキノワグマ','q',{ m:'#3a3a48', s:'#d9c4a0', ear:'round', ie:'#5a5a6a', muz:'bear', tail:'stub', belly:false, x:['moon'] }],
    ['sunbear','말레이곰','Sun Bear','マレーグマ','q',{ m:'#3a3030', s:'#f2b860', ear:'small', ie:'#5a4a4a', muz:'bear', tail:'stub', belly:false, x:['moon'] }],
    ['koala','코알라','Koala','コアラ','q',{ m:'#a8b0bc', s:'#e8ecf2', ear:'koala', muz:'koala', tail:'none' }],
    ['kangaroo','캥거루','Kangaroo','カンガルー','q',{ m:'#c98a5a', s:'#f2dcc4', ear:'kanga', muz:'long', tail:'thick', x:['pouch'] }],
    ['wombat','웜뱃','Wombat','ウォンバット','q',{ m:'#9a7a5a', s:'#c8ac8c', ear:'small', muz:'bear', tail:'none', hw:27 }],
    ['quokka','쿼카','Quokka','クオッカ','q',{ m:'#a8805a', s:'#e8d0b0', ear:'round', muz:'small', tail:'thin', x:['cheeks'] }],
    ['sloth','나무늘보','Sloth','ナマケモノ','q',{ m:'#b8a080', s:'#efe2c8', d:'#5a4a3a', ear:'none', muz:'small', tail:'none', pat:'sloth', eye:'white', x:['arms'] }],
    ['sugarglider','슈가글라이더','Sugar Glider','フクロモモンガ','q',{ m:'#a8acb8', s:'#f2f2f6', d:'#4a4a58', ear:'big', muz:'small', tail:'fluffy', tip:'#4a4a58', pat:'chipmunk', x:['glide'] }],
    ['tasdevil','태즈메이니아 데빌','Tasmanian Devil','タスマニアデビル','q',{ m:'#2a2a34', s:'#3a3a46', ear:'round', ie:'#ff9ec0', muz:'small', n:'#ff9ec0', tail:'stub', tip:'#2a2a34', pat:'devil', belly:false, x:['fang'] }],
    ['opossum','주머니쥐','Opossum','オポッサム','q',{ m:'#d8d8e0', s:'#ffffff', ear:'round', ec:'#3a3a48', ie:'#ff9ec0', muz:'small', n:'#ff9ec0', tail:'thin', tc:'#ffb3c7' }],
    ['platypus','오리너구리','Platypus','カモノハシ','q',{ m:'#8a5a3a', s:'#c8946a', ear:'none', muz:'bill', tail:'flat', tc:'#6a4028' }],
    /* 작은 동물 */
    ['rabbit','토끼','Rabbit','ウサギ','q',{ m:'#ffffff', s:'#ffffff', ear:'long', muz:'cat', tail:'stub', tip:'#ffffff', x:['teeth'] }],
    ['loprabbit','롭이어 토끼','Lop Rabbit','ロップイヤー','q',{ m:'#d9b48a', s:'#f6e8d6', ear:'lop', ec:'#c8a078', muz:'cat', tail:'stub' }],
    ['hamster','햄스터','Hamster','ハムスター','q',{ m:'#f2b870', s:'#ffffff', ear:'small', muz:'cat', tail:'none', x:['cheeks'] }],
    ['guineapig','기니피그','Guinea Pig','モルモット','q',{ m:'#e8a868', s:'#ffffff', d:'#ffffff', ear:'fold', ec:'#c8844a', muz:'small', tail:'none', pat:'patch', pd:'#ffffff', hw:27 }],
    ['mouse','생쥐','Mouse','ネズミ','q',{ m:'#b8bcc8', s:'#eef0f4', ear:'big', muz:'cat', tail:'thin', tc:'#ffb3c7', x:['whisker'] }],
    ['chipmunk','다람쥐','Chipmunk','シマリス','q',{ m:'#c98a4a', s:'#fff3e0', d:'#4a2a1a', ear:'small', muz:'small', tail:'squirrel', pat:'chipmunk', x:['cheeks'] }],
    ['squirrel','청설모','Squirrel','リス','q',{ m:'#8a7a6a', s:'#f2ece4', ear:'tuft', ie:'#c8b8a8', muz:'small', tail:'squirrel' }],
    ['hedgehog','고슴도치','Hedgehog','ハリネズミ','q',{ m:'#f2dcc0', s:'#fff8ee', ear:'small', muz:'small', tail:'none', qc:'#8a6a4a', x:['quills'] }],
    ['porcupine','호저','Porcupine','ヤマアラシ','q',{ m:'#6a5a4a', s:'#a8988a', ear:'small', muz:'small', tail:'none', qc:'#2a2a30', x:['quills'] }],
    ['mole','두더지','Mole','モグラ','q',{ m:'#4a4a5a', s:'#5a5a6a', ear:'none', muz:'mole', eye:'small', tail:'stub', tip:'#ff9ec0', f:'#ffb3c7', belly:false }],
    ['bat','박쥐','Bat','コウモリ','q',{ m:'#6a5a7a', s:'#8a7a9a', d:'#4a3a5a', ear:'pointy', ie:'#ff9ec0', muz:'small', tail:'none', x:['batwing','fang'] }],
    ['skunk','스컹크','Skunk','スカンク','q',{ m:'#3a3a48', s:'#3a3a48', ear:'small', ie:'#5a5a6a', muz:'small', n:'#ff9ec0', tail:'fluffy', tip:'#ffffff', pat:'skunk', belly:false }],
    ['otter','수달','Otter','カワウソ','q',{ m:'#9a6a42', s:'#e8d0b0', ear:'tiny', muz:'dog', tail:'thick', x:['whisker'] }],
    ['seaotter','해달','Sea Otter','ラッコ','q',{ m:'#8a6a4a', s:'#efe2d0', ear:'tiny', muz:'dog', tail:'none', pat:'face', x:['whisker','shellhold'] }],
    ['beaver','비버','Beaver','ビーバー','q',{ m:'#a0683a', s:'#d8a878', ear:'small', muz:'dog', tail:'flat', tc:'#5a4a3a', x:['teeth'] }],
    ['badger','오소리','Badger','アナグマ','q',{ m:'#ffffff', s:'#d8d8de', d:'#3a3a48', ear:'small', muz:'small', tail:'stub', tip:'#8a8a96', pat:'badger', f:'#3a3a48' }],
    ['weasel','족제비','Weasel','イタチ','q',{ m:'#c98a4a', s:'#ffffff', ear:'small', muz:'small', tail:'long', x:['longbody'] }],
    ['ferret','페럿','Ferret','フェレット','q',{ m:'#e8dcc8', s:'#ffffff', d:'#8a6a4a', ear:'small', muz:'small', tail:'long', tc:'#8a6a4a', pat:'mask', eye:'white' }],
    ['meerkat','미어캣','Meerkat','ミーアキャット','q',{ m:'#d9b48a', s:'#f2e2c8', d:'#5a3a2a', ear:'tiny', ec:'#5a3a2a', muz:'small', tail:'thin', pat:'meerkat', eye:'white', x:['arms'] }],
    ['capybara','카피바라','Capybara','カピバラ','q',{ m:'#b0805a', s:'#c89a72', ear:'tiny', muz:'capy', eye:'sleepy', tail:'none', hw:27, x:['yuzu'] }],
    ['chinchilla','친칠라','Chinchilla','チンチラ','q',{ m:'#b8bcc8', s:'#eef0f4', ear:'big', muz:'cat', tail:'fluffy', tip:'#9aa0aa', x:['whisker'] }],
    ['jerboa','날쥐','Jerboa','トビネズミ','q',{ m:'#e8c898', s:'#ffffff', ear:'huge', ie:'#ffc9d6', muz:'cat', tail:'tuft', tuc:'#3a3a48' }],
    ['armadillo','아르마딜로','Armadillo','アルマジロ','q',{ m:'#c8a888', s:'#e8d8c4', ear:'horse', muz:'small', tail:'thin', belly:false, x:['shell'] }],
    ['pangolin','천산갑','Pangolin','センザンコウ','q',{ m:'#a8784a', s:'#e8c8a0', ear:'none', muz:'small', tail:'thick', belly:false, x:['scales'] }],
    ['anteater','개미핥기','Anteater','アリクイ','q',{ m:'#8a7a6a', s:'#c8b8a8', ear:'tiny', muz:'snout', tail:'fluffy', tip:'#5a4a3a', pat:'anteater' }],
    /* 큰 동물 */
    ['elephant','코끼리','Elephant','ゾウ','q',{ m:'#a8b0c0', s:'#c8ced8', ear:'elephant', ie:'#e8c4d0', muz:'trunk', tail:'thin', belly:false }],
    ['mammoth','매머드','Mammoth','マンモス','q',{ m:'#8a5a3a', s:'#a8784a', ear:'tiny', muz:'trunk', tail:'thin', belly:false, x:['shaghead','bigtusk','shag2'] }],
    ['giraffe','기린','Giraffe','キリン','q',{ m:'#f2c45a', s:'#fff3d0', d:'#c07a2a', ear:'side', muz:'long', tail:'tuft', hy:-24, hh:17, sc:.84, pat:'giraffe', x:['ossicone'] }],
    ['okapi','오카피','Okapi','オカピ','q',{ m:'#5a3a2a', s:'#e8d8c8', d:'#ffffff', ear:'side', muz:'long', tail:'thin', hy:-6, pat:'okapi', x:['ossicone'], hc:'#4a2a1a' }],
    ['zebra','얼룩말','Zebra','シマウマ','q',{ m:'#ffffff', s:'#5a5a6a', d:'#24324a', ear:'horse', ie:'#24324a', muz:'long', tail:'horse', pat:'zebra', x:['mane2'], mc:'#24324a' }],
    ['horse','말','Horse','ウマ','q',{ m:'#a8683a', s:'#e8c8a0', d:'#5a3a1a', ear:'horse', muz:'long', tail:'horse', pat:'blaze', x:['mane2'] }],
    ['pony','조랑말','Pony','ポニー','q',{ m:'#f2dcc0', s:'#fff3e6', d:'#a8784a', ear:'horse', muz:'long', tail:'horse', tc:'#a8784a', x:['mane2'], mc:'#a8784a' }],
    ['donkey','당나귀','Donkey','ロバ','q',{ m:'#9aa0aa', s:'#eeeeee', d:'#4a4a58', ear:'long', ie:'#4a4a58', muz:'long', tail:'tuft', x:['mane2'], mc:'#4a4a58' }],
    ['cow','젖소','Cow','ウシ','q',{ m:'#ffffff', s:'#ffc0cc', d:'#24324a', ear:'side', muz:'long', tail:'tuft', pat:'patch', x:['horns'] }],
    ['ox','황소','Ox','オウシ','q',{ m:'#a8683a', s:'#e8c8a0', ear:'side', muz:'long', tail:'tuft', x:['horns'] }],
    ['yak','야크','Yak','ヤク','q',{ m:'#4a3a30', s:'#a8907a', ear:'side', muz:'long', tail:'horse', tc:'#2a2018', x:['shag','buff','shag2'], hc:'#e8e0d0' }],
    ['bison','들소','Bison','バイソン','q',{ m:'#6a4a30', s:'#9a7a5a', ear:'side', muz:'long', tail:'tuft', x:['shag','horns','beard'], bc2:'#3a2a1a', hc:'#3a3a40' }],
    ['buffalo','물소','Water Buffalo','スイギュウ','q',{ m:'#5a5a64', s:'#8a8a94', ear:'side', muz:'long', tail:'tuft', x:['buff'] }],
    ['sheep','양','Sheep','ヒツジ','q',{ m:'#ffe8d8', s:'#ffffff', ear:'side', ec:'#f2d4c4', muz:'small', tail:'stub', x:['wool'] }],
    ['blacksheep','검은 양','Black-faced Sheep','くろいかおの ひつじ','q',{ m:'#3a3a48', s:'#ffffff', ear:'side', ie:'#5a5a6a', muz:'small', n:'#8a8a9a', tail:'stub', x:['wool'] }],
    ['goat','염소','Goat','ヤギ','q',{ m:'#ffffff', s:'#f2eee8', ear:'side', muz:'long', tail:'stub', x:['goat','beard'] }],
    ['ibex','아이벡스','Ibex','アイベックス','q',{ m:'#b89a7a', s:'#ece0d0', ear:'side', muz:'long', tail:'stub', x:['ram','beard'], hc:'#8a7a5a', bc2:'#6a5a4a' }],
    ['bighorn','큰뿔양','Bighorn Sheep','ビッグホーン','q',{ m:'#a8865a', s:'#f2e6d6', ear:'side', muz:'long', tail:'stub', x:['ram'] }],
    ['alpaca','알파카','Alpaca','アルパカ','q',{ m:'#fff3e0', s:'#ffffff', ear:'horse', muz:'long', tail:'stub', hy:-5, x:['wool'], wo:'#fff8ee' }],
    ['llama','라마','Llama','リャマ','q',{ m:'#e8d0b0', s:'#fff3e0', ear:'horse', muz:'long', tail:'stub', hy:-6 }],
    ['camel','낙타','Camel','ラクダ','q',{ m:'#d9a868', s:'#f2d8a8', ear:'tiny', muz:'long', tail:'tuft', hy:-5, x:['hump'] }],
    ['deer','사슴','Deer','シカ','q',{ m:'#c98a4a', s:'#ffffff', d:'#ffffff', ear:'side', muz:'long', tail:'stub', pat:'spots', x:['antler'] }],
    ['reindeer','순록','Reindeer','トナカイ','q',{ m:'#8a5a3a', s:'#efe2d0', ear:'side', muz:'long', tail:'stub', x:['antler','fluff'], hc:'#d8b48a' }],
    ['moose','무스','Moose','ヘラジカ','q',{ m:'#6a4a30', s:'#a8885a', ear:'side', muz:'long', tail:'stub', x:['moose','beard'], bc2:'#4a3a28' }],
    ['gazelle','가젤','Gazelle','ガゼル','q',{ m:'#d9a868', s:'#ffffff', ear:'side', muz:'long', tail:'stub', x:['gazelle'] }],
    ['hippo','하마','Hippo','カバ','q',{ m:'#a89ab8', s:'#d8c8e0', ear:'tiny', muz:'hippo', tail:'stub', hw:27, x:['teeth'] }],
    ['rhino','코뿔소','Rhino','サイ','q',{ m:'#9aa0aa', s:'#c8ccd4', ear:'horse', muz:'long', tail:'thin', x:['rhino'] }],
    ['pig','돼지','Pig','ブタ','q',{ m:'#ffb8c8', s:'#ffd6e0', ear:'pig', ie:'#ff9ab0', muz:'pig', tail:'curly' }],
    ['boar','멧돼지','Wild Boar','イノシシ','q',{ m:'#6a4a3a', s:'#8a6a5a', ear:'pig', ie:'#4a3a2a', muz:'pig', tail:'thin', x:['tusk','mohawk'] }],
    ['tapir','맥','Tapir','バク','q',{ m:'#3a3a48', s:'#5a5a6a', ear:'round', ie:'#ffffff', muz:'tapir', tail:'stub', pat:'tapir', belly:false }],
    /* 원숭이 */
    ['monkey','원숭이','Monkey','サル','q',{ m:'#c08a5a', s:'#f5d0b8', ear:'mon', ie:'#f5d0b8', muz:'small', tail:'long', pat:'face' }],
    ['snowmonkey','일본원숭이','Snow Monkey','ニホンザル','q',{ m:'#c8bcaa', s:'#ff9a9a', ear:'mon', ie:'#ff9a9a', muz:'small', tail:'stub', pat:'face', x:['fluff'] }],
    ['chimp','침팬지','Chimpanzee','チンパンジー','q',{ m:'#4a3a30', s:'#e8c8a0', ear:'mon', ie:'#e8c8a0', muz:'small', tail:'none', pat:'face', x:['arms'] }],
    ['gorilla','고릴라','Gorilla','ゴリラ','q',{ m:'#3a3a44', s:'#6a6a7a', ear:'mon', ie:'#5a5a6a', muz:'small', tail:'none', pat:'face', hw:27, x:['arms'] }],
    ['orangutan','오랑우탄','Orangutan','オランウータン','q',{ m:'#d0602a', s:'#e8a878', ear:'none', muz:'small', tail:'none', pat:'face', hw:28, x:['arms','shaghead'] }],
    ['lemur','여우원숭이','Ring-tailed Lemur','ワオキツネザル','q',{ m:'#9aa0aa', s:'#ffffff', d:'#3a3a48', ear:'cat', ie:'#ffffff', muz:'small', tail:'lemur', pat:'lemur', eye:'white', iris:'#ffb03a' }],
    ['mandrill','맨드릴','Mandrill','マンドリル','q',{ m:'#6a6a50', s:'#d8c8a0', ear:'mon', muz:'mandrill', tail:'stub', x:['beard'], bc2:'#e8c860' }],
    ['gibbon','긴팔원숭이','Gibbon','テナガザル','q',{ m:'#3a3a40', s:'#e8d8c8', d:'#ffffff', ear:'none', muz:'small', tail:'none', pat:'gibbon', x:['arms'] }],
    /* 새 */
    ['chick','병아리','Chick','ひよこ','b',{ m:'#ffe066', s:'#fff3b0', bk:'#ff9a3d' }],
    ['chicken','닭','Chicken','ニワトリ','b',{ m:'#ffffff', s:'#f6f6f0', w:'#ece8e0', cr:'comb', bk:'#ffb03a', tail:'up', x:['wattle'] }],
    ['rooster','수탉','Rooster','おんどり','b',{ m:'#d8582a', s:'#ff8a4a', w:'#a83a1a', cr:'comb', bk:'#ffcf3a', tail:'long', tc:'#2a5a3a', x:['wattle'] }],
    ['duck','오리','Duck','アヒル','b',{ m:'#ffffff', s:'#fafafa', w:'#eeeeee', bk:'#ff9a3d', beak:'duck' }],
    ['mallard','청둥오리','Mallard','マガモ','b',{ m:'#9a8a7a', s:'#d8c8b8', hood:'#2a8a5a', bk:'#ffcf3a', beak:'duck', pat:'band', pd:'#ffffff' }],
    ['mandarinduck','원앙','Mandarin Duck','オシドリ','b',{ m:'#c87a4a', s:'#ffffff', hood:'#4a6a8a', w:'#ff9a3d', bk:'#e8455f', beak:'short', cr:'mandarin', cc:'#ff8a3d' }],
    ['goose','거위','Goose','ガチョウ','b',{ m:'#ffffff', s:'#f4f4f4', bk:'#ff9a3d', beak:'duck', x:['neck'] }],
    ['swan','백조','Swan','ハクチョウ','b',{ m:'#ffffff', s:'#ffffff', bk:'#ff8a3d', beak:'short', x:['neck'], lc:'#3a3a48' }],
    ['blackswan','흑조','Black Swan','コクチョウ','b',{ m:'#2a2a36', s:'#3a3a48', bk:'#e8455f', beak:'short', x:['neck'], lc:'#3a3a48' }],
    ['owl','부엉이','Owl','ミミズク','b',{ m:'#a8784a', s:'#e8d0a8', face:'#e8d0a8', cr:'tuft', eye:'owl', bk:'#5a4a3a', beak:'hook', pat:'bars', lc:'#ffcf3a' }],
    ['snowyowl','흰올빼미','Snowy Owl','シロフクロウ','b',{ m:'#ffffff', s:'#ffffff', face:'#ffffff', eye:'owl', bk:'#3a3a48', beak:'hook', pat:'spots', pd:'#8a8a9a', lc:'#e8e8e8' }],
    ['barnowl','가면올빼미','Barn Owl','メンフクロウ','b',{ m:'#e8b878', s:'#fff8ee', face:'#ffffff', eye:'owl', iris:'#24324a', bk:'#e8c8b0', beak:'hook', lc:'#e8d8c8' }],
    ['macaw','금강앵무','Scarlet Macaw','コンゴウインコ','b',{ m:'#e8455f', s:'#ff6a7a', w:'#3a7ae0', face:'#ffffff', bk:'#f2ece0', beak:'bighook', tail:'long', tc:'#3a7ae0' }],
    ['bluemacaw','청금강앵무','Blue Macaw','ルリコンゴウインコ','b',{ m:'#3a8ae0', s:'#ffd54a', w:'#2a6ac0', face:'#ffffff', bk:'#24324a', beak:'bighook', tail:'long', tc:'#2a6ac0' }],
    ['cockatoo','코카투','Cockatoo','オウム','b',{ m:'#ffffff', s:'#f6f6f0', cr:'cockatoo', cc:'#ffe066', bk:'#3a3a48', beak:'hook' }],
    ['budgie','사랑앵무','Budgie','セキセイインコ','b',{ m:'#8be08b', s:'#b8f0a8', face:'#ffe066', bk:'#ffb3a0', beak:'hook', pat:'budgie' }],
    ['lovebird','모란앵무','Lovebird','ボタンインコ','b',{ m:'#7ad06a', s:'#a8e898', face:'#ff8a5a', bk:'#e8455f', beak:'hook' }],
    ['cockatiel','왕관앵무','Cockatiel','オカメインコ','b',{ m:'#d8d8d0', s:'#e8e8e0', face:'#ffe066', cheek:'#ff8a4a', cr:'point', cc:'#ffe066', bk:'#9aa0aa', beak:'hook' }],
    ['eagle','흰머리수리','Bald Eagle','ハクトウワシ','b',{ m:'#6a4a30', s:'#7a5a40', hood:'#ffffff', bk:'#ffcf3a', beak:'hook', lc:'#ffcf3a' }],
    ['hawk','매','Falcon','ハヤブサ','b',{ m:'#7a8090', s:'#f2ece4', bk:'#ffcf3a', beak:'hook', pat:'bars', pd:'#7a8090', lc:'#ffcf3a', mask:'#4a4a58' }],
    ['crow','까마귀','Crow','カラス','b',{ m:'#2a2a36', s:'#3a3a48', bk:'#3a3a48', lc:'#3a3a48' }],
    ['magpie','까치','Magpie','カササギ','b',{ m:'#2a2a36', s:'#ffffff', w:'#3a4a8a', bk:'#24324a', tail:'long', tc:'#2a3a6a', lc:'#3a3a48' }],
    ['sparrow','참새','Sparrow','スズメ','b',{ m:'#a8784a', s:'#f2e6d8', hood:'#8a5a3a', face:'#f2e6d8', cheek:'#3a3a48', bk:'#5a4a3a', lc:'#c8a07a' }],
    ['robin','울새','Robin','コマドリ','b',{ m:'#9a7a5a', s:'#ff8a4a', face:'#ff8a4a', bk:'#3a3a48', lc:'#c8a07a' }],
    ['bluejay','블루제이','Blue Jay','アオカケス','b',{ m:'#5a9ae8', s:'#ffffff', cr:'point', bk:'#24324a', pat:'necklace', lc:'#3a3a48' }],
    ['cardinal','홍관조','Cardinal','ショウジョウコウカンチョウ','b',{ m:'#e8455f', s:'#ff6a7a', cr:'point', mask:'#3a2a30', bk:'#ff9a3d', lc:'#c8907a' }],
    ['canary','카나리아','Canary','カナリア','b',{ m:'#ffe066', s:'#fff3a8', bk:'#ffb3a0' }],
    ['hummingbird','벌새','Hummingbird','ハチドリ','b',{ m:'#4ac08a', s:'#c8f0d8', bk:'#3a3a48', beak:'needle', leg:'none', x:['blurwing','throat'] }],
    ['kingfisher','물총새','Kingfisher','カワセミ','b',{ m:'#2aa8e0', s:'#ff9a4a', face:'#ff9a4a', bk:'#24324a', beak:'side', lc:'#ff6a4a' }],
    ['woodpecker','딱따구리','Woodpecker','キツツキ','b',{ m:'#2a2a36', s:'#ffffff', cr:'red', pat:'spots', pd:'#ffffff', bk:'#5a5a6a', beak:'side' }],
    ['toucan','투칸','Toucan','オオハシ','b',{ m:'#2a2a36', s:'#ffffff', face:'#ffffff', bk:'#ff9a3d', beak:'toucan', lc:'#5a9ae8' }],
    ['hornbill','코뿔새','Hornbill','サイチョウ','b',{ m:'#2a2a36', s:'#ffffff', bk:'#ffcf3a', beak:'hornbill', lc:'#3a3a48' }],
    ['pelican','펠리컨','Pelican','ペリカン','b',{ m:'#ffffff', s:'#f6f6f2', bk:'#ffb03a', beak:'pelican' }],
    ['flamingo','플라밍고','Flamingo','フラミンゴ','b',{ m:'#ff9ec0', s:'#ffc0d6', bk:'#fff', beak:'flamingo', leg:'long', lc:'#ff8ab0', x:['neck'] }],
    ['stork','황새','Stork','コウノトリ','b',{ m:'#ffffff', s:'#ffffff', w:'#2a2a36', bk:'#24324a', beak:'side', leg:'long', lc:'#e8455f' }],
    ['crane','두루미','Red-crowned Crane','タンチョウ','b',{ m:'#ffffff', s:'#ffffff', w:'#2a2a36', nk:'#2a2a36', hd:'#ffffff', cr:'red', bk:'#c8c0a0', beak:'side', leg:'long', lc:'#3a3a48', x:['neck'] }],
    ['heron','왜가리','Heron','アオサギ','b',{ m:'#a8b0c0', s:'#e8ecf2', cr:'heron', bk:'#ffcf3a', beak:'side', leg:'long', lc:'#c8a878' }],
    ['ostrich','타조','Ostrich','ダチョウ','b',{ m:'#3a3a40', s:'#5a5a62', nk:'#f2c8b0', hd:'#f2c8b0', w:'#ffffff', bk:'#e8b898', leg:'long', lc:'#f2c8b0', x:['neck'] }],
    ['emu','에뮤','Emu','エミュー','b',{ m:'#7a6a5a', s:'#8a7a6a', nk:'#6a8ab0', hd:'#5a6a8a', bk:'#3a3a48', leg:'long', lc:'#8a7a6a', x:['neck'] }],
    ['kiwi','키위새','Kiwi','キーウィ','b',{ m:'#8a6a4a', s:'#a8886a', bk:'#e8c8a0', beak:'long', lc:'#d8b890' }],
    ['puffin','퍼핀','Puffin','ツノメドリ','b',{ m:'#2a2a36', s:'#ffffff', face:'#ffffff', bk:'#ff7a3d', beak:'puffin' }],
    ['seagull','갈매기','Seagull','カモメ','b',{ m:'#ffffff', s:'#ffffff', w:'#a8b0c0', bk:'#ffcf3a', beak:'gull', lc:'#ffcf3a' }],
    ['pigeon','비둘기','Pigeon','ハト','b',{ m:'#9aa0b8', s:'#c8ccd8', bk:'#5a5a6a', pat:'band', pd:'#7ad0a0', lc:'#ff8a8a' }],
    ['peacock','공작','Peacock','クジャク','b',{ m:'#2a6ae0', s:'#3a8ae0', tail:'fan', tc:'#3aa86a', eyespot:true, cr:'crown', cc:'#2a6ae0', bk:'#c8c0a0' }],
    ['turkey','칠면조','Turkey','シチメンチョウ','b',{ m:'#6a4a3a', s:'#8a6a5a', tail:'fan', tc:'#a8784a', face:'#9ad0f0', bk:'#ffcf3a', x:['wattle'] }],
    ['quail','메추라기','Quail','ウズラ','b',{ m:'#a8865a', s:'#d8c8b0', cr:'plume', cc:'#24324a', pat:'spots', pd:'#ffffff', bk:'#3a3a48' }],
    ['dodo','도도새','Dodo','ドードー','b',{ m:'#9a9ab0', s:'#c8c8d8', bk:'#e8d898', beak:'dodo', tail:'up', tc:'#f2f2f2', lc:'#ffcf3a' }],
    ['swallow','제비','Swallow','ツバメ','b',{ m:'#2a3a6a', s:'#ffffff', face:'#e8455f', bk:'#24324a', tail:'fork', tc:'#2a3a6a', lc:'#3a3a48' }],
    /* 펭귄 */
    ['penguin','펭귄','Penguin','ペンギン','p',{ m:'#33426e' }],
    ['emperorpenguin','황제펭귄','Emperor Penguin','コウテイペンギン','p',{ m:'#3a3f4b', cr:'emperor', throat:'#ffe8a8' }],
    ['rockhopper','바위뛰기펭귄','Rockhopper Penguin','イワトビペンギン','p',{ m:'#2a2a36', cr:'rock', a:'#ff6a3d' }],
    /* 바다 */
    ['whale','고래','Whale','クジラ','f',{ kind:'whale', m:'#5aa9f0', s:'#dff1ff', spout:true }],
    ['orca','범고래','Orca','シャチ','f',{ kind:'whale', m:'#2a2a36', s:'#ffffff', orca:true }],
    ['beluga','벨루가','Beluga','シロイルカ','f',{ kind:'whale', m:'#eef4fa', s:'#ffffff', fin:'#d8e4ee', melon:true }],
    ['narwhal','일각고래','Narwhal','イッカク','f',{ kind:'whale', m:'#a8b4c8', s:'#e8eef4', spots:true, tusk:true }],
    ['dolphin','돌고래','Dolphin','イルカ','f',{ kind:'dolphin', m:'#8ab0d8', s:'#eaf2fa' }],
    ['seal','물범','Seal','アザラシ','f',{ kind:'seal', m:'#c8ccd8', s:'#e8eaf0', spots:true }],
    ['harpseal','하프물범','Harp Seal Pup','タテゴトアザラシ','f',{ kind:'seal', m:'#ffffff', s:'#ffffff', muzz:'#f4f4f8' }],
    ['sealion','바다사자','Sea Lion','アシカ','f',{ kind:'seal', m:'#a8784a', s:'#c8986a', ears:true }],
    ['walrus','바다코끼리','Walrus','セイウチ','f',{ kind:'seal', m:'#c89a7a', s:'#e0b898', tusk:true, mustache:true }],
    ['manatee','매너티','Manatee','マナティー','f',{ kind:'seal', m:'#9aa4b0', s:'#b8c0ca', muzz:'#b8c0ca' }],
    ['clownfish','흰동가리','Clownfish','カクレクマノミ','f',{ m:'#ff8a3d', s:'#ffb06a', pat:'clown', belly:false }],
    ['bluetang','블루탱','Blue Tang','ナンヨウハギ','f',{ m:'#3a6ae0', s:'#5a8af0', pat:'tang', tf:'#ffd54a', belly:false }],
    ['goldfish','금붕어','Goldfish','キンギョ','f',{ m:'#ff8a3d', s:'#ffc08a', gold:true }],
    ['koi','비단잉어','Koi','ニシキゴイ','f',{ m:'#ffffff', s:'#ffffff', fin:'#f2e6e6', pat:'koi', whiskers:true }],
    ['betta','베타','Betta Fish','ベタ','f',{ m:'#7a5ae0', s:'#9a7af0', fin:'#c84a9a', betta:true }],
    ['pufferfish','복어','Pufferfish','フグ','f',{ m:'#f2d88a', s:'#fff8e0', puffer:true }],
    ['angelfish','엔젤피시','Angelfish','エンゼルフィッシュ','f',{ m:'#f2f2e0', s:'#ffffff', fin:'#e8e0b0', angel:true, pat:'stripes', pd:'#3a3a48', belly:false }],
    ['shark','상어','Shark','サメ','f',{ m:'#8a9ab0', s:'#ffffff', shark:true }],
    ['hammerhead','귀상어','Hammerhead Shark','シュモクザメ','f',{ m:'#9aa4b4', s:'#ffffff', shark:true, hammer:true }],
    ['whaleshark','고래상어','Whale Shark','ジンベエザメ','f',{ m:'#4a6a9a', s:'#e8eef4', pat:'spots', pd:'#ffffff', shark:true }],
    ['swordfish','황새치','Swordfish','メカジキ','f',{ m:'#5a7aa8', s:'#d8e4f0', sword:true }],
    ['anglerfish','초롱아귀','Anglerfish','チョウチンアンコウ','f',{ m:'#5a5068', s:'#7a7088', lure:true, belly:false }],
    ['salmon','연어','Salmon','サケ','f',{ m:'#a8b8c8', s:'#ffb0a0', pat:'spots', pd:'#5a6a7a' }],
    ['tuna','참치','Tuna','マグロ','f',{ m:'#c8d0dc', s:'#eef2f6', pat:'back', pd:'#2a3a6a', tf:'#ffd54a' }],
    ['mantaray','만타가오리','Manta Ray','マンタ','f',{ kind:'ray', m:'#3a4a6a', s:'#e8eef4' }],
    ['octopus','문어','Octopus','タコ','x',{ x:'octopus' }],
    ['squid','오징어','Squid','イカ','x',{ x:'squid' }],
    ['jellyfish','해파리','Jellyfish','クラゲ','x',{ x:'jellyfish' }],
    ['starfish','불가사리','Starfish','ヒトデ','x',{ x:'starfish' }],
    ['crab','게','Crab','カニ','x',{ x:'crab' }],
    ['lobster','바닷가재','Lobster','ロブスター','x',{ x:'lobster' }],
    ['shrimp','새우','Shrimp','エビ','x',{ x:'shrimp' }],
    ['hermitcrab','소라게','Hermit Crab','ヤドカリ','x',{ x:'hermitcrab' }],
    ['seahorse','해마','Seahorse','タツノオトシゴ','x',{ x:'seahorse' }],
    ['urchin','성게','Sea Urchin','ウニ','x',{ x:'urchin' }],
    ['clam','조개','Clam','ホタテ','x',{ x:'clam' }],
    /* 양서류 · 파충류 */
    ['frog','개구리','Frog','カエル','r',{ kind:'frog', m:'#7fd66a', s:'#e9ffd6' }],
    ['treefrog','청개구리','Tree Frog','アマガエル','r',{ kind:'frog', m:'#5cd05a', s:'#f0ffe0', iris:'#e8455f' }],
    ['toad','두꺼비','Toad','ヒキガエル','r',{ kind:'frog', m:'#a8885a', s:'#e8d8b8', spots:true, bumps:true, pd:'#7a5a3a' }],
    ['dartfrog','독화살개구리','Poison Dart Frog','ヤドクガエル','r',{ kind:'frog', m:'#3a8ae0', s:'#8ac0ff', spots:true, pd:'#24324a' }],
    ['axolotl','아홀로틀','Axolotl','ウーパールーパー','r',{ kind:'axolotl', m:'#ffc8d8', s:'#ffe6ee', gc:'#ff6f9a' }],
    ['salamander','불도롱뇽','Fire Salamander','ファイアサラマンダー','q',{ m:'#2a2a36', s:'#3a3a48', d:'#ffcf3a', ear:'none', muz:'small', tail:'thick', pat:'spots', pd:'#ffcf3a', belly:false }],
    ['turtle','거북이','Tortoise','カメ','r',{ kind:'turtle', m:'#a8c078', sh:'#8a6a3a' }],
    ['seaturtle','바다거북','Sea Turtle','ウミガメ','r',{ kind:'turtle', m:'#8ac08a', sh:'#5a8a4a', sea:true }],
    ['crocodile','악어','Crocodile','ワニ','r',{ kind:'croc', m:'#5aa85a', s:'#d8f0b8' }],
    ['chameleon','카멜레온','Chameleon','カメレオン','q',{ m:'#6fcf5a', s:'#d8ffb0', ear:'none', muz:'small', tail:'long', tc:'#6fcf5a', iris:'#ffcf3a', pat:'spots', pd:'#ffcf3a', x:['spine'], pc:'#4fae3a' }],
    ['iguana','이구아나','Iguana','イグアナ','q',{ m:'#7ab86a', s:'#c8e8a8', ear:'none', muz:'small', tail:'thick', x:['spine','mohawk'], d:'#4f8a3a' }],
    ['gecko','게코도마뱀','Gecko','ヤモリ','q',{ m:'#ffcf6a', s:'#fff3c8', d:'#e8943a', ear:'none', muz:'small', tail:'thick', pat:'spots', iris:'#e8943a' }],
    ['komodo','코모도왕도마뱀','Komodo Dragon','コモドオオトカゲ','q',{ m:'#8a8a6a', s:'#b8b89a', ear:'none', muz:'small', tail:'thick', hw:27, x:['scales'] }],
    ['frilledlizard','목도리도마뱀','Frilled Lizard','エリマキトカゲ','q',{ m:'#c8a060', s:'#f2dca8', ear:'none', muz:'small', tail:'long', x:['frill'], fc:'#ff9a3d' }],
    ['snake','뱀','Snake','ヘビ','r',{ kind:'snake', m:'#7fd66a', pd:'#4fae3a' }],
    ['cobra','코브라','Cobra','コブラ','r',{ kind:'snake', m:'#c8a060', hood:true }],
    ['trex','티라노사우루스','T-Rex','ティラノサウルス','q',{ m:'#7ab86a', s:'#e0f2c8', ear:'none', muz:'dino', tail:'thick', hw:27, x:['tinyarms','spine'], pc:'#4f8a3a' }],
    ['triceratops','트리케라톱스','Triceratops','トリケラトプス','q',{ m:'#6aa8d8', s:'#d8ecf8', ear:'none', muz:'dino', tail:'thick', x:['frill','trihorn'], fc:'#4a88b8' }],
    ['stegosaurus','스테고사우루스','Stegosaurus','ステゴサウルス','q',{ m:'#a8c86a', s:'#e8f4c8', ear:'none', muz:'small', tail:'spike', x:['plates'], pc:'#ff9a5a' }],
    ['brachiosaurus','브라키오사우루스','Brachiosaurus','ブラキオサウルス','q',{ m:'#9ab0d8', s:'#e0e8f8', ear:'none', muz:'small', tail:'thick', hy:-14, hh:18, pat:'spots', pd:'#7a90b8' }],
    ['ankylosaurus','안킬로사우루스','Ankylosaurus','アンキロサウルス','q',{ m:'#c8a070', s:'#f2dcb8', ear:'none', muz:'dino', tail:'club', hw:27, x:['shell','spine'], pc:'#a88050' }],
    ['pteranodon','프테라노돈','Pteranodon','プテラノドン','b',{ m:'#e8a070', s:'#f8d0b0', w:'#c88050', cr:'ptera', bk:'#f2c060', beak:'side', x:['wings'], leg:'none' }],
    /* 곤충 */
    ['ladybug','무당벌레','Ladybug','テントウムシ','x',{ x:'ladybug' }],
    ['bee','꿀벌','Bee','ミツバチ','x',{ x:'bee' }],
    ['butterfly','나비','Butterfly','チョウ','x',{ x:'butterfly' }],
    ['ant','개미','Ant','アリ','x',{ x:'ant' }],
    ['snail','달팽이','Snail','カタツムリ','x',{ x:'snail' }],
    ['caterpillar','애벌레','Caterpillar','イモムシ','x',{ x:'caterpillar' }],
    ['beetle','장수풍뎅이','Rhinoceros Beetle','カブトムシ','x',{ x:'beetle' }],
    ['stagbeetle','사슴벌레','Stag Beetle','クワガタ','x',{ x:'stagbeetle' }],
    ['dragonfly','잠자리','Dragonfly','トンボ','x',{ x:'dragonfly' }],
    ['firefly','반딧불이','Firefly','ホタル','x',{ x:'firefly' }],
    ['spider','거미','Spider','クモ','x',{ x:'spider' }],
    ['grasshopper','메뚜기','Grasshopper','バッタ','x',{ x:'grasshopper' }],
    ['mantis','사마귀','Praying Mantis','カマキリ','x',{ x:'mantis' }],
    ['cicada','매미','Cicada','セミ','x',{ x:'cicada' }],
    ['earthworm','지렁이','Earthworm','ミミズ','x',{ x:'worm' }],
    /* 전설 (특별한 알에서만) */
    ['dragon','용','Dragon','ドラゴン','q',{ special:true, m:'#e8455f', s:'#ffd9a8', ear:'none', muz:'dino', tail:'spade', tuc:'#b8304a', x:['dwing','dhorns','spine'], wc:'#ff8fa0', pc:'#ffcf5a' }],
    ['bluedragon','청룡','Azure Dragon','せいりゅう','q',{ special:true, m:'#3ab8a0', s:'#fff3c8', ear:'none', muz:'dino', tail:'serpent', tip:'#ffe9a8', mane:'#2a7ae0', x:['eastdragon','antler'], hc:'#ffd54a' }],
    ['unicorn','유니콘','Unicorn','ユニコーン','q',{ special:true, m:'#ffffff', s:'#fff7fd', ear:'horse', ie:'#ffd0e6', muz:'long', tail:'horse', tc:'#b48cff', x:['mane2','unihorn'], mc:'#ff9ec0' }],
    ['pegasus','페가수스','Pegasus','ペガサス','q',{ special:true, m:'#ffffff', s:'#f0f6ff', ear:'horse', ie:'#d8e8ff', muz:'long', tail:'horse', tc:'#8fd0ff', x:['mane2','wing'], mc:'#8fd0ff', wc:'#ffffff', wd:'#bfe0ff' }],
    ['phoenix','피닉스','Phoenix','フェニックス','b',{ special:true, m:'#ff7a3d', s:'#ffd54a', w:'#ff5d3d', cr:'flame', tail:'phoenix', bk:'#ffd54a', beak:'hook', lc:'#ffcf3a' }],
    ['griffin','그리핀','Griffin','グリフォン','q',{ special:true, m:'#e8b870', hm:'#ffffff', s:'#fff3dc', ear:'tuft', ie:'#e8e8e8', muz:'beak', tail:'tuft', tuc:'#a8784a', x:['wing'], wc:'#c8904a', wd:'#a8703a', iris:'#ffb03a' }],
    ['ninetail','구미호','Nine-Tailed Fox','きゅうびのきつね','q',{ special:true, m:'#fff3d6', s:'#ffffff', ear:'tri', ie:'#ffb3c7', muz:'small', tail:'nine', tip:'#ffb3c7', pat:'cheek', x:['fireball'] }],
    ['haetae','해태','Haetae','ヘテ','q',{ special:true, m:'#8fd6c0', s:'#e8fff6', ear:'round', ie:'#5ab8a0', muz:'bear', tail:'fluffy', tip:'#3a9a80', mane:'#3a9a80', x:['hornsingle','bell'] }],
    ['yeti','예티','Yeti','イエティ','q',{ special:true, m:'#f2f6fa', s:'#9ab8e8', ear:'none', muz:'small', tail:'none', pat:'face', x:['shaghead','arms','shag2'] }],
    ['kraken','크라켄','Kraken','クラーケン','x',{ special:true, x:'kraken' }],
    ['thunderbird','썬더버드','Thunderbird','サンダーバード','b',{ special:true, m:'#3a6ae0', s:'#8ac0ff', w:'#2a4ab0', cr:'point', cc:'#ffe066', bk:'#ffcf3a', beak:'hook', tail:'long', tc:'#2a4ab0', x:['bolt'], lc:'#ffcf3a' }]
  ];
  const GROUP = { q:'land', b:'bird', p:'bird', f:'sea', r:'reptile', x:'bug' };
  const cache = {};
  function draw(kind, o){
    if (kind === 'q') return Q(o);
    if (kind === 'b') return Bd(o);
    if (kind === 'p') return PENG(o);
    if (kind === 'f') return Fs(o);
    if (kind === 'r') return Rp(o);
    if (o.x === 'kraken') return BUGS.octopus('#8a6ae0', true);
    return (BUGS[o.x] || BUGS.ladybug)();
  }
  function build(){
    const out = {};
    SPECIES.forEach(([id, ko, en, ja, kind, o]) => {
      const r = draw(kind, o);
      if (o.sc){                                                           // v0.38.0 키 큰 동물은 바닥 기준으로 조금 작게 (그림 칸 안에 들어오게)
        const k = o.sc, Y = (v) => v * k + 44 * (1 - k);
        r.svg = `<g transform="translate(0 ${f1(44 * (1 - k))}) scale(${k})">${r.svg}</g>`;
        r.top = Y(r.top); r.eye = Y(r.eye); r.neck = Y(r.neck); r.ex = r.ex * k; if (r.ecx) r.ecx *= k;
      }
      const rep = ['salamander', 'chameleon', 'iguana', 'gecko', 'komodo', 'frilledlizard', 'trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'ankylosaurus', 'pteranodon'].includes(id);
      const sea = ['octopus', 'squid', 'jellyfish', 'starfish', 'crab', 'lobster', 'shrimp', 'hermitcrab', 'seahorse', 'urchin', 'clam'].includes(o.x);
      const base = o.m || '#ffcf5a';
      out[id] = { svg:r.svg, top:r.top, eye:r.eye, ex:r.ex, ecx:r.ecx || 0, neck:r.neck, special:!!o.special,
        group: o.special ? 'legend' : rep ? 'reptile' : (sea ? 'sea' : GROUP[kind]), names:{ ko, en, ja },
        egg:[shade(base, .82), base === '#ffffff' || base === '#fff' ? '#d8dee8' : base] };
    });
    return out;
  }
  return { build, SPECIES, shade };
})();
