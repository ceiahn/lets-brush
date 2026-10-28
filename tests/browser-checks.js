'use strict';
/* =========================================================
   앱을 진짜 브라우저(크로미움)로 열어 보는 점검
     · 한국어 · 영어 · 일본어 각각: 첫 화면 → 꾸미기 → 펫 방 → 도감 → 지도 → 설정 → 양치 3분(시계를 빨리 감음) → 완료까지
     · 확인: 오류 0 · 한국어 · 일본어 화면에 영어 낱말이 섞이지 않는지 · 언어팩에 빠진 글이 없는지 · 양치가 완료 화면까지 가는지
     · 시계와 난수를 고정해서 돌릴 때마다 같은 결과
   테스트 모드는 BJ_RESOURCES 로 켬 (출시 잠금 testParam:false 여도 점검은 됨)
   ========================================================= */
const http = require('http'), fs = require('fs'), path = require('path');
const REPO = path.join(__dirname, '..');
// v0.48.0 모듈화: 올라갈 모습(dist, tools/build-site.js 로 만듦)을 점검. 저장소 그대로(예전 주소 → apps/lets-brush 로 넘어감)도 따로 한 번
const ROOT = path.join(REPO, 'dist');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png',
  '.woff2':'font/woff2', '.txt':'text/plain', '.mp4':'video/mp4', '.svg':'image/svg+xml' };

function serve(root = ROOT){
  const srv = http.createServer((req, res) => {
    const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); res.end(); return; }
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

// v0.47.0 웹 막기: webBlock 이면 브라우저는 안내 화면만 · 스토어 앱 표시(?src=twa)는 열림 · Play 없이 체험 흉내 안 됨
async function runWebGate(browser, base){
  const problems = [];
  for (const [q, want] of [['', true], ['?src=twa', false]]){
    const page = await browser.newPage({ viewport:{ width:390, height:800 } });
    page.on('pageerror', e => problems.push('[web] 오류: ' + e.message));
    await page.addInitScript(() => { window.BJ_RESOURCES = { config:{ webBlock:true, parentGate:false } }; localStorage.setItem('bj_lang', '"ko"'); localStorage.setItem('bj_picked', 'true'); });
    await page.goto(base + '/index.html' + q); await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({ gate:!document.querySelector('#webGate').hidden, title:document.querySelector('#webGate h1').textContent, sp:specialOn }));
    if (r.gate !== want) problems.push(`[web] ${q || '브라우저'}: 안내 화면이 ${r.gate ? '나옴' : '안 나옴'}`);
    if (want && (!r.title || r.sp)) problems.push('[web] 안내 화면 글자가 없거나 영상 받기가 켜져 있음');
    if (!want){
      const st = await page.evaluate(async () => { await Billing.startTrial('year'); return subState().kind; });
      if (st !== 'none') problems.push('[web] Play 결제 없이 체험이 시작됨: ' + st);
    }
    await page.close();
  }
  return problems;
}

// v0.48.0 저장소 그대로 열기 (지금 GitHub Pages): 맨 위 index.html → apps/lets-brush/index.html (?src=twa 유지) · ../../core 파일로 앱이 뜨는지
async function runRepo(browser){
  const problems = [], srv = await serve(REPO), page = await browser.newPage();
  page.on('pageerror', e => problems.push('[repo] 오류: ' + e.message));
  await page.addInitScript(() => { localStorage.setItem('bj_lang', '"ko"'); localStorage.setItem('bj_picked', 'true'); });
  await page.goto('http://127.0.0.1:' + srv.address().port + '/index.html?src=twa'); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({ url:location.pathname + location.search, ok:typeof Billing === 'object' && typeof petArt === 'function' && !!document.querySelector('.screen.active') }));
  if (r.url !== '/apps/lets-brush/index.html?src=twa') problems.push('[repo] 예전 주소가 앱으로 안 넘어감: ' + r.url);
  if (!r.ok) problems.push('[repo] 저장소 그대로 열었을 때 앱이 안 뜸');
  await page.close(); srv.close();
  return problems;
}

