'use strict';
/* 반짝이 극장 점검 (v0.51.0): 이야기를 진짜 시간으로 끝까지 틀어 보고 확인 (한 편 30초 안팎이라 기본 점검 run.js 에는 안 넣음)
     node tests/theater-check.js                 이야기 · 아침 짧은 극장 모두 (여러 편을 동시에)
     node tests/theater-check.js dream pipi      골라서
     LANG_CODE=en node tests/theater-check.js    영어로 (ja 는 언어팩 설치 후)
   확인: 오류 0 · 끝까지 가서 첫 화면으로 돌아오는지 · 말풍선에 키 이름(th.…)이 그대로 나오지 않는지
   결과: tests/test-results/theater/<id>.png (장면 4컷을 한 장으로) */
const fs = require('fs'), path = require('path');
const { serve } = require('./browser-checks');
const OUT = path.join(__dirname, 'test-results', 'theater');
const LANG = process.env.LANG_CODE || 'ko', PAR = +(process.env.PAR || 6);

async function one(browser, base, id){
  const problems = [], ctx = await browser.newContext({ viewport:{ width:360, height:470 } }), p = await ctx.newPage();
  p.on('pageerror', e => problems.push('오류: ' + e.message));
  await p.addInitScript((lang) => { window.BJ_RESOURCES = { config:{ testMode:true, parentGate:false } }; localStorage.setItem('bj_lang', JSON.stringify(lang)); localStorage.setItem('bj_picked', 'true'); localStorage.setItem('bj_subAsked', 'true'); }, LANG);
  await p.goto(base + '/index.html'); await p.waitForTimeout(1200);
  if (LANG === 'ja') await p.evaluate(async () => { await installPack(PACK_CATALOG.find(e => e.code === 'ja')); localStorage.setItem('bj_lang', '"ja"'); });
  if (LANG === 'ja'){ await p.reload(); await p.waitForTimeout(1200); }
  await p.evaluate(() => { document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
    if (!petState.pets.length){ petState.pets.push({ id:'tc', sp:'shiba', st:3, p:0, name:'', wear:{} }); petState.pal = 'tc'; } });
  const known = await p.evaluate((id) => !!(TH_ALL().concat(window.TH_GAGS || []).find(x => x.id === id)), id);
  if (!known){ await ctx.close(); return [`[${id}] 그런 이야기가 없음`]; }
  await p.evaluate((id) => { window.__thSeen = []; const o = new MutationObserver(() => document.querySelectorAll('.th-bub').forEach(b => window.__thSeen.push(b.textContent))); o.observe(document.querySelector('#thStage'), { childList:true, subtree:true }); window.__bjTheater(id); }, id);
  const shots = [];
  const t0 = Date.now();
  for (let i = 0; i < 90; i++){
    await p.waitForTimeout(500);
    const el = (Date.now() - t0) / 1000;
    if ([4, 10, 17, 24].some(s => Math.abs(el - s) < .26) && shots.length < 4) shots.push(await p.locator('#thStage').screenshot({ timeout:1500, animations:'allow' }).catch(() => null));
    if (await p.evaluate(() => (document.querySelector('.screen.active') || {}).id) !== 'theater') break;
  }
  const secs = (Date.now() - t0) / 1000;
  const still = await p.evaluate(() => (document.querySelector('.screen.active') || {}).id);
  if (still === 'theater') problems.push(`45초가 지나도 안 끝남`);
  const seen = await p.evaluate(() => [...new Set(window.__thSeen)]);
  seen.filter(x => /(^|\s)(th|thg)\.[a-z]/.test(x)).forEach(x => problems.push('키 이름이 그대로 나옴: ' + x));
  if (shots.filter(Boolean).length){
    try{
      const imgs = shots.filter(Boolean).map(b => 'data:image/png;base64,' + b.toString('base64'));
      const sheet = await ctx.newPage(); await sheet.setViewportSize({ width:1120, height:300 });
      await sheet.setContent(`<body style="margin:0;display:flex;gap:4px;background:#222">${imgs.map(s => `<img src="${s}" style="width:276px">`).join('')}<div style="color:#fff;font:14px sans-serif;position:fixed;left:6px;bottom:4px">${id} · ${secs.toFixed(0)}s</div></body>`);
      await sheet.screenshot({ path:path.join(OUT, id + '.png') }); await sheet.close();
    }catch(e){}
  }
  await ctx.close();
  return problems.map(x => `[${id}] ${x}`).concat([`__time ${id} ${secs.toFixed(1)}`]);
}

(async () => {
  const { chromium } = require('playwright');
  require('child_process').execFileSync(process.execPath, [path.join(__dirname, '..', 'tools', 'build-site.js'), 'lets-brush'], { stdio:'inherit' });
  fs.mkdirSync(OUT, { recursive:true });
  const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port, browser = await chromium.launch();
  let ids = process.argv.slice(2);
  if (!ids.length){
    const pg = await browser.newPage(); await pg.addInitScript(() => { window.BJ_RESOURCES = { config:{ testMode:true } }; }); await pg.goto(base + '/index.html'); await pg.waitForTimeout(800);
    ids = await pg.evaluate(() => TH_ALL().map(e => e.id).concat((window.TH_GAGS || []).map(g => g.id))); await pg.close();
  }
  const all = [], times = [];
  for (let i = 0; i < ids.length; i += PAR){
    const res = await Promise.all(ids.slice(i, i + PAR).map(id => one(browser, base, id)));
    res.flat().forEach(x => x.startsWith('__time') ? times.push(x.slice(7)) : all.push(x));
    process.stdout.write(`  ${Math.min(i + PAR, ids.length)}/${ids.length}\r`);
  }
  await browser.close(); srv.close();
  console.log(`\n극장 ${ids.length}편 (${LANG}) · 길이: ${times.join(', ')}`);
  all.forEach(x => console.log('  ✗ ' + x));
  console.log(all.length ? `✗ 문제 ${all.length}개` : '✓ 모두 통과');
  process.exit(all.length ? 1 : 0);
})();
