'use strict';
/* =========================================================
   앱을 진짜 브라우저(크로미움)로 열어 보는 점검
     · 한국어 · 영어 · 일본어 각각: 첫 화면 → 꾸미기 → 펫 방 → 도감 → 지도 → 설정 → 양치 3분(시계를 빨리 감음) → 완료까지
     · 확인: 오류 0 · 한국어 · 일본어 화면에 영어 낱말이 섞이지 않는지 · 언어팩에 빠진 글이 없는지 · 양치가 완료 화면까지 가는지
     · 시계와 난수를 고정해서 돌릴 때마다 같은 결과
   테스트 모드는 BJ_RESOURCES 로 켬 (출시 잠금 testParam:false 여도 점검은 됨)
   ========================================================= */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png',
  '.woff2':'font/woff2', '.txt':'text/plain', '.mp4':'video/mp4', '.svg':'image/svg+xml' };

function serve(){
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type':TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream' });
    if (req.method === 'HEAD'){ res.end(); return; }
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

// 한국어 · 일본어 화면에 나와도 되는 영어 (앱 이름 · 버전 표시 등)
const EN_OK = /^(Let's|Brush|TEST|BGM|OK|SNS|PDF|AI|ON|OFF|KB|MB|GB|specials|mp4|ep\d+|sp\d+|v\d.*)$/i;

async function visibleEnglish(page){
  return page.evaluate((src) => {
    const ok = new RegExp(src, 'i'), out = new Set();
    const scr = document.querySelector('.screen.active');
    const roots = [scr, document.querySelector('#modal'), document.querySelector('#petShow')].filter(e => e && e.getClientRects().length && getComputedStyle(e).display !== 'none');
    for (const root of roots){
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())){
        const el = n.parentElement;
        if (!el || el.closest('script,style,[aria-hidden="true"],.dev,#devBox') || !el.getClientRects().length) continue;
        if (getComputedStyle(el).visibility === 'hidden') continue;
        for (const word of (n.textContent.match(/[A-Za-z][A-Za-z']+/g) || [])) if (!ok.test(word)) out.add(word);
      }
    }
    return [...out];
  }, EN_OK.source);
}

async function runLang(browser, base, code){
  const problems = [], note = (m) => problems.push(`[${code}] ${m}`);
  const ctx = await browser.newContext({ viewport:{ width:390, height:800 }, locale:code === 'ja' ? 'ja-JP' : code === 'ko' ? 'ko-KR' : 'en-US' });
  const page = await ctx.newPage();
  page.on('pageerror', e => note('오류: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) note('콘솔 오류: ' + m.text()); });
  await page.addInitScript((lang) => {
    let s = 7; Math.random = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false } };
    if (!localStorage.getItem('bj_lang')) localStorage.setItem('bj_lang', JSON.stringify(lang));
    localStorage.setItem('bj_picked', 'true');
  }, code);
  await page.clock.install({ time:new Date('2026-11-04T19:30:00+09:00') });
  const run = (ms) => page.clock.runFor(ms);
  await page.goto(base + '/index.html');
  await run(2500);

  if (code === 'ja'){                                                     // 일본어는 받는 팩 → 설치하고 다시 열기
    await page.evaluate(async () => { await installPack(PACK_CATALOG.find(e => e.code === 'ja')); });
    await run(1000);
    await page.evaluate(() => { localStorage.setItem('bj_lang', '"ja"'); });
    await page.reload(); await run(2500);
  }
  const shownLang = await page.evaluate(() => lang);
  if (shownLang !== code) note(`언어가 ${code} 가 아니라 ${shownLang}`);

  // 언어팩 빠진 글: 한국어에 있는 키가 이 언어에 없으면 영어로 나옴
  if (code !== 'ko'){
    const missing = await page.evaluate((c) => {
      const base = (k) => k.replace(/_(one|other|zero|two|few|many)$/, '');
      const P = packs[c].strings, K = packs.ko.strings;
      return Object.keys(K).filter(k => !/^special\.ep\d+$/.test(k)   // 화 제목은 한국어만 (다른 언어는 "스페셜 N화" 꼴)
        && P[k] === undefined && P[base(k)] === undefined && P[base(k) + '_other'] === undefined);
    }, code);
    if (missing.length) note(`언어팩에 없는 글 ${missing.length}개 (영어로 나옴): ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ' …' : ''}`);
  }

  const closeModals = () => page.evaluate(() => {
    for (let i = 0; i < 4; i++){                                            // 안내 창이 떠 있으면 "닫기"(없으면 확인)
      const m = document.querySelector('#modal');
      if (!m || !m.classList.contains('show')) break;
      const c = document.querySelector('#dlgCancel'), o = document.querySelector('#dlgOk');
      (c && c.offsetParent ? c : o).click();
    }
  });
  const checkText = async (where) => {
    if (code === 'en') return;
    const words = await visibleEnglish(page);
    if (words.length) note(`${where} 화면에 영어: ${words.slice(0, 15).join(' ')}`);
  };
  const go = async (btn, screen) => {
    await closeModals();
    await page.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); }, btn);
    await run(1500);
    const active = await page.evaluate(() => (document.querySelector('.screen.active') || {}).id);
    if (active !== screen) note(`${btn} 를 눌렀는데 ${screen} 대신 ${active} 화면`);
    await checkText(screen);
    await page.evaluate((s) => { const b = document.querySelector('#' + s + ' .backBtn'); if (b) b.click(); }, screen);
    await run(1200);
  };

  await closeModals(); await checkText('home');
  if (process.env.SELFTEST && code === 'ko'){                                // 점검 도구 자체 확인: 영어를 일부러 넣으면 잡아야 됨
    await page.evaluate(() => { document.querySelector('#todayText').textContent = 'Hello Sparkle'; });
    await checkText('home(selftest)');
  }
  await go('.closetBtn', 'closet');
  await go('#roomBtn', 'room');
  await go('#bookBtn', 'book');
  await go('#mapBtn', 'map');
  await go('#settingsBtn', 'settings');

  // 양치 한 번 (끝까지)
  await closeModals();
  await page.evaluate(() => document.querySelector('#startBtn').click());
  await run(1500);
  await page.evaluate(() => { const g = document.querySelector('#prepGo'); if (g && g.offsetParent) g.click(); });
  let sawBrush = false;
  for (let i = 0; i < 230; i++){
    await run(1000);
    if (i === 60){ sawBrush = await page.evaluate(() => (document.querySelector('.screen.active') || {}).id === 'brushC'); await checkText('brushC'); }
  }
  if (!sawBrush) note('양치 화면(brushC)이 안 나옴');
  for (let i = 0; i < 120; i++){                                           // 혀 닦기는 건너뛰고, 극장은 끝까지 보면서 대사 확인
    await run(1000);
    const id = await page.evaluate(() => {
      for (const s of ['#tongueSkip', '#tongue .skip', '#spSkip', '#giftBox']){ const e = document.querySelector(s); if (e && e.offsetParent) e.click(); }
      return (document.querySelector('.screen.active') || {}).id;
    });
    if (id === 'theater'){                                                  // 극장 움직임은 진짜 시간으로 흘러감 (빨리 감기 시계와 별개)
      await page.waitForTimeout(1000);
      if (i % 2 === 0) await checkText('theater');
    }
    if (id === 'done' && i > 20) break;
  }
  const end = await page.evaluate(() => (document.querySelector('.screen.active') || {}).id);
  if (end !== 'done') note(`양치 뒤 완료 화면 대신 ${end}`);
  else await checkText('done');
  await page.screenshot({ path:path.join(__dirname, 'test-results', `done-${code}.png`) });
  await ctx.close();
  return [...new Set(problems)];
}