// v0.49.0 습관 엔진 (core/js/04-habit.js): 양치 2번 · 도장 · 연속 기록 · 지킴이 방석
async function runHabit(browser, base){
  const problems = [], page = await browser.newPage();
  page.on('pageerror', e => problems.push('[habit] 오류: ' + e.message));
  await page.addInitScript(() => { localStorage.setItem('bj_picked', 'true');
    const k = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
    localStorage.setItem('bj_log', JSON.stringify([k(4), k(3), k(2)]));          // 어제 하루 빠짐 → 방석 1개로 메움
    localStorage.setItem('bj_shields', '1'); });
  await page.goto(base + '/index.html'); await page.waitForTimeout(1000);
  const r = await page.evaluate(() => { const a = Habit.done(); const b = Habit.done(); Habit.stamp();
    const L = store.get('log2', []); return { a, b, st:L[L.length - 1].st, shields:store.get('shields', 0) }; });
  if (r.a.today !== 1 || r.b.today !== 2) problems.push('[habit] 오늘 횟수가 이상함: ' + JSON.stringify(r));
  if (r.shields !== 0 || r.b.streak !== 5)                            // 방석은 앱을 열 때 이미 쓰일 수 있음 (그래도 연속 5일) problems.push('[habit] 지킴이 방석 · 연속 기록이 이상함: ' + JSON.stringify(r));
  if (r.st !== 1) problems.push('[habit] 칭찬 도장이 기록 안 됨');
  await page.close();
  return problems;
}

// v0.52.0 받는 언어팩 (lang/<code>.json): 처음 여는 일본 폰은 저절로 일본어 · 예전에 받아 둔 낮은 버전 팩은 새로 받음
async function runLangPack(browser, base){
  const problems = [];
  const ctx = await browser.newContext({ locale:'ja-JP' }), page = await ctx.newPage();
  page.on('pageerror', e => problems.push('[langpack] 오류: ' + e.message));
  await page.addInitScript(() => { window.BJ_RESOURCES = { config:{ testMode:true } }; });
  await page.goto(base + '/index.html'); await page.waitForTimeout(3500);
  const r = await page.evaluate(() => ({ lang, title:t('home.start'), th:t('th.owl.t'), v:packs.ja && packs.ja.meta.version, cat:PACK_CATALOG.find(e => e.code === 'ja').version }));
  if (r.lang !== 'ja' || r.title === 'Start brushing!' || !/[\u3040-\u30ff]/.test(r.title)) problems.push('[langpack] 일본 폰인데 처음 열 때 일본어로 안 바뀜: ' + JSON.stringify(r));
  if (!/[\u3040-\u30ff]/.test(r.th)) problems.push('[langpack] 극장 제목이 일본어가 아님: ' + r.th);
  await ctx.close();
  const ctx2 = await browser.newContext({ locale:'en-US' }), p2 = await ctx2.newPage();
  await p2.addInitScript(() => { window.BJ_RESOURCES = { config:{ testMode:true } };
    if (!sessionStorage.getItem('x')){ sessionStorage.setItem('x', '1'); localStorage.setItem('bj_packs', '["ja"]'); localStorage.setItem('bj_lang', '"ja"');
      localStorage.setItem('bj_pack_ja', JSON.stringify({ meta:{ code:'ja', name:'日本語', version:1 }, strings:{ 'home.start':'OLD' } })); } });
  await p2.goto(base + '/index.html'); await p2.waitForTimeout(3500);
  const r2 = await p2.evaluate(() => ({ v:packs.ja.meta.version, s:t('home.start'), saved:store.get('pack_ja', {}).meta.version }));
  if (r2.s === 'OLD' || r2.v < 2 || r2.saved !== r2.v) problems.push('[langpack] 예전 버전 팩이 새로 안 바뀜: ' + JSON.stringify(r2));
  await ctx2.close();
  return problems;
}

