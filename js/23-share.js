'use strict';

/* =========================================================
   23. 자랑 카드 · 의견 보내기 (v0.45.0)
      자랑 카드: 반짝이 + 데리고 다니는 펫 + 기록을 사진 한 장(1080×1350)으로 → 폰 공유 창 (카톡 · 인스타 등). 공유가 안 되면 사진으로 저장
        · 아이 사진 · 이름은 넣지 않음 (아이 앱 정책). 앱 밖으로 나가는 것이라 늘 부모 확인 뒤
        · 완료 화면: 연속 기록이 SHARE_DAYS 에 든 날만 "자랑하기" 단추. 설정(부모님 칸): 언제든 "자랑 카드 만들기"
        · 카드 맨 아래 주소: CONFIG.shareUrl (스토어 주소가 생기면 여기에), 비우면 지금 웹 주소
      의견 보내기: 메일 앱을 열고 앱 버전 · 폰 기종 · 언어 · 구독 상태를 아래에 미리 적어 둠 (테스터 의견 받기)
   ========================================================= */
const SHARE_DAYS = [3, 7, 14, 21, 30, 50, 100, 150, 200, 300, 365];
const shareUrl = () => CONFIG.shareUrl || (/^https?:/.test(location.protocol) ? location.origin + location.pathname.replace(/[^/]*$/, '') : '');
const appVer = () => ($('#ver').textContent || '').trim();
// 화면의 SVG 를 사진으로 그릴 수 있게: 숨은 부분(CSS 로 감춘 입 모양 등)은 빼고, 다른 곳에 있는 그라디언트 정의는 같이 넣음
function svgSnap(svg, w, h){
  const c = svg.cloneNode(true), o = svg.querySelectorAll('*'), cc = c.querySelectorAll('*');
  for (let i = o.length - 1; i >= 0; i--){ const st = getComputedStyle(o[i]); if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') cc[i].remove(); }
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'), seen = new Set();
  for (let n = 0; n < 5; n++){
    const ids = [...(c.outerHTML + defs.innerHTML).matchAll(/(?:url\(#|href="#)([\w-]+)/g)].map(m => m[1]).filter(id => !seen.has(id) && !c.querySelector('#' + CSS.escape(id)));
    if (!ids.length) break;
    ids.forEach(id => { seen.add(id); const el = document.getElementById(id); if (el) defs.appendChild(el.cloneNode(true)); });
  }
  if (defs.childNodes.length) c.insertBefore(defs, c.firstChild);
  c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.setAttribute('width', w); c.setAttribute('height', h);
  c.removeAttribute('class'); c.style.cssText = '';
  return new Promise((ok, no) => { const img = new Image(); img.onload = () => ok(img); img.onerror = no;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(c)); });
}
async function svgSnapHTML(html, w, h){                                       // 문자열 그림(펫)은 잠깐 화면 밖에 붙였다가 찍음
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px';
  box.innerHTML = html; document.body.appendChild(box);
  try{ return await svgSnap(box.querySelector('svg'), w, h); } finally { box.remove(); }
}
async function shareCard(){
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'), font = (px) => `${px}px Jua, system-ui, sans-serif`;
  try{ await document.fonts.load(font(80), t('share.head')); }catch(e){}
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#8fd3ff'); bg.addColorStop(.62, '#d9f1ff'); bg.addColorStop(1, '#fff6d9');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#ffffff55'; [[150, 260, 70], [930, 220, 90], [880, 760, 60], [120, 880, 50]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); });
  const streak = streakDays(), days = new Set(log).size, pets = ((petState && petState.pets) || []).length;
  const head = SHARE_DAYS.includes(streak) || streak >= 3 ? t('share.streak', { n:streak }) : t('share.head');
  const text = (s, x, y, px, fill, stroke) => { g.font = font(px); g.textAlign = 'center'; g.lineJoin = 'round';
    let size = px; while (g.measureText(s).width > W - 220 && size > 30){ size -= 4; g.font = font(size); }
    if (stroke){ g.lineWidth = size / 5; g.strokeStyle = stroke; g.strokeText(s, x, y); } g.fillStyle = fill; g.fillText(s, x, y); };
  text(head, W / 2, 190, 96, '#fff', '#24324a');
  const ch = $('#homeChar svg');
  if (ch) try{ g.drawImage(await svgSnap(ch, 600, 600), 90, 300, 600, 600); }catch(e){}
  const pal = petState && petState.pets.find(p => p.id === petState.pal);
  if (pal) try{ g.drawImage(await svgSnapHTML(petArt(pal), 380, 380), 640, 560, 380, 380); }catch(e){}
  g.fillStyle = '#ffffffcc'; g.beginPath(); g.roundRect ? g.roundRect(80, 980, W - 160, 150, 75) : g.rect(80, 980, W - 160, 150); g.fill();
  const stats = [`🦷 ${t('share.days', { n:days })}`, `⭐ ${t('share.stars', { n:stars })}`].concat(pets ? [`🐾 ${t('share.pets', { n:pets })}`] : []).join('   ');
  text(stats, W / 2, 1075, 52, '#24324a');
  text("Let's Brush · " + t('brand.studio'), W / 2, 1225, 44, '#24324a');
  const u = shareUrl(); if (u) text(u.replace(/^https?:\/\//, ''), W / 2, 1285, 32, '#4a6080');
  return { blob:await new Promise(r => cv.toBlob(r, 'image/png')), text:(streak >= 3 ? t('share.text', { n:streak }) : t('share.textPlain')) + (u ? ' ' + u : '') };
}
async function shareOpen(){
  let card;
  try{ card = await shareCard(); }catch(e){ card = null; }
  if (!card || !card.blob){ toast(t('share.fail')); return; }
  const file = new File([card.blob], 'lets-brush.png', { type:'image/png' });
  try{
    if (navigator.canShare && navigator.canShare({ files:[file] })){ await navigator.share({ files:[file], text:card.text }); return; }
  }catch(e){ if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(card.blob); a.download = 'lets-brush.png';   // 공유 창이 없는 곳: 사진으로 저장
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  toast(t('share.saved'), 3000);
}
function shareDoneRefresh(){ $('#shareDone').hidden = !SHARE_DAYS.includes(streakDays()); }
$('#shareDone').addEventListener('click', () => { sfx.tap(); parentGate(shareOpen); });
$('#shareMake').addEventListener('click', () => { sfx.tap(); shareOpen(); });   // 설정 안 = 이미 부모 확인을 지남
/* 의견 보내기 */
function feedbackMail(){
  const info = [`app: ${appVer()}${inTWA() ? ' (store app)' : ''}`, `lang: ${lang} · ${country}`, `sub: ${subState().kind}`, `kids: ${kidList().length} · days: ${new Set(log).size}`,
    `screen: ${screen.width}x${screen.height} @${devicePixelRatio}`, `ua: ${navigator.userAgent}`].join('\n');
  return `mailto:${CONFIG.contact}?subject=${encodeURIComponent(t('fb.subject', { v:appVer() }))}&body=${encodeURIComponent(t('fb.body') + '\n' + info)}`;
}
$('#fbSend').hidden = $('#fbNote').hidden = !CONFIG.contact;
$('#fbSend').addEventListener('click', () => { sfx.tap(); openLegal(feedbackMail()); });
