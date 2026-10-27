'use strict';
/* =========================================================
   글 · 파일 점검 (브라우저 없이)
     1. 금지 글자: 공백을 모두 지운 글에서 '야' 바로 뒤 ㅎ 글자(하 · 해 · 했 · 합 · 할 · 한 · 함), '아' 바로 뒤 '다'
        (이 파일도 검사 대상이라 금지 글자 짝은 \u 글자 번호로 적음)
     2. 문법: js/*.js · sw.js 마다 node --check
     3. 파일 목록: js/ 폴더 · index.html 의 <script> 줄 · sw.js 의 APP 목록이 서로 같은지
     4. 버전: index.html 머리 주석 · #ver 단추 · sw.js CACHE · README · 인수인계 문서가 같은 버전인지
   결과: 문제 목록을 돌려줌 (빈 목록 = 통과)
   ========================================================= */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const rel = (p) => path.relative(ROOT, p);

const BAN = /\uC57C[\uD558\uD574\uD588\uD569\uD560\uD55C\uD568]|\uC544\uB2E4/g;   // 야+[하해했합할한함] · 아+다
const TEXT_EXT = /\.(js|html|css|md|txt|json|yml)$/i;
const SKIP_DIR = new Set(['.git', 'node_modules', 'fonts', 'icons', 'versions', 'test-results']);

function walk(dir, out = []){
  for (const name of fs.readdirSync(dir)){
    const p = path.join(dir, name), st = fs.statSync(p);
    if (st.isDirectory()){ if (!SKIP_DIR.has(name)) walk(p, out); }
    else if (TEXT_EXT.test(name) && name !== 'package-lock.json') out.push(p);
  }
  return out;
}

function checkBannedText(){
  const problems = [];
  for (const f of walk(ROOT)){
    const flat = fs.readFileSync(f, 'utf8').replace(/\s+/g, '');
    let m;
    BAN.lastIndex = 0;
    while ((m = BAN.exec(flat))) problems.push(`금지 글자 "${m[0]}" ${rel(f)}: …${flat.slice(Math.max(0, m.index - 12), m.index + 14)}…`);
  }
  return problems;
}

function checkSyntax(){
  const problems = [];
  const files = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js')).map(f => path.join(ROOT, 'js', f));
  files.push(path.join(ROOT, 'sw.js'));
  for (const f of files){
    try{ execFileSync(process.execPath, ['--check', f], { stdio:'pipe' }); }
    catch(e){ problems.push(`문법 오류 ${rel(f)}: ${String(e.stderr || e.message).split('\n').slice(0, 5).join(' / ')}`); }
  }
  return problems;
}

function checkFileLists(){
  const problems = [];
  const onDisk = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js')).sort();
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const inHtml = [...html.matchAll(/<script src="js\/([^"]+)"><\/script>/g)].map(m => m[1]);
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const inSw = [...sw.matchAll(/'\.\/js\/([^']+)'/g)].map(m => m[1]);
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  if (!same(onDisk, [...inHtml].sort())) problems.push(`index.html <script> 목록이 js/ 폴더와 다름\n  폴더: ${onDisk.join(', ')}\n  html: ${inHtml.join(', ')}`);
  if (!same(inHtml, [...inHtml].sort())) problems.push('index.html <script> 순서가 파일 번호 순서가 아님');
  if (!same(inHtml, inSw)) problems.push(`sw.js APP 목록이 index.html 과 다름\n  html: ${inHtml.join(', ')}\n  sw: ${inSw.join(', ')}`);
  for (const css of [...html.matchAll(/<link href="(css\/[^"]+)"/g)].map(m => m[1])){
    if (!sw.includes(`'./${css}'`)) problems.push(`sw.js APP 목록에 ${css} 가 없음`);
    if (!fs.existsSync(path.join(ROOT, css))) problems.push(`${css} 파일이 없음`);
  }
  return problems;
}

function checkVersions(){
  const problems = [];
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const html = read('index.html');
  const found = {
    'index.html 머리 주석': (html.match(/버전: (v\d+\.\d+\.\d+)/) || [])[1],
    'index.html #ver 단추': (html.match(/id="ver">(v\d+\.\d+\.\d+)</) || [])[1],
    'sw.js CACHE': ((read('sw.js').match(/banjjak-(v\d+\.\d+\.\d+)/) || [])[1]),
    'sw.js 머리 주석': ((read('sw.js').match(/버전: (v\d+\.\d+\.\d+)/) || [])[1]),
    'README.md': ((read('README.md').match(/버전: (v\d+\.\d+\.\d+)/) || [])[1]),
    'docs/개발_인수인계.md': ((read('docs/개발_인수인계.md').match(/버전: (v\d+\.\d+\.\d+)/) || [])[1])
  };
  const vals = [...new Set(Object.values(found))];
  if (vals.length !== 1 || !vals[0]) problems.push('버전이 서로 다름: ' + Object.entries(found).map(([k, v]) => `${k}=${v}`).join(' · '));
  const doc = read('docs/개발_인수인계.md');
  if (vals[0] && !new RegExp(`^\\s*${vals[0].replace(/\./g, '\\.')} - `, 'm').test(doc)) problems.push(`docs/개발_인수인계.md 변경 기록에 ${vals[0]} 줄이 없음`);
  return problems;
}

function runStatic(){
  const groups = [['금지 글자', checkBannedText], ['문법', checkSyntax], ['파일 목록', checkFileLists], ['버전', checkVersions]];
  const all = [];
  for (const [name, fn] of groups){
    const p = fn();
    console.log(`${p.length ? '✗' : '✓'} ${name}${p.length ? ` (${p.length})` : ''}`);
    p.forEach(x => console.log('   ' + x));
    all.push(...p);
  }
  return all;
}

module.exports = { runStatic, BAN };
if (require.main === module) process.exit(runStatic().length ? 1 : 0);