// v0.52.0 극장 좋아요 · 좋아한 편 다시 보기 · 아침 한 컷 최근 20개 안 고르기 · 익명 숫자 (켠 경우만, 숫자만)
async function runLikes(browser, base){
  const problems = [], page = await browser.newPage(), sent = [];
  page.on('pageerror', e => problems.push('[like] 오류: ' + e.message));
  await page.route('**/stats-test', async (route) => { sent.push(route.request().postData()); await route.fulfill({ status:200, body:'ok', headers:{ 'access-control-allow-origin':'*' } }); });
  await page.addInitScript((u) => { window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false, statsUrl:u } }; localStorage.setItem('bj_picked', 'true'); localStorage.setItem('bj_subAsked', 'true'); localStorage.setItem('bj_kidName', '"하나"'); }, base + '/stats-test');
  await page.goto(base + '/index.html'); await page.waitForTimeout(1200);
  // 고르기 (순수 함수)
  const r = await page.evaluate(() => {
    const st = { g:[] }, likes = { owl:3, king:1 }, seq = [];
    for (let i = 0; i < 8; i++){ const x = thPickStory(st, likes); seq.push(x.fav ? '♥' + x.ep.id : x.ep.id); st.g = [x.ep.id].concat(st.g).slice(0, 5); }
    const sg = {}, gs = [];
    for (let i = 0; i < 70; i++) gs.push(thPickGag(sg, {}).id);
    let rep = 0; gs.forEach((id, i) => { if (gs.slice(Math.max(0, i - 20), i).includes(id)) rep++; });
    return { seq, rep, n:TH_GAGS.length, statsOff:(Stats.add('th', 'owl', 'view'), JSON.stringify(store.get('stats', {}))) };
  });
  if (r.seq[3][0] !== '♥' || r.seq[7][0] !== '♥' || r.seq.filter(x => x[0] === '♥').length !== 2 || r.seq[3] === r.seq[7]) problems.push('[like] 4번에 1번 좋아한 이야기가 안 나옴: ' + r.seq.join(' '));
  if (r.rep) problems.push(`[like] 아침 한 컷이 최근 20개 안에서 다시 나옴 (${r.rep}번)`);
  if (r.statsOff !== '{}') problems.push('[like] 익명 숫자를 안 켰는데 폰에 셈: ' + r.statsOff);
  // ♡ 누르기 + 익명 숫자
  await page.evaluate(() => { Stats.setOn(true); store.set('statsSent', Date.now()); window.__bjTheater('yawn'); });   // 하루 한 번 보내기는 잠깐 미룸
  const t0 = Date.now(); let clicked = false;
  while (Date.now() - t0 < 25000){
    await page.waitForTimeout(300);
    if (!clicked && await page.locator('#thLike').isVisible()){ await page.click('#thLike', { force:true, timeout:2000 }); clicked = true; }
    if (await page.evaluate(() => document.querySelector('.screen.active').id) !== 'theater') break;
  }
  if (!clicked) problems.push('[like] 끝날 때 ♡ 단추가 안 나옴');
  const s = await page.evaluate(async () => ({ likes:store.get('thLikes', {}), stats:store.get('stats', {}), ok:await Stats.flush(true), after:store.get('stats', {}), hidden:document.querySelector('#thLike').hidden }));
  if (s.likes.yawn !== 1) problems.push('[like] 좋아요가 저장 안 됨: ' + JSON.stringify(s.likes));
  if (JSON.stringify(s.stats['thg:yawn']) !== '[1,1,0,1]') problems.push('[like] 익명 숫자가 이상함: ' + JSON.stringify(s.stats));
  if (!s.ok || !sent.length || Object.keys(s.after).length) problems.push('[like] 익명 숫자를 못 보냄: ' + JSON.stringify({ ok:s.ok, sent:sent.length, after:s.after }));
  if (!s.hidden) problems.push('[like] 극장이 끝났는데 ♡ 단추가 남음');
  if (sent.length){
    const b = JSON.parse(sent[0]);
    if (Object.keys(b).sort().join() !== 'app,c,lang,v' || /하나/.test(sent[0])) problems.push('[like] 보낸 내용에 숫자 말고 다른 것이 있음: ' + sent[0]);
  }
  await page.evaluate(() => Stats.setOn(false));
  if (await page.evaluate(() => JSON.stringify(store.get('stats', null))) !== 'null') problems.push('[like] 끄면 모아 둔 숫자를 지워야 됨');
  await page.close();
  return problems;
}

