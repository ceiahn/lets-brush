'use strict';
/* 앱 하나를 올릴 파일로 모으기 (v0.48.0, 모듈화 1단계)
     node tools/build-site.js lets-brush        → dist/  (Cloudflare Pages 출력 폴더)
   구조: core/ (토끼유 스튜디오 공통 엔진 · 글꼴) + characters/<이름>/js (캐릭터 그림 코드) + apps/<앱>/ (그 앱만의 화면 · 코드 · 아이콘 · 약관)
   저장소 안에서는 앱이 ../../core/… 로 공통 파일을 부름 (빌드 없이도 열림: GitHub Pages · 파일로 바로 열기)
   dist 에서는 앱을 맨 위에 두고 core/ · characters/ 를 그 아래에 → ../../core/ 를 core/ 로 바꿔 씀
   올리지 않는 것: docs · tests · tools · apps/<앱>/android · apps/<앱>/docs · resources.example.js · 캐릭터 참고 그림(ref) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const app = process.argv[2] || 'lets-brush';
const SRC = path.join(ROOT, 'apps', app), OUT = path.join(ROOT, process.argv[3] || 'dist');
if (!fs.existsSync(SRC)){ console.error('앱 폴더가 없음: apps/' + app); process.exit(1); }
const SKIP = new Set(['android', 'docs', 'resources.example.js', '.DS_Store']);
function copy(from, to, skip = new Set()){
  const st = fs.statSync(from);
  if (st.isDirectory()){
    fs.mkdirSync(to, { recursive:true });
    for (const n of fs.readdirSync(from)) if (!skip.has(n)) copy(path.join(from, n), path.join(to, n));
  } else fs.copyFileSync(from, to);
}
fs.rmSync(OUT, { recursive:true, force:true });
copy(SRC, OUT, SKIP);
copy(path.join(ROOT, 'core'), path.join(OUT, 'core'), new Set(['README.md']));
const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
for (const name of new Set([...html.matchAll(/\.\.\/\.\.\/characters\/([\w-]+)\//g)].map(m => m[1])))   // 이 앱이 쓰는 캐릭터만
  copy(path.join(ROOT, 'characters', name, 'js'), path.join(OUT, 'characters', name, 'js'));
fs.copyFileSync(path.join(ROOT, 'LICENSE'), path.join(OUT, 'LICENSE'));
let n = 0;
(function fix(dir){
  for (const f of fs.readdirSync(dir)){
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()){ fix(p); continue; }
    n++;
    if (!/\.(html|js|css|json)$/.test(f)) continue;
    const s = fs.readFileSync(p, 'utf8'), t = s.replace(/\.\.\/\.\.\/(core|characters)\//g, '$1/');
    if (t !== s) fs.writeFileSync(p, t);
  }
})(OUT);
fs.writeFileSync(path.join(OUT, '_headers'), '/.well-known/assetlinks.json\n  Content-Type: application/json\n');
console.log(`dist/ 준비 끝 (${app}): 파일 ${n + 1}개`);