// 반짝이 클럽 (구독 흉내 켬): 처음 열면 부모님 창 → 요금제 세 개 → 평생 이용권을 사면 늘 열림
async function runSub(browser, base){
  const problems = [], page = await browser.newPage({ viewport:{ width:390, height:800 } });
  page.on('pageerror', e => problems.push('[sub] 오류: ' + e.message));
  await page.addInitScript(() => { window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false } }; localStorage.setItem('bj_lang', '"ko"'); localStorage.setItem('bj_country', '"KR"'); localStorage.setItem('bj_subSim', 'true'); });
  await page.goto(base + '/index.html'); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({ shown:document.querySelector('#subIntro').classList.contains('show'), plans:document.querySelectorAll('#subPlans [data-plan]').length, price:subPrice('year') }));
  if (!r.shown) problems.push('[sub] 처음 열 때 부모님 창이 안 뜸');
  if (r.plans !== 3) problems.push(`[sub] 요금제 카드가 ${r.plans}개`);
  if (!/29,000/.test(r.price)) problems.push('[sub] 한국 연 구독 가격이 이상함: ' + r.price);
  await page.evaluate(() => { document.querySelector('[data-plan=life]').click(); document.querySelector('#subAgree').click(); document.querySelector('#subStart').click(); });
  await page.waitForTimeout(400);
  const st = await page.evaluate(() => subState().kind + ' ' + pro());
  if (st !== 'life true') problems.push('[sub] 평생 이용권을 샀는데 상태가 ' + st);
  await page.close();
  return problems;
}