// v0.52.4 극장 목소리: 느린 음성(가짜)으로 틀어도 대사가 중간에 끊기지 않는지 · 말하는 사람마다 높낮이가 다른지
async function runVoice(browser, base){
  const problems = [], page = await browser.newPage();
  page.on('pageerror', e => problems.push('[voice] 오류: ' + e.message));
  await page.addInitScript(() => {
    window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false } };
    localStorage.setItem('bj_picked', 'true'); localStorage.setItem('bj_subAsked', 'true'); localStorage.setItem('bj_lang', '"ko"');
    const log = window.__vlog = [];
    let cur = null, timer = 0;
    const fake = { speaking:false, pending:false, paused:false, getVoices:() => [],
      addEventListener(){}, removeEventListener(){},
      speak(u){ if (cur) log.push({ cut:cur.text }); cur = u; fake.speaking = true; log.push({ text:u.text, pitch:u.pitch });
        setTimeout(() => u.onstart && u.onstart(), 30);
        timer = setTimeout(() => { if (cur === u){ cur = null; fake.speaking = false; u.onend && u.onend(); } }, 300 + [...u.text].length * 160); },
      cancel(){ if (cur){ const u = cur; cur = null; fake.speaking = false; clearTimeout(timer); log.push({ cancel:u.text }); u.onerror && u.onerror(); } } };
    Object.defineProperty(window, 'speechSynthesis', { value:fake, configurable:true });
  });
  await page.goto(base + '/index.html'); await page.waitForTimeout(1200);
  await page.evaluate(() => { document.querySelectorAll('.modal').forEach(m => m.classList.remove('show')); window.__bjTheater('owl'); });
  for (let i = 0; i < 160; i++){ await page.waitForTimeout(500); if (await page.evaluate(() => document.querySelector('.screen.active').id) !== 'theater') break; }
  const log = await page.evaluate(() => window.__vlog);
  const cut = log.filter(x => x.cancel || x.cut).map(x => x.cancel || x.cut);
  const said = log.filter(x => x.text);
  // 끝난 뒤 첫 화면에서 나오는 말(Voice.stop 뒤)은 빼고, 극장 대사 중에 끊긴 것만
  const owl = await page.evaluate(() => ['th.owl.1', 'th.owl.2', 'th.owl.3', 'th.owl.4', 'th.owl.5', 'th.owl.6'].map(k => t(k, { pet:'', boss:'' }).replace(/[~()]/g, '').trim().slice(0, 6)));
  const cutLines = cut.filter(x => owl.some(o => o && x.includes(o)));
  if (cutLines.length) problems.push('[voice] 대사가 중간에 끊김: ' + cutLines.join(' / '));
  if (said.length < 6) problems.push('[voice] 대사를 다 읽지 않음: ' + said.length);
  const pitches = new Set(said.map(x => x.pitch.toFixed(2)));
  if (pitches.size < 3) problems.push('[voice] 말하는 사람마다 높낮이가 같음');
  await page.close();
  return problems;
}

