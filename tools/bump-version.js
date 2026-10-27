'use strict';
/* 버전 올리기:  node tools/bump-version.js 0.37.0
   바꾸는 곳: index.html 머리 주석 · #ver 단추 · sw.js (머리 주석 · CACHE) · README.md · docs/개발_인수인계.md 머리
   변경 기록 줄은 직접 씀 (docs/개발_인수인계.md "변경 기록" 아래). tests/static-checks.js 가 빠진 곳을 잡아 줌 */
const fs = require('fs'), path = require('path');
const v = (process.argv[2] || '').replace(/^v/, '');
if (!/^\d+\.\d+\.\d+$/.test(v)){ console.log('사용법: node tools/bump-version.js 0.37.0'); process.exit(1); }
const ROOT = path.join(__dirname, '..');
const d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const edit = (f, pairs) => {
  const p = path.join(ROOT, f); let s = fs.readFileSync(p, 'utf8');
  for (const [re, to] of pairs){ if (!re.test(s)) throw new Error(`${f}: ${re} 를 못 찾음`); s = s.replace(re, to); }
  fs.writeFileSync(p, s);
};
edit('index.html', [[/버전: v\d+\.\d+\.\d+\s+\|\s+\d{4}-\d{2}-\d{2}/, `버전: v${v}  |  ${day}`], [/id="ver">v\d+\.\d+\.\d+</, `id="ver">v${v}<`]]);
edit('sw.js', [[/버전: v\d+\.\d+\.\d+\s+\|\s+\d{4}-\d{2}-\d{2}\s+\(index\.html v\d+\.\d+\.\d+ 와 짝\)/, `버전: v${v}  |  ${day}   (index.html v${v} 와 짝)`],
               [/banjjak-v\d+\.\d+\.\d+/, `banjjak-v${v}`]]);
edit('README.md', [[/버전: v\d+\.\d+\.\d+ \(\d{4}-\d{2}-\d{2}\)/, `버전: v${v} (${day})`]]);
edit('docs/개발_인수인계.md', [[/버전: v\d+\.\d+\.\d+\s+\|\s+\d{4}-\d{2}-\d{2}/, `버전: v${v}  |  ${day}`]]);
console.log(`v${v} (${day}) 로 바꿈. 변경 기록 줄도 쓸 것`);