// v0.45.0 스토어 앱 안 구글 Play 결제 (가짜 Play 를 끼워 넣음): Play 가격 표시 → 연 구독 결제 → 열림 → 구독 끝남 → 무료 / 자랑 카드 사진
async function runPlay(browser, base){
  const problems = [], page = await browser.newPage({ viewport:{ width:390, height:800 } });
  page.on('pageerror', e => problems.push('[play] 오류: ' + e.message));
  await page.addInitScript(() => {
    window.BJ_RESOURCES = { config:{ parentGate:false } }; localStorage.setItem('bj_lang', '"ko"'); localStorage.setItem('bj_picked', 'true');
    window.__owned = [];
    window.getDigitalGoodsService = async () => ({
      getDetails: async (ids) => ids.map(id => ({ itemId:id, price:{ currency:'KRW', value:{ club_month:'4400', club_year:'33000', club_life:'66000' }[id] } })),
      listPurchases: async () => window.__owned.map(i => ({ itemId:i, purchaseToken:'t' })) });
    window.PaymentRequest = function(m){ const sku = m[0].data.sku; this.show = async () => { window.__owned.push(sku); return { complete:async () => {} }; }; };
  });
  await page.goto(base + '/index.html?src=twa'); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({ on:subCfg().on, intro:document.querySelector('#subIntro').classList.contains('show'), price:subPrice('year') }));
  if (r.on !== true || !r.intro) problems.push('[play] 스토어 앱 안인데 반짝이 클럽 안내가 안 뜸');
  if (!/33,000/.test(r.price)) problems.push('[play] Play 가격 대신 ' + r.price);
  await page.evaluate(() => { document.querySelector('[data-plan=year]').click(); document.querySelector('#subAgree').click(); document.querySelector('#subStart').click(); });
  await page.waitForTimeout(600);
  let st = await page.evaluate(() => subState().kind + ' ' + pro());
  if (st !== 'active true') problems.push('[play] 연 구독을 샀는데 ' + st);
  await page.evaluate(async () => { window.__owned = []; await Billing.restore(); });
  st = await page.evaluate(() => subState().kind + ' ' + pro());
  if (st !== 'free false') problems.push('[play] 구독이 끝났는데 ' + st);
  const card = await page.evaluate(async () => { const c = await shareCard(); return c.blob ? c.blob.size : 0; });
  if (card < 20000) problems.push('[play] 자랑 카드 사진이 이상함 (' + card + ' 바이트)');
  await page.close();
  const web = await browser.newPage(); await web.goto(base + '/index.html'); await web.waitForTimeout(800);
  if (await web.evaluate(() => subCfg().on)) problems.push('[play] 웹 주소인데 반짝이 클럽이 켜짐');
  await web.close();
  return problems;
}