// v0.52.5 극장 AI 음성 파일: voice/<언어>.json 에 있는 대사는 파일로, 파일을 못 받으면 기기 목소리로 이어서
const SILENT_MP3 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAANAAAFEAADhISFxccHCEhJSUqKi8vNDQ4OD09QkJHS0tQUFVVWlpeXmNjaGhtbXFxdnZ7e4CAhImJjo6SkpeXnJyhoaWlqqqvr7S0uLi9vcLHx8vL0NDV1dra3t7j4+jo7e3x8fb2+/v/AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQCQAAAAAAAABRAKjSeeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExFMAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';   // 1.2초 무음 (점검용)
async function runVoiceFiles(base){
  const problems = [], { chromium } = require('playwright');
  const browser = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] }), page = await browser.newPage();
  page.on('pageerror', e => problems.push('[voicefile] 오류: ' + e.message));
  const files = Object.fromEntries([1, 2, 3, 4, 5, 6].map(i => ['th.owl.' + i, 'th.owl.' + i + '.test.mp3']));
  await page.route('**/voice/ko.json', r => r.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ dir:'ko/', files }) }));
  await page.route('**/voice/ko/*.mp3', r => /owl\.3\./.test(r.request().url()) ? r.fulfill({ status:404, body:'' }) : r.fulfill({ status:200, contentType:'audio/mpeg', body:Buffer.from(SILENT_MP3, 'base64') }));
  await page.addInitScript(() => {
    window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false } };
    localStorage.setItem('bj_picked', 'true'); localStorage.setItem('bj_subAsked', 'true'); localStorage.setItem('bj_lang', '"ko"');
    const tts = window.__tts = [], files = window.__files = [];
    const fake = { speaking:false, getVoices:() => [], addEventListener(){}, cancel(){},
      speak(u){ tts.push(u.text); setTimeout(() => u.onstart && u.onstart(), 20); setTimeout(() => u.onend && u.onend(), 400); } };
    Object.defineProperty(window, 'speechSynthesis', { value:fake, configurable:true });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function(){ if (/voice\/ko\//.test(this.src)) files.push(this.src.split('/').pop()); return play.call(this); };
  });
  await page.goto(base + '/index.html'); await page.waitForTimeout(1500);
  await page.evaluate(() => { document.querySelectorAll('.modal').forEach(m => m.classList.remove('show')); window.__bjTheater('owl'); });
  for (let i = 0; i < 160; i++){ await page.waitForTimeout(500); if (await page.evaluate(() => document.querySelector('.screen.active').id) !== 'theater') break; }
  const r = await page.evaluate(() => ({ files:window.__files, tts:window.__tts, owl3:t('th.owl.3') }));
  if (r.files.filter(f => /^th\.owl\.[124-6]\./.test(f)).length < 5) problems.push('[voicefile] 음성 파일로 안 틀음: ' + r.files.join(' '));
  if (!r.tts.some(x => x.includes(r.owl3.slice(0, 5)))) problems.push('[voicefile] 파일을 못 받은 대사가 기기 목소리로 안 이어짐');
  if (r.tts.some(x => /부엉이가 살아요/.test(x))) problems.push('[voicefile] 파일이 있는 대사를 기기 목소리로도 읽음');
  await browser.close();
  // v0.52.6 이름 자리: "{pet}, 칫솔 좀 가져다줘!" → [펫 이름 조각][나머지] 차례로
  const b2 = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] }), p2 = await b2.newPage();
  p2.on('pageerror', e => problems.push('[voicefile] 오류: ' + e.message));
  const pets = Object.keys(require('../tools/lang.js').loadSources().PETS);
  const f2 = { 'thg.sock.1~1':'sock1.mp3', 'pn.hero._|':'pn_.mp3', 'pn.hero.egg|':'pnegg.mp3', 'th.endName~0':'en0.mp3', 'th.endName~1':'en1.mp3', 'th.endName~x':'enx.mp3' };
  pets.forEach(id => { f2['pn.hero.' + id + '|'] = 'pn-' + id + '.mp3'; });
  await p2.route('**/voice/ko.json', r => r.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ dir:'ko/', files:f2, parts:{ 'thg.sock.1':[{ slot:'pet', suf:'', role:'hero' }, { k:'thg.sock.1~1' }], 'th.endName':[{ k:'th.endName~0' }, { slot:'name', suf:'', role:'nar' }, { k:'th.endName~1' }] } }) }));
  await p2.route('**/voice/ko/*.mp3', r => r.fulfill({ status:200, contentType:'audio/mpeg', body:Buffer.from(SILENT_MP3, 'base64') }));
  await p2.addInitScript(() => {
    window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false } };
    localStorage.setItem('bj_picked', 'true'); localStorage.setItem('bj_subAsked', 'true'); localStorage.setItem('bj_lang', '"ko"'); localStorage.setItem('bj_kidName', '"하나"');
    const files = window.__files = [];
    Object.defineProperty(window, 'speechSynthesis', { value:{ speaking:false, getVoices:() => [], addEventListener(){}, cancel(){}, speak(u){ setTimeout(() => u.onend && u.onend(), 300); } }, configurable:true });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function(){ if (/voice\/ko\//.test(this.src)) files.push(this.src.split('/').pop()); return play.call(this); };
  });
  await p2.goto(base + '/index.html'); await p2.waitForTimeout(1500);
  const exp = await p2.evaluate(() => { const pal = companion(); return !pal ? 'pnegg.mp3' : pal.name ? 'pn_.mp3' : 'pn-' + pal.sp + '.mp3'; });
  await p2.evaluate(() => { document.querySelectorAll('.modal').forEach(m => m.classList.remove('show')); window.__bjTheater('sock'); });
  for (let i = 0; i < 60; i++){ await p2.waitForTimeout(500); if (await p2.evaluate(() => document.querySelector('.screen.active').id) !== 'theater') break; }
  await p2.evaluate(() => window.__bjTheater('owl'));                    // 이야기 끝인사 (아이 이름이 있는 사용자)
  for (let i = 0; i < 90; i++){ await p2.waitForTimeout(500); if (await p2.evaluate(() => document.querySelector('.screen.active').id) !== 'theater') break; }
  const fl = await p2.evaluate(() => window.__files);
  const at = fl.indexOf(exp);
  if (at < 0 || fl[at + 1] !== 'sock1.mp3') problems.push(`[voicefile] 이름 자리 차례가 이상함 (기대 ${exp} → sock1.mp3): ${fl.join(' ')}`);
  if (!fl.includes('enx.mp3') || fl.includes('en0.mp3')) problems.push('[voicefile] 아이 이름 녹음이 없는데 이름 없는 끝인사(~x)가 안 나옴: ' + fl.join(' '));
  await b2.close();
  return problems;
}

async function runBrowser(){
  let chromium;
  try{ ({ chromium } = require('playwright')); }
  catch(e){ console.log('✗ 브라우저 점검: playwright 가 없음 (tests 폴더에서 npm install)'); return ['playwright 없음']; }
  fs.mkdirSync(path.join(__dirname, 'test-results'), { recursive:true });
  require('child_process').execFileSync(process.execPath, [path.join(REPO, 'tools', 'build-site.js'), 'lets-brush'], { stdio:'inherit' });   // v0.48.0 dist 만들기
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
    const hb = await runHabit(browser, base);
    console.log(`${hb.length ? '✗' : '✓'} 습관 엔진 (기록 · 도장 · 연속 · 방석)${hb.length ? ` (${hb.length})` : ''}`);
    hb.forEach(x => console.log('   ' + x)); all.push(...hb);
    const rp = await runRepo(browser);
    console.log(`${rp.length ? '✗' : '✓'} 저장소 그대로 열기 (예전 주소 → apps/lets-brush)${rp.length ? ` (${rp.length})` : ''}`);
    rp.forEach(x => console.log('   ' + x)); all.push(...rp);
    const lk = await runLikes(browser, base);
    console.log(`${lk.length ? '✗' : '✓'} 극장 좋아요 · 다시 보기 · 아침 한 컷 고르기 · 익명 숫자${lk.length ? ` (${lk.length})` : ''}`);
    lk.forEach(x => console.log('   ' + x)); all.push(...lk);
    const vc = await runVoice(browser, base);
    console.log(`${vc.length ? '✗' : '✓'} 극장 목소리 (대사가 안 끊김 · 사람마다 높낮이)${vc.length ? ` (${vc.length})` : ''}`);
    vc.forEach(x => console.log('   ' + x)); all.push(...vc);
    const vf = await runVoiceFiles(base);
    console.log(`${vf.length ? '✗' : '✓'} 극장 AI 음성 파일 (파일로 틀기 · 못 받으면 기기 목소리)${vf.length ? ` (${vf.length})` : ''}`);
    vf.forEach(x => console.log('   ' + x)); all.push(...vf);
    const lp = await runLangPack(browser, base);
    console.log(`${lp.length ? '✗' : '✓'} 받는 언어팩 (일본 폰 저절로 · 새 버전 받기)${lp.length ? ` (${lp.length})` : ''}`);
    lp.forEach(x => console.log('   ' + x)); all.push(...lp);
    const wg = await runWebGate(browser, base);
    console.log(`${wg.length ? '✗' : '✓'} 웹 막기 (출시 설정)${wg.length ? ` (${wg.length})` : ''}`);
    wg.forEach(x => console.log('   ' + x)); all.push(...wg);
  } finally { await browser.close(); srv.close(); }
  return all;
}

module.exports = { runBrowser, serve };
if (require.main === module) runBrowser().then(p => process.exit(p.length ? 1 : 0));