// v0.46.0 기간 한정 화: titles.txt "기간" 줄 → 그 기간에만, 평소 순서에서는 빠짐 (영상 파일 없이 고르는 규칙만)
async function runSeason(browser, base){
  const problems = [], page = await browser.newPage();
  page.on('pageerror', e => problems.push('[season] 오류: ' + e.message));
  await page.route('**/specials/titles.txt', r => r.fulfill({ body:'40 기간 07-01~07-31 여름 특집\n23 기간 없음\n', contentType:'text/plain; charset=utf-8' }));
  await page.addInitScript(() => { localStorage.setItem('bj_picked', 'true'); localStorage.setItem('bj_country', '"KR"');
    localStorage.setItem('bj_special', JSON.stringify({ last:1, day:'x', seen:Array.from({ length:20 }, (_, i) => 'ep' + String(i + 1).padStart(3, '0')) })); });
  await page.clock.install({ time:new Date('2026-07-10T20:00:00+09:00') });
  await page.goto(base + '/index.html'); await page.clock.runFor(2000);
  await page.evaluate(() => spTitles());
  const pickN = (date, n) => page.evaluate(([d, n]) => { const got = [];
    for (let i = 0; i < n; i++){ const s = store.get('special'); s.last = 1; s.day = 'x'; store.set('special', s);
      const r = specialDue(SPECIALS.filter(v => v.ep && v.ep <= 45)); if (r){ markSpecial(r.v.id, true); got.push(r.v.ep); } }
    return got.join(','); }, [date, n]);
  let got = await pickN('', 6);
  if (got !== '40,22,23,24,25,28') problems.push('[season] 7월: 여름 특집(40) 먼저, 그다음 22 · 23 · 24 · 25 · 28 (21 · 26 · 27 은 명절 편이라 빠짐) 이어야 되는데 ' + got);
  await page.clock.setSystemTime(new Date('2026-10-26T20:00:00+09:00'));
  got = await pickN('', 1);
  if (got !== '27') problems.push('[season] 핼러윈 기간에 27화가 아니라 ' + got);
  await page.close();
  return problems;
}

async function runBrowser(){
  let chromium;
  try{ ({ chromium } = require('playwright')); }
  catch(e){ console.log('✗ 브라우저 점검: playwright 가 없음 (tests 폴더에서 npm install)'); return ['playwright 없음']; }
  fs.mkdirSync(path.join(__dirname, 'test-results'), { recursive:true });
  const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch();
  const all = [];
  try{
    for (const code of ['ko', 'en', 'ja']){
      const p = await runLang(browser, base, code);
      console.log(`${p.length ? '✗' : '✓'} 브라우저 ${code}${p.length ? ` (${p.length})` : ''}`);
      p.forEach(x => console.log('   ' + x));
      all.push(...p);
    }
    const sp = await runSub(browser, base);
    console.log(`${sp.length ? '✗' : '✓'} 반짝이 클럽 (구독 · 평생 이용권)${sp.length ? ` (${sp.length})` : ''}`);
    sp.forEach(x => console.log('   ' + x)); all.push(...sp);
    const pl = await runPlay(browser, base);
    console.log(`${pl.length ? '✗' : '✓'} 구글 Play 결제 (스토어 앱 흉내) · 자랑 카드${pl.length ? ` (${pl.length})` : ''}`);
    pl.forEach(x => console.log('   ' + x)); all.push(...pl);
    const se = await runSeason(browser, base);
    console.log(`${se.length ? '✗' : '✓'} 기간 한정 화 (명절 · 계절 편)${se.length ? ` (${se.length})` : ''}`);
    se.forEach(x => console.log('   ' + x)); all.push(...se);
  } finally { await browser.close(); srv.close(); }
  return all;
}

module.exports = { runBrowser, serve };
if (require.main === module) runBrowser().then(p => process.exit(p.length ? 1 : 0));
